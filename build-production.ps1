# Production Build Script for VegaKash.AI
# Run this before deploying to Hostinger

Write-Host "`n🚀 VegaKash.AI - Production Build`n" -ForegroundColor Cyan

# Step 1: Build Frontend
Write-Host "📦 Step 1: Building Frontend..." -ForegroundColor Yellow
Set-Location "frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing dependencies..." -ForegroundColor Gray
    npm install
}

Write-Host "   Building for production..." -ForegroundColor Gray
npm run build

if (Test-Path "dist") {
    Write-Host "   ✅ Frontend built successfully!" -ForegroundColor Green
    Write-Host "   📁 Location: frontend/dist/" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Build failed!" -ForegroundColor Red
    exit 1
}

Set-Location ".."

# Step 2: Prepare Backend
Write-Host "`n📦 Step 2: Preparing Backend..." -ForegroundColor Yellow

if (-not (Test-Path "backend/.env")) {
    Write-Host "   ⚠️  WARNING: backend/.env not found!" -ForegroundColor Red
    Write-Host "   Create .env file with your OpenAI API key before deploying" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ .env file present" -ForegroundColor Green
}

Write-Host "   ✅ Backend files ready!" -ForegroundColor Green
Write-Host "   📁 Location: backend/" -ForegroundColor Gray

# Step 3: Check Configuration
Write-Host "`n⚙️  Step 3: Checking Configuration..." -ForegroundColor Yellow

$configFile = "frontend/src/config.js"
$configContent = Get-Content $configFile -Raw

if ($configContent -match "production:\s*'https://yourdomain\.com'") {
    Write-Host "   ⚠️  WARNING: Update production URL in frontend/src/config.js!" -ForegroundColor Red
    Write-Host "   Current: https://yourdomain.com" -ForegroundColor Gray
    Write-Host "   Change to your actual domain, then rebuild!" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Production URL configured" -ForegroundColor Green
}

# Step 4: Create Deployment Packages
Write-Host "`n📦 Step 4: Creating Deployment Packages..." -ForegroundColor Yellow

# Frontend package
if (Test-Path "vegakash-frontend.zip") {
    Remove-Item "vegakash-frontend.zip" -Force
}
Compress-Archive -Path "frontend/dist/*" -DestinationPath "vegakash-frontend.zip"
Write-Host "   ✅ Frontend package: vegakash-frontend.zip" -ForegroundColor Green

# Backend package
if (Test-Path "vegakash-backend.zip") {
    Remove-Item "vegakash-backend.zip" -Force
}

$backendFiles = @(
    "backend/*.py",
    "backend/services",
    "backend/requirements-prod.txt",
    "backend/gunicorn_config.py",
    "backend/start.sh",
    "backend/start.ps1",
    "backend/.env.example"
)

Compress-Archive -Path $backendFiles -DestinationPath "vegakash-backend.zip" -Force
Write-Host "   ✅ Backend package: vegakash-backend.zip" -ForegroundColor Green

# Summary
Write-Host "`n✅ Production Build Complete!`n" -ForegroundColor Green

Write-Host "📦 Deployment Packages Created:" -ForegroundColor Cyan
Write-Host "   1. vegakash-frontend.zip (upload to public_html/)" -ForegroundColor White
Write-Host "   2. vegakash-backend.zip (upload to ~/vegakash-backend/)" -ForegroundColor White

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Review DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "   2. Update production URL in frontend/src/config.js if needed" -ForegroundColor White
Write-Host "   3. Follow HOSTINGER_DEPLOYMENT.md for complete guide" -ForegroundColor White
Write-Host "   4. Upload packages to your Hostinger server" -ForegroundColor White
Write-Host "   5. Create .env file on server with your API key" -ForegroundColor White

Write-Host "`n⚠️  Remember:" -ForegroundColor Yellow
Write-Host "   - NEVER upload .env file to git" -ForegroundColor White
Write-Host "   - Create .env file directly on server" -ForegroundColor White
Write-Host "   - Use different API keys for dev and production" -ForegroundColor White

Write-Host ""
