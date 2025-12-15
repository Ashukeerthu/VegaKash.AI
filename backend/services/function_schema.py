"""
OpenAI Function Calling Schema Definitions
Ensures JSON responses from Claude/OpenAI are guaranteed to be valid.
Uses structured output with Pydantic models.
"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any


class PricingBreakdown(BaseModel):
    """Structured pricing breakdown for travel budget."""
    
    flight_cost_per_person: float = Field(
        ..., 
        description="Flight cost per person in USD. If flights not included, set to 0.",
        ge=0,
        le=10000
    )
    accommodation_cost_per_night: float = Field(
        ...,
        description="Accommodation cost per night per person in USD.",
        ge=0,
        le=2000
    )
    food_cost_per_day_per_person: float = Field(
        ...,
        description="Food cost per day per person in USD.",
        ge=0,
        le=500
    )
    local_transport_cost_per_day_per_person: float = Field(
        ...,
        description="Local transport cost per day per person in USD.",
        ge=0,
        le=300
    )
    activities_cost_per_day_per_person: float = Field(
        ...,
        description="Activities and attractions cost per day per person in USD.",
        ge=0,
        le=500
    )
    shopping_cost_per_day_per_person: float = Field(
        ...,
        description="Shopping and souvenirs cost per day per person in USD.",
        ge=0,
        le=300
    )
    visa_type: str = Field(
        ...,
        description="Visa type required: 'exempt', 'on-arrival', 'tourist', 'e-visa', or 'embassy'.",
        min_length=1,
        max_length=50
    )
    visa_guidance: str = Field(
        ...,
        description="Brief guidance on visa application process and typical processing time.",
        min_length=1,
        max_length=500
    )
    insurance_cost_per_person: float = Field(
        ...,
        description="Travel insurance cost per person in USD.",
        ge=0,
        le=500
    )
    miscellaneous_percentage: float = Field(
        default=10,
        description="Miscellaneous expenses as percentage (10-20% recommended).",
        ge=0,
        le=20
    )
    notes: str = Field(
        default="",
        description="Additional notes or pricing assumptions.",
        max_length=500
    )
    
    @field_validator("visa_type")
    @classmethod
    def validate_visa_type(cls, v: str) -> str:
        """Ensure visa_type is one of expected values."""
        allowed = {"exempt", "on-arrival", "tourist", "e-visa", "embassy"}
        if v.lower() not in allowed:
            return "tourist"  # Default fallback
        return v.lower()
    
    @field_validator("miscellaneous_percentage")
    @classmethod
    def clamp_misc_percentage(cls, v: float) -> float:
        """Ensure miscellaneous_percentage is in valid range."""
        return max(0, min(20, v))


class ItineraryActivity(BaseModel):
    """A single activity in the itinerary."""
    time: str = Field(..., description="Time of activity (e.g., '09:00 AM')")
    activity: str = Field(..., description="Activity description")
    duration: str = Field(..., description="Duration of activity (e.g., '2 hours')")
    cost: float = Field(default=0, description="Cost in USD", ge=0)


class ItineraryDay(BaseModel):
    """A single day in the itinerary."""
    day: int = Field(..., description="Day number (1, 2, 3...)", ge=1)
    title: str = Field(..., description="Day title/theme")
    activities: List[ItineraryActivity] = Field(default=[])
    summary: str = Field(..., description="Brief summary of the day")


class OptimizationResult(BaseModel):
    """Optimization recommendations for travel budget."""
    total_daily_budget: float = Field(..., description="Recommended daily budget in USD", ge=0)
    cost_saving_opportunities: List[str] = Field(
        default_factory=list,
        description="List of cost-saving suggestions"
    )
    best_time_to_visit: str = Field(
        default="",
        description="Best season/time to visit based on budget"
    )
    estimated_total_cost: float = Field(
        ...,
        description="Estimated total cost for entire trip in USD",
        ge=0
    )


def get_pricing_function_schema() -> Dict[str, Any]:
    """
    Get OpenAI function schema for pricing breakdown.
    Used with functions parameter in chat completion API.
    """
    return {
        "name": "calculate_travel_pricing",
        "description": "Calculate detailed travel pricing breakdown for a trip",
        "parameters": PricingBreakdown.model_json_schema()
    }


def get_itinerary_function_schema() -> Dict[str, Any]:
    """
    Get OpenAI function schema for itinerary generation.
    """
    schema: Dict[str, Any] = {
        "name": "generate_travel_itinerary",
        "description": "Generate detailed day-by-day itinerary for a trip",
        "parameters": {
            "type": "object",
            "properties": {
                "days": {
                    "type": "array",
                    "items": ItineraryDay.model_json_schema(),
                    "description": "Array of itinerary days"
                }
            },
            "required": ["days"]
        }
    }
    return schema


def get_optimization_function_schema() -> Dict[str, Any]:
    """
    Get OpenAI function schema for budget optimization.
    """
    return {
        "name": "optimize_budget",
        "description": "Provide optimization recommendations for travel budget",
        "parameters": OptimizationResult.model_json_schema()
    }
