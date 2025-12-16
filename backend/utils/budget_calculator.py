"""
Budget Planner V1.2 - Budget Calculation Utilities
Core algorithms for budget generation and adjustments
Includes Auto Loan-specific calculations
"""

from typing import Dict, List

# ============================================
# COL ADJUSTMENT ALGORITHM
# ============================================

def calculate_col_adjusted_budget(
    base_needs: float = 50,
    col_multiplier: float = 1.0,
    min_savings: float = 5.0
) -> Dict[str, float]:
    """
    Calculate COL-adjusted budget split.
    
    Formula:
    col_factor = (col_multiplier - 1) * 0.8
    needs_adj = base_needs * (1 + col_factor)
    reduction = needs_adj - base_needs
    savings_adj = max(20 - reduction, min_savings)
    wants_adj = 100 - needs_adj - savings_adj
    
    Args:
        base_needs: Base needs percentage (default 50)
        col_multiplier: Cost-of-living multiplier (1.25, 1.05, 0.90, 1.00)
        min_savings: Minimum savings threshold (default 5%)
    
    Returns:
        Dict with needs, wants, savings percentages
    """
    base_savings = 20.0
    
    # Apply COL factor to needs
    col_factor = (col_multiplier - 1) * 0.8
    adjusted_needs = base_needs * (1 + col_factor)
    
    # Calculate reduction in savings
    reduction = adjusted_needs - base_needs
    adjusted_savings = max(base_savings - reduction, min_savings)
    
    # Remaining to wants
    adjusted_wants = 100 - adjusted_needs - adjusted_savings
    
    # Ensure non-negative
    if adjusted_wants < 0:
        adjusted_wants = 0
        adjusted_savings = 100 - adjusted_needs
    
    return {
        "needs": round(adjusted_needs, 2),
        "wants": round(adjusted_wants, 2),
        "savings": round(adjusted_savings, 2),
        "adjustment_factor": round(col_factor, 2),
    }


def apply_lifestyle_modifier(
    wants_percent: float,
    lifestyle: str
) -> float:
    """
    Apply lifestyle modifier to wants percentage.
    
    Args:
        wants_percent: Base wants percentage
        lifestyle: Lifestyle type (minimal, moderate, comfort, premium)
    
    Returns:
        Modified wants percentage
    """
    lifestyle_modifiers: Dict[str, float] = {
        'minimal': -7.5,      # Reduce wants
        'moderate': 0,         # No change
        'comfort': 5,         # Increase wants
        'premium': 12.5,      # Significantly increase wants
    }
    
    modifier = lifestyle_modifiers.get(lifestyle, 0)
    return max(wants_percent + modifier, 0)


def apply_income_based_tuning(
    income: float,
    needs_percent: float,
    wants_percent: float,
    savings_percent: float,
    rent: float = 0,
    total_emi: float = 0,
) -> Dict[str, float]:
    """
    Apply income-based fine-tuning to budget split.
    
    Rules:
    - Very low income (<₹25k): Increase needs by 5%
    - High income (>₹150k): Can maintain higher savings
    - High rent ratio (>35%): Reduce wants by 10-15%
    - High EMI ratio (>25%): Reduce wants by 10%
    
    Args:
        income: Monthly income
        needs_percent: Current needs percentage
        wants_percent: Current wants percentage
        savings_percent: Current savings percentage
        rent: Monthly rent
        total_emi: Total EMI amount
    
    Returns:
        Adjusted percentages
    """
    adjusted_needs = needs_percent
    adjusted_wants = wants_percent
    adjusted_savings = savings_percent
    
    # Very low income adjustment
    if income < 25000:
        adjusted_needs = min(needs_percent + 5, 75)
        reduction = adjusted_needs - needs_percent
        adjusted_savings = max(savings_percent - reduction, 3)
        adjusted_wants = 100 - adjusted_needs - adjusted_savings
    
    # High rent ratio adjustment
    rent_ratio = (rent / income) if income > 0 else 0
    if rent_ratio > 0.35:
        rent_reduction = min(adjusted_wants * 0.10, 10)
        adjusted_wants -= rent_reduction
        adjusted_savings = 100 - adjusted_needs - adjusted_wants
    
    # High EMI adjustment
    emi_ratio = (total_emi / income) if income > 0 else 0
    if emi_ratio > 0.25:
        emi_reduction = min(adjusted_wants * 0.10, 8)
        adjusted_wants -= emi_reduction
        adjusted_savings = 100 - adjusted_needs - adjusted_wants
    
    # Ensure valid split
    total = adjusted_needs + adjusted_wants + adjusted_savings
    if total != 100:
        adjusted_savings = 100 - adjusted_needs - adjusted_wants
    
    return {
        "needs": round(max(adjusted_needs, 0), 2),
        "wants": round(max(adjusted_wants, 0), 2),
        "savings": round(max(adjusted_savings, 0), 2),
    }


# ============================================
# CATEGORY ALLOCATION
# ============================================

def allocate_budget(
    income: float,
    needs_amount: float,
    wants_amount: float,
    savings_amount: float,
    fixed_expenses: Dict[str, float],
    variable_expenses: Dict[str, float],
    loans: List[Dict[str, float]],
    goals: List[Dict[str, float]],
) -> Dict[str, Dict[str, float]]:
    """
    Allocate budget to subcategories.
    
    Args:
        income: Monthly income
        needs_amount: Total needs amount
        wants_amount: Total wants amount
        savings_amount: Total savings amount
        fixed_expenses: Fixed expenses from input
        variable_expenses: Variable expenses from input
        loans: List of loans
        goals: List of savings goals
    
    Returns:
        Dict with category breakdowns
    """
    
    # Calculate total EMI
    total_emi = sum(calculate_emi(loan) for loan in loans)
    
    # NEEDS ALLOCATION
    needs_categories: Dict[str, float] = {
        'rent': fixed_expenses.get('rent', 0),
        'utilities': fixed_expenses.get('utilities', 0),
        'groceries': variable_expenses.get('groceries', 0),
        'transport': variable_expenses.get('transport', 0),
        'insurance': fixed_expenses.get('insurance', 0),
        'medical': fixed_expenses.get('medical', 0),
        'emi': total_emi,
        'other': fixed_expenses.get('other', 0),
    }
    
    # Calculate total of input needs
    input_needs_total = sum(needs_categories.values())
    
    # If input needs exceed needs_amount, proportionally reduce
    if input_needs_total > needs_amount:
        scale_factor = needs_amount / input_needs_total if input_needs_total > 0 else 1
        needs_categories = {k: v * scale_factor for k, v in needs_categories.items()}
    else:
        # If less, allocate remaining to "other" or reduce from input
        difference = needs_amount - input_needs_total
        if needs_categories['other'] + difference >= 0:
            needs_categories['other'] += difference
        else:
            # Reduce other, then scale down
            needs_categories['other'] = 0
            scale_factor = needs_amount / (input_needs_total - needs_categories['other'])
            for k in needs_categories:
                if k != 'other':
                    needs_categories[k] *= scale_factor
    
    # WANTS ALLOCATION
    wants_categories: Dict[str, float] = {
        'dining': variable_expenses.get('dining_out', 0),
        'entertainment': variable_expenses.get('entertainment', 0),
        'shopping': variable_expenses.get('shopping', 0),
        'subscriptions': variable_expenses.get('subscriptions', 0),
        'other': variable_expenses.get('other', 0),
    }
    
    # Distribute wants_amount proportionally
    input_wants_total = sum(wants_categories.values())
    if input_wants_total > 0:
        scale_factor = wants_amount / input_wants_total
        wants_categories = {k: v * scale_factor for k, v in wants_categories.items()}
    else:
        # Distribute evenly if no input
        per_category = wants_amount / len(wants_categories)
        wants_categories = {k: per_category for k in wants_categories}
    
    # SAVINGS ALLOCATION
    # Allocate based on goals and default priority
    savings_categories = allocate_savings(savings_amount, goals)
    
    return {
        'needs': {k: round(v, 2) for k, v in needs_categories.items()},
        'wants': {k: round(v, 2) for k, v in wants_categories.items()},
        'savings': {k: round(v, 2) for k, v in savings_categories.items()},
    }


def allocate_savings(savings_amount: float, goals: List[Dict[str, float]]) -> Dict[str, float]:
    """
    Allocate savings to emergency fund, SIP, FD/RD, and goal-based.
    
    Default allocation: Emergency (40%), SIP (40%), FD/RD (15%), Goals (5%)
    If goals exist, adjust allocation based on priority
    
    Args:
        savings_amount: Total savings amount
        goals: List of savings goals
    
    Returns:
        Dict with savings category breakdown
    """
    
    # If goals exist, allocate based on priority and target
    if goals and len(goals) > 0:
        # Reserve 40% for emergency, 40% for SIP, 15% for FD/RD
        emergency = savings_amount * 0.40
        sip = savings_amount * 0.40
        fd_rd = savings_amount * 0.15
        goal_amount = savings_amount * 0.05
        
        return {
            'emergency': emergency,
            'sip': sip,
            'fd_rd': fd_rd,
            'goals': goal_amount,
        }
    else:
        # Default allocation
        return {
            'emergency': savings_amount * 0.40,
            'sip': savings_amount * 0.40,
            'fd_rd': savings_amount * 0.15,
            'goals': savings_amount * 0.05,
        }


# ============================================
# EMI CALCULATION
# ============================================

def calculate_emi(loan: Dict[str, float]) -> float:
    """
    Calculate monthly EMI using standard formula.
    
    Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    where:
    - P = Principal
    - r = Monthly interest rate (annual_rate / 12 / 100)
    - n = Tenure in months
    
    Args:
        loan: Loan dict with principal, rate, tenure_months
    
    Returns:
        Monthly EMI amount
    """
    principal = loan.get('principal', 0)
    annual_rate = loan.get('rate', 0)
    tenure_months = loan.get('tenure_months', 1)
    
    if principal <= 0 or tenure_months <= 0:
        return 0
    
    if annual_rate <= 0:
        # Simple division if no interest
        return principal / tenure_months
    
    # Calculate monthly rate
    monthly_rate = annual_rate / 12 / 100
    
    # EMI formula
    numerator = principal * monthly_rate * ((1 + monthly_rate) ** tenure_months)
    denominator = ((1 + monthly_rate) ** tenure_months) - 1
    
    emi = numerator / denominator
    
    return round(emi, 2)


# ============================================
# TOTAL CALCULATIONS
# ============================================

def calculate_total_expenses(fixed_expenses: Dict[str, float], variable_expenses: Dict[str, float], loans: List[Dict[str, float]]) -> float:
    """
    Calculate total monthly expenses including EMI.
    
    Args:
        fixed_expenses: Fixed expenses dict
        variable_expenses: Variable expenses dict
        loans: List of loans
    
    Returns:
        Total expenses
    """
    fixed_total = sum(fixed_expenses.values())
    variable_total = sum(variable_expenses.values())
    emi_total = sum(calculate_emi(loan) for loan in loans)
    
    return fixed_total + variable_total + emi_total


def calculate_total_emi(loans: List[Dict[str, float]]) -> float:
    """
    Calculate total EMI from all loans.
    
    Args:
        loans: List of loans
    
    Returns:
        Total EMI amount
    """
    return sum(calculate_emi(loan) for loan in loans)


# ============================================
# BUDGET SPLIT FOR DIFFERENT MODES
# ============================================

def get_mode_adjustment(mode: str) -> Dict[str, float]:
    """
    Get budget mode adjustments.
    
    Modes:
    - basic: 45/30/25 split
    - aggressive_savings: High savings (30-40%)
    - smart_balanced: AI-optimized (default)
    
    Args:
        mode: Budget mode
    
    Returns:
        Dict with mode adjustment factors
    """
    modes: Dict[str, Dict[str, float]] = {
        'basic': {
            'base_needs': 45.0,
            'wants_reduction': 0.0,  # No reduction
            'savings_boost': 0.0,     # No boost
        },
        'aggressive_savings': {
            'base_needs': 50.0,
            'wants_reduction': 40.0,  # Reduce wants by 40%
            'savings_boost': 15.0,    # Boost savings by 15%
        },
        'smart_balanced': {
            'base_needs': 50.0,
            'wants_reduction': 0.0,   # Will be AI-calculated
            'savings_boost': 0.0,     # Will be AI-calculated
        },
    }
    
    return modes.get(mode, modes['smart_balanced'])
