#!/bin/bash
# Setup Email Configuration on Production Server
# Usage: ./setup-production-email.sh

set -e

echo "🔧 VegaKash.AI - Production Email Setup"
echo "========================================"
echo ""

# Configuration
SSH_HOST="u277936268@vegaktools.com"
PROJECT_DIR="/home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "📧 This script will configure email settings for the feedback system"
echo ""
read -p "Gmail Address (e.g., your-email@gmail.com): " EMAIL_USER
read -s -p "Gmail App Password (16 characters): " EMAIL_PASSWORD
echo ""
read -p "Email to receive feedback (default: $EMAIL_USER): " EMAIL_TO
EMAIL_TO=${EMAIL_TO:-$EMAIL_USER}

echo ""
echo "🚀 Connecting to production server..."

# SSH into server and update .env
ssh $SSH_HOST << EOF
cd $BACKEND_DIR

# Backup existing .env if it exists
if [ -f .env ]; then
    cp .env .env.backup.\$(date +%Y%m%d_%H%M%S)
    echo "✅ Backed up existing .env"
fi

# Update or add email configuration
if [ -f .env ]; then
    # Remove old email config if exists
    sed -i '/^EMAIL_/d' .env
    echo "📝 Removed old email configuration"
fi

# Append email configuration
cat >> .env << 'ENVEOF'

# Email Configuration for Feedback System
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=$EMAIL_USER
EMAIL_PASSWORD=$EMAIL_PASSWORD
EMAIL_TO=$EMAIL_TO
ENVEOF

# Secure the .env file
chmod 600 .env

echo "✅ Email configuration updated"
echo ""
echo "🔄 Restarting backend service..."

# Restart backend service
sudo systemctl restart vegakash-backend

# Wait a moment
sleep 3

# Check if service is running
if sudo systemctl is-active --quiet vegakash-backend; then
    echo "✅ Backend service restarted successfully"
    echo ""
    echo "🧪 Testing email configuration..."
    
    # Test the feedback health endpoint
    curl -s http://localhost:8000/api/feedback/health | jq .
    
    echo ""
    echo "✅ Email setup complete!"
    echo ""
    echo "📬 To test feedback:"
    echo "   Visit https://vegaktools.com and submit feedback"
    echo "   Check your inbox: $EMAIL_TO"
else
    echo "❌ Failed to start backend service"
    echo "Check logs: sudo journalctl -u vegakash-backend -n 50"
    exit 1
fi
EOF

echo ""
echo "🎉 Production email configuration complete!"
