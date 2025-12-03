/**
 * Core Utilities Module - Centralized Export
 * 
 * @module modules/core/utils
 * @description Utility functions used across the application
 */

/**
 * Format number as Indian currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format number with Indian number system (lakhs/crores)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatIndianNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Calculate EMI
 * @param {number} principal - Loan amount
 * @param {number} rate - Annual interest rate (percentage)
 * @param {number} tenure - Tenure in months
 * @returns {number} Monthly EMI
 */
export const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

/**
 * Calculate SIP returns
 * @param {number} monthlyInvestment - Monthly SIP amount
 * @param {number} annualReturn - Expected annual return (percentage)
 * @param {number} years - Investment period in years
 * @returns {Object} Investment details
 */
export const calculateSIP = (monthlyInvestment, annualReturn, years) => {
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  
  const futureValue = monthlyInvestment * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate);
  
  const invested = monthlyInvestment * months;
  const returns = futureValue - invested;
  
  return {
    invested: Math.round(invested),
    returns: Math.round(returns),
    total: Math.round(futureValue)
  };
};

/**
 * Calculate FD maturity
 * @param {number} principal - FD amount
 * @param {number} rate - Annual interest rate (percentage)
 * @param {number} years - Tenure in years
 * @param {string} frequency - Compounding frequency (quarterly, half-yearly, yearly)
 * @returns {Object} Maturity details
 */
export const calculateFD = (principal, rate, years, frequency = 'quarterly') => {
  const frequencies = {
    'quarterly': 4,
    'half-yearly': 2,
    'yearly': 1,
    'monthly': 12
  };
  
  const n = frequencies[frequency] || 4;
  const r = rate / 100;
  const t = years;
  
  const maturityAmount = principal * Math.pow(1 + (r / n), n * t);
  const interest = maturityAmount - principal;
  
  return {
    principal: Math.round(principal),
    interest: Math.round(interest),
    maturity: Math.round(maturityAmount)
  };
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage
 */
export const getPercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
};
