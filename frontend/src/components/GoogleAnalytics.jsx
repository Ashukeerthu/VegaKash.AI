import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics Component
 * Tracks page views and user interactions
 */

// Google Analytics 4 Measurement ID
// Replace with your actual GA4 Measurement ID from Google Analytics
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your GA4 ID

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

/**
 * Track page view
 */
export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

/**
 * Track custom events
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Google Analytics Component
 * Automatically tracks route changes
 */
function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

export default GoogleAnalytics;
