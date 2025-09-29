# Backend API

A Node.js/Express backend for PDF text extraction with modular MVC architecture.

## Project Structure

```
backend/
├── config/
│   └── config.js          # App configuration
├── controllers/
│   └── uploadController.js # Business logic
├── middleware/
│   └── uploadMiddleware.js # File upload handling
├── routes/
│   └── uploadRoutes.js    # Route definitions
├── utils/
│   └── parsingHelpers.js  # Resume parsing utilities
├── server.js              # Main server file
└── package.json
```

## Features

- PDF file upload and text extraction
- **Structured resume parsing** with regex-based field extraction
- **Skills matching** against predefined skills list
- CORS enabled for cross-origin requests
- File size validation (10MB limit)
- Modular MVC architecture
- Comprehensive error handling
- **Automatic file cleanup** after processing

## Installation

```bash
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### GET /
Returns API status
```json
{
  "message": "API running"
}
```

### POST /upload
Upload a PDF resume and extract structured data

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: PDF file (field name: 'file')

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "johndoe@email.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node", "MongoDB"]
  },
  "metadata": {
    "pages": 2,
    "textLength": 1250,
    "extractedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
{
  "error": "No PDF file uploaded"
}
```

```json
{
  "error": "No structured data found in PDF",
  "message": "Could not extract name, email, phone, or skills from the document"
}
```

## Environment Variables

Create a `.env` file in the root directory:
```
PORT=5000
```

## Dependencies

- **express**: Web framework
- **multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart (dev dependency)
