# Budget Planner V1.2 - Phase 2 Implementation Instructions

## 🎯 Current Status
✅ Phase 1 Backend Development: 100% COMPLETE
- 6 backend files created (2,350+ lines)
- 40+ unit tests passing
- Complete documentation
- **Ready for Phase 2: API Integration**


## 📋 Phase 2 Tasks (What You Need to Do Now)

### Task 1: Create main.py (15 minutes)

**File**: `backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Import routes
from backend.routes import budget_planner

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="VegaKash.AI - Budget Planner API",
    description="AI-powered budget planning with cost-of-living intelligence",
    version="1.2.0",
    docs_url="/api/docs",
    redoc_url="/api/redocs",
)

# Add CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React dev server
        "http://localhost:5173",      # Vite dev server
        "http://localhost:8000",      # This server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router with budget planner routes
app.include_router(budget_planner.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "Budget Planner V1.2",
        "docs": "/api/docs",
    }

# Health check endpoint
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "Budget Planner",
        "version": "1.2.0",
    }

# Global startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Budget Planner API starting up...")

# Global shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Budget Planner API shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info",
    )
```

### Task 2: Create requirements.txt (5 minutes)

**File**: `backend/requirements.txt`

```
# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0

# Data Validation
pydantic==2.5.0
pydantic-settings==2.1.0

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2

# Utilities
python-dateutil==2.8.2
python-multipart==0.0.6

# Production (optional)
gunicorn==21.2.0
```

### Task 3: Verify Installation (10 minutes)

```bash
# 1. Navigate to project
cd C:\Users\pc\OneDrive\Documents\Webtool\VegaKash.AI

# 2. Install requirements
pip install -r backend/requirements.txt

# 3. Run tests to verify everything works
pytest backend/tests/unit/test_budget_planner.py -v

# Expected: All 40+ tests PASS ✅
```

### Task 4: Start Development Server (5 minutes)

```bash
# 1. From project root
cd C:\Users\pc\OneDrive\Documents\Webtool\VegaKash.AI

# 2. Start the server
python backend/main.py

# 3. Server should start on http://localhost:8000
# 4. Open http://localhost:8000/api/docs to see Swagger UI
# 5. Open http://localhost:8000/api/redocs for ReDoc
```

### Task 5: Test Endpoints with Sample Data (15 minutes)

**Using Swagger UI** (Easiest):
1. Go to `http://localhost:8000/api/docs`
2. Find `/api/v1/ai/budget/generate` endpoint
3. Click "Try it out"
4. Paste this JSON:

```json
{
  "income": {
    "monthly_income": 100000,
    "currency": "INR"
  },
  "city": {
    "country": "India",
    "state": "Maharashtra",
    "city": "Mumbai",
    "city_tier": "tier_1",
    "col_multiplier": 1.25
  },
  "household": {
    "family_size": 4,
    "lifestyle": "moderate"
  },
  "fixed_expenses": {
    "rent": 20000,
    "utilities": 2000,
    "insurance": 2000,
    "medical": 1000,
    "other": 0
  },
  "variable_expenses": {
    "groceries": 8000,
    "transport": 3000,
    "subscriptions": 500,
    "entertainment": 3000,
    "shopping": 5000,
    "dining_out": 3000,
    "other": 0
  },
  "loans": [
    {
      "principal": 500000,
      "rate": 8.5,
      "tenure_months": 60,
      "issuer": "Bank"
    }
  ],
  "goals": [
    {
      "name": "Vacation",
      "target": 100000,
      "target_months": 12,
      "priority": 3
    }
  ],
  "mode": "smart_balanced"
}
```

5. Click "Execute"
6. Should return budget with split, categories, alerts, explanation ✅

**Using curl** (Terminal):
```bash
curl -X POST "http://localhost:8000/api/v1/ai/budget/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "income": {"monthly_income": 100000, "currency": "INR"},
    "city": {"country": "India", "state": "Maharashtra", "city": "Mumbai", "city_tier": "tier_1", "col_multiplier": 1.25},
    "household": {"family_size": 4, "lifestyle": "moderate"},
    "fixed_expenses": {"rent": 20000, "utilities": 2000, "insurance": 2000, "medical": 1000, "other": 0},
    "variable_expenses": {"groceries": 8000, "transport": 3000, "subscriptions": 500, "entertainment": 3000, "shopping": 5000, "dining_out": 3000, "other": 0},
    "loans": [{"principal": 500000, "rate": 8.5, "tenure_months": 60, "issuer": "Bank"}],
    "goals": [{"name": "Vacation", "target": 100000, "target_months": 12, "priority": 3}],
    "mode": "smart_balanced"
  }'
```


## ✅ Verification Checklist for Phase 2

After completing tasks above, verify:

```
Server Setup:
- [ ] backend/main.py created
- [ ] backend/requirements.txt created
- [ ] All dependencies installed
- [ ] Server starts without errors
- [ ] Server runs on http://localhost:8000

API Health:
- [ ] http://localhost:8000/ returns status
- [ ] http://localhost:8000/health returns healthy
- [ ] http://localhost:8000/api/docs opens Swagger UI
- [ ] http://localhost:8000/api/redocs opens ReDoc

Endpoint Testing:
- [ ] GET /api/v1/ai/budget/health ✅
- [ ] GET /api/v1/ai/budget/budget-modes ✅
- [ ] GET /api/v1/ai/budget/lifestyle-options ✅
- [ ] POST /api/v1/ai/budget/generate (sample request) ✅
- [ ] POST /api/v1/ai/budget/rebalance (if you create rebalance request) ✅

Error Handling:
- [ ] Invalid income returns 400 error
- [ ] Missing fields return 422 validation error
- [ ] Invalid city tier returns 400 error
- [ ] Invalid lifestyle returns 400 error

Unit Tests:
- [ ] All 40+ tests pass: pytest backend/tests/unit/ -v
- [ ] No warnings or errors in output

Ready for Phase 3:
- [ ] Server is stable
- [ ] All endpoints working
- [ ] All tests passing
- [ ] Ready for frontend integration
```


## 🎯 Expected Response from /generate

When you POST to `/api/v1/ai/budget/generate`, you should get:

```json
{
  "success": true,
  "budget_plan": {
    "monthly_income": 100000,
    "budget_split": {
      "needs_percent": 60.0,
      "wants_percent": 20.0,
      "savings_percent": 20.0
    },
    "budget_amounts": {
      "needs": 60000,
      "wants": 20000,
      "savings": 20000
    },
    "categories": {
      "needs": {
        "rent": 20000,
        "utilities": 1200,
        "groceries": 4800,
        "transport": 1800,
        "insurance": 1200,
        "medical": 600,
        "emi": 8650,
        "other": 21750
      },
      "wants": {
        "dining": 1438,
        "entertainment": 1438,
        "shopping": 3031,
        "subscriptions": 239,
        "other": 12854
      },
      "savings": {
        "emergency": 8000,
        "sip": 8000,
        "fd_rd": 3000,
        "goals": 1000
      }
    },
    "alerts": [
      {
        "code": "HIGH_EMI",
        "message": "High loan burden: 8.65% of income",
        "severity": "warning",
        "suggestion": "Monitor your EMI payments..."
      }
    ],
    "explanation": "Your personalized budget plan...",
    "metadata": {
      "city": "Mumbai",
      "city_tier": "tier_1",
      "col_multiplier": 1.25,
      "notes": "Budget generated for Mumbai, tier_1 city..."
    },
    "generated_at": "2024-01-15T10:30:00Z"
  }
}
```


## 🚀 Next Steps After Phase 2

Once Phase 2 is complete:

### Phase 3: Frontend Input Components
- Create React form components
- Connect to backend API
- Display budget results
- Add form validation

### Phase 4: Output Display
- Show budget visualization
- Display category breakdown
- Show alerts with colors
- Add rebalancing UI

### Phase 5: LocalStorage
- Save budgets locally
- Manage history
- Export functionality

### Phase 6: Advanced Features
- PDF export
- AI recommendations
- Performance optimization


## 📚 Documentation to Reference

1. **PHASE_1_BACKEND_COMPLETE.md** - What was created
2. **PHASE_2_QUICK_START.md** - Quick reference
3. **BUDGET_PLANNER_V1.2_REQUIREMENTS.md** - Original requirements
4. **IMPLEMENTATION_CHECKLIST.md** - Overall progress
5. **FILE_MANIFEST.md** - File listing

## 💡 Tips for Success

1. **Start the server first** - `python backend/main.py`
2. **Use Swagger UI for testing** - Go to `/api/docs`
3. **Check logs for errors** - Terminal shows all info
4. **Keep requirements.txt updated** - Add new packages here
5. **Run tests often** - `pytest backend/tests/ -v`
6. **Use git to track changes** - Commit after each phase


## ⏱️ Estimated Time for Phase 2

- Task 1 (main.py): 15 minutes
- Task 2 (requirements.txt): 5 minutes  
- Task 3 (Installation): 10 minutes
- Task 4 (Start server): 5 minutes
- Task 5 (Test endpoints): 15 minutes
- **Total: ~50 minutes**

**Total for Phase 0 + 1 + 2: ~3-4 hours** (50% of complete backend)


## 🎊 You're Almost There!

✅ Phase 0: Architecture - DONE
✅ Phase 1: Backend Code - DONE  
🚀 Phase 2: Integration - YOUR TURN (Easy!)
⏳ Phase 3-6: Frontend & Features - Next


Just follow the 5 tasks above and Phase 2 will be complete! All the hard work is already done. Phase 2 is just putting it all together.

---

**Ready?** Start with Task 1: Create backend/main.py 🚀
