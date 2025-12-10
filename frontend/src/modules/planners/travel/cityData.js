/**
 * Popular cities database with country mapping
 * Now uses comprehensive world cities database
 */
import { getAllCities, searchCities as searchWorldCities, getTotalCityCount } from '../../../data/worldCities';

// Re-export all cities for backwards compatibility
export const popularCities = getAllCities().map(c => ({
  city: c.city,
  country: c.country,
  code: getCountryCode(c.country),
  region: c.region || getRegionFromCountry(c.country),
  state: c.state,
  province: c.province,
  isCapital: c.isCapital
}));

// Country code mapping
function getCountryCode(country) {
  const codes = {
    "India": "IN",
    "United States": "US",
    "United Kingdom": "GB",
    "Canada": "CA",
    "Australia": "AU",
    "Japan": "JP",
    "China": "CN",
    "Singapore": "SG",
    "Thailand": "TH",
    "France": "FR",
    "Germany": "DE",
    "Italy": "IT",
    "Spain": "ES",
    "UAE": "AE",
    "United Arab Emirates": "AE",
    "Brazil": "BR",
    "Mexico": "MX",
    "South Africa": "ZA",
    "Egypt": "EG",
    "Turkey": "TR",
    "Russia": "RU",
    "South Korea": "KR",
    "Indonesia": "ID",
    "Malaysia": "MY",
    "Vietnam": "VN",
    "Philippines": "PH",
    "New Zealand": "NZ",
    "Switzerland": "CH",
    "Netherlands": "NL",
    "Belgium": "BE",
    "Austria": "AT",
    "Portugal": "PT",
    "Greece": "GR",
    "Poland": "PL",
    "Czech Republic": "CZ",
    "Hungary": "HU",
    "Ireland": "IE",
    "Denmark": "DK",
    "Sweden": "SE",
    "Norway": "NO",
    "Finland": "FI",
    "Argentina": "AR",
    "Chile": "CL",
    "Peru": "PE",
    "Colombia": "CO",
    "Morocco": "MA",
    "Kenya": "KE",
    "Qatar": "QA",
    "Saudi Arabia": "SA",
    "Israel": "IL",
    "Jordan": "JO",
    "Oman": "OM",
    "Bahrain": "BH",
    "Sri Lanka": "LK",
    "Nepal": "NP",
    "Bangladesh": "BD",
    "Maldives": "MV",
    "Taiwan": "TW",
    "Hong Kong": "HK",
  };
  return codes[country] || "";
}

function getRegionFromCountry(country) {
  const regions = {
    "India": "Asia",
    "China": "Asia",
    "Japan": "Asia",
    "South Korea": "Asia",
    "Thailand": "Asia",
    "Vietnam": "Asia",
    "Singapore": "Asia",
    "Malaysia": "Asia",
    "Indonesia": "Asia",
    "Philippines": "Asia",
    "Taiwan": "Asia",
    "Nepal": "Asia",
    "Sri Lanka": "Asia",
    "Bangladesh": "Asia",
    "Maldives": "Asia",
    "United States": "North America",
    "Canada": "North America",
    "Mexico": "North America",
    "Brazil": "South America",
    "Argentina": "South America",
    "Chile": "South America",
    "Peru": "South America",
    "Colombia": "South America",
    "United Kingdom": "Europe",
    "France": "Europe",
    "Germany": "Europe",
    "Italy": "Europe",
    "Spain": "Europe",
    "Netherlands": "Europe",
    "Belgium": "Europe",
    "Switzerland": "Europe",
    "Austria": "Europe",
    "Portugal": "Europe",
    "Greece": "Europe",
    "Poland": "Europe",
    "Czech Republic": "Europe",
    "Hungary": "Europe",
    "Ireland": "Europe",
    "Denmark": "Europe",
    "Sweden": "Europe",
    "Norway": "Europe",
    "Finland": "Europe",
    "Russia": "Europe",
    "UAE": "Middle East",
    "Saudi Arabia": "Middle East",
    "Qatar": "Middle East",
    "Israel": "Middle East",
    "Jordan": "Middle East",
    "Turkey": "Middle East",
    "Oman": "Middle East",
    "Bahrain": "Middle East",
    "Australia": "Oceania",
    "New Zealand": "Oceania",
    "Egypt": "Africa",
    "South Africa": "Africa",
    "Morocco": "Africa",
    "Kenya": "Africa",
  };
  return regions[country] || "Other";
}

/**
 * Search cities by query - Enhanced with state/province search
 */
export const searchCities = (query, limit = 15) => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  // First, try exact city match
  const exactMatches = popularCities.filter(city => 
    city.city.toLowerCase().startsWith(lowerQuery)
  );
  
  // Then, broader search including country and state
  const broaderMatches = popularCities.filter(city => 
    !city.city.toLowerCase().startsWith(lowerQuery) && (
      city.city.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery) ||
      (city.state && city.state.toLowerCase().includes(lowerQuery)) ||
      (city.province && city.province.toLowerCase().includes(lowerQuery))
    )
  );
  
  // Combine results, exact matches first
  const results = [...exactMatches, ...broaderMatches];
  
  return results.slice(0, limit);
};

/**
 * Get city by exact name
 */
export const getCityByName = (cityName) => {
  return popularCities.find(city => 
    city.city.toLowerCase() === cityName.toLowerCase()
  );
};

/**
 * Get total city count
 */
export const getCityCount = () => getTotalCityCount();

/**
 * Log city count for debugging
 */
console.log(`🌍 World Cities Database loaded: ${getTotalCityCount()} cities available`);
