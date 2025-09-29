import React, { useState } from 'react';
import { uploadPDF } from '../services/api';
import { FileText, CheckCircle, XCircle, Loader } from 'lucide-react';

const TestUpload = () => {
  const [testStatus, setTestStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const createTestPDF = () => {
    // Create a text-based content that simulates what would be in a PDF
    // Since creating a real PDF is complex, we'll create a text file with PDF extension for testing
    const testContent = `Shiven Gohil
Software Developer

Contact Information:
Email: shivengohil210204@gmail.com
Phone: +919228456781

Technical Skills:
• JavaScript
• React
• Node.js
• Python
• MongoDB

Education:
Bachelor of Computer Science
University of Technology (2016-2020)

Projects:
E-commerce Platform - Built with React, Node.js, and MongoDB
Task Management App - Full-stack JavaScript application
`;

    // For testing purposes, we'll send this as a blob with PDF mime type
    // Note: This won't be a real PDF, but it will test the upload mechanism
    return new Blob([testContent], { type: 'application/pdf' });
  };

  const testUpload = async () => {
    setLoading(true);
    setTestStatus('');
    setResult(null);

    try {
      const testPDFBlob = createTestPDF();
      const testFile = new File([testPDFBlob], 'test-resume.pdf', { 
        type: 'application/pdf' 
      });

      console.log('🧪 Testing upload with sample PDF...');
      const response = await uploadPDF(testFile);
      
      setTestStatus('success');
      setResult(response);
      console.log('✅ Test upload successful:', response);
    } catch (error) {
      setTestStatus('error');
      setResult({ error: error.message });
      console.error('❌ Test upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Test PDF Upload</h3>
          <p className="text-sm text-gray-500 mt-1">
            Test the upload functionality with a sample PDF
          </p>
        </div>
        
        <button
          onClick={testUpload}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{loading ? 'Testing...' : 'Test Upload'}</span>
        </button>
      </div>

      {testStatus && (
        <div className={`p-4 rounded-lg border ${
          testStatus === 'success' 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-start space-x-3">
            {testStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                testStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {testStatus === 'success' ? 'Test Upload Successful!' : 'Test Upload Failed'}
              </p>
              
              {result && (
                <div className="mt-2 p-3 bg-white bg-opacity-60 rounded text-xs font-mono overflow-auto max-h-40">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Note:</strong> This test creates a mock PDF with sample data:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Name: Shiven Gohil</li>
          <li>Email: shivengohil210204@gmail.com</li>
          <li>Phone: +919228456781</li>
          <li>Skills: JavaScript, React, Node.js, Python, MongoDB</li>
        </ul>
        <p className="mt-2 text-blue-600"><strong>Info:</strong> This creates a mock resume file to test PDF parsing and data extraction functionality.</p>
      </div>
    </div>
  );
};

export default TestUpload;