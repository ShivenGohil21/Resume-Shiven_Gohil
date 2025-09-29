# PDF Data Extractor - Frontend

A modern React frontend application for extracting structured data from PDF documents using AI-powered processing.

## Features

- 🎯 **Drag & Drop Interface** - Easy file upload with visual feedback
- 📊 **Data Visualization** - Clean table display of extracted information  
- 💾 **JSON Export** - Download extracted data in JSON format
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Real-time Feedback** - Live upload status and error handling
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Dropzone** - Drag and drop file upload
- **Axios** - HTTP client for API requests
- **File Saver** - Client-side file downloads
- **Lucide React** - Beautiful icons

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── FileDropzone.jsx    # Drag & drop file upload component
│   ├── DataTable.jsx       # Table for displaying extracted data
│   ├── ExportButton.jsx    # JSON export functionality
│   └── StatusMessage.jsx   # Status and error messages
├── services/
│   └── api.js             # API client configuration
├── App.jsx                # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles and Tailwind imports
```

## API Integration

The frontend connects to a backend API running on `http://localhost:5000`. The main endpoint used is:

- `POST /upload` - Upload PDF file and receive extracted data

### Expected API Response Format

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com", 
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"]
  }
}
```

## Component Overview

### FileDropzone
- Accepts only PDF files (single file)
- Visual drag & drop interface
- Upload progress indication
- Error handling for invalid files

### DataTable  
- Responsive table layout
- Icon-based column headers
- Special formatting for skills (badges) and contact info (links)
- Empty state with helpful message

### ExportButton
- Downloads data as formatted JSON
- Includes metadata (timestamp, record count)
- Disabled state when no data available

### StatusMessage
- Success, error, warning, and info message types
- Dismissible notifications
- Consistent styling with icons

## Customization

### Styling
The app uses Tailwind CSS with custom utility classes defined in `index.css`:
- `.btn-primary` / `.btn-secondary` - Button styles
- `.card` - Card container style  
- `.dropzone` - Drag and drop area with active/reject states

### API Configuration
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url';
```

## Development

### Available Scripts
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Features
- Hot module replacement
- Automatic browser refresh
- Source maps for debugging
- Development proxy to backend API

## Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Responsive table with horizontal scroll
- Adaptive grid layouts
- Touch-friendly interactions

## Error Handling

- Network error handling
- File validation (PDF only)
- User-friendly error messages
- Graceful degradation

## Future Enhancements

- Multiple file upload support
- Batch processing
- Data filtering and search
- Export to other formats (CSV, Excel)
- Dark mode support
- Drag & drop reordering of results

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Performance

- Code splitting with Vite
- Optimized bundle size
- Lazy loading of components
- Efficient re-rendering with React hooks

---

**Note**: Make sure your backend server is running on `http://localhost:5000` before starting the frontend application.