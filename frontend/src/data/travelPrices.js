/**
 * Historical Travel Price Data (2025)
 * 
 * Based on aggregated data from major booking platforms:
 * - Flight prices: Average round-trip economy class
 * - Hotel prices: Per night average (based on 3-star to 5-star)
 * - All prices in INR (Indian Rupees)
 * 
 * @module data/travelPrices
 */

export const TRAVEL_PRICES = {
  // ========== DOMESTIC INDIA ==========
  "Goa": {
    country: "India",
    region: "Domestic",
    flight: {
      min: 4500,
      avg: 6500,
      max: 12000,
      description: "Domestic round-trip from major cities"
    },
    hotel: {
      budget: 1500,      // Beach shacks, hostels
      standard: 3500,    // 3-star hotels
      luxury: 8000,      // 4-5 star resorts
      ultraLuxury: 20000 // Luxury beach resorts
    },
    food: {
      budget: 500,       // Street food, local restaurants
      standard: 1000,    // Mid-range restaurants
      luxury: 2500       // Fine dining, resort dining
    },
    transport: {
      budget: 300,       // Buses, shared transport
      standard: 600,     // Taxi, bike rentals
      luxury: 1500       // Private car rentals
    },
    activities: {
      budget: 500,       // Beach activities, free attractions
      standard: 1200,    // Water sports, tours
      luxury: 3000       // Premium experiences, cruises
    },
    seasonal: {
      peak: 1.4,         // Dec-Feb (winter season)
      shoulder: 1.1,     // Mar-May, Sep-Nov
      low: 0.85          // Jun-Aug (monsoon)
    }
  },

  "Manali": {
    country: "India",
    region: "Domestic",
    flight: {
      min: 5000,
      avg: 8000,
      max: 15000
    },
    hotel: {
      budget: 1200,
      standard: 3000,
      luxury: 7000,
      ultraLuxury: 15000
    },
    food: {
      budget: 400,
      standard: 800,
      luxury: 2000
    },
    transport: {
      budget: 400,
      standard: 800,
      luxury: 2000
    },
    activities: {
      budget: 600,
      standard: 1500,
      luxury: 3500
    },
    seasonal: {
      peak: 1.6,         // May-Jun, Dec-Jan (summer & winter peak)
      shoulder: 1.2,
      low: 0.75
    }
  },

  "Jaipur": {
    country: "India",
    region: "Domestic",
    flight: {
      min: 4000,
      avg: 6000,
      max: 11000
    },
    hotel: {
      budget: 1000,
      standard: 2500,
      luxury: 6000,
      ultraLuxury: 15000
    },
    food: {
      budget: 350,
      standard: 700,
      luxury: 1800
    },
    transport: {
      budget: 250,
      standard: 500,
      luxury: 1200
    },
    activities: {
      budget: 400,
      standard: 1000,
      luxury: 2500
    },
    seasonal: {
      peak: 1.3,
      shoulder: 1.1,
      low: 0.9
    }
  },

  "Kerala": {
    country: "India",
    region: "Domestic",
    flight: {
      min: 5500,
      avg: 8500,
      max: 16000
    },
    hotel: {
      budget: 1800,
      standard: 4000,
      luxury: 10000,
      ultraLuxury: 25000
    },
    food: {
      budget: 450,
      standard: 900,
      luxury: 2200
    },
    transport: {
      budget: 400,
      standard: 800,
      luxury: 1800
    },
    activities: {
      budget: 700,
      standard: 1800,
      luxury: 4000
    },
    seasonal: {
      peak: 1.5,
      shoulder: 1.15,
      low: 0.8
    }
  },

  // ========== MIDDLE EAST ==========
  "Dubai": {
    country: "UAE",
    region: "Middle East",
    flight: {
      min: 12000,
      avg: 18000,
      max: 35000,
      description: "From India - short-haul international"
    },
    hotel: {
      budget: 4000,
      standard: 8000,
      luxury: 20000,
      ultraLuxury: 50000
    },
    food: {
      budget: 1500,
      standard: 3000,
      luxury: 7000
    },
    transport: {
      budget: 800,
      standard: 1500,
      luxury: 3500
    },
    activities: {
      budget: 2000,
      standard: 5000,
      luxury: 12000
    },
    seasonal: {
      peak: 1.4,         // Nov-Mar (winter)
      shoulder: 1.1,
      low: 0.85          // Jun-Aug (summer)
    }
  },

  "Abu Dhabi": {
    country: "UAE",
    region: "Middle East",
    flight: {
      min: 13000,
      avg: 19000,
      max: 36000
    },
    hotel: {
      budget: 4500,
      standard: 9000,
      luxury: 22000,
      ultraLuxury: 55000
    },
    food: {
      budget: 1600,
      standard: 3200,
      luxury: 7500
    },
    transport: {
      budget: 900,
      standard: 1600,
      luxury: 3800
    },
    activities: {
      budget: 2200,
      standard: 5500,
      luxury: 13000
    },
    seasonal: {
      peak: 1.4,
      shoulder: 1.1,
      low: 0.85
    }
  },

  // ========== SOUTHEAST ASIA ==========
  "Bangkok": {
    country: "Thailand",
    region: "Southeast Asia",
    flight: {
      min: 15000,
      avg: 22000,
      max: 40000
    },
    hotel: {
      budget: 1200,
      standard: 2800,
      luxury: 7000,
      ultraLuxury: 18000
    },
    food: {
      budget: 600,
      standard: 1200,
      luxury: 3000
    },
    transport: {
      budget: 300,
      standard: 600,
      luxury: 1500
    },
    activities: {
      budget: 800,
      standard: 2000,
      luxury: 5000
    },
    seasonal: {
      peak: 1.35,
      shoulder: 1.1,
      low: 0.9
    }
  },

  "Singapore": {
    country: "Singapore",
    region: "Southeast Asia",
    flight: {
      min: 18000,
      avg: 28000,
      max: 50000
    },
    hotel: {
      budget: 4500,
      standard: 9000,
      luxury: 18000,
      ultraLuxury: 40000
    },
    food: {
      budget: 1500,
      standard: 2800,
      luxury: 6000
    },
    transport: {
      budget: 800,
      standard: 1200,
      luxury: 2500
    },
    activities: {
      budget: 1800,
      standard: 3500,
      luxury: 8000
    },
    seasonal: {
      peak: 1.25,
      shoulder: 1.1,
      low: 0.95
    }
  },

  "Bali": {
    country: "Indonesia",
    region: "Southeast Asia",
    flight: {
      min: 20000,
      avg: 30000,
      max: 55000
    },
    hotel: {
      budget: 1500,
      standard: 3500,
      luxury: 9000,
      ultraLuxury: 25000
    },
    food: {
      budget: 700,
      standard: 1400,
      luxury: 3500
    },
    transport: {
      budget: 400,
      standard: 800,
      luxury: 2000
    },
    activities: {
      budget: 1000,
      standard: 2500,
      luxury: 6000
    },
    seasonal: {
      peak: 1.5,
      shoulder: 1.15,
      low: 0.85
    }
  },

  // ========== EUROPE ==========
  "Paris": {
    country: "France",
    region: "Europe",
    flight: {
      min: 40000,
      avg: 55000,
      max: 90000,
      description: "Long-haul from India"
    },
    hotel: {
      budget: 6000,
      standard: 12000,
      luxury: 25000,
      ultraLuxury: 60000
    },
    food: {
      budget: 2500,
      standard: 4500,
      luxury: 10000
    },
    transport: {
      budget: 1000,
      standard: 2000,
      luxury: 4500
    },
    activities: {
      budget: 2000,
      standard: 4500,
      luxury: 10000
    },
    seasonal: {
      peak: 1.6,         // Jun-Aug, Dec
      shoulder: 1.2,
      low: 0.85
    }
  },

  "London": {
    country: "UK",
    region: "Europe",
    flight: {
      min: 42000,
      avg: 58000,
      max: 95000
    },
    hotel: {
      budget: 7000,
      standard: 14000,
      luxury: 28000,
      ultraLuxury: 70000
    },
    food: {
      budget: 2800,
      standard: 5000,
      luxury: 11000
    },
    transport: {
      budget: 1200,
      standard: 2200,
      luxury: 5000
    },
    activities: {
      budget: 2200,
      standard: 5000,
      luxury: 11000
    },
    seasonal: {
      peak: 1.7,
      shoulder: 1.25,
      low: 0.8
    }
  },

  "Amsterdam": {
    country: "Netherlands",
    region: "Europe",
    flight: {
      min: 38000,
      avg: 52000,
      max: 85000
    },
    hotel: {
      budget: 5500,
      standard: 11000,
      luxury: 22000,
      ultraLuxury: 55000
    },
    food: {
      budget: 2200,
      standard: 4000,
      luxury: 9000
    },
    transport: {
      budget: 900,
      standard: 1800,
      luxury: 4000
    },
    activities: {
      budget: 1800,
      standard: 4000,
      luxury: 9000
    },
    seasonal: {
      peak: 1.5,
      shoulder: 1.2,
      low: 0.85
    }
  },

  // ========== NORTH AMERICA ==========
  "New York": {
    country: "USA",
    region: "North America",
    flight: {
      min: 55000,
      avg: 75000,
      max: 150000,
      description: "Ultra long-haul from India"
    },
    hotel: {
      budget: 10000,
      standard: 20000,
      luxury: 40000,
      ultraLuxury: 100000
    },
    food: {
      budget: 3500,
      standard: 6000,
      luxury: 14000
    },
    transport: {
      budget: 1500,
      standard: 2500,
      luxury: 5500
    },
    activities: {
      budget: 2500,
      standard: 5500,
      luxury: 12000
    },
    seasonal: {
      peak: 1.8,
      shoulder: 1.3,
      low: 0.85
    }
  },

  "Los Angeles": {
    country: "USA",
    region: "North America",
    flight: {
      min: 60000,
      avg: 80000,
      max: 160000
    },
    hotel: {
      budget: 9000,
      standard: 18000,
      luxury: 35000,
      ultraLuxury: 90000
    },
    food: {
      budget: 3200,
      standard: 5500,
      luxury: 13000
    },
    transport: {
      budget: 1800,
      standard: 3000,
      luxury: 6500
    },
    activities: {
      budget: 2800,
      standard: 6000,
      luxury: 13000
    },
    seasonal: {
      peak: 1.7,
      shoulder: 1.25,
      low: 0.9
    }
  },

  // ========== AUSTRALIA/OCEANIA ==========
  "Sydney": {
    country: "Australia",
    region: "Oceania",
    flight: {
      min: 50000,
      avg: 70000,
      max: 140000
    },
    hotel: {
      budget: 8000,
      standard: 15000,
      luxury: 30000,
      ultraLuxury: 75000
    },
    food: {
      budget: 3000,
      standard: 5500,
      luxury: 12000
    },
    transport: {
      budget: 1400,
      standard: 2500,
      luxury: 5500
    },
    activities: {
      budget: 2500,
      standard: 5000,
      luxury: 11000
    },
    seasonal: {
      peak: 1.6,
      shoulder: 1.2,
      low: 0.85
    }
  },

  "Melbourne": {
    country: "Australia",
    region: "Oceania",
    flight: {
      min: 52000,
      avg: 72000,
      max: 145000
    },
    hotel: {
      budget: 7500,
      standard: 14000,
      luxury: 28000,
      ultraLuxury: 70000
    },
    food: {
      budget: 2800,
      standard: 5200,
      luxury: 11500
    },
    transport: {
      budget: 1300,
      standard: 2400,
      luxury: 5200
    },
    activities: {
      budget: 2400,
      standard: 4800,
      luxury: 10500
    },
    seasonal: {
      peak: 1.55,
      shoulder: 1.2,
      low: 0.85
    }
  },

  // ========== EAST ASIA ==========
  "Tokyo": {
    country: "Japan",
    region: "East Asia",
    flight: {
      min: 35000,
      avg: 50000,
      max: 90000
    },
    hotel: {
      budget: 4000,
      standard: 8500,
      luxury: 18000,
      ultraLuxury: 45000
    },
    food: {
      budget: 1800,
      standard: 3500,
      luxury: 8000
    },
    transport: {
      budget: 1000,
      standard: 1800,
      luxury: 4000
    },
    activities: {
      budget: 1800,
      standard: 4000,
      luxury: 9000
    },
    seasonal: {
      peak: 1.8,         // Cherry blossom, Golden Week
      shoulder: 1.25,
      low: 0.85
    }
  },

  "Seoul": {
    country: "South Korea",
    region: "East Asia",
    flight: {
      min: 32000,
      avg: 45000,
      max: 80000
    },
    hotel: {
      budget: 3500,
      standard: 7500,
      luxury: 16000,
      ultraLuxury: 40000
    },
    food: {
      budget: 1500,
      standard: 3000,
      luxury: 7000
    },
    transport: {
      budget: 800,
      standard: 1500,
      luxury: 3500
    },
    activities: {
      budget: 1600,
      standard: 3500,
      luxury: 8000
    },
    seasonal: {
      peak: 1.5,
      shoulder: 1.15,
      low: 0.9
    }
  },

  // ========== MALDIVES (POPULAR HONEYMOON) ==========
  "Maldives": {
    country: "Maldives",
    region: "South Asia",
    flight: {
      min: 22000,
      avg: 35000,
      max: 65000
    },
    hotel: {
      budget: 15000,     // Budget guesthouses
      standard: 30000,   // Standard resorts
      luxury: 80000,     // Luxury water villas
      ultraLuxury: 200000 // Ultra-luxury resorts
    },
    food: {
      budget: 2000,
      standard: 4000,
      luxury: 10000
    },
    transport: {
      budget: 2000,      // Speedboat transfers
      standard: 4000,    // Seaplane transfers
      luxury: 8000       // Private yacht
    },
    activities: {
      budget: 2500,
      standard: 6000,
      luxury: 15000
    },
    seasonal: {
      peak: 1.7,         // Nov-Apr (dry season)
      shoulder: 1.2,
      low: 0.75          // May-Oct (monsoon)
    }
  }
};

/**
 * Travel style multipliers for budget calculations
 */
export const TRAVEL_STYLE_MULTIPLIERS = {
  budget: {
    hotel: 1.0,
    food: 1.0,
    transport: 1.0,
    activities: 1.0,
    description: "Budget-conscious travel, hostels, street food"
  },
  standard: {
    hotel: 1.0,        // Use standard prices as baseline
    food: 1.0,
    transport: 1.0,
    activities: 1.0,
    description: "Comfortable mid-range travel"
  },
  luxury: {
    hotel: 1.0,
    food: 1.0,
    transport: 1.0,
    activities: 1.0,
    description: "Luxury hotels, fine dining, private transport"
  },
  "ultra-luxury": {
    hotel: 1.0,
    food: 1.0,
    transport: 1.0,
    activities: 1.0,
    description: "Ultra-luxury resorts, Michelin dining, exclusive experiences"
  }
};

/**
 * Buffer and contingency percentages
 */
export const BUDGET_ADJUSTMENTS = {
  buffer: 0.10,              // 10% safety buffer
  shopping: 0.15,            // 15% for shopping/souvenirs
  miscellaneous: 0.05,       // 5% for unexpected expenses
  visa: {
    "Dubai": 3000,
    "Singapore": 5000,
    "Thailand": 2500,
    "USA": 15000,
    "UK": 12000,
    "Europe": 8000,
    "Australia": 10000,
    "default": 5000
  },
  insurance: {
    perDay: 150,             // Daily travel insurance
    minimum: 1000
  }
};

/**
 * Get supported destinations list
 */
export function getSupportedDestinations() {
  return Object.keys(TRAVEL_PRICES).sort();
}

/**
 * Get destination data
 */
export function getDestinationData(destination) {
  return TRAVEL_PRICES[destination] || null;
}

/**
 * Check if destination is supported
 */
export function isDestinationSupported(destination) {
  return destination in TRAVEL_PRICES;
}

export default TRAVEL_PRICES;
