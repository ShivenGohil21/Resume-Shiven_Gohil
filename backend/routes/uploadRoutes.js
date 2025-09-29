const express = require('express');
const router = express.Router();
const { uploadPDF, getRoot } = require('../controllers/uploadController');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Root route
router.get('/', getRoot);

// Test route for debugging - UPDATED VERSION


router.get('/test', (req, res) => {
  const { parseResumeData } = require('../utils/parsingHelpers');
  
  // Force clear any cached modules
  delete require.cache[require.resolve('../utils/parsingHelpers')];
  const { parseResumeData: freshParseResumeData } = require('../utils/parsingHelpers');
  
  const testText = `Shiven Gohil
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

  const parsed = freshParseResumeData(testText);
  console.log('TEST ENDPOINT CALLED - Current data:', testText.substring(0, 20) + '...');
  console.log('Parsed result:', parsed);
  
  res.json({
    success: true,
    testText: testText,
    parsedData: parsed,
    timestamp: new Date().toISOString()
  });
});

// Handle OPTIONS preflight requests
router.options('/upload', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Upload route for PDF text extraction
router.post('/upload', upload.single('file'), handleUploadError, uploadPDF);

module.exports = router;
