/**
 * API Service for VegaKash.AI
 * Handles all backend API communication
 */
import axios from 'axios';
import { API_ENDPOINTS, APP_CONFIG } from '../config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.calculateSummary.split('/api')[0],
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: APP_CONFIG.defaultTimeout,
});

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.detail?.message || error.response.data?.detail || error.message;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response
      throw new Error('Cannot connect to server. Please check your internet connection.');
    } else {
      throw new Error(error.message);
    }
  }
);

/**
 * Calculate financial summary (non-AI)
 * @param {Object} financialInput - User's financial data
 * @returns {Promise<Object>} Summary output
 */
export const calculateSummary = async (financialInput) => {
  try {
    const response = await apiClient.post('/api/v1/calculate-summary', financialInput);
    return response.data;
  } catch (error) {
    console.error('Error calculating summary:', error);
    throw new Error(
      error.response?.data?.detail || 
      'Failed to calculate financial summary. Please check your inputs and try again.'
    );
  }
};

/**
 * Generate AI financial plan
 * @param {Object} financialInput - User's financial data
 * @param {Object} summary - Calculated summary
 * @returns {Promise<Object>} AI plan output
 */
export const generateAIPlan = async (financialInput, summary) => {
  try {
    const response = await apiClient.post('/api/v1/generate-ai-plan', {
      input: financialInput,
      summary: summary,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating AI plan:', error);
    throw new Error(
      error.response?.data?.detail?.message || 
      error.response?.data?.detail || 
      'Failed to generate AI plan. Please try again later.'
    );
  }
};

/**
 * Check API health status
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/v1/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Unable to connect to backend API');
  }
};

// TODO: Phase 2 - Add authentication API calls
// export const login = async (credentials) => { ... }
// export const register = async (userData) => { ... }
// export const logout = async () => { ... }

// TODO: Phase 2 - Add plan management API calls
// export const savePlan = async (planData) => { ... }
// export const getUserPlans = async () => { ... }
// export const deletePlan = async (planId) => { ... }
