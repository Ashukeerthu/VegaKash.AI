# VegaKash.AI Production Deployment Guide
## Domain: https://vegaktools.com

---

## 🎯 Quick Deployment Checklist

### ✅ 1. Frontend Configuration
**File**: `frontend/src/config.js`

Current production URL:
```javascript
production: 'https://vegaktools.com'
```

✔️ **Already Updated** - No changes needed!

---

### ✅ 2. Backend CORS Configuration
**File**: `backend/main.py`

Current CORS origins:
```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://vegaktools.com",
    "https://www.vegaktools.com",
]
```

✔️ **Already Updated** - Production domains included!

---

### ✅ 3. Environment Variables

**Backend** - Create `/var/www/VegaKash.AI/backend/.env`:
```bash
# Copy from example
cp backend/.env.production.example backend/.env

# Edit with your values
nano backend/.env
```

**Required variables:**
```bash
PRODUCTION_DOMAIN=vegaktools.com
FRONTEND_URL=https://vegaktools.com
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
```

**Frontend** - Already configured in `.env.production`:
```bash
VITE_API_URL=https://vegaktools.com
```

---

### ✅ 4. NGINX Configuration

**File**: `/etc/nginx/sites-available/vegaktools`

```bash
# Copy example configuration
sudo cp nginx.conf.example /etc/nginx/sites-available/vegaktools

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/vegaktools /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

**Key settings in NGINX:**
```nginx
server_name vegaktools.com www.vegaktools.com;

ssl_certificate /etc/letsencrypt/live/vegaktools.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/vegaktools.com/privkey.pem;

root /var/www/VegaKash.AI/frontend/dist;

location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
}
```

---

### ✅ 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot (if not already installed)
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d vegaktools.com -d www.vegaktools.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Server
```bash
# SSH into your server
ssh root@vegaktools.com

# Navigate to project directory
cd /var/www/VegaKash.AI
```

### Step 2: Update Code (if using Git)
```bash
# Pull latest changes
git pull origin main
```

### Step 3: Backend Deployment
```bash
cd /var/www/VegaKash.AI/backend

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your-actual-key"
export PRODUCTION_DOMAIN="vegaktools.com"
export FRONTEND_URL="https://vegaktools.com"

# Test backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Or use systemd service (recommended)
sudo systemctl restart vegakash-backend
```

### Step 4: Frontend Build & Deployment
```bash
cd /var/www/VegaKash.AI/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Verify build
ls -lh dist/

# NGINX will serve from dist/ automatically
```

### Step 5: Start/Restart Services
```bash
# Reload NGINX
sudo systemctl reload nginx

# Restart backend (if using systemd)
sudo systemctl restart vegakash-backend

# Check status
sudo systemctl status nginx
sudo systemctl status vegakash-backend
```

---

## 🔍 Verification & Testing

### 1. Health Check
```bash
# Test backend health endpoint
curl https://vegaktools.com/health

# Expected response:
# {"status":"healthy","timestamp":"2025-12-01T..."}
```

### 2. API Test
```bash
# Test API endpoint
curl https://vegaktools.com/api/v1/health

# Expected response:
# {"status":"ok"}
```

### 3. Frontend Test
Open browser and visit:
- https://vegaktools.com
- https://www.vegaktools.com (should redirect to non-www)

**Check:**
- ✅ Page loads without errors
- ✅ HTTPS padlock shows (secure)
- ✅ Forms submit successfully
- ✅ AI plan generation works
- ✅ No console errors in browser DevTools

### 4. SSL Test
```bash
# Test SSL configuration
openssl s_client -connect vegaktools.com:443 -servername vegaktools.com

# Or use online tool:
# https://www.ssllabs.com/ssltest/analyze.html?d=vegaktools.com
```

### 5. Performance Test
```bash
# Test response time
curl -o /dev/null -s -w 'Total: %{time_total}s\n' https://vegaktools.com

# Expected: < 2 seconds
```

---

## 📊 Monitoring & Logs

### View Logs
```bash
# NGINX access logs
sudo tail -f /var/log/nginx/vegaktools_access.log

# NGINX error logs
sudo tail -f /var/log/nginx/vegaktools_error.log

# Backend logs (if using systemd)
sudo journalctl -u vegakash-backend -f

# Or application logs
tail -f /var/log/vegakash/app.log
```

### Check Service Status
```bash
# NGINX
sudo systemctl status nginx

# Backend
sudo systemctl status vegakash-backend

# Disk space
df -h

# Memory usage
free -h
```

---

## 🐛 Troubleshooting

### Problem: Frontend can't connect to backend
**Solution:**
1. Check CORS in `backend/main.py` includes `https://vegaktools.com`
2. Verify NGINX proxy_pass is correct: `http://127.0.0.1:8000/api/`
3. Check backend is running: `curl http://localhost:8000/health`
4. Check NGINX logs: `sudo tail -f /var/log/nginx/vegaktools_error.log`

### Problem: SSL certificate not working
**Solution:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Reload NGINX
sudo systemctl reload nginx
```

### Problem: AI plan not generating
**Solution:**
1. Check `OPENAI_API_KEY` is set in backend `.env`
2. Check backend logs for errors
3. Test OpenAI API directly: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### Problem: 502 Bad Gateway
**Solution:**
1. Backend not running: `sudo systemctl start vegakash-backend`
2. Check if port 8000 is listening: `sudo netstat -tulpn | grep 8000`
3. Check NGINX proxy configuration

### Problem: Changes not reflecting
**Solution:**
```bash
# Clear browser cache (Ctrl+Shift+R)

# Rebuild frontend
cd /var/www/VegaKash.AI/frontend
npm run build

# Restart services
sudo systemctl reload nginx
sudo systemctl restart vegakash-backend
```

---

## 🔄 Update Deployment (After Code Changes)

### Quick Update Script
```bash
#!/bin/bash
# File: deploy.sh

echo "🚀 Deploying VegaKash.AI to vegaktools.com..."

# Navigate to project
cd /var/www/VegaKash.AI

# Pull latest code (if using git)
git pull origin main

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart vegakash-backend

# Frontend
cd ../frontend
npm install
npm run build

# Reload NGINX
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "🌐 Visit: https://vegaktools.com"
```

Make executable:
```bash
chmod +x deploy.sh
```

Run deployment:
```bash
./deploy.sh
```

---

## 📋 Systemd Service (Backend)

Create `/etc/systemd/system/vegakash-backend.service`:

```ini
[Unit]
Description=VegaKash.AI FastAPI Backend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/VegaKash.AI/backend
Environment="PATH=/var/www/VegaKash.AI/backend/venv/bin"
Environment="OPENAI_API_KEY=your-actual-key"
Environment="PRODUCTION_DOMAIN=vegaktools.com"
Environment="FRONTEND_URL=https://vegaktools.com"
ExecStart=/var/www/VegaKash.AI/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable vegakash-backend
sudo systemctl start vegakash-backend
sudo systemctl status vegakash-backend
```

---

## 🎉 Success Checklist

- [x] Frontend config updated to `https://vegaktools.com`
- [x] Backend CORS includes `vegaktools.com` and `www.vegaktools.com`
- [x] NGINX configured with correct `server_name`
- [x] SSL certificate installed for `vegaktools.com`
- [x] Environment variables set (especially `OPENAI_API_KEY`)
- [ ] Frontend built: `npm run build`
- [ ] Backend running on port 8000
- [ ] NGINX running and serving site
- [ ] Health check returns 200 OK
- [ ] Frontend loads at https://vegaktools.com
- [ ] API calls work from frontend
- [ ] AI plan generation functional
- [ ] No console errors in browser
- [ ] SSL certificate valid (green padlock)

---

## 📞 Support

**Domain**: https://vegaktools.com
**Backend API**: https://vegaktools.com/api/v1/
**Health Check**: https://vegaktools.com/health

For issues, check:
1. Logs: `/var/log/nginx/vegaktools_error.log`
2. Backend logs: `sudo journalctl -u vegakash-backend`
3. Browser console: F12 → Console tab

---

**Last Updated**: December 2025
**Production Domain**: vegaktools.com
**Status**: ✅ Configuration Complete
