# Production startup script for VegaKash.AI Backend (Windows/PowerShell)

Write-Host "🚀 Starting VegaKash.AI Backend (Production)" -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with your OPENAI_API_KEY" -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.+)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        Write-Host "✅ Loaded: $($matches[1])" -ForegroundColor Green
    }
}

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
& .\venv\Scripts\Activate.ps1

# Install/upgrade dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
python -m pip install --upgrade pip
python -m pip install -r requirements-prod.txt

# Get port from environment or use default
$port = $env:PORT
if (-not $port) {
    $port = "8000"
}

# Start the server
Write-Host "✅ Starting server on port $port..." -ForegroundColor Green
python -m uvicorn main:app --host 0.0.0.0 --port $port
