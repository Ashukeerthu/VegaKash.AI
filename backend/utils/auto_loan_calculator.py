"""Auto Loan Calculator - India Auto Loan Eligibility & Affordability Engine

Production-Grade Auto Loan Underwriting Engine for India

This module implements bank-grade auto loan eligibility calculation with:
- Vehicle-specific LTV (Loan-to-Value) constraints
- Depreciation-aware valuation models
- FOIR (Fixed Obligation Income Ratio) calculations
- Tenure caps by vehicle type and age
- Interest rate modeling (bank vs NBFC vs dealer)
- Risk assessment and actionable recommendations
- Total Cost of Ownership (TCO) analysis

Positioning:
NOT: Simple "EMI Calculator"
YES: "India Auto Loan Eligibility & Affordability Calculator"
     Answers: Can I get the loan? Is it risky? What should I change? What's the real cost?

Product Quality: Better than BankBazaar, HDFC, Cholamandalam online tools
Use Case: Financial advisory, not just math
"""

from typing import Dict, List, Any

# Import EMI calculation from budget_calculator
from .budget_calculator import calculate_emi


# ============================================
# AUTO LOAN SPECIFIC CALCULATIONS
# ============================================

def get_vehicle_ltv_rules(vehicle_type: str) -> Dict[str, float]:
    """
    Get Loan-to-Value (LTV) rules by vehicle type in India.
    
    Vehicle Types:
    - new_car: 85-90% LTV
    - used_car: 50-70% LTV (depends on age)
    - new_two_wheeler: 90-100% LTV
    - used_two_wheeler: 50-60% LTV
    - electric_vehicle: 90-100% LTV (higher due to govt push)
    
    Args:
        vehicle_type: Type of vehicle
    
    Returns:
        Dict with max_ltv, typical_ltv, min_down_payment
    """
    ltv_rules: Dict[str, Dict[str, float]] = {
        'new_car': {
            'max_ltv': 90.0,
            'typical_ltv': 85.0,
            'min_down_payment': 10.0,
        },
        'used_car': {
            'max_ltv': 70.0,
            'typical_ltv': 60.0,
            'min_down_payment': 30.0,
        },
        'new_two_wheeler': {
            'max_ltv': 100.0,
            'typical_ltv': 90.0,
            'min_down_payment': 0.0,
        },
        'used_two_wheeler': {
            'max_ltv': 60.0,
            'typical_ltv': 50.0,
            'min_down_payment': 40.0,
        },
        'electric_vehicle': {
            'max_ltv': 100.0,
            'typical_ltv': 90.0,
            'min_down_payment': 0.0,
        },
    }
    
    return ltv_rules.get(vehicle_type, ltv_rules['new_car'])


def get_vehicle_depreciation_factor(vehicle_type: str, vehicle_age_years: int = 0) -> float:
    """
    Calculate depreciation factor for vehicle valuation.
    
    Indian auto depreciation (typical):
    - Year 1: 15% depreciation
    - Year 2: 12% depreciation
    - Year 3: 10% depreciation
    - Year 4+: 8% per year
    
    Args:
        vehicle_type: Type of vehicle
        vehicle_age_years: Age of vehicle in years (0 for new)
    
    Returns:
        Depreciation multiplier (0.85 means 15% depreciated)
    """
    if vehicle_age_years == 0:
        return 1.0  # New vehicle, no depreciation
    
    # Depreciation schedule
    depreciation_schedule = {
        1: 0.85,  # 15% depreciation
        2: 0.73,  # 27% total
        3: 0.63,  # 37% total
        4: 0.55,  # 45% total
        5: 0.47,  # 53% total
    }
    
    # For vehicles older than 5 years, apply 8% per year
    if vehicle_age_years <= 5:
        return depreciation_schedule.get(vehicle_age_years, 0.47)
    else:
        # Cap at 75% depreciation (25% residual value)
        years_beyond_5 = vehicle_age_years - 5
        factor = 0.47 * (0.92 ** years_beyond_5)
        return max(factor, 0.25)


def get_auto_loan_tenure_cap(vehicle_type: str, vehicle_age_years: int = 0) -> Dict[str, int]:
    """
    Get maximum tenure caps for auto loans in India.
    
    Tenure Rules:
    - New car: 84 months (7 years) max
    - Used car: 60 months (5 years) max, reduces with age
    - Two wheeler: 60 months (5 years) max
    
    Args:
        vehicle_type: Type of vehicle
        vehicle_age_years: Age of vehicle
    
    Returns:
        Dict with max_tenure_months and recommended_tenure_months
    """
    if vehicle_type in ['new_car', 'electric_vehicle']:
        return {
            'max_tenure_months': 84,
            'recommended_tenure_months': 60,
        }
    elif vehicle_type == 'used_car':
        # Used car tenure reduces with age
        max_tenure = max(60 - (vehicle_age_years * 12), 24)
        return {
            'max_tenure_months': max_tenure,
            'recommended_tenure_months': min(max_tenure, 48),
        }
    elif vehicle_type in ['new_two_wheeler', 'used_two_wheeler']:
        max_tenure = 48 if vehicle_type == 'used_two_wheeler' else 60
        return {
            'max_tenure_months': max_tenure,
            'recommended_tenure_months': 36,
        }
    else:
        return {
            'max_tenure_months': 60,
            'recommended_tenure_months': 48,
        }


def calculate_on_road_price(
    ex_showroom_price: float,
    state: str = 'MH',
    vehicle_type: str = 'new_car'
) -> Dict[str, float]:
    """
    Calculate on-road price from ex-showroom price.
    
    Components:
    - Ex-showroom price
    - Road Tax (4-13% depending on state and vehicle price)
    - Registration charges (₹600-2000)
    - Insurance (₹10k-30k for cars, ₹3k-8k for two wheelers)
    - Other charges (₹5k-15k)
    
    Args:
        ex_showroom_price: Ex-showroom price
        state: State code (affects road tax)
        vehicle_type: Type of vehicle
    
    Returns:
        Dict with on_road_price and breakdown
    """
    # Road tax (simplified, varies by state)
    # For Maharashtra: ~13% for cars >10L, ~10% for <10L
    if ex_showroom_price > 1000000:
        road_tax_percent = 13.0
    elif ex_showroom_price > 500000:
        road_tax_percent = 10.0
    else:
        road_tax_percent = 7.0
    
    road_tax = ex_showroom_price * (road_tax_percent / 100)
    
    # Registration charges
    if vehicle_type in ['new_car', 'used_car', 'electric_vehicle']:
        registration = 2000
    else:
        registration = 600
    
    # Insurance (first year comprehensive)
    if vehicle_type in ['new_car', 'electric_vehicle']:
        if ex_showroom_price > 1500000:
            insurance = 30000
        elif ex_showroom_price > 800000:
            insurance = 20000
        else:
            insurance = 12000
    elif vehicle_type == 'used_car':
        insurance = 8000
    else:
        insurance = 3500
    
    # Other charges (handling, logistics, etc.)
    other_charges = 10000 if vehicle_type in ['new_car', 'electric_vehicle'] else 3000
    
    on_road_price = ex_showroom_price + road_tax + registration + insurance + other_charges
    
    return {
        'on_road_price': round(on_road_price, 2),
        'ex_showroom_price': ex_showroom_price,
        'road_tax': round(road_tax, 2),
        'registration': registration,
        'insurance': insurance,
        'other_charges': other_charges,
    }


def calculate_auto_loan_eligibility(
    monthly_income: float,
    existing_emi: float,
    vehicle_price: float,
    down_payment: float,
    vehicle_type: str = 'new_car',
    vehicle_age_years: int = 0,
    interest_rate: float = 9.5,
    tenure_months: int = 60,
) -> Dict[str, Any]:
    """
    Calculate auto loan eligibility with India-specific underwriting rules.
    
    Bank-Grade Auto Loan Rules Applied:
    - Auto EMI ≤ 20% of income (industry standard: 15-20%)
    - Total FOIR ≤ 45% of income (industry standard: 40-45%)
    - LTV limits by vehicle type and condition
    - Tenure caps by vehicle type, age, and residual value
    - Vehicle age + tenure must not exceed 10 years (bank constraint)
    
    Args:
        monthly_income: Monthly gross income (annual / 12)
        existing_emi: Existing EMI commitments (home, personal, etc.)
        vehicle_price: On-road/total financed price (includes tax, insurance, registration)
        down_payment: Down payment amount
        vehicle_type: Type of vehicle (new_car, used_car, electric_vehicle, new_two_wheeler, used_two_wheeler)
        vehicle_age_years: Age of vehicle in years (0 for new)
        interest_rate: Annual interest rate (%)
        tenure_months: Loan tenure in months
    
    Returns:
        Dict with:
        - eligible: Boolean
        - risk_level: 'low', 'medium', 'high'
        - checks: Individual eligibility criteria
        - loan_details: EMI, ratios, amounts
        - vehicle_details: Type, depreciation, LTV
        - recommendations: Actionable suggestions to improve eligibility
    """
    # Get vehicle-specific rules
    ltv_rules = get_vehicle_ltv_rules(vehicle_type)
    tenure_cap = get_auto_loan_tenure_cap(vehicle_type, vehicle_age_years)
    depreciation_factor = get_vehicle_depreciation_factor(vehicle_type, vehicle_age_years)
    
    # Calculate max loan based on LTV
    effective_vehicle_value = vehicle_price * depreciation_factor
    max_loan_by_ltv = effective_vehicle_value * (ltv_rules['max_ltv'] / 100)
    
    # Requested loan
    requested_loan = vehicle_price - down_payment
    
    # Check tenure with vehicle age constraint
    # Bank rule: vehicle_age + loan_tenure should not exceed 10 years
    vehicle_age_months = vehicle_age_years * 12
    max_age_constraint = max(120 - vehicle_age_months, 24)  # Min 24 months tenure
    effective_max_tenure = min(tenure_cap['max_tenure_months'], max_age_constraint)
    tenure_valid = tenure_months <= effective_max_tenure
    
    # Calculate EMI for requested loan
    auto_emi = calculate_emi({
        'principal': requested_loan,
        'rate': interest_rate,
        'tenure_months': tenure_months,
    })
    
    # Check EMI ratios
    auto_emi_ratio = (auto_emi / monthly_income) * 100 if monthly_income > 0 else 100
    total_emi = auto_emi + existing_emi
    total_emi_ratio = (total_emi / monthly_income) * 100 if monthly_income > 0 else 100
    
    # Eligibility checks
    checks = {
        'ltv_check': requested_loan <= max_loan_by_ltv,
        'auto_emi_check': auto_emi_ratio <= 20,  # Auto EMI should be ≤ 20% of income
        'total_foir_check': total_emi_ratio <= 45,  # Total EMI ≤ 45% of income (auto loans allow higher)
        'tenure_check': tenure_valid,
    }
    
    # Overall eligibility
    eligible = all(checks.values())
    
    # Risk assessment
    if total_emi_ratio > 45:
        risk_level = 'high'
    elif total_emi_ratio > 40 or auto_emi_ratio > 18:
        risk_level = 'medium'
    else:
        risk_level = 'low'
    
    # Recommendations
    recommendations: List[Dict[str, str]] = []
    
    if not checks['ltv_check']:
        min_down_payment_needed = vehicle_price - max_loan_by_ltv
        recommendations.append({
            'issue': 'LTV exceeded',
            'suggestion': f"Increase down payment to ₹{round(min_down_payment_needed):,}",
            'current': f"{((requested_loan / vehicle_price) * 100):.1f}% LTV",
            'required': f"{ltv_rules['max_ltv']:.0f}% max LTV",
        })
    
    if not checks['auto_emi_check']:
        max_auto_emi = monthly_income * 0.20
        affordable_loan = calculate_affordable_loan(max_auto_emi, interest_rate, tenure_months)
        recommendations.append({
            'issue': 'Auto EMI too high',
            'suggestion': f"Reduce loan to ₹{round(affordable_loan):,} or increase tenure",
            'current': f"{auto_emi_ratio:.1f}% of income",
            'required': '≤ 20% of income',
        })
    
    if not checks['total_foir_check']:
        recommendations.append({
            'issue': 'Total EMI burden too high',
            'suggestion': 'Clear existing loans or increase income',
            'current': f"{total_emi_ratio:.1f}% of income",
            'required': '≤ 45% of income',
        })
    
    if not checks['tenure_check']:
        recommendations.append({
            'issue': 'Tenure exceeds vehicle/bank limits',
            'suggestion': f"Reduce tenure to {effective_max_tenure} months (vehicle age + tenure ≤ 10 years)",
            'current': f"{tenure_months} months",
            'required': f"≤ {effective_max_tenure} months",
        })
    
    return {
        'eligible': eligible,
        'risk_level': risk_level,
        'checks': checks,
        'loan_details': {
            'requested_loan': round(requested_loan, 2),
            'max_loan_by_ltv': round(max_loan_by_ltv, 2),
            'auto_emi': round(auto_emi, 2),
            'total_emi': round(total_emi, 2),
            'auto_emi_ratio': round(auto_emi_ratio, 2),
            'total_emi_ratio': round(total_emi_ratio, 2),
        },
        'vehicle_details': {
            'vehicle_type': vehicle_type,
            'vehicle_price': vehicle_price,
            'down_payment': down_payment,
            'depreciation_factor': depreciation_factor,
            'effective_value': round(effective_vehicle_value, 2),
            'max_ltv_percent': ltv_rules['max_ltv'],
        },
        'recommendations': recommendations,
    }


def calculate_affordable_loan(
    max_emi: float,
    interest_rate: float,
    tenure_months: int
) -> float:
    """
    Calculate maximum affordable loan based on EMI capacity.
    
    Reverse EMI formula:
    P = EMI × ((1 + r)^n - 1) / (r × (1 + r)^n)
    
    Args:
        max_emi: Maximum affordable EMI
        interest_rate: Annual interest rate
        tenure_months: Tenure in months
    
    Returns:
        Maximum affordable loan amount
    """
    if max_emi <= 0 or tenure_months <= 0:
        return 0
    
    if interest_rate <= 0:
        return max_emi * tenure_months
    
    monthly_rate = interest_rate / 12 / 100
    
    numerator = ((1 + monthly_rate) ** tenure_months) - 1
    denominator = monthly_rate * ((1 + monthly_rate) ** tenure_months)
    
    affordable_loan = max_emi * (numerator / denominator)
    
    return round(affordable_loan, 2)


def get_auto_loan_interest_rates(
    vehicle_type: str,
    credit_score: int = 750,
    bank_type: str = 'bank'
) -> Dict[str, float]:
    """
    Get typical auto loan interest rates in India (2024-25).
    
    Rates vary by:
    - Vehicle type (new vs used)
    - Credit score
    - Bank vs NBFC vs dealer financing
    
    Args:
        vehicle_type: Type of vehicle
        credit_score: CIBIL/Credit score
        bank_type: 'bank', 'nbfc', or 'dealer'
    
    Returns:
        Dict with rate ranges
    """
    # Base rates (as of 2024-25)
    base_rates = {
        'new_car': {'bank': 8.5, 'nbfc': 10.0, 'dealer': 9.5},
        'used_car': {'bank': 11.0, 'nbfc': 13.0, 'dealer': 12.5},
        'new_two_wheeler': {'bank': 9.5, 'nbfc': 11.0, 'dealer': 10.5},
        'used_two_wheeler': {'bank': 12.0, 'nbfc': 14.0, 'dealer': 13.0},
        'electric_vehicle': {'bank': 8.0, 'nbfc': 9.5, 'dealer': 9.0},
    }
    
    base_rate = base_rates.get(vehicle_type, base_rates['new_car']).get(bank_type, 9.5)
    
    # Credit score adjustment
    if credit_score >= 800:
        rate_adjustment = -0.5
    elif credit_score >= 750:
        rate_adjustment = 0
    elif credit_score >= 700:
        rate_adjustment = 0.5
    elif credit_score >= 650:
        rate_adjustment = 1.0
    else:
        rate_adjustment = 2.0
    
    final_rate = base_rate + rate_adjustment
    
    return {
        'typical_rate': round(final_rate, 2),
        'min_rate': round(final_rate - 0.5, 2),
        'max_rate': round(final_rate + 1.5, 2),
        'base_rate': base_rate,
        'credit_adjustment': rate_adjustment,
    }


def calculate_total_cost_of_ownership(
    vehicle_price: float,
    loan_amount: float,
    interest_rate: float,
    tenure_months: int,
    vehicle_type: str = 'new_car',
) -> Dict[str, float]:
    """
    Calculate total cost of vehicle ownership including loan interest.
    
    Args:
        vehicle_price: On-road price
        loan_amount: Loan principal
        interest_rate: Annual interest rate
        tenure_months: Tenure in months
        vehicle_type: Type of vehicle
    
    Returns:
        Dict with total cost breakdown
    """
    # Calculate EMI and total payment
    emi = calculate_emi({
        'principal': loan_amount,
        'rate': interest_rate,
        'tenure_months': tenure_months,
    })
    
    total_payment = emi * tenure_months
    total_interest = total_payment - loan_amount
    down_payment = vehicle_price - loan_amount
    
    # Estimate other costs (annual averages, simplified)
    years = tenure_months / 12
    
    # Insurance (varies by vehicle type)
    if vehicle_type == 'electric_vehicle':
        # EVs: Higher initial cost, stable over time
        insurance_per_year = 18000  # Flat rate (no depreciation discount initially)
    elif vehicle_type == 'new_car':
        # New cars: Standard insurance, decreases with depreciation
        insurance_per_year = 15000 - (years * 1000)
    elif vehicle_type == 'used_car':
        insurance_per_year = 8000
    else:
        insurance_per_year = 3000
    
    total_insurance = insurance_per_year * years
    
    # Maintenance (increases over time, except EVs)
    if vehicle_type == 'electric_vehicle':
        # EVs: Lower maintenance (no oil, fewer moving parts), flat & predictable
        maintenance_per_year = 8000  # Mostly brake pads, tires, battery monitoring
    elif vehicle_type == 'new_car':
        # New cars: Warranty covers initial years, increases after
        maintenance_per_year = 20000 + (years * 2000)
    elif vehicle_type == 'used_car':
        # Used cars: Higher maintenance risk
        maintenance_per_year = 30000
    else:
        maintenance_per_year = 8000
    
    total_maintenance = maintenance_per_year * years
    
    # Fuel/charging estimate (1000 km/month @ typical rates)
    # Assumptions: ₹100/L petrol, 15 km/L; EV ₹5/km
    if vehicle_type == 'electric_vehicle':
        # EV: 1000 km/month @ ₹5/km = ₹5000/month (charging + grid losses)
        fuel_per_month = 5000
    elif vehicle_type in ['new_car', 'used_car']:
        # ICE: 1000 km/month @ 15 km/L = 67L @ ₹100/L = ₹6700/month
        fuel_per_month = 6700
    else:
        # Two wheeler: Better efficiency, ₹2000-3000/month typical
        fuel_per_month = 2500
    
    total_fuel = fuel_per_month * tenure_months
    
    total_cost = vehicle_price + total_interest + total_insurance + total_maintenance + total_fuel
    
    return {
        'vehicle_price': vehicle_price,
        'down_payment': down_payment,
        'loan_amount': loan_amount,
        'total_interest': round(total_interest, 2),
        'total_loan_payment': round(total_payment, 2),
        'emi': round(emi, 2),
        'total_insurance': round(total_insurance, 2),
        'total_maintenance': round(total_maintenance, 2),
        'total_fuel': round(total_fuel, 2),
        'total_cost_of_ownership': round(total_cost, 2),
    }
