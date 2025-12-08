# VegaKash.AI Architecture & Design Decisions

## AI Planner Evolution

### V1 (ai_planner.py)
- **Purpose**: Original AI financial planner
- **Output**: Text-based recommendations (AIPlanOutput)
- **Fields**: summary_text, budget_breakdown, expense_optimizations, savings_and_investment_plan, debt_strategy, goal_plan, action_items_30_days, disclaimer
- **Use Case**: General financial advice with narrative guidance
- **Endpoint**: `/api/ai-plan`

### V2 (ai_planner_v2.py)
- **Purpose**: Enhanced context-aware budget planner
- **Output**: Structured budget breakdown (AIPlanOutputV2)
- **Features**:
  - City tier-based budget splits (Tier 1: 45-25-30, Tier 2: 40-30-30, Tier 3: 35-30-35)
  - Cost of living multiplier
  - Family size and lifestyle considerations
  - Alert system (HIGH_RENT, HIGH_EMI, NEGATIVE_CASHFLOW, LOW_SAVINGS)
  - Detailed expense breakdown (needs/wants/savings categories)
  - Educational explainers (why_split, how_to_save, city_impact)
- **Use Case**: Practical monthly budget planning with Indian financial context
- **Endpoint**: `/api/v2/generate-ai-plan`

### Why Both Files Exist
- **V1**: Narrative-style financial advice for users who want comprehensive text guidance
- **V2**: Structured budget planner for users who need detailed category-wise breakdowns
- Both serve different use cases and are actively used by different frontend components

---

## Expense Field Naming Conventions

### Backend Schema (schemas.py)
```python
class ExpensesInput(BaseModel):
    housing_rent: float  # Rent OR Mortgage payment
    groceries_food: float
    transport: float
    utilities: float
    insurance: float
    # ... other fields
```

### Frontend Form (FinancialForm.jsx)
```jsx
fixed_expenses: {
  housing_rent: '',  // Maps to backend housing_rent
  utilities: '',
  insurance: '',
  medical: '',
  other_fixed: '',
}
```

### Critical Mapping Issue
- Frontend label: "Rent/Mortgage"
- Backend field: `housing_rent`
- **Both refer to the same concept**: Monthly housing cost (whether rent or mortgage payment)

---

## Rent vs. Mortgage vs. EMI Clarification

### Conceptual Difference:
1. **Rent**: Monthly payment for renting property (not an asset, pure expense)
2. **Mortgage/Home Loan EMI**: Monthly payment for home loan (asset-building, mix of principal + interest)
3. **Other EMIs**: Car loan, personal loan, etc. (tracked separately in loans array)

### Why "Rent/Mortgage" Label is Used:
- Both represent monthly housing cost from a budgeting perspective
- User either pays rent OR mortgage (never both)
- From expense tracking POV, both occupy the same budget category
- The field accepts either value - whichever applies to the user

### Where EMIs are Tracked:
- **Housing Loan EMI**: Can be entered in `housing_rent` field (as monthly housing cost)
- **All Other Loan EMIs**: Tracked separately in `loans` array with full details (principal, interest, tenure)
- **Total EMI from loans**: Calculated and stored in `emi_total` field for V2 analysis

### Recommendation:
- Keep the label "Rent/Mortgage" but add tooltip: "Enter your monthly rent OR home loan EMI (not both)"
- This makes it clear to users what to enter
- Backend logic remains simple and unified

---

## Data Flow for Housing Cost

### User Journey:
1. User sees "Rent/Mortgage" field in frontend form
2. User enters their monthly housing cost (rent OR mortgage payment)
3. Frontend sends as `housing_rent` field in API request
4. Backend stores in `ExpensesInput.housing_rent`
5. AI planner receives field as `expenses.housing_rent`
6. AI generates budget considering this as fixed housing cost
7. Output includes housing cost in needs category

### Current Bug:
**Frontend field name**: `fixed_housing_rent`
**Backend expected**: `housing_rent`

This mismatch causes the value to not be transmitted correctly.

---

## Code Cleanup Action Items

### ✅ COMPLETED FIXES (December 6, 2025):
1. ✅ **Fixed housing_rent mapping**: Updated `prepareDataForAPI()` to properly map `fixed_expenses.housing_rent` → `expenses.housing_rent`
2. ✅ **Added tooltip**: Rent/Mortgage field now has ℹ️ icon with explanation: "Enter your monthly rent OR home loan EMI (not both)"
3. ✅ **Added helper text**: Field now shows "Monthly rent or home loan EMI" below input
4. ✅ **Updated CSS**: Added styles for `.tooltip-icon` and `.field-helper` classes
5. ✅ **Documented architecture**: Created ARCHITECTURE_NOTES.md explaining why both AI planner files exist
6. ✅ **Clarified V1 vs V2**: Both ai_planner.py and ai_planner_v2.py serve different use cases and are both needed

### Optional Improvements (Future):
- Consider renaming `housing_rent` to `monthly_housing_cost` for clarity (breaking change)
- Add validation to prevent users from entering both rent AND housing loan in different fields
- Add conditional showing of EMI breakdown when user enters mortgage
- Consider auto-calculating total monthly EMI from loans array and surfacing it in UI

---

## File Retention Decisions

### Keep Both AI Planner Files:
- **ai_planner.py**: V1 API still in use by legacy frontend components
- **ai_planner_v2.py**: V2 API with enhanced features for new budget planner
- Removing either would break existing functionality

### Files to Remove (Future):
- None currently - both are actively used

---

## Lessons Learned
1. **Field Naming**: Always use consistent naming between frontend and backend
2. **Documentation**: Architecture decisions should be documented (like this file)
3. **Tooltips**: Complex fields need user guidance through tooltips/help text
4. **Validation**: Clear validation messages prevent user confusion

---

Last Updated: December 6, 2025
