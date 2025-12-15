import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';
import ScrollToTop from '../../../modules/core/ui/ScrollToTop';

/**
 * US Credit Card Payoff Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates months to pay off and total interest for US credit card debt with SEO
 * Uses production-grade layout matching existing calculator standards
 */
function CreditCardPayoffCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Credit Card Payoff Calculator', path: null }
  ];
  
  const [balance, setBalance] = useState(5000);
  const [interestRate, setInterestRate] = useState(18.0);
  const [monthlyPayment, setMonthlyPayment] = useState(200);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculatePayoff();
  }, [balance, interestRate, monthlyPayment]);

  const calculatePayoff = () => {
    const P = parseFloat(balance);
    const r = parseFloat(interestRate) / 100 / 12;
    const M = parseFloat(monthlyPayment);
    if (!P || !r || !M || P <= 0 || r < 0 || M <= 0) return;
    const n = Math.log(1 - r * P / M) / Math.log(1 + r) * -1;
    const totalPaid = M * n;
    const interest = totalPaid - P;
    setResult({ months: Math.ceil(n), totalPaid: totalPaid.toFixed(2), interest: interest.toFixed(2), balance: P.toFixed(2) });
  };

  const handleReset = () => {
    setBalance(5000);
    setInterestRate(18.0);
    setMonthlyPayment(200);
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <>
      <ScrollToTop threshold={300} />
      <EnhancedSEO 
        title={`US Credit Card Payoff Calculator${country ? ` for ${country.toUpperCase()}` : ''}`}
        description={`Calculate how long it will take to pay off your credit card debt and total interest${country ? ` for ${country.toUpperCase()}` : ''}. Free, fast, accurate payoff calculator.`}
        tool="credit-card-payoff"
        country={country}
        isGlobal={!country}
      />
      <SEO 
        title="US Credit Card Payoff Calculator | VegaKash" 
        description="Calculate how long it will take to pay off your US credit card debt and total interest paid. Free, fast, accurate payoff calculator for the USA." 
      />

      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1>US Credit Card Payoff Calculator</h1>
          <p>Calculate how long it will take to pay off your credit card debt and total interest charges</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              <div className="inputs-grid">
              {/* Card Details Section */}
              <details open style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Card Details</summary>

              {/* Credit Card Balance */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Credit Card Balance</label>
                  <input
                    type="text"
                    value={formatCurrency(balance)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setBalance('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setBalance(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      
                      if (val === '' || isNaN(num)) {
                        setBalance(5000);
                      } else if (num < 100) {
                        setBalance(100);
                      } else if (num > 100000) {
                        setBalance(100000);
                      } else {
                        setBalance(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="100"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$100</span>
                  <span>$100K</span>
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
                        setInterestRate(18.0);
                      } else if (num < 5) {
                        setInterestRate(5);
                      } else if (num > 36) {
                        setInterestRate(36);
                      } else {
                        setInterestRate(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="5"
                  max="36"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>5%</span>
                  <span>36%</span>
                </div>
              </div>
                </details>

                {/* Payment Strategy Section */}
                <details style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Payment Strategy</summary>

              {/* Monthly Payment */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Monthly Payment</label>
                  <input
                    type="text"
                    value={formatCurrency(monthlyPayment)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setMonthlyPayment('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setMonthlyPayment(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      
                      if (val === '' || isNaN(num)) {
                        setMonthlyPayment(200);
                      } else if (num < 10) {
                        setMonthlyPayment(10);
                      } else if (num > 10000) {
                        setMonthlyPayment(10000);
                      } else {
                        setMonthlyPayment(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$10</span>
                  <span>$10K</span>
                </div>
              </div>
                </details>
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
                <h2>Your Payoff Plan</h2>
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">Time to Payoff</div>
                    <div className="result-value">{result.months} months</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Current Balance</div>
                    <div className="result-value">{formatCurrency(result.balance)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Total Interest</div>
                    <div className="result-value">{formatCurrency(result.interest)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Total Amount Paid</div>
                    <div className="result-value">{formatCurrency(result.totalPaid)}</div>
                  </div>
                </div>

                <div className="breakdown-chart">
                  <h3>Payment Breakdown</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ width: `${(result.balance / result.totalPaid * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Principal</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ width: `${(result.interest / result.totalPaid * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Interest</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color principal"></div>
                      <span>Principal: {formatCurrency(result.balance)}</span>
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
        <div className="seo-content-section">
          <div className="content-block">
            <h2>How to Calculate Credit Card Payoff</h2>
            <p>The formula for calculating months to pay off your credit card is:</p>
            <div className="formula-box">
              <strong>n = -log(1 - r×P/M) / log(1 + r)</strong>
            </div>
            <p>Where:</p>
            <ul>
              <li><strong>P</strong> = Current balance</li>
              <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
              <li><strong>M</strong> = Monthly payment amount</li>
              <li><strong>n</strong> = Number of months to pay off</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>US Credit Card Payoff FAQ</h2>
            <ul>
              <li><strong>How can I pay off my card faster?</strong> Increase your monthly payment amount to reduce interest charges and payoff time.</li>
              <li><strong>What if my payment is only minimum payment?</strong> Minimum payments typically cover only interest, making payoff take much longer.</li>
              <li><strong>Do different cards have different rates?</strong> Yes, credit card rates vary widely based on creditworthiness and promotional offers.</li>
              <li><strong>How much money can I save by paying faster?</strong> Use this calculator to compare different payment amounts and see the savings.</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Credit Card Payoff Strategies</h2>
            <p>Try these approaches to pay off credit card debt faster:</p>
            <ul>
              <li><strong>Avalanche Method:</strong> Pay off cards with highest interest rates first</li>
              <li><strong>Snowball Method:</strong> Pay off smallest balances first for psychological wins</li>
              <li><strong>Balance Transfer:</strong> Move balance to 0% APR card if available</li>
              <li><strong>Debt Consolidation:</strong> Combine multiple cards into one lower-rate loan</li>
            </ul>
          </div>
        </div>

        <AEOContentSection tool="creditcard" country={country} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "US Credit Card Payoff Calculator",
          "description": "Calculate how long it will take to pay off your US credit card debt and total interest paid.",
          "provider": {"@type": "Organization", "name": "VegaKash.AI"},
          "applicationCategory": "Calculator",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
        })}</script>
      </div>
    </>
  );
}

export default CreditCardPayoffCalculatorUS;
