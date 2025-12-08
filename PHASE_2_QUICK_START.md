# Budget Planner V1.2 - Phase 2 Quick Start Guide

## What's Ready (Phase 1 ✅)

```
backend/
├── schemas/budget_planner.py      ✅ 18 Pydantic models
├── utils/budget_calculator.py     ✅ 10 calculation functions
├── utils/alert_detector.py        ✅ 6 alert detection rules
├── services/budget_planner_service.py ✅ 2 main methods
├── routes/budget_planner.py       ✅ 5 API endpoints ready
└── tests/unit/test_budget_planner.py ✅ 40+ tests
```

All backend business logic is complete and tested!


## Phase 2 Tasks (Next)

### Task 1: Create Main App File
**File:** `backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from backend.routes import budget_planner

# Initialize FastAPI
app = FastAPI(
    title="VegaKash.AI - Budget Planner API",
    description="AI-powered budget planning with cost-of-living intelligence",
    version="1.2.0",
    docs_url="/api/docs",
    redoc_url="/api/redocs",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(budget_planner.router)

# Root endpoint
@app.get("/")
async def root():
    return {"status": "ok", "service": "Budget Planner V1.2"}

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.2.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Task 2: Create Requirements File
**File:** `backend/requirements.txt`

```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-dateutil==2.8.2
pytest==7.4.3
pytest-asyncio==0.21.1
```

### Task 3: Test All Endpoints

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run server
python backend/main.py

# Test endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/ai/budget/budget-modes
```

### Task 4: Create End-to-End Tests

**File:** `backend/tests/integration/test_api.py`

```python
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    from backend.main import app
    return TestClient(app)

def test_generate_budget_endpoint(client):
    response = client.post("/api/v1/ai/budget/generate", json={...})
    assert response.status_code == 200
    assert response.json()["success"] == True
```


## Sample Request for Testing

```json
POST /api/v1/ai/budget/generate
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

## Expected Response

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
      "needs": {...},
      "wants": {...},
      "savings": {...}
    },
    "alerts": [...],
    "explanation": "Your personalized budget...",
    "metadata": {...},
    "generated_at": "2024-..."
  }
}
```


## Files to Create in Phase 2

1. ✅ backend/main.py - App setup
2. ✅ backend/requirements.txt - Dependencies
3. ✅ backend/__init__.py - Package init
4. ✅ backend/tests/__init__.py - Tests init
5. ✅ backend/tests/integration/test_api.py - E2E tests
6. ✅ backend/tests/integration/__init__.py - Init
7. ✅ .env - Environment variables
8. ✅ docker-compose.yml (optional) - Containerization


## Verification Checklist

- [ ] main.py created and imports all routes
- [ ] CORS configured for frontend
- [ ] Server starts on http://localhost:8000
- [ ] /health endpoint responds
- [ ] /api/v1/ai/budget/health endpoint responds
- [ ] /api/v1/ai/budget/generate accepts POST requests
- [ ] /api/v1/ai/budget/rebalance accepts POST requests
- [ ] /api/v1/ai/budget/budget-modes returns 3 modes
- [ ] /api/v1/ai/budget/lifestyle-options returns 4 lifestyles
- [ ] All 40+ unit tests pass: `pytest tests/unit/ -v`
- [ ] All E2E tests pass: `pytest tests/integration/ -v`
- [ ] Validation errors return 400 status
- [ ] Server errors return 500 status with proper message
- [ ] All responses have proper JSON structure


## Reference Documentation

📚 Complete Backend Documentation:
- PHASE_1_BACKEND_COMPLETE.md - Full Phase 1 summary
- BUDGET_PLANNER_V1.2_REQUIREMENTS.md - Original FRD
- BUDGET_PLANNER_V1.2_IMPLEMENTATION_GUIDE.md - Development guide

🔍 Key Algorithms:
- COL Adjustment Formula in budget_calculator.py
- Alert Detection Rules in alert_detector.py
- Budget Modes in BudgetPlannerService

📊 Data Models:
- All input/output models in schemas/budget_planner.py
- Validation rules in schemas/budget_planner.py validators


## Support

For questions about:
- **Calculations**: See budget_calculator.py docstrings
- **Alerts**: See alert_detector.py docstrings
- **API Design**: See routes/budget_planner.py docstrings
- **Testing**: See tests/unit/test_budget_planner.py examples
- **Requirements**: See BUDGET_PLANNER_V1.2_REQUIREMENTS.md


---

**Phase 1 Status**: ✅ COMPLETE
**Phase 2 Status**: 🚀 READY TO START
**Next**: Create main.py and register routes
