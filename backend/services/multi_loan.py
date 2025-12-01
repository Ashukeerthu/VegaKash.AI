"""
Multi-Loan Management Service
Implements debt snowball and avalanche strategies
"""
from typing import List, Dict, Any
from schemas import (
    LoanDetail, MultiLoanInput, DebtPayoffStrategy,
    LoanPayoffStep, DebtStrategyComparison
)
import uuid


def calculate_loan_emi(principal: float, annual_rate: float, months: int) -> float:
    """
    Calculate EMI using compound interest formula
    EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    """
    if principal <= 0 or months <= 0:
        return 0
    
    if annual_rate == 0:
        return principal / months
    
    monthly_rate = annual_rate / 12 / 100
    emi = (principal * monthly_rate * pow(1 + monthly_rate, months)) / (pow(1 + monthly_rate, months) - 1)
    return round(emi, 2)


def calculate_snowball_strategy(loans: List[LoanDetail], extra_payment: float) -> DebtPayoffStrategy:
    """
    Debt Snowball: Pay off smallest balance first
    Provides psychological wins by eliminating debts quickly
    """
    # Sort by current balance (smallest first)
    sorted_loans = sorted(loans, key=lambda x: x.current_balance)
    
    return _calculate_payoff_strategy(sorted_loans, extra_payment, "snowball")


def calculate_avalanche_strategy(loans: List[LoanDetail], extra_payment: float) -> DebtPayoffStrategy:
    """
    Debt Avalanche: Pay off highest interest rate first
    Minimizes total interest paid
    """
    # Sort by interest rate (highest first)
    sorted_loans = sorted(loans, key=lambda x: x.interest_rate, reverse=True)
    
    return _calculate_payoff_strategy(sorted_loans, extra_payment, "avalanche")


def _calculate_payoff_strategy(
    sorted_loans: List[LoanDetail], 
    extra_payment: float,
    strategy_type: str
) -> DebtPayoffStrategy:
    """
    Core logic for calculating debt payoff strategy
    """
    # Create working copies of loans
    active_loans: List[Dict[str, Any]] = []
    for loan in sorted_loans:
        active_loans.append({
            'loan_id': loan.loan_id,
            'loan_name': loan.loan_name,
            'balance': loan.current_balance,
            'rate': loan.interest_rate / 12 / 100,  # Monthly rate
            'min_payment': loan.monthly_emi,
            'paid_off': False
        })
    
    monthly_breakdown: List[LoanPayoffStep] = []
    total_interest = 0
    month = 0
    max_months = 600  # Safety limit: 50 years
    
    while any(not loan['paid_off'] for loan in active_loans) and month < max_months:
        month += 1
        available_extra = extra_payment
        
        # Process each loan
        for loan in active_loans:
            if loan['paid_off']:
                continue
            
            # Calculate interest for this month
            interest_charge = loan['balance'] * loan['rate']
            total_interest += interest_charge
            
            # Determine payment
            if active_loans.index(loan) == next(
                i for i, l in enumerate(active_loans) if not l['paid_off']
            ):
                # First unpaid loan gets extra payment
                payment = min(loan['min_payment'] + available_extra, loan['balance'] + interest_charge)
                available_extra = 0
            else:
                # Other loans get minimum payment
                payment = min(loan['min_payment'], loan['balance'] + interest_charge)
            
            # Apply payment
            principal_paid = payment - interest_charge
            loan['balance'] = max(0, loan['balance'] - principal_paid)
            
            # Check if paid off
            if loan['balance'] <= 0.01:  # Consider paid off if < 1 cent
                loan['paid_off'] = True
                loan['balance'] = 0
                # Free up this loan's minimum payment for extra payment
                extra_payment += loan['min_payment']
            
            # Record step
            monthly_breakdown.append(LoanPayoffStep(
                month=month,
                loan_id=loan['loan_id'],
                loan_name=loan['loan_name'],
                payment=round(payment, 2),
                remaining_balance=round(loan['balance'], 2),
                is_paid_off=loan['paid_off']
            ))
    
    # Generate summary
    payoff_order: List[str] = [loan.loan_id for loan in sorted_loans]
    strategy_desc = (
        f"Snowball Strategy: Pay off smallest balance first for psychological wins"
        if strategy_type == "snowball"
        else f"Avalanche Strategy: Pay off highest interest first to minimize total interest"
    )
    
    summary = (
        f"{strategy_desc}\n"
        f"Total months to debt-free: {month}\n"
        f"Total interest paid: ₹{round(total_interest, 2):,}\n"
        f"Payoff order: {', '.join([l.loan_name for l in sorted_loans])}"
    )
    
    return DebtPayoffStrategy(
        strategy_type=strategy_type,
        payoff_order=payoff_order,
        total_months=month,
        total_interest=round(total_interest, 2),
        monthly_breakdown=monthly_breakdown,
        summary=summary
    )


def compare_debt_strategies(multi_loan_input: MultiLoanInput) -> DebtStrategyComparison:
    """
    Compare snowball vs avalanche strategies
    """
    snowball = calculate_snowball_strategy(
        multi_loan_input.loans,
        multi_loan_input.extra_payment
    )
    
    avalanche = calculate_avalanche_strategy(
        multi_loan_input.loans,
        multi_loan_input.extra_payment
    )
    
    interest_saved = snowball.total_interest - avalanche.total_interest
    time_saved = snowball.total_months - avalanche.total_months
    
    # Determine recommendation
    if interest_saved > 1000 or time_saved > 3:
        recommendation = (
            f"Avalanche method recommended: Saves ₹{round(interest_saved, 2):,} "
            f"in interest and {time_saved} months compared to snowball method. "
            f"Focus on highest interest rate debts first."
        )
    elif time_saved < 0:
        recommendation = (
            f"Snowball method recommended: While avalanche saves ₹{round(interest_saved, 2):,} "
            f"in interest, snowball provides psychological wins by eliminating debts faster. "
            f"Good for staying motivated!"
        )
    else:
        recommendation = (
            f"Both methods are similar: Interest difference is only ₹{round(interest_saved, 2):,}. "
            f"Choose snowball for motivation or avalanche for maximum savings."
        )
    
    return DebtStrategyComparison(
        snowball=snowball,
        avalanche=avalanche,
        interest_saved=round(interest_saved, 2),
        time_saved_months=time_saved,
        recommendation=recommendation
    )


def generate_loan_details_from_input(loans: List[Any]) -> List[LoanDetail]:
    """
    Convert simple loan input to detailed loan objects
    """
    detailed_loans: List[LoanDetail] = []
    
    for loan in loans:
        loan_id = str(uuid.uuid4())[:8]
        emi = calculate_loan_emi(
            loan.outstanding_principal,
            loan.interest_rate_annual,
            loan.remaining_months
        )
        
        detailed_loans.append(LoanDetail(
            loan_id=loan_id,
            loan_type=loan.name.lower().replace(' ', '_'),
            loan_name=loan.name,
            principal=loan.outstanding_principal,
            interest_rate=loan.interest_rate_annual,
            tenure_months=loan.remaining_months,
            current_balance=loan.outstanding_principal,
            monthly_emi=emi
        ))
    
    return detailed_loans
