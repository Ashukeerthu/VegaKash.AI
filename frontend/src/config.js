/**
 * Frontend Configuration
 * Centralized configuration for API endpoints and app settings
 */

// Determine environment
const env = import.meta.env.MODE || 'development';

// API Base URLs for different environments
const API_BASE_URLS = {
  development: 'http://localhost:8000',
  production: 'https://vegaktools.com', // Production domain
};

// Get current API base URL
export const API_BASE_URL = API_BASE_URLS[env] || API_BASE_URLS.development;

// API Endpoints (versioned)
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/v1/health`,
  calculateSummary: `${API_BASE_URL}/api/v1/calculate-summary`,
  generateAIPlan: `${API_BASE_URL}/api/v1/generate-ai-plan`,
};

// App Configuration
export const APP_CONFIG = {
  appName: 'VegaKash.AI',
  version: '1.0.0',
  currency: 'INR',
  currencySymbol: '₹',
  defaultTimeout: 60000, // 60 seconds
};

// Feature Flags
export const FEATURES = {
  darkMode: true,
  pdfExport: false, // Phase 2
  authentication: false, // Phase 2
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  APP_CONFIG,
  FEATURES,
};
