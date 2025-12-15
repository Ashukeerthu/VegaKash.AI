/**
 * Enhanced Global Route Configuration
 * 
 * @module router/routes
 * @description Production-grade route management with global country routing
 * 
 * NEW STRUCTURE:
 * ✅ Global default: /calculators/{tool}/
 * ✅ Country-specific: /{country}/calculators/{tool}/
 * ✅ Automatic hreflang + canonical generation
 * ✅ Backward compatible with legacy routes (301 redirects)
 */

import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

// Feedback Page
const FeedbackPage = lazy(() => import('../components/Feedback/FeedbackPage'));

// ==================== CALCULATOR IMPORTS ====================
// Global calculators (US, UK/EU)
const MortgageCalculatorUS = lazy(() => import('../pages/calculators/global/MortgageCalculatorUS'));
const LoanPaymentCalculatorUS = lazy(() => import('../pages/calculators/global/LoanPaymentCalculatorUS'));
const CreditCardPayoffCalculatorUS = lazy(() => import('../pages/calculators/global/CreditCardPayoffCalculatorUS'));
const Retirement401kCalculatorUS = lazy(() => import('../pages/calculators/global/Retirement401kCalculatorUS'));
const SavingsGrowthCalculatorUS = lazy(() => import('../pages/calculators/global/SavingsGrowthCalculatorUS'));
const VATCalculatorUK = lazy(() => import('../pages/calculators/global/VATCalculatorUK'));
const MortgageAffordabilityCalculatorUK = lazy(() => import('../pages/calculators/global/MortgageAffordabilityCalculatorUK'));
const SavingsInterestCalculatorUK = lazy(() => import('../pages/calculators/global/SavingsInterestCalculatorUK'));

// India calculators
const EMICalculator = lazy(() => import('../modules/calculators/emi'));
const SIPCalculator = lazy(() => import('../modules/calculators/sip'));
const FDCalculator = lazy(() => import('../modules/calculators/fd'));
const RDCalculator = lazy(() => import('../modules/calculators/rd'));
const AutoLoanCalculator = lazy(() => import('../modules/calculators/autoloan'));
const MortgageAffordabilityCalculatorIndia = lazy(() => import('../pages/calculators/global/MortgageAffordabilityCalculatorIndia'));

// Pages
const Home = lazy(() => import('../pages/Home'));
const CalculatorHub = lazy(() => import('../pages/CalculatorHub'));
const BudgetPlannerPage = lazy(() => import('../pages/BudgetPlanner/BudgetPlannerPage'));
const MonthlyBudget = lazy(() => import('../modules/budgets/monthly'));
const TravelBudgetPage = lazy(() => import('../modules/planners/travel/TravelBudgetPage'));
const BlogIndex = lazy(() => import('../pages/blog/BlogIndex'));
const CreateMonthlyBudgetAI = lazy(() => import('../pages/blog/CreateMonthlyBudgetAI'));
const FutureOfTravel2026 = lazy(() => import('../pages/blog/FutureOfTravel2026'));
const About = lazy(() => import('../pages/About'));
const VideoTutorials = lazy(() => import('../pages/VideoTutorials'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));
const Disclaimer = lazy(() => import('../pages/Disclaimer'));

// ==================== GLOBAL CALCULATOR ROUTES ====================
/**
 * Global calculator routes (available in all countries)
 * Structure: /calculators/{tool}/
 */
export const globalCalculatorRoutes = [
  // Mortgage
  {
    path: '/calculators/mortgage',
    element: MortgageCalculatorUS,
    title: 'Mortgage Calculator – Monthly Payment, Amortization & Affordability',
    description: 'Calculate monthly mortgage payments, total interest, amortization schedule, and affordability assessment.',
    category: 'Loans',
    tool: 'mortgage',
    isGlobal: true,
    country: 'global',
    hreflang: 'x-default',
  },
  // Loan Payment
  {
    path: '/calculators/loan',
    element: LoanPaymentCalculatorUS,
    title: 'Loan Payment Calculator – Monthly EMI & Amortization Schedule',
    description: 'Calculate monthly loan payments, total interest payable, and complete amortization schedule for any loan type.',
    category: 'Loans',
    tool: 'loan',
    isGlobal: true,
    country: 'global',
    hreflang: 'x-default',
  },
  // EMI
  {
    path: '/calculators/emi',
    element: EMICalculator,
    title: 'EMI Calculator – Equated Monthly Installment Calculator',
    description: 'Calculate Equated Monthly Installment (EMI), compare loan options, and plan your loan repayment strategy effectively.',
    category: 'Loans',
    tool: 'emi',
    isGlobal: true,
    hreflang: 'x-default',
  },
  // SIP
  {
    path: '/calculators/sip',
    element: SIPCalculator,
    title: 'SIP Calculator – Systematic Investment Plan Calculator',
    description: 'Calculate Systematic Investment Plan (SIP) returns, projected wealth, and investment growth with flexible options.',
    category: 'Investments',
    tool: 'sip',
    isGlobal: true,
    hreflang: 'x-default',
  },
  // FD
  {
    path: '/calculators/fd',
    element: FDCalculator,
    title: 'FD Calculator – Fixed Deposit Maturity & Interest Calculator',
    description: 'Calculate Fixed Deposit (FD) maturity amount, interest earned, and compare investment returns across tenures.',
    category: 'Savings',
    tool: 'fd',
    isGlobal: true,
    hreflang: 'x-default',
  },
  // RD
  {
    path: '/calculators/rd',
    element: RDCalculator,
    title: 'RD Calculator – Recurring Deposit Returns Calculator',
    description: 'Calculate Recurring Deposit (RD) returns, maturity amount, and compare different investment terms and interest rates.',
    category: 'Savings',
    tool: 'rd',
    isGlobal: true,
    hreflang: 'x-default',
  },
  // Savings
  {
    path: '/calculators/savings',
    element: SavingsGrowthCalculatorUS,
    title: 'Savings Calculator – Savings Growth & Future Value Calculator',
    description: 'Plan and track your savings growth with compound interest, compare savings goals, and project your financial future.',
    category: 'Savings',
    tool: 'savings',
    isGlobal: true,
    hreflang: 'x-default',
  },
];

// ==================== COUNTRY-SPECIFIC CALCULATOR ROUTES ====================
/**
 * Country-specific calculator routes
 * Structure: /{country}/calculators/{tool}/
 */
export const countrySpecificCalculatorRoutes = [
  // USA (us)
  {
    path: '/us/calculators/mortgage',
    element: MortgageCalculatorUS,
    title: 'Mortgage Calculator – US Monthly Payment & Amortization Schedule',
    description: 'Calculate US mortgage monthly payment, total interest, and complete amortization schedule with down payment analysis.',
    category: 'Loans',
    tool: 'mortgage',
    country: 'us',
    countryName: 'United States',
    currency: 'USD',
    hreflang: 'en-us',
  },
  {
    path: '/us/calculators/loan',
    element: LoanPaymentCalculatorUS,
    title: 'Loan Payment Calculator – US Personal EMI & Interest Calculator',
    description: 'Calculate personal loan monthly payment, total interest payable, and amortization schedule for US loans.',
    category: 'Loans',
    tool: 'loan',
    country: 'us',
    countryName: 'United States',
    currency: 'USD',
    hreflang: 'en-us',
  },
  {
    path: '/us/calculators/credit-card',
    element: CreditCardPayoffCalculatorUS,
    title: 'Credit Card Payoff Calculator – Debt Payoff Timeline & Interest Savings',
    description: 'Calculate credit card payoff timeline, total interest charges, and discover how to save money with different payment strategies.',
    category: 'Debt',
    tool: 'credit-card',
    country: 'us',
    countryName: 'United States',
    currency: 'USD',
    hreflang: 'en-us',
  },
  {
    path: '/us/calculators/401k',
    element: Retirement401kCalculatorUS,
    title: '401(k) Retirement Calculator – Growth Projections & Withdrawal Planning',
    description: 'Estimate your 401k retirement savings growth with employer matching, calculate required withdrawals, and plan your retirement income.',
    category: 'Retirement',
    tool: '401k',
    country: 'us',
    countryName: 'United States',
    currency: 'USD',
    hreflang: 'en-us',
  },
  {
    path: '/us/calculators/savings',
    element: SavingsGrowthCalculatorUS,
    title: 'Savings Growth Calculator – Future Value & Interest Projection',
    description: 'Calculate future value of your savings with regular monthly deposits, compare interest rates, and visualize wealth growth.',
    category: 'Savings',
    tool: 'savings',
    country: 'us',
    countryName: 'United States',
    currency: 'USD',
    hreflang: 'en-us',
  },

  // UK (uk)
  {
    path: '/uk/calculators/mortgage',
    element: MortgageAffordabilityCalculatorUK,
    title: 'Mortgage Affordability Calculator – Maximum Loan & Payment Estimator',
    description: 'Determine how much mortgage you can afford in the UK based on income, assess monthly payments, and plan your property purchase.',
    category: 'Loans',
    tool: 'mortgage',
    country: 'uk',
    countryName: 'United Kingdom',
    currency: 'GBP',
    hreflang: 'en-gb',
  },
  {
    path: '/uk/calculators/vat',
    element: VATCalculatorUK,
    title: 'VAT Calculator – Sales Tax & Total Price Breakdown',
    description: 'Calculate UK VAT (Value Added Tax), net price, and total amount payable for any transaction.',
    category: 'Tax',
    tool: 'vat',
    country: 'uk',
    countryName: 'United Kingdom',
    currency: 'GBP',
    hreflang: 'en-gb',
  },
  {
    path: '/uk/calculators/savings',
    element: SavingsInterestCalculatorUK,
    title: 'Savings Interest Calculator – Interest Earning Forecast',
    description: 'Calculate interest earned on UK savings accounts, compare different interest rates, and project your savings growth over time.',
    category: 'Savings',
    tool: 'savings',
    country: 'uk',
    countryName: 'United Kingdom',
    currency: 'GBP',
    hreflang: 'en-gb',
  },

  // India (in)
  {
    path: '/in/calculators/emi',
    element: EMICalculator,
    title: 'EMI Calculator India – Monthly Installment & Loan Payment Calculator',
    description: 'Calculate Equated Monthly Installment (EMI) for your loan, compare interest charges, and plan your loan repayment effectively.',
    category: 'Loans',
    tool: 'emi',
    country: 'in',
    countryName: 'India',
    currency: 'INR',
    hreflang: 'en-in',
  },
  {
    path: '/in/calculators/rd',
    element: RDCalculator,
    title: 'Recurring Deposit Calculator – RD Returns & Maturity Amount',
    description: 'Calculate your Recurring Deposit (RD) returns, maturity amount, and total interest earned with varying interest rates.',
    category: 'Savings',
    tool: 'rd',
    country: 'in',
    countryName: 'India',
    currency: 'INR',
    hreflang: 'en-in',
  },
  {
    path: '/in/calculators/fd',
    element: FDCalculator,
    title: 'Fixed Deposit Calculator – FD Maturity & Interest Calculator',
    description: 'Calculate Fixed Deposit (FD) maturity amount, interest earned, and compare different investment tenures and rates.',
    category: 'Savings',
    tool: 'fd',
    country: 'in',
    countryName: 'India',
    currency: 'INR',
    hreflang: 'en-in',
  },
  {
    path: '/in/calculators/sip',
    element: SIPCalculator,
    title: 'SIP Calculator – Systematic Investment Plan Returns & Growth',
    description: 'Calculate Systematic Investment Plan (SIP) returns, projected wealth, and investment growth with different time horizons.',
    category: 'Investments',
    tool: 'sip',
    country: 'in',
    countryName: 'India',
    currency: 'INR',
    hreflang: 'en-in',
  },
  {
    path: '/in/calculators/home-loan-affordability',
    element: MortgageAffordabilityCalculatorIndia,
    title: 'India Home Loan Affordability Calculator – Eligibility & EMI Calculator',
    description: 'Calculate home loan eligibility based on Indian banking norms (FOIR, LTV, income multipliers). Bank-specific FOIR, approval probability meter, and detailed eligibility analysis.',
    category: 'Loans',
    tool: 'home-loan-affordability',
    country: 'in',
    countryName: 'India',
    currency: 'INR',
    hreflang: 'en-in',
  },
];

// ==================== BUDGET ROUTES ====================
export const budgetRoutes = [
  {
    path: '/',
    element: Home,
    title: 'VegaKash.AI - Smart Financial Planning Tools',
    description: 'AI-powered budget planners, calculators, and financial tools',
    icon: '🏠'
  },
  {
    path: '/ai-budget-planner',
    element: MonthlyBudget,
    title: 'AI Budget Planner',
    description: 'AI-powered budget planner with smart recommendations',
    icon: '🤖'
  },
  {
    path: '/budget-planner',
    element: MonthlyBudget,
    title: 'AI Budget Planner',
    description: 'AI-powered monthly budget planning',
    icon: '🤖'
  },
  {
    path: '/budgets/monthly',
    element: MonthlyBudget,
    title: 'Monthly Budget Planner',
    description: 'AI-powered monthly budget planning',
    icon: '📊'
  },
  {
    path: '/travel-budget',
    element: TravelBudgetPage,
    title: 'AI Travel Budget Planner',
    description: 'Plan your trip expenses with AI-powered cost predictions',
    icon: '✈️'
  },
  {
    path: '/travel-planner',
    element: TravelBudgetPage,
    title: 'AI Travel Budget Planner',
    description: 'Smart travel budget planning with itinerary generation',
    icon: '✈️'
  },
];

// ==================== BLOG ROUTES ====================
export const blogRoutes = [
  {
    path: '/learning/blog',
    element: BlogIndex,
    title: 'Financial Blog & Learning Articles',
    description: 'Learn about personal finance, budgeting, investing, and money management',
    category: 'Learning'
  },
  {
    path: '/learning/blog/create-monthly-budget-ai',
    element: CreateMonthlyBudgetAI,
    title: 'How to Create a Monthly Budget Using AI',
    description: 'Learn how to create a monthly budget using AI. Step-by-step guide with practical examples.',
    category: 'Personal Finance',
  },
  {
    path: '/learning/blog/future-of-travel-2026-ai-trip-planning',
    element: FutureOfTravel2026,
    title: 'Future of Travel 2026: How AI Will Redefine Trip Planning Forever',
    description: 'Discover how AI is transforming travel with smart planning, predictive budgeting, real-time updates, and personalized itineraries.',
    category: 'Travel & AI',
  },
];

// ==================== CONTENT ROUTES ====================
export const contentRoutes = [
  {
    path: '/calculators',
    element: CalculatorHub,
    title: 'Financial Calculators',
    description: 'All financial calculators in one place'
  },
  {
    path: '/about',
    element: About,
    title: 'About VegaKash.AI',
    description: 'Learn about our mission'
  },
  {
    path: '/learning/videos',
    element: VideoTutorials,
    title: 'Video Tutorials',
    description: 'Financial education videos'
  },
  {
    path: '/privacy-policy',
    element: PrivacyPolicy,
    title: 'Privacy Policy',
    description: 'How we protect your data'
  },
  {
    path: '/terms-and-conditions',
    element: TermsAndConditions,
    title: 'Terms and Conditions',
    description: 'Terms of service'
  },
  {
    path: '/disclaimer',
    element: Disclaimer,
    title: 'Disclaimer',
    description: 'Legal disclaimer'
  },
  {
    path: '/feedback',
    element: FeedbackPage,
    title: 'Share Your Feedback',
    description: 'Help us improve VegakTools by sharing your thoughts and suggestions'
  }
];

// ==================== LEGACY ROUTE REDIRECTS ====================
/**
 * Redirect old URLs to new global routing structure
 * Ensures backward compatibility and prevents broken links
 */
export const legacyRedirectRoutes = [
  // Old US calculators → new global routes
  { path: '/calculators/mortgage-us', redirectTo: '/us/calculators/mortgage' },
  { path: '/calculators/loan-payment-us', redirectTo: '/us/calculators/loan' },
  { path: '/calculators/credit-card-payoff-us', redirectTo: '/us/calculators/credit-card' },
  { path: '/calculators/401k-retirement-us', redirectTo: '/us/calculators/401k' },
  { path: '/calculators/savings-growth-us', redirectTo: '/us/calculators/savings' },

  // Old UK calculators → new global routes
  { path: '/calculators/vat-uk', redirectTo: '/uk/calculators/vat' },
  { path: '/calculators/mortgage-affordability-uk', redirectTo: '/uk/calculators/mortgage' },
  { path: '/calculators/savings-interest-uk', redirectTo: '/uk/calculators/savings' },

  // Old paths → global routes (backward compatibility)
  { path: '/emi-calculator', redirectTo: '/calculators/emi' },
  { path: '/sip-calculator', redirectTo: '/calculators/sip' },
  { path: '/fd-calculator', redirectTo: '/calculators/fd' },
  { path: '/rd-calculator', redirectTo: '/calculators/rd' },
  { path: '/car-loan-calculator', redirectTo: '/calculators/emi' },
  { path: '/income-tax-calculator', redirectTo: '/calculators/tax' },
];

// ==================== COMBINED ROUTES ====================
/**
 * All application routes combined
 * Order matters: Global → Country-specific → Budget → Blog → Content
 */
export const allRoutes = [
  ...budgetRoutes,
  ...globalCalculatorRoutes,
  ...countrySpecificCalculatorRoutes,
  ...blogRoutes,
  ...contentRoutes,
];

// ==================== ROUTE UTILITIES ====================
/**
 * Get route by path
 */
export const getRouteByPath = (path) => {
  return allRoutes.find(route => route.path === path);
};

/**
 * Get routes by category
 */
export const getRoutesByCategory = (category) => {
  return [
    ...globalCalculatorRoutes.filter(route => route.category === category),
    ...countrySpecificCalculatorRoutes.filter(route => route.category === category),
  ];
};

/**
 * Get calculator categories
 */
export const getCalculatorCategories = () => {
  const categories = new Set([
    ...globalCalculatorRoutes.map(route => route.category),
    ...countrySpecificCalculatorRoutes.map(route => route.category),
  ]);
  return Array.from(categories);
};

/**
 * Get all tools for a specific country
 */
export const getToolsByCountry = (country) => {
  if (!country || country === 'global') {
    return globalCalculatorRoutes;
  }
  return countrySpecificCalculatorRoutes.filter(route => route.country === country);
};

export default allRoutes;
