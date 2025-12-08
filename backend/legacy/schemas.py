"""
Pydantic schemas for VegaKash.AI
Defines data models for request/response validation
"""
from pydantic import BaseModel, Field, model_validator
from typing import Optional, List, Dict, Any


class ExpensesInput(BaseModel):
    """
    User's monthly expenses breakdown
    All values in user's chosen currency
    """
    housing_rent: float = Field(default=0, ge=0, description="Monthly rent or housing cost")
    groceries_food: float = Field(default=0, ge=0, description="Groceries and food expenses")
    transport: float = Field(default=0, ge=0, description="Transportation costs")
    utilities: float = Field(default=0, ge=0, description="Utilities (electricity, water, internet)")
    insurance: float = Field(default=0, ge=0, description="Insurance premiums")
    entertainment: float = Field(default=0, ge=0, description="Entertainment expenses")
    shopping: float = Field(default=0, ge=0, description="Shopping/Retail expenses (V2)")
    dining: float = Field(default=0, ge=0, description="Dining out/Restaurant expenses (V2)")
    medical: float = Field(default=0, ge=0, description="Medical/Healthcare expenses (V2)")
    emi_total: float = Field(default=0, ge=0, description="Total EMI from all loans (V2)")
    subscriptions: float = Field(default=0, ge=0, description="Subscription services")
    others: float = Field(default=0, ge=0, description="Other miscellaneous expenses")


class GoalsInput(BaseModel):
    """
    User's financial goals
    """
    monthly_savings_target: float = Field(default=0, ge=0, description="Target monthly savings amount")
    emergency_fund_target: float = Field(default=0, ge=0, description="Emergency fund goal amount")
    primary_goal_type: Optional[str] = Field(default=None, description="Type of primary goal (Home, Car, Travel, etc.)")
    primary_goal_amount: Optional[float] = Field(default=None, ge=0, description="Amount needed for primary goal")


class LoanInput(BaseModel):
    """
    Details of a single loan
    Supports two input modes:
    1. 'emi' mode: User knows their monthly EMI (default, most common)
    2. 'principal' mode: User knows the outstanding principal
    """
    name: str = Field(..., min_length=1, max_length=100, description="Name/type of loan (e.g., 'Car Loan', 'Personal Loan')")
    input_mode: str = Field(default="emi", description="Input mode: 'emi' or 'principal'")
    
    # EMI-first mode fields (when user knows monthly payment)
    monthly_emi: Optional[float] = Field(default=None, gt=0, le=1000000, description="Monthly EMI amount (for emi mode)")
    
    # Principal-first mode fields (when user knows loan details)
    outstanding_principal: Optional[float] = Field(default=None, gt=0, le=100000000, description="Outstanding principal amount (for principal mode)")
    
    # Common fields for both modes
    interest_rate_annual: float = Field(..., gt=0, le=30, description="Annual interest rate in percentage (0-30%)")
    remaining_months: int = Field(..., gt=0, le=600, description="Number of months remaining (max 50 years)")


class FixedExpensesInput(BaseModel):
    """
    V1.2: Fixed monthly expenses (essentials)
    """
    housing_rent: float = Field(default=0, ge=0, description="Rent/Mortgage")
    utilities: float = Field(default=0, ge=0, description="Utilities (electricity, water, internet)")
    insurance: float = Field(default=0, ge=0, description="Insurance premiums")
    medical: float = Field(default=0, ge=0, description="Medical expenses")
    other_fixed: float = Field(default=0, ge=0, description="Other fixed expenses")


class VariableExpensesInput(BaseModel):
    """
    V1.2: Variable monthly expenses (discretionary)
    """
    groceries_food: float = Field(default=0, ge=0, description="Groceries and food")
    transport: float = Field(default=0, ge=0, description="Transportation")
    subscriptions: float = Field(default=0, ge=0, description="Subscriptions (Netflix, Spotify, etc.)")
    entertainment: float = Field(default=0, ge=0, description="Entertainment")
    shopping: float = Field(default=0, ge=0, description="Shopping")
    dining_out: float = Field(default=0, ge=0, description="Dining out")
    other_variable: float = Field(default=0, ge=0, description="Other variable expenses")


class SavingsGoalInput(BaseModel):
    """
    V1.2: Individual savings goal
    """
    name: str = Field(..., min_length=1, description="Goal name (e.g., Emergency Fund, Vacation)")
    target: float = Field(..., gt=0, description="Target amount")
    timeline: int = Field(..., ge=1, le=360, description="Timeline in months")
    priority: int = Field(default=3, ge=1, le=5, description="Priority (1=lowest, 5=highest)")


class FinancialInput(BaseModel):
    """
    Complete financial input from user - Enhanced V1.2
    This is the main request body for calculations
    Supports both legacy format and V1.2 enhanced format
    """
    # Basic Income
    currency: str = Field(default="INR", max_length=10, description="Currency code (INR, USD, etc.)")
    monthly_income_primary: float = Field(..., gt=0, le=10000000, description="Primary monthly income (must be positive)")
    monthly_income_additional: float = Field(default=0, ge=0, le=10000000, description="Additional monthly income")
    
    # V1.2: Location Data (Optional)
    country: Optional[str] = Field(default=None, description="Country name")
    state: Optional[str] = Field(default=None, description="State/Province name")
    city: Optional[str] = Field(default=None, description="City name (V2)")
    city_tier: Optional[str] = Field(default=None, description="City tier: tier_1, tier_2, tier_3, other")
    cost_of_living_index: Optional[float] = Field(default=1.0, ge=0.5, le=2.0, description="COL multiplier: 1.0=national avg, >1.0=higher cost (V2)")
    col_multiplier: Optional[float] = Field(default=None, ge=0.5, le=2.0, description="Alias for cost_of_living_index")
    
    # V1.2: Household & Lifestyle (Optional)
    family_size: Optional[int] = Field(default=1, ge=1, le=10, description="Number of family members")
    lifestyle: Optional[str] = Field(default="moderate", description="Lifestyle (minimal, moderate, comfort, premium)")
    
    # V1.2: Enhanced Expenses (Optional - if not provided, use legacy expenses)
    fixed_expenses: Optional[FixedExpensesInput] = Field(default=None, description="V1.2: Fixed expenses breakdown")
    variable_expenses: Optional[VariableExpensesInput] = Field(default=None, description="V1.2: Variable expenses breakdown")
    
    # Legacy Expenses (For backward compatibility)
    expenses: Optional[ExpensesInput] = Field(default=None, description="Legacy: Expenses breakdown")
    
    # V1.2: Multiple Savings Goals (Optional)
    savings_goals: Optional[List[SavingsGoalInput]] = Field(default=None, max_length=5, description="V1.2: Multiple savings goals (max 5)")
    
    # Legacy Goals (For backward compatibility)
    goals: Optional[GoalsInput] = Field(default=None, description="Legacy: Financial goals")
    
    # Loans (same for both versions)
    loans: List[LoanInput] = Field(default_factory=lambda: [], max_length=20, description="List of active loans (max 20)")

    @model_validator(mode='before')
    @classmethod
    def handle_col_multiplier_alias(cls, data: Any) -> Any:
        """Handle col_multiplier as alias for cost_of_living_index"""
        if isinstance(data, dict):
            # If col_multiplier is provided but cost_of_living_index is not, use col_multiplier
            if 'col_multiplier' in data and 'cost_of_living_index' not in data:
                data['cost_of_living_index'] = data['col_multiplier']
        return data


class SummaryOutput(BaseModel):
    """
    Calculated financial summary (non-AI)
    Based on rule-based calculations
    """
    total_income: float = Field(..., description="Total monthly income")
    total_expenses: float = Field(..., description="Total monthly expenses")
    net_savings: float = Field(..., description="Net savings (income - expenses)")
    savings_rate_percent: float = Field(..., description="Savings rate as percentage of income")
    debt_to_income_ratio_percent: float = Field(..., description="Debt-to-income ratio percentage")
    has_deficit: bool = Field(..., description="True if expenses exceed income")
    basic_advice: str = Field(..., description="Rule-based financial advice")
    rule_50_30_20_needs: float = Field(..., description="50% of income for needs")
    rule_50_30_20_wants: float = Field(..., description="30% of income for wants")
    rule_50_30_20_savings: float = Field(..., description="20% of income for savings")


class AIPlanOutput(BaseModel):
    """
    AI-generated personalized financial plan
    Generated using OpenAI based on user's financial data
    """
    summary_text: str = Field(..., description="AI-generated summary of financial situation")
    budget_breakdown: str = Field(..., description="Recommended monthly budget breakdown")
    expense_optimizations: List[str] = Field(..., description="List of expense reduction suggestions")
    savings_and_investment_plan: str = Field(..., description="Savings and investment recommendations")
    debt_strategy: str = Field(..., description="Debt repayment strategy")
    goal_plan: str = Field(..., description="Plan to achieve financial goals")
    action_items_30_days: List[str] = Field(..., description="Concrete action items for next 30 days")
    disclaimer: str = Field(..., description="Disclaimer about financial advice")


class AIPlanRequest(BaseModel):
    """
    Request body for AI plan generation
    Contains both user input and calculated summary
    """
    input: FinancialInput = Field(..., description="Original financial input from user")
    summary: SummaryOutput = Field(..., description="Calculated financial summary")


# Multi-Loan Management Schemas

class LoanDetail(BaseModel):
    """
    Detailed loan information for multi-loan management
    """
    loan_id: str = Field(..., description="Unique identifier for the loan")
    loan_type: str = Field(..., description="Type: home, car, personal, education, credit_card")
    loan_name: str = Field(..., description="Display name for the loan")
    principal: float = Field(..., gt=0, description="Original principal amount")
    interest_rate: float = Field(..., gt=0, le=30, description="Annual interest rate percentage")
    tenure_months: int = Field(..., gt=0, le=600, description="Original tenure in months")
    current_balance: float = Field(..., gt=0, description="Current outstanding balance")
    monthly_emi: float = Field(..., gt=0, description="Monthly EMI payment")


class MultiLoanInput(BaseModel):
    """
    Input for multi-loan strategy calculations
    """
    loans: List[LoanDetail] = Field(..., min_length=1, description="List of loans to analyze")
    extra_payment: float = Field(default=0, ge=0, description="Extra monthly payment available")


class LoanPayoffStep(BaseModel):
    """
    Single step in loan payoff strategy
    """
    month: int = Field(..., description="Month number in the payoff timeline")
    loan_id: str = Field(..., description="Loan being paid in this step")
    loan_name: str = Field(..., description="Name of the loan")
    payment: float = Field(..., description="Payment amount for this loan")
    remaining_balance: float = Field(..., description="Balance remaining after payment")
    is_paid_off: bool = Field(..., description="Whether loan is fully paid off")


class DebtPayoffStrategy(BaseModel):
    """
    Complete debt payoff strategy (snowball or avalanche)
    """
    strategy_type: str = Field(..., description="snowball or avalanche")
    payoff_order: List[str] = Field(..., description="Loan IDs in payoff priority order")
    total_months: int = Field(..., description="Months to become debt-free")
    total_interest: float = Field(..., description="Total interest paid")
    monthly_breakdown: List[LoanPayoffStep] = Field(..., description="Month-by-month payoff steps")
    summary: str = Field(..., description="Human-readable strategy summary")


class DebtStrategyComparison(BaseModel):
    """
    Comparison between snowball and avalanche strategies
    """
    snowball: DebtPayoffStrategy
    avalanche: DebtPayoffStrategy
    interest_saved: float = Field(..., description="Interest saved with avalanche vs snowball")
    time_saved_months: int = Field(..., description="Months saved with avalanche vs snowball")
    recommendation: str = Field(..., description="Which strategy is recommended")


# PDF Export Schemas

class PDFExportRequest(BaseModel):
    """
    Request to export financial plan as PDF
    """
    input: FinancialInput = Field(..., description="Original financial input")
    summary: SummaryOutput = Field(..., description="Calculated summary")
    ai_plan: Optional[AIPlanOutput] = Field(default=None, description="AI-generated plan")
    chart_data: Optional[dict] = Field(default=None, description="Chart data for visualizations")


# Smart Recommendations Schemas

class SpendingAlert(BaseModel):
    """
    Alert about spending patterns
    """
    alert_type: str = Field(..., description="overspend, unusual_spike, missed_savings")
    category: str = Field(..., description="Expense category")
    message: str = Field(..., description="Alert message")
    severity: str = Field(..., description="low, medium, high")
    suggestion: str = Field(..., description="Actionable suggestion")


class PersonalizedRecommendation(BaseModel):
    """
    Personalized financial recommendation
    """
    rec_type: str = Field(..., description="expense_reduction, bill_optimization, seasonal")
    title: str = Field(..., description="Recommendation title")
    description: str = Field(..., description="Detailed description")
    potential_savings: float = Field(..., description="Estimated monthly savings")
    action_items: List[str] = Field(..., description="Specific action steps")


class SmartRecommendationsOutput(BaseModel):
    """
    Complete smart recommendations response
    """
    alerts: List[SpendingAlert] = Field(..., description="Spending alerts")
    recommendations: List[PersonalizedRecommendation] = Field(..., description="Personalized recommendations")
    seasonal_reminders: List[str] = Field(..., description="Upcoming seasonal expenses")


# ========================================
# V2 AI PLAN SCHEMAS (Context-Aware)
# ========================================

class AlertV2(BaseModel):
    """
    V2: Budget alert with severity levels
    """
    code: str = Field(..., description="Alert code: HIGH_RENT, HIGH_EMI, NEGATIVE_CASHFLOW, LOW_SAVINGS, HIGH_WANTS")
    message: str = Field(..., description="Human-readable alert message")
    severity: str = Field(..., description="Severity: info, moderate, high, critical")
    suggestion: str = Field(..., description="Actionable suggestion to address alert")


class ExpenseBreakdownV2(BaseModel):
    """
    V2: Detailed expense breakdown by category
    """
    needs: Dict[str, float] = Field(..., description="Needs: rent, groceries, utilities, transport, emi, medical, insurance, other")
    wants: Dict[str, float] = Field(..., description="Wants: dining, entertainment, shopping, subscriptions, other")
    savings: Dict[str, float] = Field(..., description="Savings: emergency, sips_investment, fd_rd, goals_saving")


class MetadataV2(BaseModel):
    """
    V2: Metadata about the plan
    """
    city: Optional[str] = Field(default=None, description="City name")
    city_tier: Optional[str] = Field(default=None, description="City tier: Tier 1, Tier 2, Tier 3")
    col_multiplier: float = Field(..., description="Cost of living multiplier")
    reasoning_summary: str = Field(..., description="Summary of why this split was chosen")


class TotalsV2(BaseModel):
    """
    V2: Total financial summary
    """
    income: float = Field(..., ge=0, description="Total monthly income")
    total_expenses: float = Field(..., ge=0, description="Total monthly expenses")
    net_savings: float = Field(..., description="Net savings (can be negative)")
    savings_rate_percent: float = Field(..., description="Savings rate as percentage")


class SplitV2(BaseModel):
    """
    V2: Budget split percentages
    """
    needs_percent: float = Field(..., ge=0, le=100, description="Percentage for needs")
    wants_percent: float = Field(..., ge=0, le=100, description="Percentage for wants")
    savings_percent: float = Field(..., ge=0, le=100, description="Percentage for savings")


class ExplainersV2(BaseModel):
    """
    V2: Educational explanations
    """
    why_split: str = Field(..., description="Explain why this split was chosen")
    how_to_save: str = Field(..., description="How to improve savings rate")
    city_impact: str = Field(..., description="How city tier affected the budget")


class AIPlanOutputV2(BaseModel):
    """
    V2: AI-generated context-aware budget plan
    Includes city tier, family size, lifestyle considerations
    """
    plan_mode: str = Field(..., description="Plan mode: basic, aggressive, smart")
    metadata: MetadataV2 = Field(..., description="Metadata about the plan")
    totals: TotalsV2 = Field(..., description="Total income, expenses, savings")
    split: SplitV2 = Field(..., description="Budget percentages")
    breakdown: ExpenseBreakdownV2 = Field(..., description="Detailed breakdown by category")
    alerts: List[AlertV2] = Field(..., description="List of alerts with severity")
    recommendations: List[str] = Field(..., description="Actionable recommendations")
    explainers: ExplainersV2 = Field(..., description="Educational explanations")
