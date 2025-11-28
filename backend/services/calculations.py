"""
Financial Calculations Service
Pure Python functions for rule-based financial calculations
"""
from schemas import FinancialInput, SummaryOutput, ExpensesInput, LoanInput


def calculate_loan_emi(loan: LoanInput) -> float:
    """
    Calculate approximate monthly EMI for a loan
    Uses simple EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    
    Args:
        loan: LoanInput with principal, interest rate, and remaining months
        
    Returns:
        Monthly EMI amount
    """
    principal = loan.outstanding_principal
    annual_rate = loan.interest_rate_annual / 100
    monthly_rate = annual_rate / 12
    months = loan.remaining_months
    
    # Handle edge case of 0% interest
    if monthly_rate == 0:
        return principal / months
    
    # EMI formula
    emi = principal * monthly_rate * ((1 + monthly_rate) ** months) / (((1 + monthly_rate) ** months) - 1)
    return round(emi, 2)


def calculate_total_expenses(expenses: ExpensesInput) -> float:
    """
    Sum all expense categories
    
    Args:
        expenses: ExpensesInput object with all expense categories
        
    Returns:
        Total monthly expenses
    """
    return (
        expenses.housing_rent +
        expenses.groceries_food +
        expenses.transport +
        expenses.utilities +
        expenses.insurance +
        expenses.emi_loans +
        expenses.entertainment +
        expenses.subscriptions +
        expenses.others
    )


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
    
    # Calculate total expenses
    total_expenses = calculate_total_expenses(financial_input.expenses)
    
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
