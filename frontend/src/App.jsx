import React, { useState } from 'react';
import Hero from './components/Hero';
import FinancialForm from './components/FinancialForm';
import SummaryPanel from './components/SummaryPanel';
import AIPlanPanel from './components/AIPlanPanel';
import Footer from './components/Footer';
import { calculateSummary, generateAIPlan } from './services/api';
import './styles/App.css';

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
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

// TODO: Phase 2 - Add user authentication and protected routes
// TODO: Phase 2 - Add dashboard view to track financial progress over time
// TODO: Phase 2 - Add ability to save and compare multiple financial plans
// TODO: Phase 2 - Add export functionality (PDF/Excel) for plans
