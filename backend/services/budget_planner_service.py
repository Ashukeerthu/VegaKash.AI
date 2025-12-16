"""
Budget Planner V1.2 - Budget Planner Service
Core business logic for budget generation and rebalancing
"""

from budget_schemas.budget_planner import (
    BudgetGenerateRequest,
    BudgetPlan,
    BudgetSplit,
    BudgetAmounts,
    NeedsCategory,
    WantsCategory,
    SavingsCategory,
    Categories,
    Alert,
    Metadata,
    BudgetRebalanceRequest,
)
from utils.budget_calculator import (
    calculate_col_adjusted_budget,
    apply_lifestyle_modifier,
    apply_income_based_tuning,
    allocate_budget,
    calculate_total_emi,
    get_mode_adjustment,
)
from utils.alert_detector import (
    generate_alerts,
)


class BudgetPlannerService:
    """Service for budget planning operations"""
    
    @staticmethod
    def generate_budget(request: BudgetGenerateRequest) -> BudgetPlan:
        """
        Generate a personalized budget plan.
        
        Process:
        1. Calculate COL-adjusted budget split
        2. Apply lifestyle modifiers
        3. Apply income-based tuning
        4. Allocate to subcategories
        5. Detect alerts
        6. Generate explanation
        
        Args:
            request: BudgetGenerateRequest with all user inputs
        
        Returns:
            BudgetPlan with complete budget breakdown
        """
        
        # Extract key values
        monthly_income = request.monthly_income
        city_tier = request.city_tier
        col_multiplier = request.col_multiplier
        lifestyle = request.lifestyle
        budget_mode = request.mode
        
        # Calculate total EMI
        total_emi = calculate_total_emi([loan.model_dump() for loan in request.loans])
        
        # Calculate total expenses from inputs
        total_fixed = sum([
            request.fixed_expenses.rent,
            request.fixed_expenses.utilities,
            request.fixed_expenses.insurance,
            request.fixed_expenses.medical,
            request.fixed_expenses.other,
        ])
        
        total_variable = sum([
            request.variable_expenses.groceries,
            request.variable_expenses.transport,
            request.variable_expenses.subscriptions,
            request.variable_expenses.entertainment,
            request.variable_expenses.shopping,
            request.variable_expenses.dining_out,
            request.variable_expenses.other,
        ])
        
        total_expenses = total_fixed + total_variable + total_emi
        
        # Step 1: Calculate COL-adjusted budget split
        col_adjusted = calculate_col_adjusted_budget(
            base_needs=50,
            col_multiplier=col_multiplier,
            min_savings=5.0
        )
        
        needs_percent = col_adjusted['needs']
        wants_percent = col_adjusted['wants']
        savings_percent = col_adjusted['savings']
        
        # Step 2: Apply lifestyle modifier to wants
        wants_percent = apply_lifestyle_modifier(wants_percent, lifestyle)
        
        # Recalculate needs and savings to maintain 100%
        needs_percent = max(needs_percent, 0)
        savings_percent = max(100 - needs_percent - wants_percent, 0)
        wants_percent = 100 - needs_percent - savings_percent
        
        # Step 3: Apply income-based tuning
        tuned_split = apply_income_based_tuning(
            income=monthly_income,
            needs_percent=needs_percent,
            wants_percent=wants_percent,
            savings_percent=savings_percent,
            rent=request.fixed_expenses.rent,
            total_emi=total_emi,
        )
        
        needs_percent = tuned_split['needs']
        wants_percent = tuned_split['wants']
        savings_percent = tuned_split['savings']
        
        # Apply budget mode adjustments
        mode_adj = get_mode_adjustment(budget_mode)
        if budget_mode != 'smart_balanced':
            # Basic mode uses 45/30/25
            if budget_mode == 'basic':
                needs_percent = 45
                wants_percent = 30
                savings_percent = 25
            # Aggressive savings mode reduces wants and increases savings
            elif budget_mode == 'aggressive_savings':
                wants_reduction = wants_percent * (mode_adj['wants_reduction'] / 100)
                wants_percent = max(wants_percent - wants_reduction, 5)
                savings_percent = min(savings_percent + mode_adj['savings_boost'], 40)
                needs_percent = 100 - wants_percent - savings_percent
        
        # Calculate absolute amounts
        needs_amount = (monthly_income * needs_percent) / 100
        wants_amount = (monthly_income * wants_percent) / 100
        savings_amount = (monthly_income * savings_percent) / 100
        
        # Step 4: Allocate to categories
        categories_breakdown = allocate_budget(
            income=monthly_income,
            needs_amount=needs_amount,
            wants_amount=wants_amount,
            savings_amount=savings_amount,
            fixed_expenses=request.fixed_expenses.model_dump(),
            variable_expenses=request.variable_expenses.model_dump(),
            loans=[loan.model_dump() for loan in request.loans],
            goals=[g.model_dump() for g in request.goals],
        )
        
        # Create category objects
        needs_cat = NeedsCategory(
            rent=categories_breakdown['needs'].get('rent', 0),
            utilities=categories_breakdown['needs'].get('utilities', 0),
            groceries=categories_breakdown['needs'].get('groceries', 0),
            transport=categories_breakdown['needs'].get('transport', 0),
            insurance=categories_breakdown['needs'].get('insurance', 0),
            medical=categories_breakdown['needs'].get('medical', 0),
            emi=categories_breakdown['needs'].get('emi', 0),
            other=categories_breakdown['needs'].get('other', 0),
        )
        
        wants_cat = WantsCategory(
            dining=categories_breakdown['wants'].get('dining', 0),
            entertainment=categories_breakdown['wants'].get('entertainment', 0),
            shopping=categories_breakdown['wants'].get('shopping', 0),
            subscriptions=categories_breakdown['wants'].get('subscriptions', 0),
            other=categories_breakdown['wants'].get('other', 0),
        )
        
        savings_cat = SavingsCategory(
            emergency=categories_breakdown['savings'].get('emergency', 0),
            sip=categories_breakdown['savings'].get('sip', 0),
            fd_rd=categories_breakdown['savings'].get('fd_rd', 0),
            goals=categories_breakdown['savings'].get('goals', 0),
        )
        
        # Step 5: Detect alerts
        alerts_list = generate_alerts(
            income=monthly_income,
            rent=request.fixed_expenses.rent,
            total_emi=total_emi,
            total_expenses=total_expenses,
            wants_percent=wants_percent,
            wants_amount=wants_amount,
            savings_amount=savings_amount,
            emergency_fund=0,  # Assume 0 for new budget
            city_tier=city_tier,
            loans=[loan.model_dump() for loan in request.loans],
            budget_mode=budget_mode,
            savings_percent=savings_percent,
        )
        
        # Create Alert objects
        alerts = [
            Alert(
                code=str(a.get('code', '')),
                message=str(a.get('message', '')),
                severity=str(a.get('severity', '')),
                suggestion=str(a.get('suggestion', '')),
            )
            for a in alerts_list
        ]
        
        # Step 6: Generate explanation
        explanation = BudgetPlannerService._generate_explanation(
            income=monthly_income,
            currency=request.currency,
            needs_percent=needs_percent,
            wants_percent=wants_percent,
            savings_percent=savings_percent,
            city_tier=city_tier,
            col_multiplier=col_multiplier,
            lifestyle=lifestyle,
            budget_mode=budget_mode,
            has_alerts=len(alerts) > 0,
            alert_count=len(alerts),
        )
        
        # Create metadata
        metadata = Metadata(
            city=request.city,
            city_tier=city_tier,
            col_multiplier=col_multiplier,
            notes=f"Budget generated for {request.city}, {city_tier} city. Lifestyle: {lifestyle}. Mode: {budget_mode}",
        )
        
        # Create budget plan
        budget_plan = BudgetPlan(
            income=monthly_income,
            budget_split=BudgetSplit(
                needs_percent=needs_percent,
                wants_percent=wants_percent,
                savings_percent=savings_percent,
            ),
            budget_amounts=BudgetAmounts(
                needs=needs_amount,
                wants=wants_amount,
                savings=savings_amount,
            ),
            categories=Categories(
                needs=needs_cat,
                wants=wants_cat,
                savings=savings_cat,
            ),
            alerts=alerts,
            explanation=explanation,
            metadata=metadata,
        )
        
        return budget_plan
    
    @staticmethod
    def rebalance_budget(
        request: BudgetRebalanceRequest,
    ) -> BudgetPlan:
        """
        Rebalance budget after user edits.
        
        Process:
        1. Validate edited plan maintains 100%
        2. Recalculate alerts with new values
        3. Generate rebalancing explanation
        
        Args:
            request: BudgetRebalanceRequest with edited plan
        
        Returns:
            Updated BudgetPlan with rebalance reasoning
        """
        
        # Extract edited values
        edited_plan_dict = request.edited_plan
        original_inputs = request.original_inputs
        
        # Ensure percentages sum to 100
        total_percent = (
            edited_plan_dict.get('budget_split', {}).get('needs_percent', 0) +
            edited_plan_dict.get('budget_split', {}).get('wants_percent', 0) +
            edited_plan_dict.get('budget_split', {}).get('savings_percent', 0)
        )
        
        if total_percent != 100:
            # Adjust savings to maintain 100%
            if 'budget_split' not in edited_plan_dict:
                edited_plan_dict['budget_split'] = {}
            edited_plan_dict['budget_split']['savings_percent'] = (
                100 - 
                edited_plan_dict.get('budget_split', {}).get('needs_percent', 0) - 
                edited_plan_dict.get('budget_split', {}).get('wants_percent', 0)
            )
        
        # Recalculate amounts based on percentages
        income = edited_plan_dict.get('income', original_inputs.monthly_income)
        if 'budget_amounts' not in edited_plan_dict:
            edited_plan_dict['budget_amounts'] = {}
        
        needs_percent = edited_plan_dict.get('budget_split', {}).get('needs_percent', 0)
        wants_percent = edited_plan_dict.get('budget_split', {}).get('wants_percent', 0)
        savings_percent = edited_plan_dict.get('budget_split', {}).get('savings_percent', 0)
        
        edited_plan_dict['budget_amounts']['needs'] = (income * needs_percent) / 100
        edited_plan_dict['budget_amounts']['wants'] = (income * wants_percent) / 100
        edited_plan_dict['budget_amounts']['savings'] = (income * savings_percent) / 100
        
        # Recalculate alerts
        total_expenses = (
            edited_plan_dict.get('budget_amounts', {}).get('needs', 0) +
            edited_plan_dict.get('budget_amounts', {}).get('wants', 0)
        )
        
        alerts_list = generate_alerts(
            income=income,
            rent=original_inputs.fixed_expenses.rent if hasattr(original_inputs, 'fixed_expenses') else 0,
            total_emi=0,
            total_expenses=total_expenses,
            loans=[loan.model_dump() for loan in original_inputs.loans] if hasattr(original_inputs, 'loans') else [],
            savings_amount=edited_plan_dict.get('budget_amounts', {}).get('savings', 0),
            savings_percent=savings_percent,
            wants_percent=wants_percent,
            wants_amount=edited_plan_dict.get('budget_amounts', {}).get('wants', 0),
            emergency_fund=0,
            city_tier=request.city_tier,
            budget_mode=original_inputs.mode if hasattr(original_inputs, 'mode') else 'smart_balanced',
        )
        
        # Create Alert objects
        alerts = [
            Alert(
                code=str(a.get('code', '')),
                message=str(a.get('message', '')),
                severity=str(a.get('severity', '')),
                suggestion=str(a.get('suggestion', '')),
            )
            for a in alerts_list
        ]
        
        # Generate rebalancing explanation
        new_needs = edited_plan_dict.get('budget_split', {}).get('needs_percent', 50)
        new_wants = edited_plan_dict.get('budget_split', {}).get('wants_percent', 30)
        new_savings = edited_plan_dict.get('budget_split', {}).get('savings_percent', 20)
        
        explanation = BudgetPlannerService._generate_rebalance_explanation(
            original_needs=50,
            original_wants=30,
            original_savings=20,
            new_needs=new_needs,
            new_wants=new_wants,
            new_savings=new_savings,
            alert_count=len(alerts),
        )
        
        # Create metadata
        metadata = Metadata(
            city=original_inputs.city,
            city_tier=request.city_tier,
            col_multiplier=request.col_multiplier,
            notes=f"Budget rebalanced. Original: 50/30/20, New: {new_needs}/{new_wants}/{new_savings}",
        )
        
        # Create updated budget plan
        rebalanced_plan = BudgetPlan(
            income=income,
            budget_split=BudgetSplit(
                needs_percent=new_needs,
                wants_percent=new_wants,
                savings_percent=new_savings,
            ),
            budget_amounts=BudgetAmounts(
                needs=edited_plan_dict.get('budget_amounts', {}).get('needs', 0),
                wants=edited_plan_dict.get('budget_amounts', {}).get('wants', 0),
                savings=edited_plan_dict.get('budget_amounts', {}).get('savings', 0),
            ),
            categories=Categories(
                needs=NeedsCategory(**edited_plan_dict.get('categories', {}).get('needs', {})),
                wants=WantsCategory(**edited_plan_dict.get('categories', {}).get('wants', {})),
                savings=SavingsCategory(**edited_plan_dict.get('categories', {}).get('savings', {})),
            ),
            alerts=alerts,
            explanation=explanation,
            metadata=metadata,
        )
        
        return rebalanced_plan
    
    @staticmethod
    def _generate_explanation(
        income: float,
        currency: str,
        needs_percent: float,
        wants_percent: float,
        savings_percent: float,
        city_tier: str,
        col_multiplier: float,
        lifestyle: str,
        budget_mode: str,
        has_alerts: bool,
        alert_count: int,
    ) -> str:
        """Generate human-readable budget explanation"""
        
        # Currency symbols mapping
        currency_symbols = {
            'INR': '₹',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'CNY': '¥',
            'JPY': '¥',
            'AUD': 'A$',
            'CAD': 'C$',
            'SGD': 'S$',
            'MYR': 'RM',
            'THB': '฿',
            'AED': 'د.إ',
            'SAR': '﷼',
        }
        
        currency_symbol = currency_symbols.get(currency, currency)
        
        city_tier_names = {
            'tier_1': 'Metro City',
            'tier_2': 'Tier-2 City',
            'tier_3': 'Tier-3 City',
            'other': 'Other Location',
        }
        
        tier_name = city_tier_names.get(city_tier, city_tier)
        
        explanation = f"""Your personalized budget plan for {currency_symbol}{income:,.0f}/month:

📊 Budget Split:
- Needs: {needs_percent:.1f}% ({currency_symbol}{(income * needs_percent / 100):,.0f})
- Wants: {wants_percent:.1f}% ({currency_symbol}{(income * wants_percent / 100):,.0f})
- Savings: {savings_percent:.1f}% ({currency_symbol}{(income * savings_percent / 100):,.0f})

🎯 Personalization Factors:
- Location: {tier_name} (COL Multiplier: {col_multiplier}x)
- Lifestyle: {lifestyle.capitalize()}
- Budget Mode: {budget_mode.replace('_', ' ').title()}

💡 Key Insights:
"""
        
        if col_multiplier > 1.1:
            explanation += f"- Your city has higher cost-of-living (COL Multiplier: {col_multiplier}x), which increases your needs allocation\n"
        elif col_multiplier < 0.95:
            explanation += f"- Your city has lower cost-of-living (COL Multiplier: {col_multiplier}x), allowing higher savings\n"
        
        if lifestyle == 'premium':
            explanation += "- Premium lifestyle increases your discretionary spending allowance\n"
        elif lifestyle == 'minimal':
            explanation += "- Minimal lifestyle reduces your discretionary spending\n"
        
        if budget_mode == 'aggressive_savings':
            explanation += "- Aggressive Savings mode prioritizes debt repayment and long-term goals\n"
        elif budget_mode == 'basic':
            explanation += "- Basic mode uses traditional 45/30/25 split for stability\n"
        
        if has_alerts:
            explanation += f"\n⚠️ Attention: {alert_count} alert{'s' if alert_count != 1 else ''} detected. Review them carefully.\n"
        
        explanation += "\nℹ️ This budget is AI-generated based on your inputs. Adjust categories as needed."
        
        return explanation
    
    @staticmethod
    def _generate_rebalance_explanation(
        original_needs: float,
        original_wants: float,
        original_savings: float,
        new_needs: float,
        new_wants: float,
        new_savings: float,
        alert_count: int,
    ) -> str:
        """Generate explanation for rebalanced budget"""
        
        needs_change = new_needs - original_needs
        wants_change = new_wants - original_wants
        savings_change = new_savings - original_savings
        
        explanation = "Your budget has been rebalanced:\n\n"
        
        explanation += "📈 Changes:\n"
        if needs_change > 0:
            explanation += f"- Needs: +{needs_change:.1f}% (now {new_needs:.1f}%)\n"
        elif needs_change < 0:
            explanation += f"- Needs: {needs_change:.1f}% (now {new_needs:.1f}%)\n"
        
        if wants_change > 0:
            explanation += f"- Wants: +{wants_change:.1f}% (now {new_wants:.1f}%)\n"
        elif wants_change < 0:
            explanation += f"- Wants: {wants_change:.1f}% (now {new_wants:.1f}%)\n"
        
        if savings_change > 0:
            explanation += f"- Savings: +{savings_change:.1f}% (now {new_savings:.1f}%)\n"
        elif savings_change < 0:
            explanation += f"- Savings: {savings_change:.1f}% (now {new_savings:.1f}%)\n"
        
        if alert_count > 0:
            explanation += f"\n⚠️ {alert_count} alert(s) for your attention."
        
        return explanation
