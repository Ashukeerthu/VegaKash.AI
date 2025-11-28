# VegaKash.AI Setup and Run Script
# Run this script to set up and start the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   VegaKash.AI - Setup & Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found. Please install Python 3.10 or higher." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 18 or higher." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if virtual environment exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv backend\venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment and install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
& backend\venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Install frontend dependencies
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
} else {
    Write-Host "✓ Frontend dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Environment Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check for OpenAI API key
if (-not $env:OPENAI_API_KEY) {
    Write-Host "⚠ OPENAI_API_KEY not set!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please set your OpenAI API key:" -ForegroundColor White
    Write-Host '  $env:OPENAI_API_KEY="your-api-key-here"' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Get your API key from: https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Do you want to set it now? (y/n)"
    
    if ($response -eq "y" -or $response -eq "Y") {
        $apiKey = Read-Host "Enter your OpenAI API key"
        $env:OPENAI_API_KEY = $apiKey
        Write-Host "✓ API key set for this session" -ForegroundColor Green
    } else {
        Write-Host "⚠ Skipping... You'll need to set it before generating AI plans" -ForegroundColor Yellow
    }
} else {
    $maskedKey = $env:OPENAI_API_KEY.Substring(0, [Math]::Min(10, $env:OPENAI_API_KEY.Length)) + "..."
    Write-Host "✓ OPENAI_API_KEY is set ($maskedKey)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor White
Write-Host "API docs will be available at: http://localhost:8000/api/docs" -ForegroundColor White
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; & backend\venv\Scripts\Activate.ps1; uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

# Wait a bit for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor White
Write-Host ""

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Both servers are starting in separate windows." -ForegroundColor White
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor White
Write-Host "  → Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  → Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "  → API Docs: http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the servers, close the terminal windows or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy financial planning! 💰" -ForegroundColor Green
