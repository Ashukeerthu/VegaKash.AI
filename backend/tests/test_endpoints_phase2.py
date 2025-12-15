"""
Phase 2 Endpoint Integration Tests
Tests all budget planner endpoints with real request/response data
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


class TestHealthEndpoints:
    """Test health check and system status endpoints"""
    
    def test_health_check_root(self, client):
        """Test /health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "version" in data
        print(f"✅ /health endpoint: {data}")
    
    def test_health_check_v1(self, client):
        """Test /api/v1/health endpoint"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print(f"✅ /api/v1/health endpoint: {data}")
    
    def test_readiness_check(self, client):
        """Test /api/v1/ready endpoint"""
        response = client.get("/api/v1/ready")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["ready"] is True
        print(f"✅ /api/v1/ready endpoint: {data}")
    
    def test_system_stats(self, client):
        """Test /api/v1/stats endpoint"""
        response = client.get("/api/v1/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print(f"✅ /api/v1/stats endpoint: {data}")


class TestBudgetPlannerEndpoints:
    """Test Budget Planner V1.2 endpoints"""
    
    def test_get_countries(self, client):
        """Test GET /api/v1/ai/budget/countries endpoint"""
        response = client.get("/api/v1/ai/budget/countries")
        assert response.status_code == 200
        data = response.json()
        assert "total_countries" in data
        assert "countries" in data
        assert isinstance(data["countries"], list)
        assert len(data["countries"]) >= 25
        
        # Check country structure
        for country in data["countries"]:
            assert "code" in country
            assert "name" in country
            assert "region" in country
            assert "currency" in country
            assert "hasMultipleTiers" in country
        
        # Check if required countries are present
        country_names = [c["name"] for c in data["countries"]]
        assert "India" in country_names
        assert "United States" in country_names
        assert "Canada" in country_names
        print(f"✅ GET /api/v1/ai/budget/countries: {len(data['countries'])} countries returned")
        print(f"   Countries: {', '.join(country_names[:10])}...")
    
    def test_get_budget_modes(self, client):
        """Test GET /api/v1/ai/budget/budget-modes endpoint"""
        response = client.get("/api/v1/ai/budget/budget-modes")
        assert response.status_code == 200
        data = response.json()
        assert "modes" in data
        assert isinstance(data["modes"], list)
        assert len(data["modes"]) > 0
        print(f"✅ GET /api/v1/ai/budget/budget-modes: {len(data['modes'])} modes available")
    
    def test_get_lifestyle_options(self, client):
        """Test GET /api/v1/ai/budget/lifestyle-options endpoint"""
        response = client.get("/api/v1/ai/budget/lifestyle-options")
        assert response.status_code == 200
        data = response.json()
        assert "lifestyles" in data
        assert isinstance(data["lifestyles"], list)
        assert len(data["lifestyles"]) > 0
        print(f"✅ GET /api/v1/ai/budget/lifestyle-options: {len(data['lifestyles'])} lifestyles available")
    
    def test_budget_health_check(self, client):
        """Test GET /api/v1/ai/budget/health endpoint"""
        response = client.get("/api/v1/ai/budget/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print(f"✅ GET /api/v1/ai/budget/health: {data}")


class TestBudgetGeneration:
    """Test budget generation with various scenarios"""
    
    @pytest.fixture
    def india_budget_request(self):
        """Sample India budget request"""
        return {
            "income": {
                "monthly_income": 100000,
                "currency": "INR"
            },
            "city": {
                "country": "India",
                "state": "Maharashtra",
                "city": "Mumbai",
                "city_tier": "tier_1"
            },
            "household": {
                "family_size": 4,
                "adults": 2,
                "children": 2
            },
            "fixed_expenses": {
                "rent": 25000,
                "insurance": 3000,
                "emi": 0,
                "utilities": 3000
            },
            "variable_expenses": {
                "groceries": 12000,
                "transport": 5000,
                "dining": 5000,
                "entertainment": 3000,
                "shopping": 4000,
                "healthcare": 2000,
                "personal_care": 2000,
                "education": 2000,
                "gifts": 1000,
                "subscriptions": 1000
            },
            "savings_goal": {
                "emergency_fund_target": 300000,
                "target_amount": 500000,
                "target_type": "Home"
            },
            "budget_mode": "balanced",
            "lifestyle": "moderate"
        }
    
    @pytest.fixture
    def us_budget_request(self):
        """Sample US budget request"""
        return {
            "income": {
                "monthly_income": 8000,
                "currency": "USD"
            },
            "city": {
                "country": "United States",
                "state": "California",
                "city": "San Francisco",
                "city_tier": "tier_1"
            },
            "household": {
                "family_size": 2,
                "adults": 2,
                "children": 0
            },
            "fixed_expenses": {
                "rent": 2500,
                "insurance": 300,
                "emi": 0,
                "utilities": 200
            },
            "variable_expenses": {
                "groceries": 600,
                "transport": 400,
                "dining": 600,
                "entertainment": 300,
                "shopping": 400,
                "healthcare": 200,
                "personal_care": 150,
                "education": 0,
                "gifts": 100,
                "subscriptions": 100
            },
            "savings_goal": {
                "emergency_fund_target": 20000,
                "target_amount": 100000,
                "target_type": "Investment"
            },
            "budget_mode": "aggressive",
            "lifestyle": "premium"
        }
    
    @pytest.fixture
    def uk_budget_request(self):
        """Sample UK budget request"""
        return {
            "income": {
                "monthly_income": 5000,
                "currency": "GBP"
            },
            "city": {
                "country": "United Kingdom",
                "state": "England",
                "city": "London",
                "city_tier": "tier_1"
            },
            "household": {
                "family_size": 3,
                "adults": 2,
                "children": 1
            },
            "fixed_expenses": {
                "rent": 1500,
                "insurance": 150,
                "emi": 0,
                "utilities": 200
            },
            "variable_expenses": {
                "groceries": 400,
                "transport": 200,
                "dining": 400,
                "entertainment": 200,
                "shopping": 250,
                "healthcare": 100,
                "personal_care": 100,
                "education": 300,
                "gifts": 100,
                "subscriptions": 50
            },
            "savings_goal": {
                "emergency_fund_target": 15000,
                "target_amount": 50000,
                "target_type": "Travel"
            },
            "budget_mode": "balanced",
            "lifestyle": "moderate"
        }
    
    def test_generate_budget_india(self, client, india_budget_request):
        """Test budget generation for India"""
        response = client.post(
            "/api/v1/ai/budget/generate",
            json=india_budget_request
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert "summary" in data
        assert "budget_breakdown" in data
        assert "alerts" in data
        
        summary = data["summary"]
        assert summary["total_monthly_income"] == 100000
        assert "net_savings" in summary
        assert "savings_rate" in summary
        
        print("✅ India Budget Generated")
        print(f"   Income: ₹{summary['total_monthly_income']}")
        print(f"   Net Savings: ₹{summary['net_savings']}")
        print(f"   Savings Rate: {summary['savings_rate']:.1f}%")
    
    def test_generate_budget_us(self, client, us_budget_request):
        """Test budget generation for United States"""
        response = client.post(
            "/api/v1/ai/budget/generate",
            json=us_budget_request
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "summary" in data
        summary = data["summary"]
        assert summary["total_monthly_income"] == 8000
        
        print("✅ US Budget Generated")
        print(f"   Income: ${summary['total_monthly_income']}")
        print(f"   Net Savings: ${summary['net_savings']}")
        print(f"   Savings Rate: {summary['savings_rate']:.1f}%")
    
    def test_generate_budget_uk(self, client, uk_budget_request):
        """Test budget generation for United Kingdom"""
        response = client.post(
            "/api/v1/ai/budget/generate",
            json=uk_budget_request
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "summary" in data
        summary = data["summary"]
        assert summary["total_monthly_income"] == 5000
        
        print("✅ UK Budget Generated")
        print(f"   Income: £{summary['total_monthly_income']}")
        print(f"   Net Savings: £{summary['net_savings']}")
        print(f"   Savings Rate: {summary['savings_rate']:.1f}%")
    
    def test_generate_budget_with_loan(self, client):
        """Test budget generation with loans"""
        request_data = {
            "income": {
                "monthly_income": 150000,
                "currency": "INR"
            },
            "city": {
                "country": "India",
                "state": "Karnataka",
                "city": "Bangalore",
                "city_tier": "tier_1"
            },
            "household": {
                "family_size": 4,
                "adults": 2,
                "children": 2
            },
            "fixed_expenses": {
                "rent": 30000,
                "insurance": 5000,
                "emi": 25000,
                "utilities": 4000
            },
            "variable_expenses": {
                "groceries": 15000,
                "transport": 5000,
                "dining": 6000,
                "entertainment": 4000,
                "shopping": 5000,
                "healthcare": 3000,
                "personal_care": 2000,
                "education": 3000,
                "gifts": 2000,
                "subscriptions": 1000
            },
            "savings_goal": {
                "emergency_fund_target": 500000,
                "target_amount": 1000000,
                "target_type": "Car"
            },
            "budget_mode": "balanced",
            "lifestyle": "moderate"
        }
        
        response = client.post(
            "/api/v1/ai/budget/generate",
            json=request_data
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "alerts" in data
        print("✅ Budget with Loan Generated")
        print(f"   Alerts: {len(data['alerts'])} detected")


class TestBudgetRebalancing:
    """Test budget rebalancing endpoints"""
    
    def test_rebalance_budget(self, client):
        """Test budget rebalancing"""
        request_data = {
            "monthly_income": 100000,
            "total_expenses": 70000,
            "savings_goal": 20000,
            "current_allocation": {
                "needs": 50000,
                "wants": 15000,
                "savings": 35000
            },
            "priority": "savings"
        }
        
        response = client.post(
            "/api/v1/ai/budget/rebalance",
            json=request_data
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "rebalanced_allocation" in data
        assert "changes" in data
        print("✅ Budget Rebalanced")
        print(f"   Changes: {data['changes']}")


class TestErrorHandling:
    """Test error handling for invalid requests"""
    
    def test_invalid_country(self, client):
        """Test request with invalid country"""
        request_data = {
            "income": {
                "monthly_income": 100000,
                "currency": "INR"
            },
            "city": {
                "country": "InvalidCountry",
                "state": "State",
                "city": "City",
                "city_tier": "tier_1"
            },
            "household": {
                "family_size": 4,
                "adults": 2,
                "children": 2
            },
            "fixed_expenses": {
                "rent": 25000,
                "insurance": 3000,
                "emi": 0,
                "utilities": 3000
            },
            "variable_expenses": {
                "groceries": 12000,
                "transport": 5000,
                "dining": 5000,
                "entertainment": 3000,
                "shopping": 4000,
                "healthcare": 2000,
                "personal_care": 2000,
                "education": 2000,
                "gifts": 1000,
                "subscriptions": 1000
            },
            "savings_goal": {
                "emergency_fund_target": 300000,
                "target_amount": 500000,
                "target_type": "Home"
            },
            "budget_mode": "balanced",
            "lifestyle": "moderate"
        }
        
        response = client.post(
            "/api/v1/ai/budget/generate",
            json=request_data
        )
        # Should either fail gracefully or auto-detect
        assert response.status_code in [200, 422, 400]
        print(f"✅ Invalid country handled: Status {response.status_code}")
    
    def test_missing_required_fields(self, client):
        """Test request with missing required fields"""
        request_data = {
            "income": {
                "monthly_income": 100000
                # Missing currency
            }
        }
        
        response = client.post(
            "/api/v1/ai/budget/generate",
            json=request_data
        )
        assert response.status_code in [422, 400]
        print(f"✅ Missing fields validation: Status {response.status_code}")
    
    def test_negative_income(self, client):
        """Test request with negative income"""
        request_data = {
            "income": {
                "monthly_income": -50000,
                "currency": "INR"
            },
            "city": {
                "country": "India",
                "state": "Maharashtra",
                "city": "Mumbai",
                "city_tier": "tier_1"
            },
            "household": {
                "family_size": 4,
                "adults": 2,
                "children": 2
            },
            "fixed_expenses": {
                "rent": 25000,
                "insurance": 3000,
                "emi": 0,
                "utilities": 3000
            },
            "variable_expenses": {
                "groceries": 12000,
                "transport": 5000,
                "dining": 5000,
                "entertainment": 3000,
                "shopping": 4000,
                "healthcare": 2000,
                "personal_care": 2000,
                "education": 2000,
                "gifts": 1000,
                "subscriptions": 1000
            },
            "savings_goal": {
                "emergency_fund_target": 300000,
                "target_amount": 500000,
                "target_type": "Home"
            },
            "budget_mode": "balanced",
            "lifestyle": "moderate"
        }
        
        response = client.post(
            "/api/v1/ai/budget/generate",
            json=request_data
        )
        assert response.status_code in [422, 400]
        print(f"✅ Negative income validation: Status {response.status_code}")


class TestIntegrationFlow:
    """Test complete user flow"""
    
    def test_complete_budget_flow(self, client):
        """Test complete flow: get countries -> get options -> generate budget"""
        # Step 1: Get available countries
        countries_response = client.get("/api/v1/ai/budget/countries")
        assert countries_response.status_code == 200
        countries = countries_response.json()["countries"]
        print(f"✅ Step 1: Retrieved {len(countries)} countries")
        
        # Step 2: Get budget modes
        modes_response = client.get("/api/v1/ai/budget/budget-modes")
        assert modes_response.status_code == 200
        modes = modes_response.json()["modes"]
        print(f"✅ Step 2: Retrieved {len(modes)} budget modes")
        
        # Step 3: Get lifestyle options
        lifestyle_response = client.get("/api/v1/ai/budget/lifestyle-options")
        assert lifestyle_response.status_code == 200
        lifestyles = lifestyle_response.json()["lifestyles"]
        print(f"✅ Step 3: Retrieved {len(lifestyles)} lifestyle options")
        
        # Step 4: Generate budget for India
        budget_request = {
            "income": {
                "monthly_income": 100000,
                "currency": "INR"
            },
            "city": {
                "country": "India",
                "state": "Maharashtra",
                "city": "Mumbai",
                "city_tier": "tier_1"
            },
            "household": {
                "family_size": 4,
                "adults": 2,
                "children": 2
            },
            "fixed_expenses": {
                "rent": 25000,
                "insurance": 3000,
                "emi": 0,
                "utilities": 3000
            },
            "variable_expenses": {
                "groceries": 12000,
                "transport": 5000,
                "dining": 5000,
                "entertainment": 3000,
                "shopping": 4000,
                "healthcare": 2000,
                "personal_care": 2000,
                "education": 2000,
                "gifts": 1000,
                "subscriptions": 1000
            },
            "savings_goal": {
                "emergency_fund_target": 300000,
                "target_amount": 500000,
                "target_type": "Home"
            },
            "budget_mode": "balanced",
            "lifestyle": "moderate"
        }
        
        budget_response = client.post(
            "/api/v1/ai/budget/generate",
            json=budget_request
        )
        assert budget_response.status_code == 200
        budget_data = budget_response.json()
        print(f"✅ Step 4: Generated budget with ID {budget_data['id']}")
        
        # Verify budget data
        assert "summary" in budget_data
        assert "budget_breakdown" in budget_data
        assert "alerts" in budget_data
        
        print("✅ Complete flow successful!")
        print(f"   Budget ID: {budget_data['id']}")
        print(f"   Alerts: {len(budget_data['alerts'])}")


# ============================================
# MANUAL TEST RUNNER
# ============================================

if __name__ == "__main__":
    """Run tests manually for debugging"""
    print("\n" + "="*60)
    print("PHASE 2 ENDPOINT INTEGRATION TESTS")
    print("="*60 + "\n")
    
    # Run pytest with verbose output
    pytest.main([__file__, "-v", "-s", "--tb=short"])
