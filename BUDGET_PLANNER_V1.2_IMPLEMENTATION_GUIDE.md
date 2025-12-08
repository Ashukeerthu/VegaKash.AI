# 🚀 Budget Planner V1.2 - Implementation Guide

**Status**: Ready for Phase 1 Development  
**Created**: December 5, 2025  
**Target Release**: Q1 2026

---

## Quick Start Overview

This guide walks through the step-by-step implementation of Budget Planner V1.2, the core USP feature.

### Files Created (Foundation Ready)
✅ **BUDGET_PLANNER_V1.2_REQUIREMENTS.md** - Complete FRD with all functional requirements  
✅ **utils/cityTierData.js** - City tier mapping database with 50+ helper functions  
✅ **schemas/budgetPlanner.js** - TypeScript types and validation rules  

---

## Implementation Phases

### Phase 1: Backend API & Business Logic (Current)
**Timeline**: Week 1-2  
**Files to Create**:
```
backend/
├── routes/
│   └── budget_planner.py          # API endpoints
├── services/
│   └── budget_planner_service.py  # Core logic
├── schemas/
│   └── budget_planner.py          # Pydantic models
├── utils/
│   └── budget_calculator.py       # Calculation functions
└── tests/
    └── test_budget_planner.py     # Unit tests
```

**Key Endpoints**:
```
POST /api/v1/ai/budget/generate      # Generate plan
POST /api/v1/ai/budget/rebalance     # Rebalance plan
GET /api/v1/ai/budget/city-tiers     # Get tier data
```

---

### Phase 2: Frontend Form Inputs
**Timeline**: Week 2-3  
**Files to Create**:
```
frontend/src/
├── components/
│   ├── CitySelector.jsx            # Country → State → City
│   ├── LifestyleSelector.jsx       # Lifestyle picker
│   ├── ExpenseForm.jsx             # Fixed + Variable expenses
│   └── BudgetModeSelector.jsx      # Budget mode selector
├── styles/
│   └── BudgetPlanner.css           # All new styling
└── hooks/
    └── useBudgetForm.js            # Form state hook
```

**Form Sections** (in order):
1. Income (existing)
2. City & COL (new)
3. Household & Lifestyle (new)
4. Fixed Expenses (new)
5. Variable Expenses (new)
6. Loans (existing, enhance)
7. Savings Goals (existing)
8. Budget Mode (new)

---

### Phase 3: Output Display Components
**Timeline**: Week 3-4  
**Files to Create**:
```
frontend/src/
├── components/
│   ├── BudgetChart.jsx             # Pie chart (Needs/Wants/Savings)
│   ├── AlertsPanel.jsx             # Risk alerts display
│   ├── CategoryBreakdown.jsx        # Detailed table
│   ├── BudgetExplainer.jsx         # AI reasoning
│   ├── BudgetSummary.jsx           # Income/Expense/Savings cards
│   └── BudgetOutput.jsx            # Main output container
└── hooks/
    └── useBudgetOutput.js          # Output state hook
```

**Chart Requirements**:
- Pie chart: Needs %, Wants %, Savings %
- Color-coded: Blue (needs), Orange (wants), Green (savings)
- Interactive: Hover for percentages and amounts
- Responsive on mobile

---

### Phase 4: LocalStorage & History
**Timeline**: Week 4  
**Files to Create**:
```
frontend/src/
├── utils/
│   ├── budgetStorage.js            # LocalStorage manager
│   └── budgetSerializer.js         # Save/load logic
└── hooks/
    └── useBudgetStorage.js         # Storage hook
```

**Key Functions**:
- `saveBudgetPlan()` - Save current plan
- `loadLastPlan()` - Load most recent
- `getBudgetHistory()` - Get all saved
- `clearHistory()` - Clear all
- `regeneratePlan()` - Clear edits, re-run AI

---

### Phase 5: Edit & Rebalance Features
**Timeline**: Week 4-5  
**Files to Create**:
```
frontend/src/
├── components/
│   └── EditableCell.jsx            # Inline editing
└── hooks/
    └── useBudgetRebalance.js       # Rebalance logic
```

**Key Features**:
- Click any amount to edit
- Validate numeric input
- Mark plan as "edited"
- Trigger rebalance API
- Show updated alerts

---

### Phase 6: PDF Export & Sharing (Phase 2)
**Timeline**: Week 5-6  
**Files to Create**:
```
frontend/src/
├── utils/
│   ├── budgetPdfExport.js          # PDF generation
│   └── budgetSharing.js            # Social sharing
└── components/
    └── ExportMenu.jsx              # Export options
```

**Export Features**:
- PDF download (includes metadata)
- Email share
- WhatsApp share (Phase 2)
- Social media share (Phase 2)

---

## Key Implementation Details

### 1. City Tier Logic

**In Frontend**:
```javascript
import { getCityTier, calculateColAdjustedBudget } from './utils/cityTierData'

// Get tier when city changes
const handleCityChange = (city) => {
  const { tier, multiplier } = getCityTier(city)
  setBudgetData(prev => ({
    ...prev,
    city_tier: tier,
    col_multiplier: multiplier
  }))
}

// Calculate budget split
const split = calculateColAdjustedBudget(50, multiplier)
// Result: { needs: 60, wants: 25, savings: 15 }
```

**In Backend**:
```python
from services.budget_planner_service import apply_col_adjustment

needs = 50
col_multiplier = 1.25  # Tier 1

adjusted = apply_col_adjustment(
    needs=needs,
    col_multiplier=col_multiplier
)
# Result: { needs: 60, wants: 25, savings: 15, factor: 0.20 }
```

---

### 2. Budget Generation API

**Request** (from frontend):
```javascript
const response = await fetch('/api/v1/ai/budget/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    monthly_income: 75000,
    currency: 'INR',
    city: 'Hyderabad',
    city_tier: 'tier_1',
    col_multiplier: 1.25,
    family_size: 2,
    lifestyle: 'moderate',
    fixed_expenses: { rent: 25000, ... },
    variable_expenses: { groceries: 5000, ... },
    loans: [{ principal: 1000000, rate: 8.5, ... }],
    goals: [{ name: 'Emergency', target: 300000, ... }],
    mode: 'smart_balanced'
  })
})
```

**Response** (from backend):
```json
{
  "success": true,
  "plan": {
    "income": 75000,
    "budget_split": {
      "needs_percent": 60,
      "wants_percent": 25,
      "savings_percent": 15
    },
    "budget_amounts": {
      "needs": 45000,
      "wants": 18750,
      "savings": 11250
    },
    "categories": {
      "needs": { "rent": 25000, ... },
      "wants": { "dining": 7000, ... },
      "savings": { "emergency": 4500, ... }
    },
    "alerts": [
      {
        "code": "HIGH_RENT_RATIO",
        "message": "Rent is 33% of income",
        "severity": "info",
        "suggestion": "Acceptable for Tier 1 living."
      }
    ],
    "explanation": "Based on Tier 1 COL and moderate lifestyle...",
    "metadata": {
      "city": "Hyderabad",
      "city_tier": "tier_1",
      "col_multiplier": 1.25
    }
  }
}
```

---

### 3. LocalStorage Save/Load

**Save**:
```javascript
import { storageKeys } from './schemas/budgetPlanner'

const savePlan = (inputs, plan, mode) => {
  const savedPlan = {
    inputs,
    mode,
    plan,
    edited: false,
    timestamp: new Date().toISOString(),
    metadata: plan.metadata
  }

  // Save last plan
  localStorage.setItem(storageKeys.lastPlan, JSON.stringify(savedPlan))

  // Add to history (max 10)
  const history = JSON.parse(localStorage.getItem(storageKeys.history) || '[]')
  history.unshift(savedPlan)
  if (history.length > 10) history.pop()
  localStorage.setItem(storageKeys.history, JSON.stringify(history))
}
```

**Load**:
```javascript
const loadLastPlan = () => {
  const saved = localStorage.getItem(storageKeys.lastPlan)
  return saved ? JSON.parse(saved) : null
}

const loadHistory = () => {
  const history = localStorage.getItem(storageKeys.history)
  return history ? JSON.parse(history) : []
}
```

---

### 4. Alert Logic

**Alert Detection**:
```javascript
const detectAlerts = (plan, inputs) => {
  const alerts = []

  // High rent ratio
  const rentRatio = inputs.fixed_expenses.rent / inputs.monthly_income
  if (rentRatio > 0.35) {
    alerts.push({
      code: 'HIGH_RENT_RATIO',
      message: `Rent is ${(rentRatio * 100).toFixed(0)}% of income`,
      severity: rentRatio > 0.45 ? 'high' : 'moderate',
      suggestion: 'Consider relocating or negotiating rent.'
    })
  }

  // High EMI burden
  const emiRatio = calculateTotalEMI(inputs.loans) / inputs.monthly_income
  if (emiRatio > 0.35) {
    alerts.push({
      code: 'HIGH_EMI_BURDEN',
      message: `EMI is ${(emiRatio * 100).toFixed(0)}% of income`,
      severity: 'high',
      suggestion: 'Consider loan consolidation or refinancing.'
    })
  }

  // Negative cashflow
  const totalExpenses = calculateTotalExpenses(inputs)
  if (totalExpenses > inputs.monthly_income) {
    alerts.push({
      code: 'NEGATIVE_CASHFLOW',
      message: 'Your expenses exceed your income',
      severity: 'critical',
      suggestion: 'Reduce expenses or increase income immediately.'
    })
  }

  return alerts
}
```

---

### 5. PDF Export (Phase 2)

**Export Function**:
```javascript
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const exportPDF = async (plan, inputs) => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(18)
  doc.text('VegaKash.AI Budget Plan', 20, 20)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30)

  // Summary
  doc.setFontSize(12)
  doc.text('Budget Summary', 20, 45)
  doc.setFontSize(10)
  doc.text(`Monthly Income: ₹${plan.income.toLocaleString()}`, 20, 55)
  doc.text(`City: ${plan.metadata.city} (${plan.metadata.city_tier})`, 20, 65)

  // Chart (as image)
  const chartImage = await captureChart() // Capture Needs/Wants/Savings pie chart
  doc.addImage(chartImage, 'PNG', 20, 80, 170, 100)

  // Categories
  doc.addPage()
  doc.text('Detailed Breakdown', 20, 20)
  // ... add category table

  // Alerts
  if (plan.alerts.length > 0) {
    doc.addPage()
    doc.text('Financial Alerts', 20, 20)
    // ... add alerts
  }

  doc.save(`Budget-Plan-${new Date().getTime()}.pdf`)
}
```

---

## Testing Checklist

### Unit Tests
- [ ] City tier calculation
- [ ] COL multiplier application
- [ ] Budget split algorithm
- [ ] Alert detection
- [ ] LocalStorage operations
- [ ] Rebalance calculation

### Integration Tests
- [ ] API: Generate budget
- [ ] API: Rebalance budget
- [ ] Flow: Generate → Edit → Rebalance
- [ ] Flow: Save → Load → Regenerate
- [ ] Multiple budget versions

### E2E Tests
- [ ] Complete user flow
- [ ] Form validation
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] PDF export

---

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| AI Response | 1.5-3s | TBD |
| UI Update | < 200ms | TBD |
| History Load | < 20ms | TBD |
| Page Load | < 2s | TBD |
| Bundle Size | < 500KB | TBD |

---

## Rollout Strategy

**Canary Release** (10% users):
- Week 1: Monitor AI response times, error rates
- Week 2: Gather feedback, iterate

**Beta Release** (50% users):
- Week 3: A/B test with existing budget planner
- Week 4: Collect analytics

**Full Release** (100% users):
- Week 5: Production deployment
- Ongoing: Monitor performance

---

## Success Metrics

✅ Users generate budgets without login  
✅ 90%+ prefer V1.2 over generic budgets  
✅ 70%+ save their plans  
✅ 50%+ rebalance at least once  
✅ NPS score > 50  
✅ Zero critical errors in production  

---

## Next Steps

1. **Confirm Requirements** - Review FRD with product team
2. **Start Phase 1** - Implement backend API endpoints
3. **API Testing** - Test endpoints with Postman
4. **Frontend Integration** - Begin Phase 2 development
5. **User Testing** - Canary release with 10% users

---

**Questions or clarifications needed?** Review the detailed requirements in `BUDGET_PLANNER_V1.2_REQUIREMENTS.md`.

**Ready to start Phase 1?** Let's build the backend API endpoints! 🚀
