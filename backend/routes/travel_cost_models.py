"""
Internal Fallback Cost Models for Travel Budget Planner
These models provide instant estimates without any external API calls
"""

from typing import Dict, Any

# Flight cost ranges by region (in USD)
FLIGHT_COSTS = {
    "domestic": {
        "India": {"min": 50, "max": 150},
        "USA": {"min": 100, "max": 400},
        "Europe": {"min": 80, "max": 300},
        "Middle_East": {"min": 60, "max": 200}
    },
    "regional": {  # Within same continent, neighboring countries
        "Asia": {"min": 150, "max": 400},
        "Europe": {"min": 100, "max": 350},
        "Middle_East": {"min": 120, "max": 300},
        "Americas": {"min": 200, "max": 600}
    },
    "international": {  # Cross-continent
        "Asia_to_Middle_East": {"min": 200, "max": 400},
        "Asia_to_Europe": {"min": 400, "max": 900},
        "Asia_to_Americas": {"min": 600, "max": 1200},
        "Europe_to_Middle_East": {"min": 150, "max": 400},
        "Europe_to_Americas": {"min": 300, "max": 800},
        "Middle_East_to_Europe": {"min": 200, "max": 500},
        "Americas_to_Asia": {"min": 700, "max": 1500}
    }
}

# Hotel costs per night (in USD) by travel style
HOTEL_COSTS = {
    "budget": {
        "low_cost_countries": 15,      # India, Vietnam, Thailand, Philippines
        "mid_cost_countries": 30,      # Mexico, Turkey, Portugal, Poland
        "high_cost_countries": 50,     # USA, Western Europe, Japan
        "premium_destinations": 80     # Dubai, Singapore, Switzerland, Nordic
    },
    "standard": {
        "low_cost_countries": 40,
        "mid_cost_countries": 70,
        "high_cost_countries": 100,
        "premium_destinations": 150
    },
    "luxury": {
        "low_cost_countries": 100,
        "mid_cost_countries": 180,
        "high_cost_countries": 300,
        "premium_destinations": 450
    },
    "ultra-luxury": {
        "low_cost_countries": 250,
        "mid_cost_countries": 400,
        "high_cost_countries": 600,
        "premium_destinations": 1000
    }
}

# Food costs per person per day (in USD)
FOOD_COSTS = {
    "budget": {
        "low_cost_countries": 10,
        "mid_cost_countries": 20,
        "high_cost_countries": 30,
        "premium_destinations": 40
    },
    "standard": {
        "low_cost_countries": 25,
        "mid_cost_countries": 40,
        "high_cost_countries": 60,
        "premium_destinations": 80
    },
    "luxury": {
        "low_cost_countries": 60,
        "mid_cost_countries": 100,
        "high_cost_countries": 150,
        "premium_destinations": 200
    },
    "ultra-luxury": {
        "low_cost_countries": 120,
        "mid_cost_countries": 180,
        "high_cost_countries": 250,
        "premium_destinations": 350
    }
}

# Local transport costs per person per day (in USD)
TRANSPORT_COSTS = {
    "public": {
        "low_cost_countries": 5,
        "mid_cost_countries": 10,
        "high_cost_countries": 15,
        "premium_destinations": 20
    },
    "taxi": {
        "low_cost_countries": 15,
        "mid_cost_countries": 25,
        "high_cost_countries": 40,
        "premium_destinations": 60
    },
    "rental": {
        "low_cost_countries": 30,
        "mid_cost_countries": 50,
        "high_cost_countries": 80,
        "premium_destinations": 120
    },
    "mix": {
        "low_cost_countries": 12,
        "mid_cost_countries": 20,
        "high_cost_countries": 30,
        "premium_destinations": 45
    }
}

# Activities cost per person per day (in USD)
ACTIVITIES_COSTS = {
    "budget": {
        "low_cost_countries": 10,
        "mid_cost_countries": 20,
        "high_cost_countries": 30,
        "premium_destinations": 40
    },
    "standard": {
        "low_cost_countries": 25,
        "mid_cost_countries": 40,
        "high_cost_countries": 60,
        "premium_destinations": 80
    },
    "luxury": {
        "low_cost_countries": 60,
        "mid_cost_countries": 100,
        "high_cost_countries": 150,
        "premium_destinations": 200
    },
    "ultra-luxury": {
        "low_cost_countries": 150,
        "mid_cost_countries": 250,
        "high_cost_countries": 400,
        "premium_destinations": 600
    }
}

# Country/City classification
COUNTRY_CLASSIFICATION = {
    "low_cost_countries": [
        "india", "delhi", "mumbai", "bangalore", "goa", "kolkata", "chennai",
        "vietnam", "hanoi", "ho chi minh",
        "thailand", "bangkok", "phuket", "chiang mai",
        "indonesia", "bali", "jakarta",
        "philippines", "manila", "cebu",
        "cambodia", "phnom penh", "siem reap",
        "sri lanka", "colombo",
        "nepal", "kathmandu",
        "egypt", "cairo",
        "morocco", "marrakech"
    ],
    "mid_cost_countries": [
        "mexico", "mexico city", "cancun",
        "turkey", "istanbul", "antalya",
        "portugal", "lisbon", "porto",
        "poland", "warsaw", "krakow",
        "greece", "athens", "santorini",
        "spain", "barcelona", "madrid", "seville",
        "italy", "rome", "venice", "florence", "milan",
        "malaysia", "kuala lumpur",
        "south korea", "seoul", "busan",
        "taiwan", "taipei"
    ],
    "high_cost_countries": [
        "usa", "new york", "los angeles", "san francisco", "chicago", "miami", "las vegas",
        "uk", "london", "edinburgh",
        "france", "paris", "nice",
        "germany", "berlin", "munich",
        "netherlands", "amsterdam",
        "austria", "vienna",
        "belgium", "brussels",
        "japan", "tokyo", "kyoto", "osaka",
        "australia", "sydney", "melbourne",
        "canada", "toronto", "vancouver"
    ],
    "premium_destinations": [
        "dubai", "abu dhabi",
        "singapore",
        "switzerland", "zurich", "geneva",
        "norway", "oslo",
        "sweden", "stockholm",
        "denmark", "copenhagen",
        "iceland", "reykjavik",
        "hong kong",
        "maldives", "male",
        "seychelles"
    ]
}

# Region mapping for flights
REGION_MAP = {
    "Asia": ["india", "china", "japan", "korea", "thailand", "vietnam", "indonesia", "malaysia", "singapore", "philippines", "taiwan", "hong kong"],
    "Middle_East": ["dubai", "uae", "qatar", "saudi arabia", "oman", "bahrain", "kuwait", "abu dhabi", "doha"],
    "Europe": ["uk", "france", "germany", "italy", "spain", "portugal", "netherlands", "belgium", "switzerland", "austria", "greece", "norway", "sweden", "denmark", "iceland"],
    "Americas": ["usa", "canada", "mexico", "brazil", "argentina", "chile"],
    "Oceania": ["australia", "new zealand"],
    "Africa": ["south africa", "egypt", "morocco", "kenya", "tanzania"]
}

# Buffers
ACTIVITY_BUFFER_PERCENT = 80  # Activities happen 80% of days
MISCELLANEOUS_PERCENT = 10    # 10% of subtotal for misc expenses
VISA_COST_USD = 100           # Average visa cost
INSURANCE_COST_PER_DAY_USD = 5  # Travel insurance per day


def get_destination_tier(destination: str) -> str:
    """Classify destination into cost tier"""
    destination_lower = destination.lower()
    
    for tier, places in COUNTRY_CLASSIFICATION.items():
        if any(place in destination_lower for place in places):
            return tier
    
    return "mid_cost_countries"  # Default


def get_flight_region(location: str) -> str:
    """Get region for flight cost calculation"""
    location_lower = location.lower()
    
    for region, places in REGION_MAP.items():
        if any(place in location_lower for place in places):
            return region
    
    return "Asia"  # Default


def get_flight_cost_range(origin: str, destination: str) -> Dict[str, int]:
    """Get flight cost range based on origin and destination"""
    origin_region = get_flight_region(origin)
    dest_region = get_flight_region(destination)
    
    # Check if domestic
    if origin_region == dest_region:
        origin_lower = origin.lower()
        for region_name, countries in REGION_MAP.items():
            if any(country in origin_lower for country in countries):
                if region_name in ["Asia", "Middle_East", "Europe", "Americas"]:
                    # Find country-specific if exists
                    for country_key in FLIGHT_COSTS["domestic"]:
                        if country_key.lower() in origin_lower:
                            return FLIGHT_COSTS["domestic"][country_key]
                    # Default to regional
                    if region_name in FLIGHT_COSTS["regional"]:
                        return FLIGHT_COSTS["regional"][region_name]
    
    # International flight
    route_key = f"{origin_region}_to_{dest_region}"
    if route_key in FLIGHT_COSTS["international"]:
        return FLIGHT_COSTS["international"][route_key]
    
    # Try reverse route
    reverse_route = f"{dest_region}_to_{origin_region}"
    if reverse_route in FLIGHT_COSTS["international"]:
        return FLIGHT_COSTS["international"][reverse_route]
    
    # Default international
    return {"min": 400, "max": 800}
