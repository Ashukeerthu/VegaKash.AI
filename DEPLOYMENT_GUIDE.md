# VegaKash.AI Deployment Guide

## Quick Deployment to Production

This guide covers deploying VegaKash.AI to Hostinger or any production server.

---

## 🚀 PRE-DEPLOYMENT CHECKLIST

### Backend Requirements
- [ ] OpenAI API key obtained
- [ ] Python 3.8+ installed on server
- [ ] Virtual environment configured
- [ ] All dependencies in requirements.txt

### Frontend Requirements
- [ ] Node.js 16+ installed
- [ ] Production domain configured
- [ ] HTTPS certificate (Let's Encrypt)
- [ ] Static file hosting ready

---

## 📦 BACKEND DEPLOYMENT

### Step 1: Prepare Backend Files

```bash
# On your local machine
cd backend

# Create requirements.txt if not exists
pip freeze > requirements.txt

# Test locally first
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

### Step 2: Upload to Server

**Option A: Using Git (Recommended)**
```bash
# On server
git clone https://github.com/Ashukeerthu/VegaKash.AI.git
cd VegaKash.AI/backend
```

**Option B: Using FTP/SFTP**
- Upload entire `backend/` folder to server
- Preserve file structure

### Step 3: Server Setup

```bash
# SSH into your server
ssh user@your-server.com

# Navigate to backend directory
cd /path/to/VegaKash.AI/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
# or
.\venv\Scripts\Activate.ps1  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Environment Configuration

Create `.env` file in backend directory:

```bash
# backend/.env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
PRODUCTION_DOMAIN=vegakash.ai
FRONTEND_URL=https://vegakash.ai
```

### Step 5: Run with Gunicorn (Production Server)

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn (production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8080
```

### Step 6: Setup Systemd Service (Keep it Running)

Create `/etc/systemd/system/vegakash-api.service`:

```ini
[Unit]
Description=VegaKash.AI Backend API
After=network.target

[Service]
User=your-username
WorkingDirectory=/path/to/VegaKash.AI/backend
Environment="PATH=/path/to/VegaKash.AI/backend/venv/bin"
EnvironmentFile=/path/to/VegaKash.AI/backend/.env
ExecStart=/path/to/VegaKash.AI/backend/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8080
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable vegakash-api
sudo systemctl start vegakash-api
sudo systemctl status vegakash-api
```

---

## 🌐 FRONTEND DEPLOYMENT

### Step 1: Build Production Bundle

```bash
# On your local machine
cd frontend

# Install dependencies
npm install

# Create .env.production file
cat > .env.production << EOF
VITE_API_URL=https://api.vegakash.ai
EOF

# Build for production
npm run build
```

This creates a `dist/` folder with optimized static files.

### Step 2: Upload to Hostinger

**Option A: FTP Upload**
1. Connect to Hostinger via FTP (FileZilla, WinSCP)
2. Navigate to `public_html/` directory
3. Upload entire contents of `dist/` folder
4. Ensure `index.html` is in root

**Option B: Git Deploy**
```bash
# On Hostinger server
cd public_html
git clone https://github.com/Ashukeerthu/VegaKash.AI.git
cd VegaKash.AI/frontend
npm install
npm run build
mv dist/* ../../
```

### Step 3: Configure NGINX/Apache

**For NGINX** (`/etc/nginx/sites-available/vegakash.ai`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name vegakash.ai www.vegakash.ai;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name vegakash.ai www.vegakash.ai;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/vegakash.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vegakash.ai/privkey.pem;
    
    # Security Headers (already added via backend middleware, but good to have)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Frontend (React SPA)
    root /var/www/vegakash.ai;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable site and reload:
```bash
sudo ln -s /etc/nginx/sites-available/vegakash.ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**For Apache** (`.htaccess` in public_html):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header set X-Frame-Options "DENY"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>
```

---

## 🔒 SSL CERTIFICATE (HTTPS)

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d vegakash.ai -d www.vegakash.ai

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## 🧪 POST-DEPLOYMENT TESTING

### Backend Health Check

```bash
# Test API endpoint
curl https://api.vegakash.ai/health

# Expected response:
{
  "status": "ok",
  "message": "VegaKash.AI API is running",
  "version": "1.0.0",
  "timestamp": "2025-12-01T...",
  "ai_configured": true
}
```

### Frontend Testing

1. **Homepage:** Visit https://vegakash.ai
2. **Legal Pages:**
   - https://vegakash.ai/privacy-policy
   - https://vegakash.ai/terms-and-conditions
   - https://vegakash.ai/disclaimer
3. **Calculators:**
   - https://vegakash.ai/calculators/emi
   - https://vegakash.ai/calculators/sip
4. **Cookie Banner:** Clear cookies and verify banner appears
5. **Mobile:** Test on mobile device
6. **API Integration:** Try calculating a budget

---

## 📊 MONITORING & LOGS

### Backend Logs

```bash
# View systemd service logs
sudo journalctl -u vegakash-api -f

# View Gunicorn logs
tail -f /var/log/gunicorn/vegakash.log
```

### Frontend Logs

Check browser console for any errors:
- Open DevTools (F12)
- Go to Console tab
- Look for any red errors

### Performance Monitoring

1. **Google PageSpeed Insights:** https://pagespeed.web.dev/
2. **GTmetrix:** https://gtmetrix.com/
3. **Uptime Monitoring:** Use UptimeRobot or similar

---

## 🔄 UPDATING THE APPLICATION

### Backend Updates

```bash
# SSH to server
ssh user@your-server.com
cd /path/to/VegaKash.AI/backend

# Pull latest changes
git pull origin main

# Activate venv and update dependencies
source venv/bin/activate
pip install -r requirements.txt

# Restart service
sudo systemctl restart vegakash-api
```

### Frontend Updates

```bash
# On local machine - rebuild
cd frontend
npm run build

# Upload dist/ to server via FTP
# Or via Git on server:
ssh user@your-server.com
cd /path/to/VegaKash.AI/frontend
git pull origin main
npm install
npm run build
cp -r dist/* /var/www/vegakash.ai/
```

---

## 🐛 TROUBLESHOOTING

### Issue: API not responding

```bash
# Check if service is running
sudo systemctl status vegakash-api

# Check logs for errors
sudo journalctl -u vegakash-api -n 50

# Restart service
sudo systemctl restart vegakash-api
```

### Issue: CORS errors

- Verify `PRODUCTION_DOMAIN` in backend `.env`
- Check ALLOWED_ORIGINS in `backend/main.py`
- Ensure frontend is on same domain as API

### Issue: 404 errors on React routes

- Verify NGINX/Apache rewrite rules
- Ensure `try_files` or `.htaccess` is configured
- Check that `index.html` is in root

### Issue: SSL certificate errors

```bash
# Renew certificate
sudo certbot renew --force-renewal

# Reload NGINX
sudo systemctl reload nginx
```

---

## 📞 HOSTINGER-SPECIFIC NOTES

### Database (if needed in future)
- Hostinger provides MySQL databases
- Connection details in Hostinger panel

### File Manager
- Use Hostinger's built-in file manager
- Or connect via FTP using credentials from panel

### Python Support
- Hostinger Business/Premium plans support Python
- Use "Setup Python App" in control panel
- Set entry point to `main:app`

### Domain Configuration
- Point A record to server IP
- CNAME for www subdomain
- Wait for DNS propagation (up to 48 hours)

---

## ✅ FINAL CHECKLIST

Before going live:

- [ ] Backend running and responding to `/health`
- [ ] Frontend accessible at domain
- [ ] All legal pages accessible
- [ ] Cookie consent banner working
- [ ] HTTPS certificate active
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible
- [ ] Calculator functionality working
- [ ] AI plan generation working
- [ ] PDF export working
- [ ] Mobile responsive verified
- [ ] No console errors in browser
- [ ] Google PageSpeed score > 80
- [ ] All links working (no 404s)

---

## 🎉 GO LIVE!

Once everything is verified:

1. ✅ **Apply for Google AdSense**
2. ✅ **Submit sitemap to Google Search Console**
3. ✅ **Share on social media**
4. ✅ **Monitor logs for first few days**
5. ✅ **Gather user feedback**

---

## 📚 ADDITIONAL RESOURCES

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Let's Encrypt Certbot](https://certbot.eff.org/)
- [NGINX Configuration](https://nginx.org/en/docs/)
- [Hostinger Tutorials](https://www.hostinger.com/tutorials/)

---

**Need Help?** Check logs first, then review this guide. Good luck with your deployment! 🚀
