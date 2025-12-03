# VegaKash.AI - AI Budget Planner & Savings Assistant

[![CI](https://github.com/Ashukeerthu/VegaKash.AI/actions/workflows/ci.yml/badge.svg)](https://github.com/Ashukeerthu/VegaKash.AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready, full-stack web application that helps users plan their finances with AI-powered recommendations. Enter your income, expenses, and goals to get personalized budget breakdowns and savings strategies.

🌐 **Live Demo**: [https://www.vegaktools.com](https://www.vegaktools.com)

---

## 🌟 Features

- **Financial Summary**: Instant calculation of income, expenses, savings rate, and debt-to-income ratio
- **AI-Powered Planning**: Personalized budget recommendations using OpenAI
- **50-30-20 Rule**: Visual breakdown of recommended budget allocation
- **Financial Calculators**: EMI, SIP, FD, RD, Auto Loan, Tax calculators
- **Expense Optimization**: AI-generated tips to reduce spending
- **Investment Guidance**: Generic investment allocation suggestions (SIP, FD, PPF, etc.)
- **Debt Strategy**: Customized loan repayment recommendations
- **PDF Export**: Download your financial plan as PDF
- **Multi-Currency Support**: INR, USD, EUR, GBP, AUD, CAD, JPY
- **No Login Required**: Privacy-focused - data is processed but not stored

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                    (React 18 + Vite + CSS3)                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Production Server                          │
│                  (Nginx/Hostinger/VPS)                          │
├─────────────────────────┬───────────────────────────────────────┤
│   Static Frontend       │         Backend API                   │
│   (dist/ files)         │   (Gunicorn + Uvicorn)               │
└─────────────────────────┴───────────────────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │   OpenAI API    │
                          │  (GPT-4o-mini)  │
                          └─────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router, Axios, CSS3 |
| **Backend** | Python 3.11+, FastAPI, Pydantic, OpenAI SDK |
| **Server** | Gunicorn + Uvicorn (ASGI) |
| **Container** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **PDF Generation** | ReportLab |

---

## 📁 Project Structure

```
VegaKash.AI/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── backend/
│   ├── tests/                  # Unit tests
│   │   ├── conftest.py
│   │   ├── test_health.py
│   │   └── test_root.py
│   ├── services/
│   │   ├── ai_planner.py       # OpenAI integration
│   │   ├── calculations.py     # Financial calculations
│   │   └── pdf_generator*.py   # PDF export
│   ├── middleware/
│   │   └── security.py         # Security middleware
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration
│   ├── schemas.py              # Pydantic models
│   ├── Dockerfile              # Production Docker image
│   ├── gunicorn_config.py      # Gunicorn settings
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                    # (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── modules/            # Modular calculators
│   │   ├── pages/              # Page components
│   │   ├── router/             # React Router config
│   │   ├── services/           # API client
│   │   ├── styles/             # CSS files
│   │   └── utils/              # Helpers
│   ├── public/
│   │   ├── sitemap.xml
│   │   └── robots.txt
│   └── package.json
├── docker-compose.yml          # Multi-container setup
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Docker** (optional, for containerized deployment)

### Option 1: Local Development

```powershell
# Clone the repository
git clone https://github.com/Ashukeerthu/VegaKash.AI.git
cd VegaKash.AI

# Backend setup
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start backend
uvicorn main:app --reload --port 8000

# In a new terminal - Frontend setup
cd frontend
npm install
npm run dev
```

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/v1/docs

### Option 2: Docker Deployment

```bash
# Clone and navigate
git clone https://github.com/Ashukeerthu/VegaKash.AI.git
cd VegaKash.AI

# Create .env file
cp backend/.env.example backend/.env
# Edit backend/.env and add your OPENAI_API_KEY

# Build and run with Docker Compose
docker-compose up --build -d

# Check health
curl http://localhost:8000/health
```

---

## ⚙️ Environment Variables

Create `backend/.env` with these variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | - | Your OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model to use |
| `API_TIMEOUT` | No | `60` | API request timeout (seconds) |
| `ENVIRONMENT` | No | `development` | `development` or `production` |
| `PORT` | No | `8000` | Backend server port |
| `FRONTEND_URL` | No | `http://localhost:5173` | Allowed CORS origin |
| `PRODUCTION_DOMAIN` | No | `vegaktools.com` | Production domain |

**⚠️ SECURITY**: Never commit `.env` files! They're in `.gitignore`.

---

## 🧪 Running Tests

```powershell
cd backend

# Install test dependencies
pip install pytest pytest-cov httpx

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=. --cov-report=html

# Open coverage report
start htmlcov/index.html
```

---

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build -d

# Check container health
docker ps
docker inspect vegakash-backend --format='{{.State.Health.Status}}'
```

---

## 📊 API Endpoints

### Health & Monitoring

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Basic health check |
| `/ready` | GET | Readiness check for orchestrators |
| `/api/v1/stats` | GET | System statistics |

### Financial Calculations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/calculate-summary` | POST | Calculate financial summary |
| `/api/v1/generate-ai-plan` | POST | Generate AI-powered budget plan |
| `/api/v1/smart-recommendations` | POST | Get smart alerts and tips |
| `/api/v1/compare-debt-strategies` | POST | Compare debt repayment strategies |
| `/api/v1/export-pdf` | POST | Export plan as PDF |

### Rate Limits

- `/api/v1/calculate-summary`: 30 requests/minute
- `/api/v1/generate-ai-plan`: 5 requests/minute

---

## 🚢 Production Deployment

### 1. Build Frontend

```powershell
cd frontend
npm run build
# Output: frontend/dist/
```

### 2. Deploy Backend with Gunicorn

```bash
cd backend
gunicorn main:app \
  --config gunicorn_config.py \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker
```

### 3. Configure Nginx (Example)

```nginx
server {
    listen 80;
    server_name vegaktools.com www.vegaktools.com;

    # Frontend static files
    location / {
        root /var/www/vegaktools/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Environment Variables

Set these in your hosting provider's control panel or systemd service:

```bash
export OPENAI_API_KEY="your-key-here"
export ENVIRONMENT="production"
export PRODUCTION_DOMAIN="vegaktools.com"
```

---

## 🔒 Security

- ✅ **No hardcoded secrets** - All sensitive data via environment variables
- ✅ **CORS configured** - Restricted to specific origins
- ✅ **Rate limiting** - Prevents API abuse
- ✅ **Input validation** - Pydantic models for all inputs
- ✅ **Security headers** - Optional middleware available
- ✅ **Non-root Docker user** - Container runs as unprivileged user
- ✅ **Health checks** - `/health` and `/ready` endpoints

---

## 📝 Phase 2 Roadmap

- [ ] User authentication and accounts
- [ ] Database integration (PostgreSQL)
- [ ] Save and track multiple financial plans
- [ ] Dashboard with financial progress over time
- [ ] Redis caching for AI responses
- [ ] Multiple loan management
- [ ] Bill reminders and notifications
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## ⚠️ Disclaimer

This application provides general educational guidance only and is **NOT certified financial advice**. Always consult with a certified financial advisor for personalized recommendations.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 💡 Support

- 📖 [API Documentation](https://www.vegaktools.com/api/v1/docs)
- 🐛 [Report Issues](https://github.com/Ashukeerthu/VegaKash.AI/issues)
- 💬 [Discussions](https://github.com/Ashukeerthu/VegaKash.AI/discussions)

---

**Built with ❤️ for smart financial planning**
