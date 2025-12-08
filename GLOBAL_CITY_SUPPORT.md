# Budget Planner V1.2 - Global City Support

## 🌍 Multi-Country Support Overview

Budget Planner V1.2 now supports **25+ countries** with tier-aware city selection for global users from:
- 🇮🇳 India
- 🇺🇸 United States
- 🇨🇦 Canada
- 🇬🇧 United Kingdom
- 🇦🇺 Australia
- 🇩🇪 Germany
- 🇫🇷 France
- 🇵🇱 Poland
- 🇷🇺 Russia
- 🇯🇵 Japan
- 🇨🇳 China
- 🇰🇷 South Korea
- 🇹🇭 Thailand
- 🇱🇰 Sri Lanka
- 🇦🇪 UAE
- 🇸🇬 Singapore
- 🇲🇽 Mexico
- 🇧🇷 Brazil
- 🇮🇩 Indonesia
- 🇵🇭 Philippines
- 🇻🇳 Vietnam
- 🇲🇾 Malaysia
- 🇳🇿 New Zealand
- 🇸🇪 Sweden
- 🇳🇱 Netherlands
- *More countries can be added based on traffic analysis*


## 📊 Tier System Structure

### Tier 1 - Metropolitan Cities (COL: 1.25x)
Major metropolitan hubs with highest cost of living:
- **India**: Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Kolkata
- **USA**: San Francisco, New York, Los Angeles, Chicago, Boston, Seattle
- **UK**: London
- **Canada**: Toronto, Vancouver
- **Australia**: Sydney, Melbourne
- **Singapore**: Singapore
- **UAE**: Dubai
- And more...

### Tier 2 - Major Cities (COL: 1.05x)
Significant cities with moderate living costs:
- **India**: Jaipur, Lucknow, Indore, Coimbatore, Ahmedabad, Surat
- **USA**: Houston, Austin, Denver, Phoenix
- **UK**: Manchester, Edinburgh, Glasgow, Birmingham
- **Canada**: Calgary, Montreal
- **Russia**: Moscow, St. Petersburg
- **Thailand**: Bangkok
- **Sri Lanka**: Colombo
- And more...

### Tier 3 - Emerging Cities (COL: 0.90x)
Developing cities with lower living costs:
- **India**: Visakhapatnam, Mysore, Bhubaneswar, Raipur
- **USA**: Philadelphia, San Antonio
- **Poland**: Krakow, Wroclaw, Poznan
- **Russia**: Yekaterinburg, Novosibirsk
- **Thailand**: Chiang Mai, Phuket
- **Sri Lanka**: Kandy, Galle
- And more...

### Other/Default (COL: 1.00x)
Any city not specifically categorized uses default multiplier.


## 🔄 Updated API Endpoints

### GET /api/v1/ai/budget/countries
Returns list of all supported countries with details:

```json
{
  "total_countries": 25,
  "countries": [
    {
      "code": "IN",
      "name": "India",
      "region": "Asia",
      "description": "India - Domestic",
      "currency": "INR",
      "hasMultipleTiers": true
    },
    {
      "code": "US",
      "name": "United States",
      "region": "North America",
      "description": "USA - United States of America",
      "currency": "USD",
      "hasMultipleTiers": true
    },
    ...
  ],
  "message": "Global coverage with support for 25+ countries..."
}
```

### POST /api/v1/ai/budget/generate
Updated to support international cities:

```json
{
  "income": {
    "monthly_income": 100000,
    "currency": "USD"
  },
  "city": {
    "country": "United States",
    "state": "California",
    "city": "San Francisco",
    "city_tier": "tier_1",
    "col_multiplier": 1.25
  },
  ...
}
```


## 📱 Frontend Functions Updated

### JavaScript/React Helper Functions

```javascript
// Get all countries
import { getAllCountries } from './src/utils/cityTierData'
const countries = getAllCountries()
// Returns: ['India', 'United States', 'United Kingdom', ...]

// Get states for country
import { getAllStates } from './src/utils/cityTierData'
const states = getAllStates('United States')
// Returns: ['California', 'New York', 'Texas', ...]

// Get cities for state
import { getCitiesByState } from './src/utils/cityTierData'
const cities = getCitiesByState('California', 'United States')
// Returns: ['San Francisco', 'Los Angeles', 'San Diego', ...]

// Get city tier and multiplier
import { getCityTier } from './src/utils/cityTierData'
const tier = getCityTier('San Francisco', 'United States')
// Returns: { tier: 'tier_1', multiplier: 1.25, name: 'Tier 1 - Metropolitan' }
```

### New Data Structures

```javascript
// New in cityTierData.js
export const INTERNATIONAL_TIER_1_CITIES = { /* Tier 1 metros */ }
export const INTERNATIONAL_TIER_2_CITIES = { /* Major cities */ }
export const INTERNATIONAL_TIER_3_CITIES = { /* Emerging cities */ }
export const INTERNATIONAL_CITIES = { /* All cities with defaults */ }
```


## 💱 Multi-Currency Support

Each country has a specific currency:

| Country | Currency | Code |
|---------|----------|------|
| India | Indian Rupee | INR |
| United States | US Dollar | USD |
| Canada | Canadian Dollar | CAD |
| United Kingdom | British Pound | GBP |
| Australia | Australian Dollar | AUD |
| Europe (DE, FR, etc.) | Euro | EUR |
| Russia | Russian Ruble | RUB |
| Japan | Japanese Yen | JPY |
| China | Chinese Yuan | CNY |
| Thailand | Thai Baht | THB |
| Sri Lanka | Sri Lankan Rupee | LKR |
| UAE | UAE Dirham | AED |
| Singapore | Singapore Dollar | SGD |
| Mexico | Mexican Peso | MXN |
| Brazil | Brazilian Real | BRL |
| South Korea | Korean Won | KRW |
| Vietnam | Vietnamese Dong | VND |
| Malaysia | Malaysian Ringgit | MYR |
| Poland | Polish Zloty | PLN |
| Indonesia | Indonesian Rupiah | IDR |
| Philippines | Philippine Peso | PHP |
| New Zealand | New Zealand Dollar | NZD |
| Sweden | Swedish Krona | SEK |
| Netherlands | Euro | EUR |


## 🗺️ Regional Coverage

### Asia
- India (3-tier system: 90+ cities)
- China (4 tier-1 cities)
- Japan (Multiple tier cities)
- South Korea (Seoul, Busan, Incheon)
- Thailand (Bangkok, Chiang Mai, Phuket)
- Sri Lanka (Colombo, Kandy, Galle)
- Singapore (Tier 1 metro)
- Malaysia (Kuala Lumpur, Georgetown)
- Vietnam (Ho Chi Minh City, Hanoi)
- Indonesia (Jakarta, Bandung, Surabaya)
- Philippines (Manila, Cebu City)

### Europe
- United Kingdom (London, Manchester, Edinburgh)
- Germany (Berlin, Frankfurt, Munich)
- France (Paris, Marseille, Lyon)
- Poland (Warsaw, Krakow, Wroclaw)
- Russia (Moscow, St. Petersburg, Yekaterinburg)
- Sweden (Stockholm, Gothenburg)
- Netherlands (Amsterdam, Rotterdam)

### North America
- United States (30+ major cities across states)
- Canada (Toronto, Vancouver, Calgary, Montreal)
- Mexico (Mexico City, Guadalajara, Monterrey)

### South America
- Brazil (São Paulo, Rio de Janeiro, Belo Horizonte)

### Oceania
- Australia (Sydney, Melbourne, Brisbane, Perth)
- New Zealand (Auckland, Wellington, Christchurch)

### Middle East
- UAE (Dubai, Abu Dhabi, Sharjah)


## 🔧 Implementation Details

### Backend Schema Updates
- `CityInput` model accepts optional country, state fields
- `getCityTier()` function enhanced with country parameter
- Tier detection works across all 25 countries
- COL multiplier properly applied for international cities

### Frontend Component Integration

The updated cityTierData.js provides:

```javascript
// Form initialization
const countries = getAllCountries() // Shows all 25 countries

// On country selection
const states = getAllStates(selectedCountry)

// On state selection
const cities = getCitiesByState(selectedState, selectedCountry)

// On city selection
const tier = getCityTier(selectedCity, selectedCountry)
const colMultiplier = tier.multiplier
```

### API Response Example

```bash
GET http://localhost:8000/api/v1/ai/budget/countries

Response:
{
  "total_countries": 25,
  "countries": [
    {
      "code": "IN",
      "name": "India",
      "region": "Asia",
      "currency": "INR",
      "hasMultipleTiers": true
    },
    ...
  ]
}
```


## 🎯 Form Flow for International Users

1. **Select Country** → Use `getAllCountries()`
   - Shows: India, United States, Canada, ..., Netherlands

2. **Select State/Region** → Use `getAllStates(country)`
   - For USA: California, New York, Texas, ...
   - For India: Tiers 1/2/3 organization
   - For UK: England, Scotland, Wales
   - Etc.

3. **Select City** → Use `getCitiesByState(state, country)`
   - For California: San Francisco, Los Angeles, ...
   - For England: London, Manchester, ...
   - Etc.

4. **Get Tier Info** → Use `getCityTier(city, country)`
   - Returns: tier_1/tier_2/tier_3/other
   - Returns: 1.25/1.05/0.90/1.00 multiplier
   - Automatically applies to budget calculation


## 📈 Future Expansion

As traffic patterns emerge:
1. Analyze user distribution by country
2. Identify high-traffic countries
3. Add more cities for top countries
4. Refine tier classifications based on real data
5. Add country-specific expenses categories (taxes, healthcare, etc.)
6. Support for regional variations within countries


## 🔐 Validation Rules

- All countries must exist in supported list
- City tier must be: tier_1, tier_2, tier_3, or other
- COL multiplier must be 0.5-2.0 range
- Monthly income validation per currency
- All tier lookups are case-insensitive


## 📚 Database Summary

### India
- **Tier 1**: 7 metros + 40 cities = 47 cities
- **Tier 2**: 10 states, 25+ cities
- **Tier 3**: 10 states, 20+ cities
- **Total**: 90+ Indian cities

### International (Top 24 countries)
- **Tier 1**: ~40 major cities (metros)
- **Tier 2**: ~60 major cities
- **Tier 3**: ~50 emerging cities
- **Total**: 150+ international cities

### Grand Total
- **25+ countries**
- **240+ cities globally**
- **Tier-aware** for 23 countries
- **Dynamic COL adjustments** for all

---

## ✅ Implementation Checklist

- [x] Updated cityTierData.js with 25 countries
- [x] Tier 1/2/3 cities for major countries
- [x] Enhanced getCityTier() with country parameter
- [x] Updated getStatesCities() for international data
- [x] Updated getAllCountries() with all 25 countries
- [x] Updated getAllStates() to handle intl. countries
- [x] Updated getCitiesByState() for international
- [x] Backend routes updated with /countries endpoint
- [x] Type hints fixed in routes
- [x] Documentation created

**Ready for**: Frontend form component development with country selection


---

**Status**: ✅ GLOBAL CITY SUPPORT COMPLETE

Support global users from 25+ countries with tier-aware budgeting!
