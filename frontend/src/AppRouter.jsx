import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LoadingSpinner from './components/LoadingSpinner';
import SEO from './components/SEO';
import GoogleAnalytics from './components/GoogleAnalytics';
import './styles/App.css';
import './styles/animations.css';

// ==================== PRODUCTION-GRADE MODULAR ROUTING ====================
// Centralized route configuration from router module
import { allRoutes } from './router';

/**
 * Main App Component with Routing - REFACTORED
 * Production-grade modular architecture
 * SEO-optimized with centralized route management
 * 
 * MIGRATION NOTES:
 * - All routes now managed centrally in router/routes.jsx
 * - Calculators migrated to modules/calculators/
 * - Budgets migrated to modules/budgets/
 * - Lazy loading maintained for performance
 */
function App() {
  return (
    <HelmetProvider>
      <Router>
        {/* Google Analytics - tracks page views automatically */}
        <GoogleAnalytics />
        
        <div className="app">
          {/* Global Navigation */}
          <Navbar />
          
          {/* Main Content with Routes - MODULAR ARCHITECTURE */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* 
                PRODUCTION-GRADE ROUTING SYSTEM
                All routes dynamically generated from centralized configuration
                Supports: Calculators, Budgets, Content pages
                Features: Lazy loading, SEO optimization, Coming Soon handling
              */}
              {allRoutes.map((route, index) => (
                <Route 
                  key={index} 
                  path={route.path} 
                  element={<route.element />} 
                />
              ))}
              
              {/* Fallback Coming Soon Routes - Only for truly non-existent routes */}
              <Route path="/learning/guides" element={<ComingSoon title="Financial Guides" />} />
            </Routes>
          </Suspense>
          
          {/* Global Footer */}
          <Footer />
          
          {/* Cookie Consent Banner */}
          <CookieConsent />
        </div>
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
