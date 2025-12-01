# Domain Configuration Verification Script (PowerShell)
# VegaKash.AI - vegaktools.com

Write-Host "🔍 Verifying Production Domain Configuration..." -ForegroundColor Cyan
Write-Host "Domain: https://vegaktools.com" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$PASSED = 0
$FAILED = 0

function Test-FileContent {
    param(
        [string]$FilePath,
        [string]$SearchTerm,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match [regex]::Escape($SearchTerm)) {
            Write-Host "✅ PASS: $Description" -ForegroundColor Green
            $script:PASSED++
        } else {
            Write-Host "❌ FAIL: $Description" -ForegroundColor Red
            Write-Host "   File: $FilePath" -ForegroundColor Gray
            Write-Host "   Expected: $SearchTerm" -ForegroundColor Gray
            $script:FAILED++
        }
    } else {
        Write-Host "⚠️  SKIP: File not found: $FilePath" -ForegroundColor Yellow
    }
}

Write-Host "1️⃣  Frontend Configuration" -ForegroundColor White
Write-Host "------------------------" -ForegroundColor Gray
Test-FileContent "frontend\src\config.js" "vegaktools.com" "Frontend production URL"
Test-FileContent "frontend\.env.production" "VITE_API_URL=https://vegaktools.com" "Frontend environment variable"
Write-Host ""

Write-Host "2️⃣  Backend Configuration" -ForegroundColor White
Write-Host "------------------------" -ForegroundColor Gray
Test-FileContent "backend\main.py" "https://vegaktools.com" "Backend CORS origin"
Test-FileContent "backend\main.py" "https://www.vegaktools.com" "Backend CORS origin with www"
Write-Host ""

Write-Host "3️⃣  Configuration Templates" -ForegroundColor White
Write-Host "------------------------" -ForegroundColor Gray
Test-FileContent "backend\.env.production.example" "vegaktools.com" "Backend env template"
Test-FileContent "nginx.conf.example" "server_name vegaktools.com" "NGINX config template"
Write-Host ""

Write-Host "4️⃣  Documentation" -ForegroundColor White
Write-Host "------------------------" -ForegroundColor Gray
Test-FileContent "DEPLOYMENT_VEGAKTOOLS.md" "vegaktools.com" "Deployment guide"
Test-FileContent "DOMAIN_UPDATE_SUMMARY.md" "vegaktools.com" "Domain update summary"
Write-Host ""

Write-Host "5️⃣  Checking for Old Domain References" -ForegroundColor White
Write-Host "------------------------" -ForegroundColor Gray

$oldDomains = @("yourdomain.com", "72.61.229.218")
$foundOld = $false

foreach ($domain in $oldDomains) {
    $searchPaths = @("frontend\src\", "backend\")
    
    foreach ($path in $searchPaths) {
        if (Test-Path $path) {
            $files = Get-ChildItem -Path $path -Recurse -Include "*.js","*.jsx","*.py" -Exclude "*.example","*.md" -ErrorAction SilentlyContinue
            foreach ($file in $files) {
                if ((Get-Content $file.FullName -Raw) -match [regex]::Escape($domain)) {
                    Write-Host "❌ FOUND: Old domain reference: $domain in $($file.FullName)" -ForegroundColor Red
                    $foundOld = $true
                }
            }
        }
    }
}

if (-not $foundOld) {
    Write-Host "✅ PASS: No old domain references in critical files" -ForegroundColor Green
    $PASSED++
} else {
    $FAILED++
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📊 VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Passed: $PASSED" -ForegroundColor Green
Write-Host "Failed: $FAILED" -ForegroundColor Red
Write-Host ""

if ($FAILED -eq 0) {
    Write-Host "🎉 SUCCESS! All domain configurations are correct." -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Ready for deployment to vegaktools.com" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Build frontend: cd frontend && npm run build"
    Write-Host "2. Copy NGINX config to server"
    Write-Host "3. Set environment variables on server"
    Write-Host "4. Restart services"
    exit 0
} else {
    Write-Host "❌ FAILED! Please fix the issues above." -ForegroundColor Red
    exit 1
}
