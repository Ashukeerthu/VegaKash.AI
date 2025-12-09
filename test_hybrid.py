"""
Test Hybrid AI + Fallback Architecture
Tests instant response with optional AI enhancement
"""

import requests
import json
import time

url = "http://localhost:8000/api/v1/ai/travel/calculate-budget-hybrid"

test_data = {
    "originCity": "Delhi",
    "originCountry": "India",
    "destinationCity": "Dubai",
    "destinationCountry": "United Arab Emirates",
    "additionalDestinations": "",
    "startDate": "2025-12-20",
    "endDate": "2025-12-26",
    "adults": 2,
    "children": 0,
    "infants": 0,
    "travelStyle": "standard",
    "tripTheme": ["beaches", "food"],
    "localTransport": "mix",
    "homeCurrency": "INR",
    "includeFlights": True,
    "includeVisa": False,
    "includeInsurance": True,
    "bufferPercentage": 10
}

headers = {
    "X-Session-ID": "test-session-123",
    "Content-Type": "application/json"
}

print("\n" + "="*80)
print("🧪 TESTING: Hybrid AI + Fallback Architecture")
print("="*80)
print(f"Route: Delhi, India → Dubai, UAE")
print(f"Dates: Dec 20-26, 2025 (6 days)")
print(f"Travelers: 2 adults, Standard style")
print(f"Currency: INR")
print("="*80 + "\n")

# Test 1: First call (should try AI)
print("📞 TEST 1: First API Call (AI Enhancement Attempt)")
print("-" * 80)

start = time.time()
try:
    response = requests.post(url, json=test_data, headers=headers, timeout=10)
    end = time.time()
    
    print(f"✅ Response Time: {(end - start)*1000:.2f}ms\n")
    
    if response.status_code == 200:
        result = response.json()
        
        print(f"🤖 AI Status: {result['ai_status'].upper()}")
        print(f"📊 Calculation Time: {result['calculation_time_ms']}ms")
        print(f"⏱️  AI Latency: {result.get('ai_latency_ms', 'N/A')}ms")
        print(f"🎯 Fallback Used: {'Yes' if result['fallback_used'] else 'No'}")
        print(f"🔢 AI Calls Remaining: {result['ai_calls_remaining']}/3")
        
        print(f"\n💰 ESTIMATED COSTS ({result['currency']})")
        print("-" * 80)
        
        # Flight
        flight = result['flight_estimate']
        print(f"✈️  Flights:")
        print(f"   Range: ₹{flight['min']:,.0f} - ₹{flight['max']:,.0f}")
        print(f"   Average: ₹{flight['average']:,.0f} per person")
        print(f"   Total: ₹{result['total_flight_cost']:,.2f}")
        print(f"   Source: {flight['source'].upper()}")
        if flight.get('reasoning'):
            print(f"   💡 {flight['reasoning']}")
        
        # Hotel
        hotel = result['hotel_per_night']
        print(f"\n🏨 Accommodation:")
        print(f"   Per Night: ₹{hotel['value']:,.2f}")
        print(f"   Total (6 nights): ₹{result['total_hotel_cost']:,.2f}")
        print(f"   Source: {hotel['source'].upper()}")
        
        # Food
        food = result['food_per_day']
        print(f"\n🍽️  Food & Dining:")
        print(f"   Per Day: ₹{food['value']:,.2f} per person")
        print(f"   Total: ₹{result['total_food_cost']:,.2f}")
        print(f"   Source: {food['source'].upper()}")
        
        # Transport
        transport = result['transport_per_day']
        print(f"\n🚕 Local Transport:")
        print(f"   Per Day: ₹{transport['value']:,.2f} per person")
        print(f"   Total: ₹{result['total_transport_cost']:,.2f}")
        print(f"   Source: {transport['source'].upper()}")
        
        # Activities
        activities = result['activities_per_day']
        print(f"\n🎭 Activities:")
        print(f"   Per Day: ₹{activities['value']:,.2f} per person")
        print(f"   Total: ₹{result['total_activities_cost']:,.2f}")
        print(f"   Source: {activities['source'].upper()}")
        
        # Other costs
        print(f"\n🛍️  Shopping: ₹{result['shopping_cost']:,.2f}")
        print(f"🏥 Insurance: ₹{result['insurance_cost']:,.2f}")
        print(f"💼 Miscellaneous: ₹{result['miscellaneous_cost']:,.2f}")
        
        # Totals
        print(f"\n" + "="*80)
        print(f"💵 TOTALS")
        print("="*80)
        print(f"Subtotal:     ₹{result['subtotal']:,.2f}")
        print(f"Buffer (10%): ₹{result['buffer']:,.2f}")
        print(f"GRAND TOTAL:  ₹{result['total_estimated_cost']:,.2f}")
        print(f"\nPer Person:   ₹{result['per_person_cost']:,.2f}")
        print(f"Per Day:      ₹{result['per_day_cost']:,.2f}")
        
        print("\n" + "="*80)
        print("✅ TEST 1 COMPLETED")
        print("="*80)
        
        # Test 2: Second call (should use cache if AI was used)
        print("\n\n📞 TEST 2: Second API Call (Should Use Cache)")
        print("-" * 80)
        
        start2 = time.time()
        response2 = requests.post(url, json=test_data, headers=headers, timeout=10)
        end2 = time.time()
        
        print(f"✅ Response Time: {(end2 - start2)*1000:.2f}ms")
        
        if response2.status_code == 200:
            result2 = response2.json()
            print(f"🤖 AI Status: {result2['ai_status'].upper()}")
            print(f"⏱️  AI Latency: {result2.get('ai_latency_ms', 'N/A')}ms (cached)")
            print(f"🔢 AI Calls Remaining: {result2['ai_calls_remaining']}/3")
            
            if result2.get('ai_latency_ms') and result.get('ai_latency_ms'):
                if result2['ai_latency_ms'] == result['ai_latency_ms']:
                    print("✅ Response served from cache (same latency)")
        
        print("\n" + "="*80)
        
    else:
        print(f"❌ Error: HTTP {response.status_code}")
        print(response.text)

except requests.exceptions.ConnectionError:
    print("❌ Backend not running on port 8000")
    print("Start: cd backend && python -m uvicorn main:app --reload --port 8000")
except Exception as e:
    print(f"❌ Error: {e}")

print()
