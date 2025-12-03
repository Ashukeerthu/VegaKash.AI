"""
Pytest configuration and fixtures for VegaKash.AI tests
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
    """
    Create a test client for the FastAPI application
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_financial_input():
    """
    Sample financial input data for testing that matches FinancialInput schema
    """
    return {
        "currency": "INR",
        "monthly_income_primary": 100000,
        "monthly_income_additional": 0,
        "expenses": {
            "housing_rent": 25000,
            "groceries_food": 15000,
            "transport": 5000,
            "utilities": 5000,
            "insurance": 3000,
            "entertainment": 5000,
            "subscriptions": 2000,
            "others": 10000
        },
        "goals": {
            "monthly_savings_target": 20000,
            "emergency_fund_target": 300000,
            "primary_goal_type": "Home",
            "primary_goal_amount": 5000000
        },
        "loans": [
            {
                "name": "Home Loan",
                "input_mode": "emi",
                "monthly_emi": 45000,
                "interest_rate_annual": 8.5,
                "remaining_months": 180
            }
        ]
    }


@pytest.fixture
def minimal_financial_input():
    """
    Minimal valid financial input for testing
    """
    return {
        "currency": "INR",
        "monthly_income_primary": 50000,
        "monthly_income_additional": 0,
        "expenses": {
            "housing_rent": 0,
            "groceries_food": 0,
            "transport": 0,
            "utilities": 0,
            "insurance": 0,
            "entertainment": 0,
            "subscriptions": 0,
            "others": 0
        },
        "goals": {
            "monthly_savings_target": 0,
            "emergency_fund_target": 0
        },
        "loans": []
    }
