import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import SEO from '../../../components/SEO';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';

/**
 * US Mortgage Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates monthly payment, total interest, and amortization for US mortgages with SEO
 * Uses production-grade layout matching existing calculator standards
 */
function MortgageCalculatorUS() {
  const { country } = useParams();
  const [principal, setPrincipal] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculateMortgage();
  }, [principal, interestRate, years]);

  const calculateMortgage = () => {
    const P = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!P || !r || !n || P <= 0 || r < 0 || n <= 0) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - P;
    setResult({ 
      monthly: monthly.toFixed(2), 
      total: total.toFixed(2), 
      interest: interest.toFixed(2),
      principal: P.toFixed(2)
    });
  };

  const handleReset = () => {
    setPrincipal(300000);
    setInterestRate(6.5);
    setYears(30);
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  // SEO configuration for global/country-specific versions
  const seoConfig = {
    title: country 
      ? `US Mortgage Calculator for ${country.toUpperCase()}`
      : 'US Mortgage Calculator – Monthly Payment & Amortization',
    description: country
      ? `Calculate your US mortgage monthly payment, total interest, and amortization for ${country.toUpperCase()}. Free, fast, accurate mortgage calculator.`
      : 'Calculate your US mortgage monthly payment, total interest, and amortization schedule. Free, fast, accurate mortgage calculator for the USA.',
    keywords: country
      ? `US mortgage calculator ${country.toUpperCase()}, monthly payment, amortization`
      : 'US mortgage calculator, monthly payment, amortization schedule, mortgage interest',
    tool: 'mortgage',
    country: country || undefined,
    supportedCountries: ['us'],
    isGlobal: !country,
  };

  return (
    <>
      {/* SEO Tags - Global & Country-Specific */}
      <EnhancedSEO {...seoConfig} />
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
      />
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>US Mortgage Calculator</h1>
          <p>Calculate your monthly mortgage payment, total interest, and amortization schedule</p>
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
                        setPrincipal(300000);
                      } else if (num < 50000) {
                        setPrincipal(50000);
                      } else if (num > 10000000) {
                        setPrincipal(10000000);
                      } else {
                        setPrincipal(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="50000"
                  max="10000000"
                  step="10000"
                  value={principal}
                  onChange={(e) => setPrincipal(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$50K</span>
                  <span>$10M</span>
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
                        setInterestRate(6.5);
                      } else if (num < 2) {
                        setInterestRate(2);
                      } else if (num > 15) {
                        setInterestRate(15);
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
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>2%</span>
                  <span>15%</span>
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
                        setYears(30);
                      } else if (num < 1) {
                        setYears(1);
                      } else if (num > 40) {
                        setYears(40);
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
                  max="40"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 Yr</span>
                  <span>40 Yrs</span>
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
                <h2>Your Mortgage Breakdown</h2>
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
          <h2>How to Calculate a US Mortgage</h2>
          <p>The formula for calculating your mortgage payment is:</p>
          <code>M = P × [r(1 + r)^n] / [(1 + r)^n - 1]</code>
          <p>Where:</p>
          <ul>
            <li><strong>M</strong> = Monthly payment</li>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
            <li><strong>n</strong> = Number of payments (years × 12)</li>
          </ul>

          <h2>US Mortgage FAQ</h2>
          <ul>
            <li><strong>What is a mortgage?</strong> A mortgage is a secured loan you take to purchase real estate, repaid in monthly installments over 15-30 years.</li>
            <li><strong>What affects mortgage rates?</strong> Credit score, loan-to-value ratio, down payment, loan term, and current market rates all influence your interest rate.</li>
            <li><strong>What's the difference between 15-year and 30-year mortgages?</strong> 30-year mortgages have lower monthly payments but higher total interest. 15-year mortgages cost more monthly but save on total interest.</li>
            <li><strong>What is PMI?</strong> Private Mortgage Insurance is required if your down payment is less than 20% of the home's purchase price.</li>
          </ul>

          <h2>Understanding Your Mortgage Payment</h2>
          <p>Your monthly mortgage payment typically includes four components (PITI):</p>
          <ul>
            <li><strong>Principal:</strong> The portion that reduces your loan balance</li>
            <li><strong>Interest:</strong> The cost of borrowing money from the lender</li>
            <li><strong>Taxes:</strong> Property taxes on your home</li>
            <li><strong>Insurance:</strong> Homeowners insurance and PMI (if applicable)</li>
          </ul>
        </section>

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "US Mortgage Calculator",
          "description": "Calculate your US mortgage monthly payment, total interest, and amortization schedule.",
          "provider": {"@type": "Organization", "name": "VegaKash.AI"},
          "applicationCategory": "Calculator",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
        })}</script>
      </div>
    </>
  );
}

export default MortgageCalculatorUS;
