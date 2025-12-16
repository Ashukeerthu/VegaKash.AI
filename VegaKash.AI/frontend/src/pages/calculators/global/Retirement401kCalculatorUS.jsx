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
 * US 401(k) Retirement Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Estimates 401k retirement savings growth with proper SEO
 * Uses production-grade layout matching existing calculator standards
 */
function Retirement401kCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: '401(k) Retirement Calculator', path: null }
  ];
  
  const [currentBalance, setCurrentBalance] = useState(20000);
  const [annualContribution, setAnnualContribution] = useState(6000);
  const [years, setYears] = useState(30);
  const [annualReturn, setAnnualReturn] = useState(7.0);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculate401k();
  }, [currentBalance, annualContribution, years, annualReturn]);

  const calculate401k = () => {
    const P = parseFloat(currentBalance);
    const C = parseFloat(annualContribution);
    const r = parseFloat(annualReturn) / 100;
    const n = parseFloat(years);
    if (!P || !C || !r || !n || P < 0 || C < 0 || r < 0 || n <= 0) return;
    const FV = P * Math.pow(1 + r, n) + C * ((Math.pow(1 + r, n) - 1) / r);
    const totalContributed = P + (C * n);
    setResult({ futureValue: FV.toFixed(2), totalContributed: totalContributed.toFixed(2), gain: (FV - totalContributed).toFixed(2) });
  };

  const handleReset = () => {
    setCurrentBalance(20000);
    setAnnualContribution(6000);
    setYears(30);
    setAnnualReturn(7.0);
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <>
      <EnhancedSEO 
        title={`US 401(k) Retirement Calculator${country ? ` for ${country.toUpperCase()}` : ''}`}
        description={`Estimate your 401k retirement savings growth${country ? ` for ${country.toUpperCase()}` : ''}. Plan your retirement with our 401k calculator.`}
        tool="retirement-401k"
        country={country}
        isGlobal={!country}
      />
      <SEO title="US 401(k) Retirement Calculator | VegaKash" description="Estimate your 401k retirement savings growth. Free, fast, accurate 401k calculator for the USA." />

      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1>US 401(k) Retirement Calculator</h1>
          <p>Estimate your 401k retirement savings growth with annual contributions and returns</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              {/* Current Balance */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Current 401(k) Balance</label>
                  <input
                    type="text"
                    value={formatCurrency(currentBalance)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setCurrentBalance('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setCurrentBalance(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>$500K</span>
                </div>
              </div>

              {/* Annual Contribution */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Annual Contribution</label>
                  <input
                    type="text"
                    value={formatCurrency(annualContribution)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setAnnualContribution('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setAnnualContribution(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="70000"
                  step="1000"
                  value={annualContribution}
                  onChange={(e) => setAnnualContribution(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>$70K</span>
                </div>
              </div>

              {/* Years to Grow */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Years to Grow</label>
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
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 Yr</span>
                  <span>50 Yrs</span>
                </div>
              </div>

              {/* Annual Return */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Expected Annual Return</label>
                  <input
                    type="text"
                    value={`${annualReturn}%`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      if (val === '') {
                        setAnnualReturn('');
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setAnnualReturn(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1%</span>
                  <span>15%</span>
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
                <h2>Your 401(k) Projection</h2>
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">Estimated Balance at Retirement</div>
                    <div className="result-value">{formatCurrency(result.futureValue)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Total Amount Contributed</div>
                    <div className="result-value">{formatCurrency(result.totalContributed)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Investment Gain</div>
                    <div className="result-value">{formatCurrency(result.gain)}</div>
                  </div>
                </div>

                <div className="breakdown-chart">
                  <h3>Savings Composition</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ width: `${(result.totalContributed / result.futureValue * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Contributed</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ width: `${(result.gain / result.futureValue * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Growth</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color principal"></div>
                      <span>Contributed: {formatCurrency(result.totalContributed)}</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color interest"></div>
                      <span>Growth: {formatCurrency(result.gain)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <section className="seo-content">
          <h2>How to Estimate 401(k) Growth</h2>
          <p>The formula for future value with regular contributions is:</p>
          <code>FV = P×(1+r)<sup>n</sup> + C×(((1+r)<sup>n</sup> - 1)/r)</code>
          <p>Where:</p>
          <ul>
            <li><strong>FV</strong> = Future value of your 401k</li>
            <li><strong>P</strong> = Current 401k balance</li>
            <li><strong>C</strong> = Annual contribution amount</li>
            <li><strong>r</strong> = Annual return rate (as decimal)</li>
            <li><strong>n</strong> = Number of years</li>
          </ul>

          <h2>401(k) Retirement FAQ</h2>
          <ul>
            <li><strong>What is a 401(k)?</strong> A US retirement savings plan with tax advantages, often with employer matching.</li>
            <li><strong>Can I contribute more?</strong> 2024 limits are $23,500 per year ($31,000 if age 50+).</li>
            <li><strong>What are typical return rates?</strong> Historical S&P 500 average is around 10%, but varies by market conditions.</li>
            <li><strong>Should I maximize employer match?</strong> Yes, free money from employer match is essential to take advantage of.</li>
          </ul>

          <h2>Maximizing Your 401(k)</h2>
          <ul>
            <li>Contribute enough to get full employer match</li>
            <li>Increase contributions with annual salary increases</li>
            <li>Review and rebalance your investment allocation periodically</li>
            <li>Consider target-date funds for automatic adjustments as you near retirement</li>
          </ul>
        </section>

        <AEOContentSection tool="retirement401k" country={country} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "US 401(k) Retirement Calculator",
          "description": "Estimate your 401k retirement savings growth.",
          "provider": {"@type": "Organization", "name": "VegaKash.AI"},
          "applicationCategory": "Calculator",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
        })}</script>
      </div>
    </>
  );
}

export default Retirement401kCalculatorUS;
