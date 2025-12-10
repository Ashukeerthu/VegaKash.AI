/**
 * EXAMPLE: EMI Calculator with Full SEO/AEO/GEO Implementation
 * 
 * This is a complete example showing how to integrate all AEO components.
 * Copy this pattern to update other calculator pages.
 * 
 * Features Implemented:
 * ✅ DirectAnswerBox - Featured snippet optimization
 * ✅ StepByStepGuide - HowTo schema
 * ✅ FormulaDisplay - Mathematical formulas
 * ✅ FAQSection - FAQPage schema
 * ✅ Complete structured data
 * ✅ AI-friendly markers
 * ✅ GEO contextual content
 */

import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import DirectAnswerBox from '../components/DirectAnswerBox';
import StepByStepGuide from '../components/StepByStepGuide';
import FormulaDisplay from '../components/FormulaDisplay';
import FAQSection from '../components/FAQSection';
import { generateCompleteAEO } from '../utils/aeoOptimization';
import { getCalculatorFAQs } from '../schemas/faq';
import { howToTemplates } from '../schemas/howto';
import { generateCompleteCalculatorSchemas } from '../schemas/calculator';
import '../styles/Pages.css';

function EMICalculatorExample() {
  // Calculator State
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(60);
  const [emi, setEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate EMI
  useEffect(() => {
    const monthlyRate = rate / 12 / 100;
    const months = tenure;
    
    if (monthlyRate === 0) {
      setEMI(principal / months);
      setTotalInterest(0);
      setTotalAmount(principal);
    } else {
      const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
      const totalAmountValue = emiValue * months;
      const totalInterestValue = totalAmountValue - principal;
      
      setEMI(Math.round(emiValue));
      setTotalInterest(Math.round(totalInterestValue));
      setTotalAmount(Math.round(totalAmountValue));
    }
  }, [principal, rate, tenure]);

  // Get AEO Content
  const aeoContent = generateCompleteAEO('emi');
  const faqs = getCalculatorFAQs('emi', 'India');
  const howToSteps = howToTemplates.emi.steps;

  // Structured Data
  const schemas = generateCompleteCalculatorSchemas({
    calculator: {
      name: 'EMI Calculator',
      description: 'Calculate your loan Equated Monthly Installment (EMI) instantly with our free online calculator',
      url: 'https://vegakash.ai/calculators/emi',
      country: 'India',
      applicationCategory: 'FinanceApplication',
      image: 'https://vegakash.ai/images/emi-calculator.png'
    },
    breadcrumb: [
      { name: 'Home', url: 'https://vegakash.ai' },
      { name: 'Calculators', url: 'https://vegakash.ai/calculators' },
      { name: 'EMI Calculator', url: 'https://vegakash.ai/calculators/emi' }
    ]
  });

  return (
    <>
      <SEO 
        title="EMI Calculator - Calculate Loan EMI Instantly | VegaKash.AI"
        description="Free EMI calculator for home loans, car loans, and personal loans. Calculate monthly EMI, total interest, and payment schedule instantly. Accurate EMI calculation for India."
        keywords="EMI calculator, loan EMI calculator, home loan EMI, car loan EMI, personal loan calculator, monthly installment calculator India"
        canonical="/calculators/emi"
        structuredData={schemas}
      />
      
      <div className="page-container">
        {/* Direct Answer Box - Top for AI extraction */}
        <DirectAnswerBox 
          question={aeoContent.directAnswer.question}
          answer={aeoContent.directAnswer.answer}
          useCase={aeoContent.directAnswer.useCase}
          benefit={aeoContent.directAnswer.benefit}
          aiSummary={aeoContent.directAnswer.aiSummary}
        />

        {/* Page Header */}
        <div className="page-header">
          <h1 data-ai-title="true">💰 EMI Calculator</h1>
          <p className="subtitle">Calculate your Equated Monthly Installment for any loan instantly</p>
        </div>
        
        {/* Calculator Section */}
        <div className="calculator-section" role="main">
          <div className="calculator-card">
            <h2>Calculate Your EMI</h2>
            
            <div className="calculator-inputs">
              <div className="input-group">
                <label htmlFor="principal">Loan Amount (₹)</label>
                <input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  min="10000"
                  max="100000000"
                  step="10000"
                />
                <input
                  type="range"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  min="10000"
                  max="10000000"
                  step="10000"
                  className="range-slider"
                />
              </div>

              <div className="input-group">
                <label htmlFor="rate">Interest Rate (% per year)</label>
                <input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  min="1"
                  max="30"
                  step="0.1"
                />
                <input
                  type="range"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  min="1"
                  max="30"
                  step="0.1"
                  className="range-slider"
                />
              </div>

              <div className="input-group">
                <label htmlFor="tenure">Loan Tenure (months)</label>
                <input
                  id="tenure"
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  min="6"
                  max="360"
                  step="1"
                />
                <input
                  type="range"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  min="6"
                  max="360"
                  step="1"
                  className="range-slider"
                />
              </div>
            </div>

            <div className="calculator-results">
              <div className="result-card primary">
                <h3>Monthly EMI</h3>
                <p className="result-value">₹{emi.toLocaleString('en-IN')}</p>
              </div>

              <div className="result-card">
                <h3>Total Interest</h3>
                <p className="result-value">₹{totalInterest.toLocaleString('en-IN')}</p>
              </div>

              <div className="result-card">
                <h3>Total Amount</h3>
                <p className="result-value">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="result-breakdown">
              <h3>Payment Breakdown</h3>
              <div className="breakdown-row">
                <span>Principal Amount:</span>
                <strong>₹{principal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="breakdown-row">
                <span>Total Interest:</span>
                <strong>₹{totalInterest.toLocaleString('en-IN')}</strong>
              </div>
              <div className="breakdown-row total">
                <span>Total Payment:</span>
                <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <StepByStepGuide 
          title={howToTemplates.emi.name}
          steps={howToSteps}
          estimatedTime="PT5M"
          difficulty="Easy"
          tool="EMI Calculator"
        />

        {/* Formula Display */}
        <FormulaDisplay 
          title="EMI Calculation Formula"
          formula={
            <>
              EMI = P × r × (1 + r)<sup>n</sup> / [(1 + r)<sup>n</sup> - 1]
            </>
          }
          plainText="EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]"
          variables={[
            { 
              symbol: 'P', 
              description: 'Principal loan amount', 
              unit: '₹' 
            },
            { 
              symbol: 'r', 
              description: 'Monthly interest rate (Annual Rate / 12 / 100)' 
            },
            { 
              symbol: 'n', 
              description: 'Loan tenure in months', 
              unit: 'months' 
            },
            { 
              symbol: 'EMI', 
              description: 'Equated Monthly Installment', 
              unit: '₹' 
            }
          ]}
          example={{
            input: 'Loan Amount: ₹5,00,000, Interest Rate: 10% per year, Tenure: 5 years (60 months)',
            calculation: 'r = 10 / 12 / 100 = 0.008333, EMI = 500000 × 0.008333 × (1.008333)^60 / [(1.008333)^60 - 1]',
            result: 'Monthly EMI = ₹10,624 (approx.)'
          }}
          note="The EMI remains constant throughout the loan tenure, but the proportion of principal and interest changes each month."
        />

        {/* Contextual Content for GEO */}
        <section 
          className="contextual-content"
          data-ai-summary="true"
          data-content-type="contextual"
        >
          <h2>Understanding EMI Calculations in India</h2>
          <div data-ai-extract="primary">
            <p>
              {aeoContent.contextualContent.content}
            </p>
            
            <h3>Why Use an EMI Calculator?</h3>
            <p>
              An EMI calculator helps you plan your finances before taking a loan. By knowing your exact monthly payment, 
              you can budget effectively and avoid financial stress. Whether you're planning to buy a home, purchase a car, 
              or need personal funds, understanding your EMI commitment is crucial for financial health.
            </p>

            <h3>Factors Affecting Your EMI</h3>
            <ul>
              <li><strong>Loan Amount:</strong> Higher loan amounts result in higher EMIs</li>
              <li><strong>Interest Rate:</strong> Even a 1% difference significantly impacts total interest paid</li>
              <li><strong>Loan Tenure:</strong> Longer tenure reduces EMI but increases total interest</li>
              <li><strong>Prepayment:</strong> Regular prepayments can substantially reduce interest burden</li>
            </ul>

            <h3>EMI vs. Flat Rate Interest</h3>
            <p>
              Banks typically use the reducing balance method, where interest is calculated on the outstanding principal. 
              This differs from flat rate interest, which is calculated on the original loan amount throughout the tenure. 
              Our EMI calculator uses the reducing balance method, which is the standard in India.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection 
          title="EMI Calculator - Frequently Asked Questions"
          faqs={faqs}
          url="https://vegakash.ai/calculators/emi"
          defaultOpen={0}
        />

        {/* Additional Tips */}
        <section className="tips-section">
          <h2>💡 Smart Tips for Managing Your EMI</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🎯 Keep EMI Under 40%</h3>
              <p>Financial experts recommend keeping your EMI obligations below 40% of your monthly income for financial stability.</p>
            </div>
            <div className="tip-card">
              <h3>📊 Compare Offers</h3>
              <p>Use this calculator to compare loan offers from different banks. Even 0.5% rate difference can save lakhs over time.</p>
            </div>
            <div className="tip-card">
              <h3>💰 Consider Prepayment</h3>
              <p>If your loan allows prepayment without penalty, consider paying extra principal whenever possible to reduce interest.</p>
            </div>
            <div className="tip-card">
              <h3>📈 Check Your Credit Score</h3>
              <p>A higher credit score (750+) can help you negotiate better interest rates, significantly reducing your EMI.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default EMICalculatorExample;
