/**
 * Enhanced AppRouter with Global Country-Code Routing
 * 
 * Implements best-practice routing structure:
 * ✓ Global default: /calculators/{tool}/
 * ✓ Country-specific: /{country}/calculators/{tool}/
 * ✓ Automatic hreflang + canonical generation
 * ✓ User country detection & optional redirect
 * ✓ Scalable to unlimited countries & tools
 * 
 * This follows patterns used by:
 * - Wise.com (currency converters)
 * - Calculator.net (global calculators)
 * - NerdWallet (financial tools)
 */

import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LoadingSpinner from './components/LoadingSpinner';
import SEO from './components/SEO';
import GoogleAnalytics from './components/GoogleAnalytics';
import { detectUserCountry, saveUserCountry, shouldRedirectUser, COUNTRY_META } from './utils/countryRouting';
import { allRoutes } from './router';
import './styles/App.css';
import './styles/animations.css';

/**
 * Route handler component that manages country detection and redirect logic
 */
function RouteHandler() {
  const location = useLocation();
  const [userCountry, setUserCountry] = useState(null);
  const [userAgreedToRedirect, setUserAgreedToRedirect] = useState(
    localStorage.getItem('userAgreedToCountryRedirect') === 'true'
  );

  // Detect user's country on first load
  useEffect(() => {
    const initCountry = async () => {
      const country = await detectUserCountry();
      setUserCountry(country);
      saveUserCountry(country);
    };

    initCountry();
  }, []);

  // Handle country redirect logic
  useEffect(() => {
    if (!userCountry || !userAgreedToRedirect) return;

    const targetCountry = shouldRedirectUser(location.pathname, userCountry, userAgreedToRedirect);
    if (targetCountry) {
      // Redirect to country-specific version if user agreed
      const countryURL = location.pathname.replace('/calculators/', `/${targetCountry}/calculators/`);
      window.history.replaceState(null, '', countryURL);
    }
  }, [location.pathname, userCountry, userAgreedToRedirect]);

  return (
    <Routes>
      {allRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.element userCountry={userCountry} />}
        />
      ))}
    </Routes>
  );
}

/**
 * Main App Component with Enhanced Global Routing
 */
function AppRouter() {
  return (
    <HelmetProvider>
      <Router>
        <GoogleAnalytics />

        <div className="app">
          <Navbar />

          <Suspense fallback={<LoadingSpinner />}>
            <RouteHandler />
          </Suspense>

          <CookieConsent />
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default AppRouter;
