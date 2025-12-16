# 🚨 PRODUCTION FIX - API Connectivity Issue

## Problem
- Budget Planner and Travel Planner showing 502 Bad Gateway errors
- Frontend calling localhost:8000 instead of production API

## Quick Fix (5 minutes)

### Option 1: Automated Script (Recommended)

Run from Windows:
```powershell
.\deploy-production-fix.ps1
```

Or from Linux/Mac:
```bash
chmod +x deploy-production-fix.sh
./deploy-production-fix.sh
```

### Option 2: Manual Fix

```bash
# 1. SSH into server
ssh u277936268@vegaktools.com

# 2. Navigate to project
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI

# 3. Pull latest code
git pull origin main

# 4. Check backend service
sudo systemctl status vegakash-backend

# If not running:
sudo systemctl start vegakash-backend

# 5. Rebuild frontend
cd frontend
npm run build

# 6. Restart services
sudo systemctl restart vegakash-backend
sudo systemctl reload nginx

# 7. Test
curl https://vegaktools.com/api/v1/health
```

## Verify Fix

Visit these URLs to test:
- https://vegaktools.com/api/v1/health (should return `{"status":"healthy"}`)
- https://vegaktools.com/budget-planner (try Calculate Summary button)
- https://vegaktools.com/travel-budget (try Generate Travel Budget)

## If Still Not Working

### Check Backend Logs:
```bash
ssh u277936268@vegaktools.com
sudo journalctl -u vegakash-backend -f
```

### Check Nginx Logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Verify OpenAI API Key:
```bash
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/backend
cat .env | grep OPENAI_API_KEY
```

If missing:
```bash
echo "OPENAI_API_KEY=sk-proj-your-key-here" > .env
echo "OPENAI_MODEL=gpt-4o-mini" >> .env
chmod 600 .env
sudo systemctl restart vegakash-backend
```

## Common Issues

1. **Backend not running**: Service needs to be started/restarted
2. **API key missing**: Backend can't start without OpenAI key
3. **Port 8000 blocked**: Check firewall or process conflicts
4. **Nginx misconfiguration**: Check `/etc/nginx/sites-available/vegaktools.com`

## Support Commands

```bash
# Check what's running on port 8000
sudo lsof -i :8000

# Manually start backend (for testing)
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/backend
source venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Check nginx config
sudo nginx -t
```
