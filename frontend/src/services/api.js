import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Request config:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const uploadPDF = async (file) => {
  try {
    console.log('📄 Uploading PDF file:', file.name, file.size, 'bytes');
    
    const formData = new FormData();
    formData.append('file', file); // Changed from 'pdf' to 'file' to match backend
    
    // Log FormData contents
    console.log('📦 FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`📊 Upload Progress: ${percentCompleted}%`);
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    
    // Enhanced error handling
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running. Please start the server on http://localhost:5000');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Upload failed';
      throw new Error(`Server Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Upload failed');
    }
  }
};

// Test function for basic connectivity
export const testConnection = async () => {
  try {
    console.log('🔍 Testing basic connectivity...');
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    console.log('✅ Connection test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export default api;