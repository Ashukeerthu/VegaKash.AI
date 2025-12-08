"""
Budget Planner Schemas Package
This module contains schema definitions for budget planner endpoints.
"""

# Note: This package coexists with the root schemas.py file.
# The root schemas.py contains general VegaKash.AI schemas (FinancialInput, etc.)
# This package contains Phase 2 Budget Planner specific schemas.

from .budget_planner import (
    BudgetGenerateRequest,
    BudgetGenerateResponse,
    BudgetRebalanceRequest,
    BudgetRebalanceResponse,
)

__all__ = [
    "BudgetGenerateRequest",
    "BudgetGenerateResponse",
    "BudgetRebalanceRequest",
    "BudgetRebalanceResponse",
]
