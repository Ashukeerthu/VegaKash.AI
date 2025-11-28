# VegaKash.AI - AI Budget Planner & Savings Assistant

A full-stack web application that helps users plan their finances with AI-powered recommendations. Enter your income, expenses, and goals to get personalized budget breakdowns and savings strategies.

## 🌟 Features

- **Financial Summary**: Instant calculation of income, expenses, savings rate, and debt-to-income ratio
- **AI-Powered Planning**: Personalized budget recommendations using OpenAI
- **50-30-20 Rule**: Visual breakdown of recommended budget allocation
- **Expense Optimization**: AI-generated tips to reduce spending
- **Investment Guidance**: Generic investment allocation suggestions (SIP, FD, PPF, etc.)
- **Debt Strategy**: Customized loan repayment recommendations
- **Action Items**: Concrete 30-day action checklist
- **No Login Required**: Privacy-focused - data is processed but not stored

## 🏗️ Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** - Modern web framework
- **Pydantic** - Data validation
- **OpenAI API** - AI plan generation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling (no external UI library)

## 📁 Project Structure

```
VegaKash.AI/
├── backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app & endpoints
│   ├── config.py               # Configuration & environment variables
│   ├── schemas.py              # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── calculations.py     # Financial calculations
│   │   └── ai_planner.py       # OpenAI integration
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx
│   │   │   ├── FinancialForm.jsx
│   │   │   ├── SummaryPanel.jsx
│   │   │   ├── AIPlanPanel.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js          # API client
│   │   ├── styles/
│   │   │   ├── index.css       # Global styles
│   │   │   └── App.css         # Component styles
│   │   ├── utils/
│   │   │   └── helpers.js      # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.10 or higher**
- **Node.js 18 or higher**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

1. **Navigate to backend directory**
   ```powershell
   cd backend
   ```

2. **Create a virtual environment** (recommended)
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```powershell
   # Copy the example file
   copy .env.example .env
   
   # Edit .env and add your actual OpenAI API key
   # OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
   
   **⚠️ IMPORTANT**: Never commit your `.env` file to git! It's already in `.gitignore` for security.
   
   See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

5. **Run the backend server**
   ```powershell
   # From the project root directory
   cd ..
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at: `http://localhost:8000`
   
   API documentation: `http://localhost:8000/api/docs`

### Frontend Setup

1. **Open a new PowerShell terminal**

2. **Navigate to frontend directory**
   ```powershell
   cd frontend
   ```

3. **Install dependencies**
   ```powershell
   npm install
   ```

4. **Start the development server**
   ```powershell
   npm run dev
   ```

   Frontend will be available at: `http://localhost:3000`

## 🧪 Testing the Application

1. **Verify backend is running**: Visit `http://localhost:8000/health`
   - Should return: `{"status":"ok","message":"VegaKash.AI API is running"}`

2. **Open the frontend**: Visit `http://localhost:3000`

3. **Use Sample Data**: Click the "📋 Use Sample Data" button to auto-fill the form

4. **Calculate Summary**: Click "🧮 Calculate Summary" to see financial metrics

5. **Generate AI Plan**: Click "✨ Generate AI Plan" to get personalized recommendations

## 📊 API Endpoints

### Health Check
```
GET /health
```
Returns API status.

### Calculate Summary
```
POST /api/calculate-summary
Content-Type: application/json

{
  "currency": "INR",
  "monthly_income_primary": 75000,
  "monthly_income_additional": 5000,
  "expenses": { ... },
  "goals": { ... },
  "loans": [ ... ]
}
```

### Generate AI Plan
```
POST /api/generate-ai-plan
Content-Type: application/json

{
  "input": { ... },
  "summary": { ... }
}
```

## 🌐 Hosting on Hostinger

### Backend Deployment

1. **Choose a hosting plan** that supports Python (VPS or Cloud Hosting)

2. **Upload backend files** via FTP or Git

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables** in Hostinger control panel:
   - `OPENAI_API_KEY=your-key`

5. **Configure WSGI server** (use Gunicorn):
   ```bash
   pip install gunicorn
   gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

6. **Update CORS settings** in `backend/main.py`:
   ```python
   allow_origins=[
       "https://yourdomain.com",
       # other origins...
   ]
   ```

### Frontend Deployment

1. **Build the production bundle**:
   ```powershell
   cd frontend
   npm run build
   ```

2. **Upload the `dist` folder** to your web hosting directory

3. **Update API URL**: Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://api.yourdomain.com
   ```

4. **Configure web server** to serve `index.html` for all routes

## 🔐 Security Notes

- **API Keys**: Never commit API keys to version control
- **CORS**: Update allowed origins before production deployment
- **Environment Variables**: Use secure methods to store secrets in production
- **HTTPS**: Always use HTTPS in production for secure communication

## 🛠️ Development Tips

### Backend Development

- **Auto-reload**: The `--reload` flag automatically restarts the server on code changes
- **API Docs**: Visit `/api/docs` for interactive API documentation (Swagger UI)
- **Logging**: Check console output for request logs and errors

### Frontend Development

- **Hot Reload**: Vite automatically refreshes on file changes
- **React DevTools**: Install browser extension for debugging
- **Console**: Check browser console for errors and API responses

## 📝 Phase 2 Roadmap (Future Features)

- [ ] User authentication and accounts
- [ ] Save and track multiple financial plans
- [ ] Dashboard with financial progress over time
- [ ] Export plans as PDF/Excel
- [ ] Multiple loan management
- [ ] Investment tracking
- [ ] Bill reminders and notifications
- [ ] Mobile app (React Native)

## 🔒 Security

### Environment Variables
- **Never commit `.env` files** - Already protected by `.gitignore`
- **Use `.env.example`** - Contains only placeholder values for reference
- **Production deployment** - Set environment variables through your hosting provider's control panel
- **API key rotation** - Use different keys for development and production

For detailed deployment and security guidelines, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Contributing

This is a Phase 1 implementation. Contributions and suggestions are welcome!

## ⚠️ Disclaimer

This application provides general educational guidance only and is NOT certified financial advice. Always consult with a certified financial advisor for personalized recommendations. The AI recommendations are based on general financial principles and may not be suitable for all situations.

## 📄 License

This project is for educational purposes. Modify and use as needed.

## 💡 Support

For issues or questions:
1. Check the API documentation at `/api/docs`
2. Review browser console for frontend errors
3. Check backend terminal for server logs
4. Ensure OpenAI API key is correctly set

---

**Built with ❤️ for smart financial planning**
