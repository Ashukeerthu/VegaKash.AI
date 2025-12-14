"""
Pricing prompt template for travel budget calculation.
Extracted to reduce main route file clutter and improve maintainability.
"""

def get_pricing_prompt(request_data: dict) -> str:
    """
    Build the pricing prompt for OpenAI function calling.
    Returns a string ready for system message or user message.
    """
    origin_city = request_data.get("originCity", "")
    origin_country = request_data.get("originCountry", "")
    destination_city = request_data.get("destinationCity", "")
    destination_country = request_data.get("destinationCountry", "")
    start_date = request_data.get("startDate", "")
    end_date = request_data.get("endDate", "")
    trip_days = request_data.get("trip_days", 1)
    nights = request_data.get("nights", 0)
    adults = request_data.get("adults", 1)
    children = request_data.get("children", 0)
    infants = request_data.get("infants", 0)
    travel_style = request_data.get("travel_style", "moderate")
    trip_themes = request_data.get("trip_themes", ["sightseeing"])
    local_transport = request_data.get("local_transport", "mixed")
    currency = request_data.get("currency", "USD")
    is_domestic = request_data.get("is_domestic", False)
    include_flights = request_data.get("include_flights", True)
    include_visa = request_data.get("include_visa", False)
    include_insurance = request_data.get("include_insurance", True)

    prompt = f"""
You are an expert travel pricing analyst. Provide realistic, region-aware pricing for this trip.

TRIP DETAILS:
- From: {origin_city}, {origin_country}
- To: {destination_city}, {destination_country}
- Dates: {start_date} to {end_date} ({trip_days} days, {nights} nights)
- Travelers: {adults} adults, {children} children, {infants} infants
- Travel Style: {travel_style}
- Trip Themes: {', '.join(trip_themes)}
- Local Transport Mode: {local_transport}
- Currency: {currency}
- Trip Type: {'DOMESTIC' if is_domestic else 'INTERNATIONAL'}
- Include Flights: {'YES' if include_flights else 'NO'}
- Include Visa: {'YES' if include_visa else 'NO'}
- Include Insurance: {'YES' if include_insurance else 'NO'}

PRICING GUIDELINES:
1. Base prices on region:
   - North America/Western Europe/Australia: HIGH (1.5-2.0x baseline)
   - Eastern Europe/Latin America: MEDIUM (0.8-1.2x baseline)
   - Asia (India/Southeast Asia): LOW (0.5-0.8x baseline)
   - Middle East: MEDIUM-HIGH (1.0-1.5x baseline)

2. Adjust for travel style:
   - Budget: -40% from baseline
   - Standard/Moderate: baseline
   - Luxury: +50–100% from baseline

3. Domestic flights are typically 50–70% cheaper than international equivalents.

4. Never return null values. For optional fields:
   - If not applicable, return empty string "" for text
   - Return 0 for numbers

5. For miscellaneous_percentage, valid range is 0–20 (we will clamp it).

RETURN the following prices (per-unit, backend will calculate totals):
- flight_cost_per_person: roundtrip flight cost per person ({currency}). If no flights included, return 0.
- accommodation_cost_per_night: per room per night ({currency})
- food_cost_per_day_per_person: per person per day ({currency})
- local_transport_cost_per_day_per_person: per person per day ({currency})
- activities_cost_per_day_per_person: per person per day ({currency})
- shopping_cost_per_day_per_person: per person per day ({currency})
- visa_type: visa requirement category (e.g., "Visa-free", "Tourist visa", "eVisa") or empty string ""
- visa_guidance: brief visa notes or empty string ""
- insurance_cost_per_person: per person (flat or daily, clarify in notes) or 0
- miscellaneous_percentage: 0–20 percent (will be clamped)
- notes: brief summary or empty string ""

Ensure all numeric values are realistic and within expected ranges for the region and style.
"""
    return prompt
