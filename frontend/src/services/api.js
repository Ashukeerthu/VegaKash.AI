/**
 * API Service for VegaKash.AI
 * Handles all backend API communication
 */
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, APP_CONFIG } from '../config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

/**
 * Export financial plan as PDF
 * @param {Object} financialInput - User's financial data
 * @param {Object} summary - Calculated summary
 * @param {Object} aiPlan - AI-generated plan (optional)
 * @returns {Promise<Blob>} PDF file as blob
 */
export const exportPDF = async (financialInput, summary, aiPlan = null) => {
  try {
    const response = await apiClient.post('/api/v1/export-pdf', {
      input: financialInput,
      summary: summary,
      ai_plan: aiPlan,
    }, {
      responseType: 'blob',
      timeout: 30000 // 30 seconds for PDF generation
    });
    
    // Create download link and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VegaKash_Financial_Plan_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response.data;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Get smart recommendations and alerts
 * @param {Object} financialInput - User's financial data
 * @returns {Promise<Object>} Smart recommendations output
 */
export const getSmartRecommendations = async (financialInput) => {
  try {
    const response = await apiClient.post('/api/v1/smart-recommendations', financialInput);
    return response.data;
  } catch (error) {
    console.error('Error getting smart recommendations:', error);
    throw new Error('Failed to generate recommendations. Please try again.');
  }
};

/**
 * Compare debt payoff strategies (snowball vs avalanche)
 * @param {Array} loans - List of detailed loan objects
 * @param {Number} extraPayment - Extra monthly payment available
 * @returns {Promise<Object>} Debt strategy comparison
 */
export const compareDebtStrategies = async (loans, extraPayment = 0) => {
  try {
    const response = await apiClient.post('/api/v1/compare-debt-strategies', {
      loans: loans,
      extra_payment: extraPayment
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing debt strategies:', error);
    throw new Error('Failed to compare debt strategies. Please try again.');
  }
};

// ===========================================
// PHASE 2 ROADMAP (Future API Calls)
// ===========================================
// Authentication: login, register, logout
// Plan Management: savePlan, getUserPlans, deletePlan
// See: https://github.com/Ashukeerthu/VegaKash.AI/issues
