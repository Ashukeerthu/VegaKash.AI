"""
Auto Loan Calculator API Routes
India-specific auto loan eligibility and affordability calculations
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any

from utils.auto_loan_calculator import (
    calculate_auto_loan_eligibility,
    calculate_on_road_price,
    get_vehicle_ltv_rules,
    get_auto_loan_tenure_cap,
    get_auto_loan_interest_rates,
    calculate_total_cost_of_ownership,
    calculate_affordable_loan,
)

# Initialize router
router = APIRouter(
    prefix="/api/v1/auto-loan",
    tags=["auto-loan"],
    responses={404: {"description": "Not found"}},
)


# ==================== REQUEST SCHEMAS ====================

class OnRoadPriceRequest(BaseModel):
    """Calculate on-road price from ex-showroom price"""
    ex_showroom_price: float = Field(..., gt=0, description="Ex-showroom price in INR")
    state: str = Field("MH", description="State code (e.g., MH, DL, KA)")
    vehicle_type: str = Field("new_car", description="Type of vehicle")


class AutoLoanEligibilityRequest(BaseModel):
    """Calculate auto loan eligibility"""
    monthly_income: float = Field(..., gt=0, description="Monthly gross income in INR")
    existing_emi: float = Field(0, ge=0, description="Existing EMI commitments")
    vehicle_price: float = Field(..., gt=0, description="On-road price of vehicle")
    down_payment: float = Field(..., ge=0, description="Down payment amount")
    vehicle_type: str = Field("new_car", description="Type of vehicle")
    vehicle_age_years: int = Field(0, ge=0, description="Age of vehicle in years")
    interest_rate: float = Field(9.5, gt=0, description="Annual interest rate (%)")
    tenure_months: int = Field(60, gt=0, description="Loan tenure in months")


class AffordableLoanRequest(BaseModel):
    """Calculate affordable loan based on EMI capacity"""
    max_emi: float = Field(..., gt=0, description="Maximum affordable EMI")
    interest_rate: float = Field(9.5, gt=0, description="Annual interest rate (%)")
    tenure_months: int = Field(60, gt=0, description="Loan tenure in months")


class InterestRateRequest(BaseModel):
    """Get interest rates for auto loan"""
    vehicle_type: str = Field("new_car", description="Type of vehicle")
    credit_score: int = Field(750, ge=300, le=900, description="Credit score")
    bank_type: str = Field("bank", description="Bank type: bank, nbfc, dealer")


class TCORequest(BaseModel):
    """Calculate total cost of ownership"""
    vehicle_price: float = Field(..., gt=0, description="On-road price")
    loan_amount: float = Field(..., gt=0, description="Loan principal")
    interest_rate: float = Field(9.5, gt=0, description="Annual interest rate (%)")
    tenure_months: int = Field(60, gt=0, description="Loan tenure in months")
    vehicle_type: str = Field("new_car", description="Type of vehicle")


class LTVRulesRequest(BaseModel):
    """Get LTV rules for vehicle type"""
    vehicle_type: str = Field("new_car", description="Type of vehicle")


class TenureCapRequest(BaseModel):
    """Get tenure cap for vehicle"""
    vehicle_type: str = Field("new_car", description="Type of vehicle")
    vehicle_age_years: int = Field(0, ge=0, description="Age of vehicle in years")


# ==================== ENDPOINTS ====================

@router.post("/on-road-price", response_model=Dict[str, Any])
async def calculate_on_road(request: OnRoadPriceRequest):
    """
    Calculate on-road price from ex-showroom price
    
    Includes:
    - Road tax (state-specific)
    - Registration charges
    - Insurance
    - Other charges
    """
    try:
        result = calculate_on_road_price(
            ex_showroom_price=request.ex_showroom_price,
            state=request.state,
            vehicle_type=request.vehicle_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/eligibility", response_model=Dict[str, Any])
async def check_eligibility(request: AutoLoanEligibilityRequest):
    """
    Check auto loan eligibility with India-specific rules
    
    Returns:
    - eligible: Boolean
    - risk_level: low/medium/high
    - checks: Individual eligibility criteria
    - loan_details: EMI and ratios
    - vehicle_details: LTV and depreciation
    - recommendations: Actionable suggestions
    """
    try:
        result = calculate_auto_loan_eligibility(
            monthly_income=request.monthly_income,
            existing_emi=request.existing_emi,
            vehicle_price=request.vehicle_price,
            down_payment=request.down_payment,
            vehicle_type=request.vehicle_type,
            vehicle_age_years=request.vehicle_age_years,
            interest_rate=request.interest_rate,
            tenure_months=request.tenure_months,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/affordable-loan", response_model=Dict[str, float])
async def get_affordable_loan(request: AffordableLoanRequest):
    """
    Calculate maximum affordable loan based on EMI capacity
    
    Returns:
    - affordable_loan: Maximum loan amount
    """
    try:
        affordable_loan = calculate_affordable_loan(
            max_emi=request.max_emi,
            interest_rate=request.interest_rate,
            tenure_months=request.tenure_months
        )
        return {
            "max_emi": request.max_emi,
            "tenure_months": request.tenure_months,
            "interest_rate": request.interest_rate,
            "affordable_loan": affordable_loan
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/interest-rates", response_model=Dict[str, float])
async def get_rates(request: InterestRateRequest):
    """
    Get typical auto loan interest rates in India
    
    Considers:
    - Vehicle type (new, used, EV, two-wheeler)
    - Credit score
    - Bank vs NBFC vs dealer
    """
    try:
        # Validate bank_type
        if request.bank_type not in ['bank', 'nbfc', 'dealer']:
            raise ValueError("bank_type must be 'bank', 'nbfc', or 'dealer'")
        
        result = get_auto_loan_interest_rates(
            vehicle_type=request.vehicle_type,
            credit_score=request.credit_score,
            bank_type=request.bank_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/total-cost-of-ownership", response_model=Dict[str, float])
async def calculate_tco(request: TCORequest):
    """
    Calculate total cost of vehicle ownership
    
    Includes:
    - Vehicle price
    - Interest payments
    - Insurance
    - Maintenance
    - Fuel/charging
    """
    try:
        result = calculate_total_cost_of_ownership(
            vehicle_price=request.vehicle_price,
            loan_amount=request.loan_amount,
            interest_rate=request.interest_rate,
            tenure_months=request.tenure_months,
            vehicle_type=request.vehicle_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/ltv-rules", response_model=Dict[str, float])
async def get_ltv_rules(request: LTVRulesRequest):
    """
    Get LTV (Loan-to-Value) rules for vehicle type
    
    Returns:
    - max_ltv: Maximum LTV percentage
    - typical_ltv: Typical LTV percentage
    - min_down_payment: Minimum down payment percentage
    """
    try:
        result = get_vehicle_ltv_rules(vehicle_type=request.vehicle_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tenure-cap", response_model=Dict[str, int])
async def get_tenure_cap(request: TenureCapRequest):
    """
    Get maximum tenure cap for vehicle type
    
    Returns:
    - max_tenure_months: Maximum tenure allowed
    - recommended_tenure_months: Recommended tenure
    """
    try:
        result = get_auto_loan_tenure_cap(
            vehicle_type=request.vehicle_type,
            vehicle_age_years=request.vehicle_age_years
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/health", response_model=Dict[str, str])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "auto-loan-calculator",
        "version": "1.0.0"
    }
