"""
Budget Planner V1.2 - Alert Detection System
Rules-based alert detection for risk identification
"""

from typing import List, Dict, Optional
from enum import Enum


class SeverityLevel(str, Enum):
    """Alert severity levels"""
    INFO = "info"
    WARNING = "warning"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"


class AlertCode(str, Enum):
    """Alert codes for categorization"""
    HIGH_RENT = "HIGH_RENT"
    HIGH_EMI = "HIGH_EMI"
    NEGATIVE_CASHFLOW = "NEGATIVE_CASHFLOW"
    LOW_SAVINGS = "LOW_SAVINGS"
    HIGH_WANTS = "HIGH_WANTS"
    INSUFFICIENT_EMERGENCY = "INSUFFICIENT_EMERGENCY"


def detect_high_rent_alert(
    rent: float,
    income: float,
    city_tier: str
) -> Optional[Dict[str, object]]:
    """
    Detect if rent is too high relative to income.
    
    Rules:
    - Tier 1 cities: Alert if rent > 40% of income
    - Tier 2 cities: Alert if rent > 35% of income
    - Tier 3 cities: Alert if rent > 30% of income
    - International: Alert if rent > 25% of income
    
    Args:
        rent: Monthly rent
        income: Monthly income
        city_tier: City tier (tier_1, tier_2, tier_3, other)
    
    Returns:
        Alert dict or None
    """
    if income <= 0:
        return None
    
    rent_ratio = rent / income
    
    thresholds = {
        'tier_1': 0.40,
        'tier_2': 0.35,
        'tier_3': 0.30,
        'other': 0.25,
    }
    
    threshold = thresholds.get(city_tier, 0.30)
    
    if rent_ratio > threshold:
        percentage = round(rent_ratio * 100, 1)
        severity = SeverityLevel.CRITICAL if rent_ratio > threshold + 0.10 else SeverityLevel.HIGH
        
        return {
            'code': AlertCode.HIGH_RENT,
            'message': f'High rent burden: {percentage}% of income',
            'severity': severity,
            'suggestion': 'Consider relocating to more affordable area or seeking additional income',
            'metadata': {
                'rent': rent,
                'income': income,
                'ratio': round(rent_ratio, 2),
                'threshold': threshold,
            }
        }
    
    return None


def detect_high_emi_alert(
    total_emi: float,
    income: float,
    has_multiple_loans: bool = False
) -> Optional[Dict[str, object]]:
    """
    Detect if EMI burden is too high.
    
    Rules:
    - Alert if total EMI > 30% of income
    - Critical if > 40%
    - Additional warning if multiple loans
    
    Args:
        total_emi: Total monthly EMI
        income: Monthly income
        has_multiple_loans: Whether user has multiple loans
    
    Returns:
        Alert dict or None
    """
    if income <= 0:
        return None
    
    emi_ratio = total_emi / income
    
    if emi_ratio > 0.30:
        percentage = round(emi_ratio * 100, 1)
        
        if emi_ratio > 0.40:
            severity = SeverityLevel.CRITICAL
            suggestion = 'Your EMI burden is excessive. Consider loan restructuring or refinancing at lower rates'
        else:
            severity = SeverityLevel.HIGH
            suggestion = 'High EMI burden affecting budget flexibility. Monitor your finances closely'
        
        if has_multiple_loans:
            suggestion += '. Consider consolidating loans to reduce interest burden'
        
        return {
            'code': AlertCode.HIGH_EMI,
            'message': f'High loan burden: {percentage}% of income',
            'severity': severity,
            'suggestion': suggestion,
            'metadata': {
                'total_emi': total_emi,
                'income': income,
                'ratio': round(emi_ratio, 2),
                'threshold': 0.30,
                'multiple_loans': has_multiple_loans,
            }
        }
    
    return None


def detect_negative_cashflow_alert(
    income: float,
    total_expenses: float
) -> Optional[Dict[str, object]]:
    """
    Detect if expenses exceed income (negative cashflow).
    
    Args:
        income: Monthly income
        total_expenses: Total monthly expenses (fixed + variable + EMI)
    
    Returns:
        Alert dict or None
    """
    
    if total_expenses > income:
        deficit = total_expenses - income
        percentage = round((deficit / income) * 100, 1)
        
        return {
            'code': AlertCode.NEGATIVE_CASHFLOW,
            'message': f'Negative cashflow: Deficit of ₹{deficit:,.0f} ({percentage}%)',
            'severity': SeverityLevel.CRITICAL,
            'suggestion': 'You are spending more than you earn. Immediately reduce expenses or increase income',
            'metadata': {
                'income': income,
                'total_expenses': total_expenses,
                'deficit': deficit,
                'deficit_percentage': percentage,
            }
        }
    
    return None


def detect_low_savings_alert(
    savings_amount: float,
    income: float,
    savings_percent: float
) -> Optional[Dict[str, object]]:
    """
    Detect if savings are insufficient.
    
    Rules:
    - Alert if savings < 10% of income
    - Critical if < 5%
    - Moderate if between 5-10%
    
    Args:
        savings_amount: Monthly savings amount
        income: Monthly income
        savings_percent: Savings percentage of budget
    
    Returns:
        Alert dict or None
    """
    if income <= 0:
        return None
    
    if savings_percent < 10:
        percentage = round(savings_percent, 1)
        
        if savings_percent < 5:
            severity = SeverityLevel.CRITICAL
            suggestion = 'Critically low savings rate. You are at risk during emergencies. Increase savings immediately'
        else:
            severity = SeverityLevel.MODERATE
            suggestion = 'Low savings rate. Try to increase to at least 15% for better financial security'
        
        return {
            'code': AlertCode.LOW_SAVINGS,
            'message': f'Low savings rate: Only {percentage}% of income',
            'severity': severity,
            'suggestion': suggestion,
            'metadata': {
                'savings_amount': savings_amount,
                'income': income,
                'savings_percent': savings_percent,
                'recommended_percent': 15,
            }
        }
    
    return None


def detect_high_wants_alert(
    wants_percent: float,
    wants_amount: float,
    income: float,
    budget_mode: str = 'smart_balanced'
) -> Optional[Dict[str, object]]:
    """
    Detect if wants spending is too high.
    
    Rules:
    - Alert if wants > 40% (basic mode)
    - Alert if wants > 35% (smart_balanced mode)
    - Alert if wants > 30% (aggressive_savings mode)
    
    Args:
        wants_percent: Wants percentage of budget
        wants_amount: Wants amount in rupees
        income: Monthly income
        budget_mode: Budget mode (basic, aggressive_savings, smart_balanced)
    
    Returns:
        Alert dict or None
    """
    
    mode_thresholds = {
        'basic': 40,
        'smart_balanced': 35,
        'aggressive_savings': 30,
    }
    
    threshold = mode_thresholds.get(budget_mode, 35)
    
    if wants_percent > threshold:
        excess_percent = round(wants_percent - threshold, 1)
        excess_amount = round(wants_amount - (income * threshold / 100), 2)
        
        severity = SeverityLevel.HIGH if wants_percent > threshold + 5 else SeverityLevel.WARNING
        
        return {
            'code': AlertCode.HIGH_WANTS,
            'message': f'High discretionary spending: {round(wants_percent, 1)}% of income (₹{excess_amount:,.0f} excess)',
            'severity': severity,
            'suggestion': 'Review your dining, entertainment, and shopping expenses. Look for areas to cut back',
            'metadata': {
                'wants_percent': wants_percent,
                'wants_amount': wants_amount,
                'threshold_percent': threshold,
                'excess_percent': excess_percent,
                'excess_amount': excess_amount,
                'budget_mode': budget_mode,
            }
        }
    
    return None


def detect_insufficient_emergency_alert(
    total_expenses: float,
    emergency_fund: float
) -> Optional[Dict[str, object]]:
    """
    Detect if emergency fund is insufficient.
    
    Rules:
    - Alert if emergency fund < 3 months of expenses
    - Critical if < 1 month
    - Moderate if 1-3 months
    
    Recommended: 6-12 months of expenses
    
    Args:
        total_expenses: Total monthly expenses
        emergency_fund: Current emergency fund amount
    
    Returns:
        Alert dict or None
    """
    
    if total_expenses <= 0:
        return None
    
    months_covered = emergency_fund / total_expenses if total_expenses > 0 else 0
    
    if months_covered < 3:
        if months_covered < 1:
            severity = SeverityLevel.CRITICAL
            suggestion = 'Critical: You have less than 1 month of expenses saved. Build your emergency fund urgently'
        else:
            severity = SeverityLevel.MODERATE
            suggestion = 'Your emergency fund covers less than 3 months. Build it to at least 3-6 months'
        
        return {
            'code': AlertCode.INSUFFICIENT_EMERGENCY,
            'message': f'Insufficient emergency fund: {round(months_covered, 1)} months of expenses',
            'severity': severity,
            'suggestion': suggestion,
            'metadata': {
                'emergency_fund': emergency_fund,
                'monthly_expenses': total_expenses,
                'months_covered': round(months_covered, 2),
                'recommended_months': 6,
                'recommended_amount': total_expenses * 6,
            }
        }
    
    return None


# ============================================
# ALERT DETECTION RUNNER
# ============================================

def generate_alerts(
    income: float,
    rent: float,
    total_emi: float,
    total_expenses: float,
    wants_percent: float,
    wants_amount: float,
    savings_amount: float,
    emergency_fund: float,
    city_tier: str,
    loans: List[Dict[str, float]],
    budget_mode: str = 'smart_balanced',
    savings_percent: float = 20.0,
) -> List[Dict[str, object]]:
    """
    Run all alert detection rules.
    
    Args:
        income: Monthly income
        rent: Monthly rent
        total_emi: Total monthly EMI
        total_expenses: Total monthly expenses
        wants_percent: Wants percentage
        wants_amount: Monthly wants amount
        savings_amount: Monthly savings
        emergency_fund: Current emergency fund
        city_tier: City tier
        loans: List of loans
        budget_mode: Budget mode
        savings_percent: Savings percentage
    
    Returns:
        List of detected alerts sorted by severity
    """
    alerts: List[Dict[str, object]] = []
    
    # Run all detection rules
    high_rent = detect_high_rent_alert(rent, income, city_tier)
    if high_rent:
        alerts.append(high_rent)
    
    high_emi = detect_high_emi_alert(total_emi, income, len(loans) > 1)
    if high_emi:
        alerts.append(high_emi)
    
    negative_cashflow = detect_negative_cashflow_alert(income, total_expenses)
    if negative_cashflow:
        alerts.append(negative_cashflow)
    
    low_savings = detect_low_savings_alert(savings_amount, income, savings_percent)
    if low_savings:
        alerts.append(low_savings)
    
    high_wants = detect_high_wants_alert(wants_percent, wants_amount, income, budget_mode)
    if high_wants:
        alerts.append(high_wants)
    
    insufficient_emergency = detect_insufficient_emergency_alert(total_expenses, emergency_fund)
    if insufficient_emergency:
        alerts.append(insufficient_emergency)
    
    # Sort by severity (critical first)
    severity_order = {
        SeverityLevel.CRITICAL: 0,
        SeverityLevel.HIGH: 1,
        SeverityLevel.MODERATE: 2,
        SeverityLevel.WARNING: 3,
        SeverityLevel.INFO: 4,
    }
    
    alerts.sort(key=lambda a: severity_order.get(a.get('severity'), 5))  # type: ignore
    
    return alerts


def get_alert_count_by_severity(alerts: List[Dict[str, object]]) -> Dict[str, int]:
    """
    Get count of alerts by severity.
    
    Args:
        alerts: List of alerts
    
    Returns:
        Dict with severity counts
    """
    counts: Dict[str, int] = {
        'critical': 0,
        'high': 0,
        'moderate': 0,
        'warning': 0,
        'info': 0,
    }
    
    for alert in alerts:
        severity = alert.get('severity', 'info')
        if severity in counts:
            counts[str(severity)] += 1
    
    return counts
