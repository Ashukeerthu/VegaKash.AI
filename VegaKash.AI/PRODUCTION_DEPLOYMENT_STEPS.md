# VegaKash.AI - Production Deployment Implementation Guide

**Version**: 1.2.0  
**Last Updated**: December 2025

---

## 🚀 Quick Start Deployment

### Option 1: Deploy to Heroku (Recommended for Beginners)

#### Prerequisites
- Heroku account (heroku.com)
- Heroku CLI installed
- Git repository pushed to GitHub

#### Step 1: Prepare for Heroku
```bash
# 1. Create Procfile in root directory
echo "web: cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app" > Procfile

# 2. Create requirements.txt with all dependencies
cd backend
pip freeze > requirements.txt
cd ..

# 3. Add runtime.txt to specify Python version
echo "python-3.14.0" > runtime.txt
```

#### Step 2: Deploy
```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
heroku create vegakash-ai

# 3. Add environment variables
heroku config:set OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
heroku config:set ENVIRONMENT=production
heroku config:set DEBUG=false

# 4. Deploy
git push heroku Feature:main

# 5. Monitor logs
heroku logs --tail
```

#### Step 3: Setup Frontend
```bash
# Deploy frontend to Netlify
cd frontend
npm run build
# Follow Netlify prompts to deploy dist/ folder
```

---

### Option 2: Deploy to AWS EC2 (More Control)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 22.04 LTS, t2.micro or larger)
- SSH key pair created
- Security group allowing ports 80, 443, 8000

#### Step 1: Setup EC2 Instance
```bash
# 1. SSH into your instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install Python and dependencies
sudo apt install -y python3.14 python3-pip python3-venv
sudo apt install -y git nodejs npm

# 4. Clone repository
cd /opt
sudo git clone https://github.com/Ashukeerthu/VegaKash.AI.git
sudo chown -R ubuntu:ubuntu VegaKash.AI
```

#### Step 2: Setup Backend
```bash
# 1. Create virtual environment
cd VegaKash.AI/backend
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt
pip install gunicorn

# 3. Create .env file
cat > .env << EOF
ENVIRONMENT=production
DEBUG=false
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
LOG_LEVEL=info
EOF

# 4. Test run
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

# 5. Create systemd service
sudo cat > /etc/systemd/system/vegakash-backend.service << EOF
[Unit]
Description=VegaKash AI Backend
After=network.target

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/opt/VegaKash.AI/backend
Environment="PATH=/opt/VegaKash.AI/backend/venv/bin"
ExecStart=/opt/VegaKash.AI/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 6. Start service
sudo systemctl daemon-reload
sudo systemctl enable vegakash-backend
sudo systemctl start vegakash-backend
sudo systemctl status vegakash-backend
```

#### Step 3: Setup Frontend
```bash
# 1. Build frontend
cd /opt/VegaKash.AI/frontend
npm install
npm run build

# 2. Install and configure Nginx
sudo apt install -y nginx

# 3. Configure Nginx
sudo cat > /etc/nginx/sites-available/vegakash << EOF
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /opt/VegaKash.AI/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 4. Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/vegakash /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: Setup SSL (HTTPS)
```bash
# Install Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### Step 5: Monitor
```bash
# Check service status
sudo systemctl status vegakash-backend

# View logs
sudo journalctl -u vegakash-backend -f

# Monitor system
htop
```

---

### Option 3: Deploy with Docker (Production Ready)

#### Prerequisites
- Docker installed
- Docker Compose installed
- Docker Hub account

#### Step 1: Create Docker Setup
```bash
# 1. Create Dockerfile for backend
cat > backend/Dockerfile << EOF
FROM python:3.14-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
EOF

# 2. Create Dockerfile for frontend
cat > frontend/Dockerfile << EOF
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# 3. Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: vegakash-backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
    networks:
      - vegakash-network

  frontend:
    build: ./frontend
    container_name: vegakash-frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - vegakash-network

networks:
  vegakash-network:
    driver: bridge
EOF
```

#### Step 2: Deploy with Docker
```bash
# 1. Build images
docker-compose build

# 2. Set environment variables
export OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Verify services
curl http://localhost:8000/api/v1/health
curl http://localhost
```

---

## 🔧 Post-Deployment Configuration

### 1. Environment Variables Setup
```bash
# Backend (.env)
ENVIRONMENT=production
DEBUG=false
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
OPENAI_TIMEOUT=60
LOG_LEVEL=info
HOST=0.0.0.0
PORT=8000
WORKERS=4
```

### 2. Monitoring & Logging
```bash
# Install monitoring agents
# For DataDog, New Relic, or Sentry

# Example: Sentry setup
pip install sentry-sdk
```

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
# Every 5 minutes, check:
curl -f http://your-domain.com/api/v1/health || notify-on-failure
```

### Expected Response
```json
{
  "status": "ok",
  "ai_configured": true,
  "version": "1.2.0"
}
```

### Key Metrics to Monitor
1. **Response Time**: Target < 2s
2. **Error Rate**: Target < 0.1%
3. **Uptime**: Target > 99.5%
4. **CPU Usage**: Alert if > 80%
5. **Memory Usage**: Alert if > 80%
6. **Disk Usage**: Alert if > 90%

---

## 🚨 Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

#### OpenAI API Key Invalid
```bash
# Test API key
curl -H "Authorization: Bearer sk-proj-xxxxx" https://api.openai.com/v1/models
```

#### High Memory Usage
```bash
# Reduce worker count in gunicorn
gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend Issues

#### Blank Page
- Check browser console for errors
- Verify API URL in environment variables
- Check CORS configuration in backend

#### Slow Load Time
```bash
# Analyze bundle
npm run build
npm install -D webpack-bundle-analyzer
# Check for large dependencies
npm ls --depth=0
```

### Docker Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild images
docker-compose build --no-cache

# Restart
docker-compose restart
```

---

## 📋 Deployment Checklist

- [ ] Code freeze completed
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Backup created
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Smoke tests passed
- [ ] Performance baseline established
- [ ] Documentation updated

---

**Version**: 1.2.0  
**Status**: Production Ready ✅

