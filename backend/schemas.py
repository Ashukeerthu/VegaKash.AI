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
    name: str = Field(..., description="Name/type of loan (e.g., 'Car Loan', 'Personal Loan')")
    outstanding_principal: float = Field(..., gt=0, description="Outstanding principal amount")
    interest_rate_annual: float = Field(..., gt=0, description="Annual interest rate in percentage")
    remaining_months: int = Field(..., gt=0, description="Number of months remaining")


class FinancialInput(BaseModel):
    """
    Complete financial input from user
    This is the main request body for calculations
    """
    currency: str = Field(default="INR", description="Currency code (INR, USD, etc.)")
    monthly_income_primary: float = Field(..., gt=0, description="Primary monthly income")
    monthly_income_additional: float = Field(default=0, ge=0, description="Additional monthly income")
    expenses: ExpensesInput = Field(..., description="Breakdown of monthly expenses")
    goals: GoalsInput = Field(..., description="Financial goals")
    loans: List[LoanInput] = Field(default_factory=list, description="List of active loans")


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
