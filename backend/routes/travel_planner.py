"""
Travel Budget Planner V1.0 - API Routes
FastAPI endpoints for travel budget planning operations
"""

from fastapi import APIRouter, HTTPException, status, Header
from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from datetime import date
import logging
import os
import json
import asyncio
import time
import uuid
from openai import AsyncOpenAI

# Import fallback models and AI enhancement
from .travel_cost_models import (
    get_destination_tier,
    get_flight_cost_range,
    HOTEL_COSTS,
    FOOD_COSTS,
    TRANSPORT_COSTS,
    ACTIVITIES_COSTS,
    ACTIVITY_BUFFER_PERCENT,
    MISCELLANEOUS_PERCENT,
    VISA_COST_USD,
    INSURANCE_COST_PER_DAY_USD
)
from .travel_ai_enhancement import (
    enhance_with_ai,
    check_rate_limit,
    increment_session_calls,
    clear_old_cache,
    MAX_AI_CALLS_PER_SESSION,
    SESSION_AI_CALLS
)

# Configure logging
logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Currency conversion rates (USD as base) - Updated as of 2025
CURRENCY_RATES = {
    "USD": 1.0,
    "INR": 83.50,      # Indian Rupee
    "EUR": 0.92,       # Euro
    "GBP": 0.79,       # British Pound
    "AUD": 1.52,       # Australian Dollar
    "CAD": 1.35,       # Canadian Dollar
    "AED": 3.67,       # UAE Dirham
    "THB": 33.50,      # Thai Baht
    "SGD": 1.34,       # Singapore Dollar
    "MYR": 4.45,       # Malaysian Ringgit
    "JPY": 145.0,      # Japanese Yen
    "CNY": 7.20,       # Chinese Yuan
}

def convert_currency(amount_usd: float, target_currency: str) -> float:
    """Convert USD amount to target currency"""
    rate = CURRENCY_RATES.get(target_currency.upper(), 1.0)
    return amount_usd * rate

# Create router
router = APIRouter(
    prefix="/api/v1/ai/travel",
    tags=["Travel Budget Planner"],
    responses={
        400: {"description": "Bad Request - Invalid input"},
        422: {"description": "Unprocessable Entity - Validation error"},
        500: {"description": "Internal Server Error"},
    }
)


# ============================================
# SCHEMAS
# ============================================

class TravelBudgetRequest(BaseModel):
    """Request schema for travel budget calculation"""
    
    originCity: str = Field(..., min_length=2, max_length=100, alias="originCity")
    originCountry: str = Field(..., min_length=2, max_length=100, alias="originCountry")
    destinationCity: str = Field(..., min_length=2, max_length=100, alias="destinationCity")
    destinationCountry: str = Field(..., min_length=2, max_length=100, alias="destinationCountry")
    additionalDestinations: Optional[str] = Field(None, max_length=200, alias="additionalDestinations")
    startDate: date = Field(..., alias="startDate")
    endDate: date = Field(..., alias="endDate")
    adults: int = Field(..., ge=1, le=20)
    children: int = Field(0, ge=0, le=10)
    infants: int = Field(0, ge=0, le=5)
    travelStyle: str = Field(..., pattern="^(budget|standard|luxury|ultra-luxury)$")
    tripTheme: List[str] = Field(default_factory=list)
    localTransport: str = Field(..., pattern="^(public|taxi|rental|mix)$")
    homeCurrency: str = Field(..., min_length=3, max_length=3)
    includeFlights: bool = True
    includeVisa: bool = False
    includeInsurance: bool = True
    bufferPercentage: int = Field(10, ge=0, le=50)
    itineraryDetailLevel: str = Field(default="standard", pattern="^(brief|standard|detailed)$", alias="itineraryDetailLevel")
    
    class Config:
        populate_by_name = True
    
    @field_validator('endDate')
    @classmethod
    def validate_end_date(cls, v: date, info: ValidationInfo) -> date:
        if info.data.get('startDate') and v <= info.data['startDate']:
            raise ValueError('End date must be after start date')
        return v


class ExpenseBreakdown(BaseModel):
    """Expense breakdown for the trip"""
    
    flights: float = 0
    accommodation: float = 0
    food: float = 0
    localTransport: float = 0
    activities: float = 0
    shopping: float = 0
    visa: float = 0
    insurance: float = 0
    miscellaneous: float = 0


class TravelBudgetResponse(BaseModel):
    """Response schema for travel budget calculation"""
    
    expenses: ExpenseBreakdown
    subtotal: float
    buffer: float
    grandTotal: float
    perPersonCost: float
    perDayCost: float
    tripDays: int
    currency: str
    message: str = "Budget calculated successfully"


class HybridBudgetResponse(BaseModel):
    """Response schema for hybrid AI + fallback budget calculation"""
    
    flight_estimate: Dict[str, Any]
    hotel_per_night: Dict[str, Any]
    food_per_day: Dict[str, Any]
    transport_per_day: Dict[str, Any]
    activities_per_day: Dict[str, Any]
    
    total_flight_cost: float
    total_hotel_cost: float
    total_food_cost: float
    total_transport_cost: float
    total_activities_cost: float
    shopping_cost: float
    visa_cost: float
    insurance_cost: float
    miscellaneous_cost: float
    
    subtotal: float
    buffer: float
    total_estimated_cost: float
    per_person_cost: float
    per_day_cost: float
    
    trip_days: int
    currency: str
    ai_status: str  # "ai-enhanced", "fallback", "partial-ai"
    fallback_used: bool
    ai_latency_ms: Optional[float] = None
    ai_calls_remaining: int = 3
    calculation_time_ms: float


class TravelOptimizationRequest(BaseModel):
    """Request schema for travel optimization"""
    
    travelData: TravelBudgetRequest
    budgetData: ExpenseBreakdown


class TravelOptimizationResponse(BaseModel):
    """Response schema for travel optimization suggestions"""
    
    originalCost: float
    optimizedCost: float
    savings: float
    savingsPercentage: float
    suggestions: List[Dict[str, Any]]
    message: str = "Optimization suggestions generated"


class ItineraryRequest(BaseModel):
    """Request schema for itinerary generation"""
    
    travelData: TravelBudgetRequest
    budgetData: ExpenseBreakdown
    itineraryDetailLevel: str = Field(default="standard", pattern="^(brief|standard|detailed)$")


class Activity(BaseModel):
    """Detailed activity information"""
    
    time: str
    title: str
    description: str
    duration: str
    cost: float = 0
    venue: Optional[str] = None
    why_visit: Optional[str] = None
    what_to_expect: Optional[str] = None
    booking_link: Optional[str] = None
    image_url: Optional[str] = None
    tips: List[str] = Field(default_factory=list)


class ItinerarySection(BaseModel):
    """Morning/Afternoon/Evening section"""
    
    section: str  # "Morning", "Afternoon", "Evening", "Night"
    title: str
    description: str
    activities: List[Activity]
    estimated_duration: str
    cost: float = 0
    tips: List[str] = []


class DayItinerary(BaseModel):
    """Single day itinerary with multiple view options"""
    
    day: int
    date: str
    theme: str  # e.g., "Beaches & Culture"
    location: str  # e.g., "North Goa"
    overview: str  # Day overview description
    
    # Hour-by-hour view
    hourly_activities: List[Dict[str, Union[str, float, int]]] = []
    
    # Section-based view (Morning/Afternoon/Evening)
    sections: List[ItinerarySection] = []
    
    estimated_cost: float
    tips: List[str]
    must_try: Optional[str] = None  # Specific dish/experience to try
    best_time: Optional[str] = None  # Best time to visit certain places
    local_insights: Optional[str] = None


class ItineraryResponse(BaseModel):
    """Response schema for itinerary generation"""
    
    itinerary: List[DayItinerary]
    totalDays: int
    totalCost: float
    message: str = "Itinerary generated successfully"


# ============================================
# HELPER FUNCTIONS
# ============================================

def calculate_trip_days(start_date: date, end_date: date) -> int:
    """Calculate number of days in trip"""
    return (end_date - start_date).days + 1


def get_cost_multipliers(travel_style: str) -> Dict[str, float]:
    """Get cost multipliers based on travel style"""
    multipliers = {
        "budget": {
            "accommodation": 1.0,
            "food": 1.0,
            "transport": 1.0,
            "activities": 1.0
        },
        "standard": {
            "accommodation": 2.0,
            "food": 1.8,
            "transport": 1.5,
            "activities": 1.6
        },
        "luxury": {
            "accommodation": 4.0,
            "food": 3.5,
            "transport": 3.0,
            "activities": 3.2
        },
        "ultra-luxury": {
            "accommodation": 8.0,
            "food": 6.0,
            "transport": 5.0,
            "activities": 5.5
        }
    }
    return multipliers.get(travel_style, multipliers["standard"])


def estimate_base_costs(destination_city: str, destination_country: str, travelers: int, days: int) -> Dict[str, float]:
    """
    Estimate base costs for a destination with realistic pricing
    Based on 2025 average travel costs from major booking platforms
    """
    # Enhanced base costs per day (in USD) - realistic 2025 estimates
    destination_lower = f"{destination_city} {destination_country}".lower()
    
    # Tier 1: Ultra High-cost (Luxury destinations)
    if any(city in destination_lower for city in ['dubai', 'abu dhabi', 'zurich', 'geneva', 'singapore', 'hong kong', 'reykjavik']):
        base_costs = {
            "accommodation": 120.0,  # Per room per night
            "food": 60.0,            # Per person per day
            "transport": 30.0,       # Per person per day
            "activities": 50.0       # Per person per day
        }
    
    # Tier 2: High-cost (Major Western cities)
    elif any(city in destination_lower for city in ['london', 'paris', 'new york', 'tokyo', 'sydney', 'oslo', 'copenhagen', 'stockholm', 'san francisco', 'los angeles']):
        base_costs = {
            "accommodation": 100.0,
            "food": 50.0,
            "transport": 25.0,
            "activities": 40.0
        }
    
    # Tier 3: Medium-High cost (Popular European cities)
    elif any(city in destination_lower for city in ['rome', 'barcelona', 'amsterdam', 'madrid', 'milan', 'vienna', 'munich', 'venice', 'florence']):
        base_costs = {
            "accommodation": 80.0,
            "food": 40.0,
            "transport": 20.0,
            "activities": 35.0
        }
    
    # Tier 4: Medium cost (Eastern Europe, Asia-Pacific developed)
    elif any(city in destination_lower for city in ['prague', 'berlin', 'lisbon', 'seoul', 'taipei', 'kuala lumpur', 'bangkok', 'istanbul']):
        base_costs = {
            "accommodation": 60.0,
            "food": 30.0,
            "transport": 15.0,
            "activities": 25.0
        }
    
    # Tier 5: Budget-friendly (South Asia, Southeast Asia, Latin America)
    elif any(place in destination_lower for place in ['india', 'delhi', 'mumbai', 'bangalore', 'goa', 'vietnam', 'thailand', 'bali', 'indonesia', 'mexico', 'egypt', 'morocco', 'philippines', 'cambodia', 'sri lanka']):
        base_costs = {
            "accommodation": 40.0,
            "food": 20.0,
            "transport": 10.0,
            "activities": 15.0
        }
    
    # Default: Medium cost
    else:
        base_costs = {
            "accommodation": 70.0,
            "food": 35.0,
            "transport": 18.0,
            "activities": 30.0
        }
    
    return base_costs


# ============================================
# ENDPOINTS
# ============================================

@router.post("/calculate-budget", response_model=TravelBudgetResponse)
async def calculate_travel_budget(request: TravelBudgetRequest):
    """
    AI-Powered Travel Budget Calculator
    Uses OpenAI to get realistic, current travel prices based on user input
    
    Args:
        request: TravelBudgetRequest with trip details
    
    Returns:
        TravelBudgetResponse with AI-generated expense breakdown
    """
    try:
        logger.info(f"✅ Received travel budget request: {request.model_dump()}")
        logger.info(f"Calculating AI-powered travel budget from {request.originCity}, {request.originCountry} to {request.destinationCity}, {request.destinationCountry}")
        
        # Calculate trip days
        trip_days = calculate_trip_days(request.startDate, request.endDate)
        nights = trip_days - 1
        total_travelers = request.adults + request.children + request.infants
        
        # Build AI prompt for realistic pricing
        ai_prompt = f"""You are a travel budget expert with knowledge of current 2025 travel prices in India and worldwide.

Calculate a REALISTIC travel budget for the following trip:

FROM: {request.originCity}, {request.originCountry}
TO: {request.destinationCity}, {request.destinationCountry}
DURATION: {trip_days} days ({nights} nights)
TRAVELERS: {request.adults} adults, {request.children} children, {request.infants} infants (Total: {total_travelers})
TRAVEL STYLE: {request.travelStyle}
TRANSPORT PREFERENCE: {request.localTransport}
TRIP THEME: {', '.join(request.tripTheme) if request.tripTheme else 'General sightseeing'}
DATES: {request.startDate} to {request.endDate}

IMPORTANT: Provide REALISTIC 2025 market prices. Use actual booking platform data as reference.

Return a JSON object with this EXACT structure (all prices in {request.homeCurrency}):
{{
  "flight_cost_per_person": <number for round-trip economy>,
  "hotel_cost_per_night": <number for {request.travelStyle} hotel>,
  "food_cost_per_person_per_day": <number>,
  "transport_cost_per_person_per_day": <number for {request.localTransport} transport>,
  "activities_cost_per_person_per_day": <number>,
  "shopping_budget_total": <number for {total_travelers} people>,
  "visa_cost_per_person": <number, 0 if domestic>,
  "insurance_cost_per_person": <number for {trip_days} days>,
  "miscellaneous_percentage": <number between 5-10 as percentage>,
  "reasoning": "<brief 1-sentence explanation of pricing>"
}}

PRICING GUIDELINES:
- Mumbai to Bangalore flight: ₹5,000-9,000 per person
- Budget hotel: ₹1,500-2,500/night, Standard: ₹3,000-5,000/night, Luxury: ₹8,000+/night
- Food budget: ₹400-600/day, standard: ₹800-1,200/day, luxury: ₹2,000+/day
- Domestic travel insurance: ₹100-200/day, International: ₹300-500/day
- Be realistic and conservative with estimates

Return ONLY the JSON object, no other text."""

        logger.info("Calling OpenAI for AI-powered pricing...")
        
        # Call OpenAI API
        try:
            response = await openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a travel budget expert providing realistic 2025 travel cost estimates. Always return valid JSON only."},
                    {"role": "user", "content": ai_prompt}
                ],
                temperature=0.3,  # Lower temperature for more consistent pricing
                max_tokens=800
            )
            
            ai_content = response.choices[0].message.content
            if ai_content is None:
                raise ValueError("AI response content is None")
            ai_response = ai_content.strip()
            logger.info(f"AI Response: {ai_response}")
            
            # Parse JSON response
            import json
            ai_prices = json.loads(ai_response)
            
        except Exception as e:
            logger.error(f"OpenAI API Error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get AI pricing: {str(e)}"
            )
        
        # Calculate expenses using AI-provided prices
        expenses = ExpenseBreakdown()
        
        # Flights (if included)
        if request.includeFlights:
            expenses.flights = ai_prices.get("flight_cost_per_person", 0) * total_travelers
        else:
            expenses.flights = 0
        
        # Accommodation (hotel per night × nights)
        expenses.accommodation = ai_prices.get("hotel_cost_per_night", 0) * nights
        
        # Food (per person per day × travelers × days)
        expenses.food = ai_prices.get("food_cost_per_person_per_day", 0) * total_travelers * trip_days
        
        # Local transport (per person per day × travelers × days)
        expenses.localTransport = ai_prices.get("transport_cost_per_person_per_day", 0) * total_travelers * trip_days
        
        # Activities (per person per day × travelers × days)
        expenses.activities = ai_prices.get("activities_cost_per_person_per_day", 0) * total_travelers * trip_days
        
        # Shopping
        expenses.shopping = ai_prices.get("shopping_budget_total", 0)
        
        # Visa (if included)
        if request.includeVisa:
            expenses.visa = ai_prices.get("visa_cost_per_person", 0) * total_travelers
        else:
            expenses.visa = 0
        
        # Insurance (if included)
        if request.includeInsurance:
            expenses.insurance = ai_prices.get("insurance_cost_per_person", 0) * total_travelers
        else:
            expenses.insurance = 0
        
        # Miscellaneous (use AI percentage or default 7%)
        misc_percentage = ai_prices.get("miscellaneous_percentage", 7) / 100
        expenses.miscellaneous = (
            expenses.accommodation + 
            expenses.food + 
            expenses.localTransport + 
            expenses.activities
        ) * misc_percentage
        
        # Calculate totals
        subtotal = (
            expenses.flights +
            expenses.accommodation +
            expenses.food +
            expenses.localTransport +
            expenses.activities +
            expenses.shopping +
            expenses.visa +
            expenses.insurance +
            expenses.miscellaneous
        )
        
        buffer = subtotal * (request.bufferPercentage / 100)
        grand_total = subtotal + buffer
        per_person_cost = grand_total / total_travelers
        per_day_cost = grand_total / trip_days
        
        # Note: AI already provides prices in target currency, no conversion needed
        
        response = TravelBudgetResponse(
            expenses=expenses,
            subtotal=round(subtotal, 2),
            buffer=round(buffer, 2),
            grandTotal=round(grand_total, 2),
            perPersonCost=round(per_person_cost, 2),
            perDayCost=round(per_day_cost, 2),
            tripDays=trip_days,
            currency=request.homeCurrency
        )
        
        logger.info(f"Budget calculated successfully: {grand_total:.2f} {request.homeCurrency}")
        return response
        
    except Exception as e:
        logger.error(f"Error calculating travel budget: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate budget: {str(e)}"
        )


@router.post("/optimize", response_model=TravelOptimizationResponse)
async def optimize_travel_budget(request: TravelOptimizationRequest):
    """
    Generate AI-powered optimization suggestions for travel budget
    
    Args:
        request: TravelOptimizationRequest with travel and budget data
    
    Returns:
        TravelOptimizationResponse with optimization suggestions
    """
    try:
        logger.info("Generating travel optimization suggestions")
        
        # Calculate original cost
        original_cost = (
            request.budgetData.flights +
            request.budgetData.accommodation +
            request.budgetData.food +
            request.budgetData.localTransport +
            request.budgetData.activities +
            request.budgetData.shopping +
            request.budgetData.visa +
            request.budgetData.insurance +
            request.budgetData.miscellaneous
        )
        
        # Generate optimization suggestions (simplified for Phase 3)
        suggestions: List[Dict[str, Any]] = []
        potential_savings = 0
        
        # Flight optimization
        if request.budgetData.flights > 0:
            flight_savings = request.budgetData.flights * 0.15
            potential_savings += flight_savings
            suggestions.append({
                "category": "Flights",
                "icon": "✈️",
                "suggestion": "Book flights 2-3 months in advance for 15% savings",
                "savings": round(flight_savings, 2),
                "priority": "high"
            })
        
        # Accommodation optimization
        if request.budgetData.accommodation > 0:
            acc_savings = request.budgetData.accommodation * 0.20
            potential_savings += acc_savings
            suggestions.append({
                "category": "Accommodation",
                "icon": "🏨",
                "suggestion": "Consider Airbnb or hostels for 20% cost reduction",
                "savings": round(acc_savings, 2),
                "priority": "high"
            })
        
        # Food optimization
        if request.budgetData.food > 0:
            food_savings = request.budgetData.food * 0.25
            potential_savings += food_savings
            suggestions.append({
                "category": "Food",
                "icon": "🍽️",
                "suggestion": "Mix street food with restaurants for 25% savings",
                "savings": round(food_savings, 2),
                "priority": "medium"
            })
        
        # Activities optimization
        if request.budgetData.activities > 0:
            activity_savings = request.budgetData.activities * 0.18
            potential_savings += activity_savings
            suggestions.append({
                "category": "Activities",
                "icon": "🎡",
                "suggestion": "Book activities online in advance for 18% off",
                "savings": round(activity_savings, 2),
                "priority": "medium"
            })
        
        optimized_cost = original_cost - potential_savings
        savings_percentage = (potential_savings / original_cost * 100) if original_cost > 0 else 0
        
        response = TravelOptimizationResponse(
            originalCost=round(original_cost, 2),
            optimizedCost=round(optimized_cost, 2),
            savings=round(potential_savings, 2),
            savingsPercentage=round(savings_percentage, 2),
            suggestions=suggestions
        )
        
        logger.info(f"Optimization generated: {potential_savings} savings")
        return response
        
    except Exception as e:
        logger.error(f"Error generating optimization: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate optimization: {str(e)}"
        )


@router.post("/generate-itinerary", response_model=ItineraryResponse)
async def generate_itinerary(request: ItineraryRequest):
    """
    Generate detailed day-by-day itinerary with specific landmarks, cuisines, and activities
    
    Args:
        request: ItineraryRequest with travel and budget data, including itineraryDetailLevel
    
    Returns:
        ItineraryResponse with itinerary matching requested detail level
        - brief: Quick overview with main attractions only (minimal tokens)
        - standard: Balanced itinerary with activities, times, and tips (recommended)
        - detailed: Comprehensive with landmarks, cuisines, maps, and deep insights (high tokens)
    """
    try:
        detail_level = request.itineraryDetailLevel or "standard"
        logger.info(f"Generating {detail_level} travel itinerary")
        
        trip_days = calculate_trip_days(request.travelData.startDate, request.travelData.endDate)
        
        # Use template-based itinerary for fast, reliable results
        # This provides specific landmarks, cuisines, and activities by default
        ai_itinerary_data = create_template_itinerary(request.travelData.destinationCity, trip_days)
        
        # Optional: Try to enhance with AI based on detail level
        # - brief: Skip AI, use template only
        # - standard: Try AI if trip <= 7 days (limited tokens)
        # - detailed: Always try AI for comprehensive details
        should_use_ai = (
            (detail_level == "standard" and trip_days <= 7) or
            detail_level == "detailed"
        )
        
        if should_use_ai:
            try:
                ai_enhanced = await generate_ai_itinerary_details(
                    destination_city=request.travelData.destinationCity,
                    destination_country=request.travelData.destinationCountry,
                    trip_days=trip_days,
                    trip_theme=request.travelData.tripTheme,
                    budget=request.budgetData,
                    travel_style=request.travelData.travelStyle,
                    detail_level=detail_level
                )
                if ai_enhanced:
                    ai_itinerary_data = ai_enhanced
                    logger.info(f"AI-enhanced {detail_level} itinerary generated successfully")
            except Exception as e:
                logger.info(f"AI enhancement skipped for {detail_level} (using template): {str(e)}")
        else:
            logger.info(f"Skipping AI for {detail_level} detail level to save tokens")
        
        # Generate itinerary from data
        itinerary: List[DayItinerary] = []
        
        logger.info(f"Creating itinerary with {trip_days} days from template")
        logger.info(f"Template keys: {list(ai_itinerary_data.keys())}")
        
        for day in range(1, trip_days + 1):
            current_date = request.travelData.startDate
            from datetime import timedelta
            current_date = current_date + timedelta(days=day - 1)
            
            # Get day-specific data with fallback
            day_key = f"day_{day}"
            day_data = ai_itinerary_data.get(day_key, {})
            
            if not day_data:
                logger.warning(f"No data for {day_key}, using defaults")
                day_data = {
                    "title": f"Day {day}",
                    "morning_activity": {"name": f"Landmark {day}", "description": "Explore local attractions", "tips": []},
                    "lunch": {"dish_name": "Local cuisine", "description": "Local lunch", "tips": []},
                    "afternoon_activity": {"name": "Afternoon activity", "description": "Activities", "tips": []},
                    "dinner": {"description": "Dinner", "evening_activity": "Evening walk", "tips": []},
                    "tips": []
                }
            
            # Build hourly activities for the day
            hourly_activities: List[Dict[str, Union[str, float, int]]] = []
            
            # Build section-based itinerary
            sections: List[ItinerarySection] = []
            
            # Morning section (6 AM - 12 PM)
            morning_activities = []
            if "morning_activity" in day_data and day_data["morning_activity"]:
                morning_tips = day_data["morning_activity"].get("tips", [])
                morning_activities.append(Activity(
                    time="08:00 AM",
                    title=day_data["morning_activity"].get("name", "Morning Exploration"),
                    description=day_data['morning_activity'].get('description', 'Start your day with local attractions'),
                    duration="3 hours",
                    cost=round(request.budgetData.activities / trip_days * 0.3, 2),
                    why_visit="Must-visit attraction",
                    what_to_expect="Crowds, photography opportunities",
                    tips=morning_tips or ["Arrive early to avoid crowds"]
                ))
            
            if morning_activities:
                morning_cost = sum(a.cost for a in morning_activities)
                sections.append(ItinerarySection(
                    section="Morning",
                    title="🌅 " + (day_data.get("morning_title", "Explore & Discover")),
                    description="Start your day with local attractions and cultural experiences",
                    activities=morning_activities,
                    estimated_duration="3 hours",
                    cost=morning_cost,
                    tips=day_data.get("morning_tips", ["Start early", "Bring water"])
                ))
            
            # Afternoon section (12 PM - 6 PM)
            afternoon_activities = []
            
            # Lunch
            if "lunch" in day_data and day_data["lunch"]:
                lunch_tips = [
                    f"Must try: {day_data['lunch'].get('must_try_items', 'local specialties')}",
                    f"Restaurant type: {day_data['lunch'].get('restaurant_type', 'local eatery')}"
                ]
                afternoon_activities.append(Activity(
                    time="01:00 PM",
                    title=f"Lunch - {day_data['lunch'].get('dish_name', 'Local Cuisine')}",
                    description=day_data["lunch"].get("description", "Enjoy local specialties"),
                    duration="1.5 hours",
                    cost=round(request.budgetData.food / trip_days * 0.35, 2),
                    why_visit="Authentic local flavors",
                    what_to_expect="Traditional cuisine, local atmosphere",
                    tips=lunch_tips
                ))
            
            # Afternoon activity
            if "afternoon_activity" in day_data and day_data["afternoon_activity"]:
                afternoon_tips = day_data["afternoon_activity"].get("tips", [])
                afternoon_activities.append(Activity(
                    time="03:30 PM",
                    title=day_data["afternoon_activity"].get("name", "Afternoon Adventure"),
                    description=day_data["afternoon_activity"].get("description", "Adventure and exploration"),
                    duration="3.5 hours",
                    cost=round(request.budgetData.activities / trip_days * 0.35, 2),
                    why_visit="Unique experiences and adventures",
                    what_to_expect="Activities, nature, culture",
                    tips=afternoon_tips or ["Book in advance", "Bring sunscreen"]
                ))
            
            if afternoon_activities:
                afternoon_cost = sum(a.cost for a in afternoon_activities)
                sections.append(ItinerarySection(
                    section="Afternoon",
                    title="☀️ " + (day_data.get("afternoon_title", "Adventure & Culture")),
                    description="Experience the heart of the destination with activities and local culture",
                    activities=afternoon_activities,
                    estimated_duration="4.5 hours",
                    cost=afternoon_cost,
                    tips=day_data.get("afternoon_tips", ["Stay hydrated", "Wear comfortable shoes"])
                ))
            
            # Evening section (6 PM - 11 PM)
            evening_activities = []
            
            # Dinner
            if "dinner" in day_data and day_data["dinner"]:
                dinner_tips = day_data["dinner"].get("tips", ["Book ahead if needed"])
                evening_activities.append(Activity(
                    time="07:30 PM",
                    title=f"Dinner at {day_data['dinner'].get('restaurant_name', 'Local Restaurant')}",
                    description=day_data["dinner"].get("description", "Evening meal and relaxation"),
                    duration="2 hours",
                    cost=round(request.budgetData.food / trip_days * 0.30, 2),
                    why_visit="Culinary excellence with views",
                    what_to_expect="Fine dining or casual dining with ambiance",
                    tips=dinner_tips
                ))
            
            # Evening activity
            if "dinner" in day_data and day_data["dinner"].get("evening_activity"):
                evening_tips = day_data["dinner"].get("tips", [])
                evening_activities.append(Activity(
                    time="09:30 PM",
                    title=day_data["dinner"].get("evening_activity", "Leisure"),
                    description="Wind down your day with relaxation and entertainment",
                    duration="1.5 hours",
                    cost=0,
                    why_visit="Local nightlife and relaxation",
                    what_to_expect="Drinks, music, local atmosphere",
                    tips=evening_tips or ["Enjoy responsibly"]
                ))
            
            if evening_activities:
                evening_cost = sum(a.cost for a in evening_activities)
                sections.append(ItinerarySection(
                    section="Evening",
                    title="🌙 " + (day_data.get("evening_title", "Dine & Relax")),
                    description="Experience local cuisine and evening entertainment",
                    activities=evening_activities,
                    estimated_duration="3.5 hours",
                    cost=evening_cost,
                    tips=day_data.get("evening_tips", ["Make reservations", "Dress code may apply"])
                ))
            
            # For hourly view, combine all activities
            hourly_activities = [a.model_dump() for section in sections for a in section.activities]
            
            day_cost = sum(float(section.cost) for section in sections) if sections else 0
            
            # Ensure day_cost is not zero (minimum day allocation)
            if day_cost == 0 and (request.budgetData.activities > 0 or request.budgetData.food > 0):
                day_cost = round((request.budgetData.activities + request.budgetData.food) / trip_days, 2)
            
            day_itinerary = DayItinerary(
                day=day,
                date=current_date.strftime("%Y-%m-%d"),
                theme=day_data.get("theme", f"Explore {request.travelData.destinationCity}"),
                location=day_data.get("location", request.travelData.destinationCity),
                overview=day_data.get("overview", f"Full day exploring {request.travelData.destinationCity}"),
                hourly_activities=hourly_activities,
                sections=sections,
                estimated_cost=round(day_cost, 2),
                tips=day_data.get("tips", [
                    "Start early to maximize your day",
                    "Stay hydrated and take breaks",
                    "Carry a camera for memories"
                ]),
                must_try=day_data.get("lunch", {}).get("dish_name", None),
                best_time=day_data.get("best_time", "Early morning for landmarks, late evening for sunset"),
                local_insights=day_data.get("local_insights", None)
            )
            
            itinerary.append(day_itinerary)
        
        total_cost = sum(float(day.estimated_cost) for day in itinerary)
        
        response = ItineraryResponse(
            itinerary=itinerary,
            totalDays=trip_days,
            totalCost=round(total_cost, 2)
        )
        
        logger.info(f"AI-powered itinerary generated: {trip_days} days")
        return response
        
    except Exception as e:
        logger.error(f"Error generating itinerary: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate itinerary: {str(e)}"
        )


async def generate_ai_itinerary_details(
    destination_city: str,
    destination_country: str,
    trip_days: int,
    trip_theme: List[str],
    budget: ExpenseBreakdown,
    travel_style: str,
    detail_level: str = "standard"
) -> Optional[Dict[str, Any]]:
    """
    Generate detailed AI-powered itinerary with specific landmarks, cuisines, and activities
    
    Args:
        detail_level: 'brief' (minimal), 'standard' (balanced), 'detailed' (comprehensive)
    """
    try:
        theme_str = ", ".join(trip_theme) if trip_theme else "general sightseeing"
        
        # Customize prompt based on detail level
        if detail_level == "brief":
            detail_instruction = """
BRIEF ITINERARY - Focus on TOP must-do items only:
- 1-2 main activities per day
- Minimal descriptions (1 sentence each)
- No extensive tips or deep insights
- Focus on efficiency
"""
        elif detail_level == "detailed":
            detail_instruction = """
DETAILED ITINERARY - Comprehensive planning guide:
- 3-4 activities per day with multiple options
- Detailed descriptions with practical information
- Multiple tips and alternatives for each activity
- Include transportation tips between locations
- Add cost breakdown for each activity
- Provide booking links and contact info where relevant
"""
        else:  # standard
            detail_instruction = """
STANDARD ITINERARY - Balanced approach:
- 2-3 activities per day
- Brief but informative descriptions
- 1-2 practical tips per activity
- Include approximate times and costs
- Include local insights
"""
        
        prompt = f"""
You are an expert travel guide. Create a {detail_level} {trip_days}-day itinerary for {destination_city}, {destination_country}.

Travel Style: {travel_style}
Trip Theme: {theme_str}
Daily Activity Budget: ${budget.activities / trip_days:.0f}
Daily Food Budget: ${budget.food / trip_days:.0f}

{detail_instruction}

For EACH day (day_1, day_2, etc.), provide a JSON with this structure:
{{
  "day_1": {{
    "title": "Day 1 - [Specific Activity/Area Name]",
    "morning_activity": {{
      "name": "[Specific landmark or activity name]",
      "description": "[Why it's must-visit and what to expect]",
      "tips": ["[Specific tip 1]", "[Specific tip 2]"]
    }},
    "lunch": {{
      "dish_name": "[Specific local dish name]",
      "description": "[Why this dish is special and where to find it]",
      "must_try_items": "[Comma-separated list of specific dishes/items]",
      "restaurant_type": "[E.g., Street food vendor, 5-star restaurant, local eatery]"
    }},
    "afternoon_activity": {{
      "name": "[Specific activity - adventure/cultural/shopping]",
      "description": "[Detailed description of the activity and why it's worth doing]",
      "tips": ["[How to book]", "[Best time to visit]"]
    }},
    "dinner": {{
      "description": "[Dinner recommendation and evening activity]",
      "evening_activity": "[Specific activity like live music, sunset view, beach walk]",
      "tips": ["[Restaurant recommendation]", "[Local specialty to try]"]
    }},
    "tips": [
      "[Day-specific tip 1]",
      "[Day-specific tip 2]",
      "[Day-specific tip 3]"
    ]
  }},
  "day_2": {{ ... }},
  ...
}}

IMPORTANT:
1. Be SPECIFIC - use actual landmark names, dish names, activity types
2. Provide actionable information - not generic descriptions
3. Include specific costs/timing where relevant
4. Tailor to {travel_style} travel style
5. Match the theme: {theme_str}
6. Each day should flow logically with appropriate travel time between activities
7. Include local insights and insider tips
8. Detail level: {detail_level} - adjust comprehensiveness accordingly

Return ONLY valid JSON, no other text.
"""
        
        response = await openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert travel guide. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=4000,
            timeout=30
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Extract JSON from response
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        itinerary_data = json.loads(response_text)
        logger.info(f"AI itinerary generated successfully for {destination_city}")
        return itinerary_data
        
    except Exception as e:
        logger.error(f"Error generating AI itinerary: {str(e)}")
        return None


def create_template_itinerary(destination_city: str, trip_days: int) -> Dict[str, Any]:
    """
    Create a template itinerary when AI generation fails
    """
    template = {}
    
    landmarks = {
        "Mumbai": ["Gateway of India", "Taj Mahal Palace", "Marine Drive"],
        "Goa": ["Basilica of Bom Jesus", "Fort Aguada", "Dudhsagar Waterfall"],
        "Bangalore": ["Vidhana Soudha", "Bangalore Palace", "Cubbon Park"],
        "Delhi": ["Taj Mahal", "India Gate", "Red Fort"],
        "Jaipur": ["City Palace", "Hawa Mahal", "Albert Hall Museum"],
        "Chennai": ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George"],
        "Kolkata": ["Victoria Memorial", "Howrah Bridge", "Indian Museum"],
        "Hyderabad": ["Charminar", "Golconda Fort", "Ramakrishna Math"]
    }
    
    cuisines = {
        "Mumbai": ["Vada Pav", "Pav Bhaji", "Seafood"],
        "Goa": ["Fish Curry", "Prawn Biryani", "Bebinca"],
        "Bangalore": ["Dosa", "Idli", "Coffee"],
        "Delhi": ["Butter Chicken", "Chole Bhature", "Momos"],
        "Jaipur": ["Gatte Ki Sabzi", "Laal Maas", "Pyaaz Kachori"],
        "Chennai": ["Dosa", "Rasam", "Sambar"],
        "Kolkata": ["Fish Curry", "Rasgulla", "Luchi"],
        "Hyderabad": ["Hyderabadi Biryani", "Haleem", "Khubani Ka Meetha"]
    }
    
    activities = {
        "Mumbai": ["Shopping at Linking Road", "Sunset at Marine Drive", "Nightlife in Bandra"],
        "Goa": ["Beach hopping", "Water sports", "Spice plantation tour"],
        "Bangalore": ["Hiking at Nandi Hills", "Breweries tour", "Bangalore Palace visit"],
        "Delhi": ["Day trip to Agra", "Heritage walk", "Shopping at Chandni Chowk"],
        "Jaipur": ["City Palace tour", "Elephant ride", "Shopping at bazaars"],
        "Chennai": ["Temple visits", "Marina Beach walk", "Art galleries"],
        "Kolkata": ["Museum visits", "River Hooghly cruise", "Street food tour"],
        "Hyderabad": ["Fort exploration", "Ramoji Film City", "Biryani food tour"]
    }
    
    city_landmarks = landmarks.get(destination_city, ["Famous landmark", "Historical site", "Natural wonder"])
    city_cuisines = cuisines.get(destination_city, ["Local specialty", "Traditional dish", "Street food"])
    city_activities = activities.get(destination_city, ["Sightseeing", "Adventure activity", "Shopping"])
    
    for day in range(1, trip_days + 1):
        landmark_idx = (day - 1) % len(city_landmarks)
        cuisine_idx = (day - 1) % len(city_cuisines)
        activity_idx = (day - 1) % len(city_activities)
        
        template[f"day_{day}"] = {
            "title": f"Day {day} - Explore {destination_city}",
            "morning_activity": {
                "name": city_landmarks[landmark_idx],
                "description": f"Visit the iconic {city_landmarks[landmark_idx]}, a must-see attraction in {destination_city}",
                "tips": ["Arrive early to avoid crowds", "Hire a local guide for better insights"]
            },
            "lunch": {
                "dish_name": city_cuisines[cuisine_idx],
                "description": f"Taste authentic {city_cuisines[cuisine_idx]} at a local restaurant",
                "must_try_items": f"{city_cuisines[cuisine_idx]}, local specialties",
                "restaurant_type": "Local eatery or restaurant"
            },
            "afternoon_activity": {
                "name": city_activities[activity_idx],
                "description": f"Enjoy {city_activities[activity_idx]} in {destination_city}",
                "tips": ["Book in advance if needed", "Carry water and sunscreen"]
            },
            "dinner": {
                "description": f"Evening exploration and dinner",
                "evening_activity": "Local market or street food walk",
                "tips": ["Try street food from trusted vendors", "Explore local markets"]
            },
            "tips": [
                f"Visit {city_landmarks[landmark_idx]} early to avoid crowds",
                f"Don't miss the local {city_cuisines[cuisine_idx]}",
                "Always carry sufficient water and cash"
            ]
        }
    
    return template


# ============================================
# AI-ENHANCED COST ESTIMATION (TEST)
# ============================================

async def get_ai_cost_estimates(
    origin_city: str,
    origin_country: str,
    destination_city: str,
    destination_country: str,
    start_date: str,
    end_date: str,
    travelers: int,
    travel_style: str,
    timeout: int = 10
) -> Dict[str, Any]:
    """
    Get AI-powered cost estimates using OpenAI
    Returns realistic cost estimates based on current market data
    """
    
    prompt = f"""You are a travel cost estimation expert. Provide realistic cost estimates for the following trip in JSON format.

Trip Details:
- Origin: {origin_city}, {origin_country}
- Destination: {destination_city}, {destination_country}
- Dates: {start_date} to {end_date}
- Travelers: {travelers} people
- Travel Style: {travel_style}

Provide cost estimates in USD as JSON with this exact structure:
{{
  "flight_cost_per_person": <number>,
  "hotel_per_night": <number>,
  "food_per_day_per_person": <number>,
  "transport_per_day_per_person": <number>,
  "activities_per_day_per_person": <number>,
  "reasoning": "Brief explanation of pricing factors"
}}

Consider:
1. Current 2025 market rates
2. Route distance and popularity
3. Seasonality (December is peak season)
4. Travel style impact on costs
5. Local cost of living at destination

Respond ONLY with valid JSON, no markdown formatting."""

    try:
        start_time = time.time()
        
        response = await asyncio.wait_for(
            openai_client.chat.completions.create(
                model="gpt-4o-mini",  # Fast and cost-effective
                messages=[
                    {"role": "system", "content": "You are a travel cost estimation expert. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,  # Low temperature for consistent estimates
                max_tokens=500
            ),
            timeout=timeout
        )
        
        end_time = time.time()
        latency = end_time - start_time
        
        # Parse AI response
        ai_content = response.choices[0].message.content
        if ai_content is None:
            raise ValueError("AI response content is None")
        ai_content = ai_content.strip()
        
        # Remove markdown code blocks if present
        if ai_content.startswith("```"):
            ai_content = ai_content.split("```")[1]
            if ai_content.startswith("json"):
                ai_content = ai_content[4:]
            ai_content = ai_content.strip()
        
        cost_data = json.loads(ai_content)
        cost_data["latency_seconds"] = round(latency, 2)
        cost_data["source"] = "openai"
        
        logger.info(f"AI cost estimation completed in {latency:.2f}s")
        return cost_data
        
    except asyncio.TimeoutError:
        logger.error(f"AI cost estimation timed out after {timeout}s")
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="AI estimation timed out"
        )
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI returned invalid response format"
        )
    except Exception as e:
        logger.error(f"AI cost estimation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI estimation failed: {str(e)}"
        )


@router.post("/test-ai-latency")
async def test_ai_latency(request: TravelBudgetRequest) -> Dict[str, Any]:
    """
    TEST ENDPOINT: Compare AI vs Rule-based calculation performance
    
    Returns:
    - AI-enhanced costs with latency
    - Rule-based costs with latency
    - Comparison metrics
    """
    
    try:
        trip_days = calculate_trip_days(request.startDate, request.endDate)
        total_travelers = request.adults + request.children + request.infants
        
        # Test 1: Rule-based calculation (current system)
        rule_start = time.time()
        
        base_costs = estimate_base_costs(
            request.destinationCity,
            request.destinationCountry,
            total_travelers,
            trip_days
        )
        style_multipliers = get_cost_multipliers(request.travelStyle)
        
        rooms_needed = (total_travelers + 1) // 2
        rule_flight = 250 * total_travelers  # India-Dubai estimate
        rule_hotel = base_costs["accommodation"] * style_multipliers["accommodation"] * rooms_needed * trip_days
        rule_food = base_costs["food"] * style_multipliers["food"] * total_travelers * trip_days
        rule_transport = base_costs["transport"] * style_multipliers["transport"] * total_travelers * trip_days
        rule_activities = base_costs["activities"] * style_multipliers["activities"] * total_travelers * trip_days * 0.8
        
        rule_total = rule_flight + rule_hotel + rule_food + rule_transport + rule_activities
        rule_end = time.time()
        rule_latency = rule_end - rule_start
        
        # Test 2: AI-enhanced calculation
        try:
            ai_costs = await get_ai_cost_estimates(
                origin_city=request.originCity,
                origin_country=request.originCountry,
                destination_city=request.destinationCity,
                destination_country=request.destinationCountry,
                start_date=str(request.startDate),
                end_date=str(request.endDate),
                travelers=total_travelers,
                travel_style=request.travelStyle,
                timeout=15
            )
            
            ai_flight = ai_costs["flight_cost_per_person"] * total_travelers
            ai_hotel = ai_costs["hotel_per_night"] * trip_days
            ai_food = ai_costs["food_per_day_per_person"] * total_travelers * trip_days
            ai_transport = ai_costs["transport_per_day_per_person"] * total_travelers * trip_days
            ai_activities = ai_costs["activities_per_day_per_person"] * total_travelers * trip_days
            
            ai_total = ai_flight + ai_hotel + ai_food + ai_transport + ai_activities
            ai_latency = ai_costs["latency_seconds"]
            ai_available = True
            ai_error = None
            
        except Exception as e:
            logger.warning(f"AI estimation failed: {str(e)}, using fallback")
            ai_costs = None
            ai_flight = rule_flight
            ai_hotel = rule_hotel
            ai_food = rule_food
            ai_transport = rule_transport
            ai_activities = rule_activities
            ai_total = rule_total
            ai_latency = 0
            ai_available = False
            ai_error = str(e)
        
        # Convert to user's currency
        currency = request.homeCurrency
        conversion_rate = CURRENCY_RATES.get(currency, 1.0)
        
        return {
            "test_results": {
                "rule_based": {
                    "method": "Internal calculations (Current System)",
                    "latency_ms": round(rule_latency * 1000, 2),
                    "costs": {
                        "flights": round(rule_flight * conversion_rate, 2),
                        "accommodation": round(rule_hotel * conversion_rate, 2),
                        "food": round(rule_food * conversion_rate, 2),
                        "transport": round(rule_transport * conversion_rate, 2),
                        "activities": round(rule_activities * conversion_rate, 2),
                        "total": round(rule_total * conversion_rate, 2),
                        "currency": currency
                    },
                    "pros": [
                        "Instant response (< 50ms)",
                        "Zero cost per request",
                        "100% reliable",
                        "No external dependencies"
                    ],
                    "cons": [
                        "Less accurate (±30-40% error)",
                        "No real-time market data",
                        "Doesn't consider seasonality"
                    ]
                },
                "ai_enhanced": {
                    "method": "OpenAI GPT-4o-mini",
                    "latency_ms": round(ai_latency * 1000, 2) if ai_available else None,
                    "available": ai_available,
                    "error": ai_error,
                    "costs": {
                        "flights": round(ai_flight * conversion_rate, 2),
                        "accommodation": round(ai_hotel * conversion_rate, 2),
                        "food": round(ai_food * conversion_rate, 2),
                        "transport": round(ai_transport * conversion_rate, 2),
                        "activities": round(ai_activities * conversion_rate, 2),
                        "total": round(ai_total * conversion_rate, 2),
                        "currency": currency,
                        "reasoning": ai_costs.get("reasoning") if ai_costs else None
                    },
                    "pros": [
                        "More accurate (±10-15% error)",
                        "Considers current market rates",
                        "Accounts for seasonality",
                        "Adapts to new destinations"
                    ],
                    "cons": [
                        f"Slower ({round(ai_latency * 1000)}ms vs 50ms)",
                        "Costs ~$0.002 per request",
                        "Depends on OpenAI availability",
                        "May timeout under load"
                    ]
                } if ai_available else {
                    "method": "OpenAI GPT-4o-mini",
                    "available": False,
                    "error": ai_error,
                    "fallback_used": "rule_based"
                },
                "comparison": {
                    "speed_difference": f"{round((ai_latency / rule_latency), 0)}x slower" if ai_available else "N/A",
                    "cost_difference_percent": round(abs((ai_total - rule_total) / rule_total * 100), 1) if ai_available else 0,
                    "ai_higher": ai_total > rule_total if ai_available else None,
                    "recommendation": (
                        "Use AI for premium users or on-demand refinement (with rate limiting)"
                        if ai_available else
                        "AI unavailable - rule-based system is reliable fallback"
                    )
                }
            },
            "trip_details": {
                "route": f"{request.originCity}, {request.originCountry} → {request.destinationCity}, {request.destinationCountry}",
                "dates": f"{request.startDate} to {request.endDate}",
                "duration": f"{trip_days} days",
                "travelers": total_travelers,
                "style": request.travelStyle
            }
        }
        
    except Exception as e:
        logger.error(f"Latency test failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Test failed: {str(e)}"
        )


# ============================================
# HYBRID AI + FALLBACK ENDPOINT (PRODUCTION)
# ============================================

@router.post("/calculate-budget-hybrid", response_model=HybridBudgetResponse)
async def calculate_budget_hybrid(
    request: TravelBudgetRequest,
    x_session_id: Optional[str] = Header(None)
):
    """
    PRODUCTION ENDPOINT: Hybrid AI + Fallback Architecture
    
    - Returns instant fallback estimates (< 50ms)
    - Attempts AI enhancement with 2-second timeout
    - Falls back to internal models on AI failure
    - Rate limited to 3 AI calls per session
    - Cached responses for 24 hours
    
    Args:
        request: Travel budget request
        x_session_id: Optional session ID for rate limiting
    
    Returns:
        Hybrid budget response with AI status
    """
    
    calc_start = time.time()
    
    # Generate session ID if not provided
    session_id = x_session_id or str(uuid.uuid4())
    
    try:
        # Clean old cache periodically
        clear_old_cache()
        
        # Calculate trip parameters
        trip_days = calculate_trip_days(request.startDate, request.endDate)
        total_travelers = request.adults + request.children + request.infants
        
        # Get destination tier
        destination_full = f"{request.destinationCity}, {request.destinationCountry}"
        origin_full = f"{request.originCity}, {request.originCountry}"
        dest_tier = get_destination_tier(destination_full)
        
        # ============================================
        # STEP 1: INSTANT FALLBACK CALCULATION
        # ============================================
        
        # Flight costs (fallback)
        flight_range = get_flight_cost_range(origin_full, destination_full)
        avg_flight_per_person = (flight_range["min"] + flight_range["max"]) / 2
        total_flight_fallback = avg_flight_per_person * total_travelers if request.includeFlights else 0
        
        # Hotel costs (fallback)
        hotel_per_night_fallback = HOTEL_COSTS[request.travelStyle][dest_tier]
        total_hotel_fallback = hotel_per_night_fallback * trip_days
        
        # Food costs (fallback)
        food_per_day_fallback = FOOD_COSTS[request.travelStyle][dest_tier]
        total_food_fallback = food_per_day_fallback * total_travelers * trip_days
        
        # Transport costs (fallback)
        transport_per_day_fallback = TRANSPORT_COSTS[request.localTransport][dest_tier]
        total_transport_fallback = transport_per_day_fallback * total_travelers * trip_days
        
        # Activities costs (fallback)
        activities_per_day_fallback = ACTIVITIES_COSTS[request.travelStyle][dest_tier]
        total_activities_fallback = activities_per_day_fallback * total_travelers * trip_days * (ACTIVITY_BUFFER_PERCENT / 100)
        
        # Shopping (fixed estimate)
        shopping_cost = 50 * total_travelers
        
        # Visa
        visa_cost = VISA_COST_USD * total_travelers if request.includeVisa else 0
        
        # Insurance
        insurance_cost = INSURANCE_COST_PER_DAY_USD * trip_days * total_travelers if request.includeInsurance else 0
        
        # Miscellaneous
        subtotal_before_misc = (
            total_flight_fallback + total_hotel_fallback + total_food_fallback +
            total_transport_fallback + total_activities_fallback + shopping_cost +
            visa_cost + insurance_cost
        )
        miscellaneous_cost = subtotal_before_misc * (MISCELLANEOUS_PERCENT / 100)
        
        # Fallback response structure
        fallback_response: Dict[str, Any] = {
            "flight_estimate": {
                "min": flight_range["min"],
                "max": flight_range["max"],
                "average": avg_flight_per_person,
                "source": "fallback"
            },
            "hotel_per_night": {
                "value": hotel_per_night_fallback,
                "source": "fallback"
            },
            "food_per_day": {
                "value": food_per_day_fallback,
                "source": "fallback"
            },
            "transport_per_day": {
                "value": transport_per_day_fallback,
                "source": "fallback"
            },
            "activities_per_day": {
                "value": activities_per_day_fallback,
                "source": "fallback"
            },
            "total_flight_cost": total_flight_fallback,
            "total_hotel_cost": total_hotel_fallback,
            "total_food_cost": total_food_fallback,
            "total_transport_cost": total_transport_fallback,
            "total_activities_cost": total_activities_fallback,
            "shopping_cost": shopping_cost,
            "visa_cost": visa_cost,
            "insurance_cost": insurance_cost,
            "miscellaneous_cost": miscellaneous_cost
        }
        
        # ============================================
        # STEP 2: AI ENHANCEMENT (OPTIONAL, 2s TIMEOUT)
        # ============================================
        
        ai_enhanced = False
        ai_latency = None
        ai_calls_remaining = MAX_AI_CALLS_PER_SESSION - SESSION_AI_CALLS.get(session_id, 0)
        
        # Only attempt AI if rate limit not exceeded
        if check_rate_limit(session_id):
            try:
                ai_result = await enhance_with_ai(
                    origin_city=request.originCity,
                    origin_country=request.originCountry,
                    destination_city=request.destinationCity,
                    destination_country=request.destinationCountry,
                    start_date=str(request.startDate),
                    end_date=str(request.endDate),
                    travelers=total_travelers,
                    travel_style=request.travelStyle,
                    fallback_flight_range=flight_range,
                    fallback_hotel=hotel_per_night_fallback,
                    fallback_food=food_per_day_fallback,
                    timeout_seconds=2  # 2 second timeout
                )
                
                if ai_result:
                    # AI enhancement successful
                    ai_enhanced = True
                    ai_latency = ai_result.get("latency_ms")
                    increment_session_calls(session_id)
                    ai_calls_remaining -= 1
                    
                    # Update response with AI values
                    fallback_response["flight_estimate"] = {
                        "min": ai_result["flight_min"],
                        "max": ai_result["flight_max"],
                        "average": (ai_result["flight_min"] + ai_result["flight_max"]) / 2,
                        "source": "ai",
                        "confidence": ai_result.get("confidence", "medium"),
                        "reasoning": ai_result.get("reasoning", "")
                    }
                    fallback_response["hotel_per_night"] = {
                        "value": ai_result["hotel_per_night"],
                        "source": "ai"
                    }
                    fallback_response["food_per_day"] = {
                        "value": ai_result["food_per_day"],
                        "source": "ai"
                    }
                    
                    # Recalculate totals with AI values
                    avg_flight_ai = (ai_result["flight_min"] + ai_result["flight_max"]) / 2
                    fallback_response["total_flight_cost"] = avg_flight_ai * total_travelers if request.includeFlights else 0
                    fallback_response["total_hotel_cost"] = ai_result["hotel_per_night"] * trip_days
                    fallback_response["total_food_cost"] = ai_result["food_per_day"] * total_travelers * trip_days
                    
                    # Recalculate misc
                    subtotal_before_misc = (
                        fallback_response["total_flight_cost"] + fallback_response["total_hotel_cost"] +
                        fallback_response["total_food_cost"] + fallback_response["total_transport_cost"] +
                        fallback_response["total_activities_cost"] + shopping_cost + visa_cost + insurance_cost
                    )
                    fallback_response["miscellaneous_cost"] = subtotal_before_misc * (MISCELLANEOUS_PERCENT / 100)
                    
                    logger.info(f"AI enhancement applied in {ai_latency}ms")
                
            except Exception as e:
                logger.warning(f"AI enhancement failed: {e}, using fallback")
        
        # ============================================
        # STEP 3: FINAL CALCULATIONS
        # ============================================
        
        subtotal = (
            fallback_response["total_flight_cost"] +
            fallback_response["total_hotel_cost"] +
            fallback_response["total_food_cost"] +
            fallback_response["total_transport_cost"] +
            fallback_response["total_activities_cost"] +
            fallback_response["shopping_cost"] +
            fallback_response["visa_cost"] +
            fallback_response["insurance_cost"] +
            fallback_response["miscellaneous_cost"]
        )
        
        buffer_amount = subtotal * (request.bufferPercentage / 100)
        grand_total = subtotal + buffer_amount
        per_person = grand_total / total_travelers
        per_day = grand_total / trip_days
        
        # Currency conversion
        conversion_rate = CURRENCY_RATES.get(request.homeCurrency, 1.0)
        
        # Apply currency conversion to all amounts
        for key in ["total_flight_cost", "total_hotel_cost", "total_food_cost", 
                    "total_transport_cost", "total_activities_cost", "shopping_cost",
                    "visa_cost", "insurance_cost", "miscellaneous_cost"]:
            fallback_response[key] = fallback_response[key] * conversion_rate
        
        # Convert nested values
        fallback_response["flight_estimate"]["min"] = fallback_response["flight_estimate"]["min"] * conversion_rate
        fallback_response["flight_estimate"]["max"] = fallback_response["flight_estimate"]["max"] * conversion_rate
        fallback_response["flight_estimate"]["average"] = fallback_response["flight_estimate"]["average"] * conversion_rate
        fallback_response["hotel_per_night"]["value"] = fallback_response["hotel_per_night"]["value"] * conversion_rate
        fallback_response["food_per_day"]["value"] = fallback_response["food_per_day"]["value"] * conversion_rate
        fallback_response["transport_per_day"]["value"] = fallback_response["transport_per_day"]["value"] * conversion_rate
        fallback_response["activities_per_day"]["value"] = fallback_response["activities_per_day"]["value"] * conversion_rate
        
        subtotal *= conversion_rate
        buffer_amount *= conversion_rate
        grand_total *= conversion_rate
        per_person *= conversion_rate
        per_day *= conversion_rate
        
        calc_time = (time.time() - calc_start) * 1000  # Convert to ms
        
        # Build response
        response = HybridBudgetResponse(
            **fallback_response,
            subtotal=round(subtotal, 2),
            buffer=round(buffer_amount, 2),
            total_estimated_cost=round(grand_total, 2),
            per_person_cost=round(per_person, 2),
            per_day_cost=round(per_day, 2),
            trip_days=trip_days,
            currency=request.homeCurrency,
            ai_status="ai-enhanced" if ai_enhanced else "fallback",
            fallback_used=not ai_enhanced,
            ai_latency_ms=ai_latency,
            ai_calls_remaining=ai_calls_remaining,
            calculation_time_ms=round(calc_time, 2)
        )
        
        logger.info(f"Hybrid budget calculated in {calc_time:.2f}ms (AI: {ai_enhanced})")
        return response
        
    except Exception as e:
        logger.error(f"Hybrid budget calculation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Budget calculation failed: {str(e)}"
        )


# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint for travel planner service"""
    return {
        "status": "healthy",
        "service": "travel-budget-planner",
        "version": "2.0.0-hybrid"
    }
