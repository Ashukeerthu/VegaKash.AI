"""
Region-aware pricing service for travel budgets.
Provides dynamic fallback pricing based on origin/destination regions.
"""
from typing import Dict, Any

# Regional pricing multipliers (base = 1.0)
REGION_MULTIPLIERS = {
    "north_america": 1.8,
    "western_europe": 1.8,
    "australia": 1.7,
    "eastern_europe": 1.0,
    "latin_america": 1.0,
    "asia": 0.6,  # India, SE Asia
    "japan_korea": 1.5,
    "middle_east": 1.2,
    "africa": 0.7,
}

# City to region mapping
CITY_REGIONS = {
    "delhi": "asia",
    "mumbai": "asia",
    "bangalore": "asia",
    "siliguri": "asia",
    "goa": "asia",
    "new york": "north_america",
    "los angeles": "north_america",
    "chicago": "north_america",
    "london": "western_europe",
    "paris": "western_europe",
    "berlin": "western_europe",
    "barcelona": "western_europe",
    "prague": "eastern_europe",
    "warsaw": "eastern_europe",
    "buenos aires": "latin_america",
    "mexico city": "latin_america",
    "bangkok": "asia",
    "singapore": "asia",
    "bali": "asia",
    "tokyo": "japan_korea",
    "seoul": "japan_korea",
    "dubai": "middle_east",
    "sydney": "australia",
    "melbourne": "australia",
    "cairo": "africa",
    "johannesburg": "africa",
}

# Base pricing tiers (before regional multipliers)
BASE_PRICES = {
    "budget": {
        "flights_domestic": 100,
        "flights_international": 400,
        "accommodation": 30,
        "food": 12,
        "transport": 4,
        "activities": 8,
        "shopping": 5,
    },
    "standard": {
        "flights_domestic": 150,
        "flights_international": 600,
        "accommodation": 70,
        "food": 30,
        "transport": 8,
        "activities": 25,
        "shopping": 10,
    },
    "moderate": {
        "flights_domestic": 150,
        "flights_international": 600,
        "accommodation": 70,
        "food": 30,
        "transport": 8,
        "activities": 25,
        "shopping": 10,
    },
    "luxury": {
        "flights_domestic": 250,
        "flights_international": 1200,
        "accommodation": 200,
        "food": 80,
        "transport": 20,
        "activities": 60,
        "shopping": 30,
    },
}

# Travel style multipliers
STYLE_MULTIPLIERS = {
    "budget": 0.6,
    "standard": 1.0,
    "moderate": 1.0,
    "luxury": 1.5,
}


def get_region(city: str) -> str:
    """Determine region from city name. Default to 'asia' if unknown."""
    c = (city or "").lower().strip()
    return CITY_REGIONS.get(c, "asia")


def get_regional_multiplier(origin_city: str, destination_city: str) -> float:
    """
    Calculate average regional multiplier based on origin and destination.
    Destination weighted more heavily (70%).
    """
    dest_region = get_region(destination_city)
    origin_region = get_region(origin_city)
    
    dest_mult = REGION_MULTIPLIERS.get(dest_region, 1.0)
    origin_mult = REGION_MULTIPLIERS.get(origin_region, 1.0)
    
    # Destination weighted 70%, origin 30%
    avg_mult = (dest_mult * 0.7) + (origin_mult * 0.3)
    return max(0.4, min(2.5, avg_mult))  # Clamp between 0.4 and 2.5


def get_dynamic_fallback_estimates(
    origin_city: str,
    destination_city: str,
    travel_style: str,
    trip_days: int,
    nights: int,
    total_travelers: int,
    is_domestic: bool,
    include_flights: bool,
) -> Dict[str, Any]:
    """
    Generate region-aware fallback pricing.
    
    Args:
        origin_city: Origin city name
        destination_city: Destination city name
        travel_style: 'budget', 'standard', 'moderate', 'luxury'
        trip_days: Number of days
        nights: Number of nights
        total_travelers: Total number of travelers
        is_domestic: Whether trip is domestic
        include_flights: Whether flights are included
    
    Returns:
        Dict with pricing broken down by category
    """
    style = (travel_style or "moderate").lower()
    base = BASE_PRICES.get(style, BASE_PRICES["moderate"])
    style_mult = STYLE_MULTIPLIERS.get(style, 1.0)
    region_mult = get_regional_multiplier(origin_city, destination_city)
    
    # Determine flight type
    flight_key = "flights_domestic" if is_domestic else "flights_international"
    
    # Calculate unit prices with regional and style multipliers
    flight_cost = base[flight_key] * style_mult * region_mult if include_flights else 0
    accommodation = base["accommodation"] * style_mult * region_mult
    food = base["food"] * style_mult * region_mult
    transport = base["transport"] * style_mult * region_mult
    activities = base["activities"] * style_mult * region_mult
    shopping = base["shopping"] * style_mult * region_mult
    
    return {
        "flight_cost_per_person": round(flight_cost, 2),
        "accommodation_cost_per_night": round(accommodation, 2),
        "food_cost_per_day_per_person": round(food, 2),
        "local_transport_cost_per_day_per_person": round(transport, 2),
        "activities_cost_per_day_per_person": round(activities, 2),
        "shopping_cost_per_day_per_person": round(shopping, 2),
        "visa_type": None,
        "visa_guidance": f"Check visa requirements for {origin_city} to {destination_city}",
        "insurance_cost_per_person": 20.0,
        "miscellaneous_percentage": 7,
        "notes": f"Dynamic fallback pricing for {travel_style} travel. Region multiplier: {region_mult:.2f}x",
    }
