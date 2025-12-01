import React, { useState } from 'react';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import FinancialForm from '../components/FinancialForm';
import SummaryPanel from '../components/SummaryPanel';
import AIPlanPanel from '../components/AIPlanPanel';
import DashboardCharts from '../components/Dashboard';
import SmartRecommendations from '../components/SmartRecommendations';
import { calculateSummary, generateAIPlan, exportPDF } from '../services/api';
import { trackEvent } from '../components/GoogleAnalytics';

/**
 * Dashboard Page - Main Financial Planning Interface
 * SEO-optimized with structured data
 */
function Dashboard() {
  const [formData, setFormData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "VegaKash.AI Budget Planner",
    "description": "AI-powered budget planner with smart financial recommendations",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const handleCalculateSummary = async (data) => {
    setIsCalculating(true);
    setSummaryError(null);
    setAiError(null);
    setFormData(data);

    try {
      const result = await calculateSummary(data);
      setSummary(result);
      
      // Track successful calculation
      trackEvent('calculate_summary', {
        monthly_income: data.monthly_income_primary,
        savings_rate: result.savings_rate_percent,
        category: 'financial_calculation'
      });
    } catch (error) {
      setSummaryError(error.message || 'Failed to calculate summary');
      setSummary(null);
      
      // Track error
      trackEvent('calculation_error', {
        error_message: error.message,
        category: 'error'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleGenerateAIPlan = async () => {
    if (!summary || !formData) return;

    setIsGeneratingAI(true);
    setAiError(null);

    try {
      const result = await generateAIPlan(formData, summary);
      setAiPlan(result);
      
      // Track AI plan generation
      trackEvent('generate_ai_plan', {
        has_summary: !!summary,
        category: 'ai_interaction'
      });
    } catch (error) {
      setAiError(error.message || 'Failed to generate AI plan');
      setAiPlan(null);
      
      // Track error
      trackEvent('ai_plan_error', {
        error_message: error.message,
        category: 'error'
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleExportPDF = async () => {
    if (!summary) return;

    setIsExportingPDF(true);
    setPdfError(null);

    try {
      await exportPDF(formData, summary, aiPlan);
      
      // Track PDF export
      trackEvent('download_pdf', {
        has_ai_plan: !!aiPlan,
        category: 'export'
      });
    } catch (error) {
      setPdfError(error.message || 'Failed to export PDF');
      
      // Track error
      trackEvent('pdf_export_error', {
        error_message: error.message,
        category: 'error'
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleReset = () => {
    setSummary(null);
    setAiPlan(null);
    setFormData(null);
    setSummaryError(null);
    setAiError(null);
    setPdfError(null);
    setShowDashboard(false);
    setShowRecommendations(false);
  };

  const toggleDashboard = () => setShowDashboard(!showDashboard);
  const toggleRecommendations = () => setShowRecommendations(!showRecommendations);

  return (
    <>
      <SEO 
        title="VegaKash.AI - AI-Powered Budget Planner & Financial Calculator"
        description="Smart financial planning tool with AI-powered budget advice, EMI calculator, SIP calculator, and personalized savings recommendations. Free financial management made easy."
        keywords="budget planner, financial calculator, AI budget advisor, savings planner, EMI calculator, SIP calculator, financial planning"
        canonical="/"
        structuredData={structuredData}
      />
      
      <Hero />
      
      <main className="main-content">
        <div className="container">
          <div className="form-section">
            <FinancialForm 
              onCalculate={handleCalculateSummary}
              onReset={handleReset}
              isCalculating={isCalculating}
            />
          </div>
          
          {(summary || isCalculating) && (
            <div className="results-section">
              <SummaryPanel 
                summary={summary}
                error={summaryError}
                isCalculating={isCalculating}
                currency={formData?.currency || 'INR'}
              />
              
              {summary && (
                <AIPlanPanel 
                  aiPlan={aiPlan}
                  error={aiError}
                  isGenerating={isGeneratingAI}
                  onGenerate={handleGenerateAIPlan}
                  currency={formData?.currency || 'INR'}
                />
              )}
              
              {summary && (
                <div className="action-buttons-container">
                  <button 
                    onClick={handleExportPDF}
                    className="action-btn export-btn ripple-button hover-lift"
                    disabled={isExportingPDF}
                  >
                    {isExportingPDF ? '⏳ Generating PDF...' : '📄 Download PDF Report'}
                  </button>
                  
                  <button 
                    onClick={toggleDashboard}
                    className="action-btn dashboard-btn ripple-button hover-lift"
                  >
                    {showDashboard ? '📊 Hide Dashboard' : '📊 View Dashboard'}
                  </button>
                  
                  <button 
                    onClick={toggleRecommendations}
                    className="action-btn recommendations-btn ripple-button hover-lift"
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
          )}
          
          {showDashboard && summary && (
            <DashboardCharts summary={summary} formData={formData} />
          )}
          
          {showRecommendations && summary && (
            <SmartRecommendations 
              summary={summary}
              formData={formData}
              aiPlan={aiPlan}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
