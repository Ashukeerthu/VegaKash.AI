import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { formatSmartCurrency, getCurrencySymbol } from '../../../utils/helpers';
import CurrencySelector from '../../../components/CurrencySelector';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
// MIGRATED: Modular structure from modules/calculators/sip/

/**
 * SIP + Lumpsum Calculator Component
 * Calculates Systematic Investment Plan and Lumpsum returns
 */
function SIPCalculator() {
  const [currency, setCurrency] = useState('INR');
  const [investmentMode, setInvestmentMode] = useState('sip'); // 'sip' or 'lumpsum'
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [duration, setDuration] = useState(10);
  const [result, setResult] = useState(null);

  // Auto-calculate on mount and whenever values change
  React.useEffect(() => {
    if (investmentMode === 'sip') {
      calculateSIP();
    } else {
      calculateLumpsum();
    }
  }, [investmentMode, monthlyInvestment, initialInvestment, lumpsumAmount, expectedReturn, duration]);

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment);
    const initial = parseFloat(initialInvestment) || 0;
    const r = parseFloat(expectedReturn) / 12 / 100; // Monthly return rate
    const annualRate = parseFloat(expectedReturn) / 100;
    const n = parseFloat(duration) * 12; // Total months
    const years = parseFloat(duration);

    if (!P || P <= 0 || r < 0 || n <= 0) {
      return;
    }

    // SIP Future Value Formula: P × ((1 + r)^n - 1) / r × (1 + r)
    const sipFutureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    
    // Initial investment grows with compound interest: Initial × (1 + annual_r)^years
    const initialFutureValue = initial > 0 ? initial * Math.pow(1 + annualRate, years) : 0;
    
    const futureValue = sipFutureValue + initialFutureValue;
    const totalInvested = (P * n) + initial;
    const totalReturns = futureValue - totalInvested;

    setResult({
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
      mode: 'sip'
    });
  };

  const calculateLumpsum = () => {
    const P = parseFloat(lumpsumAmount);
    const r = parseFloat(expectedReturn) / 100; // Annual return rate
    const t = parseFloat(duration); // Duration in years

    if (!P || !r || !t || P <= 0 || r < 0 || t <= 0) {
      return;
    }

    // Lumpsum Future Value Formula: FV = P × (1 + r)^t
    const futureValue = P * Math.pow(1 + r, t);
    const totalReturns = futureValue - P;

    setResult({
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(P),
      totalReturns: Math.round(totalReturns),
      mode: 'lumpsum'
    });
  };

  const handleReset = () => {
    if (investmentMode === 'sip') {
      setMonthlyInvestment(5000);
      setInitialInvestment(0);
    } else {
      setLumpsumAmount(100000);
    }
    setExpectedReturn(12);
    setDuration(10);
  };

  return (
    <>
      <SEO 
        title="SIP Calculator | VegaKash.AI"
        description="Calculate SIP and lumpsum returns with charts and projections. Compare investment strategies and forecast wealth."
        keywords="sip calculator, investment calculator, lumpsum calculator, mutual fund returns, wealth projection"
        canonical="/sip-calculator"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "SIP Calculator",
              "description": "Calculate SIP and lumpsum returns with charts and projections",
              "url": "https://vegaktools.com/sip-calculator"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://vegaktools.com/calculators" },
                { "@type": "ListItem", "position": 3, "name": "SIP Calculator", "item": "https://vegaktools.com/sip-calculator" }
              ]
            }
          ]
        }}
      />
      <div className="calculator-container">
      <div className="calculator-header">
        <h1>SIP Calculator</h1>
        <p>Calculate returns from Systematic Investment Plan and one-time investments in mutual funds</p>
      </div>

      <div className="calculator-content">
        {/* Currency Selector */}
        <CurrencySelector 
          selectedCurrency={currency}
          onCurrencyChange={setCurrency}
        />

        <div className="calculator-main-grid">
          <div className="calculator-inputs">
            {/* Investment Mode Tabs */}
            <div className="amortization-tabs" style={{ marginBottom: '2rem' }}>
            <button 
              className={`tab-btn ${investmentMode === 'sip' ? 'active' : ''}`}
              onClick={() => setInvestmentMode('sip')}
            >
              SIP
            </button>
            <button 
              className={`tab-btn ${investmentMode === 'lumpsum' ? 'active' : ''}`}
              onClick={() => setInvestmentMode('lumpsum')}
            >
              Lumpsum
            </button>
          </div>

          {/* SIP Mode Inputs */}
          {investmentMode === 'sip' && (
            <div className="slider-group">
              <div className="slider-header">
                <label>Monthly investment</label>
                <input
                  type="text"
                  value={formatSmartCurrency(monthlyInvestment, currency)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val === '') {
                      setMonthlyInvestment('');
                      return;
                    }
                    const num = parseInt(val);
                    if (!isNaN(num)) {
                      setMonthlyInvestment(num);
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const num = parseInt(val);
                    
                    if (val === '' || isNaN(num)) {
                      setMonthlyInvestment(5000);
                    } else if (num < 500) {
                      setMonthlyInvestment(500);
                    } else if (num > 1000000) {
                      setMonthlyInvestment(1000000);
                    } else {
                      setMonthlyInvestment(num);
                    }
                  }}
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="500"
                max="1000000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>₹500</span>
                <span>₹10L</span>
              </div>
            </div>
          )}

          {/* Initial Investment for SIP Mode */}
          {investmentMode === 'sip' && (
            <div className="slider-group">
              <div className="slider-header">
                <label>Initial investment (optional)</label>
                <input
                  type="text"
                  value={formatSmartCurrency(initialInvestment, currency)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val === '') {
                      setInitialInvestment(0);
                      return;
                    }
                    const num = parseInt(val);
                    if (!isNaN(num)) {
                      setInitialInvestment(num);
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const num = parseInt(val);
                    
                    if (val === '' || isNaN(num)) {
                      setInitialInvestment(0);
                    } else if (num < 0) {
                      setInitialInvestment(0);
                    } else if (num > 10000000) {
                      setInitialInvestment(10000000);
                    } else {
                      setInitialInvestment(num);
                    }
                  }}
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000000"
                step="10000"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>₹0</span>
                <span>₹1Cr</span>
              </div>
            </div>
          )}

          {/* Lumpsum Mode Inputs */}
          {investmentMode === 'lumpsum' && (
            <div className="slider-group">
              <div className="slider-header">
                <label>Total investment</label>
                <input
                  type="text"
                  value={formatSmartCurrency(lumpsumAmount, currency)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val === '') {
                      setLumpsumAmount('');
                      return;
                    }
                    const num = parseInt(val);
                    if (!isNaN(num)) {
                      setLumpsumAmount(num);
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const num = parseInt(val);
                    
                    if (val === '' || isNaN(num)) {
                      setLumpsumAmount(100000);
                    } else if (num < 10000) {
                      setLumpsumAmount(10000);
                    } else if (num > 10000000) {
                      setLumpsumAmount(10000000);
                    } else {
                      setLumpsumAmount(num);
                    }
                  }}
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={lumpsumAmount}
                onChange={(e) => setLumpsumAmount(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>₹10K</span>
                <span>₹1Cr</span>
              </div>
            </div>
          )}

          {/* Common Inputs for Both Modes */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Expected return rate (p.a.)</label>
              <input
                type="text"
                value={`${expectedReturn}%`}
                onChange={(e) => {
                  const val = e.target.value.replace(/[%\s]/g, '');
                  if (val === '') {
                    setExpectedReturn('');
                    return;
                  }
                  const num = parseFloat(val);
                  if (!isNaN(num)) {
                    setExpectedReturn(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[%\s]/g, '');
                  const num = parseFloat(val);
                  
                  if (val === '' || isNaN(num)) {
                    setExpectedReturn(12);
                  } else if (num < 1) {
                    setExpectedReturn(1);
                  } else if (num > 30) {
                    setExpectedReturn(30);
                  } else {
                    setExpectedReturn(num);
                  }
                }}
                className="input-display"
              />
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label>Time period</label>
              <input
                type="text"
                value={`${duration}Yr`}
                onChange={(e) => {
                  const val = e.target.value.replace(/[Yr\s]/g, '');
                  if (val === '') {
                    setDuration('');
                    return;
                  }
                  const num = parseInt(val);
                  if (!isNaN(num)) {
                    setDuration(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[Yr\s]/g, '');
                  const num = parseInt(val);
                  
                  if (val === '' || isNaN(num)) {
                    setDuration(10);
                  } else if (num < 1) {
                    setDuration(1);
                  } else if (num > 40) {
                    setDuration(40);
                  } else {
                    setDuration(num);
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
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>1 Yr</span>
              <span>40 Yrs</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="calculator-results">
              <h2>{investmentMode === 'sip' ? 'Your SIP Breakdown' : 'Your Investment Breakdown'}</h2>
            <div className="result-cards">
              <div className="result-card highlight">
                <div className="result-label">Future Value</div>
                <div className={`result-value ${String(result.futureValue).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.futureValue, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">{investmentMode === 'sip' ? 'Total Invested' : 'Invested Amount'}</div>
                <div className={`result-value ${String(result.totalInvested).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.totalInvested, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">{investmentMode === 'sip' ? 'Wealth Gained' : 'Est. Returns'}</div>
                <div className={`result-value ${String(result.totalReturns).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.totalReturns, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Return On Investment</div>
                <div className="result-value">{((result.totalReturns / result.totalInvested) * 100).toFixed(1)}%</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Duration</div>
                <div className="result-value">{duration * 12} Months</div>
              </div>

              {investmentMode === 'sip' && monthlyInvestment > 0 && (
                <div className="result-card">
                  <div className="result-label">Monthly SIP Amount</div>
                  <div className={`result-value ${String(monthlyInvestment).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(monthlyInvestment, currency)}</div>
                </div>
              )}

              {investmentMode === 'sip' && initialInvestment > 0 && (
                <div className="result-card">
                  <div className="result-label">Initial Investment</div>
                  <div className={`result-value ${String(initialInvestment).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(initialInvestment, currency)}</div>
                </div>
              )}
            </div>

            <div className="breakdown-chart">
              <h3>Investment Breakdown</h3>
              <div className="chart-bar">
                <div 
                  className="chart-segment principal"
                  style={{ width: `${(result.totalInvested / result.futureValue * 100).toFixed(1)}%` }}
                >
                  <span>Invested</span>
                </div>
                <div 
                  className="chart-segment interest"
                  style={{ width: `${(result.totalReturns / result.futureValue * 100).toFixed(1)}%` }}
                >
                  <span>Returns</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Invested: {formatSmartCurrency(result.totalInvested, currency)}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Returns: {formatSmartCurrency(result.totalReturns, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="calculator-external-actions">
        <button onClick={handleReset} className="btn-reset">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset to Default
        </button>
      </div>

      {/* SEO Content Section */}
      <div className="seo-content-section">
        <div className="content-block">
          <h2>What is SIP?</h2>
          <p>
            SIP or Systematic Investment Plan is a method of investing in mutual funds where you invest a fixed amount at regular intervals (usually monthly). 
            Instead of investing a lump sum amount, SIP allows you to invest small amounts consistently over time, making wealth creation accessible to everyone. 
            It's like a recurring deposit in mutual funds, but with potentially higher returns as your money is invested in market-linked instruments.
          </p>
          <p>
            SIP works on the principle of rupee cost averaging and the power of compounding. When you invest regularly irrespective of market conditions, 
            you buy more units when markets are down and fewer units when markets are up, averaging out your purchase cost. Over time, this disciplined 
            approach, combined with compounding returns, can help you build substantial wealth for various life goals like retirement, children's education, or buying a home.
          </p>
        </div>

        <div className="content-block">
          <h2>What is Lumpsum Investment?</h2>
          <p>
            Lumpsum investment means investing a large amount of money in one go, instead of spreading it across multiple installments. This investment strategy 
            is ideal when you have received a significant amount like a bonus, inheritance, or maturity proceeds from another investment. Lumpsum investments 
            can potentially generate higher returns if invested when markets are at favorable levels, as your entire corpus is exposed to market growth from day one.
          </p>
          <p>
            However, lumpsum investing requires careful market timing and involves higher risk compared to SIP, as your entire capital is deployed at once. 
            Many investors prefer combining both SIP and lumpsum strategies - using SIP for regular income and lumpsum for surplus funds during market corrections.
          </p>
        </div>

        <div className="content-block">
          <h2>How SIP & Lumpsum Work - Formula & Explanation</h2>
          
          <h3>SIP Formula</h3>
          <div className="formula-box">
            <strong>FV = P × [((1 + r)^n - 1) / r] × (1 + r)</strong>
          </div>
          <p>Where:</p>
          <ul>
            <li><strong>FV</strong> = Future Value of investment</li>
            <li><strong>P</strong> = Monthly SIP amount</li>
            <li><strong>r</strong> = Expected monthly return rate (Annual return / 12 / 100)</li>
            <li><strong>n</strong> = Total number of SIP installments (Years × 12)</li>
          </ul>
          
          <h3>Lumpsum Formula</h3>
          <div className="formula-box">
            <strong>FV = P × (1 + r)^t</strong>
          </div>
          <p>Where:</p>
          <ul>
            <li><strong>FV</strong> = Future Value of investment</li>
            <li><strong>P</strong> = Principal (one-time investment amount)</li>
            <li><strong>r</strong> = Expected annual return rate (Annual return / 100)</li>
            <li><strong>t</strong> = Investment duration in years</li>
          </ul>

          <p>
            <strong>Example - SIP:</strong> If you invest ₹10,000 monthly with 12% annual return for 10 years:
          </p>
          <ul>
            <li>Total Invested = ₹12,00,000</li>
            <li>Future Value = ₹23,23,391</li>
            <li>Wealth Gained = ₹11,23,391</li>
          </ul>

          <p>
            <strong>Example - Lumpsum:</strong> If you invest ₹1,00,000 one-time with 12% annual return for 10 years:
          </p>
          <ul>
            <li>Invested Amount = ₹1,00,000</li>
            <li>Future Value = ₹3,10,585</li>
            <li>Returns = ₹2,10,585</li>
          </ul>
        </div>

        <div className="content-block">
          <h2>SIP vs Lumpsum - Which is Better?</h2>
          <p>Both investment methods have their advantages. The choice depends on your financial situation, market conditions, and risk appetite:</p>
          
          <h3>When to Choose SIP</h3>
          <ul>
            <li>You have regular monthly income (salaried individuals)</li>
            <li>You want to avoid market timing risks</li>
            <li>You're new to mutual fund investing</li>
            <li>You want disciplined, automated investing</li>
            <li>Markets are at higher levels or volatile</li>
            <li>You want to benefit from rupee cost averaging</li>
          </ul>

          <h3>When to Choose Lumpsum</h3>
          <ul>
            <li>You have a large corpus available (bonus, inheritance, maturity)</li>
            <li>Markets are at significantly lower levels</li>
            <li>You have high risk tolerance</li>
            <li>You want to maximize returns in bullish markets</li>
            <li>Investment horizon is very long (15+ years)</li>
          </ul>

          <h3>Best Approach: Hybrid Strategy</h3>
          <p>
            Many successful investors use a combination of both. Start a SIP for regular investing and deploy lumpsum amounts when markets correct 
            by 10-15% or more. This approach balances risk, ensures discipline, and allows you to capitalize on market opportunities.
          </p>
        </div>

        <div className="content-block">
          <h2>Advantages of Using This Calculator</h2>
          <ul>
            <li><strong>Compare Both Methods:</strong> Instantly compare SIP vs Lumpsum returns for your investment amount and duration</li>
            <li><strong>Goal Planning:</strong> Calculate exactly how much to invest to reach your financial goals</li>
            <li><strong>Wealth Projection:</strong> Visualize how your investments can grow over time with realistic return assumptions</li>
            <li><strong>Flexible Scenarios:</strong> Test different amounts, return rates, and time periods to find optimal strategy</li>
            <li><strong>Realistic Expectations:</strong> Understand the power of compounding and set achievable targets</li>
            <li><strong>Time Value of Money:</strong> See how starting early makes a massive difference to final corpus</li>
            <li><strong>Financial Planning:</strong> Integrate calculations into your overall financial plan and asset allocation</li>
          </ul>
        </div>

        <div className="content-block">
          <h2>Types of Mutual Fund Investments</h2>
          
          <h3>Equity Funds</h3>
          <p>
            Invest primarily in stocks. Highest growth potential with 12-18% historical returns but higher volatility. Ideal for long-term goals 
            (7+ years) like retirement, children's education. Best suited for aggressive investors with high risk appetite.
          </p>

          <h3>Debt Funds</h3>
          <p>
            Invest in fixed-income securities like bonds, treasury bills. Offer stable returns of 6-9% with lower risk. Suitable for conservative 
            investors and short to medium-term goals (1-5 years). Better than bank FDs in terms of liquidity and tax efficiency.
          </p>

          <h3>Hybrid Funds</h3>
          <p>
            Balanced mix of equity and debt providing growth with stability. Deliver moderate returns (9-12%) with controlled risk. Ideal for 
            moderate risk investors seeking balanced portfolio without active management.
          </p>

          <h3>ELSS (Tax Saver)</h3>
          <p>
            Equity-linked savings schemes offering tax deduction up to ₹1.5 lakh under Section 80C. Come with 3-year lock-in period. Combine 
            wealth creation with tax savings - shortest lock-in among all 80C investment options.
          </p>

          <h3>Index Funds</h3>
          <p>
            Passive funds that replicate market indices like Nifty, Sensex. Offer market returns with lowest expense ratios (0.1-0.5%). 
            Ideal for investors who want to match market performance without active fund selection.
          </p>
        </div>

        <div className="content-block">
          <h2>How to Use This Calculator</h2>
          <ol>
            <li><strong>Choose Investment Mode:</strong> Select SIP or Lumpsum tab based on your investment style</li>
            <li><strong>Enter Investment Amount:</strong> For SIP - monthly amount (₹500 to ₹10L). For Lumpsum - one-time amount (₹10K to ₹1Cr)</li>
            <li><strong>Set Expected Return:</strong> Input realistic annual return (10-12% for equity, 7-8% for debt, 9-10% for hybrid)</li>
            <li><strong>Choose Time Period:</strong> Select investment duration (1-40 years). Longer duration = more compounding benefit</li>
            <li><strong>View Results:</strong> Instantly see future value, total invested, and wealth gained with visual breakdown</li>
            <li><strong>Compare & Plan:</strong> Switch between SIP/Lumpsum to compare which works better for your situation</li>
          </ol>
        </div>

        <div className="content-block">
          <h2>Tips to Maximize Your Investment Returns</h2>
          <ul>
            <li><strong>Start Early:</strong> Even ₹2,000/month started at age 25 beats ₹10,000/month started at 35 due to compounding</li>
            <li><strong>Stay Invested:</strong> Don't stop SIPs during market downturns - that's when you accumulate more units cheaply</li>
            <li><strong>Increase SIP Annually:</strong> Step up your SIP by 10-15% every year as your income grows - dramatically boosts final corpus</li>
            <li><strong>Choose Right Funds:</strong> Match fund type to goal timeline - equity for 7+ years, debt for 1-3 years, hybrid for 3-7 years</li>
            <li><strong>Diversify:</strong> Spread across large-cap, mid-cap, and multi-cap funds - don't put everything in one fund</li>
            <li><strong>Review Annually:</strong> Check fund performance once a year, switch underperformers after giving 3+ year time</li>
            <li><strong>Use Lumpsum Wisely:</strong> Deploy lumpsum amounts during 10-15% market corrections for optimal entry points</li>
            <li><strong>Reinvest Dividends:</strong> Choose growth option over dividend to maximize compounding benefits</li>
          </ul>
        </div>

        <div className="content-block faq-section">
          <h2>Frequently Asked Questions (FAQs)</h2>
          
          <div className="faq-item">
            <h3>What is the minimum amount for starting a SIP?</h3>
            <p>
              Most mutual funds in India allow you to start a SIP with as low as ₹500 per month. However, the ideal amount depends on your 
              financial goals and capacity. Financial advisors recommend investing at least 10-15% of your monthly income in SIPs for long-term 
              wealth creation. Start with what you can afford and gradually increase your SIP amount by 10-15% annually as your income grows.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I stop or pause my SIP anytime?</h3>
            <p>
              Yes, SIPs are completely flexible (except ELSS which has 3-year lock-in). You can pause, stop, or modify your SIP amount anytime 
              without any penalty. However, it's not advisable to stop SIPs during market downturns as that's when you get maximum benefit through 
              rupee cost averaging. If facing financial constraints, you can reduce the SIP amount rather than stopping completely to maintain 
              investment discipline.
            </p>
          </div>

          <div className="faq-item">
            <h3>Which is better - SIP or Lumpsum?</h3>
            <p>
              Both have merits depending on your situation. SIP is better for regular income earners as it promotes discipline, provides rupee cost 
              averaging, and removes market timing stress. Lumpsum works better when you have large corpus and markets are at lower levels. 
              Studies show that in rising markets, lumpsum outperforms, while in volatile/falling markets, SIP performs better. Most experts recommend 
              using SIP for regular investing and lumpsum for deploying surplus funds during market corrections. A hybrid approach of 60% SIP + 40% 
              lumpsum (during corrections) often yields best risk-adjusted returns.
            </p>
          </div>

          <div className="faq-item">
            <h3>What returns can I expect from mutual funds?</h3>
            <p>
              Returns vary based on fund type and market conditions. Historically, equity funds have delivered 12-15% annualized returns over 
              10+ year periods, debt funds give 6-8%, and hybrid funds offer 9-11%. However, past performance doesn't guarantee future returns. 
              It's prudent to use conservative estimates (10-12% for equity, 7-8% for debt) while planning long-term goals. Also, remember that 
              returns are not linear - you may see 25% in one year and -5% in another, but time averages out these fluctuations.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are mutual fund returns guaranteed?</h3>
            <p>
              No, mutual fund returns are not guaranteed as they invest in market-linked instruments. Returns fluctuate based on market performance, 
              economic conditions, and fund management. However, over long investment horizons (10+ years), equity mutual funds have historically 
              provided positive returns and beaten inflation consistently. The risk reduces significantly with longer tenure due to rupee cost 
              averaging (in SIP) and compounding benefits. Only FDs and government bonds offer guaranteed returns, but they typically don't beat 
              inflation after taxes.
            </p>
          </div>

          <div className="faq-item">
            <h3>How is mutual fund taxation calculated?</h3>
            <p>
              For <strong>Equity Funds:</strong> Long-term gains (held &gt;1 year) above ₹1 lakh per year are taxed at 10%; short-term gains at 15%. 
              <strong>Debt Funds</strong> (from April 2023): Both short-term and long-term gains taxed as per your income tax slab, indexation benefit 
              removed. <strong>ELSS SIPs:</strong> Offer tax deduction up to ₹1.5 lakh under Section 80C, but gains are taxable as per equity fund rules. 
              SIP installments have individual holding periods, so each installment's tax treatment is calculated separately based on its purchase date.
            </p>
          </div>
        </div>

        <section className="related-calculators">
          <h2>Related Financial Tools</h2>
          <p>Explore more calculators and tools to plan smarter</p>
          <div className="calculator-grid">
            <Link to="/fd-calculator" className="calc-card">
              <h3>🏦 FD Calculator</h3>
              <p>Calculate fixed deposit maturity and interest</p>
            </Link>
            <Link to="/rd-calculator" className="calc-card">
              <h3>📅 RD Calculator</h3>
              <p>Calculate recurring deposit returns</p>
            </Link>
            <Link to="/emi-calculator" className="calc-card">
              <h3>💰 EMI Calculator</h3>
              <p>Calculate loan EMI and total interest</p>
            </Link>
            <Link to="/car-loan-calculator" className="calc-card">
              <h3>🚗 Auto Loan Calculator</h3>
              <p>Plan car loan EMIs and interest outgo</p>
            </Link>
            <Link to="/" className="calc-card">
              <h3>🤖 AI Budget Planner</h3>
              <p>Create a personalized monthly budget with AI</p>
            </Link>
            <Link to="/calculators" className="calc-card">
              <h3>🧮 Calculator Hub</h3>
              <p>See all calculators in one place</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}

export default SIPCalculator;
