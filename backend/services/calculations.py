"""
Financial Calculations Service
Pure Python functions for rule-based financial calculations
"""
from schemas import FinancialInput, SummaryOutput, ExpensesInput, LoanInput


def calculate_principal_from_emi(emi: float, interest_rate_annual: float, months: int) -> float:
    """
    Calculate outstanding principal from known EMI (reverse EMI calculation)
    
    Args:
        emi: Monthly EMI amount
        interest_rate_annual: Annual interest rate in percentage
        months: Number of months remaining
        
    Returns:
        Outstanding principal amount
    """
    annual_rate = interest_rate_annual / 100
    monthly_rate = annual_rate / 12
    
    # Handle edge case of 0% interest
    if monthly_rate == 0:
        return emi * months
    
    # Reverse EMI formula: P = EMI * [((1+r)^n - 1) / (r * (1+r)^n)]
    principal = emi * (((1 + monthly_rate) ** months - 1) / (monthly_rate * ((1 + monthly_rate) ** months)))
    return round(principal, 2)


def calculate_loan_emi(loan: LoanInput) -> float:
    """
    Calculate monthly EMI for a loan
    Supports two modes:
    1. EMI mode: Returns the provided EMI directly
    2. Principal mode: Calculates EMI from principal
    
    Uses EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    
    Args:
        loan: LoanInput with either EMI or principal details
        
    Returns:
        Monthly EMI amount
    """
    # Mode 1: User knows EMI (most common)
    if loan.input_mode == "emi" and loan.monthly_emi:
        return loan.monthly_emi
    
    # Mode 2: User knows principal (calculate EMI)
    if loan.input_mode == "principal" and loan.outstanding_principal:
        principal = loan.outstanding_principal
        annual_rate = loan.interest_rate_annual / 100
        monthly_rate = annual_rate / 12
        months = loan.remaining_months
        
        # Handle edge case of 0% interest
        if monthly_rate == 0:
            return round(principal / months, 2)
        
        # EMI formula
        emi = principal * monthly_rate * ((1 + monthly_rate) ** months) / (((1 + monthly_rate) ** months) - 1)
        return round(emi, 2)
    
    # Fallback: if neither mode properly configured, raise error
    raise ValueError(f"Invalid loan configuration: mode={loan.input_mode}, emi={loan.monthly_emi}, principal={loan.outstanding_principal}")


def calculate_total_expenses(expenses: ExpensesInput, loans: list = None) -> float:
    """
    Sum all expense categories including EMI from loans
    
    Args:
        expenses: ExpensesInput object with all expense categories
        loans: List of LoanInput objects to calculate total EMI
        
    Returns:
        Total monthly expenses including loan EMIs
    """
    base_expenses = (
        expenses.housing_rent +
        expenses.groceries_food +
        expenses.transport +
        expenses.utilities +
        expenses.insurance +
        expenses.entertainment +
        expenses.subscriptions +
        expenses.others
    )
    
    # Add EMI from all loans (supports both EMI-first and principal-first modes)
    total_emi = 0
    if loans:
        for loan in loans:
            emi = calculate_loan_emi(loan)
            total_emi += emi
    
    return base_expenses + total_emi


def get_loan_principal(loan: LoanInput) -> float:
    """
    Get or calculate the outstanding principal for a loan
    
    Args:
        loan: LoanInput with either EMI or principal details
        
    Returns:
        Outstanding principal amount
    """
    # Mode 1: User knows EMI, calculate principal
    if loan.input_mode == "emi" and loan.monthly_emi:
        return calculate_principal_from_emi(
            loan.monthly_emi,
            loan.interest_rate_annual,
            loan.remaining_months
        )
    
    # Mode 2: User knows principal
    if loan.input_mode == "principal" and loan.outstanding_principal:
        return loan.outstanding_principal
    
    # Fallback
    raise ValueError(f"Invalid loan configuration: mode={loan.input_mode}")


def generate_basic_advice(
    has_deficit: bool,
    savings_rate: float,
    debt_to_income: float,
    net_savings: float
) -> str:
    """
    Generate rule-based financial advice based on key metrics
    
    Args:
        has_deficit: Whether expenses exceed income
        savings_rate: Savings rate percentage
        debt_to_income: Debt-to-income ratio percentage
        net_savings: Net savings amount
        
    Returns:
        Personalized advice string
    """
    advice_parts: list[str] = []
    
    # Priority 1: Handle deficit
    if has_deficit:
        advice_parts.append(
            "⚠️ You are spending more than you earn. Immediate action required! "
            "Review and cut discretionary expenses like entertainment, dining out, and subscriptions."
        )
    
    # Priority 2: Low savings rate
    elif savings_rate < 10:
        advice_parts.append(
            "💰 Your savings rate is very low (below 10%). Aim for at least 20% savings. "
            "Start by tracking every expense and identifying areas to cut back."
        )
    
    # Priority 3: High debt
    if debt_to_income > 40:
        advice_parts.append(
            "📊 Your debt-to-income ratio is high (above 40%). Prioritize loan repayment. "
            "Consider the avalanche method (highest interest first) or snowball method (smallest balance first)."
        )
    
    # Priority 4: Moderate savings
    if 10 <= savings_rate < 20 and not has_deficit:
        advice_parts.append(
            "✅ You're saving, but there's room for improvement. Target 20-30% savings rate for better financial security."
        )
    
    # Priority 5: Good financial health
    if savings_rate >= 20 and debt_to_income <= 40 and not has_deficit:
        advice_parts.append(
            "🎉 Great job! Your finances look healthy. Focus on diversifying investments and building emergency fund (6 months expenses)."
        )
    
    # If no specific issues, provide general advice
    if not advice_parts:
        advice_parts.append(
            "💡 Your finances are on track. Keep monitoring your expenses and stay consistent with your savings goals."
        )
    
    return " ".join(advice_parts)


def calculate_summary(financial_input: FinancialInput) -> SummaryOutput:
    """
    Calculate comprehensive financial summary from user input
    This is the main calculation function called by the API
    
    Args:
        financial_input: Complete financial data from user
        
    Returns:
        SummaryOutput with all calculated metrics and advice
    """
    # Calculate total income
    total_income = financial_input.monthly_income_primary + financial_input.monthly_income_additional
    
    # Calculate total expenses (includes EMI from loans)
    total_expenses = calculate_total_expenses(financial_input.expenses, financial_input.loans)
    
    # Calculate net savings
    net_savings = total_income - total_expenses
    
    # Calculate savings rate percentage
    savings_rate_percent = (net_savings / total_income * 100) if total_income > 0 else 0
    
    # Calculate total EMI from loans
    total_emi_from_loans = sum(calculate_loan_emi(loan) for loan in financial_input.loans)
    
    # Calculate debt-to-income ratio
    debt_to_income_ratio_percent = (total_emi_from_loans / total_income * 100) if total_income > 0 else 0
    
    # Check for deficit
    has_deficit = net_savings < 0
    
    # Generate basic advice
    basic_advice = generate_basic_advice(
        has_deficit=has_deficit,
        savings_rate=savings_rate_percent,
        debt_to_income=debt_to_income_ratio_percent,
        net_savings=net_savings
    )
    
    # Calculate 50-30-20 rule recommendations based on total income
    rule_50_needs = total_income * 0.5
    rule_30_wants = total_income * 0.3
    rule_20_savings = total_income * 0.2
    
    return SummaryOutput(
        total_income=round(total_income, 2),
        total_expenses=round(total_expenses, 2),
        net_savings=round(net_savings, 2),
        savings_rate_percent=round(savings_rate_percent, 2),
        debt_to_income_ratio_percent=round(debt_to_income_ratio_percent, 2),
        has_deficit=has_deficit,
        basic_advice=basic_advice,
        rule_50_30_20_needs=round(rule_50_needs, 2),
        rule_50_30_20_wants=round(rule_30_wants, 2),
        rule_50_30_20_savings=round(rule_20_savings, 2)
    )
