"""
Pydantic schemas for VegaKash.AI
Defines data models for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List


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
    emi_loans: float = Field(default=0, ge=0, description="EMI for loans")
    entertainment: float = Field(default=0, ge=0, description="Entertainment expenses")
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
    """
    name: str = Field(..., min_length=1, max_length=100, description="Name/type of loan (e.g., 'Car Loan', 'Personal Loan')")
    outstanding_principal: float = Field(..., gt=0, le=100000000, description="Outstanding principal amount")
    interest_rate_annual: float = Field(..., gt=0, le=30, description="Annual interest rate in percentage (0-30%)")
    remaining_months: int = Field(..., gt=0, le=600, description="Number of months remaining (max 50 years)")


class FinancialInput(BaseModel):
    """
    Complete financial input from user
    This is the main request body for calculations
    """
    currency: str = Field(default="INR", max_length=10, description="Currency code (INR, USD, etc.)")
    monthly_income_primary: float = Field(..., gt=0, le=10000000, description="Primary monthly income (must be positive)")
    monthly_income_additional: float = Field(default=0, ge=0, le=10000000, description="Additional monthly income")
    expenses: ExpensesInput = Field(..., description="Breakdown of monthly expenses")
    goals: GoalsInput = Field(..., description="Financial goals")
    loans: List[LoanInput] = Field(default_factory=lambda: [], max_length=20, description="List of active loans (max 20)")


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
