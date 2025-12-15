"""
Budget Planner V1.2 - API Routes
FastAPI endpoints for budget planning operations
"""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
import logging

# Import budget planner schemas
from budget_schemas.budget_planner import (
    BudgetGenerateRequest,
    BudgetGenerateResponse,
    BudgetRebalanceRequest,
    BudgetRebalanceResponse,
)
from services.budget_planner_service import BudgetPlannerService

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/ai/budget",
    tags=["Budget Planner"],
    responses={
        400: {"description": "Bad Request - Invalid input"},
        422: {"description": "Unprocessable Entity - Validation error"},
        500: {"description": "Internal Server Error"},
    }
)


# ============================================
# DEPENDENCY FUNCTIONS
# ============================================

def validate_budget_request(request: BudgetGenerateRequest) -> BudgetGenerateRequest:
    """
    Validate budget generation request.
    
    Args:
        request: BudgetGenerateRequest
    
    Returns:
        Validated request
    
    Raises:
        HTTPException: If validation fails
    """
    
    # Validate income (flattened schema field)
    if request.monthly_income < 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Monthly income must be at least ₹10,000"
        )
    
    if request.monthly_income > 100000000:  # 1 Crore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Monthly income cannot exceed ₹1 Crore"
        )
    
    # Validate family size (flattened schema field)
    if not (1 <= request.family_size <= 10):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Family size must be between 1 and 10"
        )
    
    # Validate city tier (flattened schema field)
    valid_tiers = ['tier_1', 'tier_2', 'tier_3', 'other']
    if request.city_tier not in valid_tiers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"City tier must be one of {valid_tiers}"
        )
    
    # Validate lifestyle (flattened schema field)
    valid_lifestyles = ['minimal', 'moderate', 'comfort', 'premium']
    if request.lifestyle not in valid_lifestyles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Lifestyle must be one of {valid_lifestyles}"
        )
    
    # Validate budget mode
    valid_modes = ['basic', 'aggressive_savings', 'smart_balanced']
    if request.mode not in valid_modes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Budget mode must be one of {valid_modes}"
        )
    
    # Validate loans
    for i, loan in enumerate(request.loans):
        if loan.principal <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Loan {i+1} principal must be positive"
            )
        
        if not (0 <= loan.rate <= 50):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Loan {i+1} interest rate must be between 0% and 50%"
            )
        
        if loan.tenure_months < 1 or loan.tenure_months > 360:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Loan {i+1} tenure must be between 1 and 360 months"
            )
    
    # Validate goals
    for i, goal in enumerate(request.goals):
        if not (1 <= goal.priority <= 5):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Goal {i+1} priority must be between 1 and 5"
            )
        
        if goal.target <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Goal {i+1} target must be positive"
            )
    
    return request


# ============================================
# ENDPOINTS
# ============================================

@router.post("/generate", response_model=BudgetGenerateResponse)
async def generate_budget(
    request: BudgetGenerateRequest
) -> BudgetGenerateResponse:
    """
    Generate a personalized budget plan.
    
    This endpoint generates a complete budget breakdown based on:
    - Monthly income
    - City tier and cost-of-living multiplier
    - Household details (family size, lifestyle)
    - Fixed and variable expenses
    - Existing loans and EMI commitments
    - Savings goals
    - Preferred budget mode
    
    The algorithm:
    1. Calculates COL-adjusted budget split (50/30/20 base)
    2. Applies lifestyle modifiers
    3. Applies income-based tuning rules
    4. Allocates budget to 23 subcategories
    5. Detects financial risk alerts
    6. Generates personalized explanation
    
    Args:
        request: Budget generation request with all input parameters
    
    Returns:
        BudgetGenerateResponse with:
        - success: Boolean indicating operation success
        - budget_plan: Complete budget breakdown with categories, alerts, and explanation
    
    Raises:
        HTTPException: 400 for validation errors, 500 for internal errors
    
    Example:
        ```json
        {
            "income": {"monthly_income": 100000, "currency": "INR"},
            "city": {"country": "India", "state": "Maharashtra", "city": "Mumbai", 
                    "city_tier": "tier_1", "col_multiplier": 1.25},
            "household": {"family_size": 4, "lifestyle": "moderate"},
            "fixed_expenses": {"rent": 20000, "utilities": 2000, ...},
            "variable_expenses": {"groceries": 8000, "transport": 3000, ...},
            "loans": [{"principal": 500000, "rate": 8.5, "tenure_months": 120, "issuer": "Bank"}],
            "goals": [{"name": "Vacation", "target": 100000, "target_months": 12, "priority": 3}],
            "mode": "smart_balanced"
        }
        ```
    """
    try:
        logger.info(f"Generating budget for income: ₹{request.monthly_income}")
        
        # Generate budget using service
        budget_plan = BudgetPlannerService.generate_budget(request)
        
        logger.info("Budget generated successfully")
        
        return BudgetGenerateResponse(
            success=True,
            plan=budget_plan
        )
    
    except Exception as e:
        logger.error(f"Error generating budget: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while generating budget"
        )


@router.post("/rebalance", response_model=BudgetRebalanceResponse)
async def rebalance_budget(
    request: BudgetRebalanceRequest
) -> BudgetRebalanceResponse:
    """
    Rebalance a previously generated budget after user edits.
    
    This endpoint processes user-edited budget percentages and:
    1. Validates the edited split maintains 100%
    2. Recalculates absolute amounts
    3. Re-runs alert detection with new values
    4. Generates rebalancing explanation
    
    Args:
        request: BudgetRebalanceRequest with:
        - edited_plan: User's edited budget with new percentages
        - original_inputs: Original input data for context
        - city_tier: City tier for alert detection
        - col_multiplier: COL multiplier
    
    Returns:
        BudgetRebalanceResponse with:
        - success: Boolean indicating operation success
        - plan: Updated budget plan with recalculated alerts
        - alerts: List of detected alerts
        - reasoning: Explanation of rebalancing changes
        - metadata: Context metadata
    
    Raises:
        HTTPException: 400 for validation errors, 500 for internal errors
    
    Example:
        ```json
        {
            "edited_plan": {...updated budget...},
            "original_inputs": {...original request data...},
            "city_tier": "tier_1",
            "col_multiplier": 1.25
        }
        ```
    """
    try:
        logger.info("Rebalancing budget")
        
        # Rebalance using service
        updated_plan = BudgetPlannerService.rebalance_budget(request)
        
        logger.info("Budget rebalanced successfully")
        
        return BudgetRebalanceResponse(
            success=True,
            plan=updated_plan,
            alerts=updated_plan.alerts,
            reasoning=updated_plan.explanation,
            metadata=updated_plan.metadata,
        )
    
    except Exception as e:
        logger.error(f"Error rebalancing budget: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while rebalancing budget"
        )


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint for Budget Planner API.
    
    Returns:
        Status information
    """
    return {
        "status": "healthy",
        "service": "Budget Planner V1.2",
        "version": "1.0.0",
    }


# ============================================
# HELPER ENDPOINTS (Optional)
# ============================================

@router.get("/budget-modes")
async def get_budget_modes() -> Dict[str, Any]:
    """
    Get available budget modes.
    
    Returns:
        Dict with budget mode descriptions
    """
    return {
        "modes": [
            {
                "code": "basic",
                "name": "Basic Balance",
                "description": "Traditional 45/30/25 split - Steady and conservative",
                "ideal_for": "Beginners, stable income",
            },
            {
                "code": "aggressive_savings",
                "name": "Aggressive Savings",
                "description": "Higher savings (30-40%) - For debt repayment and goals",
                "ideal_for": "Debt holders, long-term goals",
            },
            {
                "code": "smart_balanced",
                "name": "Smart Balanced",
                "description": "AI-optimized based on your profile - Recommended",
                "ideal_for": "All income levels",
            },
        ]
    }


@router.get("/lifestyle-options")
async def get_lifestyle_options() -> Dict[str, Any]:
    """
    Get available lifestyle options.
    
    Returns:
        Dict with lifestyle descriptions
    """
    return {
        "lifestyles": [
            {
                "code": "minimal",
                "name": "Minimal",
                "description": "Budget-conscious, minimal discretionary spending",
                "effect": "Reduces wants spending by ~7.5%",
            },
            {
                "code": "moderate",
                "name": "Moderate",
                "description": "Balanced lifestyle, standard discretionary spending",
                "effect": "No adjustment to wants",
            },
            {
                "code": "comfort",
                "name": "Comfort",
                "description": "Comfortable lifestyle, regular outings and shopping",
                "effect": "Increases wants spending by ~5%",
            },
            {
                "code": "premium",
                "name": "Premium",
                "description": "Premium lifestyle, frequent entertainment and dining",
                "effect": "Increases wants spending by ~12.5%",
            },
        ]
    }


@router.get("/countries")
async def get_countries() -> Dict[str, Any]:
    """
    Get available countries for budget planning.
    
    Supports 25+ countries across 6 continents:
    - India with 3-tier city system
    - International with tier-aware cities
    
    Returns:
        Dict with list of countries and their details
    """
    countries: List[Dict[str, Any]] = [
        {
            "code": "IN",
            "name": "India",
            "region": "Asia",
            "description": "India - Domestic",
            "currency": "INR",
            "hasMultipleTiers": True,
        },
        {
            "code": "US",
            "name": "United States",
            "region": "North America",
            "description": "USA - United States of America",
            "currency": "USD",
            "hasMultipleTiers": True,
        },
        {
            "code": "GB",
            "name": "United Kingdom",
            "region": "Europe",
            "description": "UK - United Kingdom",
            "currency": "GBP",
            "hasMultipleTiers": True,
        },
        {
            "code": "CA",
            "name": "Canada",
            "region": "North America",
            "description": "Canada",
            "currency": "CAD",
            "hasMultipleTiers": True,
        },
        {
            "code": "AU",
            "name": "Australia",
            "region": "Oceania",
            "description": "Australia",
            "currency": "AUD",
            "hasMultipleTiers": True,
        },
        {
            "code": "SG",
            "name": "Singapore",
            "region": "Asia",
            "description": "Singapore",
            "currency": "SGD",
            "hasMultipleTiers": False,
        },
        {
            "code": "AE",
            "name": "UAE",
            "region": "Middle East",
            "description": "United Arab Emirates",
            "currency": "AED",
            "hasMultipleTiers": True,
        },
        {
            "code": "DE",
            "name": "Germany",
            "region": "Europe",
            "description": "Germany",
            "currency": "EUR",
            "hasMultipleTiers": True,
        },
        {
            "code": "FR",
            "name": "France",
            "region": "Europe",
            "description": "France",
            "currency": "EUR",
            "hasMultipleTiers": True,
        },
        {
            "code": "PL",
            "name": "Poland",
            "region": "Europe",
            "description": "Poland",
            "currency": "PLN",
            "hasMultipleTiers": True,
        },
        {
            "code": "RU",
            "name": "Russia",
            "region": "Europe/Asia",
            "description": "Russia",
            "currency": "RUB",
            "hasMultipleTiers": True,
        },
        {
            "code": "JP",
            "name": "Japan",
            "region": "Asia",
            "description": "Japan",
            "currency": "JPY",
            "hasMultipleTiers": True,
        },
        {
            "code": "CN",
            "name": "China",
            "region": "Asia",
            "description": "China",
            "currency": "CNY",
            "hasMultipleTiers": True,
        },
        {
            "code": "KR",
            "name": "South Korea",
            "region": "Asia",
            "description": "South Korea",
            "currency": "KRW",
            "hasMultipleTiers": True,
        },
        {
            "code": "TH",
            "name": "Thailand",
            "region": "Asia",
            "description": "Thailand",
            "currency": "THB",
            "hasMultipleTiers": True,
        },
        {
            "code": "LK",
            "name": "Sri Lanka",
            "region": "Asia",
            "description": "Sri Lanka",
            "currency": "LKR",
            "hasMultipleTiers": True,
        },
        {
            "code": "MX",
            "name": "Mexico",
            "region": "North America",
            "description": "Mexico",
            "currency": "MXN",
            "hasMultipleTiers": True,
        },
        {
            "code": "BR",
            "name": "Brazil",
            "region": "South America",
            "description": "Brazil",
            "currency": "BRL",
            "hasMultipleTiers": True,
        },
        {
            "code": "ID",
            "name": "Indonesia",
            "region": "Asia",
            "description": "Indonesia",
            "currency": "IDR",
            "hasMultipleTiers": True,
        },
        {
            "code": "PH",
            "name": "Philippines",
            "region": "Asia",
            "description": "Philippines",
            "currency": "PHP",
            "hasMultipleTiers": True,
        },
        {
            "code": "VN",
            "name": "Vietnam",
            "region": "Asia",
            "description": "Vietnam",
            "currency": "VND",
            "hasMultipleTiers": True,
        },
        {
            "code": "MY",
            "name": "Malaysia",
            "region": "Asia",
            "description": "Malaysia",
            "currency": "MYR",
            "hasMultipleTiers": True,
        },
        {
            "code": "NZ",
            "name": "New Zealand",
            "region": "Oceania",
            "description": "New Zealand",
            "currency": "NZD",
            "hasMultipleTiers": True,
        },
        {
            "code": "SE",
            "name": "Sweden",
            "region": "Europe",
            "description": "Sweden",
            "currency": "SEK",
            "hasMultipleTiers": True,
        },
        {
            "code": "NL",
            "name": "Netherlands",
            "region": "Europe",
            "description": "Netherlands",
            "currency": "EUR",
            "hasMultipleTiers": True,
        },
    ]
    
    return {
        "total_countries": len(countries),
        "countries": sorted(countries, key=lambda x: x["name"]),
        "message": "Global coverage with support for 25+ countries. More countries can be added based on traffic patterns.",
    }
