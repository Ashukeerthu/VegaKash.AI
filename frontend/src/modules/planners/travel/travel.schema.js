/**
 * Travel Budget Validation Schema
 * Defines validation rules and default values for travel budget planning
 */

export const travelSchema = {
  // Trip Information
  tripInfo: {
    originCity: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      label: 'Your City',
      placeholder: 'e.g., New York, Mumbai, London',
      helpText: 'City you are traveling from'
    },
    originCountry: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      label: 'Your Country',
      placeholder: 'e.g., USA, India, UK',
      helpText: 'Country you are traveling from'
    },
    destinationCity: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      label: 'Destination City',
      placeholder: 'e.g., Paris, Tokyo, Dubai',
      helpText: 'Main city you are visiting'
    },
    destinationCountry: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      label: 'Destination Country',
      placeholder: 'e.g., France, Japan, UAE',
      helpText: 'Country you are visiting'
    },
    additionalDestinations: {
      type: 'string',
      required: false,
      maxLength: 200,
      label: 'Additional Destinations (Optional)',
      placeholder: 'e.g., Rome, Barcelona',
      helpText: 'Other cities in the same trip separated by commas'
    },
    startDate: {
      type: 'date',
      required: true,
      label: 'Start Date',
      min: new Date().toISOString().split('T')[0],
    },
    endDate: {
      type: 'date',
      required: true,
      label: 'End Date',
      min: new Date().toISOString().split('T')[0],
    },
    adults: {
      type: 'number',
      required: true,
      min: 1,
      max: 20,
      default: 2,
      label: 'Number of Adults',
      helpText: 'Age 18+'
    },
    children: {
      type: 'number',
      required: false,
      min: 0,
      max: 10,
      default: 0,
      label: 'Number of Children',
      helpText: 'Age 2-17'
    },
    infants: {
      type: 'number',
      required: false,
      min: 0,
      max: 5,
      default: 0,
      label: 'Number of Infants',
      helpText: 'Age 0-2'
    }
  },

  // Travel Style
  travelStyle: {
    type: 'select',
    required: true,
    default: 'standard',
    label: 'Travel Style',
    options: [
      { value: 'budget', label: 'Budget Traveler', icon: '🎒', description: 'Hostels, street food, public transport' },
      { value: 'standard', label: 'Standard', icon: '🏨', description: '3-star hotels, mid-range restaurants' },
      { value: 'luxury', label: 'Luxury', icon: '✨', description: '4-5 star hotels, fine dining' },
      { value: 'ultra-luxury', label: 'Ultra Luxury', icon: '💎', description: 'Premium hotels, exclusive experiences' }
    ]
  },

  // Trip Theme
  tripTheme: {
    type: 'multi-select',
    required: false,
    label: 'Trip Theme(s)',
    options: [
      { value: 'adventure', label: 'Adventure', icon: '🏔️' },
      { value: 'wildlife', label: 'Wildlife Safari', icon: '🦁' },
      { value: 'beaches', label: 'Beaches & Relaxation', icon: '🏖️' },
      { value: 'heritage', label: 'Heritage & Culture', icon: '🏛️' },
      { value: 'nightlife', label: 'Nightlife & Entertainment', icon: '🎉' },
      { value: 'food', label: 'Food & Culinary', icon: '🍜' },
      { value: 'shopping', label: 'Shopping', icon: '🛍️' },
      { value: 'spiritual', label: 'Spiritual', icon: '🕉️' },
      { value: 'family', label: 'Family Fun', icon: '👨‍👩‍👧‍👦' },
      { value: 'romantic', label: 'Romantic Getaway', icon: '💑' }
    ]
  },

  // Local Transport
  localTransport: {
    type: 'select',
    required: true,
    default: 'mix',
    label: 'Local Transportation',
    options: [
      { value: 'public', label: 'Public Transport', icon: '🚇', description: 'Bus, metro, train' },
      { value: 'taxi', label: 'Taxis & Ride-shares', icon: '🚕', description: 'Uber, local taxis' },
      { value: 'rental', label: 'Rental Car', icon: '🚗', description: 'Self-drive' },
      { value: 'mix', label: 'Mixed', icon: '🚌', description: 'Combination of options' }
    ]
  },

  // Currency
  homeCurrency: {
    type: 'select',
    required: true,
    default: 'USD',
    label: 'Your Currency',
    options: [
      { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
      { value: 'EUR', label: 'Euro (€)', symbol: '€' },
      { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
      { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
      { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
      { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
      { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
      { value: 'CNY', label: 'Chinese Yuan (¥)', symbol: '¥' },
      { value: 'AED', label: 'UAE Dirham (د.إ)', symbol: 'د.إ' }
    ]
  },

  // Budget Preferences
  includeFlights: {
    type: 'boolean',
    default: true,
    label: 'Include Flight Costs'
  },
  includeVisa: {
    type: 'boolean',
    default: false,
    label: 'Include Visa Fees'
  },
  includeInsurance: {
    type: 'boolean',
    default: true,
    label: 'Include Travel Insurance'
  },
  bufferPercentage: {
    type: 'number',
    min: 0,
    max: 50,
    default: 10,
    label: 'Emergency Buffer (%)',
    helpText: 'Extra cushion for unexpected expenses'
  },

  // Itinerary Detail Level
  itineraryDetailLevel: {
    type: 'select',
    required: true,
    default: 'standard',
    label: 'Itinerary Detail Level',
    helpText: 'Choose how detailed you want the day-by-day itinerary to be',
    options: [
      { 
        value: 'brief', 
        label: 'Brief', 
        icon: '⚡',
        description: 'Quick overview with main attractions only' 
      },
      { 
        value: 'standard', 
        label: 'Standard', 
        icon: '📋',
        description: 'Balanced itinerary with activities, times, and tips (recommended)' 
      },
      { 
        value: 'detailed', 
        label: 'Detailed', 
        icon: '📖',
        description: 'Comprehensive with landmarks, cuisines, maps, and deep insights' 
      }
    ]
  }
};

/**
 * Validation function
 */
export const validateTravelForm = (formData) => {
  const errors = {};

  // Validate origin
  if (!formData.originCity || formData.originCity.trim().length < 2) {
    errors.originCity = 'Your city is required (min 2 characters)';
  }
  if (!formData.originCountry || formData.originCountry.trim().length < 2) {
    errors.originCountry = 'Your country is required (min 2 characters)';
  }

  // Validate destination
  if (!formData.destinationCity || formData.destinationCity.trim().length < 2) {
    errors.destinationCity = 'Destination city is required (min 2 characters)';
  }
  if (!formData.destinationCountry || formData.destinationCountry.trim().length < 2) {
    errors.destinationCountry = 'Destination country is required (min 2 characters)';
  }

  // Validate dates
  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }
  if (!formData.endDate) {
    errors.endDate = 'End date is required';
  }
  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end <= start) {
      errors.endDate = 'End date must be after start date';
    }
    const tripDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (tripDays > 365) {
      errors.endDate = 'Trip duration cannot exceed 365 days';
    }
  }

  // Validate travelers
  const totalTravelers = (formData.adults || 0) + (formData.children || 0) + (formData.infants || 0);
  if (totalTravelers === 0) {
    errors.adults = 'At least one traveler is required';
  }
  if (totalTravelers > 20) {
    errors.adults = 'Maximum 20 travelers allowed';
  }

  // Validate required fields
  if (!formData.travelStyle) {
    errors.travelStyle = 'Travel style is required';
  }
  if (!formData.localTransport) {
    errors.localTransport = 'Local transport preference is required';
  }
  if (!formData.homeCurrency) {
    errors.homeCurrency = 'Currency selection is required';
  }
  if (!formData.itineraryDetailLevel) {
    errors.itineraryDetailLevel = 'Itinerary detail level is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Default form values
 */
export const defaultTravelFormValues = {
  originCity: '',
  originCountry: '',
  destinationCity: '',
  destinationCountry: '',
  additionalDestinations: '',
  startDate: '',
  endDate: '',
  adults: 2,
  children: 0,
  infants: 0,
  travelStyle: 'standard',
  tripTheme: [],
  localTransport: 'mix',
  homeCurrency: 'USD',
  includeFlights: true,
  includeVisa: false,
  includeInsurance: true,
  bufferPercentage: 10,
  itineraryDetailLevel: 'standard'
};

/**
 * Helper: Calculate trip duration in days
 */
export const calculateTripDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
};

/**
 * Helper: Get total traveler count
 */
export const getTotalTravelers = (adults, children, infants) => {
  return (adults || 0) + (children || 0) + (infants || 0);
};

/**
 * Helper: Format currency
 */
export const formatCurrency = (amount, currency) => {
  const symbols = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$',
    CAD: 'C$', JPY: '¥', CNY: '¥', AED: 'د.إ'
  };
  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
