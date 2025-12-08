/**
 * Budget Planner API Service
 * Handles all Budget Planner V1.2 API communication
 */
import axios from 'axios';
import { API_BASE_URL, APP_CONFIG } from '../config';

// Create axios instance for budget planner
const budgetApiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/ai/budget`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: APP_CONFIG.defaultTimeout,
});

// Response interceptor for error handling
budgetApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data?.detail || error.response.data?.message || error.message;
      console.error('Budget API Error:', errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Cannot connect to budget planner service. Please check your connection.');
    } else {
      throw new Error(error.message);
    }
  }
);

/**
 * Generate personalized budget plan
 * @param {Object} budgetRequest - Budget generation request data
 * @returns {Promise<Object>} Budget plan response
 */
export const generateBudget = async (budgetRequest) => {
  try {
    const response = await budgetApiClient.post('/generate', budgetRequest);
    return response.data;
  } catch (error) {
    console.error('Error generating budget:', error);
    throw error;
  }
};

/**
 * Rebalance existing budget
 * @param {Object} rebalanceRequest - Rebalance request with edited plan
 * @returns {Promise<Object>} Rebalanced budget plan
 */
export const rebalanceBudget = async (rebalanceRequest) => {
  try {
    const response = await budgetApiClient.post('/rebalance', rebalanceRequest);
    return response.data;
  } catch (error) {
    console.error('Error rebalancing budget:', error);
    throw error;
  }
};

/**
 * Get list of supported countries with cities
 * @returns {Promise<Object>} Countries data with states and cities
 */
export const getCountries = async () => {
  try {
    const response = await budgetApiClient.get('/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Get available budget modes
 * @returns {Promise<Object>} Budget modes list
 */
export const getBudgetModes = async () => {
  try {
    const response = await budgetApiClient.get('/budget-modes');
    return response.data;
  } catch (error) {
    console.error('Error fetching budget modes:', error);
    throw error;
  }
};

/**
 * Get available lifestyle options
 * @returns {Promise<Object>} Lifestyle options list
 */
export const getLifestyleOptions = async () => {
  try {
    const response = await budgetApiClient.get('/lifestyle-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching lifestyle options:', error);
    throw error;
  }
};

/**
 * Check budget planner health
 * @returns {Promise<Object>} Health status
 */
export const checkBudgetHealth = async () => {
  try {
    const response = await budgetApiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Budget health check failed:', error);
    throw error;
  }
};

/**
 * Format budget request from form data
 * @param {Object} formData - Form data from user input
 * @returns {Object} Formatted budget request
 */
export const formatBudgetRequest = (formData) => {
  return {
    monthly_income: parseFloat(formData.monthlyIncome),
    currency: formData.currency || 'INR',
    country: formData.country || null,
    state: formData.state || null,
    city: formData.city || null,
    city_tier: formData.cityTier || 'tier_1',
    col_multiplier: parseFloat(formData.colMultiplier) || 1.0,
    family_size: parseInt(formData.familySize) || 1,
    lifestyle: formData.lifestyle || 'moderate',
    fixed_expenses: {
      rent: parseFloat(formData.rent) || 0,
      utilities: parseFloat(formData.utilities) || 0,
      insurance: parseFloat(formData.insurance) || 0,
      medical: parseFloat(formData.medical) || 0,
      other: parseFloat(formData.otherFixed) || 0,
    },
    variable_expenses: {
      groceries: parseFloat(formData.groceries) || 0,
      transport: parseFloat(formData.transport) || 0,
      subscriptions: parseFloat(formData.subscriptions) || 0,
      entertainment: parseFloat(formData.entertainment) || 0,
      shopping: parseFloat(formData.shopping) || 0,
      dining_out: parseFloat(formData.diningOut) || 0,
      other: parseFloat(formData.otherVariable) || 0,
    },
    loans: (formData.loans || []).map(loan => ({
      principal: parseFloat(loan.principal),
      rate: parseFloat(loan.rate),
      tenure_months: parseInt(loan.tenureMonths),
      issuer: loan.issuer || null,
    })),
    goals: (formData.goals || []).map(goal => ({
      name: goal.name,
      target: parseFloat(goal.target),
      target_months: parseInt(goal.targetMonths),
      priority: parseInt(goal.priority) || 3,
    })),
    mode: formData.mode || 'smart_balanced',
  };
};

export default {
  generateBudget,
  rebalanceBudget,
  getCountries,
  getBudgetModes,
  getLifestyleOptions,
  checkBudgetHealth,
  formatBudgetRequest,
};
