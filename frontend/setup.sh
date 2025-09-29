#!/bin/bash

echo "🚀 Setting up PDF Extractor Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating environment file..."
    cat > .env << EOL
# Backend API URL
VITE_API_URL=http://localhost:5000

# Development settings
VITE_NODE_ENV=development
EOL
    echo "✅ Environment file created"
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo ""
echo "  npm run dev     # Start development server"
echo "  npm run build   # Build for production"
echo "  npm run preview # Preview production build"
echo ""
echo "📋 Make sure your backend server is running on http://localhost:5000"
echo ""