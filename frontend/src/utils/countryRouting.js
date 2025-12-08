/**
 * Country Detection & Routing Utility
 * Handles geo-location, country selection, and auto-redirect logic
 */

/**
 * Get user's country code from various sources
 * Priority: localStorage > geo-location > browser language > default
 */
export const detectUserCountry = async () => {
  // 1. Check localStorage for user's last selected country
  const storedCountry = localStorage.getItem('userCountry');
  if (storedCountry) return storedCountry;

  // 2. Try geo-location API
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    if (data.country_code) {
      const code = data.country_code.toLowerCase();
      // Only use if we support this country
      if (SUPPORTED_COUNTRIES.includes(code)) {
        return code;
      }
    }
  } catch (error) {
    console.log('Geo-location failed, using fallback');
  }

  // 3. Get from browser language
  const browserLang = navigator.language || 'en-US';
  const countryCode = browserLang.split('-')[1]?.toLowerCase();
  if (countryCode && SUPPORTED_COUNTRIES.includes(countryCode)) {
    return countryCode;
  }

  // 4. Default to India
  return 'in';
};

/**
 * Save user's selected country to localStorage
 */
export const saveUserCountry = (countryCode) => {
  localStorage.setItem('userCountry', countryCode);
};

/**
 * Get all supported country codes
 */
export const SUPPORTED_COUNTRIES = ['in', 'us', 'uk', 'ca', 'au', 'ae'];

/**
 * Country metadata
 */
export const COUNTRY_META = {
  'in': { name: 'India', hreflang: 'en-IN', currency: 'INR', flag: '🇮🇳' },
  'us': { name: 'United States', hreflang: 'en-US', currency: 'USD', flag: '🇺🇸' },
  'uk': { name: 'United Kingdom', hreflang: 'en-GB', currency: 'GBP', flag: '🇬🇧' },
  'ca': { name: 'Canada', hreflang: 'en-CA', currency: 'CAD', flag: '🇨🇦' },
  'au': { name: 'Australia', hreflang: 'en-AU', currency: 'AUD', flag: '🇦🇺' },
  'ae': { name: 'UAE', hreflang: 'en-AE', currency: 'AED', flag: '🇦🇪' },
};

/**
 * Check if route is a country-specific URL
 */
export const isCountryRoute = (pathname) => {
  const match = pathname.match(/^\/([a-z]{2})\/calculators\//);
  return match ? match[1] : null;
};

/**
 * Check if route is a global URL
 */
export const isGlobalRoute = (pathname) => {
  return pathname.match(/^\/calculators\//) !== null;
};

/**
 * Generate country-specific URL from global URL
 */
export const generateCountryURL = (pathname, countryCode) => {
  if (pathname.startsWith('/calculators/')) {
    // Convert /calculators/xxx/ to /{country}/calculators/xxx/
    return `/${countryCode}${pathname}`;
  }
  return pathname;
};

/**
 * Generate global URL from country-specific URL
 */
export const generateGlobalURL = (pathname) => {
  const match = pathname.match(/^\/([a-z]{2})\/(.+)$/);
  if (match) {
    return `/${match[2]}`;
  }
  return pathname;
};

/**
 * Get calculator name from pathname
 */
export const getToolName = (pathname) => {
  const match = pathname.match(/\/calculators\/([^/]+)/);
  return match ? match[1] : null;
};

/**
 * Build all URLs for a calculator (global + all countries)
 * Used for hreflang tags
 */
export const buildCalculatorURLs = (toolName, domain = 'vegakash.ai') => {
  const urls = {
    global: `https://${domain}/calculators/${toolName}/`,
    countries: {},
  };

  SUPPORTED_COUNTRIES.forEach((country) => {
    urls.countries[country] = `https://${domain}/${country}/calculators/${toolName}/`;
  });

  return urls;
};

/**
 * Determine if user should be redirected
 * Returns target country code or null
 */
export const shouldRedirectUser = (currentPath, userCountry, userAgreedToRedirect) => {
  // If user explicitly chose a country, respect it
  if (!userAgreedToRedirect) return null;

  // If already on country-specific page, don't redirect
  if (isCountryRoute(currentPath)) return null;

  // If on global page and user has a country preference, redirect
  if (isGlobalRoute(currentPath)) {
    return userCountry;
  }

  return null;
};

export default {
  detectUserCountry,
  saveUserCountry,
  isCountryRoute,
  isGlobalRoute,
  generateCountryURL,
  generateGlobalURL,
  getToolName,
  buildCalculatorURLs,
  shouldRedirectUser,
  SUPPORTED_COUNTRIES,
  COUNTRY_META,
};
