/**
 * Global Route Configuration Generator
 * Converts route definitions to include both global and country-specific versions
 * 
 * This module uses the best-practice routing structure:
 * - Global: /calculators/{tool}/
 * - Country: /{country}/calculators/{tool}/
 * 
 * Supports automatic generation of both versions from a single definition
 */

import { COUNTRY_META } from '../utils/countryRouting';

/**
 * Generate global + country routes from a base route definition
 * 
 * @param {Object} baseRoute - Route definition with path, element, title, etc.
 * @param {Array<string>} supportedCountries - List of country codes to generate routes for
 * @returns {Array<Object>} Array of routes (global + per country)
 * 
 * Example:
 * const baseRoute = {
 *   tool: 'emi',
 *   element: EMICalculator,
 *   title: 'EMI Calculator',
 *   description: 'Calculate monthly loan installments',
 * };
 * 
 * const routes = generateGlobalAndCountryRoutes(baseRoute, ['in', 'us', 'uk']);
 * // Generates:
 * // - /calculators/emi/ (global)
 * // - /in/calculators/emi/ (India)
 * // - /us/calculators/emi/ (USA)
 * // - /uk/calculators/emi/ (UK)
 */
export const generateGlobalAndCountryRoutes = (baseRoute, supportedCountries = ['in', 'us', 'uk', 'ca', 'au', 'ae']) => {
  const routes = [];

  // Global route (x-default for hreflang)
  routes.push({
    path: `/calculators/${baseRoute.tool}/`,
    element: baseRoute.element,
    title: baseRoute.title,
    description: baseRoute.description,
    category: baseRoute.category || 'Global',
    tool: baseRoute.tool,
    isGlobal: true,
    hreflang: 'x-default',
    canonical: `https://vegakash.ai/calculators/${baseRoute.tool}/`,
  });

  // Country-specific routes
  supportedCountries.forEach((countryCode) => {
    const countryMeta = COUNTRY_META[countryCode];
    if (countryMeta) {
      routes.push({
        path: `/${countryCode}/calculators/${baseRoute.tool}/`,
        element: baseRoute.element,
        title: `${baseRoute.title} - ${countryMeta.name}`,
        description: baseRoute.description,
        category: baseRoute.category || 'Global',
        tool: baseRoute.tool,
        country: countryCode,
        countryName: countryMeta.name,
        currency: countryMeta.currency,
        isGlobal: false,
        hreflang: `en-${countryMeta.hreflang.split('-')[1].toLowerCase()}`,
        canonical: `https://vegakash.ai/${countryCode}/calculators/${baseRoute.tool}/`,
      });
    }
  });

  return routes;
};

/**
 * Configuration for all global tools that should have both global and country routes
 * 
 * Universal tools (available in all countries):
 * - EMI/Loan Calculator (mortgage, personal, auto loans)
 * - Savings Calculator
 * - Compound Interest Calculator
 * - Investment Calculator
 * - Budget Planner
 */
export const GLOBAL_TOOL_DEFINITIONS = [
  // EMI / Loan Calculators
  {
    tool: 'emi',
    element: null, // Will be imported in routes.jsx
    title: 'EMI Calculator',
    description: 'Calculate monthly loan installments and total interest',
    category: 'Loans',
  },
  {
    tool: 'mortgage',
    element: null,
    title: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payment and total interest',
    category: 'Loans',
  },
  {
    tool: 'loan',
    element: null,
    title: 'Loan Calculator',
    description: 'Calculate monthly loan payments and interest',
    category: 'Loans',
  },

  // Savings & Investment
  {
    tool: 'sip',
    element: null,
    title: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan returns',
    category: 'Investments',
  },
  {
    tool: 'fd',
    element: null,
    title: 'Fixed Deposit Calculator',
    description: 'Calculate FD maturity and interest earned',
    category: 'Savings',
  },
  {
    tool: 'rd',
    element: null,
    title: 'Recurring Deposit Calculator',
    description: 'Calculate RD maturity and returns',
    category: 'Savings',
  },
  {
    tool: 'savings',
    element: null,
    title: 'Savings Calculator',
    description: 'Plan and track your savings growth',
    category: 'Savings',
  },
  {
    tool: 'compound-interest',
    element: null,
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest and investment growth',
    category: 'Investments',
  },

  // Other Global Tools
  {
    tool: 'budget',
    element: null,
    title: 'Budget Planner',
    description: 'Create and manage your monthly budget',
    category: 'Budgeting',
  },
];

/**
 * Country-specific tool definitions
 * Tools that are only available in certain countries
 */
export const COUNTRY_SPECIFIC_TOOLS = {
  'in': [
    { tool: 'tax', title: 'Income Tax Calculator', description: 'Calculate income tax for FY 2024-25', category: 'Tax' },
    { tool: 'nre-rd', title: 'NRE RD Calculator', description: 'Calculate NRE Recurring Deposit returns', category: 'Savings' },
    { tool: 'nri-rd', title: 'NRI RD Calculator', description: 'Calculate NRI Recurring Deposit returns', category: 'Savings' },
    { tool: 'home-loan', title: 'Home Loan Calculator', description: 'Calculate home loan EMI and plan your purchase', category: 'Loans' },
  ],
  'us': [
    { tool: '401k', title: '401(k) Retirement Calculator', description: 'Estimate 401k retirement savings growth', category: 'Retirement' },
    { tool: 'income-tax', title: 'US Income Tax Calculator', description: 'Calculate US federal income tax', category: 'Tax' },
    { tool: 'credit-card-payoff', title: 'Credit Card Payoff Calculator', description: 'Calculate credit card debt payoff timeline', category: 'Debt' },
  ],
  'uk': [
    { tool: 'vat', title: 'VAT Calculator', description: 'Calculate VAT and total price', category: 'Tax' },
    { tool: 'council-tax', title: 'Council Tax Calculator', description: 'Estimate UK council tax', category: 'Tax' },
  ],
  'ca': [
    { tool: 'tax', title: 'Canadian Income Tax Calculator', description: 'Calculate Canadian income tax', category: 'Tax' },
    { tool: 'rrsp', title: 'RRSP Calculator', description: 'Plan your Registered Retirement Savings Plan', category: 'Retirement' },
  ],
  'au': [
    { tool: 'superannuation', title: 'Superannuation Calculator', description: 'Plan your superannuation savings', category: 'Retirement' },
    { tool: 'capital-gains', title: 'Capital Gains Tax Calculator', description: 'Calculate capital gains tax', category: 'Tax' },
  ],
};

/**
 * Generate complete routing configuration for all tools
 * Includes both global and country-specific versions
 */
export const generateCompleteRouting = (calculatorElements) => {
  const routes = [];

  // Generate global + country routes for each global tool
  GLOBAL_TOOL_DEFINITIONS.forEach((toolDef) => {
    const element = calculatorElements[toolDef.tool];
    if (element) {
      const generatedRoutes = generateGlobalAndCountryRoutes({
        ...toolDef,
        element,
      });
      routes.push(...generatedRoutes);
    }
  });

  // Add country-specific tools
  Object.entries(COUNTRY_SPECIFIC_TOOLS).forEach(([country, tools]) => {
    tools.forEach((toolDef) => {
      const element = calculatorElements[`${country}_${toolDef.tool}`];
      if (element) {
        routes.push({
          path: `/${country}/calculators/${toolDef.tool}/`,
          element,
          title: `${toolDef.title} - ${COUNTRY_META[country].name}`,
          description: toolDef.description,
          category: toolDef.category,
          tool: toolDef.tool,
          country,
          countryName: COUNTRY_META[country].name,
          currency: COUNTRY_META[country].currency,
          isCountrySpecific: true,
          hreflang: `en-${COUNTRY_META[country].hreflang.split('-')[1].toLowerCase()}`,
          canonical: `https://vegakash.ai/${country}/calculators/${toolDef.tool}/`,
        });
      }
    });
  });

  return routes;
};

export default {
  generateGlobalAndCountryRoutes,
  generateCompleteRouting,
  GLOBAL_TOOL_DEFINITIONS,
  COUNTRY_SPECIFIC_TOOLS,
};
