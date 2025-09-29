# PDF Data Extractor - Connection Testing Guide

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd backend
npm start
```
Backend should be running on: http://localhost:5000

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend should be running on: http://localhost:3000

## 🧪 Testing the Connection

### Connection Test Results Expected:
1. ✅ **Backend Server Connection**: Should show "API running" response
2. ✅ **CORS Configuration**: Should pass with proper headers
3. ✅ **Upload Endpoint**: Should accept test file upload

### Fixed Issues:
1. **Field Name Mismatch**: Changed frontend to send `file` instead of `pdf` 
2. **CORS Configuration**: Added proper origins and headers
3. **OPTIONS Handling**: Added explicit preflight request handling
4. **Error Messages**: Enhanced debugging and error reporting

## 📋 Testing Checklist

### Backend Tests:
- [ ] Server starts without errors
- [ ] GET / returns {"message":"API running"}
- [ ] POST /upload accepts multipart/form-data
- [ ] Field name "file" is expected for uploads
- [ ] PDF parsing works correctly

### Frontend Tests:
- [ ] Connection test passes all checks
- [ ] File dropzone accepts PDF files
- [ ] Upload progress indicator works
- [ ] Results display in table format
- [ ] JSON export functionality works
- [ ] Error handling displays properly

### Integration Tests:
- [ ] Test Upload component works with sample PDF
- [ ] Real PDF file upload and parsing
- [ ] Data extraction results are accurate
- [ ] CORS allows frontend-backend communication

## 🔧 API Endpoints

### GET /
Returns server status
```json
{"message":"API running"}
```

### POST /upload
Uploads PDF file and extracts data
- Field name: `file`
- Content-Type: `multipart/form-data`
- File type: `application/pdf`
- Max size: 10MB

Expected Response:
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"]
  },
  "filename": "John_Doe_Resume.pdf",
  "nameValidation": {
    "extractedName": "John Doe",
    "filenameWithoutExtension": "John_Doe_Resume",
    "normalizedFilename": "john doe resume",
    "nameMatchesFilename": true,
    "matchConfidence": "high"
  }
}
```

## 🐛 Troubleshooting

### CORS Issues:
- Ensure backend allows http://localhost:3000 origin
- Check browser console for CORS errors
- OPTIONS requests should return 200 status

### Upload Issues:
- Verify field name is "file" not "pdf"
- Check file size is under 10MB
- Ensure Content-Type is multipart/form-data
- PDF files only are accepted

### Parsing Issues:
- Check PDF contains extractable text
- Verify parsing patterns match your PDF format
- Skills must be in the predefined skills list

## 🎯 New Feature: Filename-Name Validation

The system now automatically validates if the extracted name matches the uploaded filename:

### How it works:
1. **Upload a file**: e.g., `Shiven_Gohil.pdf`
2. **Extract name from resume**: e.g., "Shiven Gohil"
3. **Compare names**: 
   - Normalize filename: `Shiven_Gohil` → `shiven gohil`
   - Compare with extracted name: `shiven gohil`
4. **Show validation result**: ✅ Match or ❌ No match

### Examples:
- ✅ `John_Doe.pdf` with name "John Doe" = Match
- ✅ `jane-smith-resume.pdf` with name "Jane Smith" = Match  
- ❌ `resume.pdf` with name "John Doe" = No match
- ❌ `John_Doe.pdf` with name "Jane Smith" = No match

## 📊 Sample Test Data

Use the **Test Upload** button to test with this sample data:
- Name: John Doe
- Email: john.doe@example.com
- Phone: +1234567890
- Skills: JavaScript, React, Node.js

## 🔍 Debug Information

### Backend Logs:
```
Server is running on port 5000
Upload request received
File: Present
Processing PDF file...
PDF parsed successfully
Parsed data: {...}
```

### Frontend Console:
```
🚀 API Request: POST /upload
📄 Uploading PDF file: test.pdf 1234 bytes
📊 Upload Progress: 100%
✅ API Response: 200 /upload
```

## ✅ Success Indicators

When everything is working correctly:
1. Both servers start without errors
2. Connection test shows all green checkmarks
3. Test upload returns parsed data
4. Real PDF files can be uploaded and processed
5. Data appears in the table correctly
6. JSON export downloads properly

## 📞 Support

If you encounter issues:
1. Check the console logs in both frontend and backend
2. Verify all dependencies are installed
3. Ensure both servers are running on correct ports
4. Test with the sample upload first before using real PDFs