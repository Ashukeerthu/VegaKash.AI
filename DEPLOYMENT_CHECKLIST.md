# Pre-Deployment Checklist for VegaKash.AI

Complete this checklist before deploying to Hostinger.

## ✅ Backend Preparation

- [ ] `.env` file created with your OpenAI API key (NOT `.env.example`)
- [ ] Tested locally: `http://localhost:8000/api/v1/health` returns `{"status":"ok"}`
- [ ] All backend files ready in `backend/` folder
- [ ] `requirements-prod.txt` present
- [ ] `gunicorn_config.py` present
- [ ] Startup scripts (`start.sh`, `start.ps1`) present

## ✅ Frontend Preparation

- [ ] **CRITICAL**: Updated `frontend/src/config.js` with your actual domain:
  ```javascript
  production: 'https://yourdomain.com'  // Change this!
  ```
- [ ] Production build completed: `npm run build`
- [ ] `dist/` folder created with all files
- [ ] Tested build locally (optional):
  ```bash
  npm run preview
  ```

## ✅ Files to Upload

### Backend Files (Upload to `~/vegakash-backend/`)
```
backend/
├── main.py
├── config.py
├── schemas.py
├── requirements-prod.txt
├── gunicorn_config.py
├── start.sh
├── start.ps1
├── services/
│   ├── __init__.py
│   ├── calculations.py
│   └── ai_planner.py
└── .env (create on server)
```

### Frontend Files (Upload to `~/public_html/`)
```
dist/
├── index.html
└── assets/
    ├── index-XXXXX.css
    └── index-XXXXX.js
```

## ✅ Server Requirements

- [ ] Python 3.10 or higher installed
- [ ] pip and python3-venv installed
- [ ] Nginx or Apache web server running
- [ ] SSL certificate (Let's Encrypt or Hostinger SSL)
- [ ] Domain DNS configured to point to your server

## ✅ Environment Variables

Create `.env` file on server with:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
API_TIMEOUT=60
```

## ✅ Security Checklist

- [ ] `.env` file has restricted permissions (chmod 600)
- [ ] `.env` is NOT committed to git (check `.gitignore`)
- [ ] Using HTTPS/SSL certificate
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Rate limiting enabled in backend
- [ ] CORS configured for your production domain

## ✅ Post-Deployment Testing

1. **Backend Health Check**:
   ```bash
   curl https://yourdomain.com/api/v1/health
   ```
   Expected: `{"status":"ok","message":"VegaKash.AI API is running"}`

2. **Frontend Loads**:
   - Visit `https://yourdomain.com`
   - Should see VegaKash.AI landing page
   - No console errors

3. **Calculate Summary**:
   - Fill form or use "Use Sample Data"
   - Click "Calculate Summary"
   - Should show financial breakdown

4. **AI Plan Generation**:
   - After calculating summary
   - Click "Generate AI Plan"
   - Should generate personalized plan (15-30 seconds)

5. **Mobile Responsive**:
   - Test on mobile device or browser DevTools
   - All buttons should be tappable
   - Text should be readable

## ⚠️ Common Issues & Solutions

### Issue: API calls fail with CORS error
**Solution**: 
- Update `frontend/src/config.js` production URL
- Rebuild frontend: `npm run build`
- Re-upload `dist/` files

### Issue: Backend not starting
**Solution**:
```bash
cd ~/vegakash-backend
source venv/bin/activate
python -m pip install -r requirements-prod.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Issue: "OpenAI API key not found" error
**Solution**:
```bash
cd ~/vegakash-backend
nano .env  # Add your API key
chmod 600 .env
sudo systemctl restart vegakash
```

### Issue: Frontend shows blank page
**Solution**:
- Check browser console for errors
- Verify all files from `dist/` folder uploaded
- Check `.htaccess` or Nginx config

## 📦 Quick Deploy Package

Create a deployment package:

```bash
# Backend
cd backend
zip -r vegakash-backend.zip . -x "venv/*" -x "__pycache__/*" -x "*.pyc"

# Frontend
cd frontend/dist
zip -r vegakash-frontend.zip .
```

Upload these zip files and extract on server.

## 🚀 Ready to Deploy?

If all checkboxes are checked, follow the detailed guide:
👉 [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)

## 📞 Need Help?

- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for environment setup
- Check [README.md](./README.md) for local testing
- Contact Hostinger support for server-specific issues

---

**Last Updated**: November 28, 2025
**Application Version**: 1.0.0 (Phase 1)
