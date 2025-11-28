# Quick Start Guide for VegaKash.AI

## 🚀 Quick Start (Recommended)

### Option 1: Using the Setup Script

1. **Open PowerShell** in the project root directory
2. **Run the setup script**:
   ```powershell
   .\start.ps1
   ```
3. Follow the prompts to set your OpenAI API key
4. Both backend and frontend will start automatically!

### Option 2: Manual Setup

#### Backend

```powershell
# Create virtual environment
python -m venv backend\venv

# Activate virtual environment
.\backend\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend\requirements.txt

# Set API key
$env:OPENAI_API_KEY="your-api-key-here"

# Start backend
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend (Open a new terminal)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

## 📝 Environment Setup

### Get OpenAI API Key

1. Visit: https://platform.openai.com/api-keys
2. Create an account or sign in
3. Click "Create new secret key"
4. Copy the key

### Set API Key

**For current session** (PowerShell):
```powershell
$env:OPENAI_API_KEY="sk-your-key-here"
```

**Permanent** (Add to PowerShell profile):
```powershell
notepad $PROFILE
# Add this line:
$env:OPENAI_API_KEY="sk-your-key-here"
```

## 🧪 Test the Application

1. Open browser to `http://localhost:3000`
2. Click "Use Sample Data" button
3. Click "Calculate Summary"
4. Click "Generate AI Plan"

## 🛠️ Troubleshooting

### Backend won't start
- Check if Python is installed: `python --version`
- Ensure virtual environment is activated
- Verify API key is set: `echo $env:OPENAI_API_KEY`

### Frontend won't start
- Check if Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Check for port conflicts (change port in vite.config.js)

### CORS errors
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`

### AI generation fails
- Verify OpenAI API key is correct
- Check API credits/billing at platform.openai.com
- Review backend logs for detailed error messages

## 📚 Next Steps

- Read the full README.md for detailed documentation
- Explore API docs at http://localhost:8000/api/docs
- Customize the UI in frontend/src/styles/
- Modify AI prompts in backend/services/ai_planner.py

## 💡 Tips

- Use "Use Sample Data" to quickly test the application
- Backend auto-reloads on code changes (--reload flag)
- Frontend auto-reloads via Vite HMR
- Check browser console and terminal for errors

---

**Need help?** Check the main README.md or review the code comments!
