# Hostinger Deployment Guide for VegaKash.AI

Complete step-by-step guide to deploy VegaKash.AI on Hostinger.

## 📋 Prerequisites

Before deployment, ensure you have:
- ✅ Hostinger hosting plan (VPS or Cloud Hosting recommended)
- ✅ Domain name (optional but recommended)
- ✅ OpenAI API key
- ✅ SSH access to your server
- ✅ Basic knowledge of Linux commands

## 🎯 Deployment Architecture

```
Your Domain (e.g., vegakash.com)
├── Frontend (/) → Serves static files from /dist
└── Backend (/api) → Python FastAPI application
```

## 📦 Step 1: Prepare Files for Upload

Your production-ready files are now in:
- **Frontend**: `frontend/dist/` folder (static HTML/CSS/JS)
- **Backend**: `backend/` folder (Python application)

## 🚀 Step 2: Deploy Backend (Python FastAPI)

### 2.1 Upload Backend Files

1. **Connect via SSH or FTP**:
   ```bash
   ssh username@your-server-ip
   ```

2. **Create application directory**:
   ```bash
   mkdir -p ~/vegakash-backend
   cd ~/vegakash-backend
   ```

3. **Upload these files** (via FTP/SFTP or git clone):
   - All files from `backend/` folder
   - Specifically include:
     - `main.py`
     - `config.py`
     - `schemas.py`
     - `services/` folder
     - `requirements-prod.txt`
     - `gunicorn_config.py`
     - `start.sh`

### 2.2 Setup Python Environment

```bash
# Install Python 3.10+ (if not already installed)
sudo apt update
sudo apt install python3 python3-pip python3-venv -y

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements-prod.txt
```

### 2.3 Configure Environment Variables

Create `.env` file on the server:
```bash
nano .env
```

Add your API key:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
API_TIMEOUT=60
```

**Important**: Set proper permissions:
```bash
chmod 600 .env
```

### 2.4 Test Backend Locally

```bash
# Make start script executable
chmod +x start.sh

# Test run
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Visit `http://your-server-ip:8000/api/v1/health` to verify.

### 2.5 Setup as System Service (Recommended)

Create systemd service for auto-restart:

```bash
sudo nano /etc/systemd/system/vegakash.service
```

Add:
```ini
[Unit]
Description=VegaKash.AI Backend Service
After=network.target

[Service]
Type=notify
User=your-username
WorkingDirectory=/home/your-username/vegakash-backend
Environment="PATH=/home/your-username/vegakash-backend/venv/bin"
ExecStart=/home/your-username/vegakash-backend/venv/bin/gunicorn main:app -c gunicorn_config.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable vegakash
sudo systemctl start vegakash
sudo systemctl status vegakash
```

## 🌐 Step 3: Deploy Frontend (React Build)

### 3.1 Upload Frontend Files

1. **Navigate to web root**:
   ```bash
   cd ~/public_html
   # or
   cd /var/www/html
   ```

2. **Upload ALL files from `frontend/dist/` folder**:
   - `index.html`
   - `assets/` folder (CSS and JS files)
   - Any other files in the dist folder

3. **Set proper permissions**:
   ```bash
   chmod -R 755 ~/public_html
   ```

### 3.2 Update API Configuration

**IMPORTANT**: Before uploading, update `frontend/src/config.js`:

```javascript
const API_BASE_URLS = {
  development: 'http://localhost:8000',
  production: 'https://yourdomain.com',  // ← Change this!
};
```

Then rebuild:
```bash
npm run build
```

And upload the new `dist/` files.

## 🔧 Step 4: Configure Nginx/Apache

### For Nginx:

```bash
sudo nano /etc/nginx/sites-available/vegakash
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - Serve static files
    location / {
        root /home/your-username/public_html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/vegakash /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### For Apache (Hostinger common setup):

Create `.htaccess` in public_html:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # API proxy
    RewriteRule ^api/(.*)$ http://127.0.0.1:8000/api/$1 [P,L]
    
    # Frontend routing
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## 🔒 Step 5: Setup SSL (HTTPS)

### Using Let's Encrypt (Free):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts to get SSL certificate.

### Or via Hostinger Control Panel:
1. Go to SSL section
2. Install free SSL certificate
3. Force HTTPS redirect

## ✅ Step 6: Verify Deployment

1. **Check Backend**:
   ```bash
   curl https://yourdomain.com/api/v1/health
   ```
   Should return: `{"status":"ok","message":"VegaKash.AI API is running"}`

2. **Check Frontend**:
   Visit `https://yourdomain.com` in browser

3. **Test Full Flow**:
   - Fill the form
   - Click "Calculate Summary"
   - Click "Generate AI Plan"

## 🔍 Troubleshooting

### Backend not responding:
```bash
# Check service status
sudo systemctl status vegakash

# Check logs
sudo journalctl -u vegakash -f

# Check if port is listening
sudo netstat -tulpn | grep 8000
```

### Frontend API errors:
- Verify `frontend/src/config.js` has correct production URL
- Check browser console for CORS errors
- Verify Nginx/Apache proxy configuration

### Environment variables not loading:
```bash
# Check .env file
cat ~/vegakash-backend/.env

# Test loading
cd ~/vegakash-backend
source venv/bin/activate
python -c "from config import config; print(config.openai_api_key[:10])"
```

## 📊 Monitoring & Maintenance

### Check Backend Logs:
```bash
sudo journalctl -u vegakash -f
```

### Restart Backend:
```bash
sudo systemctl restart vegakash
```

### Update Application:
```bash
cd ~/vegakash-backend
git pull  # if using git
source venv/bin/activate
pip install -r requirements-prod.txt
sudo systemctl restart vegakash
```

## 🎉 Post-Deployment Checklist

- [ ] Backend responds at `/api/v1/health`
- [ ] Frontend loads without errors
- [ ] Form submission works
- [ ] Calculate Summary generates results
- [ ] AI Plan generation works (with valid API key)
- [ ] Mobile responsive design works
- [ ] HTTPS/SSL certificate active
- [ ] CORS headers configured correctly
- [ ] Rate limiting functional
- [ ] Error handling works properly

## 📞 Support Resources

- **Hostinger Support**: https://www.hostinger.com/tutorials/
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use different API keys** for dev and production
3. **Enable firewall**:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```
4. **Regular updates**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
5. **Monitor logs** for suspicious activity
6. **Backup** your `.env` file securely

## 🚀 Quick Deploy Commands

```bash
# Backend
cd ~/vegakash-backend
git pull
source venv/bin/activate
pip install -r requirements-prod.txt
sudo systemctl restart vegakash

# Frontend
cd ~/vegakash-frontend
git pull
npm install
npm run build
# Upload dist/* to public_html/
```

---

**Need Help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for environment variable setup.
