/**
 * Loan Calculator Constants
 * Centralizes all magic numbers, configurations, and enums
 */

// Loan Types Configuration
export const LOAN_TYPES = {
  AUTO: {
    value: 'auto',
    label: 'Auto Loan',
    icon: '🚗',
    minRate: 3,
    maxRate: 12,
    typicalRate: 6.5
  },
  PERSONAL: {
    value: 'personal',
    label: 'Personal Loan',
    icon: '💰',
    minRate: 6,
    maxRate: 36,
    typicalRate: 12
  },
  STUDENT: {
    value: 'student',
    label: 'Student Loan',
    icon: '🎓',
    minRate: 3,
    maxRate: 13,
    typicalRate: 5.5
  },
  HOME_EQUITY: {
    value: 'home-equity',
    label: 'Home Equity Loan',
    icon: '🏠',
    minRate: 5,
    maxRate: 12,
    typicalRate: 7.5
  },
  BUSINESS: {
    value: 'business',
    label: 'Business Loan',
    icon: '💼',
    minRate: 6,
    maxRate: 30,
    typicalRate: 10
  },
  OTHER: {
    value: 'other',
    label: 'Other Loan',
    icon: '📋',
    minRate: 5,
    maxRate: 20,
    typicalRate: 10
  }
};

// Input Constraints
export const LOAN_AMOUNT = {
  MIN: 1000,
  MAX: 1000000,
  DEFAULT: 10000,
  STEP: 1000
};

export const INTEREST_RATE = {
  MIN: 0,
  MAX: 36,
  DEFAULT: 7.5,
  STEP: 0.1
};

export const LOAN_TERM = {
  MIN: 1,
  MAX: 30,
  DEFAULT: 5,
  STEP: 1
};

export const START_YEAR = {
  MIN: 2020,
  MAX: 2100
};

// UI Constants
export const DEBOUNCE_DELAY = 300;
export const MOBILE_BREAKPOINT = 768;
export const DEFAULT_MONTH_LIMIT = 24;

// Thresholds for warnings
export const HIGH_INTEREST_THRESHOLD = 0.5; // 50% of loan amount
export const LONG_TERM_THRESHOLD = 7; // years
export const REFINANCE_OPPORTUNITY_RATE_DROP = 1; // percentage points

// Extra payment savings estimates (percentage of total interest)
export const EXTRA_PAYMENT_SAVINGS = {
  SMALL: { amount: 100, savingsPercent: 0.12 },
  MEDIUM: { amount: 250, savingsPercent: 0.25 }
};

// Color Scheme
export const COLORS = {
  PRIMARY: '#667eea',
  PRIMARY_DARK: '#764ba2',
  SUCCESS: '#16a34a',
  SUCCESS_LIGHT: '#22c55e',
  WARNING: '#f59e0b',
  WARNING_LIGHT: '#fbbf24',
  DANGER: '#dc2626',
  DANGER_LIGHT: '#ef4444',
  INFO: '#2563eb',
  INFO_LIGHT: '#3b82f6',
  PURPLE: '#9333ea',
  NEUTRAL: '#64748b',
  DARK: '#1e293b',
  BORDER: '#e2e8f0'
};

// Months Array
export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Amortization View Types
export const AMORTIZATION_VIEWS = {
  YEARLY: 'yearly',
  MONTHLY: 'monthly'
};

// Default Start Date
export const DEFAULT_START_DATE = {
  month: 'Dec',
  year: 2025
};

// FAQ Schema Data
export const FAQ_SCHEMA = [
  {
    question: "What is a loan payment?",
    answer: "The amount you pay monthly to repay a loan, including both principal and interest."
  },
  {
    question: "How is US loan interest calculated?",
    answer: "Most US loans use monthly compounding and fixed rates for the life of the loan."
  },
  {
    question: "What affects my loan rate?",
    answer: "Credit score, loan amount, loan term, purpose, and current market rates all influence your interest rate."
  },
  {
    question: "Can I pay off my loan early?",
    answer: "Yes, most loans allow early repayment without penalties, which can save you significant interest."
  },
  {
    question: "What's the difference between fixed and variable rates?",
    answer: "Fixed rates stay the same throughout the loan term, while variable rates can change based on market conditions."
  }
];
