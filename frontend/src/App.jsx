import React, { useState } from 'react';
import Hero from './components/Hero';
import FinancialForm from './components/FinancialForm';
import SummaryPanel from './components/SummaryPanel';
import AIPlanPanel from './components/AIPlanPanel';
import Dashboard from './components/Dashboard';
import SmartRecommendations from './components/SmartRecommendations';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import SkeletonLoader from './components/SkeletonLoader';
import ProgressBar from './components/ProgressBar';
import { calculateSummary, generateAIPlan, exportPDF } from './services/api';
import './styles/App.css';
import './styles/animations.css';

/**
 * Main App Component
 * Manages state for the entire application
 */
function App() {
  // Form data state
  const [formData, setFormData] = useState(null);
  
  // Summary state (non-AI calculations)
  const [summary, setSummary] = useState(null);
  
  // AI plan state
  const [aiPlan, setAiPlan] = useState(null);
  
  // Loading states
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Error states
  const [summaryError, setSummaryError] = useState(null);
  const [aiError, setAiError] = useState(null);
  
  // PDF export state
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  
  // View state (show/hide dashboard and recommendations)
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  /**
   * Handle form submission for summary calculation
   */
  const handleCalculateSummary = async (data) => {
    setIsCalculating(true);
    setSummaryError(null);
    setFormData(data);
    
    try {
      const result = await calculateSummary(data);
      setSummary(result);
      
      // Clear AI plan when recalculating summary
      setAiPlan(null);
      setAiError(null);
      
      // Scroll to summary section
      setTimeout(() => {
        document.getElementById('summary-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error) {
      setSummaryError(error.message);
      setSummary(null);
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * Handle AI plan generation
   */
  const handleGenerateAIPlan = async () => {
    if (!formData || !summary) {
      setAiError('Please calculate summary first before generating AI plan');
      return;
    }
    
    setIsGeneratingAI(true);
    setAiError(null);
    
    try {
      const result = await generateAIPlan(formData, summary);
      setAiPlan(result);
      
      // Scroll to AI plan section
      setTimeout(() => {
        document.getElementById('ai-plan-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error) {
      setAiError(error.message);
      setAiPlan(null);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  /**
   * Reset all data
   */
  const handleReset = () => {
    setFormData(null);
    setSummary(null);
    setAiPlan(null);
    setSummaryError(null);
    setAiError(null);
    setPdfError(null);
    setShowDashboard(false);
    setShowRecommendations(false);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  /**
   * Handle PDF export
   */
  const handleExportPDF = async () => {
    if (!formData || !summary) {
      setPdfError('Please calculate summary first before exporting PDF');
      return;
    }
    
    setIsExportingPDF(true);
    setPdfError(null);
    
    try {
      const pdfBlob = await exportPDF(formData, summary, aiPlan);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VegaKash_Financial_Plan_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('✅ PDF downloaded successfully!');
    } catch (error) {
      setPdfError(error.message);
      alert('❌ Failed to export PDF: ' + error.message);
    } finally {
      setIsExportingPDF(false);
    }
  };
  
  /**
   * Toggle dashboard visibility
   */
  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    if (!showDashboard) {
      setTimeout(() => {
        document.getElementById('dashboard-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };
  
  /**
   * Toggle smart recommendations visibility
   */
  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
    if (!showRecommendations) {
      setTimeout(() => {
        document.getElementById('recommendations-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <div className="app">
      {/* Hero Section */}
      <Hero />
      
      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column: Input Form */}
            <div className="form-column">
              <FinancialForm 
                onCalculate={handleCalculateSummary}
                onReset={handleReset}
                isCalculating={isCalculating}
              />
            </div>
            
            {/* Right Column: Results */}
            <div className="results-column">
              {/* Summary Panel */}
              <SummaryPanel 
                summary={summary}
                error={summaryError}
                isCalculating={isCalculating}
                currency={formData?.currency || 'INR'}
              />
              
              {/* AI Plan Panel */}
              {summary && (
                <AIPlanPanel 
                  aiPlan={aiPlan}
                  error={aiError}
                  isGenerating={isGeneratingAI}
                  onGenerate={handleGenerateAIPlan}
                  currency={formData?.currency || 'INR'}
                />
              )}
              
              {/* Action Buttons */}
              {summary && (
                <div className="action-buttons-container">
                  <button 
                    onClick={handleExportPDF}
                    className="action-btn export-btn"
                    disabled={isExportingPDF}
                  >
                    {isExportingPDF ? '⏳ Generating PDF...' : '📄 Download PDF Report'}
                  </button>
                  
                  <button 
                    onClick={toggleDashboard}
                    className="action-btn dashboard-btn"
                  >
                    {showDashboard ? '📊 Hide Dashboard' : '📊 View Dashboard'}
                  </button>
                  
                  <button 
                    onClick={toggleRecommendations}
                    className="action-btn recommendations-btn"
                  >
                    {showRecommendations ? '💡 Hide Recommendations' : '💡 Get Smart Tips'}
                  </button>
                </div>
              )}
              
              {pdfError && (
                <div className="error-message-inline">
                  ⚠️ {pdfError}
                </div>
              )}
            </div>
          </div>
          
          {/* Dashboard Section */}
          {summary && showDashboard && (
            <div id="dashboard-section" className="full-width-section page-transition">
              <Dashboard formData={formData} summary={summary} />
            </div>
          )}
          
          {/* Smart Recommendations Section */}
          {summary && showRecommendations && (
            <div id="recommendations-section" className="full-width-section page-transition">
              <SmartRecommendations formData={formData} />
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

// TODO: Phase 2 - Add user authentication and protected routes
// TODO: Phase 2 - Add ability to save and compare multiple financial plans
// TODO: Phase 2 - Add historical progress tracking over time
// TODO: Phase 2 - Add multi-loan management with debt payoff strategies
