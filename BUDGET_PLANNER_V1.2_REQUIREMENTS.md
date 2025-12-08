# 🎯 VegaKash.AI - Budget Planner V1.2 (No Login Version)
## Functional Requirements Document (FRD)
**Version**: 1.2  
**Release**: Q1 2026  
**Core Focus**: City Tier & Cost-of-Living Intelligence  
**Target**: Make Budget Planner the core USP of VegaKash.AI

---

## 1. Overview

The Budget Planner V1.2 enables users to generate smart, AI-powered financial plans that adapt to:
- ✅ Personal income
- ✅ Household size & lifestyle
- ✅ City & cost-of-living tier
- ✅ Fixed & variable expenses
- ✅ Loan EMIs
- ✅ Savings goals
- ✅ Budget mode preference (Basic/Aggressive/Smart)

**Key Differentiator**: No login required. All plans stored in LocalStorage.

---

## 2. Functional Requirements

### 2.1 User Input Sections

#### A. Income (Existing)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Monthly Income | number | Yes | - | Base for all calculations |
| Currency | select | Yes | INR | Supports 10 currencies |

#### B. City & Cost-of-Living (NEW)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Country | dropdown | Optional | India | For international users |
| State/Province | dropdown | Conditional | - | If country selected |
| City | dropdown | Optional | - | Auto-derives tier |
| City Tier (Manual) | select | Optional | Tier 1 | Backup if no city selected |

**City Tier Mapping (Default)**:
```
Tier 1 (COL: 1.25)
├── Metros: Mumbai, Bangalore, Delhi, Hyderabad, Pune, Chennai, Kolkata
└── Multiplier Effect: +25% on needs budget

Tier 2 (COL: 1.05)
├── Major Cities: Jaipur, Lucknow, Indore, Coimbatore, Kochi, Ahmedabad
└── Multiplier Effect: +5% on needs budget

Tier 3 (COL: 0.90)
├── Emerging Cities: Vizag, Mysore, Bhubaneswar, Raipur
└── Multiplier Effect: -10% on needs budget (higher savings)

Other (COL: 1.00)
├── Unknown/International: Standard 40/30/30 split
└── Multiplier Effect: No adjustment
```

#### C. Household & Lifestyle (NEW)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Family Size | number (1-10) | Yes | 1 | Affects expense estimates |
| Lifestyle | select | Yes | Moderate | Impacts wants allocation |

**Lifestyle Options**:
- 🟢 **Minimal**: Budget-conscious, essential spending only (Wants: 20-25%)
- 🟡 **Moderate**: Balanced lifestyle with some leisure (Wants: 30-35%)
- 🟠 **Comfort**: Comfortable living, regular dining/entertainment (Wants: 35-40%)
- 🔴 **Premium**: High-end lifestyle, luxury spending (Wants: 40-50%)

#### D. Fixed Expenses (NEW)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Rent/Mortgage | number | Optional | 0 | % of income calculated |
| Utilities | number | Optional | 0 | Water, electricity, internet |
| Insurance | number | Optional | 0 | Health, car, home |
| Medical | number | Optional | 0 | Recurring medical expenses |
| Other Fixed | number | Optional | 0 | Any other required expenses |

#### E. Variable Expenses (NEW)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Groceries | number | Optional | 0 | Food expenses |
| Transport | number | Optional | 0 | Fuel, public transport, auto |
| Subscriptions | number | Optional | 0 | Streaming, apps, memberships |
| Entertainment | number | Optional | 0 | Movies, games, hobbies |
| Shopping | number | Optional | 0 | Clothes, household items |
| Dining Out | number | Optional | 0 | Restaurants, cafes |
| Other Variable | number | Optional | 0 | Other discretionary spending |

**Validation**: Users can leave fields empty. AI infers estimates based on income/tier.

#### F. Loans/EMIs (Existing with Enhancement)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Loan Principal | number | Optional | 0 | Original loan amount |
| Interest Rate (%) | number | Optional | 0 | Annual rate |
| Tenure (Months) | number | Optional | 0 | Remaining months |
| Loan Issuer | text | Optional | - | Bank/NBFC name (NEW) |

**Multiple Loans**: Support 1-5 loan entries. Calculate total EMI.

#### G. Savings Goals (Existing)
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Goal Name | text | Optional | - | e.g., "Emergency Fund" |
| Target Amount | number | Optional | 0 | Final target |
| Target Months | number | Optional | 12 | Timeline |
| Priority (1-5) | select | Optional | 3 | 1=Lowest, 5=Highest |

**Multiple Goals**: Support 1-5 goal entries.

#### H. Budget Mode (NEW)
| Mode | Description | Allocation | Scenario |
|------|-------------|-----------|----------|
| **Basic Plan** | Balanced default split | ~45/30/25 | Conservative approach |
| **Aggressive Savings** | High savings focus | Wants -40-60%, Savings +30-40% | Debt reduction, goals |
| **Smart Balanced** | AI-optimized (DEFAULT) | Personalized based on data | Recommended for most |

---

### 2.2 AI Budget Generation Logic

#### Core Algorithm: 50-30-20 Base → COL-Adjusted Split

**Step 1: Base Allocation**
```
base_needs = 50%
base_wants = 30%
base_savings = 20%
```

**Step 2: City Tier Adjustment**
```
needs_adj = base_needs * (1 + (col_multiplier - 1) * 0.8)
savings_adj = max(base_savings - (needs_adj - base_needs), minimum_threshold)
wants_adj = 100 - (needs_adj + savings_adj)

Example (Tier 1, COL: 1.25):
col_factor = (1.25 - 1) * 0.8 = 0.20
needs_adj = 50 * (1 + 0.20) = 60%
savings_adj = 20 - (60 - 50) = 10%
wants_adj = 100 - (60 + 10) = 30%
Result: 60% Needs | 30% Wants | 10% Savings
```

**Step 3: Lifestyle Modifier**
```
If lifestyle == "Premium":
  wants_adj += 5-10%
  savings_adj -= 5-10%

If lifestyle == "Minimal":
  wants_adj -= 5-10%
  savings_adj += 5-10%
```

**Step 4: Income-Based Fine-Tuning**
```
If monthly_income < ₹25,000: Increase needs by 5%
If monthly_income > ₹150,000: Can maintain higher savings
If rent_ratio > 35%: Reduce wants by 10-15%
If total_emi > 25%: Reduce wants by 10%
```

**Step 5: Generate Absolute Amounts**
```
needs_amount = income * (needs_adj / 100)
wants_amount = income * (wants_adj / 100)
savings_amount = income * (savings_adj / 100)

// Ensure sum equals income
total = needs_amount + wants_amount + savings_amount
if total != income:
  savings_amount = income - needs_amount - wants_amount
```

---

#### Subcategory Allocation

**NEEDS Breakdown** (60% example):
```
Rent/Mortgage:        35-40% of needs
Utilities:             8-12%
Groceries:            15-20%
Transport:             8-12%
Insurance:             5-8%
Medical:               3-5%
EMI:                   (calculated from loans)
Other Needs:           5-10%
```

**WANTS Breakdown** (30% example):
```
Dining Out:           35-40%
Entertainment:        25-30%
Shopping:             20-25%
Subscriptions:         5-10%
Other Wants:           5-10%
```

**SAVINGS Breakdown** (10% example):
```
Emergency Fund (40%): 4%
SIP/Investments (40%): 4%
FD/RD/Fixed Income (15%): 1.5%
Goal-Based Savings (5%): 0.5%
```

---

### 2.3 AI Alerts System

Every budget must include alerts array. Each alert has:
```javascript
{
  code: "HIGH_RENT_RATIO",
  message: "Your rent is 42% of income (recommended: <35%)",
  severity: "high",     // "info" | "warning" | "moderate" | "high" | "critical"
  suggestion: "Consider moving to a cheaper area or negotiating rent."
}
```

#### Alert Rules

**A1. High Rent Ratio**
```
Trigger: rent > 35% of income
Tier 1 allowance: up to 40-45%
Threshold: 45% = "high" severity

Example:
Income: ₹50,000, Rent: ₹22,000 (44%)
Tier 1: Warning severity
Tier 2+: High severity
```

**A2. High EMI Burden**
```
Trigger: total_emi > 30-35% of income
Severity: high if > 35%, moderate if 30-35%

Suggestion: "Consider consolidating loans or extending tenure."
```

**A3. Negative Cashflow**
```
Trigger: total_expenses > income
Severity: CRITICAL

Suggestion: "Reduce expenses or increase income."
```

**A4. Low Savings Rate**
```
Low Income (<₹25k): Target >= 10%
Mid Income (₹25-75k): Target >= 15%
High Income (>₹75k): Target >= 20-25%

Trigger: savings < target
Severity: moderate/warning
```

**A5. High Wants Spending**
```
Trigger: wants > 35% of income
Severity: warning

Suggestion: "Reduce discretionary spending to increase savings."
```

**A6. Insufficient Emergency Fund**
```
Trigger: planned_emergency_fund < 3 * monthly_expenses
Severity: warning

Suggestion: "Build emergency fund to 3-6 months of expenses."
```

---

### 2.4 Budget Modes

#### Mode 1: Basic Plan
**Characteristics**:
- Conservative, approx 45/30/25 split
- Minor city-tier adjustments
- Suitable for: First-time budgeters

**Calculation**:
```
base_needs = 45%
base_wants = 30%
base_savings = 25%
Apply city tier adjustment
```

#### Mode 2: Aggressive Savings Plan
**Characteristics**:
- High savings focus: 30-40%
- Reduced wants: 20-30%
- Suitable for: Debt reduction, financial goals

**Calculation**:
```
wants_reduction = 40-60%
wants_final = wants_base * (1 - wants_reduction)
savings_increase = min(wants_reduction, 15%)
savings_final = savings_base + savings_increase
needs_final = 100 - wants_final - savings_final
```

#### Mode 3: Smart Balanced Plan (DEFAULT)
**Characteristics**:
- AI-determined optimal split
- Uses all user inputs for personalization
- Includes detailed explainers for each category

**Calculation**:
```
1. Apply city tier adjustment
2. Apply lifestyle modifier
3. Apply income-based tuning
4. Consider existing expense patterns
5. Generate personalized split
6. Provide reasoning for each category
```

---

### 2.5 Edit & Rebalance Logic

#### E1. Inline Editing
**Behavior**:
- User clicks any budget amount to edit
- Input validation: numeric only, >= 0
- Mark plan as "edited" → flag: true
- Enable "Rebalance" button

#### E2. Rebalance Endpoint
**POST /api/v1/ai/budget/rebalance**

**Input**:
```json
{
  "edited_plan": { /* edited amounts */ },
  "original_inputs": { /* user inputs */ },
  "city_tier": "tier_1",
  "col_multiplier": 1.25
}
```

**Output**:
```json
{
  "plan": { /* rebalanced amounts */ },
  "alerts": [ /* updated alerts */ ],
  "reasoning": "Based on your edits, I've rebalanced...",
  "metadata": { /* city, tier, multiplier */ }
}
```

---

### 2.6 LocalStorage Management

#### Storage Keys

**Key 1: vegakash.budget.lastPlan**
```json
{
  "inputs": { /* all user inputs */ },
  "mode": "smart_balanced",
  "plan": { /* AI output */ },
  "edited": false,
  "timestamp": "2025-12-05T10:30:00Z",
  "metadata": {
    "city": "Hyderabad",
    "city_tier": "tier_1",
    "col_multiplier": 1.25
  }
}
```

**Key 2: vegakash.budget.history**
```json
[
  {
    "inputs": { /* ... */ },
    "plan": { /* ... */ },
    "mode": "smart_balanced",
    "timestamp": "2025-12-05T10:30:00Z",
    "metadata": { /* ... */ }
  },
  // ... up to 10 entries (FIFO)
]
```

#### Operations

| Operation | Action |
|-----------|--------|
| Save Current | Store plan in lastPlan + add to history |
| Load Last | Retrieve from lastPlan |
| Load History | Retrieve array from history key |
| Clear | Remove lastPlan and history |
| Regenerate | Clear edited flag, re-run AI, save new version |

---

### 2.7 API Endpoints

#### Endpoint 1: Generate Budget
**POST /api/v1/ai/budget/generate**

**Request**:
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

**Response**:
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
      "needs": {
        "rent": 25000,
        "utilities": 3000,
        "groceries": 5000,
        "transport": 2000,
        "insurance": 2000,
        "medical": 1000,
        "emi": 8000,
        "other": -1000
      },
      "wants": {
        "dining": 7000,
        "entertainment": 5000,
        "shopping": 4000,
        "subscriptions": 1500,
        "other": 1250
      },
      "savings": {
        "emergency": 4500,
        "sip": 4500,
        "fd_rd": 1700,
        "goals": 550
      }
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
      "col_multiplier": 1.25,
      "notes": "Budget adjusted for Tier-1 living costs."
    }
  }
}
```

#### Endpoint 2: Rebalance Budget
**POST /api/v1/ai/budget/rebalance**

**Request**:
```json
{
  "edited_plan": { /* modified amounts */ },
  "original_inputs": { /* original user inputs */ },
  "city_tier": "tier_1",
  "col_multiplier": 1.25
}
```

**Response**:
```json
{
  "success": true,
  "plan": { /* rebalanced plan */ },
  "alerts": [ /* updated alerts */ ],
  "reasoning": "I've rebalanced based on your edits...",
  "metadata": { /* city, tier, multiplier */ }
}
```

---

## 3. UI/UX Requirements

### 3.1 Page Layout
```
┌─────────────────────────────────────┐
│         Budget Planner V1.2          │
├─────────────────────────────────────┤
│  📋 INPUT SECTION (Accordion/Tabs)   │
│  ├─ Income & Currency                │
│  ├─ 🆕 City & COL                     │
│  ├─ 🆕 Household & Lifestyle          │
│  ├─ 🆕 Fixed Expenses                 │
│  ├─ 🆕 Variable Expenses              │
│  ├─ Loans/EMIs                        │
│  ├─ Savings Goals                     │
│  └─ Budget Mode Selector              │
│  [Generate Button]                    │
├─────────────────────────────────────┤
│  📊 OUTPUT SECTION (Below)            │
│  ├─ Summary Cards (Income/Exp/Sav)    │
│  ├─ Pie Chart (50/30/20)              │
│  ├─ Category Breakdown Table          │
│  ├─ Alerts Panel (if any)             │
│  ├─ Explanation Section               │
│  └─ Action Buttons                    │
│    [Save] [Rebalance] [Regenerate]    │
│    [Export PDF] [Share] [Edit Mode]   │
└─────────────────────────────────────┘
```

### 3.2 Components to Create/Modify

**New Components**:
- `CitySelector.jsx` - Hierarchical city picker
- `LifestyleSelector.jsx` - Lifestyle options with icons
- `ExpenseSection.jsx` - Fixed/Variable expenses form
- `BudgetModeSelector.jsx` - Mode selection (Basic/Aggressive/Smart)
- `BudgetOutput.jsx` - Main output display
- `AlertsPanel.jsx` - Risk alerts display
- `BudgetChart.jsx` - Pie chart (Needs/Wants/Savings)
- `CategoryBreakdown.jsx` - Detailed table
- `BudgetExplainer.jsx` - AI reasoning display

**Existing to Modify**:
- `MonthlyBudget.jsx` - Integrate new V1.2 features
- `Calculator.css` - Update for new form sections

---

## 4. Performance Requirements

| Metric | Target | Current |
|--------|--------|---------|
| AI Response Time | 1.5-3 seconds | TBD |
| UI Update Time | < 200ms | TBD |
| History Retrieval | < 20ms | TBD |
| Plan Save | < 50ms | TBD |
| Page Load | < 2 seconds | TBD |

---

## 5. Error Handling & Edge Cases

**Edge Case 1: Very Low Income**
```
If income < ₹10,000:
- AI suggests freelance/side gigs
- Adjusts minimum savings to 5%
- Focuses on essential needs
```

**Edge Case 2: High Rent/EMI**
```
If rent > 50% or EMI > 40%:
- Alert: CRITICAL
- Suggestion: Relocate or refinance
- May show 0% savings as temporary
```

**Edge Case 3: Zero Savings Possible**
```
If total_expenses >= income:
- Alert: CRITICAL - Negative Cashflow
- AI suggests expense reduction options
- Highlighted in red
```

**Edge Case 4: Missing Fields**
```
AI infers based on:
- Income tier
- City tier
- Lifestyle
- Family size
- Example: No rent given → estimate as 30-35% of income
```

**Edge Case 5: Invalid JSON from AI**
```
Fallback to default 45/30/25 split
Log error
Show user: "Using default budget, please try again"
```

**Edge Case 6: Invalid City**
```
If city not found:
- User can manually select tier
- Use tier's default COL multiplier
```

---

## 6. Testing Checklist

### Unit Tests
- [ ] City tier calculation
- [ ] COL multiplier application
- [ ] Budget split algorithm
- [ ] Alert trigger logic
- [ ] Rebalance calculations
- [ ] LocalStorage operations

### Integration Tests
- [ ] Generate budget API
- [ ] Rebalance budget API
- [ ] Edit → Rebalance flow
- [ ] Save → Load → Regenerate flow
- [ ] Multiple budget versions

### E2E Tests
- [ ] Complete user flow (input → generate → edit → save)
- [ ] History retrieval and display
- [ ] PDF export
- [ ] Edge cases (low income, high EMI, etc.)

### Performance Tests
- [ ] AI response time measurement
- [ ] UI update time measurement
- [ ] History load time
- [ ] Bulk operations (5 budgets)

---

## 7. Deployment Plan

**Phase 1**: Backend API endpoints (Generate, Rebalance)  
**Phase 2**: Frontend form inputs and components  
**Phase 3**: Output display and charts  
**Phase 4**: LocalStorage and history  
**Phase 5**: PDF export  
**Phase 6**: Testing and optimization  
**Phase 7**: Production release  

---

## 8. Success Metrics

- ✅ Users generate budgets without login
- ✅ 90%+ of users prefer personalized budget over generic
- ✅ Average plan generation time < 2 seconds
- ✅ 70%+ users save their plans
- ✅ 50%+ users rebalance their budgets
- ✅ Net Promoter Score (NPS) > 50
- ✅ Zero critical errors in production

---

**Last Updated**: December 5, 2025  
**Version**: 1.2 FRD  
**Status**: Ready for Development
