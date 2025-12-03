import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { formatSmartCurrency, getCurrencySymbol } from '../../../utils/helpers';
import CurrencySelector from '../../../components/CurrencySelector';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
// MIGRATED: Now using modular structure from modules/calculators/emi/

/**
 * EMI Calculator Component - Production Grade
 * Calculates Equated Monthly Installment for loans
 * Migrated to modular architecture for better maintainability
 */
function EMICalculator() {
  const [currency, setCurrency] = useState('INR');
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [result, setResult] = useState(null);
  const [amortizationView, setAmortizationView] = useState('yearly'); // 'yearly' or 'monthly'
  const [showAmortization, setShowAmortization] = useState(false);

  // Auto-calculate on mount and whenever values change
  React.useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const n = parseFloat(tenure) * 12; // Tenure in months

    if (!P || !r || !n || P <= 0 || r < 0 || n <= 0) {
      return;
    }

    // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    setResult({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      principal: P.toFixed(2)
    });
  };

  const handleReset = () => {
    setLoanAmount(1000000);
    setInterestRate(8.5);
    setTenure(20);
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(2)} K`;
    }
    return `₹${value}`;
  };

  return (
    <>
      <SEO 
        title="EMI Calculator | VegaKash.AI"
        description="Calculate your loan EMI across currencies, view amortization schedule, and plan repayments with our EMI calculator."
        keywords="emi calculator, loan emi, amortization schedule, loan calculator, monthly installment"
        canonical="/emi-calculator"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "EMI Calculator",
              "description": "Calculate your loan EMI across currencies, view amortization schedule, and plan repayments",
              "url": "https://vegaktools.com/emi-calculator"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://vegaktools.com/calculators" },
                { "@type": "ListItem", "position": 3, "name": "EMI Calculator", "item": "https://vegaktools.com/emi-calculator" }
              ]
            }
          ]
        }}
      />
      <div className="calculator-container">
      <div className="calculator-header">
        <h1>EMI Calculator</h1>
        <p>Calculate your Equated Monthly Installment for home loans, car loans, personal loans</p>
      </div>

      <div className="calculator-content">
        {/* Currency Selector */}
        <CurrencySelector 
          selectedCurrency={currency}
          onCurrencyChange={setCurrency}
        />

        <div className="calculator-main-grid">
          <div className="calculator-inputs">
          <div className="slider-group">
            <div className="slider-header">
              <label>Loan Amount</label>
              <input
                type="text"
                value={formatSmartCurrency(loanAmount, currency)}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val === '') {
                    setLoanAmount('');
                    return;
                  }
                  const num = parseInt(val);
                  if (!isNaN(num)) {
                    setLoanAmount(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  const num = parseInt(val);
                  
                  if (val === '' || isNaN(num)) {
                    setLoanAmount(1000000);
                  } else if (num < 100000) {
                    setLoanAmount(100000);
                  } else if (num > 50000000) {
                    setLoanAmount(50000000);
                  } else {
                    setLoanAmount(num);
                  }
                }}
                className="input-display"
              />
            </div>
            <input
              type="range"
              min="100000"
              max="50000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>₹1L</span>
              <span>₹5Cr</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label>Interest Rate (p.a.)</label>
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
                    setInterestRate(8.5);
                  } else if (num < 5) {
                    setInterestRate(5);
                  } else if (num > 20) {
                    setInterestRate(20);
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
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <label>Loan Tenure</label>
              <input
                type="text"
                value={`${tenure} Yr`}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val === '') {
                    setTenure('');
                    return;
                  }
                  const num = parseInt(val);
                  if (!isNaN(num)) {
                    setTenure(num);
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  const num = parseInt(val);
                  
                  if (val === '' || isNaN(num)) {
                    setTenure(20);
                  } else if (num < 1) {
                    setTenure(1);
                  } else if (num > 30) {
                    setTenure(30);
                  } else {
                    setTenure(num);
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
              value={tenure}
              onChange={(e) => setTenure(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>1 Yr</span>
              <span>30 Yrs</span>
            </div>
          </div>

          {/* Reset Button Inside Input Box */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button onClick={handleReset} className="btn-reset">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reset to Default
            </button>
          </div>
        </div>

        {result && (
          <div className="calculator-results">
            <h2>Your Loan Breakdown</h2>
            <div className="result-cards">
              <div className="result-card highlight">
                <div className="result-label">EMI</div>
                <div className="result-value">{formatSmartCurrency(result.emi, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Principal Amount</div>
                <div className="result-value">{formatSmartCurrency(result.principal, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value">{formatSmartCurrency(result.totalInterest, currency)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Amount</div>
                <div className="result-value">{formatSmartCurrency(result.totalAmount, currency)}</div>
              </div>
            </div>

            <div className="breakdown-chart">
              <h3>Payment Breakdown</h3>
              <div className="chart-bar">
                  <div 
                    className="chart-segment principal"
                    style={{ width: `${(result.principal / result.totalAmount * 100).toFixed(1)}%` }}
                  >
                  <span>Principal</span>
                  </div>
                  <div 
                    className="chart-segment interest"
                    style={{ width: `${(result.totalInterest / result.totalAmount * 100).toFixed(1)}%` }}
                  >
                  <span>Interest</span>
                  </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Principal: {formatSmartCurrency(result.principal, currency)}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Interest: {formatSmartCurrency(result.totalInterest, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {result && (
          <div className="amortization-section">
            <div className="amortization-header" onClick={() => setShowAmortization(!showAmortization)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '12px', marginBottom: showAmortization ? '1.5rem' : '0' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Loan Amortization Schedule</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: showAmortization ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {showAmortization && (
              <>
                <div className="amortization-tabs">
                  <button 
                    className={`tab-btn ${amortizationView === 'yearly' ? 'active' : ''}`}
                    onClick={() => setAmortizationView('yearly')}
                  >
                    Yearly
                  </button>
                  <button 
                    className={`tab-btn ${amortizationView === 'monthly' ? 'active' : ''}`}
                    onClick={() => setAmortizationView('monthly')}
                  >
                    Monthly
                  </button>
                </div>
                <div className="amortization-table">
                  <table>
                <thead>
                  <tr>
                    <th>{amortizationView === 'yearly' ? 'Year' : 'Month'}</th>
                    {amortizationView === 'monthly' && <th>EMI</th>}
                    <th>Principal Paid</th>
                    <th>Interest Paid</th>
                    <th>Outstanding Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const P = parseFloat(loanAmount);
                    const r = parseFloat(interestRate) / 12 / 100;
                    const totalMonths = parseFloat(tenure) * 12;
                    const emi = parseFloat(result.emi);
                    let balance = P;
                    const rows = [];
                    
                    if (amortizationView === 'yearly') {
                      // Yearly view
                      for (let year = 1; year <= tenure; year++) {
                        let yearlyPrincipal = 0;
                        let yearlyInterest = 0;
                        const startBalance = balance;
                        
                        const monthsInYear = year === tenure ? (totalMonths % 12 || 12) : 12;
                        
                        for (let month = 1; month <= monthsInYear; month++) {
                          if (balance <= 0) break;
                          
                          const interestPayment = balance * r;
                          const principalPayment = Math.min(emi - interestPayment, balance);
                          
                          yearlyPrincipal += principalPayment;
                          yearlyInterest += interestPayment;
                          balance = Math.max(0, balance - principalPayment);
                        }
                        
                        rows.push(
                          <tr key={year}>
                            <td>{year}</td>
                            <td>{formatSmartCurrency(Math.round(yearlyPrincipal), currency)}</td>
                            <td>{formatSmartCurrency(Math.round(yearlyInterest), currency)}</td>
                            <td>{formatSmartCurrency(Math.round(balance), currency)}</td>
                          </tr>
                        );
                      }
                    } else {
                      // Monthly view - show all months
                      for (let month = 1; month <= totalMonths; month++) {
                        if (balance <= 0) break;
                        
                        const interestPayment = balance * r;
                        const principalPayment = Math.min(emi - interestPayment, balance);
                        
                        balance = Math.max(0, balance - principalPayment);
                        
                        rows.push(
                          <tr key={month}>
                            <td>{month}</td>
                            <td>{formatSmartCurrency(Math.round(emi), currency)}</td>
                            <td>{formatSmartCurrency(Math.round(principalPayment), currency)}</td>
                            <td>{formatSmartCurrency(Math.round(interestPayment), currency)}</td>
                            <td>{formatSmartCurrency(Math.round(balance), currency)}</td>
                          </tr>
                        );
                      }
                    }
                    
                    return rows;
                  })()}
                </tbody>
                </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* SEO Content Section */}
      <div className="seo-content-section">
        <div className="content-block">
          <h2>What is EMI?</h2>
          <p>
            EMI or Equated Monthly Installment is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. 
            EMIs are used to pay off both interest and principal each month, ensuring that the loan is paid off in full over a specified number of years. 
            The most common types of loans that use EMIs include home loans, car loans, and personal loans.
          </p>
          <p>
            An EMI consists of two components: the principal component and the interest component. In the initial years, the interest component forms 
            a larger part of the EMI, but as the loan tenure progresses, the principal component increases while the interest component decreases. 
            This is because interest is calculated on the outstanding principal amount.
          </p>
        </div>

        <div className="content-block">
          <h2>How EMI is Calculated - Formula & Explanation</h2>
          <p>
            The EMI calculation is based on three key factors: the loan amount (principal), the interest rate, and the loan tenure. 
            The formula used to calculate EMI is:
          </p>
          <div className="formula-box">
            <strong>EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]</strong>
          </div>
          <p>Where:</p>
          <ul>
            <li><strong>P</strong> = Principal loan amount (the amount you borrow)</li>
            <li><strong>r</strong> = Monthly interest rate (Annual interest rate divided by 12 months and 100)</li>
            <li><strong>n</strong> = Total number of monthly installments (Loan tenure in years × 12)</li>
          </ul>
          <p>
            <strong>Example Calculation:</strong> If you take a home loan of ₹25,00,000 at an annual interest rate of 8.5% for 20 years:
          </p>
          <ul>
            <li>P = ₹25,00,000</li>
            <li>r = 8.5% / 12 / 100 = 0.00708</li>
            <li>n = 20 × 12 = 240 months</li>
            <li>EMI = ₹21,686 approximately</li>
          </ul>
        </div>

        <div className="content-block">
          <h2>Factors Affecting Your EMI</h2>
          <p>Understanding these factors will help you make informed decisions about your loan:</p>
          
          <h3>1. Loan Amount (Principal)</h3>
          <p>
            The higher the loan amount, the higher your EMI will be. It's always advisable to make a larger down payment to reduce 
            the principal amount and consequently lower your monthly EMI burden.
          </p>

          <h3>2. Interest Rate</h3>
          <p>
            Even a small difference in interest rates can significantly impact your total interest outgo. For instance, a 0.5% difference 
            in interest rate on a ₹25 lakh loan for 20 years can save you over ₹1.5 lakhs. Always compare rates from multiple lenders.
          </p>

          <h3>3. Loan Tenure</h3>
          <p>
            Longer tenure means lower EMI but higher total interest paid. Shorter tenure means higher EMI but lower total interest. 
            Choose a tenure that balances affordability with optimal interest costs.
          </p>

          <h3>4. Type of Interest Rate</h3>
          <p>
            Fixed rate loans have constant EMIs throughout the tenure, while floating rate loans have EMIs that vary with market conditions. 
            Currently, most home loans in India are on floating rates linked to external benchmarks like repo rate.
          </p>
        </div>

        <div className="content-block">
          <h2>Advantages of Using an EMI Calculator</h2>
          <ul>
            <li><strong>Financial Planning:</strong> Know your exact monthly outflow and plan your budget accordingly</li>
            <li><strong>Loan Comparison:</strong> Compare different loan offers from various banks and NBFCs instantly</li>
            <li><strong>Tenure Optimization:</strong> Find the right balance between EMI amount and total interest paid</li>
            <li><strong>Pre-approval Readiness:</strong> Understand your borrowing capacity before applying</li>
            <li><strong>Interest Transparency:</strong> See the exact breakdown of principal vs interest component</li>
            <li><strong>Save Time:</strong> Get instant results without manual calculations or Excel sheets</li>
            <li><strong>What-if Analysis:</strong> Quickly test different scenarios by adjusting loan parameters</li>
          </ul>
        </div>

        <div className="content-block">
          <h2>Tips to Reduce Your EMI Burden</h2>
          <ul>
            <li><strong>Make Higher Down Payment:</strong> Pay 20-30% upfront to reduce principal and EMI</li>
            <li><strong>Negotiate Interest Rates:</strong> Compare offers from multiple lenders and negotiate for better rates</li>
            <li><strong>Choose Longer Tenure:</strong> If affordability is a concern, opt for longer tenure (but understand you'll pay more interest)</li>
            <li><strong>Make Part Prepayments:</strong> Use bonuses or surplus funds to make part prepayments and reduce tenure or EMI</li>
            <li><strong>Balance Transfer:</strong> If rates have dropped significantly, consider transferring to a lender with lower rates</li>
            <li><strong>Improve Credit Score:</strong> A higher CIBIL score (750+) helps you negotiate better interest rates</li>
          </ul>
        </div>

        {/* Related Internal Links */}
        <section className="related-calculators">
          <h2>Related Financial Tools</h2>
          <p>Explore more calculators and tools to plan smarter</p>
          <div className="calculator-grid">
            <Link to="/sip-calculator" className="calc-card">
              <h3>📈 SIP Calculator</h3>
              <p>Plan monthly investments and estimate future value</p>
            </Link>
            <Link to="/fd-calculator" className="calc-card">
              <h3>🏦 FD Calculator</h3>
              <p>Calculate fixed deposit maturity and interest earned</p>
            </Link>
            <Link to="/rd-calculator" className="calc-card">
              <h3>💵 RD Calculator</h3>
              <p>Estimate returns from recurring monthly deposits</p>
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

export default EMICalculator;

