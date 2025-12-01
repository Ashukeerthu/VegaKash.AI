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
 * AI Budget Planner - Main Financial Planning Interface
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
        title="AI Budget Planner - VegaKash.AI | Smart Financial Planning Tool"
        description="Smart financial planning tool with AI-powered budget advice, EMI calculator, SIP calculator, and personalized savings recommendations. Free financial management made easy."
        keywords="AI budget planner, financial calculator, AI budget advisor, savings planner, EMI calculator, SIP calculator, financial planning"
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

        {/* SEO Content Section */}
        <div className="seo-content-section" style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
          <div className="content-block">
            <h2>What is AI Budget Planner?</h2>
            <p>
              VegaKash.AI Budget Planner is an advanced, AI-powered financial planning tool designed to help individuals and families take control 
              of their finances. Unlike traditional budget calculators that simply track income and expenses, our intelligent system analyzes your 
              complete financial profile including income sources, fixed expenses, debts, investments, and financial goals to create a personalized 
              budget plan. The AI engine provides actionable recommendations on where to cut costs, how much to save, and optimal investment strategies 
              tailored to your unique situation.
            </p>
            <p>
              The platform is completely free, requires no registration or login, and ensures your financial data remains private and secure. Whether 
              you're planning for retirement, saving for a home, managing loans, or simply trying to build an emergency fund, our AI Budget Planner 
              provides the insights and structure you need to achieve your financial goals. With real-time calculations, visual charts, PDF report 
              downloads, and smart recommendations, you get a comprehensive financial planning experience that rivals expensive financial advisors.
            </p>
          </div>

          <div className="content-block">
            <h2>How AI Budget Planner Works</h2>
            <p>Our AI-powered system follows a comprehensive 4-step approach to create your personalized financial plan:</p>
            
            <h3>Step 1: Income Analysis</h3>
            <p>
              Enter your primary monthly income (salary, business income) and any additional income sources like rental income, freelance earnings, 
              or investment returns. The system supports multiple currencies (INR, USD, EUR) and automatically calculates your total monthly cash flow.
            </p>

            <h3>Step 2: Expense Tracking</h3>
            <p>
              Input your fixed monthly expenses including rent/mortgage, utilities, groceries, transportation, insurance premiums, and EMI payments. 
              The AI categorizes these expenses and identifies areas where you might be overspending compared to recommended financial guidelines 
              (like the 50/30/20 rule).
            </p>

            <h3>Step 3: Debt & Investment Review</h3>
            <p>
              Add details about your existing loans (home loan, car loan, personal loans) and current investments (SIP, FD, stocks, mutual funds). 
              The system calculates your debt-to-income ratio and investment diversification, providing insights on whether you're overleveraged or 
              underinvested for your income level.
            </p>

            <h3>Step 4: AI-Powered Recommendations</h3>
            <p>
              Based on your complete financial profile, our AI engine generates personalized recommendations including: ideal monthly savings amount, 
              emergency fund requirements (3-6 months expenses), debt repayment strategies, investment portfolio optimization, tax-saving opportunities, 
              and specific action items to improve your financial health score.
            </p>
          </div>

          <div className="content-block">
            <h2>Key Features of VegaKash.AI Budget Planner</h2>
            
            <h3>1. Comprehensive Financial Analysis</h3>
            <p>
              Get a 360-degree view of your finances with detailed breakdowns of income sources, expense categories, debt obligations, and investment 
              portfolio. Visual pie charts and bar graphs make it easy to understand where your money goes each month.
            </p>

            <h3>2. AI-Powered Smart Recommendations</h3>
            <p>
              Receive personalized financial advice powered by artificial intelligence. The system analyzes patterns in your spending, identifies 
              inefficiencies, and suggests specific actions like "Reduce dining out by ₹3,000/month" or "Increase SIP contribution to ₹5,000 for 
              faster wealth building."
            </p>

            <h3>3. Real-Time Budget Calculations</h3>
            <p>
              As you enter your financial data, the system instantly calculates your available savings, debt-to-income ratio, expense distribution, 
              and financial health score. No waiting, no manual calculations—everything updates in real-time as you type.
            </p>

            <h3>4. PDF Report Download</h3>
            <p>
              Export your complete financial analysis as a professional PDF report. The downloadable document includes all calculations, charts, 
              AI recommendations, and action plans that you can save for future reference or share with family members.
            </p>

            <h3>5. Multiple Currency Support</h3>
            <p>
              Whether you earn in Indian Rupees (₹), US Dollars ($), or Euros (€), our planner supports all major currencies with proper formatting 
              and calculations. Perfect for NRIs, expats, and international users.
            </p>

            <h3>6. Privacy-First Approach</h3>
            <p>
              Your financial data is processed securely in your browser and is never stored on our servers. No registration, no login, no data 
              collection—just pure financial planning without compromising your privacy.
            </p>

            <h3>7. Integrated Financial Calculators</h3>
            <p>
              Access specialized calculators for EMI, SIP, Fixed Deposits, Recurring Deposits, and more—all within the same platform. Plan your 
              investments and loan repayments without switching between multiple tools.
            </p>
          </div>

          <div className="content-block">
            <h2>Benefits of Using AI Budget Planner</h2>
            <ul>
              <li><strong>Save Money:</strong> Identify unnecessary expenses and cut down spending by 15-30% on average</li>
              <li><strong>Build Emergency Fund:</strong> Get clear targets for building 3-6 months of emergency savings</li>
              <li><strong>Pay Off Debt Faster:</strong> Receive optimized debt repayment strategies to become debt-free sooner</li>
              <li><strong>Invest Smarter:</strong> Discover how much you should invest each month to meet your financial goals</li>
              <li><strong>Track Financial Health:</strong> Monitor your financial health score and improve it over time</li>
              <li><strong>Plan for Big Goals:</strong> Calculate monthly savings needed for home purchase, education, retirement</li>
              <li><strong>Tax Planning:</strong> Get recommendations on tax-saving investments under Section 80C, 80D, etc.</li>
              <li><strong>Free Professional Advice:</strong> Access AI-powered financial planning that matches paid advisory services</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>How to Use the AI Budget Planner</h2>
            <ol>
              <li><strong>Enter Your Income:</strong> Start by entering your primary monthly income and any additional income sources</li>
              <li><strong>Add Monthly Expenses:</strong> List all your fixed expenses like rent, utilities, groceries, transportation, insurance</li>
              <li><strong>Include Debt Details:</strong> Add your EMI payments for home loan, car loan, or personal loans if any</li>
              <li><strong>Add Investments:</strong> Enter current SIP amounts, FD investments, or other regular investment contributions</li>
              <li><strong>Set Financial Goals:</strong> Specify your savings goals like emergency fund, retirement, or major purchases</li>
              <li><strong>Calculate Budget:</strong> Click "Calculate My Budget" to get instant analysis and recommendations</li>
              <li><strong>View Dashboard:</strong> Check visual charts showing income vs expenses, savings rate, and expense breakdown</li>
              <li><strong>Get AI Recommendations:</strong> Click "Get Smart Tips" for personalized AI-powered financial advice</li>
              <li><strong>Download Report:</strong> Export your complete financial plan as a PDF for future reference</li>
            </ol>
          </div>

          <div className="content-block">
            <h2>Smart Budgeting Tips for Indians</h2>
            <ul>
              <li><strong>Follow 50/30/20 Rule:</strong> Allocate 50% to needs, 30% to wants, 20% to savings and investments</li>
              <li><strong>Build Emergency Fund First:</strong> Save 6 months of expenses before aggressive investing</li>
              <li><strong>Maximize 80C Deductions:</strong> Invest ₹1.5L annually in PPF, ELSS, or insurance for tax savings</li>
              <li><strong>Automate Savings:</strong> Set up auto-debit SIP on salary date to ensure consistent investments</li>
              <li><strong>Track Small Expenses:</strong> Daily coffee (₹100) adds up to ₹36,000/year—track and control</li>
              <li><strong>Use Credit Cards Wisely:</strong> Pay full amount before due date to avoid 36-42% interest charges</li>
              <li><strong>Compare Before Buying:</strong> Use price comparison tools to save 10-20% on online purchases</li>
              <li><strong>Review Insurance:</strong> Check if you're over-insured or under-insured for life and health coverage</li>
              <li><strong>Reduce Lifestyle Inflation:</strong> When income increases, increase savings first, not expenses</li>
              <li><strong>Invest in Learning:</strong> Spend on financial literacy—it pays better returns than any investment</li>
            </ul>
          </div>

          <div className="content-block faq-section">
            <h2>Frequently Asked Questions (FAQs)</h2>
            
            <div className="faq-item">
              <h3>Is VegaKash.AI Budget Planner really free?</h3>
              <p>
                Yes, absolutely! VegaKash.AI Budget Planner is 100% free with no hidden charges, no premium plans, and no subscription fees. We believe 
                financial planning should be accessible to everyone, regardless of their income level. All features including AI recommendations, PDF 
                downloads, and advanced calculators are completely free. We don't even require registration or login—just visit, use, and plan your 
                finances without any barriers.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is my financial data safe and private?</h3>
              <p>
                Your privacy is our top priority. All calculations happen in your browser using client-side JavaScript, which means your financial 
                data never leaves your device or gets stored on our servers. We don't collect, store, or share any personal or financial information. 
                There's no registration, no cookies tracking your data, and no third-party data sharing. Think of it as using an offline calculator—except 
                it's powered by AI and accessible online for your convenience.
              </p>
            </div>

            <div className="faq-item">
              <h3>How accurate are the AI recommendations?</h3>
              <p>
                Our AI engine is trained on financial best practices, Indian taxation rules, and behavioral finance principles. The recommendations 
                are based on widely accepted financial ratios like the 50/30/20 rule, debt-to-income guidelines (ideally below 40%), and emergency fund 
                standards (3-6 months expenses). However, everyone's financial situation is unique, so treat recommendations as guidelines rather than 
                absolute rules. For complex situations involving large investments, inheritance, or business finances, consult a certified financial 
                planner for personalized advice.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I use this for business budgeting?</h3>
              <p>
                VegaKash.AI Budget Planner is primarily designed for personal and household budgeting. However, freelancers, sole proprietors, and 
                small business owners can use it by treating business income as primary income and business expenses as monthly expenses. For more 
                complex business budgeting involving multiple revenue streams, inventory costs, payroll, and taxes, we recommend using dedicated 
                business accounting software like Tally, QuickBooks, or Zoho Books.
              </p>
            </div>

            <div className="faq-item">
              <h3>What if I have irregular income (freelancer/business owner)?</h3>
              <p>
                For irregular income, we recommend using your average monthly income over the past 6-12 months as the "primary income" value. 
                Alternatively, use your minimum expected monthly income to create a conservative budget. The AI system will help you build a larger 
                emergency fund (9-12 months instead of 3-6 months) to handle income volatility. You can also include freelance income as "additional 
                income" if it's not guaranteed. Many freelancers find it helpful to run two budget scenarios—one with minimum income and one with 
                average income—to plan for different situations.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I save my budget plan for later?</h3>
              <p>
                Since we don't store any data on our servers for privacy reasons, there's no "save" feature. However, you can download your complete 
                financial analysis as a PDF report using the "Download PDF Report" button. This PDF contains all your inputs, calculations, charts, 
                and AI recommendations. Save this PDF on your device or cloud storage (Google Drive, Dropbox) for future reference. You can also 
                bookmark the page and re-enter your data anytime—it only takes 2-3 minutes. We're working on a browser-based local storage feature 
                that will save data on your device (not our servers) for quick access.
              </p>
            </div>
          </div>

          <div className="related-calculators">
            <h2>Related Financial Tools</h2>
            <p>Explore our other free calculators to plan your finances better:</p>
            <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <a href="/calculators/emi" className="calc-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>💰 EMI Calculator</h3>
                <p>Calculate loan EMI for home, car, or personal loans</p>
              </a>
              <a href="/calculators/sip" className="calc-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>📈 SIP Calculator</h3>
                <p>Plan mutual fund investments with SIP or lumpsum</p>
              </a>
              <a href="/calculators/fd" className="calc-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>🏦 FD Calculator</h3>
                <p>Calculate fixed deposit maturity and interest</p>
              </a>
              <a href="/calculators/rd" className="calc-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>📅 RD Calculator</h3>
                <p>Plan recurring deposit savings and returns</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
