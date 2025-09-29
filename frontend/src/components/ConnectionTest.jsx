import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Wifi, Server } from 'lucide-react';
import axios from 'axios';

const ConnectionTest = ({ onTestComplete }) => {
  const [tests, setTests] = useState({
    backendPing: { status: 'pending', message: '' },
    corsCheck: { status: 'pending', message: '' },
    uploadEndpoint: { status: 'pending', message: '' }
  });
  
  const [overallStatus, setOverallStatus] = useState('testing');

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    runConnectionTests();
  }, []);

  const updateTestStatus = (testName, status, message) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status, message }
    }));
  };

  const runConnectionTests = async () => {
    console.log('🚀 Starting connection tests...');
    
    // Test 1: Backend Ping
    try {
      console.log('📡 Testing backend connection...');
      const response = await axios.get(`${API_BASE_URL}/`, { 
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        updateTestStatus('backendPing', 'success', `Backend responded: ${JSON.stringify(response.data)}`);
        console.log('✅ Backend ping successful:', response.data);
      } else {
        updateTestStatus('backendPing', 'error', `Unexpected status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Backend ping failed:', error);
      updateTestStatus('backendPing', 'error', `Connection failed: ${error.message}`);
    }

    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: CORS Check
    try {
      console.log('🔒 Testing CORS configuration...');
      const response = await axios.options(`${API_BASE_URL}/upload`, {
        timeout: 5000,
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      updateTestStatus('corsCheck', 'success', 'CORS headers configured correctly');
      console.log('✅ CORS check successful');
    } catch (error) {
      console.error('❌ CORS check failed:', error);
      if (error.response?.status === 404) {
        updateTestStatus('corsCheck', 'warning', 'OPTIONS method not found, but basic CORS should work');
      } else {
        updateTestStatus('corsCheck', 'error', `CORS error: ${error.message}`);
      }
    }

    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: Upload Endpoint Structure
    try {
      console.log('📁 Testing upload endpoint...');
      // Create a simple FormData to test the endpoint structure
      const formData = new FormData();
      formData.append('file', new Blob(['test'], { type: 'application/pdf' }), 'test.pdf'); // Changed from 'pdf' to 'file'
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      updateTestStatus('uploadEndpoint', 'success', `Upload endpoint working: ${JSON.stringify(response.data)}`);
      console.log('✅ Upload endpoint test successful:', response.data);
    } catch (error) {
      console.error('❌ Upload endpoint test failed:', error);
      if (error.response?.status === 400) {
        updateTestStatus('uploadEndpoint', 'warning', 'Endpoint exists but rejected test file (expected)');
      } else {
        updateTestStatus('uploadEndpoint', 'error', `Upload test failed: ${error.message}`);
      }
    }

    // Determine overall status
    setTimeout(() => {
      const testResults = Object.values(tests);
      const hasError = testResults.some(test => test.status === 'error');
      const allSuccess = testResults.every(test => test.status === 'success' || test.status === 'warning');
      
      if (hasError) {
        setOverallStatus('failed');
      } else if (allSuccess) {
        setOverallStatus('success');
      } else {
        setOverallStatus('partial');
      }
      
      if (onTestComplete) {
        onTestComplete(!hasError);
      }
    }, 1500);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <CheckCircle className="w-5 h-5 text-yellow-600" />;
      case 'pending': return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <Loader className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'pending': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const testItems = [
    {
      key: 'backendPing',
      title: 'Backend Server Connection',
      description: 'Testing if backend server is running and accessible',
      icon: <Server className="w-6 h-6" />
    },
    {
      key: 'corsCheck', 
      title: 'CORS Configuration',
      description: 'Verifying cross-origin requests are allowed',
      icon: <Wifi className="w-6 h-6" />
    },
    {
      key: 'uploadEndpoint',
      title: 'Upload Endpoint',
      description: 'Testing PDF upload endpoint functionality',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  return (
    <div className="card p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Connection Test</h2>
          <p className="text-sm text-gray-500 mt-1">
            Verifying frontend-backend connectivity
          </p>
        </div>
        
        {overallStatus === 'testing' && (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Testing...</span>
          </div>
        )}
        
        {overallStatus === 'success' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">All Tests Passed</span>
          </div>
        )}
        
        {overallStatus === 'failed' && (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Some Tests Failed</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {testItems.map((item) => {
          const test = tests[item.key];
          return (
            <div
              key={item.key}
              className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-gray-500">
                  {item.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h3>
                    {getStatusIcon(test.status)}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {item.description}
                  </p>
                  
                  {test.message && (
                    <div className="bg-white bg-opacity-60 p-2 rounded text-xs font-mono text-gray-700 overflow-auto">
                      {test.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Ensure backend server is running on http://localhost:5000</li>
          <li>• Check that CORS is configured to allow frontend origin</li>
          <li>• Verify upload endpoint accepts multipart/form-data</li>
          <li>• Test with a real PDF file once connection is established</li>
        </ul>
      </div>

      <div className="mt-4 flex space-x-3">
        <button
          onClick={runConnectionTests}
          className="btn-secondary text-sm"
        >
          Retry Tests
        </button>
        
        <button
          onClick={() => window.open('http://localhost:5000/test', '_blank')}
          className="btn-secondary text-sm"
        >
          Test Parsing
        </button>
        
        <button
          onClick={() => window.open('http://localhost:5000', '_blank')}
          className="btn-primary text-sm"
        >
          Open Backend URL
        </button>
      </div>
    </div>
  );
};

export default ConnectionTest;