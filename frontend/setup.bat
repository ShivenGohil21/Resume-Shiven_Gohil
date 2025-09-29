@echo off
echo 🚀 Setting up PDF Extractor Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📄 Creating environment file...
    (
        echo # Backend API URL
        echo VITE_API_URL=http://localhost:5000
        echo.
        echo # Development settings  
        echo VITE_NODE_ENV=development
    ) > .env
    echo ✅ Environment file created
)

echo.
echo 🎉 Setup complete! You can now run:
echo.
echo   npm run dev     # Start development server
echo   npm run build   # Build for production  
echo   npm run preview # Preview production build
echo.
echo 📋 Make sure your backend server is running on http://localhost:5000
echo.
pause