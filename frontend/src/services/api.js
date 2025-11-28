/**
 * API Service for VegaKash.AI
 * Handles all backend API communication
 */
import axios from 'axios';

// Base URL for API - change for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI operations
});

/**
 * Calculate financial summary (non-AI)
 * @param {Object} financialInput - User's financial data
 * @returns {Promise<Object>} Summary output
 */
export const calculateSummary = async (financialInput) => {
  try {
    const response = await apiClient.post('/api/calculate-summary', financialInput);
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
    const response = await apiClient.post('/api/generate-ai-plan', {
      input: financialInput,
      summary: summary,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating AI plan:', error);
    throw new Error(
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
    const response = await apiClient.get('/health');
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
