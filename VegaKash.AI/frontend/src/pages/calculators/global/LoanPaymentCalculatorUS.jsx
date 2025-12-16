import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';

/**
 * US Loan Payment Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates monthly payment and total interest for any US loan with SEO
 * Uses production-grade layout matching existing calculator standards
 */
function LoanPaymentCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Loan Payment Calculator', path: null }
  ];
  
  const [principal, setPrincipal] = useState(10000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculateLoan();
  }, [principal, interestRate, years]);

  const calculateLoan = () => {
    const P = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!P || !r || !n || P <= 0 || r < 0 || n <= 0) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - P;
    setResult({ monthly: monthly.toFixed(2), total: total.toFixed(2), interest: interest.toFixed(2), principal: P.toFixed(2) });
  };

  const handleReset = () => {
    setPrincipal(10000);
    setInterestRate(7.5);
    setYears(5);
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <>
      <EnhancedSEO 
        title={`US Loan Calculator${country ? ` for ${country.toUpperCase()}` : ''}`}
        description={`Calculate your US loan monthly payment and total interest${country ? ` for ${country.toUpperCase()}` : ''}. Free, fast, accurate loan payment calculator.`}
        tool="loan"
        country={country}
        isGlobal={!country}
      />
      <SEO 
        title="US Loan Payment Calculator – Monthly & Total Interest | VegaKash" 
        description="Calculate your US loan monthly payment and total interest. Free, fast, accurate loan payment calculator for the USA." 
      />

      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1>US Loan Payment Calculator</h1>
          <p>Calculate your monthly loan payment, total interest, and repayment schedule</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              {/* Loan Amount */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Loan Amount</label>
                  <input
                    type="text"
                    value={formatCurrency(principal)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setPrincipal('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setPrincipal(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      
                      if (val === '' || isNaN(num)) {
                        setPrincipal(10000);
                      } else if (num < 1000) {
                        setPrincipal(1000);
                      } else if (num > 1000000) {
                        setPrincipal(1000000);
                      } else {
                        setPrincipal(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={principal}
                  onChange={(e) => setPrincipal(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$1K</span>
                  <span>$1M</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Interest Rate (% p.a.)</label>
                  <input
                    type="text"
                    value={`${interestRate}%`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      if (val === '') {
                        setInterestRate('');
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setInterestRate(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      const num = parseFloat(val);
                      
                      if (val === '' || isNaN(num)) {
                        setInterestRate(7.5);
                      } else if (num < 2) {
                        setInterestRate(2);
                      } else if (num > 25) {
                        setInterestRate(25);
                      } else {
                        setInterestRate(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>2%</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Loan Term</label>
                  <input
                    type="text"
                    value={`${years} Yrs`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setYears('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setYears(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      
                      if (val === '' || isNaN(num)) {
                        setYears(5);
                      } else if (num < 1) {
                        setYears(1);
                      } else if (num > 30) {
                        setYears(30);
                      } else {
                        setYears(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              {/* Reset Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleReset} className="btn-reset">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="calculator-results">
                <h2>Your Loan Breakdown</h2>
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">Monthly Payment</div>
                    <div className="result-value">{formatCurrency(result.monthly)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Loan Amount</div>
                    <div className="result-value">{formatCurrency(result.principal)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Total Interest</div>
                    <div className="result-value">{formatCurrency(result.interest)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Total Amount Paid</div>
                    <div className="result-value">{formatCurrency(result.total)}</div>
                  </div>
                </div>

                <div className="breakdown-chart">
                  <h3>Payment Breakdown</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ width: `${(result.principal / result.total * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Principal</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ width: `${(result.interest / result.total * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Interest</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color principal"></div>
                      <span>Principal: {formatCurrency(result.principal)}</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color interest"></div>
                      <span>Interest: {formatCurrency(result.interest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <section className="seo-content">
          <h2>How to Calculate US Loan Payments</h2>
          <p>The formula for calculating your loan payment is:</p>
          <code>M = P × [r(1 + r)^n] / [(1 + r)^n - 1]</code>
          <p>Where:</p>
          <ul>
            <li><strong>M</strong> = Monthly payment</li>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
            <li><strong>n</strong> = Number of payments (years × 12)</li>
          </ul>

          <h2>US Loan Payment FAQ</h2>
          <ul>
            <li><strong>What is a loan payment?</strong> The amount you pay monthly to repay a loan, including both principal and interest.</li>
            <li><strong>How is US loan interest calculated?</strong> Most US loans use monthly compounding and fixed rates for the life of the loan.</li>
            <li><strong>What affects my loan rate?</strong> Credit score, loan amount, loan term, purpose, and current market rates all influence your interest rate.</li>
            <li><strong>Can I pay off my loan early?</strong> Yes, most loans allow early repayment without penalties, which can save you significant interest.</li>
          </ul>

          <h2>Types of US Loans</h2>
          <p>Different loan types have varying terms and interest rates:</p>
          <ul>
            <li><strong>Auto Loans:</strong> Typically 3-7 years with interest rates based on credit score and vehicle type</li>
            <li><strong>Personal Loans:</strong> Unsecured loans with terms usually 2-7 years</li>
            <li><strong>Student Loans:</strong> Federal and private loans with various repayment options</li>
            <li><strong>Home Equity Loans:</strong> Secured against your home with competitive rates</li>
          </ul>
        </section>

        {/* AEO Content Section - Optimized for Answer Engines */}
        <AEOContentSection tool="loan" country={country} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "US Loan Payment Calculator",
          "description": "Calculate your US loan monthly payment and total interest.",
          "provider": {"@type": "Organization", "name": "VegaKash.AI"},
          "applicationCategory": "Calculator",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
        })}</script>
      </div>
    </>
  );
}

export default LoanPaymentCalculatorUS;
