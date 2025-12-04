/**
 * Centralized Route Configuration
 * 
 * @module router/routes
 * @description Production-grade route management for VegaKash.AI
 * All routes organized by feature modules
 */

import { lazy } from 'react';

// ==================== CALCULATOR ROUTES ====================
// Financial calculators - lazy loaded for performance
const EMICalculator = lazy(() => import('../modules/calculators/emi'));
const SIPCalculator = lazy(() => import('../modules/calculators/sip'));
const FDCalculator = lazy(() => import('../modules/calculators/fd'));
const RDCalculator = lazy(() => import('../modules/calculators/rd'));
const TaxCalculator = lazy(() => import('../modules/calculators/tax'));
const AutoLoanCalculator = lazy(() => import('../modules/calculators/autoloan'));

// Coming Soon Calculators
const SavingsGoalCalculator = lazy(() => import('../pages/calculators/SavingsGoalCalculator'));
const EmergencyFundCalculator = lazy(() => import('../pages/calculators/EmergencyFundCalculator'));

// Redirect target for removed routes
const CalculatorHub = lazy(() => import('../pages/CalculatorHub'));

/**
 * Calculator Routes Configuration
 */
export const calculatorRoutes = [
  {
    path: '/emi-calculator',
    element: EMICalculator,
    title: 'EMI Calculator',
    description: 'Calculate Equated Monthly Installment for loans',
    category: 'Loans'
  },
  // Legacy alias for backward compatibility
  {
    path: '/calculators/emi',
    element: EMICalculator,
    title: 'EMI Calculator',
    description: 'Calculate Equated Monthly Installment for loans',
    category: 'Loans'
  },
  {
    path: '/sip-calculator',
    element: SIPCalculator,
    title: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan returns',
    category: 'Investments'
  },
  // Legacy alias for backward compatibility
  {
    path: '/calculators/sip',
    element: SIPCalculator,
    title: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan returns',
    category: 'Investments'
  },
  {
    path: '/fd-calculator',
    element: FDCalculator,
    title: 'FD Calculator',
    description: 'Calculate Fixed Deposit maturity amount',
    category: 'Savings'
  },
  // Legacy alias for backward compatibility
  {
    path: '/calculators/fd',
    element: FDCalculator,
    title: 'FD Calculator',
    description: 'Calculate Fixed Deposit maturity amount',
    category: 'Savings'
  },
  {
    path: '/rd-calculator',
    element: RDCalculator,
    title: 'RD Calculator',
    description: 'Calculate Recurring Deposit returns',
    category: 'Savings'
  },
  // Legacy alias for backward compatibility
  {
    path: '/calculators/rd',
    element: RDCalculator,
    title: 'RD Calculator',
    description: 'Calculate Recurring Deposit returns',
    category: 'Savings'
  },
  {
    path: '/income-tax-calculator',
    element: TaxCalculator,
    title: 'Income Tax Calculator',
    description: 'Calculate income tax for FY 2024-25',
    category: 'Tax',
    comingSoon: true
  },
  // Legacy alias for backward compatibility
  {
    path: '/calculators/income-tax',
    element: TaxCalculator,
    title: 'Income Tax Calculator',
    description: 'Calculate income tax for FY 2024-25',
    category: 'Tax',
    comingSoon: true
  },
  {
    path: '/car-loan-calculator',
    element: AutoLoanCalculator,
    title: 'Auto Loan Calculator',
    description: 'Calculate car loan EMI and plan vehicle purchase',
    category: 'Loans'
  },
  // Legacy alias for backward compatibility
  {
    path: '/calculators/auto-loan',
    element: AutoLoanCalculator,
    title: 'Auto Loan Calculator',
    description: 'Calculate car loan EMI and plan vehicle purchase',
    category: 'Loans'
  },
  {
    path: '/calculators/savings-goal',
    element: SavingsGoalCalculator,
    title: 'Savings Goal Calculator',
    description: 'Plan and track your savings goals',
    category: 'Planning',
    comingSoon: true
  },
  {
    path: '/calculators/emergency-fund',
    element: EmergencyFundCalculator,
    title: 'Emergency Fund Calculator',
    description: 'Calculate ideal emergency fund size',
    category: 'Planning',
    comingSoon: true
  }
];

// ==================== REDIRECT ROUTES ====================
/**
 * Redirect Routes for removed/non-existent calculators
 * Redirects to Calculator Hub to avoid 404s in Google Search
 * Note: CalculatorHub imported at top of file
 */
export const redirectRoutes = [
  {
    path: '/calculators/interest',
    element: CalculatorHub,
    title: 'Financial Calculators',
    description: 'Explore all financial calculators',
    redirect: true
  },
  {
    path: '/calculators/loan',
    element: CalculatorHub,
    title: 'Financial Calculators',
    description: 'Explore all financial calculators',
    redirect: true
  },
  {
    path: '/calculators/mortgage',
    element: CalculatorHub,
    title: 'Financial Calculators',
    description: 'Explore all financial calculators',
    redirect: true
  }
];

// ==================== BUDGET ROUTES ====================
// Budget planning modules - lazy loaded
const MonthlyBudget = lazy(() => import('../modules/budgets/monthly'));
const WeddingBudget = lazy(() => import('../modules/budgets/wedding'));
const TripBudget = lazy(() => import('../modules/budgets/trip'));
const EventBudget = lazy(() => import('../modules/budgets/event'));
const RenovationBudget = lazy(() => import('../modules/budgets/renovation'));

/**
 * Budget Planning Routes Configuration
 */
export const budgetRoutes = [
  {
    path: '/',
    element: MonthlyBudget,
    title: 'AI Budget Planner',
    description: 'AI-powered monthly budget planning',
    icon: '🤖'
  },
  {
    path: '/ai-budget-planner',
    element: MonthlyBudget,
    title: 'AI Budget Planner',
    description: 'AI-powered monthly budget planning',
    icon: '🤖'
  },
  {
    path: '/budget-planner',
    element: MonthlyBudget,
    title: 'Budget Planner',
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
    path: '/budgets/wedding',
    element: WeddingBudget,
    title: 'Wedding Budget Planner',
    description: 'Plan your perfect wedding budget',
    icon: '💒',
    comingSoon: true
  },
  {
    path: '/budgets/trip',
    element: TripBudget,
    title: 'Trip Budget Planner',
    description: 'Plan your vacation budget',
    icon: '✈️',
    comingSoon: true
  },
  {
    path: '/budgets/event',
    element: EventBudget,
    title: 'Event Budget Planner',
    description: 'Plan any event budget',
    icon: '🎉',
    comingSoon: true
  },
  {
    path: '/budgets/renovation',
    element: RenovationBudget,
    title: 'Home Renovation Budget',
    description: 'Plan home renovation budget',
    icon: '🏠',
    comingSoon: true
  }
];

// ==================== BLOG ROUTES ====================
// Blog & Learning Content
const BlogIndex = lazy(() => import('../pages/blog/BlogIndex'));
const CreateMonthlyBudgetAI = lazy(() => import('../pages/blog/CreateMonthlyBudgetAI'));

/**
 * Blog & Learning Routes Configuration
 */
export const blogRoutes = [
  {
    path: '/learning/blog',
    element: BlogIndex,
    title: 'Financial Blog & Learning Articles',
    description: 'Learn about personal finance, budgeting, investing, and money management with expert articles and guides.',
    category: 'Learning'
  },
  {
    path: '/learning/blog/create-monthly-budget-ai',
    element: CreateMonthlyBudgetAI,
    title: 'How to Create a Monthly Budget Using AI in 2024',
    description: 'Learn how to create a monthly budget using AI. Step-by-step guide with practical examples for US, UK, India, Canada, Australia & UAE.',
    category: 'Personal Finance',
    keywords: ['AI budgeting', 'monthly budget', 'personal finance', 'budget planner', '50-30-20 rule']
  }
];

// ==================== CONTENT ROUTES ====================
// Static pages and content
// Note: CalculatorHub already imported at top for redirect routes
const About = lazy(() => import('../pages/About'));
const VideoTutorials = lazy(() => import('../pages/VideoTutorials'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));
const Disclaimer = lazy(() => import('../pages/Disclaimer'));

/**
 * Content & Static Page Routes
 */
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
  }
];

// ==================== COMBINED ROUTES ====================
/**
 * All application routes combined
 */
export const allRoutes = [
  ...budgetRoutes,
  ...calculatorRoutes,
  ...redirectRoutes,
  ...blogRoutes,
  ...contentRoutes
];

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
  return calculatorRoutes.filter(route => route.category === category);
};

/**
 * Get all calculator categories
 */
export const getCalculatorCategories = () => {
  const categories = new Set(calculatorRoutes.map(route => route.category));
  return Array.from(categories);
};

export default allRoutes;
