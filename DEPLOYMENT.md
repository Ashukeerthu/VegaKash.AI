# VegaKash.AI - Deployment Guide

## Environment Variables Setup

### 🔒 Security Best Practice

**NEVER commit your actual `.env` file to git!** The `.env` file contains sensitive API keys and should only exist locally and on your production server.

### Local Development Setup

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` and add your actual API key:**
   ```
   OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

3. **Verify `.env` is in `.gitignore`:**
   - The `.gitignore` file already includes `.env`
   - This ensures your API key is never committed to git

### Production Deployment (Hostinger)

When deploying to Hostinger, you'll need to set environment variables through their control panel or configuration:

#### Option 1: Hostinger Control Panel
1. Log into your Hostinger control panel
2. Navigate to your application settings
3. Find "Environment Variables" or "App Settings"
4. Add: `OPENAI_API_KEY=your-actual-api-key-here`

#### Option 2: Create .env on Server (via SSH/FTP)
1. Connect to your Hostinger server via SSH or FTP
2. Navigate to your backend directory
3. Create `.env` file directly on the server:
   ```bash
   echo "OPENAI_API_KEY=your-actual-api-key-here" > .env
   ```
4. Set proper permissions:
   ```bash
   chmod 600 .env  # Only owner can read/write
   ```

#### Option 3: Using Hostinger's File Manager
1. Use Hostinger's File Manager
2. Navigate to backend directory
3. Create new file named `.env`
4. Add your API key content
5. Save the file

### Frontend Configuration

For production deployment, update `frontend/src/config.js`:

```javascript
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://api.yourdomain.com'  // Replace with your actual domain
  : 'http://localhost:8000';
```

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | `sk-proj-...` |

### Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ `.env.example` contains only placeholder values
- ✅ Never commit real API keys to version control
- ✅ Use environment variables on production server
- ✅ Set restrictive file permissions on `.env` (600 or 400)
- ✅ Use different API keys for development and production (recommended)

### Troubleshooting

**"OpenAI API key not found" error:**
1. Check if `.env` file exists in `backend/` directory
2. Verify the format: `OPENAI_API_KEY=sk-proj-...` (no quotes, no spaces)
3. Restart the backend server after creating/modifying `.env`

**API key exposed on GitHub:**
1. Immediately revoke the exposed API key at https://platform.openai.com/api-keys
2. Generate a new API key
3. Update your local `.env` file with the new key
4. Never commit `.env` to git

### Deployment Commands

```bash
# Backend deployment
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend deployment
cd frontend
npm install
npm run build
# Deploy the 'dist' folder to your web server
```

## Additional Resources

- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Hostinger Tutorials](https://www.hostinger.com/tutorials/)
- [Environment Variables Best Practices](https://12factor.net/config)
