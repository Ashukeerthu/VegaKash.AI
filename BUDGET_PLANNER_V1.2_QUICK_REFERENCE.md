# 📊 Budget Planner V1.2 - Quick Reference Guide

**Status**: Architecture Complete & Ready for Development  
**Phase**: 0 (Planning) ✅ → Phase 1 (Backend) 🔜  

---

## 1. User Input Flow

```
┌─────────────────────────────────────────────┐
│     BUDGET PLANNER V1.2 INPUT FORM          │
├─────────────────────────────────────────────┤
│                                             │
│ 1️⃣  INCOME & CURRENCY (Existing)           │
│    Monthly Income: [____] ₹                 │
│    Currency: [INR ▼]                        │
│                                             │
│ 2️⃣  CITY & COST-OF-LIVING (NEW)            │
│    Country: [India ▼]                       │
│    State: [Maharashtra ▼]                   │
│    City: [Mumbai ▼]                         │
│    ┌─────────────────────────────────┐      │
│    │ Tier: Tier 1 - Metropolitan     │      │
│    │ COL Multiplier: 1.25 (📍 HIGH)  │      │
│    └─────────────────────────────────┘      │
│                                             │
│ 3️⃣  HOUSEHOLD & LIFESTYLE (NEW)            │
│    Family Size: [2 ▼] (1-10)                │
│    Lifestyle: [🟡 Moderate ▼]              │
│    - 🟢 Minimal (20-25% wants)              │
│    - 🟡 Moderate (30-35% wants) ← Default  │
│    - 🟠 Comfort (35-40% wants)              │
│    - 🔴 Premium (40-50% wants)              │
│                                             │
│ 4️⃣  FIXED EXPENSES (NEW)                   │
│    Rent/Mortgage: [₹25,000]                 │
│    Utilities: [₹3,000]                      │
│    Insurance: [₹2,000]                      │
│    Medical: [₹1,000]                        │
│    Other: [₹1,000]                          │
│                                             │
│ 5️⃣  VARIABLE EXPENSES (NEW)                │
│    Groceries: [₹5,000]                      │
│    Transport: [₹2,000]                      │
│    Subscriptions: [₹500]                    │
│    Entertainment: [₹1,000]                  │
│    Shopping: [₹2,000]                       │
│    Dining Out: [₹3,000]                     │
│    Other: [₹1,000]                          │
│                                             │
│ 6️⃣  LOANS & EMIs (Enhanced)                │
│    ┌─ Loan 1 ──────────────────────┐        │
│    │ Principal: [₹1,000,000]       │        │
│    │ Interest Rate: [8.5%]         │        │
│    │ Tenure: [120 months]          │        │
│    │ Issuer: [HDFC Bank] (NEW)     │        │
│    └─────────────────────────────────┘       │
│    [+ Add Loan]                             │
│                                             │
│ 7️⃣  SAVINGS GOALS (Existing)               │
│    ┌─ Goal 1 ──────────────────────┐        │
│    │ Name: [Emergency Fund]        │        │
│    │ Target: [₹300,000]            │        │
│    │ Timeline: [24 months]         │        │
│    │ Priority: [⭐⭐⭐⭐⭐] (5/5)        │
│    └─────────────────────────────────┘       │
│    [+ Add Goal]                             │
│                                             │
│ 8️⃣  BUDGET MODE (NEW)                      │
│    ☐ Basic Plan (45/30/25)                  │
│    ☐ Aggressive Savings (-40-60% wants)     │
│    ☉ Smart Balanced (AI-optimized) ← Default│
│                                             │
│ [Generate Budget →]                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 2. Budget Generation Algorithm

```
INPUTS
├── Monthly Income: ₹75,000
├── City Tier: Tier 1 (COL: 1.25)
├── Lifestyle: Moderate
└── Existing Expenses: ₹44,000

STEP 1: Base Split (50/30/20)
├── Needs: 50%
├── Wants: 30%
└── Savings: 20%

STEP 2: Apply COL Adjustment (Tier 1 = 1.25)
├── COL Factor = (1.25 - 1) * 0.8 = 0.20
├── Needs: 50 * (1 + 0.20) = 60%
├── Reduction: 60 - 50 = 10%
├── Savings: 20 - 10 = 10%
└── Wants: 100 - 60 - 10 = 30%
Result: 60% Needs | 30% Wants | 10% Savings

STEP 3: Apply Lifestyle Modifier (Moderate = +5% wants)
├── Wants: 30% (no change for moderate)
└── Result: 60% Needs | 30% Wants | 10% Savings

STEP 4: Generate Absolute Amounts
├── Needs: ₹75,000 × 60% = ₹45,000
├── Wants: ₹75,000 × 30% = ₹22,500
└── Savings: ₹75,000 × 10% = ₹7,500
Total: ₹75,000 ✅

STEP 5: Allocate to Categories
NEEDS (₹45,000)
├── Rent: ₹25,000 (55.6%)
├── Utilities: ₹3,000 (6.7%)
├── Groceries: ₹5,000 (11.1%)
├── Transport: ₹2,000 (4.4%)
├── Insurance: ₹2,000 (4.4%)
├── Medical: ₹1,000 (2.2%)
├── EMI: ₹8,000 (17.8%)
└── Other: ₹-1,000 (rebalance needed)

WANTS (₹22,500)
├── Dining: ₹7,875 (35%)
├── Entertainment: ₹5,625 (25%)
├── Shopping: ₹5,625 (25%)
├── Subscriptions: ₹2,250 (10%)
└── Other: ₹1,125 (5%)

SAVINGS (₹7,500)
├── Emergency Fund (40%): ₹3,000
├── SIP/Investments (40%): ₹3,000
├── FD/RD (15%): ₹1,125
└── Goals (5%): ₹375

STEP 6: Generate Alerts
✓ High Rent Ratio (33% < 35%) → INFO
✓ EMI Burden (10.7% < 30%) → OK
✓ Cashflow OK
✓ Savings Rate (10%) → WARNING (target 15%)
✓ Wants OK (30%)

STEP 7: Generate Explanation
"Based on your Tier 1 living costs in Hyderabad and moderate
lifestyle, I've adjusted your budget to prioritize essential
expenses. Your rent is well-managed at 33% of income. However,
your savings rate is slightly lower than recommended. Consider
reducing dining out by ₹500/month to reach 15% savings."

STEP 8: Add Metadata
{
  city: "Hyderabad",
  city_tier: "tier_1",
  col_multiplier: 1.25,
  notes: "Budget adjusted for Tier-1 living costs."
}

OUTPUT
├── Plan: ✅ Generated
├── Alerts: 2 (1 warning, 1 info)
└── Ready to: Save, Edit, Export, or Regenerate
```

---

## 3. Alert System

```
ALERT DETECTION ENGINE

┌──────────────────────────────────────┐
│ Input: User data, Generated plan     │
└──────────────────────────────────────┘
         ↓

RULE 1: High Rent Ratio
├── Trigger: rent > 35% of income
├── Severity: moderate if 35-45%, high if >45%
├── Example: Rent ₹35,000 / Income ₹75,000 = 46.7%
├── Alert: HIGH (for Tier 1, tolerance 40-45%)
└── Suggestion: "Consider relocating or negotiating rent."

RULE 2: High EMI Burden
├── Trigger: total_emi > 30-35% of income
├── Severity: moderate if 30-35%, high if >35%
├── Example: EMI ₹30,000 / Income ₹75,000 = 40%
├── Alert: HIGH
└── Suggestion: "Consider loan consolidation or refinancing."

RULE 3: Negative Cashflow
├── Trigger: total_expenses > income
├── Severity: CRITICAL
├── Example: Expenses ₹80,000 > Income ₹75,000
├── Alert: CRITICAL
└── Suggestion: "Reduce expenses or increase income immediately."

RULE 4: Low Savings Rate
├── Trigger: savings < target for income level
├── Thresholds:
│  - Low income (<₹25k): target 10%
│  - Mid income (₹25-75k): target 15%
│  - High income (>₹75k): target 20-25%
├── Example: Income ₹75,000, Savings 10%
├── Alert: WARNING (target 15%)
└── Suggestion: "Increase savings to ₹11,250/month for goals."

RULE 5: High Wants Spending
├── Trigger: wants > 35% of budget
├── Severity: warning
├── Example: Wants 40% > 35%
├── Alert: WARNING
└── Suggestion: "Reduce discretionary spending to increase savings."

RULE 6: Insufficient Emergency Fund
├── Trigger: emergency_fund < 3 × monthly_expenses
├── Severity: warning
├── Example: Emergency Fund ₹50,000 < Target ₹132,000
├── Alert: WARNING
└── Suggestion: "Build emergency fund to 3-6 months of expenses."

┌──────────────────────────────────────┐
│ Output: Array of alerts with actions │
└──────────────────────────────────────┘
```

---

## 4. Output Display

```
┌─────────────────────────────────────────────┐
│     BUDGET PLAN - HYDERABAD, TIER 1         │
├─────────────────────────────────────────────┤
│                                             │
│ 📊 SUMMARY CARDS                            │
│ ┌──────────────┬──────────────┬────────────┐│
│ │ Monthly      │ Total        │ Monthly    ││
│ │ Income       │ Expenses     │ Savings    ││
│ │ ₹75,000      │ ₹67,500      │ ₹7,500     ││
│ └──────────────┴──────────────┴────────────┘│
│                                             │
│ 📈 BUDGET SPLIT PIE CHART                   │
│     ╔════════════════╗                      │
│     ║  🔵 NEEDS      ║ 60% (₹45,000)       │
│     ║  60%           ║                      │
│     ║                ║                      │
│     ║  🟠 WANTS      ║ 30% (₹22,500)       │
│     ║  30%           ║                      │
│     ║                ║                      │
│     ║  🟢 SAVINGS    ║ 10% (₹7,500)        │
│     ║  10%           ║                      │
│     ╚════════════════╝                      │
│                                             │
│ 📋 DETAILED BREAKDOWN                       │
│                                             │
│ NEEDS (₹45,000)                             │
│ ├─ Rent: ₹25,000 (55.6%)                    │
│ ├─ Groceries: ₹5,000 (11.1%)                │
│ ├─ EMI: ₹8,000 (17.8%)                      │
│ ├─ Utilities: ₹3,000 (6.7%)                 │
│ ├─ Insurance: ₹2,000 (4.4%)                 │
│ ├─ Transport: ₹2,000 (4.4%)                 │
│ └─ Medical: ₹1,000 (2.2%)                   │
│                                             │
│ WANTS (₹22,500)                             │
│ ├─ Dining Out: ₹7,875 (35%)                 │
│ ├─ Entertainment: ₹5,625 (25%)              │
│ ├─ Shopping: ₹5,625 (25%)                   │
│ ├─ Subscriptions: ₹2,250 (10%)              │
│ └─ Other: ₹1,125 (5%)                       │
│                                             │
│ SAVINGS (₹7,500)                            │
│ ├─ Emergency Fund: ₹3,000 (40%)             │
│ ├─ SIP/Investments: ₹3,000 (40%)            │
│ ├─ FD/RD: ₹1,125 (15%)                      │
│ └─ Goals: ₹375 (5%)                         │
│                                             │
│ ⚠️  ALERTS (2)                              │
│ ┌─────────────────────────────────────────┐│
│ │ 🟡 WARNING: Savings Rate Low             ││
│ │ Your savings are 10%, target is 15%.     ││
│ │ 💡 Suggestion: Reduce dining by ₹500    ││
│ │    to increase savings to ₹7,500.        ││
│ └─────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────┐│
│ │ ℹ️  INFO: Rent Managed Well               ││
│ │ Your rent (33%) is within acceptable     ││
│ │ range for Tier 1 cities.                 ││
│ └─────────────────────────────────────────┘│
│                                             │
│ 💭 AI EXPLANATION                           │
│ "Based on Tier 1 living costs in Hyderabad │
│  and your moderate lifestyle, I've created │
│  a budget that prioritizes essential       │
│  expenses while maintaining some leisure.  │
│  Your biggest expense is rent at 33% of    │
│  income, which is well-managed. I suggest  │
│  focusing on building your emergency fund  │
│  to reach ₹150,000 within 12 months."      │
│                                             │
│ 🎮 ACTIONS                                  │
│ [✏️  Edit] [🔄 Rebalance] [🔃 Regenerate]  │
│ [💾 Save] [📄 Export PDF] [📤 Share]       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5. Data Structures

### Input JSON
```json
{
  "monthly_income": 75000,
  "currency": "INR",
  "city": "Hyderabad",
  "city_tier": "tier_1",
  "col_multiplier": 1.25,
  "family_size": 2,
  "lifestyle": "moderate",
  "fixed_expenses": {
    "rent": 25000,
    "utilities": 3000,
    "insurance": 2000,
    "medical": 1000,
    "other": 1000
  },
  "variable_expenses": {
    "groceries": 5000,
    "transport": 2000,
    "subscriptions": 500,
    "entertainment": 1000,
    "shopping": 2000,
    "dining_out": 3000,
    "other": 1000
  },
  "loans": [
    {
      "principal": 1000000,
      "rate": 8.5,
      "tenure_months": 120,
      "issuer": "HDFC Bank"
    }
  ],
  "goals": [
    {
      "name": "Emergency Fund",
      "target": 300000,
      "target_months": 24,
      "priority": 5
    }
  ],
  "mode": "smart_balanced"
}
```

### Output JSON (Simplified)
```json
{
  "success": true,
  "plan": {
    "income": 75000,
    "budget_split": {
      "needs_percent": 60,
      "wants_percent": 30,
      "savings_percent": 10
    },
    "budget_amounts": {
      "needs": 45000,
      "wants": 22500,
      "savings": 7500
    },
    "categories": {
      "needs": {
        "rent": 25000,
        "groceries": 5000,
        "emi": 8000,
        "utilities": 3000,
        "insurance": 2000,
        "transport": 2000,
        "medical": 1000,
        "other": -1000
      },
      "wants": {
        "dining": 7875,
        "entertainment": 5625,
        "shopping": 5625,
        "subscriptions": 2250,
        "other": 1125
      },
      "savings": {
        "emergency": 3000,
        "sip": 3000,
        "fd_rd": 1125,
        "goals": 375
      }
    },
    "alerts": [
      {
        "code": "LOW_SAVINGS_RATE",
        "message": "Savings are 10%, target 15%",
        "severity": "warning",
        "suggestion": "Reduce dining by ₹500/month"
      }
    ],
    "explanation": "Based on Tier 1 living costs...",
    "metadata": {
      "city": "Hyderabad",
      "city_tier": "tier_1",
      "col_multiplier": 1.25
    }
  }
}
```

### LocalStorage JSON
```json
{
  "inputs": { /* full user inputs */ },
  "mode": "smart_balanced",
  "plan": { /* full plan output */ },
  "edited": false,
  "timestamp": "2025-12-05T10:30:00Z",
  "metadata": {
    "city": "Hyderabad",
    "city_tier": "tier_1",
    "col_multiplier": 1.25
  }
}
```

---

## 6. Key Features Checklist

### Input Processing
- [x] Income & currency selection
- [x] City → State → City hierarchy
- [x] Auto-tier detection with COL multiplier
- [x] Household size & lifestyle selection
- [x] Fixed & variable expense input
- [x] Multiple loans with EMI calculation
- [x] Multiple savings goals with priority
- [x] Budget mode selection

### Budget Generation
- [x] Base 50/30/20 split algorithm
- [x] COL adjustment for city tier
- [x] Lifestyle modifier application
- [x] Income-based fine-tuning
- [x] Subcategory allocation
- [x] Validation & rounding

### Alert System
- [x] 6 alert detection rules
- [x] Severity classification
- [x] Actionable suggestions
- [x] Contextual messaging

### Output Display
- [x] Summary cards
- [x] Pie chart visualization
- [x] Detailed category table
- [x] Alerts panel with icons
- [x] AI explanation text

### User Actions
- [x] Inline budget editing
- [x] Rebalance after edits
- [x] Save to LocalStorage
- [x] View history (max 10)
- [x] Regenerate plan
- [x] Export to PDF (Phase 2)
- [x] Share (Phase 2)

---

## 7. API Endpoints Reference

### Endpoint 1: Generate Budget
```
POST /api/v1/ai/budget/generate
Content-Type: application/json

Request: { /* BudgetGenerateRequest */ }
Response: { success: true, plan: { /* BudgetPlan */ } }
Time: 1.5-3s
```

### Endpoint 2: Rebalance Budget
```
POST /api/v1/ai/budget/rebalance
Content-Type: application/json

Request: { edited_plan, original_inputs, city_tier, col_multiplier }
Response: { success: true, plan, alerts, reasoning, metadata }
Time: 1.5-3s
```

### Endpoint 3: Get City Tiers (Bonus)
```
GET /api/v1/ai/budget/city-tiers
Response: { countries, states, cities, tiers }
Time: <50ms
```

---

## 8. Development Checklist

### Phase 1: Backend
- [ ] Create API endpoints
- [ ] Implement budget algorithm
- [ ] Build alert detection
- [ ] Add error handling
- [ ] Write unit tests

### Phase 2: Frontend
- [ ] City selector component
- [ ] Expense form sections
- [ ] Lifestyle picker
- [ ] Budget mode selector
- [ ] Form validation

### Phase 3: Output
- [ ] Chart component
- [ ] Category breakdown
- [ ] Alerts panel
- [ ] Explanation display
- [ ] Summary cards

### Phase 4: Storage
- [ ] LocalStorage manager
- [ ] History display
- [ ] Save/load functionality
- [ ] Regenerate logic

### Phase 5: Interactions
- [ ] Inline editing
- [ ] Rebalance trigger
- [ ] Edit tracking
- [ ] UI state management

### Phase 6: Export & Polish
- [ ] PDF export
- [ ] Social sharing (Phase 2)
- [ ] Performance optimization
- [ ] Testing & QA
- [ ] Production deployment

---

## Ready to Start! 🚀

All specifications are complete. Phase 1 backend development can begin immediately.

**Next Step**: Create Backend API Endpoints

Files created:
- ✅ BUDGET_PLANNER_V1.2_REQUIREMENTS.md
- ✅ BUDGET_PLANNER_V1.2_IMPLEMENTATION_GUIDE.md
- ✅ frontend/src/utils/cityTierData.js
- ✅ frontend/src/schemas/budgetPlanner.js
- ✅ BUDGET_PLANNER_V1.2_FOUNDATION_COMPLETE.md
- ✅ BUDGET_PLANNER_V1.2_QUICK_REFERENCE.md (this file)

**Questions?** All details are in the FRD document.

**Let's build the USP! 💪**
