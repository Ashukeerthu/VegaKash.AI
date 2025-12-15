"""
Budget Planner V1.2 - Unit Tests
Comprehensive test coverage for budget calculations and alerts
"""
from budget_schemas.budget_planner import (
    BudgetGenerateRequest,
    FixedExpenses,
    VariableExpenses,
    LoanInput,
    SavingsGoal,
)
from utils.budget_calculator import (
    calculate_col_adjusted_budget,
    apply_lifestyle_modifier,
    apply_income_based_tuning,
    calculate_emi,
    allocate_to_categories,
    allocate_savings,
)
from utils.alert_detector import (
    detect_high_rent_alert,
    detect_high_emi_alert,
    detect_negative_cashflow_alert,
    detect_low_savings_alert,
    detect_high_wants_alert,
    detect_insufficient_emergency_alert,
)
from services.budget_planner_service import BudgetPlannerService


# ============================================
# BUDGET CALCULATOR TESTS
# ============================================

class TestColAdjustment:
    """Test COL adjustment calculations"""
    
    def test_tier1_col_adjustment(self):
        """Test Tier 1 city (1.25 multiplier) COL adjustment"""
        result = calculate_col_adjusted_budget(base_needs=50, col_multiplier=1.25)
        
        # Expected: needs_adj = 50 * (1 + (1.25 - 1) * 0.8) = 50 * 1.2 = 60
        assert result['needs'] == 60.0
        assert result['wants'] == 20.0  # Reduced due to need increase
        assert result['savings'] == 20.0
        assert sum([result['needs'], result['wants'], result['savings']]) == 100.0
    
    def test_tier3_col_adjustment(self):
        """Test Tier 3 city (0.90 multiplier) COL adjustment"""
        result = calculate_col_adjusted_budget(base_needs=50, col_multiplier=0.90)
        
        # Expected: needs_adj = 50 * (1 + (0.90 - 1) * 0.8) = 50 * 0.92 = 46
        assert result['needs'] == 46.0
        assert result['wants'] == 30.0  # Default since no increase needed
        assert result['savings'] == 24.0  # Increased due to need decrease
        assert sum([result['needs'], result['wants'], result['savings']]) == 100.0
    
    def test_other_city_col_adjustment(self):
        """Test Other/International city (1.0 multiplier) COL adjustment"""
        result = calculate_col_adjusted_budget(base_needs=50, col_multiplier=1.0)
        
        # Expected: needs_adj = 50 * (1 + (1.0 - 1) * 0.8) = 50 * 1 = 50
        assert result['needs'] == 50.0
        assert result['wants'] == 30.0
        assert result['savings'] == 20.0
        assert sum([result['needs'], result['wants'], result['savings']]) == 100.0
    
    def test_minimum_savings_threshold(self):
        """Test that savings never drop below minimum threshold"""
        result = calculate_col_adjusted_budget(
            base_needs=50,
            col_multiplier=1.5,  # Very high COL
            min_savings=5.0
        )
        
        assert result['savings'] >= 5.0


class TestLifestyleModifier:
    """Test lifestyle modifier calculations"""
    
    def test_minimal_lifestyle(self):
        """Test minimal lifestyle reduces wants"""
        wants_before = 30.0
        wants_after = apply_lifestyle_modifier(wants_before, 'minimal')
        
        assert wants_after < wants_before
        assert wants_after == 22.5  # 30 - 7.5
    
    def test_moderate_lifestyle(self):
        """Test moderate lifestyle keeps wants unchanged"""
        wants_before = 30.0
        wants_after = apply_lifestyle_modifier(wants_before, 'moderate')
        
        assert wants_after == wants_before
    
    def test_comfort_lifestyle(self):
        """Test comfort lifestyle increases wants"""
        wants_before = 30.0
        wants_after = apply_lifestyle_modifier(wants_before, 'comfort')
        
        assert wants_after > wants_before
        assert wants_after == 35.0  # 30 + 5
    
    def test_premium_lifestyle(self):
        """Test premium lifestyle significantly increases wants"""
        wants_before = 30.0
        wants_after = apply_lifestyle_modifier(wants_before, 'premium')
        
        assert wants_after > wants_before
        assert wants_after == 42.5  # 30 + 12.5


class TestIncomeBasedTuning:
    """Test income-based tuning calculations"""
    
    def test_very_low_income_adjustment(self):
        """Test very low income increases needs"""
        result = apply_income_based_tuning(
            income=20000,
            needs_percent=50,
            wants_percent=30,
            savings_percent=20,
        )
        
        assert result['needs'] > 50.0  # Should increase
        assert result['savings'] < 20.0  # Should decrease
    
    def test_high_rent_ratio_adjustment(self):
        """Test high rent ratio reduces wants"""
        result = apply_income_based_tuning(
            income=100000,
            needs_percent=50,
            wants_percent=30,
            savings_percent=20,
            rent=40000,  # 40% of income
        )
        
        assert result['wants'] < 30.0  # Should decrease
    
    def test_high_emi_ratio_adjustment(self):
        """Test high EMI ratio reduces wants"""
        result = apply_income_based_tuning(
            income=100000,
            needs_percent=50,
            wants_percent=30,
            savings_percent=20,
            total_emi=30000,  # 30% of income
        )
        
        assert result['wants'] < 30.0  # Should decrease
    
    def test_income_tuning_maintains_100_percent(self):
        """Test that tuning maintains 100% split"""
        result = apply_income_based_tuning(
            income=50000,
            needs_percent=50,
            wants_percent=30,
            savings_percent=20,
            rent=25000,
            total_emi=10000,
        )
        
        total = result['needs'] + result['wants'] + result['savings']
        assert abs(total - 100.0) < 0.01  # Allow for rounding


class TestEmiCalculation:
    """Test EMI calculation"""
    
    def test_emi_with_interest(self):
        """Test EMI calculation with interest"""
        loan = {
            'principal': 500000,
            'rate': 8.5,
            'tenure_months': 60,
        }
        
        emi = calculate_emi(loan)
        
        # Approximate EMI for 5L @ 8.5% for 60 months ~= ₹9,650
        assert 9600 < emi < 9700
    
    def test_emi_without_interest(self):
        """Test EMI calculation without interest"""
        loan = {
            'principal': 600000,
            'rate': 0,
            'tenure_months': 60,
        }
        
        emi = calculate_emi(loan)
        
        assert emi == 10000  # Simple division
    
    def test_emi_zero_principal(self):
        """Test EMI with zero principal returns 0"""
        loan = {
            'principal': 0,
            'rate': 8.5,
            'tenure_months': 60,
        }
        
        emi = calculate_emi(loan)
        
        assert emi == 0


class TestCategoryAllocation:
    """Test budget allocation to categories"""
    
    def test_allocation_maintains_amounts(self):
        """Test that category allocation maintains total amounts"""
        income = 100000
        needs_amount = 50000
        wants_amount = 30000
        savings_amount = 20000
        
        fixed = {
            'rent': 20000,
            'utilities': 2000,
            'insurance': 2000,
            'medical': 1000,
            'other': 0,
        }
        
        variable = {
            'groceries': 8000,
            'transport': 3000,
            'subscriptions': 500,
            'entertainment': 3000,
            'shopping': 5000,
            'dining_out': 3000,
            'other': 0,
        }
        
        result = allocate_to_categories(
            income=income,
            needs_amount=needs_amount,
            wants_amount=wants_amount,
            savings_amount=savings_amount,
            fixed_expenses=fixed,
            variable_expenses=variable,
            loans=[],
            goals=[],
        )
        
        # Sum of each category should match allocated amount
        needs_total = sum(result['needs'].values())
        wants_total = sum(result['wants'].values())
        savings_total = sum(result['savings'].values())
        
        assert abs(needs_total - needs_amount) < 1  # Allow for rounding
        assert abs(wants_total - wants_amount) < 1
        assert abs(savings_total - savings_amount) < 1


class TestSavingsAllocation:
    """Test savings allocation to sub-categories"""
    
    def test_default_savings_allocation(self):
        """Test default savings allocation without goals"""
        savings_amount = 20000
        
        result = allocate_savings(savings_amount, [])
        
        # Default: Emergency 40%, SIP 40%, FD/RD 15%, Goals 5%
        assert abs(result['emergency'] - 8000) < 1
        assert abs(result['sip'] - 8000) < 1
        assert abs(result['fd_rd'] - 3000) < 1
        assert abs(result['goals'] - 1000) < 1
    
    def test_savings_allocation_with_goals(self):
        """Test savings allocation with goals"""
        savings_amount = 20000
        goals = [
            {'name': 'Vacation', 'target': 100000, 'target_months': 12, 'priority': 3},
            {'name': 'Home', 'target': 500000, 'target_months': 36, 'priority': 5},
        ]
        
        result = allocate_savings(savings_amount, goals)
        
        # Should maintain structure with goal allocation
        total = (
            result['emergency'] + result['sip'] +
            result['fd_rd'] + result['goals']
        )
        assert abs(total - savings_amount) < 1


# ============================================
# ALERT DETECTOR TESTS
# ============================================

class TestAlertDetection:
    """Test alert detection rules"""
    
    def test_high_rent_alert_tier1(self):
        """Test high rent alert for Tier 1 city"""
        alert = detect_high_rent_alert(
            rent=50000,
            income=100000,
            city_tier='tier_1',
        )
        
        assert alert is not None
        assert alert['code'] == 'HIGH_RENT'
        assert alert['severity'] == 'HIGH'
    
    def test_high_rent_alert_tier2(self):
        """Test high rent alert for Tier 2 city"""
        alert = detect_high_rent_alert(
            rent=40000,
            income=100000,
            city_tier='tier_2',
        )
        
        assert alert is not None
        assert alert['code'] == 'HIGH_RENT'
    
    def test_no_high_rent_alert(self):
        """Test no alert when rent is within acceptable range"""
        alert = detect_high_rent_alert(
            rent=30000,
            income=100000,
            city_tier='tier_1',
        )
        
        assert alert is None
    
    def test_high_emi_alert(self):
        """Test high EMI alert"""
        alert = detect_high_emi_alert(
            total_emi=35000,
            income=100000,
            has_multiple_loans=False,
        )
        
        assert alert is not None
        assert alert['code'] == 'HIGH_EMI'
        assert alert['severity'] == 'HIGH'
    
    def test_critical_high_emi_alert(self):
        """Test critical EMI alert"""
        alert = detect_high_emi_alert(
            total_emi=45000,
            income=100000,
            has_multiple_loans=False,
        )
        
        assert alert is not None
        assert alert['severity'] == 'CRITICAL'
    
    def test_high_emi_alert_multiple_loans(self):
        """Test EMI alert with multiple loans shows consolidation suggestion"""
        alert = detect_high_emi_alert(
            total_emi=35000,
            income=100000,
            has_multiple_loans=True,
        )
        
        assert alert is not None
        assert 'consolidat' in alert['suggestion'].lower()
    
    def test_negative_cashflow_alert(self):
        """Test negative cashflow alert"""
        alert = detect_negative_cashflow_alert(
            income=100000,
            total_expenses=120000,
        )
        
        assert alert is not None
        assert alert['code'] == 'NEGATIVE_CASHFLOW'
        assert alert['severity'] == 'CRITICAL'
    
    def test_no_negative_cashflow_alert(self):
        """Test no alert when cashflow is positive"""
        alert = detect_negative_cashflow_alert(
            income=100000,
            total_expenses=80000,
        )
        
        assert alert is None
    
    def test_low_savings_alert(self):
        """Test low savings alert"""
        alert = detect_low_savings_alert(
            savings_amount=5000,
            income=100000,
            savings_percent=5.0,
        )
        
        assert alert is not None
        assert alert['code'] == 'LOW_SAVINGS'
        assert alert['severity'] == 'MODERATE'
    
    def test_critical_low_savings_alert(self):
        """Test critical low savings alert"""
        alert = detect_low_savings_alert(
            savings_amount=2000,
            income=100000,
            savings_percent=2.0,
        )
        
        assert alert is not None
        assert alert['severity'] == 'CRITICAL'
    
    def test_high_wants_alert(self):
        """Test high wants alert"""
        alert = detect_high_wants_alert(
            wants_percent=45.0,
            wants_amount=45000,
            income=100000,
            budget_mode='smart_balanced',
        )
        
        assert alert is not None
        assert alert['code'] == 'HIGH_WANTS'
    
    def test_insufficient_emergency_alert(self):
        """Test insufficient emergency fund alert"""
        alert = detect_insufficient_emergency_alert(
            total_expenses=50000,
            emergency_fund=50000,  # Only 1 month
        )
        
        assert alert is not None
        assert alert['code'] == 'INSUFFICIENT_EMERGENCY'
        assert alert['severity'] == 'MODERATE'
    
    def test_critical_emergency_alert(self):
        """Test critical emergency fund alert"""
        alert = detect_insufficient_emergency_alert(
            total_expenses=50000,
            emergency_fund=30000,  # Less than 1 month
        )
        
        assert alert is not None
        assert alert['severity'] == 'CRITICAL'


# ============================================
# BUDGET PLANNER SERVICE TESTS
# ============================================

class TestBudgetPlannerService:
    """Test budget planner service"""
    
    def create_test_request(
        self,
        income: float = 100000,
        city_tier: str = 'tier_1',
        col_multiplier: float = 1.25,
        lifestyle: str = 'moderate',
        mode: str = 'smart_balanced',
    ) -> BudgetGenerateRequest:
        """Create a test budget generation request"""
        return BudgetGenerateRequest(
            monthly_income=income,
            currency='INR',
            country='India',
            state='Maharashtra',
            city='Mumbai',
            city_tier=city_tier,
            col_multiplier=col_multiplier,
            family_size=4,
            lifestyle=lifestyle,
            fixed_expenses=FixedExpenses(
                rent=20000,
                utilities=2000,
                insurance=2000,
                medical=1000,
                other=0,
            ),
            variable_expenses=VariableExpenses(
                groceries=8000,
                transport=3000,
                subscriptions=500,
                entertainment=3000,
                shopping=5000,
                dining_out=3000,
                other=0,
            ),
            loans=[
                LoanInput(
                    principal=500000,
                    rate=8.5,
                    tenure_months=60,
                    issuer='Bank',
                )
            ],
            goals=[
                SavingsGoal(
                    name='Vacation',
                    target=100000,
                    target_months=12,
                    priority=3,
                ),
                SavingsGoal(
                    name='Home Down Payment',
                    target=500000,
                    target_months=36,
                    priority=5,
                ),
            ],
            mode=mode,
        )
    
    def test_generate_budget_success(self):
        """Test successful budget generation"""
        request = self.create_test_request()
        
        plan = BudgetPlannerService.generate_budget(request)
        
        assert plan is not None
        assert plan.income == 100000
        assert plan.budget_split is not None
        assert plan.budget_amounts is not None
        assert plan.categories is not None
        assert plan.alerts is not None
        assert plan.explanation is not None
    
    def test_budget_split_sums_to_100(self):
        """Test that budget split sums to 100%"""
        request = self.create_test_request()
        
        plan = BudgetPlannerService.generate_budget(request)
        
        total = (
            plan.budget_split.needs_percent +
            plan.budget_split.wants_percent +
            plan.budget_split.savings_percent
        )
        
        assert abs(total - 100.0) < 0.01
    
    def test_budget_amounts_match_percentages(self):
        """Test that budget amounts match percentages"""
        request = self.create_test_request()
        
        plan = BudgetPlannerService.generate_budget(request)
        
        income = plan.income
        
        expected_needs = (income * plan.budget_split.needs_percent) / 100
        expected_wants = (income * plan.budget_split.wants_percent) / 100
        expected_savings = (income * plan.budget_split.savings_percent) / 100
        
        assert abs(plan.budget_amounts.needs - expected_needs) < 1
        assert abs(plan.budget_amounts.wants - expected_wants) < 1
        assert abs(plan.budget_amounts.savings - expected_savings) < 1
    
    def test_col_adjustment_reflected_in_budget(self):
        """Test that COL adjustment is reflected in generated budget"""
        # Tier 1 with high COL
        request_tier1 = self.create_test_request(city_tier='tier_1', col_multiplier=1.25)
        plan_tier1 = BudgetPlannerService.generate_budget(request_tier1)
        
        # Tier 3 with low COL
        request_tier3 = self.create_test_request(city_tier='tier_3', col_multiplier=0.90)
        plan_tier3 = BudgetPlannerService.generate_budget(request_tier3)
        
        # Tier 1 should have higher needs %
        assert plan_tier1.budget_split.needs_percent > plan_tier3.budget_split.needs_percent
    
    def test_lifestyle_modifier_affects_wants(self):
        """Test that lifestyle modifier affects wants percentage"""
        # Minimal lifestyle
        request_minimal = self.create_test_request(lifestyle='minimal')
        plan_minimal = BudgetPlannerService.generate_budget(request_minimal)
        
        # Premium lifestyle
        request_premium = self.create_test_request(lifestyle='premium')
        plan_premium = BudgetPlannerService.generate_budget(request_premium)
        
        # Premium should have higher wants
        assert plan_premium.budget_split.wants_percent > plan_minimal.budget_split.wants_percent
    
    def test_budget_mode_affects_split(self):
        """Test that budget mode affects split"""
        # Basic mode
        request_basic = self.create_test_request(mode='basic')
        plan_basic = BudgetPlannerService.generate_budget(request_basic)
        
        # Aggressive savings mode
        request_aggressive = self.create_test_request(mode='aggressive_savings')
        plan_aggressive = BudgetPlannerService.generate_budget(request_aggressive)
        
        # Aggressive should have higher savings
        assert plan_aggressive.budget_split.savings_percent > plan_basic.budget_split.savings_percent
    
    def test_budget_generates_alerts_for_high_loan_burden(self):
        """Test that alerts are generated for high loan burden"""
        # Create request with very high EMI relative to income
        request = self.create_test_request(income=100000)
        request.loans = [
            LoanInput(
                principal=5000000,
                rate=10,
                tenure_months=60,
                issuer='Bank',
            )
        ]
        
        plan = BudgetPlannerService.generate_budget(request)
        
        # Should have at least one alert for high EMI
        alert_codes = [a.code for a in plan.alerts]
        assert 'HIGH_EMI' in alert_codes


# ============================================
# INTEGRATION TESTS
# ============================================

class TestIntegration:
    """Integration tests for complete workflows"""
    
    def test_end_to_end_budget_generation(self):
        """Test complete budget generation workflow"""
        request = BudgetGenerateRequest(
            monthly_income=75000,
            currency='INR',
            country='India',
            state='Bangalore',
            city='Bangalore',
            city_tier='tier_2',
            col_multiplier=1.05,
            family_size=3,
            lifestyle='moderate',
            fixed_expenses=FixedExpenses(
                rent=15000,
                utilities=1500,
                insurance=1500,
                medical=500,
                other=0,
            ),
            variable_expenses=VariableExpenses(
                groceries=6000,
                transport=2500,
                subscriptions=300,
                entertainment=2000,
                shopping=3000,
                dining_out=2000,
                other=0,
            ),
            loans=[],
            goals=[],
            mode='smart_balanced',
        )
        
        plan = BudgetPlannerService.generate_budget(request)
        
        # Verify complete plan structure
        assert plan.income == 75000
        assert plan.budget_split.needs_percent > 0
        assert plan.budget_split.wants_percent > 0
        assert plan.budget_split.savings_percent > 0
        assert plan.categories.needs is not None
        assert plan.categories.wants is not None
        assert plan.categories.savings is not None
        assert plan.explanation is not None
        assert isinstance(plan.alerts, list)
