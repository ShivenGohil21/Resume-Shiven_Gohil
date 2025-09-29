const pdfParse = require('pdf-parse');
const { parseResumeData } = require('../utils/parsingHelpers');

// Upload controller for PDF text extraction and parsing
const uploadPDF = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Headers:', req.headers);
    console.log('File:', req.file ? 'Present' : 'Missing');
    console.log('Body keys:', Object.keys(req.body));
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ error: 'No PDF file uploaded. Please use field name "file" for upload.' });
    }

    console.log('Processing PDF file...');
    // Extract text from PDF
    const pdfBuffer = req.file.buffer;
    let pdfData;
    let extractedText = '';
    
    try {
      pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text;
      console.log('PDF parsed successfully, text length:', extractedText.length);
    } catch (parseError) {
      console.log('PDF parsing failed, trying as plain text:', parseError.message);
      // If PDF parsing fails, try to read as plain text (useful for testing)
      try {
        extractedText = pdfBuffer.toString('utf8');
        console.log('Fallback: Read as plain text, length:', extractedText.length);
        pdfData = { text: extractedText, numpages: 1 };
      } catch (textError) {
        console.error('Both PDF and text parsing failed:', textError.message);
        throw new Error('Unable to extract text from the uploaded file');
      }
    }
    
    // Parse the extracted text for structured data
    const parsedData = parseResumeData(extractedText);
    
    console.log('Parsed data:', parsedData);
    
    // Compare filename with extracted name for validation
    const originalFilename = req.file.originalname;
    const filenameWithoutExtension = originalFilename.replace(/\.[^/.]+$/, ''); // Remove extension
    const normalizedFilename = filenameWithoutExtension.replace(/[_-]/g, ' ').trim().toLowerCase();
    const extractedName = (parsedData.name || '').trim().toLowerCase();
    
    // Check if names match (allowing for partial matches)
    const nameMatchesFilename = extractedName && (
      normalizedFilename.includes(extractedName) || 
      extractedName.includes(normalizedFilename) ||
      normalizedFilename === extractedName
    );
    
    console.log('Filename analysis:', {
      originalFilename,
      normalizedFilename,
      extractedName,
      nameMatchesFilename
    });
    
    // Check if any data was extracted
    const hasData = parsedData.name || parsedData.email || parsedData.phone || parsedData.skills.length > 0;
    
    if (!hasData) {
      return res.status(400).json({ 
        error: 'No structured data found in PDF',
        message: 'Could not extract name, email, phone, or skills from the document'
      });
    }
    
    // Return structured JSON response
    res.json({
      success: true,
      data: parsedData,
      filename: originalFilename,
      nameValidation: {
        extractedName: parsedData.name,
        filenameWithoutExtension,
        normalizedFilename,
        nameMatchesFilename,
        matchConfidence: nameMatchesFilename ? 'high' : 'low'
      },
      metadata: {
        pages: pdfData.numpages || 1,
        textLength: extractedText.length,
        extractedAt: new Date().toISOString(),
        extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : '') // First 500 chars for debugging
      }
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error processing PDF file',
      details: error.message 
    });
  }
};

// Root controller
const getRoot = (req, res) => {
  res.json({ message: 'API running' });
};

module.exports = {
  uploadPDF,
  getRoot
};
