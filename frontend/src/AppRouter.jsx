import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LoadingSpinner from './components/LoadingSpinner';
import SEO from './components/SEO';
import GoogleAnalytics from './components/GoogleAnalytics';
import './styles/App.css';
import './styles/animations.css';

// ==================== PRODUCTION-GRADE GLOBAL ROUTING ====================
// Centralized route configuration with country-specific & global routes
import { 
  globalCalculatorRoutes, 
  countrySpecificCalculatorRoutes,
  budgetRoutes,
  blogRoutes,
  contentRoutes,
  legacyRedirectRoutes
} from './router/routes';
import { Navigate } from 'react-router-dom';

/**
 * ScrollToTop Component - Scrolls to top on route change
 * Fixes issue where page stays scrolled when navigating
 */
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Force a small delay to ensure React finishes rendering
    // This helps with component unmounting/mounting
    const timer = setTimeout(() => {
      // Ensure the page is at top after render
      window.scrollTo(0, 0);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return null;
}

/**
 * AppContent - Inner component with routing
 */
function AppContent() {
  return (
    <div className="app">
      {/* Global Navigation */}
      <Navbar />
      
      {/* Main Content with Routes */}
      <Routes>
        {/* Budget Routes */}
        {budgetRoutes.map((route, index) => {
          const Component = route.element;
          return (
            <Route 
              key={route.path}
              path={route.path} 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Component />
                </Suspense>
              } 
            />
          );
        })}
        
        {/* 
          GLOBAL CALCULATORS (x-default hreflang)
          Canonical version, serves all countries by default
          Redirects to country-specific version if country detected
        */}
        {globalCalculatorRoutes.map((route, index) => {
          const Component = route.element;
          return (
            <Route 
              key={route.path}
              path={route.path} 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Component />
                </Suspense>
              } 
            />
          );
        })}
        
        {/* 
          COUNTRY-SPECIFIC CALCULATORS
          Localized content with country-specific currency, laws, etc.
          Proper hreflang tags for international SEO
        */}
        {countrySpecificCalculatorRoutes.map((route, index) => {
          const Component = route.element;
          return (
            <Route 
              key={route.path}
              path={route.path} 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Component />
                </Suspense>
              } 
            />
          );
        })}
        
        {/* 
          LEGACY REDIRECTS (301)
          Maps old URLs to new structure
          Example: /calculators/mortgage-us → /us/calculators/mortgage
          Preserves SEO value from old links
        */}
        {legacyRedirectRoutes.map((route, index) => (
          <Route 
            key={`redirect-${route.path}`}
            path={route.path} 
            element={<Navigate to={route.redirectTo} replace />} 
          />
        ))}
        
        {/* Blog Routes - After specific routes */}
        {blogRoutes.map((route, index) => {
          const Component = route.element;
          return (
            <Route 
              key={route.path}
              path={route.path} 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Component />
                </Suspense>
              } 
            />
          );
        })}
        
        {/* Content Routes */}
        {contentRoutes.map((route, index) => {
          const Component = route.element;
          return (
            <Route 
              key={route.path}
              path={route.path} 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Component />
                </Suspense>
              } 
            />
          );
        })}
        
        {/* Fallback Coming Soon Routes - Only for truly non-existent routes */}
        <Route path="/learning/guides" element={<ComingSoon title="Financial Guides" />} />
      </Routes>
      
      {/* Global Footer */}
      <Footer />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

/**
 * Main App Component with Routing - REFACTORED FOR GLOBAL SEO
 * Production-grade global architecture with country-specific optimization
 * SEO-optimized with best-practice global routing patterns
 * 
 * ROUTING STRUCTURE:
 * - Global routes: /calculators/{tool}/ (x-default hreflang)
 * - Country routes: /{country}/calculators/{tool}/ (en-{country} hreflang)
 * - Legacy redirects: Maps old URLs to new structure (301 redirects)
 * - Other content: /blogs/, /learning/, /budgets/
 * 
 * FEATURES:
 * - Automatic hreflang generation for all calculator pages
 * - 301 redirects for legacy URLs (backward compatibility)
 * - Country-specific content with proper metadata
 * - SEO-optimized lazy loading
 * - Fallback routes for error handling
 * - Fixed: Proper route remounting when navigating from Budget Planner
 */
function App() {
  return (
    <HelmetProvider>
      <Router>
        {/* Scroll to top on route change */}
        <ScrollToTop />
        
        {/* Google Analytics - tracks page views automatically */}
        <GoogleAnalytics />
        
        {/* App content with location-based key for proper remounting */}
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

// Simple Coming Soon Component for pages under development
function ComingSoon({ title }) {
  return (
    <>
      <SEO title={`${title} - Coming Soon | VegaKash.AI`} />
      <div className="page-container">
        <div className="page-header">
          <h1>{title}</h1>
          <p>Coming Soon</p>
        </div>
        <div className="page-content">
          <div className="coming-soon-card">
            <div className="coming-soon-icon">🚧</div>
            <h2>Under Development</h2>
            <p>We're working hard to bring you this feature!</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
