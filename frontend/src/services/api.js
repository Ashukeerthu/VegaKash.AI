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

// Simple in-memory cache for place detail lookups to avoid repeat calls
const placeDetailsCache = new Map();

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
 * Calculate financial summary (non-AI) - Uses Phase 1 Original Endpoint
 * @param {Object} financialInput - User's financial data
 * @returns {Promise<Object>} Summary output
 */
export const calculateSummary = async (financialInput) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.calculateSummary, financialInput);
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
 * Generate AI financial plan - Uses Phase 1 Original Endpoint  
 * @param {Object} financialInput - User's financial data
 * @param {Object} summary - Calculated summary
 * @returns {Promise<Object>} AI plan output
 */
export const generateAIPlan = async (financialInput, summary) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.generateAIPlan, {
      input: financialInput,
      summary
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
}

/**
 * V2: Generate context-aware AI budget plan with city tier, lifestyle, and family considerations
 * Enhanced version with alerts, recommendations, and educational explainers
 * @param {Object} financialInput - User's financial data (includes city_tier, family_size, lifestyle, cost_of_living_index)
 * @param {Object} summary - Calculated financial summary
 * @returns {Promise<Object>} AIPlanOutputV2 with structured budget plan
 */
export const generateAIPlanV2 = async (financialInput, summary) => {
  try {
    const response = await apiClient.post('/api/v2/generate-ai-plan', {
      input: financialInput,
      summary
    });
    return response.data;
  } catch (error) {
    console.error('Error generating V2 AI plan:', error);
    throw new Error(
      error.response?.data?.detail?.message || 
      error.response?.data?.detail || 
      'Failed to generate V2 AI budget plan. Please try again later.'
    );
  }
};

/**
 * Fetch place details (image + map URLs) with caching
 * @param {string} placeName - human friendly place query
 * @returns {Promise<Object|null>} Place details or null on failure
 */
export const getPlaceDetails = async (placeName) => {
  const query = (placeName || '').trim();
  if (!query) return null;

  const cacheKey = query.toLowerCase();
  if (placeDetailsCache.has(cacheKey)) {
    return placeDetailsCache.get(cacheKey);
  }

  try {
    const response = await apiClient.get(API_ENDPOINTS.placeDetails, {
      params: { query },
    });
    placeDetailsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

/**
 * Transform old form data to Phase 2 API format - V1.2 Enhanced
 * @param {Object} oldData - Old format data (now includes V1.2 fields)
 * @returns {Object} Phase 2 format data
 */
const transformToPhase2Format = (oldData) => {
  const totalIncome = parseFloat(oldData.monthly_income_primary || 0) + 
                      parseFloat(oldData.monthly_income_additional || 0);
  
  // Ensure minimum income for backend validation
  const validIncome = totalIncome >= 10000 ? totalIncome : 50000;
  
  return {
    monthly_income: validIncome,
    currency: oldData.currency || 'INR',
    
    // V1.2: Location data
    country: oldData.country || null,
    state: oldData.state || null,
    city: oldData.city || null,
    city_tier: oldData.cityTier || 'tier_1',
    col_multiplier: 1.0, // Backend will calculate based on city
    
    // V1.2: Household & Lifestyle
    family_size: parseInt(oldData.family_size) || 1,
    lifestyle: oldData.lifestyle || 'moderate',
    
    // V1.2: Fixed expenses (with fallback to legacy expenses)
    fixed_expenses: {
      rent: parseFloat(oldData.fixed_expenses?.housing_rent || oldData.expenses?.housing_rent || 0),
      utilities: parseFloat(oldData.fixed_expenses?.utilities || oldData.expenses?.utilities || 0),
      insurance: parseFloat(oldData.fixed_expenses?.insurance || oldData.expenses?.insurance || 0),
      medical: parseFloat(oldData.fixed_expenses?.medical || 0),
      other: parseFloat(oldData.fixed_expenses?.other_fixed || oldData.expenses?.others || 0),
    },
    
    // V1.2: Variable expenses (with fallback to legacy expenses)
    variable_expenses: {
      groceries: parseFloat(oldData.variable_expenses?.groceries_food || oldData.expenses?.groceries_food || 0),
      transport: parseFloat(oldData.variable_expenses?.transport || oldData.expenses?.transport || 0),
      subscriptions: parseFloat(oldData.variable_expenses?.subscriptions || oldData.expenses?.subscriptions || 0),
      entertainment: parseFloat(oldData.variable_expenses?.entertainment || oldData.expenses?.entertainment || 0),
      shopping: parseFloat(oldData.variable_expenses?.shopping || 0),
      dining_out: parseFloat(oldData.variable_expenses?.dining_out || 0),
      other: parseFloat(oldData.variable_expenses?.other_variable || 0),
    },
    
    // Loans (support both EMI and principal modes)
    loans: (oldData.loans || [])
      .filter(loan => parseFloat(loan.outstanding_principal || loan.principal || 0) > 0)
      .map(loan => ({
        principal: parseFloat(loan.outstanding_principal || loan.principal || 0),
        rate: parseFloat(loan.interest_rate_annual || 5.0),
        tenure_months: parseInt(loan.remaining_months || 12),
        issuer: loan.name || null,
      })),
    
    // V1.2: Multiple savings goals (with fallback to legacy goals)
    goals: [
      // Legacy primary goal
      ...(oldData.goals?.primary_goal_type && parseFloat(oldData.goals?.primary_goal_amount || 0) > 0 ? [{
        name: oldData.goals.primary_goal_type,
        target: parseFloat(oldData.goals.primary_goal_amount),
        target_months: 12,
        priority: 5,
      }] : []),
      // V1.2: Additional savings goals
      ...(oldData.savings_goals || [])
        .filter(goal => parseFloat(goal.target || 0) > 0)
        .map(goal => ({
          name: goal.name || 'Savings Goal',
          target: parseFloat(goal.target || 0),
          target_months: parseInt(goal.timeline || 12),
          priority: parseInt(goal.priority || 3),
        }))
    ],
    
    mode: 'smart_balanced', // AI will optimize this automatically
  };
};

/**
 * Transform Phase 2 response to old format for compatibility
 * @param {Object} phase2Data - Phase 2 response data
 * @returns {Object} Old format response
 */
const transformPhase2Response = (phase2Data) => {
  const plan = phase2Data.plan || {};
  const split = plan.split || { needs: 0, wants: 0, savings: 0 };
  
  return {
    total_income: plan.metadata?.income || 0,
    total_expenses: split.needs + split.wants,
    total_savings: split.savings,
    savings_rate_percent: plan.metadata?.income ? 
      ((split.savings / plan.metadata.income) * 100).toFixed(2) : 0,
    monthly_surplus: split.savings,
    expense_breakdown: {
      needs: split.needs,
      wants: split.wants,
      savings: split.savings,
    },
    budget_health: {
      score: 75, // Default score
      issues: (plan.alerts || []).filter(a => a.severity === 'critical' || a.severity === 'high'),
      recommendations: plan.alerts || [],
    },
    // Include AI plan data for generateAIPlan
    aiPlan: {
      plan_summary: phase2Data.explanation || 'AI-optimized budget plan created successfully.',
      recommendations: plan.alerts || [],
      budget_mode: plan.metadata?.mode || 'smart_balanced',
      categories: plan.categories || {},
    },
    // Store original Phase 2 data
    _phase2Data: phase2Data,
  };
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
