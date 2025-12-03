/**
 * Sample data for demo purposes
 * Users can click "Use Sample Data" to auto-fill the form
 */

export const sampleData = {
  currency: "INR",
  monthly_income_primary: 75000,
  monthly_income_additional: 5000,
  expenses: {
    housing_rent: 20000,
    groceries_food: 12000,
    transport: 5000,
    utilities: 3000,
    insurance: 2500,
    entertainment: 4000,
    subscriptions: 1500,
    others: 3000,
  },
  goals: {
    monthly_savings_target: 15000,
    emergency_fund_target: 300000,
    primary_goal_type: "Home",
    primary_goal_amount: 2000000,
  },
  loans: [
    {
      name: "Car Loan",
      input_mode: "emi",
      monthly_emi: 12764,
      interest_rate_annual: 8.5,
      remaining_months: 36,
    },
  ],
};

/**
 * Goal type options for dropdown
 */
export const goalTypes = [
  { value: "", label: "Select Goal Type" },
  { value: "Home", label: "Home Purchase" },
  { value: "Car", label: "Car Purchase" },
  { value: "Travel", label: "Travel/Vacation" },
  { value: "Education", label: "Education" },
  { value: "Marriage", label: "Marriage/Wedding" },
  { value: "Retirement", label: "Retirement Planning" },
  { value: "Other", label: "Other" },
];

/**
 * Currency options
 */
export const currencies = [
  { value: "INR", label: "₹ INR (Indian Rupee)", symbol: "₹", locale: "en-IN" },
  { value: "USD", label: "$ USD (US Dollar)", symbol: "$", locale: "en-US" },
  { value: "EUR", label: "€ EUR (Euro)", symbol: "€", locale: "de-DE" },
  { value: "GBP", label: "£ GBP (British Pound)", symbol: "£", locale: "en-GB" },
  { value: "AUD", label: "A$ AUD (Australian Dollar)", symbol: "A$", locale: "en-AU" },
  { value: "CAD", label: "C$ CAD (Canadian Dollar)", symbol: "C$", locale: "en-CA" },
  { value: "SGD", label: "S$ SGD (Singapore Dollar)", symbol: "S$", locale: "en-SG" },
  { value: "AED", label: "د.إ AED (UAE Dirham)", symbol: "د.إ", locale: "ar-AE" },
  { value: "JPY", label: "¥ JPY (Japanese Yen)", symbol: "¥", locale: "ja-JP" },
  { value: "CNY", label: "¥ CNY (Chinese Yuan)", symbol: "¥", locale: "zh-CN" },
];

/**
 * Get currency symbol by code
 */
export const getCurrencySymbol = (currencyCode) => {
  const currency = currencies.find(c => c.value === currencyCode);
  return currency ? currency.symbol : currencyCode;
};

/**
 * Get currency locale by code
 */
export const getCurrencyLocale = (currencyCode) => {
  const currency = currencies.find(c => c.value === currencyCode);
  return currency ? currency.locale : 'en-IN';
};

/**
 * Format number with locale-specific formatting
 */
export const formatNumber = (num, currencyCode = "INR") => {
  if (num === null || num === undefined) return "0";
  
  const number = parseFloat(num);
  if (isNaN(number)) return "0";
  
  const locale = getCurrencyLocale(currencyCode);
  return number.toLocaleString(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

/**
 * @deprecated Use formatNumber instead
 * Format number with commas for Indian numbering system
 */
export const formatIndianNumber = (num) => {
  return formatNumber(num, "INR");
};

/**
 * Format currency with symbol
 */
export const formatCurrency = (amount, currencyCode = "INR") => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${formatNumber(amount, currencyCode)}`;
};

/**
 * Format large numbers with abbreviations (K, L, Cr)
 * For responsive display on mobile devices
 */
export const formatCompactNumber = (num, currencyCode = "INR") => {
  if (num === null || num === undefined) return "0";
  
  const number = parseFloat(num);
  if (isNaN(number)) return "0";
  
  const symbol = getCurrencySymbol(currencyCode);
  const absNum = Math.abs(number);
  
  // For Indian system: Crore (10M), Lakh (100K), Thousand
  if (absNum >= 10000000) {
    return `${symbol}${(number / 10000000).toFixed(2)}Cr`;
  } else if (absNum >= 100000) {
    return `${symbol}${(number / 100000).toFixed(2)}L`;
  } else if (absNum >= 1000) {
    return `${symbol}${(number / 1000).toFixed(2)}K`;
  }
  
  return `${symbol}${formatIndianNumber(number)}`;
};

/**
 * Smart currency formatter - uses compact format on mobile
 */
export const formatSmartCurrency = (amount, currencyCode = "INR") => {
  // Check if mobile device (screen width < 768px)
  const isMobile = window.innerWidth < 768;
  const absAmount = Math.abs(parseFloat(amount));
  
  // Use compact format on mobile for large numbers
  if (isMobile && absAmount >= 100000) {
    return formatCompactNumber(amount, currencyCode);
  }
  
  // Use full format otherwise
  return formatCurrency(amount, currencyCode);
};
