/**
 * Performance Monitoring Utilities
 * Track Core Web Vitals and performance metrics
 */

/**
 * Measure and log Core Web Vitals (LCP, FID, CLS)
 * These metrics are critical for SEO and user experience
 */
export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Use Performance Observer API directly (web-vitals package is optional)
    measurePerformanceWithObserver(onPerfEntry);
  }
}

/**
 * Fallback performance measurement using Performance Observer
 */
function measurePerformanceWithObserver(callback) {
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callback({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor',
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          callback({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            rating: entry.processingStart - entry.startTime < 100 ? 'good' : entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor',
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        callback({
          name: 'CLS',
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }
}

/**
 * Log performance metrics to console (dev) or analytics (prod)
 */
export function logPerformanceMetrics(metric) {
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${metric.name}:`, metric.value, metric.rating);
  } else {
    // Send to analytics in production
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.rating,
        non_interaction: true,
      });
    }
  }
}

/**
 * Measure component render time
 * @param {string} componentName - Name of component
 * @param {Function} renderFn - Render function to measure
 */
export function measureRenderTime(componentName, renderFn) {
  const startTime = performance.now();
  const result = renderFn();
  const endTime = performance.now();
  
  if (import.meta.env.DEV) {
    console.log(`[Render Time] ${componentName}: ${(endTime - startTime).toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Debounce function to limit API calls and improve performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Prefetch data for routes before navigation
 * @param {string} route - Route to prefetch
 */
export function prefetchRoute(route) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
}

/**
 * Resource hints for faster loading
 */
export function addResourceHints() {
  // DNS prefetch for external domains
  const dnsPrefetch = [
    'https://api.openai.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];
  
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical origins
  const preconnect = [
    'https://api.openai.com',
  ];
  
  preconnect.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}
