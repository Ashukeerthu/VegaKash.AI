"""
Test script to measure AI vs Rule-based latency for travel cost estimation
"""

import requests
import json
from datetime import date, timedelta

# Test endpoint
url = "http://localhost:8000/api/v1/ai/travel/test-ai-latency"

# Test case: Delhi to Dubai trip
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

print("=" * 80)
print("🧪 TESTING: AI vs Rule-Based Cost Estimation Latency")
print("=" * 80)
print(f"\n📍 Route: {test_data['originCity']} → {test_data['destinationCity']}")
print(f"📅 Dates: {test_data['startDate']} to {test_data['endDate']}")
print(f"👥 Travelers: {test_data['adults']} adults")
print(f"💼 Style: {test_data['travelStyle']}")
print(f"💱 Currency: {test_data['homeCurrency']}")
print("\n" + "=" * 80)
print("🔄 Sending request to backend...")
print("=" * 80 + "\n")

try:
    response = requests.post(url, json=test_data, timeout=30)
    
    if response.status_code == 200:
        result = response.json()
        
        # Extract results
        rule_based = result["test_results"]["rule_based"]
        ai_enhanced = result["test_results"]["ai_enhanced"]
        comparison = result["test_results"]["comparison"]
        
        print("✅ TEST COMPLETED SUCCESSFULLY\n")
        
        # Rule-based results
        print("=" * 80)
        print("📊 METHOD 1: RULE-BASED (Current System)")
        print("=" * 80)
        print(f"⚡ Latency: {rule_based['latency_ms']} ms")
        print(f"💰 Total Cost: {rule_based['costs']['currency']} {rule_based['costs']['total']:,.2f}")
        print("\nBreakdown:")
        print(f"  ✈️  Flights: {rule_based['costs']['currency']} {rule_based['costs']['flights']:,.2f}")
        print(f"  🏨 Accommodation: {rule_based['costs']['currency']} {rule_based['costs']['accommodation']:,.2f}")
        print(f"  🍽️  Food: {rule_based['costs']['currency']} {rule_based['costs']['food']:,.2f}")
        print(f"  🚕 Transport: {rule_based['costs']['currency']} {rule_based['costs']['transport']:,.2f}")
        print(f"  🎭 Activities: {rule_based['costs']['currency']} {rule_based['costs']['activities']:,.2f}")
        
        print("\n✅ Pros:")
        for pro in rule_based['pros']:
            print(f"  • {pro}")
        
        print("\n⚠️  Cons:")
        for con in rule_based['cons']:
            print(f"  • {con}")
        
        # AI-enhanced results
        print("\n" + "=" * 80)
        print("🤖 METHOD 2: AI-ENHANCED (OpenAI)")
        print("=" * 80)
        
        if ai_enhanced.get('available'):
            print(f"⚡ Latency: {ai_enhanced['latency_ms']} ms")
            print(f"💰 Total Cost: {ai_enhanced['costs']['currency']} {ai_enhanced['costs']['total']:,.2f}")
            print(f"\n💡 AI Reasoning: {ai_enhanced['costs']['reasoning']}")
            print("\nBreakdown:")
            print(f"  ✈️  Flights: {ai_enhanced['costs']['currency']} {ai_enhanced['costs']['flights']:,.2f}")
            print(f"  🏨 Accommodation: {ai_enhanced['costs']['currency']} {ai_enhanced['costs']['accommodation']:,.2f}")
            print(f"  🍽️  Food: {ai_enhanced['costs']['currency']} {ai_enhanced['costs']['food']:,.2f}")
            print(f"  🚕 Transport: {ai_enhanced['costs']['currency']} {ai_enhanced['costs']['transport']:,.2f}")
            print(f"  🎭 Activities: {ai_enhanced['costs']['currency']} {ai_enhanced['costs']['activities']:,.2f}")
            
            print("\n✅ Pros:")
            for pro in ai_enhanced['pros']:
                print(f"  • {pro}")
            
            print("\n⚠️  Cons:")
            for con in ai_enhanced['cons']:
                print(f"  • {con}")
        else:
            print(f"❌ AI UNAVAILABLE")
            print(f"Error: {ai_enhanced.get('error')}")
            print(f"Fallback: {ai_enhanced.get('fallback_used')}")
        
        # Comparison
        print("\n" + "=" * 80)
        print("📈 COMPARISON & RECOMMENDATION")
        print("=" * 80)
        print(f"⏱️  Speed Difference: {comparison['speed_difference']}")
        print(f"💵 Cost Difference: {comparison['cost_difference_percent']}%")
        if comparison.get('ai_higher') is not None:
            print(f"📊 AI Estimate: {'Higher' if comparison['ai_higher'] else 'Lower'} than rule-based")
        print(f"\n🎯 Recommendation:")
        print(f"   {comparison['recommendation']}")
        
        print("\n" + "=" * 80)
        print("✅ TEST COMPLETED")
        print("=" * 80)
        
    else:
        print(f"❌ Error: HTTP {response.status_code}")
        print(response.text)

except requests.exceptions.Timeout:
    print("❌ Request timed out (> 30 seconds)")
except requests.exceptions.ConnectionError:
    print("❌ Could not connect to backend. Is it running on port 8000?")
except Exception as e:
    print(f"❌ Error: {str(e)}")
