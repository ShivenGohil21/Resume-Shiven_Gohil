import React, { useState } from 'react';
import FileDropzone from './components/FileDropzone';
import DataTable from './components/DataTable';
import ExportButton from './components/ExportButton';
import StatusMessage from './components/StatusMessage';
import ConnectionTest from './components/ConnectionTest';
import TestUpload from './components/TestUpload';
import { uploadPDF } from './services/api';
import { FileText, Zap, Download } from 'lucide-react';

function App() {
  const [extractedData, setExtractedData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [currentFileName, setCurrentFileName] = useState('');
  const [showConnectionTest, setShowConnectionTest] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setStatus({ type: '', message: '' });
    setCurrentFileName(file.name);

    try {
      console.log('🔄 Starting upload for file:', file.name);
      const response = await uploadPDF(file);
      
      console.log('📥 Full backend response:', response);

      // Handle the response structure from backend
      let dataToSet = [];
      
      if (response.success && response.data) {
        // Backend sends: { success: true, data: {...}, filename: '...', nameValidation: {...} }
        const backendData = response.data;
        
        // Create the record with all necessary fields
        dataToSet = [{
          id: 0,
          name: backendData.name || 'N/A',
          email: backendData.email || 'N/A', 
          phone: backendData.phone || 'N/A',
          skills: backendData.skills || [],
          filename: response.filename || file.name,
          nameValidation: response.nameValidation
        }];
      } else {
        // Fallback for unexpected response structure
        console.warn('⚠️ Unexpected response structure:', response);
        dataToSet = [{
          id: 0,
          name: response.name || 'N/A',
          email: response.email || 'N/A',
          phone: response.phone || 'N/A', 
          skills: response.skills || [],
          filename: file.name
        }];
      }

      console.log('📊 Processed data for display:', dataToSet);
      setExtractedData(dataToSet);
      
      // Create success message with validation info
      let successMessage = `Successfully extracted data from ${file.name}! Found ${dataToSet.length} record(s).`;
      if (response.nameValidation) {
        if (response.nameValidation.nameMatchesFilename) {
          successMessage += ` ✅ Name matches filename.`;
        } else {
          successMessage += ` ⚠️ Name doesn't match filename (${response.nameValidation.extractedName} vs ${response.nameValidation.filenameWithoutExtension}).`;
        }
      }
      
      setStatus({
        type: response.nameValidation?.nameMatchesFilename ? 'success' : 'warning',
        message: successMessage
      });
    } catch (error) {
      console.error('❌ Upload error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Failed to process the PDF. Please try again.'
      });
      setExtractedData([]);
    } finally {
      setIsUploading(false);
    }
  };

  const clearStatus = () => {
    setStatus({ type: '', message: '' });
  };

  const handleNewUpload = () => {
    setExtractedData([]);
    setStatus({ type: '', message: '' });
    setCurrentFileName('');
  };

  const handleConnectionTestComplete = (success) => {
    setConnectionStatus(success);
    if (success) {
      setStatus({
        type: 'success',
        message: 'Connection test passed! You can now upload PDF files.'
      });
    } else {
      setStatus({
        type: 'error',
        message: 'Connection test failed. Please check if the backend server is running on http://localhost:5000'
      });
    }
  };

  const toggleConnectionTest = () => {
    setShowConnectionTest(!showConnectionTest);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PDF Data Extractor</h1>
                <p className="text-sm text-gray-500">Extract structured data from PDF documents</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">AI Powered</span>
              </div>
              
              <button
                onClick={toggleConnectionTest}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showConnectionTest ? 'Hide' : 'Show'} Connection Test
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Connection Test */}
          {showConnectionTest && (
            <>
              <ConnectionTest onTestComplete={handleConnectionTestComplete} />
              <TestUpload />
            </>
          )}

          {/* Status Message */}
          {status.message && (
            <StatusMessage
              type={status.type}
              message={status.message}
              onClose={clearStatus}
            />
          )}

          {/* Upload Section */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload PDF Document</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a PDF file to extract personal information and skills
                </p>
              </div>
              
              {extractedData.length > 0 && (
                <button
                  onClick={handleNewUpload}
                  className="btn-secondary text-sm"
                >
                  Upload New File
                </button>
              )}
            </div>
            
            <FileDropzone
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
              error={status.type === 'error' ? status.message : ''}
            />
          </div>

          {/* Results Section */}
          {(extractedData.length > 0 || isUploading) && (
            <div className="space-y-6">
              {/* Data Table */}
              <DataTable data={extractedData} />

              {/* Export Section */}
              {extractedData.length > 0 && (
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Download the extracted data as a JSON file
                      </p>
                    </div>
                    
                    <ExportButton 
                      data={extractedData} 
                      filename={`pdf-extraction-${currentFileName.replace('.pdf', '')}`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {extractedData.length === 0 && !isUploading && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">1. Upload PDF</h4>
                  <p className="text-sm text-gray-600">
                    Drag and drop your PDF file or click to browse
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">2. AI Processing</h4>
                  <p className="text-sm text-gray-600">
                    Our AI extracts structured data from your document
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">3. Export Results</h4>
                  <p className="text-sm text-gray-600">
                    View and download the extracted data as JSON
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 PDF Data Extractor. Built with React, Tailwind CSS, and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;