import React, { lazy, Suspense } from 'react';
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

// Lazy load pages for code splitting and faster initial load
// Critical path: Dashboard loads immediately
import Dashboard from './pages/Dashboard';

// Non-critical pages: Load on demand
const CalculatorHub = lazy(() => import('./pages/CalculatorHub'));
const EMICalculator = lazy(() => import('./pages/calculators/EMICalculator'));
const SIPCalculator = lazy(() => import('./pages/calculators/SIPCalculator'));
const FDCalculator = lazy(() => import('./pages/calculators/FDCalculator'));
const RDCalculator = lazy(() => import('./pages/calculators/RDCalculator'));
const VideoTutorials = lazy(() => import('./pages/VideoTutorials'));
const About = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

/**
 * Main App Component with Routing
 * SEO-optimized structure with React Router
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
          
          {/* Main Content with Routes */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Home - AI Budget Planner */}
              <Route path="/" element={<Dashboard />} />
            
            {/* Calculators Hub */}
            <Route path="/calculators" element={<CalculatorHub />} />
            
            {/* Financial Calculators - Top Priority */}
            <Route path="/calculators/emi" element={<EMICalculator />} />
            <Route path="/calculators/sip" element={<SIPCalculator />} />
            <Route path="/calculators/fd" element={<FDCalculator />} />
            <Route path="/calculators/rd" element={<RDCalculator />} />
            
            {/* Calculators - Coming Soon */}
            <Route path="/calculators/income-tax" element={<ComingSoon title="Income Tax Calculator" />} />
            <Route path="/calculators/savings-goal" element={<ComingSoon title="Savings Goal Calculator" />} />
            <Route path="/calculators/emergency-fund" element={<ComingSoon title="Emergency Fund Calculator" />} />
            <Route path="/calculators/retirement" element={<ComingSoon title="Retirement Calculator" />} />
            <Route path="/calculators/home-loan-affordability" element={<ComingSoon title="Home Loan Affordability Calculator" />} />
            <Route path="/calculators/loan" element={<ComingSoon title="Loan Calculator" />} />
            <Route path="/calculators/auto-loan" element={<ComingSoon title="Auto Loan Calculator" />} />
            <Route path="/calculators/interest" element={<ComingSoon title="Interest Calculator" />} />
            <Route path="/calculators/mortgage" element={<ComingSoon title="Mortgage Calculator" />} />
            
            {/* Learning */}
            <Route path="/learning/videos" element={<VideoTutorials />} />
            <Route path="/learning/guides" element={<ComingSoon title="Financial Guides" />} />
            <Route path="/learning/blog" element={<ComingSoon title="Blog Articles" />} />
            
            {/* About */}
            <Route path="/about" element={<About />} />
            
            {/* Legal Pages - Required for AdSense */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
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
