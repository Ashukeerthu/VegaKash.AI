import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import EMICalculator from './pages/EMICalculator';
import SIPCalculator from './pages/SIPCalculator';
import VideoTutorials from './pages/VideoTutorials';
import About from './pages/About';
import SEO from './components/SEO';
import './styles/App.css';
import './styles/animations.css';

/**
 * Main App Component with Routing
 * SEO-optimized structure with React Router
 */
function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app">
          {/* Global Navigation */}
          <Navbar />
          
          {/* Main Content with Routes */}
          <Routes>
            {/* Home - Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Calculators */}
            <Route path="/calculators/emi" element={<EMICalculator />} />
            <Route path="/calculators/sip" element={<SIPCalculator />} />
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
          </Routes>
          
          {/* Global Footer */}
          <Footer />
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
