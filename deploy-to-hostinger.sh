#!/bin/bash

# VegaKash.AI - Hostinger Deployment Script
# This script pulls the latest code from GitHub and deploys to Hostinger

set -e  # Exit on any error

echo "======================================"
echo "VegaKash.AI - Hostinger Deployment"
echo "======================================"
echo ""

# Configuration
REPO_DIR="/home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI"
BACKEND_DIR="$REPO_DIR/backend"
FRONTEND_DIR="$REPO_DIR/frontend"
NGINX_CONFIG="/etc/nginx/sites-available/vegaktools"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Navigate to repository
echo -e "${YELLOW}Step 1: Navigating to repository...${NC}"
cd "$REPO_DIR" || { echo -e "${RED}Error: Repository directory not found!${NC}"; exit 1; }
echo -e "${GREEN}✓ In repository directory${NC}"
echo ""

# Step 2: Backup current version (optional)
echo -e "${YELLOW}Step 2: Creating backup...${NC}"
BACKUP_DIR="/home/u277936268/backups/vegakash_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "$BACKEND_DIR/.env" "$BACKUP_DIR/.env.backup" 2>/dev/null || true
echo -e "${GREEN}✓ Backup created at $BACKUP_DIR${NC}"
echo ""

# Step 3: Pull latest code from GitHub
echo -e "${YELLOW}Step 3: Pulling latest code from GitHub...${NC}"
git fetch origin
git reset --hard origin/main
git pull origin main
echo -e "${GREEN}✓ Latest code pulled successfully${NC}"
echo ""

# Step 4: Install/Update backend dependencies
echo -e "${YELLOW}Step 4: Installing backend dependencies...${NC}"
cd "$BACKEND_DIR"
source venv/bin/activate
pip install -r requirements.txt --upgrade
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Step 5: Install/Update frontend dependencies and build
echo -e "${YELLOW}Step 5: Building frontend...${NC}"
cd "$FRONTEND_DIR"
npm install
npm run build
echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

# Step 6: Update NGINX configuration if needed
echo -e "${YELLOW}Step 6: Checking NGINX configuration...${NC}"
if [ -f "$REPO_DIR/nginx.conf.example" ]; then
    echo "NGINX config template found. To update:"
    echo "  sudo cp $REPO_DIR/nginx.conf.example $NGINX_CONFIG"
    echo "  sudo nginx -t"
    echo "  sudo systemctl reload nginx"
else
    echo -e "${GREEN}✓ Using existing NGINX configuration${NC}"
fi
echo ""

# Step 7: Restart backend service
echo -e "${YELLOW}Step 7: Restarting backend service...${NC}"
sudo systemctl restart vegakash-backend
sleep 2
if sudo systemctl is-active --quiet vegakash-backend; then
    echo -e "${GREEN}✓ Backend service restarted successfully${NC}"
else
    echo -e "${RED}✗ Backend service failed to start!${NC}"
    sudo systemctl status vegakash-backend
    exit 1
fi
echo ""

# Step 8: Reload NGINX
echo -e "${YELLOW}Step 8: Reloading NGINX...${NC}"
sudo systemctl reload nginx
echo -e "${GREEN}✓ NGINX reloaded${NC}"
echo ""

# Step 9: Verify deployment
echo -e "${YELLOW}Step 9: Verifying deployment...${NC}"
echo "Testing health endpoint..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "000")
if [ "$HEALTH_CHECK" = "200" ]; then
    echo -e "${GREEN}✓ Backend health check passed (HTTP $HEALTH_CHECK)${NC}"
else
    echo -e "${RED}✗ Backend health check failed (HTTP $HEALTH_CHECK)${NC}"
fi
echo ""

# Step 10: Display summary
echo "======================================"
echo -e "${GREEN}Deployment Complete!${NC}"
echo "======================================"
echo ""
echo "Repository: $REPO_DIR"
echo "Latest commit: $(git log -1 --oneline)"
echo ""
echo "Services:"
echo "  - Backend: http://localhost:8000"
echo "  - Frontend: https://vegaktools.com"
echo ""
echo "To check logs:"
echo "  - Backend: sudo journalctl -u vegakash-backend -f"
echo "  - NGINX: sudo tail -f /var/log/nginx/error.log"
echo ""
echo -e "${GREEN}✓ All done!${NC}"
