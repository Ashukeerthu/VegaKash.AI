# VegaKash.AI - Start Backend and Frontend Servers
# This script starts both the backend (port 8000) and frontend (port 3000)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 VegaKash.AI - Starting Servers" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables for backend
$env:OPENAI_API_KEY = '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'
$env:OPENAI_MODEL = 'gpt-4o-mini'

# Function to start backend
function Start-Backend {
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
    $backendPath = "C:\Users\pc\OneDrive\Documents\Webtool\VegaKash.AI\backend"
    Set-Location $backendPath
    Write-Host "Backend Path: $backendPath" -ForegroundColor Gray
    Write-Host "API Key Status: $(if ($env:OPENAI_API_KEY) { '✅ SET' } else { '❌ NOT SET' })" -ForegroundColor $(if ($env:OPENAI_API_KEY) { 'Green' } else { 'Red' })
    Write-Host ""
    
    # Run backend
    & "$backendPath\venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000
}

# Function to start frontend
function Start-Frontend {
    Write-Host "⚛️  Starting Frontend Server..." -ForegroundColor Yellow
    $frontendPath = "C:\Users\pc\OneDrive\Documents\Webtool\VegaKash.AI\frontend"
    Set-Location $frontendPath
    Write-Host "Frontend Path: $frontendPath" -ForegroundColor Gray
    Write-Host ""
    
    # Run frontend
    npm run dev
}

# Start servers in parallel
Write-Host "📡 Starting all servers..." -ForegroundColor Cyan
Write-Host ""

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    param($apiKey, $model, $backendPath)
    $env:OPENAI_API_KEY = $apiKey
    $env:OPENAI_MODEL = $model
    Set-Location $backendPath
    & "$backendPath\venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000
} -ArgumentList $env:OPENAI_API_KEY, $env:OPENAI_MODEL, "C:\Users\pc\OneDrive\Documents\Webtool\VegaKash.AI\backend"

# Wait a bit for backend to start
Start-Sleep -Seconds 2

# Start frontend in new window
$frontendPath = "C:\Users\pc\OneDrive\Documents\Webtool\VegaKash.AI\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev"

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Servers Started Successfully!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the backend (frontend will run in separate window)" -ForegroundColor Yellow

# Keep backend running
$backendJob | Wait-Job
