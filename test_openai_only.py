"""
Simple test: Only measure OpenAI latency for travel cost estimation
"""

import requests
import json
import time

# Direct OpenAI test endpoint
url = "http://localhost:8000/api/v1/ai/travel/test-ai-latency"

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
    "tripTheme": ["beaches"],
    "localTransport": "mix",
    "homeCurrency": "USD",
    "includeFlights": True,
    "includeVisa": False,
    "includeInsurance": False,
    "bufferPercentage": 10
}

print("\n" + "="*70)
print("🤖 TESTING: OpenAI Cost Estimation Latency")
print("="*70)
print(f"Route: Delhi, India → Dubai, UAE")
print(f"Dates: Dec 20-26, 2025 (6 days)")
print(f"Travelers: 2 adults, Standard style")
print("="*70 + "\n")

print("⏳ Calling OpenAI API...")
start = time.time()

try:
    response = requests.post(url, json=test_data, timeout=30)
    end = time.time()
    
    print(f"✅ Response received in {end - start:.2f}s\n")
    
    if response.status_code == 200:
        result = response.json()
        
        # Show AI results
        ai = result["test_results"]["ai_enhanced"]
        
        if ai.get("available"):
            print("="*70)
            print("🤖 OpenAI GPT-4o-mini Results")
            print("="*70)
            print(f"⚡ AI Latency: {ai['latency_ms']} ms ({ai['latency_ms']/1000:.2f} seconds)")
            print(f"\n💰 Estimated Costs (USD):")
            print(f"   Flights:       ${ai['costs']['flights']:>8,.2f}")
            print(f"   Accommodation: ${ai['costs']['accommodation']:>8,.2f}")
            print(f"   Food:          ${ai['costs']['food']:>8,.2f}")
            print(f"   Transport:     ${ai['costs']['transport']:>8,.2f}")
            print(f"   Activities:    ${ai['costs']['activities']:>8,.2f}")
            print(f"   " + "-"*30)
            print(f"   TOTAL:         ${ai['costs']['total']:>8,.2f}")
            
            if ai['costs'].get('reasoning'):
                print(f"\n💡 AI Reasoning:")
                print(f"   {ai['costs']['reasoning']}")
            
            print("\n" + "="*70)
            print("📊 Analysis")
            print("="*70)
            
            latency_sec = ai['latency_ms'] / 1000
            if latency_sec < 2:
                speed_rating = "⚡ Excellent (< 2s)"
            elif latency_sec < 5:
                speed_rating = "✅ Good (2-5s)"
            elif latency_sec < 10:
                speed_rating = "⚠️  Acceptable (5-10s)"
            else:
                speed_rating = "❌ Slow (> 10s)"
            
            print(f"Speed Rating: {speed_rating}")
            print(f"Cost per request: ~$0.002")
            print(f"Accuracy estimate: ±10-15% of actual costs")
            
            print("\n✅ Pros:")
            for pro in ai['pros']:
                print(f"   • {pro}")
            
            print("\n⚠️  Cons:")
            for con in ai['cons']:
                print(f"   • {con}")
            
            # Recommendation
            comparison = result["test_results"]["comparison"]
            print(f"\n🎯 Recommendation:")
            print(f"   {comparison['recommendation']}")
            
        else:
            print("❌ AI Request Failed")
            print(f"Error: {ai.get('error')}")
            print(f"Fallback used: {ai.get('fallback_used')}")
        
        print("\n" + "="*70 + "\n")
        
    else:
        print(f"❌ HTTP Error {response.status_code}")
        print(response.text)

except requests.exceptions.Timeout:
    print("❌ Request timeout (>30s)")
except requests.exceptions.ConnectionError:
    print("❌ Backend not running on port 8000")
    print("Start backend: cd backend && python -m uvicorn main:app --reload --port 8000")
except Exception as e:
    print(f"❌ Error: {e}")
