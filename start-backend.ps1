# VegaKash.AI - Start Backend Server
# Starts the backend with OpenAI API key from .env

$backendPath = "C:\Users\pc\OneDrive\Documents\Webtool\VegaKash.AI\backend"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 VegaKash.AI Backend - Starting" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $backendPath

Write-Host "📍 Backend Path: $backendPath" -ForegroundColor Gray
Write-Host "🔑 Loading API Key from .env file..." -ForegroundColor Yellow
Write-Host ""

# Start the backend
& "$backendPath\venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000

Write-Host ""
Write-Host "Backend stopped." -ForegroundColor Red
