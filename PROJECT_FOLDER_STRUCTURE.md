# 🗂️ VegaKash.AI - Complete Project Structure

**Date**: December 8, 2025  
**Branch**: Feature  
**Purpose**: Clear, organized view of entire project architecture

---

## 📁 Root Directory Overview

```
VegaKash.AI/
├── backend/                    # FastAPI Python Backend
├── frontend/                   # React + Vite Frontend
├── scripts/                    # Utility scripts
├── .github/                    # GitHub workflows
├── *.md                       # Documentation files (40+ files)
├── docker-compose.yml         # Docker configuration
├── nginx.conf.example         # NGINX config template
└── Various deployment scripts
```

---

## 🔧 Backend Structure (`backend/`)

```
backend/
├── main.py                    # FastAPI application entry point
├── config.py                  # Configuration & environment variables
│
├── routes/                    # API Route Handlers
│   ├── __init__.py
│   ├── ai_planner.py         # Original AI budget planner routes
│   ├── budget_planner_v12.py # V1.2 Budget planner routes (NEW)
│   └── health.py             # Health check endpoint
│
├── services/                  # Business Logic Layer
│   ├── __init__.py
│   ├── ai_planner.py         # AI service (OpenAI integration)
│   ├── budget_calculator.py  # Budget calculation logic
│   └── budget_planner_service_v12.py # V1.2 Service (NEW)
│
├── schemas/                   # Pydantic Data Models (Canonical)
│   ├── __init__.py
│   └── budget_planner_v12.py # V1.2 Pydantic models (NEW)
│
├── legacy/                    # ⚠️ DEPRECATED FILES (Do not use)
│   ├── README.md             # Explains why files are legacy
│   ├── models.py             # Old database models (unused)
│   └── schemas.py            # Old monolithic schemas (moved)
│
├── utils/                     # Utility Functions
│   ├── __init__.py
│   ├── city_tier.py          # City tier & COL calculations (NEW)
│   ├── alert_detector.py     # Alert detection logic (NEW)
│   └── validators.py         # Input validation helpers
│
├── middleware/                # FastAPI Middleware
│   ├── cors.py               # CORS configuration
│   ├── rate_limiter.py       # Rate limiting
│   └── security.py           # Security headers
│
├── tests/                     # Unit & Integration Tests
│   ├── __init__.py
│   ├── conftest.py           # Pytest fixtures
│   ├── test_ai_planner.py
│   └── test_budget_calculator.py
│
├── templates/                 # Email/Report Templates
│   └── (if needed)
│
├── venv/                      # Python virtual environment
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (NOT in git)
├── .env.example              # Example environment file
├── Dockerfile                # Docker image config
└── start.ps1/start.sh        # Startup scripts
```

### Key Backend Files:
- **main.py**: Application startup, route registration, CORS, middleware
- **config.py**: Environment variables, OpenAI keys, API URLs
- **routes/budget_planner_v12.py**: V1.2 endpoints (`/generate`, `/rebalance`)
- **services/budget_planner_service_v12.py**: Core business logic
- **utils/city_tier.py**: City tier database & COL calculations

---

## ⚛️ Frontend Structure (`frontend/`)

```
frontend/
├── index.html                 # HTML entry point
├── vite.config.js            # Vite bundler configuration
├── package.json              # npm dependencies
│
├── public/                    # Static Assets
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│
├── src/                       # Source Code (Main)
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Root component (legacy planner UI)
│   ├── AppRouter.jsx         # ✅ ACTIVE Router (Production)
│   ├── AppRouterGlobal.jsx   # ⚠️ EXPERIMENTAL Router (Country detection)
│   ├── config.js             # Frontend config (API URLs)
│   │
│   ├── components/            # Reusable UI Components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SEO.jsx
│   │   ├── CurrencySelector.jsx
│   │   ├── CitySelector.jsx  # V1.2 City picker (NEW)
│   │   ├── GoogleAnalytics.jsx
│   │   ├── CookieConsent.jsx
│   │   └── AdsPlaceholder.jsx
│   │
│   ├── modules/              # Feature Modules (Organized)
│   │   ├── core/             # Core UI Components
│   │   │   ├── ui/           # Button, Card, Input, Slider
│   │   │   ├── layout/       # PageLayout, Container
│   │   │   ├── seo/          # SEO utilities
│   │   │   └── utils/        # Helper functions
│   │   │
│   │   ├── calculators/      # Financial Calculators
│   │   │   ├── emi/          # EMI Calculator
│   │   │   ├── sip/          # SIP Calculator
│   │   │   ├── fd/           # FD Calculator
│   │   │   ├── rd/           # RD Calculator
│   │   │   ├── tax/          # Income Tax Calculator
│   │   │   └── autoloan/     # Auto Loan Calculator
│   │   │
│   │   └── budgets/          # Budget Planners
│   │       ├── monthly/      # AI Monthly Budget (V1.2)
│   │       ├── wedding/      # Wedding Budget (Coming)
│   │       ├── trip/         # Trip Budget (Coming)
│   │       ├── event/        # Event Budget (Coming)
│   │       └── renovation/   # Renovation Budget (Coming)
│   │
│   ├── pages/                # Page Components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── CalculatorHub.jsx
│   │   ├── VideoTutorials.jsx
│   │   ├── FinancialGuides.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── TermsAndConditions.jsx
│   │   ├── Disclaimer.jsx
│   │   ├── calculators/      # Individual calculator pages
│   │   │   ├── EMICalculator.jsx
│   │   │   ├── FDCalculator.jsx
│   │   │   └── ...
│   │   └── blog/             # Blog pages
│   │       ├── BlogIndex.jsx
│   │       └── CreateMonthlyBudgetAI.jsx
│   │
│   ├── router/               # Routing Configuration
│   │   ├── index.js          # Router exports
│   │   └── routes.jsx        # All route definitions
│   │
│   ├── services/             # API Communication
│   │   └── api.js            # Axios API client
│   │
│   ├── utils/                # Utility Functions
│   │   ├── helpers.js        # Format, currency helpers
│   │   ├── cityTierData.js   # City database (V1.2 NEW)
│   │   └── structuredData.js # SEO schemas
│   │
│   ├── schemas/              # Type Definitions
│   │   └── budgetPlanner.js  # V1.2 schemas (NEW)
│   │
│   └── styles/               # CSS Stylesheets
│       ├── App.css           # Global styles
│       ├── Calculator.css    # Calculator styles
│       ├── Blog.css          # Blog styles
│       ├── Pages.css         # Page-level styles
│       ├── Navbar.css
│       ├── Footer.css
│       ├── CurrencySelector.css
│       └── variables.css     # CSS variables (NEW)
│
├── scripts/                   # Build Scripts
│   └── generate-sitemap.mjs
│
└── docs/                      # Frontend documentation
    └── (if needed)
```

### Key Frontend Files:
- **main.jsx**: React app initialization
- **App.jsx**: Root component with routing
- **config.js**: API base URLs, environment configs
- **modules/budgets/monthly/**: V1.2 Budget Planner
- **utils/cityTierData.js**: City tier database (90+ cities)
- **services/api.js**: All API calls to backend

---

## 📜 Scripts (`scripts/`)

```
scripts/
├── generate-sitemap.mjs       # Generate sitemap.xml
└── (other utility scripts)
```

---

## 📚 Documentation Files (Root)

**Too many to list (40+ files).** Key documents:

### V1.2 Budget Planner Documentation:
- `BUDGET_PLANNER_V1.2_START_HERE.md` - **START HERE**
- `BUDGET_PLANNER_V1.2_REQUIREMENTS.md` - Complete FRD
- `BUDGET_PLANNER_V1.2_IMPLEMENTATION_GUIDE.md` - Dev guide
- `BUDGET_PLANNER_V1.2_QUICK_REFERENCE.md` - Visual reference
- `BUDGET_PLANNER_V1.2_DOCUMENTATION_INDEX.md` - Navigation

### Project Documentation:
- `README.md` - Project overview
- `QUICKSTART.md` - Getting started
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `DESIGN_SYSTEM.md` - Design guidelines
- `BRAND_GUIDELINES.md` - Brand assets
- `STATUS.md` - Current project status

### Implementation Tracking:
- `PHASE_1_BACKEND_COMPLETE.md`
- `PHASE_2_COMPLETION_SUMMARY.md`
- `V1.2_IMPLEMENTATION_COMPLETE.md`
- `MIGRATION_COMPLETE.md`

---

## 🎯 Key File Relationships

### Budget Planner V1.2 Flow:

```
User Browser
    ↓
frontend/src/modules/budgets/monthly/MonthlyBudget.jsx
    ↓ (uses)
frontend/src/utils/cityTierData.js (city lookup)
    ↓ (calls API via)
frontend/src/services/api.js
    ↓ (HTTP POST)
backend/routes/budget_planner_v12.py (/api/v1/ai/budget/generate)
    ↓ (calls service)
backend/services/budget_planner_service_v12.py
    ↓ (uses utilities)
backend/utils/city_tier.py (COL calculations)
backend/utils/alert_detector.py (risk detection)
    ↓ (returns JSON)
frontend displays results
```

### Calculator Flow:

```
User Browser
    ↓
frontend/src/pages/calculators/EMICalculator.jsx
    ↓ (uses)
frontend/src/modules/calculators/emi/emiUtils.js (calculations)
    ↓ (displays with)
frontend/src/components/CurrencySelector.jsx
frontend/src/styles/Calculator.css
```

---

## 🔑 Important Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `.env` | Backend environment variables | `backend/.env` |
| `config.js` | Frontend API URLs | `frontend/src/config.js` |
| `vite.config.js` | Vite bundler config | `frontend/vite.config.js` |
| `requirements.txt` | Python dependencies | `backend/requirements.txt` |
| `package.json` | Frontend dependencies | `frontend/package.json` |

---

## 🚀 How to Run

### Backend:

#### Linux / macOS
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

#### Windows (PowerShell)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

### Frontend:
```bash
cd frontend
npm run dev
```

---

## 📦 Key Dependencies

### Backend (Python):
- FastAPI - Web framework
- Uvicorn - ASGI server
- OpenAI - AI integration
- Pydantic - Data validation
- slowapi - Rate limiting

### Frontend (React):
- React 18 - UI library
- Vite - Build tool
- React Router - Navigation
- Axios - HTTP client
- Recharts - Charts (if used)

---

## 🗺️ Navigation Guide

### For Backend Development:
1. Start at: `backend/main.py`
2. Routes: `backend/routes/budget_planner_v12.py`
3. Logic: `backend/services/budget_planner_service_v12.py`
4. Utils: `backend/utils/`

### For Frontend Development:
1. Start at: `frontend/src/main.jsx`
2. Budget Planner: `frontend/src/modules/budgets/monthly/`
3. Calculators: `frontend/src/modules/calculators/`
4. Components: `frontend/src/components/`

### For Documentation:
1. Start at: `BUDGET_PLANNER_V1.2_START_HERE.md`
2. Requirements: `BUDGET_PLANNER_V1.2_REQUIREMENTS.md`
3. Dev Guide: `BUDGET_PLANNER_V1.2_IMPLEMENTATION_GUIDE.md`

---

## ⚠️ Important Notes

1. **DO NOT commit** `.env` files (they're in `.gitignore`)
2. **Backend runs on**: `http://localhost:8000`
3. **Frontend runs on**: `http://localhost:3000`
4. **API docs available at**: `http://localhost:8000/docs`
5. **Production domain**: `https://vegaktools.com`

---

## 🎯 Common Tasks & File Locations

| Task | Files to Edit |
|------|---------------|
| Add new API endpoint | `backend/routes/`, `backend/services/` |
| Add new calculator | `frontend/src/modules/calculators/` |
| Modify budget planner | `frontend/src/modules/budgets/monthly/` |
| Update city database | `frontend/src/utils/cityTierData.js`, `backend/utils/city_tier.py` |
| Change styling | `frontend/src/styles/` |
| Add new route | `frontend/src/router/routes.jsx` |
| Update SEO | `frontend/src/components/SEO.jsx`, `frontend/public/sitemap.xml` |

---

## 🔍 File Count Summary

- **Backend**: ~30 Python files
- **Frontend**: ~100+ JSX/JS files
- **Styles**: ~15 CSS files
- **Documentation**: ~40 MD files
- **Total**: ~200+ files

---

**This structure is designed for scalability, maintainability, and clear separation of concerns.**

**Any questions about a specific file or folder? Refer to this document!**
