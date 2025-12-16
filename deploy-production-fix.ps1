# Production Deployment Fix - PowerShell Version
# For Windows users to deploy to vegaktools.com

Write-Host "🚀 VegakTools Production Deployment Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$remoteUser = "u277936268"
$remoteHost = "vegaktools.com"
$remotePath = "/home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI"

Write-Host "`n📦 Step 1: Pull latest code on server..." -ForegroundColor Yellow

$script1 = @"
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI
echo 'Current directory: '`$(pwd)
git fetch origin
git pull origin main
echo '✅ Code updated'
"@

ssh "${remoteUser}@${remoteHost}" $script1

Write-Host "`n🔧 Step 2: Check backend service..." -ForegroundColor Yellow

$script2 = @"
if systemctl is-active --quiet vegakash-backend; then
    echo '✅ Backend service is running'
    sudo systemctl status vegakash-backend --no-pager -l
else
    echo '❌ Backend service is NOT running'
    echo 'Attempting to start backend...'
    sudo systemctl start vegakash-backend
    sleep 2
    if systemctl is-active --quiet vegakash-backend; then
        echo '✅ Backend started successfully'
    else
        echo '❌ Failed to start backend'
        sudo journalctl -u vegakash-backend -n 30 --no-pager
    fi
fi
"@

ssh "${remoteUser}@${remoteHost}" $script2

Write-Host "`n🏗️  Step 3: Build frontend with production settings..." -ForegroundColor Yellow

$script3 = @"
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/frontend
echo 'Building frontend...'
npm install --production=false
npm run build
"@

ssh "${remoteUser}@${remoteHost}" $script3

Write-Host "`n🔄 Step 4: Restart services..." -ForegroundColor Yellow

$script4 = @"
sudo systemctl restart vegakash-backend
sleep 2
sudo systemctl reload nginx
echo '✅ Services restarted'
"@

ssh "${remoteUser}@${remoteHost}" $script4

Write-Host "`n🧪 Step 5: Test API endpoints..." -ForegroundColor Yellow

$script5 = @"
echo 'Testing local backend...'
curl -s http://localhost:8000/health
echo ''
echo 'Testing through nginx...'
curl -s https://vegaktools.com/api/v1/health
"@

ssh "${remoteUser}@${remoteHost}" $script5

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`n🌐 Visit your site: https://vegaktools.com" -ForegroundColor Cyan
Write-Host "📊 Test Budget Planner: https://vegaktools.com/budget-planner" -ForegroundColor Cyan
Write-Host "✈️  Test Travel Planner: https://vegaktools.com/travel-budget" -ForegroundColor Cyan
