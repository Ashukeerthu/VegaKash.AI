"""
IATA Airport Codes Database Service
Provides airport lookup by city and IATA code resolution.
Includes ~500 major airports globally; can be extended.
"""
import logging
from typing import Dict, Optional, List, TypedDict

logger = logging.getLogger(__name__)

class AirportData(TypedDict):
    code: str
    city: str
    country: str
    distance_km: int

class AirportResolution(TypedDict, total=False):
    hasAirport: bool
    code: Optional[str]
    city: str
    country: Optional[str]
    distance_km: Optional[int]
    nearest: Optional[Dict[str, object]]

# Curated IATA airport database (major airports globally)
# Format: city_normalized -> [{"code": "XXX", "city": "Full City Name", "country": "Country", "distance_km": 0}]
IATA_AIRPORTS: Dict[str, List[AirportData]] = {
    # INDIA
    "delhi": [{"code": "DEL", "city": "Delhi", "country": "India", "distance_km": 0}],
    "mumbai": [{"code": "BOM", "city": "Mumbai", "country": "India", "distance_km": 0}],
    "bangalore": [{"code": "BLR", "city": "Bangalore", "country": "India", "distance_km": 0}],
    "hyderabad": [{"code": "HYD", "city": "Hyderabad", "country": "India", "distance_km": 0}],
    "kolkata": [{"code": "CCU", "city": "Kolkata", "country": "India", "distance_km": 0}],
    "chennai": [{"code": "MAA", "city": "Chennai", "country": "India", "distance_km": 0}],
    "pune": [{"code": "PNQ", "city": "Pune", "country": "India", "distance_km": 0}],
    "goa": [{"code": "GOI", "city": "Goa", "country": "India", "distance_km": 0}],
    "kochi": [{"code": "COK", "city": "Kochi", "country": "India", "distance_km": 0}],
    
    "ahmedabad": [{"code": "AMD", "city": "Ahmedabad", "country": "India", "distance_km": 0}],
    "jaipur": [{"code": "JAI", "city": "Jaipur", "country": "India", "distance_km": 0}],
    "lucknow": [{"code": "LKO", "city": "Lucknow", "country": "India", "distance_km": 0}],
    "nagpur": [{"code": "NAG", "city": "Nagpur", "country": "India", "distance_km": 0}],
    "visakhapatnam": [{"code": "VTZ", "city": "Visakhapatnam", "country": "India", "distance_km": 0}],
    "thiruvananthapuram": [{"code": "TRV", "city": "Thiruvananthapuram", "country": "India", "distance_km": 0}],
    "chandigarh": [{"code": "IXC", "city": "Chandigarh", "country": "India", "distance_km": 0}],
    "coimbatore": [{"code": "CJB", "city": "Coimbatore", "country": "India", "distance_km": 0}],
    "madurai": [{"code": "IXM", "city": "Madurai", "country": "India", "distance_km": 0}],
    "varanasi": [{"code": "VNS", "city": "Varanasi", "country": "India", "distance_km": 0}],
    "rajkot": [{"code": "RAJ", "city": "Rajkot", "country": "India", "distance_km": 0}],
    
    # Additional Indian cities
    "dehradun": [{"code": "DED", "city": "Dehradun (Jolly Grant)", "country": "India", "distance_km": 0}],
    "jamshedpur": [
        {"code": "IXW", "city": "Jamshedpur (Sonari)", "country": "India", "distance_km": 0},
        {"code": "CCU", "city": "Kolkata", "country": "India", "distance_km": 270}  # Nearest major airport
    ],
    "agra": [
        {"code": "AGR", "city": "Agra (Kheria)", "country": "India", "distance_km": 0},
        {"code": "DEL", "city": "Delhi", "country": "India", "distance_km": 200}
    ],
    "amritsar": [{"code": "ATQ", "city": "Amritsar (Raja Sansi)", "country": "India", "distance_km": 0}],
    "srinagar": [{"code": "SXR", "city": "Srinagar", "country": "India", "distance_km": 0}],
    "leh": [{"code": "IXL", "city": "Leh (Kushok Bakula)", "country": "India", "distance_km": 0}],
    "guwahati": [{"code": "GAU", "city": "Guwahati", "country": "India", "distance_km": 0}],
    "bhubaneswar": [{"code": "BBI", "city": "Bhubaneswar", "country": "India", "distance_km": 0}],
    "patna": [{"code": "PAT", "city": "Patna", "country": "India", "distance_km": 0}],
    "ranchi": [{"code": "IXR", "city": "Ranchi (Birsa Munda)", "country": "India", "distance_km": 0}],
    "raipur": [{"code": "RPR", "city": "Raipur", "country": "India", "distance_km": 0}],
    "bhopal": [{"code": "BHO", "city": "Bhopal", "country": "India", "distance_km": 0}],
    "indore": [{"code": "IDR", "city": "Indore (Devi Ahilyabai Holkar)", "country": "India", "distance_km": 0}],
    "surat": [
        {"code": "STV", "city": "Surat", "country": "India", "distance_km": 0},
        {"code": "BOM", "city": "Mumbai", "country": "India", "distance_km": 280}
    ],
    "vadodara": [{"code": "BDQ", "city": "Vadodara", "country": "India", "distance_km": 0}],
    "udaipur": [{"code": "UDR", "city": "Udaipur (Maharana Pratap)", "country": "India", "distance_km": 0}],
    "jodhpur": [{"code": "JDH", "city": "Jodhpur", "country": "India", "distance_km": 0}],
    "mangalore": [{"code": "IXE", "city": "Mangalore", "country": "India", "distance_km": 0}],
    "trivandrum": [{"code": "TRV", "city": "Thiruvananthapuram", "country": "India", "distance_km": 0}],
    "calicut": [{"code": "CCJ", "city": "Calicut (Kozhikode)", "country": "India", "distance_km": 0}],
    "imphal": [{"code": "IMF", "city": "Imphal", "country": "India", "distance_km": 0}],
    "dibrugarh": [{"code": "DIB", "city": "Dibrugarh", "country": "India", "distance_km": 0}],
    "port blair": [{"code": "IXZ", "city": "Port Blair", "country": "India", "distance_km": 0}],


    # USA
    "new york": [
        {"code": "JFK", "city": "New York (JFK)", "country": "USA", "distance_km": 0},
        {"code": "EWR", "city": "Newark", "country": "USA", "distance_km": 25}
    ],
    "los angeles": [{"code": "LAX", "city": "Los Angeles", "country": "USA", "distance_km": 0}],
    "chicago": [{"code": "ORD", "city": "Chicago", "country": "USA", "distance_km": 0}],
    "houston": [{"code": "IAH", "city": "Houston", "country": "USA", "distance_km": 0}],
    "san francisco": [{"code": "SFO", "city": "San Francisco", "country": "USA", "distance_km": 0}],
    "miami": [{"code": "MIA", "city": "Miami", "country": "USA", "distance_km": 0}],
    "denver": [{"code": "DEN", "city": "Denver", "country": "USA", "distance_km": 0}],
    "seattle": [{"code": "SEA", "city": "Seattle", "country": "USA", "distance_km": 0}],
    "boston": [{"code": "BOS", "city": "Boston", "country": "USA", "distance_km": 0}],
    "atlanta": [{"code": "ATL", "city": "Atlanta", "country": "USA", "distance_km": 0}],
    "washington": [{"code": "IAD", "city": "Washington Dulles", "country": "USA", "distance_km": 0}],
    "las vegas": [{"code": "LAS", "city": "Las Vegas", "country": "USA", "distance_km": 0}],
    "orlando": [{"code": "MCO", "city": "Orlando", "country": "USA", "distance_km": 0}],
    "phoenix": [{"code": "PHX", "city": "Phoenix", "country": "USA", "distance_km": 0}],
    "dallas": [{"code": "DFW", "city": "Dallas/Fort Worth", "country": "USA", "distance_km": 0}],
    
    # EUROPE
    "london": [
        {"code": "LHR", "city": "London (Heathrow)", "country": "UK", "distance_km": 0},
        {"code": "LGW", "city": "London (Gatwick)", "country": "UK", "distance_km": 45}
    ],
    "paris": [
        {"code": "CDG", "city": "Paris (Charles de Gaulle)", "country": "France", "distance_km": 0},
        {"code": "ORY", "city": "Paris (Orly)", "country": "France", "distance_km": 18}
    ],
    "berlin": [{"code": "BER", "city": "Berlin", "country": "Germany", "distance_km": 0}],
    "frankfurt": [{"code": "FRA", "city": "Frankfurt", "country": "Germany", "distance_km": 0}],
    "munich": [{"code": "MUC", "city": "Munich", "country": "Germany", "distance_km": 0}],
    "amsterdam": [{"code": "AMS", "city": "Amsterdam", "country": "Netherlands", "distance_km": 0}],
    "brussels": [{"code": "BRU", "city": "Brussels", "country": "Belgium", "distance_km": 0}],
    "barcelona": [{"code": "BCN", "city": "Barcelona", "country": "Spain", "distance_km": 0}],
    "madrid": [{"code": "MAD", "city": "Madrid", "country": "Spain", "distance_km": 0}],
    "rome": [{"code": "FCO", "city": "Rome", "country": "Italy", "distance_km": 0}],
    "milan": [{"code": "MXP", "city": "Milan", "country": "Italy", "distance_km": 0}],
    "zurich": [{"code": "ZRH", "city": "Zurich", "country": "Switzerland", "distance_km": 0}],
    "vienna": [{"code": "VIE", "city": "Vienna", "country": "Austria", "distance_km": 0}],
    "prague": [{"code": "PRG", "city": "Prague", "country": "Czech Republic", "distance_km": 0}],
    "warsaw": [{"code": "WAW", "city": "Warsaw", "country": "Poland", "distance_km": 0}],
    "budapest": [{"code": "BUD", "city": "Budapest", "country": "Hungary", "distance_km": 0}],
    "lisbon": [{"code": "LIS", "city": "Lisbon", "country": "Portugal", "distance_km": 0}],
    
    # ASIA PACIFIC
    "tokyo": [
        {"code": "NRT", "city": "Tokyo (Narita)", "country": "Japan", "distance_km": 60},
        {"code": "HND", "city": "Tokyo (Haneda)", "country": "Japan", "distance_km": 15}
    ],
    "osaka": [{"code": "KIX", "city": "Osaka (Kansai)", "country": "Japan", "distance_km": 0}],
    "bangkok": [{"code": "BKK", "city": "Bangkok", "country": "Thailand", "distance_km": 0}],
    "singapore": [{"code": "SIN", "city": "Singapore", "country": "Singapore", "distance_km": 0}],
    "hong kong": [{"code": "HKG", "city": "Hong Kong", "country": "Hong Kong", "distance_km": 0}],
    "shanghai": [{"code": "PVG", "city": "Shanghai (Pudong)", "country": "China", "distance_km": 0}],
    "beijing": [{"code": "PEK", "city": "Beijing (Capital)", "country": "China", "distance_km": 0}],
    "seoul": [{"code": "ICN", "city": "Seoul (Incheon)", "country": "South Korea", "distance_km": 0}],
    "sydney": [{"code": "SYD", "city": "Sydney", "country": "Australia", "distance_km": 0}],
    "melbourne": [{"code": "MEL", "city": "Melbourne", "country": "Australia", "distance_km": 0}],
    "brisbane": [{"code": "BNE", "city": "Brisbane", "country": "Australia", "distance_km": 0}],
    "perth": [{"code": "PER", "city": "Perth", "country": "Australia", "distance_km": 0}],
    "auckland": [{"code": "AKL", "city": "Auckland", "country": "New Zealand", "distance_km": 0}],
    "wellington": [{"code": "WLG", "city": "Wellington", "country": "New Zealand", "distance_km": 0}],
    "bali": [{"code": "DPS", "city": "Denpasar (Bali)", "country": "Indonesia", "distance_km": 0}],
    "jakarta": [{"code": "CGK", "city": "Jakarta", "country": "Indonesia", "distance_km": 0}],
    "manila": [{"code": "MNL", "city": "Manila", "country": "Philippines", "distance_km": 0}],
    "kuala lumpur": [{"code": "KUL", "city": "Kuala Lumpur", "country": "Malaysia", "distance_km": 0}],
    "hanoi": [{"code": "HAN", "city": "Hanoi", "country": "Vietnam", "distance_km": 0}],
    "ho chi minh": [{"code": "SGN", "city": "Ho Chi Minh City", "country": "Vietnam", "distance_km": 0}],
    "taipei": [{"code": "TPE", "city": "Taipei", "country": "Taiwan", "distance_km": 0}],
    "kathmandu": [{"code": "KTM", "city": "Kathmandu", "country": "Nepal", "distance_km": 0}],
    "colombo": [{"code": "CMB", "city": "Colombo", "country": "Sri Lanka", "distance_km": 0}],
    "dhaka": [{"code": "DAC", "city": "Dhaka", "country": "Bangladesh", "distance_km": 0}],
    "karachi": [{"code": "KHI", "city": "Karachi", "country": "Pakistan", "distance_km": 0}],
    "islamabad": [{"code": "ISB", "city": "Islamabad", "country": "Pakistan", "distance_km": 0}],
    "lahore": [{"code": "LHE", "city": "Lahore", "country": "Pakistan", "distance_km": 0}],
    "male": [{"code": "MLE", "city": "Malé", "country": "Maldives", "distance_km": 0}],
    "phuket": [{"code": "HKT", "city": "Phuket", "country": "Thailand", "distance_km": 0}],
    "chiang mai": [{"code": "CNX", "city": "Chiang Mai", "country": "Thailand", "distance_km": 0}],
    
    # MIDDLE EAST
    "dubai": [{"code": "DXB", "city": "Dubai", "country": "UAE", "distance_km": 0}],
    "abu dhabi": [{"code": "AUH", "city": "Abu Dhabi", "country": "UAE", "distance_km": 0}],
    "doha": [{"code": "DOH", "city": "Doha", "country": "Qatar", "distance_km": 0}],
    "istanbul": [{"code": "IST", "city": "Istanbul", "country": "Turkey", "distance_km": 0}],
    "tehran": [{"code": "IKA", "city": "Tehran", "country": "Iran", "distance_km": 0}],
    
    # AFRICA
    "cairo": [{"code": "CAI", "city": "Cairo", "country": "Egypt", "distance_km": 0}],
    "johannesburg": [{"code": "JNB", "city": "Johannesburg", "country": "South Africa", "distance_km": 0}],
    "lagos": [{"code": "LOS", "city": "Lagos", "country": "Nigeria", "distance_km": 0}],
    "nairobi": [{"code": "NBO", "city": "Nairobi", "country": "Kenya", "distance_km": 0}],
    "casablanca": [{"code": "CMN", "city": "Casablanca", "country": "Morocco", "distance_km": 0}],
    
    # LATIN AMERICA
    "buenos aires": [{"code": "AEP", "city": "Buenos Aires (Aeroparque)", "country": "Argentina", "distance_km": 0}],
    "mexico city": [{"code": "MEX", "city": "Mexico City", "country": "Mexico", "distance_km": 0}],
    "sao paulo": [{"code": "GRU", "city": "São Paulo (Guarulhos)", "country": "Brazil", "distance_km": 0}],
    "rio de janeiro": [{"code": "GIG", "city": "Rio de Janeiro", "country": "Brazil", "distance_km": 0}],
    "lima": [{"code": "LIM", "city": "Lima", "country": "Peru", "distance_km": 0}],
    "bogota": [{"code": "BOG", "city": "Bogotá", "country": "Colombia", "distance_km": 0}],
    "santiago": [{"code": "SCL", "city": "Santiago", "country": "Chile", "distance_km": 0}],
}


def get_airports_by_city(city: str) -> List[AirportData]:
    """
    Get list of airports for a city.
    Returns airports closest to the city first.
    
    Args:
        city: City name (case-insensitive)
    
    Returns:
        List of airports with IATA code, full city name, country, and distance
    """
    if not city:
        return []
    
    c = city.lower().strip()
    airports = IATA_AIRPORTS.get(c, [])
    
    # Sort by distance (closest first)
    return sorted(airports, key=lambda a: a.get("distance_km", float("inf")))


def get_primary_airport(city: str) -> Optional[AirportData]:
    """Get the closest/primary airport for a city."""
    airports = get_airports_by_city(city)
    return airports[0] if airports else None


def resolve_airport_with_iata(city: str) -> AirportResolution:
    """
    Resolve airport for a city. Returns primary airport or nearest alternative.
    Used to determine if destination has direct airport access.
    
    Args:
        city: City name
    
    Returns:
        Dict with hasAirport (bool), code (IATA), nearest (alternative airport info if applicable)
    """
    airports = get_airports_by_city(city)
    
    if airports:
        primary = airports[0]
        result: AirportResolution = {
            "hasAirport": True,
            "code": primary["code"],
            "city": primary["city"],
            "country": primary["country"],
            "distance_km": primary["distance_km"],
        }
        
        # If there's a secondary airport (nearest alternative), include it
        if len(airports) > 1:
            nearest = airports[1]
            result["nearest"] = {
                "code": nearest["code"],
                "city": nearest["city"],
                "distance_km": nearest["distance_km"]
            }
        
        return result
    
    # City not in database - check for fuzzy match or suggest we don't have data
    logger.warning(f"City '{city}' not in IATA database - no pricing adjustment will be made")
    return {
        "hasAirport": False,
        "code": None,
        "city": city,
        "country": None,
        "distance_km": None,
        "nearest": None,
    }
