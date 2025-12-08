/**
 * Budget Planner V1.2 - API Schemas & Types
 * 
 * @module schemas/budgetPlanner
 * @description TypeScript/JSDoc type definitions for all budget planner data structures
 * Used for backend validation and frontend type safety
 */

// ============================================
// INPUT SCHEMAS
// ============================================

/**
 * @typedef {Object} IncomeInput
 * @property {number} monthly_income - Monthly income (₹)
 * @property {string} currency - Currency code (INR, USD, EUR, etc.)
 */

/**
 * @typedef {Object} CityInput
 * @property {string} [country] - Country name
 * @property {string} [state] - State/Province name
 * @property {string} [city] - City name
 * @property {string} city_tier - Tier (tier_1, tier_2, tier_3, other)
 * @property {number} col_multiplier - Cost-of-living multiplier
 */

/**
 * @typedef {Object} HouseholdInput
 * @property {number} family_size - Number of family members (1-10)
 * @property {string} lifestyle - Lifestyle type (minimal, moderate, comfort, premium)
 */

/**
 * @typedef {Object} ExpenseItem
 * @property {number} [rent] - Monthly rent (₹)
 * @property {number} [utilities] - Utilities (water, electricity, internet)
 * @property {number} [insurance] - Insurance premiums
 * @property {number} [medical] - Medical expenses
 * @property {number} [other] - Other fixed expenses
 */

/**
 * @typedef {Object} VariableExpenses
 * @property {number} [groceries] - Grocery expenses
 * @property {number} [transport] - Transport/fuel
 * @property {number} [subscriptions] - Subscriptions
 * @property {number} [entertainment] - Entertainment
 * @property {number} [shopping] - Shopping
 * @property {number} [dining_out] - Dining out
 * @property {number} [other] - Other variable
 */

/**
 * @typedef {Object} LoanInput
 * @property {number} principal - Original loan amount
 * @property {number} rate - Annual interest rate (%)
 * @property {number} tenure_months - Remaining tenure (months)
 * @property {string} [issuer] - Bank/NBFC name
 */

/**
 * @typedef {Object} SavingsGoal
 * @property {string} name - Goal name
 * @property {number} target - Target amount
 * @property {number} target_months - Timeline (months)
 * @property {number} priority - Priority (1-5)
 */

/**
 * @typedef {Object} BudgetGenerateRequest
 * @property {number} monthly_income - Monthly income
 * @property {string} currency - Currency code
 * @property {string} [country] - Country
 * @property {string} [state] - State
 * @property {string} [city] - City
 * @property {string} city_tier - Tier
 * @property {number} col_multiplier - COL multiplier
 * @property {number} family_size - Family size
 * @property {string} lifestyle - Lifestyle
 * @property {ExpenseItem} fixed_expenses - Fixed expenses
 * @property {VariableExpenses} variable_expenses - Variable expenses
 * @property {Array<LoanInput>} [loans] - Loan array
 * @property {Array<SavingsGoal>} [goals] - Savings goals
 * @property {string} mode - Budget mode (basic, aggressive_savings, smart_balanced)
 */

// ============================================
// OUTPUT SCHEMAS
// ============================================

/**
 * @typedef {Object} BudgetSplit
 * @property {number} needs_percent - Needs percentage
 * @property {number} wants_percent - Wants percentage
 * @property {number} savings_percent - Savings percentage
 */

/**
 * @typedef {Object} BudgetAmounts
 * @property {number} needs - Needs amount
 * @property {number} wants - Wants amount
 * @property {number} savings - Savings amount
 */

/**
 * @typedef {Object} NeedsCategory
 * @property {number} rent - Rent/Mortgage
 * @property {number} utilities - Utilities
 * @property {number} groceries - Groceries
 * @property {number} transport - Transport
 * @property {number} insurance - Insurance
 * @property {number} medical - Medical
 * @property {number} emi - EMI/Loan repayment
 * @property {number} other - Other needs
 */

/**
 * @typedef {Object} WantsCategory
 * @property {number} dining - Dining out
 * @property {number} entertainment - Entertainment
 * @property {number} shopping - Shopping
 * @property {number} subscriptions - Subscriptions
 * @property {number} other - Other wants
 */

/**
 * @typedef {Object} SavingsCategory
 * @property {number} emergency - Emergency fund
 * @property {number} sip - SIP/Investments
 * @property {number} fd_rd - FD/RD/Fixed Income
 * @property {number} goals - Goal-based savings
 */

/**
 * @typedef {Object} Categories
 * @property {NeedsCategory} needs - Needs breakdown
 * @property {WantsCategory} wants - Wants breakdown
 * @property {SavingsCategory} savings - Savings breakdown
 */

/**
 * @typedef {Object} Alert
 * @property {string} code - Alert code
 * @property {string} message - Alert message
 * @property {string} severity - Severity level
 * @property {string} suggestion - Suggestion
 */

/**
 * @typedef {Object} Metadata
 * @property {string} [city] - City name
 * @property {string} city_tier - Tier
 * @property {number} col_multiplier - COL multiplier
 * @property {string} [notes] - Additional notes
 */

/**
 * @typedef {Object} BudgetPlan
 * @property {number} income - Monthly income
 * @property {BudgetSplit} budget_split - Percentage split
 * @property {BudgetAmounts} budget_amounts - Amount split
 * @property {Categories} categories - Category breakdown
 * @property {Array<Alert>} alerts - Risk alerts
 * @property {string} explanation - AI-generated explanation
 * @property {Metadata} metadata - Metadata
 */

/**
 * @typedef {Object} BudgetGenerateResponse
 * @property {boolean} success - Success flag
 * @property {BudgetPlan} plan - Generated budget plan
 * @property {string} [error] - Error message if failed
 */

/**
 * @typedef {Object} BudgetRebalanceRequest
 * @property {Object} edited_plan - Edited plan amounts
 * @property {Object} original_inputs - Original user inputs
 * @property {string} city_tier - Tier
 * @property {number} col_multiplier - COL multiplier
 */

/**
 * @typedef {Object} BudgetRebalanceResponse
 * @property {boolean} success - Success flag
 * @property {BudgetPlan} plan - Rebalanced plan
 * @property {Array<Alert>} alerts - Updated alerts
 * @property {string} reasoning - Rebalance reasoning
 * @property {Metadata} metadata - Metadata
 */

// ============================================
// LOCALSTORAGE SCHEMAS
// ============================================

/**
 * @typedef {Object} SavedBudget
 * @property {Object} inputs - All user inputs
 * @property {string} mode - Budget mode used
 * @property {BudgetPlan} plan - Generated plan
 * @property {boolean} edited - Was plan edited
 * @property {string} timestamp - ISO timestamp
 * @property {Metadata} metadata - Metadata
 */

/**
 * @typedef {Object} BudgetHistory
 * Array of SavedBudget objects
 */

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const validationRules = {
  monthly_income: {
    min: 10000, // Minimum income
    max: 10000000, // Maximum income
    message: 'Income must be between ₹10,000 and ₹1,00,00,000',
  },
  family_size: {
    min: 1,
    max: 10,
    message: 'Family size must be between 1 and 10',
  },
  col_multiplier: {
    min: 0.5,
    max: 2.0,
    message: 'COL multiplier must be between 0.5 and 2.0',
  },
  tenure_months: {
    min: 1,
    max: 360,
    message: 'Loan tenure must be between 1 and 360 months',
  },
  interest_rate: {
    min: 0,
    max: 50,
    message: 'Interest rate must be between 0% and 50%',
  },
  priority: {
    min: 1,
    max: 5,
    message: 'Priority must be between 1 and 5',
  },
};

// ============================================
// DEFAULT VALUES
// ============================================

export const defaults = {
  mode: 'smart_balanced',
  currency: 'INR',
  family_size: 1,
  lifestyle: 'moderate',
  city_tier: 'tier_1',
  col_multiplier: 1.0,
  budget_split: {
    needs_percent: 50,
    wants_percent: 30,
    savings_percent: 20,
  },
  minimum_savings_percent: 5,
  goals_limit: 5,
  loans_limit: 5,
  history_limit: 10,
};

// ============================================
// ALERT CODES
// ============================================

export const alertCodes = {
  HIGH_RENT_RATIO: 'HIGH_RENT_RATIO',
  HIGH_EMI_BURDEN: 'HIGH_EMI_BURDEN',
  NEGATIVE_CASHFLOW: 'NEGATIVE_CASHFLOW',
  LOW_SAVINGS_RATE: 'LOW_SAVINGS_RATE',
  HIGH_WANTS_SPENDING: 'HIGH_WANTS_SPENDING',
  INSUFFICIENT_EMERGENCY: 'INSUFFICIENT_EMERGENCY',
  VERY_LOW_INCOME: 'VERY_LOW_INCOME',
  INVALID_CITY: 'INVALID_CITY',
};

// ============================================
// SEVERITY LEVELS
// ============================================

export const severityLevels = {
  INFO: 'info',
  WARNING: 'warning',
  MODERATE: 'moderate',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// ============================================
// BUDGET MODES
// ============================================

export const budgetModes = {
  BASIC: 'basic',
  AGGRESSIVE_SAVINGS: 'aggressive_savings',
  SMART_BALANCED: 'smart_balanced',
};

// ============================================
// LOCALSTORAGE KEYS
// ============================================

export const storageKeys = {
  lastPlan: 'vegakash.budget.lastPlan',
  history: 'vegakash.budget.history',
};

// ============================================
// EXPORT
// ============================================

export default {
  validationRules,
  defaults,
  alertCodes,
  severityLevels,
  budgetModes,
  storageKeys,
};
