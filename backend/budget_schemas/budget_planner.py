"""
Budget Planner V1.2 - Pydantic Schemas
Models for request/response validation and serialization
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime


# ============================================
# INPUT SCHEMAS
# ============================================

class IncomeInput(BaseModel):
    """Income and currency input"""
    monthly_income: float = Field(..., gt=10000, le=10000000, description="Monthly income in currency")
    currency: str = Field(default="INR", description="Currency code (INR, USD, EUR, GBP, etc.)")


class CityInput(BaseModel):
    """City and cost-of-living input"""
    country: Optional[str] = Field(None, description="Country name")
    state: Optional[str] = Field(None, description="State/Province name")
    city: Optional[str] = Field(None, description="City name")
    city_tier: str = Field(default="tier_1", description="City tier (tier_1, tier_2, tier_3, other)")
    col_multiplier: float = Field(default=1.0, ge=0.5, le=2.0, description="Cost-of-living multiplier")


class HouseholdInput(BaseModel):
    """Household and lifestyle input"""
    family_size: int = Field(default=1, ge=1, le=10, description="Number of family members")
    lifestyle: str = Field(default="moderate", description="Lifestyle type (minimal, moderate, comfort, premium)")


class FixedExpenses(BaseModel):
    """Fixed expense categories"""
    rent: float = Field(default=0, ge=0, description="Monthly rent/mortgage")
    utilities: float = Field(default=0, ge=0, description="Utilities (water, electricity, internet)")
    insurance: float = Field(default=0, ge=0, description="Insurance premiums")
    medical: float = Field(default=0, ge=0, description="Medical expenses")
    other: float = Field(default=0, ge=0, description="Other fixed expenses")


class VariableExpenses(BaseModel):
    """Variable expense categories"""
    groceries: float = Field(default=0, ge=0, description="Grocery expenses")
    transport: float = Field(default=0, ge=0, description="Transport/fuel")
    subscriptions: float = Field(default=0, ge=0, description="Subscriptions")
    entertainment: float = Field(default=0, ge=0, description="Entertainment")
    shopping: float = Field(default=0, ge=0, description="Shopping")
    dining_out: float = Field(default=0, ge=0, description="Dining out")
    other: float = Field(default=0, ge=0, description="Other variable expenses")


class LoanInput(BaseModel):
    """Loan/EMI input"""
    principal: float = Field(..., gt=0, description="Original loan amount")
    rate: float = Field(..., ge=0, le=50, description="Annual interest rate (%)")
    tenure_months: int = Field(..., ge=1, le=360, description="Remaining tenure in months")
    issuer: Optional[str] = Field(None, description="Bank/NBFC name")


class SavingsGoal(BaseModel):
    """Savings goal input"""
    name: str = Field(..., min_length=1, description="Goal name")
    target: float = Field(..., gt=0, description="Target amount")
    target_months: int = Field(..., ge=1, le=360, description="Timeline in months")
    priority: int = Field(default=3, ge=1, le=5, description="Priority (1-5)")


class BudgetGenerateRequest(BaseModel):
    """Complete budget generation request"""
    monthly_income: float = Field(..., gt=10000, le=10000000)
    currency: str = Field(default="INR")
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    city_tier: str = Field(default="tier_1")
    col_multiplier: float = Field(default=1.0, ge=0.5, le=2.0)
    family_size: int = Field(default=1, ge=1, le=10)
    lifestyle: str = Field(default="moderate")
    fixed_expenses: FixedExpenses = Field(default_factory=FixedExpenses)
    variable_expenses: VariableExpenses = Field(default_factory=VariableExpenses)
    loans: List[LoanInput] = Field(default_factory=list, max_items=5)
    goals: List[SavingsGoal] = Field(default_factory=list, max_items=5)
    mode: str = Field(default="smart_balanced", description="Budget mode (basic, aggressive_savings, smart_balanced)")


# ============================================
# OUTPUT SCHEMAS
# ============================================

class BudgetSplit(BaseModel):
    """Budget percentage split"""
    needs_percent: float = Field(..., ge=0, le=100)
    wants_percent: float = Field(..., ge=0, le=100)
    savings_percent: float = Field(..., ge=0, le=100)


class BudgetAmounts(BaseModel):
    """Budget absolute amounts"""
    needs: float = Field(..., ge=0)
    wants: float = Field(..., ge=0)
    savings: float = Field(..., ge=0)


class NeedsCategory(BaseModel):
    """Needs subcategory breakdown"""
    rent: float = Field(default=0, ge=0)
    utilities: float = Field(default=0, ge=0)
    groceries: float = Field(default=0, ge=0)
    transport: float = Field(default=0, ge=0)
    insurance: float = Field(default=0, ge=0)
    medical: float = Field(default=0, ge=0)
    emi: float = Field(default=0, ge=0)
    other: float = Field(default=0, ge=-10000)  # Allow negative for rebalancing


class WantsCategory(BaseModel):
    """Wants subcategory breakdown"""
    dining: float = Field(default=0, ge=0)
    entertainment: float = Field(default=0, ge=0)
    shopping: float = Field(default=0, ge=0)
    subscriptions: float = Field(default=0, ge=0)
    other: float = Field(default=0, ge=0)


class SavingsCategory(BaseModel):
    """Savings subcategory breakdown"""
    emergency: float = Field(default=0, ge=0)
    sip: float = Field(default=0, ge=0)
    fd_rd: float = Field(default=0, ge=0)
    goals: float = Field(default=0, ge=0)


class Categories(BaseModel):
    """Complete category breakdown"""
    needs: NeedsCategory
    wants: WantsCategory
    savings: SavingsCategory


class Alert(BaseModel):
    """Alert/Risk detection"""
    code: str = Field(..., description="Alert code")
    message: str = Field(..., description="Alert message")
    severity: str = Field(..., description="Severity level (info, warning, moderate, high, critical)")
    suggestion: str = Field(..., description="Actionable suggestion")


class Metadata(BaseModel):
    """Budget plan metadata"""
    city: Optional[str] = None
    city_tier: str = Field(default="tier_1")
    col_multiplier: float = Field(default=1.0)
    notes: Optional[str] = None


class BudgetPlan(BaseModel):
    """Complete budget plan output"""
    income: float = Field(..., gt=0)
    budget_split: BudgetSplit
    budget_amounts: BudgetAmounts
    categories: Categories
    alerts: List[Alert] = Field(default_factory=list)
    explanation: str = Field(..., description="AI-generated explanation")
    metadata: Metadata


class BudgetGenerateResponse(BaseModel):
    """Budget generation API response"""
    success: bool = True
    plan: Optional[BudgetPlan] = None
    error: Optional[str] = None


class BudgetRebalanceRequest(BaseModel):
    """Rebalance budget request"""
    edited_plan: Dict[str, Any] = Field(...)
    original_inputs: BudgetGenerateRequest = Field(...)
    city_tier: str = Field(default="tier_1")
    col_multiplier: float = Field(default=1.0)


class BudgetRebalanceResponse(BaseModel):
    """Rebalance budget API response"""
    success: bool = True
    plan: Optional[BudgetPlan] = None
    alerts: List[Alert] = Field(default_factory=list)
    reasoning: Optional[str] = None
    metadata: Optional[Metadata] = None
    error: Optional[str] = None


class SavedBudget(BaseModel):
    """Saved budget in LocalStorage"""
    inputs: BudgetGenerateRequest
    mode: str
    plan: BudgetPlan
    edited: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Metadata


# ============================================
# VALIDATORS
# ============================================

class BudgetGenerateRequest(BudgetGenerateRequest):
    """Extended with validators"""
    
    @validator('lifestyle')
    def validate_lifestyle(cls, v):
        valid_lifestyles = ['minimal', 'moderate', 'comfort', 'premium']
        if v not in valid_lifestyles:
            raise ValueError(f"Lifestyle must be one of {valid_lifestyles}")
        return v
    
    @validator('mode')
    def validate_mode(cls, v):
        valid_modes = ['basic', 'aggressive_savings', 'smart_balanced']
        if v not in valid_modes:
            raise ValueError(f"Mode must be one of {valid_modes}")
        return v
    
    @validator('city_tier')
    def validate_tier(cls, v):
        valid_tiers = ['tier_1', 'tier_2', 'tier_3', 'other']
        if v not in valid_tiers:
            raise ValueError(f"City tier must be one of {valid_tiers}")
        return v
