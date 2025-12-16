#!/bin/bash
# Production Deployment Fix Script for vegaktools.com
# Fixes API connectivity issues

echo "🚀 VegakTools Production Deployment Fix"
echo "========================================"

# Configuration
REMOTE_USER="u277936268"
REMOTE_HOST="vegaktools.com"
REMOTE_PATH="/home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI"

echo "📦 Step 1: Pull latest code on server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI
echo "Current directory: $(pwd)"

# Pull latest code
git fetch origin
git pull origin main

echo "✅ Code updated"
ENDSSH

echo ""
echo "🔧 Step 2: Check backend service..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
# Check if backend is running
if systemctl is-active --quiet vegakash-backend; then
    echo "✅ Backend service is running"
    sudo systemctl status vegakash-backend --no-pager -l
else
    echo "❌ Backend service is NOT running"
    echo "Checking logs..."
    sudo journalctl -u vegakash-backend -n 20 --no-pager
    
    echo ""
    echo "Attempting to start backend..."
    sudo systemctl start vegakash-backend
    sleep 2
    
    if systemctl is-active --quiet vegakash-backend; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Failed to start backend. Manual intervention required."
        exit 1
    fi
fi
ENDSSH

echo ""
echo "🔑 Step 3: Verify OpenAI API key..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/backend

if [ -f .env ]; then
    if grep -q "OPENAI_API_KEY=sk-" .env; then
        echo "✅ OpenAI API key configured"
    else
        echo "⚠️  WARNING: OpenAI API key may not be set correctly"
        echo "Please check backend/.env file"
    fi
else
    echo "❌ ERROR: .env file not found in backend directory"
    echo "Create it with: echo 'OPENAI_API_KEY=your-key' > .env"
    exit 1
fi
ENDSSH

echo ""
echo "🏗️  Step 4: Build frontend with production settings..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/frontend

echo "Installing dependencies..."
npm install --production=false

echo "Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi
ENDSSH

echo ""
echo "🔄 Step 5: Restart services..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
echo "Restarting backend service..."
sudo systemctl restart vegakash-backend
sleep 2

echo "Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Services restarted"
ENDSSH

echo ""
echo "🧪 Step 6: Test API endpoints..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
echo "Testing local backend..."
curl -s http://localhost:8000/health | head -20

echo ""
echo "Testing through nginx..."
curl -s https://vegaktools.com/api/v1/health | head -20

echo ""
echo "Testing calculate-summary endpoint..."
curl -s -X POST https://vegaktools.com/api/v1/calculate-summary \
  -H "Content-Type: application/json" \
  -d '{"income":50000,"fixed_expenses":{},"variable_expenses":{},"loans":[],"goals":[]}' | head -50
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Visit your site: https://vegaktools.com"
echo "📊 Test Budget Planner: https://vegaktools.com/budget-planner"
echo "✈️  Test Travel Planner: https://vegaktools.com/travel-budget"
echo ""
echo "If issues persist, check logs with:"
echo "  ssh ${REMOTE_USER}@${REMOTE_HOST} 'sudo journalctl -u vegakash-backend -f'"
