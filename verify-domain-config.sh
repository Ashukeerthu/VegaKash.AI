#!/bin/bash
# Domain Configuration Verification Script
# VegaKash.AI - vegaktools.com

echo "🔍 Verifying Production Domain Configuration..."
echo "Domain: https://vegaktools.com"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
PASSED=0
FAILED=0

# Function to check file content
check_file() {
    local file=$1
    local search=$2
    local description=$3
    
    if [ -f "$file" ]; then
        if grep -q "$search" "$file"; then
            echo -e "${GREEN}✅ PASS${NC}: $description"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC}: $description"
            echo "   File: $file"
            echo "   Expected: $search"
            ((FAILED++))
        fi
    else
        echo -e "${YELLOW}⚠️  SKIP${NC}: File not found: $file"
    fi
}

echo "1️⃣  Frontend Configuration"
echo "------------------------"
check_file "frontend/src/config.js" "vegaktools.com" "Frontend production URL"
check_file "frontend/.env.production" "VITE_API_URL=https://vegaktools.com" "Frontend environment variable"
echo ""

echo "2️⃣  Backend Configuration"
echo "------------------------"
check_file "backend/main.py" "https://vegaktools.com" "Backend CORS origin"
check_file "backend/main.py" "https://www.vegaktools.com" "Backend CORS origin (www)"
echo ""

echo "3️⃣  Configuration Templates"
echo "------------------------"
check_file "backend/.env.production.example" "vegaktools.com" "Backend env template"
check_file "nginx.conf.example" "server_name vegaktools.com" "NGINX config template"
echo ""

echo "4️⃣  Documentation"
echo "------------------------"
check_file "DEPLOYMENT_VEGAKTOOLS.md" "vegaktools.com" "Deployment guide"
check_file "DOMAIN_UPDATE_SUMMARY.md" "vegaktools.com" "Domain update summary"
echo ""

# Search for old domain references
echo "5️⃣  Checking for Old Domain References"
echo "------------------------"

OLD_DOMAINS=("yourdomain.com" "72.61.229.218")
FOUND_OLD=false

for domain in "${OLD_DOMAINS[@]}"; do
    # Search in critical files only (exclude docs and examples)
    if grep -r "$domain" frontend/src/ backend/ --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=dist 2>/dev/null | grep -v ".example" | grep -v ".md" > /dev/null; then
        echo -e "${RED}❌ FOUND${NC}: Old domain reference: $domain"
        grep -r "$domain" frontend/src/ backend/ --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=dist 2>/dev/null | grep -v ".example" | grep -v ".md"
        FOUND_OLD=true
        ((FAILED++))
    fi
done

if [ "$FOUND_OLD" = false ]; then
    echo -e "${GREEN}✅ PASS${NC}: No old domain references in critical files"
    ((PASSED++))
fi

echo ""
echo "=========================================="
echo "📊 VERIFICATION SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! All domain configurations are correct.${NC}"
    echo ""
    echo "✅ Ready for deployment to vegaktools.com"
    echo ""
    echo "Next steps:"
    echo "1. Build frontend: cd frontend && npm run build"
    echo "2. Copy NGINX config to server"
    echo "3. Set environment variables on server"
    echo "4. Restart services"
    exit 0
else
    echo -e "${RED}❌ FAILED! Please fix the issues above.${NC}"
    exit 1
fi
