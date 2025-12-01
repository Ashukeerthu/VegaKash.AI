"""
Smart Recommendations Engine
Provides personalized spending alerts and financial tips
"""
from typing import List
from datetime import datetime
from schemas import (
    FinancialInput, SummaryOutput,
    SpendingAlert, PersonalizedRecommendation, SmartRecommendationsOutput
)


def generate_smart_recommendations(
    input_data: FinancialInput,
    summary: SummaryOutput
) -> SmartRecommendationsOutput:
    """
    Generate personalized recommendations and alerts
    """
    alerts = _generate_spending_alerts(input_data, summary)
    recommendations = _generate_personalized_recommendations(input_data, summary)
    seasonal_reminders = _get_seasonal_reminders()
    
    return SmartRecommendationsOutput(
        alerts=alerts,
        recommendations=recommendations,
        seasonal_reminders=seasonal_reminders
    )


def _generate_spending_alerts(
    input_data: FinancialInput,
    summary: SummaryOutput
) -> List[SpendingAlert]:
    """
    Generate spending alerts based on financial patterns
    """
    alerts: List[SpendingAlert] = []
    expenses = input_data.expenses
    total_income = summary.total_income
    
    # Check for overspending in categories (>20% of income)
    categories = {
        "Housing": (expenses.housing_rent, 0.30),
        "Groceries": (expenses.groceries_food, 0.15),
        "Transport": (expenses.transport, 0.10),
        "Utilities": (expenses.utilities, 0.10),
        "Entertainment": (expenses.entertainment, 0.10),
        "Subscriptions": (expenses.subscriptions, 0.05),
    }
    
    for category, (amount, recommended_percent) in categories.items():
        if amount > 0:
            percent = (amount / total_income) * 100
            if percent > (recommended_percent * 100):
                severity = "high" if percent > (recommended_percent * 150) else "medium"
                alerts.append(SpendingAlert(
                    alert_type="overspend",
                    category=category,
                    message=f"{category} spending is {percent:.1f}% of income (recommended: {recommended_percent*100:.0f}%)",
                    severity=severity,
                    suggestion=f"Try to reduce {category.lower()} expenses by ₹{amount - (total_income * recommended_percent):.0f}"
                ))
    
    # Check if missing savings opportunity
    if summary.savings_rate_percent < 10:
        alerts.append(SpendingAlert(
            alert_type="missed_savings",
            category="Savings",
            message=f"Current savings rate is only {summary.savings_rate_percent:.1f}% (goal: 20%)",
            severity="high",
            suggestion="Focus on reducing discretionary expenses to increase savings"
        ))
    
    # Check debt-to-income ratio
    if summary.debt_to_income_ratio_percent > 40:
        alerts.append(SpendingAlert(
            alert_type="overspend",
            category="Debt",
            message=f"Debt-to-income ratio is {summary.debt_to_income_ratio_percent:.1f}% (healthy: <36%)",
            severity="high",
            suggestion="Consider debt consolidation or aggressive debt payoff strategy"
        ))
    
    return alerts


def _generate_personalized_recommendations(
    input_data: FinancialInput,
    summary: SummaryOutput
) -> List[PersonalizedRecommendation]:
    """
    Generate personalized recommendations
    """
    recommendations: List[PersonalizedRecommendation] = []
    expenses = input_data.expenses
    
    # Subscription optimization
    if expenses.subscriptions > 500:
        recommendations.append(PersonalizedRecommendation(
            rec_type="bill_optimization",
            title="Audit Your Subscriptions",
            description=f"You're spending ₹{expenses.subscriptions:,.0f}/month on subscriptions. Many people have unused subscriptions they forget about.",
            potential_savings=expenses.subscriptions * 0.30,
            action_items=[
                "List all active subscriptions (streaming, apps, memberships)",
                "Cancel unused or rarely-used services",
                "Consider annual plans for 20-30% discount on subscriptions you keep",
                "Use family plans to split costs with friends/family"
            ]
        ))
    
    # Transportation optimization
    if expenses.transport > 3000:
        recommendations.append(PersonalizedRecommendation(
            rec_type="expense_reduction",
            title="Reduce Transportation Costs",
            description=f"Transportation costs of ₹{expenses.transport:,.0f}/month can be optimized.",
            potential_savings=expenses.transport * 0.20,
            action_items=[
                "Consider carpooling or public transport 2-3 days/week",
                "Maintain vehicle regularly to improve fuel efficiency",
                "Use fuel rewards credit cards for 2-5% cashback",
                "Plan errands efficiently to reduce unnecessary trips"
            ]
        ))
    
    # Food expenses optimization
    if expenses.groceries_food > summary.total_income * 0.15:
        recommendations.append(PersonalizedRecommendation(
            rec_type="expense_reduction",
            title="Optimize Food Expenses",
            description=f"Food expenses are ₹{expenses.groceries_food:,.0f}/month. Smart shopping can reduce this by 15-20%.",
            potential_savings=expenses.groceries_food * 0.15,
            action_items=[
                "Meal plan weekly to avoid impulse purchases",
                "Buy groceries in bulk for non-perishables",
                "Cook at home more often (eating out costs 3x more)",
                "Use grocery store apps for discounts and cashback"
            ]
        ))
    
    # Entertainment optimization
    if expenses.entertainment > 2000:
        recommendations.append(PersonalizedRecommendation(
            rec_type="expense_reduction",
            title="Smart Entertainment Choices",
            description=f"Entertainment budget of ₹{expenses.entertainment:,.0f} can be enjoyed with lower costs.",
            potential_savings=expenses.entertainment * 0.30,
            action_items=[
                "Look for free community events and festivals",
                "Take advantage of happy hours and weekday discounts",
                "Host potluck dinners instead of expensive restaurants",
                "Use credit card points for movie tickets and dining"
            ]
        ))
    
    # Emergency fund recommendation
    if input_data.goals.emergency_fund_target < summary.total_expenses * 6:
        recommended_fund = summary.total_expenses * 6
        recommendations.append(PersonalizedRecommendation(
            rec_type="expense_reduction",
            title="Build Emergency Fund",
            description=f"Your emergency fund target should be at least 6 months of expenses (₹{recommended_fund:,.0f}).",
            potential_savings=0,
            action_items=[
                f"Set emergency fund goal to ₹{recommended_fund:,.0f}",
                "Open a separate high-interest savings account",
                "Auto-transfer 10% of income monthly to emergency fund",
                "Keep emergency fund liquid but separate from daily accounts"
            ]
        ))
    
    # Investment recommendation
    if summary.savings_rate_percent > 20 and summary.net_savings > 10000:
        recommendations.append(PersonalizedRecommendation(
            rec_type="bill_optimization",
            title="Start Investing Your Savings",
            description=f"Great job saving ₹{summary.net_savings:,.0f}/month! Now let compound interest work for you.",
            potential_savings=0,
            action_items=[
                "Start SIP in index funds (10-12% annual returns)",
                "Maximize tax savings with ELSS (₹1.5L under 80C)",
                "Invest in PPF for guaranteed long-term returns",
                "Consider NPS for additional retirement savings"
            ]
        ))
    
    return recommendations


def _get_seasonal_reminders() -> List[str]:
    """
    Get seasonal financial reminders based on current month
    """
    current_month = datetime.now().month
    reminders = []
    
    # Month-specific reminders
    seasonal_events = {
        1: ["Plan for advance tax payment (15th January)", "Review and update insurance policies"],
        2: ["Prepare for next year's financial planning", "Check credit report"],
        3: ["Last chance for 80C investments (31st March)", "File advance tax return"],
        4: ["Start new financial year with budget planning", "Review and optimize SIPs"],
        6: ["School fees due - plan ahead", "Mid-year financial health check"],
        7: ["Monsoon preparedness - emergency fund check", "Review insurance coverage"],
        8: ["Plan for festive season expenses (Diwali)", "Check for credit card reward points expiry"],
        9: ["Advance tax payment due (15th September)", "Start Diwali savings fund"],
        10: ["Festival season - stick to budget", "Year-end tax planning begins"],
        11: ["Start planning for year-end bonuses", "Review investment portfolio"],
        12: ["Advance tax payment due (15th December)", "Plan for next year's financial goals"]
    }
    
    reminders = seasonal_events.get(current_month, ["Review monthly budget", "Track expense patterns"])
    
    # General reminders
    reminders.extend([
        "Review and pay credit card bills on time to avoid interest",
        "Check for better interest rates on savings accounts"
    ])
    
    return reminders
