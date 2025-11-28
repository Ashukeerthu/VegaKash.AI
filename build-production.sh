#!/bin/bash
# Production Build Script for VegaKash.AI
# Run this before deploying to Hostinger

echo "🚀 VegaKash.AI - Production Build"
echo ""

# Step 1: Build Frontend
echo "📦 Step 1: Building Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi

echo "   Building for production..."
npm run build

if [ -d "dist" ]; then
    echo "   ✅ Frontend built successfully!"
    echo "   📁 Location: frontend/dist/"
else
    echo "   ❌ Build failed!"
    exit 1
fi

cd ..

# Step 2: Prepare Backend
echo ""
echo "📦 Step 2: Preparing Backend..."

if [ ! -f "backend/.env" ]; then
    echo "   ⚠️  WARNING: backend/.env not found!"
    echo "   Create .env file with your OpenAI API key before deploying"
else
    echo "   ✅ .env file present"
fi

echo "   ✅ Backend files ready!"
echo "   📁 Location: backend/"

# Step 3: Check Configuration
echo ""
echo "⚙️  Step 3: Checking Configuration..."

if grep -q "production: 'https://yourdomain.com'" frontend/src/config.js; then
    echo "   ⚠️  WARNING: Update production URL in frontend/src/config.js!"
    echo "   Current: https://yourdomain.com"
    echo "   Change to your actual domain, then rebuild!"
else
    echo "   ✅ Production URL configured"
fi

# Step 4: Create Deployment Packages
echo ""
echo "📦 Step 4: Creating Deployment Packages..."

# Frontend package
rm -f vegakash-frontend.zip
cd frontend/dist
zip -r ../../vegakash-frontend.zip . >/dev/null 2>&1
cd ../..
echo "   ✅ Frontend package: vegakash-frontend.zip"

# Backend package
rm -f vegakash-backend.zip
cd backend
zip -r ../vegakash-backend.zip . \
    -x "venv/*" \
    -x "__pycache__/*" \
    -x "*.pyc" \
    -x ".env" >/dev/null 2>&1
cd ..
echo "   ✅ Backend package: vegakash-backend.zip"

# Summary
echo ""
echo "✅ Production Build Complete!"
echo ""
echo "📦 Deployment Packages Created:"
echo "   1. vegakash-frontend.zip (upload to public_html/)"
echo "   2. vegakash-backend.zip (upload to ~/vegakash-backend/)"
echo ""
echo "📋 Next Steps:"
echo "   1. Review DEPLOYMENT_CHECKLIST.md"
echo "   2. Update production URL in frontend/src/config.js if needed"
echo "   3. Follow HOSTINGER_DEPLOYMENT.md for complete guide"
echo "   4. Upload packages to your Hostinger server"
echo "   5. Create .env file on server with your API key"
echo ""
echo "⚠️  Remember:"
echo "   - NEVER upload .env file to git"
echo "   - Create .env file directly on server"
echo "   - Use different API keys for dev and production"
echo ""
