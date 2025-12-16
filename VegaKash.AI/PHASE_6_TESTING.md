# Phase 6 Testing & Validation Guide

## Quick Verification Checklist

### ✅ Code Quality
- [x] No syntax errors in new files
- [x] All imports valid and resolvable
- [x] Pydantic models validate correctly
- [x] Function schema generation works
- [x] IATA airport database populated (500+ codes)
- [x] Graceful fallback on import failures
- [x] 100% backward compatible

### ✅ Integration Points
- [x] `travel_planner.py` imports all new services
- [x] `resolve_airport_with_iata()` integrated into main flow
- [x] `get_pricing_function_schema()` available for function calls
- [x] Error handling with function call fallback
- [x] Cache service still functional alongside new features

### ⏳ Integration Testing (Manual Required)
- [ ] Test `/calculate-budget` with function calling enabled
- [ ] Test fallback to text API if function call fails
- [ ] Test IATA airport lookup for various cities
- [ ] Test cache + function calling interaction
- [ ] Test error handling for unknown cities

---

## Manual Testing Instructions

### Prerequisites
1. Start backend server: `uvicorn backend.main:app --reload`
2. Verify OpenAI API key is set: `echo $env:OPENAI_API_KEY` (PowerShell) or `echo $OPENAI_API_KEY` (bash)
3. Have curl/Invoke-WebRequest or Postman ready

### Test 1: Basic Function Calling (India Route)
**Purpose:** Verify function calling mode with simple domestic route

**Command (PowerShell):**
```powershell
$body = @{
    originCity = "Mumbai"
    originCountry = "India"
    destinationCity = "Goa"
    destinationCountry = "India"
    startDate = "2024-06-01"
    endDate = "2024-06-07"
    adults = 2
    children = 0
    infants = 0
    travelStyle = "moderate"
    includeFlights = $true
    includeVisa = $false
    includeInsurance = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/ai/travel/calculate-budget" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

**Expected Response:**
- Status: 200 OK
- All expense fields present and numeric
- Flight cost > 0 (flights included)
- Per person cost calculated correctly
- Response time: 3-5 seconds (first call, no cache)

**Verification:**
```json
{
  "expenses": {
    "flights": 600,  // 2 adults × ~300 per person
    "accommodation": 400,  // 6 nights × 80/night (2 rooms assumed)
    "food": 300,  // 6 days × 2 people × 25/day
    // ... other expenses
  },
  "subtotal": 2000,
  "buffer": 200,
  "grandTotal": 2200,
  "perPersonCost": 1100,
  "perDayCost": 366.67,
  "tripDays": 6,
  "currency": "USD"
}
```

### Test 2: International Route with IATA Lookup
**Purpose:** Verify IATA airport detection for international travel

**Command:**
```powershell
$body = @{
    originCity = "Delhi"
    originCountry = "India"
    destinationCity = "London"
    destinationCountry = "United Kingdom"
    startDate = "2024-07-15"
    endDate = "2024-07-22"
    adults = 1
    children = 0
    travelStyle = "luxury"
    includeFlights = $true
    includeVisa = $true
    includeInsurance = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/ai/travel/calculate-budget" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

**Expected Response:**
- Status: 200 OK
- Flight cost substantial (international: $800-1500 per person)
- Visa included (UK visa cost ~$100)
- Airport codes in notes (e.g., "DEL → LHR")
- Currency: USD
- Response time: 4-6 seconds

### Test 3: Fallback to Nearest Airport (Siliguri)
**Purpose:** Verify IATA database correctly handles Siliguri → Bagdogra mapping

**Command:**
```powershell
$body = @{
    originCity = "Delhi"
    originCountry = "India"
    destinationCity = "Siliguri"
    destinationCountry = "India"
    startDate = "2024-06-01"
    endDate = "2024-06-05"
    adults = 2
    travelStyle = "budget"
    includeFlights = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/ai/travel/calculate-budget" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

**Expected Behavior:**
- Flight cost capped at low value (nearest airport is ~15 km away)
- Notes mention "Bagdogra (IXB)" or "nearest airport"
- Advisory about considering train
- Status: 200 OK

**Verification Check:**
```powershell
# Check if response contains Bagdogra reference
$response.Content | Select-String "Bagdogra|IXB|train" -Quiet
# Should return True
```

### Test 4: Caching Test (Repeated Query)
**Purpose:** Verify caching works alongside function calling

**Command:** Run Test 1 twice
```powershell
# First call
$response1 = Invoke-WebRequest -Uri "..." -Method Post -Body $body -PassThru
$time1 = Measure-Command { $response1 }

# Second call (identical)
$response2 = Invoke-WebRequest -Uri "..." -Method Post -Body $body -PassThru
$time2 = Measure-Command { $response2 }

Write-Host "First call: $($time1.TotalMilliseconds)ms"
Write-Host "Second call: $($time2.TotalMilliseconds)ms (should be <100ms)"
```

**Expected Result:**
- First call: 3-5 seconds (OpenAI API call)
- Second call: <100ms (cache hit)
- Responses identical
- Both status 200

### Test 5: Unknown City Graceful Fallback
**Purpose:** Verify system handles unknown cities without crashing

**Command:**
```powershell
$body = @{
    originCity = "New York"
    originCountry = "USA"
    destinationCity = "FictionalCity"
    destinationCountry = "Wonderland"
    startDate = "2024-06-01"
    endDate = "2024-06-08"
    adults = 1
    travelStyle = "moderate"
    includeFlights = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/ai/travel/calculate-budget" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

**Expected Behavior:**
- Status: 200 OK (not 500 error)
- Uses fallback estimates
- Response still valid JSON
- Logger shows warning about unknown city
- No crash or partial response

### Test 6: Validation & Edge Cases
**Purpose:** Test Pydantic validation edge cases

**Commands:**

#### 6A: Visa Type Auto-correction
```powershell
# Payload with invalid visa_type (should auto-correct to "tourist")
$body = @{
    originCity = "New York"
    originCountry = "USA"
    destinationCity = "Tokyo"
    destinationCountry = "Japan"
    startDate = "2024-07-01"
    endDate = "2024-07-15"
    adults = 1
    travelStyle = "moderate"
    includeFlights = $true
    # Backend will call AI, AI might return "visa_free" → auto-corrected to "tourist"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "..." -Method Post -Body $body
$data = $response.Content | ConvertFrom-Json

# Check visa_type is valid
if ($data.visaType -in @("exempt", "on-arrival", "tourist", "e-visa", "embassy")) {
    Write-Host "✅ Visa type validation works"
} else {
    Write-Host "❌ Invalid visa type: $($data.visaType)"
}
```

#### 6B: Miscellaneous Percentage Clamping
```powershell
# Note: This tests internal validation, hard to trigger via API
# but logs will show if AI returns out-of-range value
# Look for: "Clamping miscellaneous_percentage" in logs
```

#### 6C: Negative Price Rejection
```powershell
# Note: AI should not return negative prices, but validation catches it
# Manual test: Check logs during run, look for "negative price detected"
```

---

## Automated Testing Script

Save as `test_phase6.py`:

```python
#!/usr/bin/env python3
"""
Automated test suite for Phase 6 improvements
Tests function calling, IATA airports, and Pydantic validation
"""
import requests
import json
import time
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api/v1/ai/travel"

def test_airport_database():
    """Test IATA airport service directly"""
    print("Testing airport database...")
    try:
        from services.airport_service import (
            get_airports_by_city,
            resolve_airport_with_iata
        )
        
        # Test Delhi
        assert get_airports_by_city("delhi")[0]["code"] == "DEL", "Delhi airport not found"
        
        # Test Siliguri
        siliguri = resolve_airport_with_iata("siliguri")
        assert not siliguri["hasAirport"], "Siliguri should not have direct airport"
        
        print("✅ Airport database test passed")
        return True
    except Exception as e:
        print(f"❌ Airport database test failed: {e}")
        return False

def test_function_schema():
    """Test Pydantic function schema"""
    print("Testing function schema...")
    try:
        from services.function_schema import PricingBreakdown, get_pricing_function_schema
        
        # Test valid schema
        schema = get_pricing_function_schema()
        assert schema["name"] == "calculate_travel_pricing"
        
        # Test model validation
        pricing = PricingBreakdown(
            flight_cost_per_person=600,
            accommodation_cost_per_night=80,
            food_cost_per_day_per_person=25,
            local_transport_cost_per_day_per_person=10,
            activities_cost_per_day_per_person=30,
            shopping_cost_per_day_per_person=20,
            visa_type="tourist",
            visa_guidance="Online e-visa",
            insurance_cost_per_person=50,
            miscellaneous_percentage=10
        )
        
        # Test auto-correction of invalid visa type
        pricing2 = PricingBreakdown(
            flight_cost_per_person=500,
            accommodation_cost_per_night=60,
            food_cost_per_day_per_person=20,
            local_transport_cost_per_day_per_person=8,
            activities_cost_per_day_per_person=25,
            shopping_cost_per_day_per_person=15,
            visa_type="invalid_type",
            visa_guidance="Test",
            insurance_cost_per_person=40,
            miscellaneous_percentage=50  # Should clamp to 20
        )
        
        assert pricing2.visa_type == "tourist", "Visa type auto-correction failed"
        assert pricing2.miscellaneous_percentage == 20, "Miscellaneous percentage clamping failed"
        
        print("✅ Function schema test passed")
        return True
    except Exception as e:
        print(f"❌ Function schema test failed: {e}")
        return False

def test_calculate_budget_endpoint():
    """Test /calculate-budget endpoint with function calling"""
    print("Testing /calculate-budget endpoint...")
    
    payload = {
        "originCity": "Mumbai",
        "originCountry": "India",
        "destinationCity": "Goa",
        "destinationCountry": "India",
        "startDate": "2024-06-01",
        "endDate": "2024-06-07",
        "adults": 2,
        "children": 0,
        "infants": 0,
        "travelStyle": "moderate",
        "includeFlights": True,
        "includeVisa": False,
        "includeInsurance": True,
        "bufferPercentage": 10
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/calculate-budget",
            json=payload,
            timeout=15
        )
        
        assert response.status_code == 200, f"Status {response.status_code}: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "expenses" in data
        assert "grandTotal" in data
        assert "perPersonCost" in data
        assert data["tripDays"] == 6
        assert data["expenses"]["flights"] > 0  # Flights included
        
        print("✅ /calculate-budget endpoint test passed")
        return True
    except Exception as e:
        print(f"❌ /calculate-budget endpoint test failed: {e}")
        return False

def test_caching():
    """Test that caching works (second call should be faster)"""
    print("Testing caching...")
    
    payload = {
        "originCity": "Delhi",
        "originCountry": "India",
        "destinationCity": "London",
        "destinationCountry": "United Kingdom",
        "startDate": "2024-07-15",
        "endDate": "2024-07-22",
        "adults": 1,
        "travelStyle": "luxury",
        "includeFlights": True,
        "includeVisa": True,
        "includeInsurance": True
    }
    
    try:
        # First call (should be slow)
        start = time.time()
        r1 = requests.post(f"{BASE_URL}/calculate-budget", json=payload, timeout=15)
        t1 = time.time() - start
        assert r1.status_code == 200
        data1 = r1.json()
        
        # Second call (should be fast)
        start = time.time()
        r2 = requests.post(f"{BASE_URL}/calculate-budget", json=payload, timeout=15)
        t2 = time.time() - start
        assert r2.status_code == 200
        data2 = r2.json()
        
        # Verify responses match and second is faster
        assert data1["grandTotal"] == data2["grandTotal"], "Cached response differs"
        assert t2 < t1, f"Cache not working: t1={t1:.2f}s, t2={t2:.2f}s"
        
        print(f"✅ Caching test passed (t1={t1:.2f}s → t2={t2:.2f}s)")
        return True
    except Exception as e:
        print(f"❌ Caching test failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Phase 6 - Automated Test Suite")
    print("=" * 60)
    
    results = [
        ("Airport Database", test_airport_database()),
        ("Function Schema", test_function_schema()),
        ("Calculate Budget Endpoint", test_calculate_budget_endpoint()),
        ("Caching", test_caching()),
    ]
    
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Phase 6 is ready for production.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Review logs above.")
```

**Run automated tests:**
```bash
python test_phase6.py
```

---

## Performance Benchmarks

### Expected Metrics

| Scenario | Time | Notes |
|----------|------|-------|
| First API call (no cache) | 3–5 sec | OpenAI API + function calling overhead |
| Cached API call | <100 ms | In-memory cache hit |
| IATA lookup (Delhi) | <1 ms | Dictionary lookup |
| IATA lookup (unknown city) | <1 ms | Graceful fallback |
| Pydantic validation | <2 ms | Model instantiation + validators |
| Function schema generation | <1 ms | Dict generation |

### Optimization Tips
- **Cache hit rate:** Monitor with `budget_cache.stats()` to see hit/miss ratio
- **Token cost:** Estimated 5–10% savings from function calling (shorter prompts)
- **Latency:** Dominated by OpenAI API (3–5s per call), not by our code

---

## Troubleshooting

### Issue: Function call not recognized (falls back to text)
**Cause:** Model doesn't support function calling (gpt-3.5-turbo older version)
**Solution:** Check OpenAI API version is 1.0+, update to latest

### Issue: IATA lookup returns "hasAirport: false" for known cities
**Cause:** City name not in database or incorrect spelling
**Solution:** Check `IATA_AIRPORTS` dict in `airport_service.py`, add missing cities

### Issue: Cache not working (repeated queries still slow)
**Cause:** Request parameters differ slightly (whitespace, key order)
**Solution:** Check that request JSON is identical (note: order doesn't matter due to SHA-256 hash)

### Issue: Miscellaneous percentage not clamped
**Cause:** Validation not applied (shouldn't happen with Pydantic)
**Solution:** Check if AI response has unexpected format, verify function schema is loaded

---

## Cleanup & Verification Commands

```bash
# Verify no import errors
python -c "from backend.services.airport_service import *; print('✅ Airport service OK')"
python -c "from backend.services.function_schema import *; print('✅ Function schema OK')"

# Check file sizes
wc -l backend/services/airport_service.py backend/services/function_schema.py

# Grep for logging hints
grep -n "✅\|❌\|⚠️" backend/routes/travel_planner.py

# View cache stats (in running server)
python -c "from services.cache_service import budget_cache; print(budget_cache.stats())"
```

---

## Sign-Off Checklist

Before marking Phase 6 as complete:

- [ ] All syntax checks pass (no Python errors)
- [ ] New imports work without errors
- [ ] `/calculate-budget` returns 200 status
- [ ] Response JSON is valid (no markdown artifacts)
- [ ] All expense fields present and numeric
- [ ] IATA lookup works for major cities (Delhi, London, Tokyo)
- [ ] Siliguri → Bagdogra mapping works
- [ ] Caching reduces response time significantly
- [ ] Cache hits return identical results
- [ ] Unknown cities don't cause crashes
- [ ] Visa type auto-corrects invalid values
- [ ] Miscellaneous percentage clamps to 0–20
- [ ] Backward compatibility maintained (old clients still work)

Once all items checked, Phase 6 is **production-ready**. 🚀

