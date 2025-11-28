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
    emi_loans: 8000,
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
      outstanding_principal: 400000,
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
  { value: "INR", label: "₹ INR (Indian Rupee)", symbol: "₹" },
  { value: "USD", label: "$ USD (US Dollar)", symbol: "$" },
  { value: "EUR", label: "€ EUR (Euro)", symbol: "€" },
  { value: "GBP", label: "£ GBP (British Pound)", symbol: "£" },
];

/**
 * Get currency symbol by code
 */
export const getCurrencySymbol = (currencyCode) => {
  const currency = currencies.find(c => c.value === currencyCode);
  return currency ? currency.symbol : currencyCode;
};

/**
 * Format number with commas for Indian numbering system
 */
export const formatIndianNumber = (num) => {
  if (num === null || num === undefined) return "0";
  
  const number = parseFloat(num);
  if (isNaN(number)) return "0";
  
  // Indian numbering system: XX,XX,XXX
  return number.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

/**
 * Format currency with symbol
 */
export const formatCurrency = (amount, currencyCode = "INR") => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${formatIndianNumber(amount)}`;
};
