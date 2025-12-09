/**
 * Travel Budget Calculator Service
 * 
 * Calculates travel budget using historical price data and smart formulas
 * NO third-party API calls - all calculations done locally
 * 
 * @module services/travelBudgetService
 */

import {
  TRAVEL_PRICES,
  TRAVEL_STYLE_MULTIPLIERS,
  BUDGET_ADJUSTMENTS,
  getDestinationData,
  isDestinationSupported
} from '../data/travelPrices';

/**
 * Calculate number of nights from date range
 * @param {Date|string} startDate - Trip start date
 * @param {Date|string} endDate - Trip end date
 * @returns {number} Number of nights
 */
export function calculateNights(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Determine season based on month
 * @param {Date|string} travelDate - Date of travel
 * @param {string} destination - Destination name
 * @returns {string} 'peak', 'shoulder', or 'low'
 */
export function determineSeason(travelDate, destination) {
  const date = new Date(travelDate);
  const month = date.getMonth() + 1; // 1-12
  
  const destData = getDestinationData(destination);
  if (!destData || !destData.seasonal) {
    return 'shoulder'; // Default
  }
  
  // General rules (can be customized per destination)
  if (destination === "Goa") {
    if (month >= 12 || month <= 2) return 'peak';    // Winter
    if (month >= 6 && month <= 8) return 'low';      // Monsoon
    return 'shoulder';
  }
  
  if (destination === "Dubai") {
    if (month >= 11 || month <= 3) return 'peak';    // Winter
    if (month >= 6 && month <= 8) return 'low';      // Summer
    return 'shoulder';
  }
  
  if (destination === "Maldives") {
    if (month >= 11 && month <= 4) return 'peak';    // Dry season
    return 'low';                                     // Monsoon
  }
  
  // Europe
  if (["Paris", "London", "Amsterdam"].includes(destination)) {
    if ((month >= 6 && month <= 8) || month === 12) return 'peak';
    if (month >= 1 && month <= 3) return 'low';
    return 'shoulder';
  }
  
  // Default seasonal pattern
  if (month >= 11 || month <= 2) return 'peak';
  if (month >= 6 && month <= 8) return 'low';
  return 'shoulder';
}

/**
 * Get seasonal multiplier
 * @param {string} season - 'peak', 'shoulder', or 'low'
 * @param {Object} destData - Destination data object
 * @returns {number} Multiplier (e.g., 1.4 for peak season)
 */
export function getSeasonalMultiplier(season, destData) {
  if (!destData || !destData.seasonal) return 1.0;
  return destData.seasonal[season] || 1.0;
}

/**
 * Calculate flight cost
 * @param {Object} destData - Destination data
 * @param {number} travelers - Number of travelers
 * @param {number} seasonMultiplier - Seasonal multiplier
 * @param {string} travelStyle - Travel style
 * @returns {Object} Flight cost breakdown
 */
export function calculateFlightCost(destData, travelers, seasonMultiplier, travelStyle) {
  const flight = destData.flight;
  
  // Base cost (average)
  let baseCost = flight.avg;
  
  // Apply travel style adjustments
  if (travelStyle === 'budget') {
    baseCost = flight.min * 1.1; // Budget airlines, slight markup
  } else if (travelStyle === 'luxury') {
    baseCost = flight.avg * 1.8; // Business class
  } else if (travelStyle === 'ultra-luxury') {
    baseCost = flight.max * 0.9; // First class
  }
  
  // Apply seasonal multiplier
  baseCost *= seasonMultiplier;
  
  // Total for all travelers
  const total = Math.round(baseCost * travelers);
  
  return {
    perPerson: Math.round(baseCost),
    total: total,
    low: Math.round(flight.min * travelers * seasonMultiplier),
    medium: total,
    high: Math.round(flight.max * travelers * seasonMultiplier)
  };
}

/**
 * Calculate accommodation cost
 * @param {Object} destData - Destination data
 * @param {number} nights - Number of nights
 * @param {number} travelers - Number of travelers
 * @param {string} travelStyle - Travel style
 * @param {number} seasonMultiplier - Seasonal multiplier
 * @returns {Object} Accommodation cost breakdown
 */
export function calculateAccommodationCost(destData, nights, travelers, travelStyle, seasonMultiplier) {
  const hotel = destData.hotel;
  
  // Get base price per night based on travel style
  let pricePerNight;
  if (travelStyle === 'budget') {
    pricePerNight = hotel.budget;
  } else if (travelStyle === 'luxury') {
    pricePerNight = hotel.luxury;
  } else if (travelStyle === 'ultra-luxury') {
    pricePerNight = hotel.ultraLuxury;
  } else {
    pricePerNight = hotel.standard;
  }
  
  // Apply seasonal multiplier
  pricePerNight *= seasonMultiplier;
  
  // Calculate number of rooms needed (2 people per room, round up)
  const rooms = Math.ceil(travelers / 2);
  
  // Total cost
  const total = Math.round(pricePerNight * nights * rooms);
  
  return {
    perNight: Math.round(pricePerNight),
    rooms: rooms,
    total: total
  };
}

/**
 * Calculate food cost
 * @param {Object} destData - Destination data
 * @param {number} days - Number of days (nights + 1)
 * @param {number} travelers - Number of travelers
 * @param {string} travelStyle - Travel style
 * @returns {Object} Food cost breakdown
 */
export function calculateFoodCost(destData, days, travelers, travelStyle) {
  const food = destData.food;
  
  // Get daily rate based on travel style
  let dailyRate;
  if (travelStyle === 'budget') {
    dailyRate = food.budget;
  } else if (travelStyle === 'luxury') {
    dailyRate = food.luxury;
  } else if (travelStyle === 'ultra-luxury') {
    dailyRate = food.luxury * 1.3;
  } else {
    dailyRate = food.standard;
  }
  
  // Total for all travelers and days
  const total = Math.round(dailyRate * days * travelers);
  
  return {
    perDay: Math.round(dailyRate),
    total: total
  };
}

/**
 * Calculate local transport cost
 * @param {Object} destData - Destination data
 * @param {number} days - Number of days
 * @param {number} travelers - Number of travelers
 * @param {string} travelStyle - Travel style
 * @returns {Object} Transport cost breakdown
 */
export function calculateTransportCost(destData, days, travelers, travelStyle) {
  const transport = destData.transport;
  
  // Get daily rate based on travel style
  let dailyRate;
  if (travelStyle === 'budget') {
    dailyRate = transport.budget;
  } else if (travelStyle === 'luxury') {
    dailyRate = transport.luxury;
  } else if (travelStyle === 'ultra-luxury') {
    dailyRate = transport.luxury * 1.2;
  } else {
    dailyRate = transport.standard;
  }
  
  // Total for all travelers and days
  const total = Math.round(dailyRate * days * travelers);
  
  return {
    perDay: Math.round(dailyRate),
    total: total
  };
}

/**
 * Calculate activities cost
 * @param {Object} destData - Destination data
 * @param {number} days - Number of days
 * @param {number} travelers - Number of travelers
 * @param {string} travelStyle - Travel style
 * @returns {Object} Activities cost breakdown
 */
export function calculateActivitiesCost(destData, days, travelers, travelStyle) {
  const activities = destData.activities;
  
  // Get daily rate based on travel style
  let dailyRate;
  if (travelStyle === 'budget') {
    dailyRate = activities.budget;
  } else if (travelStyle === 'luxury') {
    dailyRate = activities.luxury;
  } else if (travelStyle === 'ultra-luxury') {
    dailyRate = activities.luxury * 1.3;
  } else {
    dailyRate = activities.standard;
  }
  
  // Activities are not daily - assume 70% of days have paid activities
  const activeDays = Math.ceil(days * 0.7);
  const total = Math.round(dailyRate * activeDays * travelers);
  
  return {
    perDay: Math.round(dailyRate),
    total: total
  };
}

/**
 * Calculate shopping and miscellaneous costs
 * @param {number} subtotal - Subtotal of main expenses
 * @param {number} travelers - Number of travelers
 * @returns {Object} Additional costs
 */
export function calculateAdditionalCosts(subtotal, travelers) {
  const shopping = Math.round(subtotal * BUDGET_ADJUSTMENTS.shopping);
  const miscellaneous = Math.round(subtotal * BUDGET_ADJUSTMENTS.miscellaneous);
  
  return {
    shopping: shopping,
    miscellaneous: miscellaneous
  };
}

/**
 * Calculate visa cost (if applicable)
 * @param {string} destination - Destination name
 * @param {number} travelers - Number of travelers
 * @param {boolean} includeVisa - Whether to include visa cost
 * @returns {number} Visa cost
 */
export function calculateVisaCost(destination, travelers, includeVisa = false) {
  if (!includeVisa) return 0;
  
  const destData = getDestinationData(destination);
  if (!destData) return 0;
  
  const country = destData.country;
  const region = destData.region;
  
  // Indian passport holders
  if (country === "India") return 0; // Domestic travel
  
  let visaCost = BUDGET_ADJUSTMENTS.visa.default;
  
  // Check specific visa costs
  if (destination in BUDGET_ADJUSTMENTS.visa) {
    visaCost = BUDGET_ADJUSTMENTS.visa[destination];
  } else if (region === "Middle East") {
    visaCost = BUDGET_ADJUSTMENTS.visa["Dubai"];
  } else if (region === "Southeast Asia") {
    visaCost = BUDGET_ADJUSTMENTS.visa["Thailand"];
  } else if (region === "Europe") {
    visaCost = BUDGET_ADJUSTMENTS.visa["Europe"];
  }
  
  return Math.round(visaCost * travelers);
}

/**
 * Calculate travel insurance cost
 * @param {number} days - Number of days
 * @param {number} travelers - Number of travelers
 * @param {boolean} includeInsurance - Whether to include insurance
 * @returns {number} Insurance cost
 */
export function calculateInsuranceCost(days, travelers, includeInsurance = true) {
  if (!includeInsurance) return 0;
  
  const perPersonCost = Math.max(
    BUDGET_ADJUSTMENTS.insurance.perDay * days,
    BUDGET_ADJUSTMENTS.insurance.minimum
  );
  
  return Math.round(perPersonCost * travelers);
}

/**
 * MAIN FUNCTION: Calculate complete travel budget
 * @param {Object} params - Budget calculation parameters
 * @returns {Object} Complete budget breakdown
 */
export function calculateTravelBudget(params) {
  const {
    destination,
    startDate,
    endDate,
    travelers = 1,
    travelStyle = 'standard',
    includeVisa = false,
    includeInsurance = true,
    bufferPercentage = 10
  } = params;
  
  // Validation
  if (!destination) {
    throw new Error('Destination is required');
  }
  
  if (!isDestinationSupported(destination)) {
    return {
      error: true,
      message: `Sorry, we don't have pricing data for "${destination}" yet. Please choose from our supported destinations.`,
      supportedDestinations: Object.keys(TRAVEL_PRICES).sort()
    };
  }
  
  if (travelers <= 0) {
    throw new Error('Number of travelers must be greater than 0');
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) {
    throw new Error('End date must be after start date');
  }
  
  // Get destination data
  const destData = getDestinationData(destination);
  
  // Calculate trip details
  const nights = calculateNights(startDate, endDate);
  const days = nights + 1;
  
  // Determine season and multiplier
  const season = determineSeason(startDate, destination);
  const seasonMultiplier = getSeasonalMultiplier(season, destData);
  
  // Calculate each expense category
  const flight = calculateFlightCost(destData, travelers, seasonMultiplier, travelStyle);
  const accommodation = calculateAccommodationCost(destData, nights, travelers, travelStyle, seasonMultiplier);
  const food = calculateFoodCost(destData, days, travelers, travelStyle);
  const transport = calculateTransportCost(destData, days, travelers, travelStyle);
  const activities = calculateActivitiesCost(destData, days, travelers, travelStyle);
  
  // Calculate subtotal
  const subtotal = flight.total + accommodation.total + food.total + transport.total + activities.total;
  
  // Additional costs
  const additional = calculateAdditionalCosts(subtotal, travelers);
  const visa = calculateVisaCost(destination, travelers, includeVisa);
  const insurance = calculateInsuranceCost(days, travelers, includeInsurance);
  
  // Total before buffer
  const totalBeforeBuffer = subtotal + additional.shopping + additional.miscellaneous + visa + insurance;
  
  // Buffer
  const buffer = Math.round(totalBeforeBuffer * (bufferPercentage / 100));
  
  // Grand total
  const grandTotal = totalBeforeBuffer + buffer;
  
  // Per person and per day costs
  const perPerson = Math.round(grandTotal / travelers);
  const perDay = Math.round(grandTotal / days);
  
  // Return complete breakdown
  return {
    destination: destination,
    country: destData.country,
    region: destData.region,
    tripDetails: {
      startDate: startDate,
      endDate: endDate,
      nights: nights,
      days: days,
      travelers: travelers,
      travelStyle: travelStyle,
      season: season,
      seasonMultiplier: seasonMultiplier
    },
    expenses: {
      flight: flight,
      accommodation: accommodation,
      food: food,
      transport: transport,
      activities: activities,
      shopping: additional.shopping,
      miscellaneous: additional.miscellaneous,
      visa: visa,
      insurance: insurance
    },
    subtotal: subtotal,
    buffer: buffer,
    bufferPercentage: bufferPercentage,
    grandTotal: grandTotal,
    perPerson: perPerson,
    perDay: perDay,
    currency: 'INR',
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Generate budget summary text
 * @param {Object} budget - Budget object from calculateTravelBudget
 * @returns {string} Human-readable summary
 */
export function generateBudgetSummary(budget) {
  if (budget.error) {
    return budget.message;
  }
  
  const { destination, tripDetails, grandTotal, perPerson } = budget;
  const { nights, days, travelers, travelStyle, season } = tripDetails;
  
  return `Your ${nights}-night trip to ${destination} for ${travelers} traveler${travelers > 1 ? 's' : ''} ` +
         `in ${season} season with ${travelStyle} accommodation will cost approximately ₹${grandTotal.toLocaleString('en-IN')} ` +
         `(₹${perPerson.toLocaleString('en-IN')} per person).`;
}

export default {
  calculateTravelBudget,
  generateBudgetSummary,
  isDestinationSupported,
  getSupportedDestinations: () => Object.keys(TRAVEL_PRICES).sort()
};
