import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';

/**
 * UK Mortgage Affordability Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Estimates how much mortgage you can afford in the UK with proper SEO
 */
function MortgageAffordabilityCalculatorUK() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'UK Mortgage Affordability', path: null }
  ];
  
  const [income, setIncome] = useState(40000);
  const [monthlyDebt, setMonthlyDebt] = useState(500);
  const [interestRate, setInterestRate] = useState(5.0);
  const [years, setYears] = useState(25);
  const [deposit, setDeposit] = useState(50000);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    calculateAffordability();
  }, [income, monthlyDebt, interestRate, years, deposit]);

  const calculateAffordability = () => {
    const annualIncome = parseFloat(income);
    const monthlyDebtPayments = parseFloat(monthlyDebt);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(years) * 12;
    const depositAmount = parseFloat(deposit);
    
    if (!annualIncome || !r || !n || annualIncome <= 0 || r < 0 || n <= 0) return;
    
    // UK lenders typically allow 4.5x income
    const maxBorrowBase = annualIncome * 4.5;
    
    // Subtract debt burden
    const annualDebtBurden = monthlyDebtPayments * 12;
    const maxBorrow = Math.max(0, maxBorrowBase - annualDebtBurden * 5); // 5 years debt impact
    
    // Calculate monthly payment for maxBorrow
    const monthlyPayment = (maxBorrow * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    // Total property value
    const propertyValue = maxBorrow + depositAmount;
    
    // LTV ratio
    const ltv = maxBorrow > 0 ? (maxBorrow / propertyValue * 100) : 0;
    
    // Stamp duty (simplified UK calculation)
    let stampDuty = 0;
    if (propertyValue > 250000) {
      stampDuty = (propertyValue - 250000) * 0.05;
      if (propertyValue > 925000) {
        stampDuty += (propertyValue - 925000) * 0.05;
      }
      if (propertyValue > 1500000) {
        stampDuty += (propertyValue - 1500000) * 0.02;
      }
    }
    
    // Debt-to-income ratio
    const dti = ((monthlyPayment + monthlyDebtPayments) / (annualIncome / 12) * 100);
    
    setResult({ 
      maxBorrow: Math.round(maxBorrow),
      monthlyPayment: Math.round(monthlyPayment),
      propertyValue: Math.round(propertyValue),
      ltv: ltv.toFixed(1),
      stampDuty: Math.round(stampDuty),
      dti: dti.toFixed(1),
      totalInterest: Math.round((monthlyPayment * n) - maxBorrow)
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleReset = () => {
    setIncome(40000);
    setMonthlyDebt(500);
    setInterestRate(5.0);
    setYears(25);
    setDeposit(50000);
  };

  return (
    <>
      <SEO 
        title="UK Mortgage Affordability Calculator | Free Online Tool | VegaKash"
        description="Calculate how much mortgage you can afford in the UK. Free mortgage affordability calculator with instant results. Estimate monthly payments, LTV, and stamp duty."
        keywords="uk mortgage calculator, mortgage affordability uk, how much can i borrow uk, mortgage calculator uk, house affordability uk"
        canonical="/uk/calculators/mortgage"
      />
      
      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="calculator-header">
          <h1>🏡 UK Mortgage Affordability Calculator</h1>
          <p>Find out how much you can borrow for your UK mortgage based on income, debts, and deposit</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              <div className="slider-group">
                <div className="slider-header">
                  <label>Annual Income</label>
                  <input
                    type="text"
                    value={formatCurrency(income)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setIncome('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setIncome(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setIncome(40000);
                      } else if (num < 15000) {
                        setIncome(15000);
                      } else if (num > 500000) {
                        setIncome(500000);
                      } else {
                        setIncome(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="15000"
                  max="500000"
                  step="5000"
                  value={income}
                  onChange={(e) => setIncome(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>£15k</span>
                  <span>£500k</span>
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Deposit Amount</label>
                  <input
                    type="text"
                    value={formatCurrency(deposit)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setDeposit('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setDeposit(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setDeposit(50000);
                      } else if (num < 0) {
                        setDeposit(0);
                      } else if (num > 500000) {
                        setDeposit(500000);
                      } else {
                        setDeposit(num);
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
                  value={deposit}
                  onChange={(e) => setDeposit(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>£0</span>
                  <span>£500k</span>
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Monthly Debts</label>
                  <input
                    type="text"
                    value={formatCurrency(monthlyDebt)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setMonthlyDebt('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setMonthlyDebt(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setMonthlyDebt(500);
                      } else if (num < 0) {
                        setMonthlyDebt(0);
                      } else if (num > 10000) {
                        setMonthlyDebt(10000);
                      } else {
                        setMonthlyDebt(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={monthlyDebt}
                  onChange={(e) => setMonthlyDebt(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>£0</span>
                  <span>£10k</span>
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
                        setInterestRate(5.0);
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

              <div className="slider-group">
                <div className="slider-header">
                  <label>Mortgage Term</label>
                  <input
                    type="text"
                    value={`${years} Years`}
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
                        setYears(25);
                      } else if (num < 5) {
                        setYears(5);
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
                  min="5"
                  max="40"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>5 Yrs</span>
                  <span>40 Yrs</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleReset} className="btn-reset">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset to Default
                </button>
              </div>
            </div>

            {result && (
              <div className="calculator-results">
                <h2>Your Mortgage Affordability</h2>
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">Maximum Borrowing</div>
                    <div className="result-value">{formatCurrency(result.maxBorrow)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Monthly Payment</div>
                    <div className="result-value">{formatCurrency(result.monthlyPayment)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Property Value</div>
                    <div className="result-value">{formatCurrency(result.propertyValue)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Loan-to-Value (LTV)</div>
                    <div className="result-value">{result.ltv}%</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Stamp Duty (Est.)</div>
                    <div className="result-value">{formatCurrency(result.stampDuty)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Debt-to-Income</div>
                    <div className="result-value">{result.dti}%</div>
                  </div>
                </div>

                <div className="breakdown-chart">
                  <h3>Mortgage Breakdown</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ width: `${(result.maxBorrow / (result.maxBorrow + result.totalInterest) * 100).toFixed(1)}%` }}
                    >
                      <span>Principal</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ width: `${(result.totalInterest / (result.maxBorrow + result.totalInterest) * 100).toFixed(1)}%` }}
                    >
                      <span>Interest</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color principal"></span>
                      <span>Principal: {formatCurrency(result.maxBorrow)}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color interest"></span>
                      <span>Interest: {formatCurrency(result.totalInterest)}</span>
                    </div>
                  </div>
                </div>

                {result.dti > 43 && (
                  <div className="alert alert-warning">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <strong>High Debt-to-Income Ratio</strong>
                      <p>Your DTI is {result.dti}%. UK lenders typically prefer DTI below 43%. Consider increasing income or reducing debts.</p>
                    </div>
                  </div>
                )}

                {result.ltv > 90 && (
                  <div className="alert alert-info">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 11V15M10 7H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <strong>High LTV Ratio</strong>
                      <p>Your LTV is {result.ltv}%. Higher LTV mortgages typically have higher interest rates. Consider a larger deposit if possible.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="seo-content-section">
          <div className="content-block">
            <h2>How to Calculate Mortgage Affordability in the UK</h2>
            <p>
              UK mortgage affordability is primarily based on your annual income multiplied by a factor (typically 4.5x for most lenders). 
              However, lenders also consider your existing debts, credit score, deposit size, and monthly commitments.
            </p>
            <div className="formula-box">
              <strong>Maximum Borrowing = (Annual Income × 4.5) - Debt Burden</strong>
            </div>
            <p>
              For example, if you earn £40,000 per year with £500 monthly debt payments, most UK lenders would allow you to borrow 
              around £180,000, assuming good credit and a reasonable deposit.
            </p>
          </div>

          <div className="content-block">
            <h2>Understanding UK Mortgage Lending Criteria</h2>
            
            <h3>1. Income Multiples</h3>
            <p>
              Most UK lenders use income multiples between 4x and 4.5x your annual gross income. Some specialist lenders may 
              offer up to 5.5x for high earners or professionals. Joint applications combine both incomes.
            </p>

            <h3>2. Loan-to-Value (LTV) Ratio</h3>
            <p>
              LTV represents how much you're borrowing relative to the property value. Lower LTV ratios (higher deposits) 
              typically qualify for better interest rates:
            </p>
            <ul>
              <li><strong>60% LTV:</strong> Best rates available</li>
              <li><strong>75% LTV:</strong> Good rates</li>
              <li><strong>85% LTV:</strong> Standard rates</li>
              <li><strong>90-95% LTV:</strong> Higher rates, may require Help to Buy</li>
            </ul>

            <h3>3. Debt-to-Income (DTI) Ratio</h3>
            <p>
              UK lenders assess your monthly debt obligations against your income. Ideally, total monthly debt payments 
              (including the new mortgage) should not exceed 43% of your gross monthly income.
            </p>

            <h3>4. Credit Score Requirements</h3>
            <p>
              A good UK credit score (700+) improves your chances of approval and better rates. Lenders check your credit 
              history for missed payments, CCJs, or defaults in the last 6 years.
            </p>
          </div>

          <div className="content-block">
            <h2>UK Stamp Duty Explained</h2>
            <p>
              Stamp Duty Land Tax (SDLT) is payable on UK property purchases. Current rates for residential properties:
            </p>
            <ul>
              <li><strong>Up to £250,000:</strong> 0% (£425,000 for first-time buyers)</li>
              <li><strong>£250,001 - £925,000:</strong> 5%</li>
              <li><strong>£925,001 - £1,500,000:</strong> 10%</li>
              <li><strong>Over £1,500,000:</strong> 12%</li>
            </ul>
            <p>
              Additional 3% surcharge applies to second homes and buy-to-let properties.
            </p>
          </div>

          <div className="content-block">
            <h2>Tips to Improve Your Mortgage Affordability</h2>
            <ul>
              <li><strong>Increase Your Deposit:</strong> Aim for at least 15-20% to access better rates</li>
              <li><strong>Reduce Existing Debts:</strong> Pay off credit cards and loans before applying</li>
              <li><strong>Improve Credit Score:</strong> Check and correct errors on your credit report</li>
              <li><strong>Consider Joint Applications:</strong> Combine incomes with a partner or family member</li>
              <li><strong>Include All Income:</strong> Bonuses, commissions, and rental income may count</li>
              <li><strong>Choose Longer Terms:</strong> Extend to 30-35 years to reduce monthly payments</li>
              <li><strong>Avoid New Credit:</strong> Don't apply for new credit cards before mortgage application</li>
              <li><strong>Register to Vote:</strong> Being on electoral roll improves credit score</li>
            </ul>
          </div>

          <div className="content-block faq-section">
            <h2>UK Mortgage Affordability FAQ</h2>
            
            <div className="faq-item">
              <h3>How much can I borrow for a UK mortgage?</h3>
              <p>
                Most UK lenders allow you to borrow 4-4.5 times your annual gross income. For example, with a £40,000 salary, 
                you could borrow £160,000-£180,000. This varies based on deposit, debts, credit score, and individual lender criteria.
              </p>
            </div>

            <div className="faq-item">
              <h3>What deposit do I need for a UK mortgage?</h3>
              <p>
                Minimum deposit is typically 5-10% of the property value. However, a 15-20% deposit gives you access to better 
                interest rates and more lender options. First-time buyers may qualify for government schemes with lower deposits.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do UK lenders consider overtime and bonuses?</h3>
              <p>
                Yes, most lenders consider regular overtime, bonuses, and commission. They typically average your last 2-3 years' 
                figures. Self-employed income usually requires 2-3 years of accounts or SA302 tax forms.
              </p>
            </div>

            <div className="faq-item">
              <h3>What is a mortgage affordability assessment?</h3>
              <p>
                Since 2014, UK lenders must conduct thorough affordability assessments, checking your income, outgoings, debts, 
                and lifestyle costs. They stress-test whether you could afford payments if rates rose by 2-3%. This replaced the 
                old self-certification system.
            </p>
            </div>

            <div className="faq-item">
              <h3>Can I get a mortgage with bad credit in the UK?</h3>
              <p>
                Yes, but options are limited and rates higher. Specialist bad credit mortgage brokers can help. You'll typically 
                need a larger deposit (20-25%) and face higher interest rates. Minor credit issues from 3+ years ago have less impact.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do Help to Buy schemes affect affordability?</h3>
              <p>
                Help to Buy equity loans and ISAs can boost affordability by reducing the mortgage needed. The government lends 
                20% (40% in London) interest-free for 5 years, meaning you only need a 5% deposit and 75% mortgage. However, 
                the scheme ended in March 2023 for new builds only.
              </p>
            </div>
          </div>

          <div className="related-calculators">
            <h2>Related UK Financial Calculators</h2>
            <p>Explore our other UK-specific calculators</p>
            <div className="calculator-grid">
              <Link to="/uk/calculators/vat" className="calc-card">
                <h3>🧾 UK VAT Calculator</h3>
                <p>Calculate VAT at 20%, 5%, or 0% rates</p>
              </Link>
              <Link to="/emi-calculator" className="calc-card">
                <h3>💷 Loan EMI Calculator</h3>
                <p>Calculate monthly loan repayments</p>
              </Link>
              <Link to="/sip-calculator" className="calc-card">
                <h3>📈 Investment Calculator</h3>
                <p>Plan your investment returns</p>
              </Link>
              <Link to="/calculators" className="calc-card">
                <h3>🧮 All Calculators</h3>
                <p>View complete calculator collection</p>
              </Link>
            </div>
          </div>
        </div>

        <AEOContentSection tool="mortgageaffordability" country={country} />
      </div>

      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "UK Mortgage Affordability Calculator",
        "description": "Calculate how much mortgage you can afford in the UK based on income, debts, deposit, and interest rate.",
        "provider": {"@type": "Organization", "name": "VegaKash.AI"},
        "applicationCategory": "FinanceApplication",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"},
        "featureList": [
          "Maximum borrowing calculation",
          "Monthly payment estimation",
          "LTV ratio calculation",
          "Stamp duty estimation",
          "Debt-to-income analysis"
        ]
      })}</script>
    </>
  );
}

export default MortgageAffordabilityCalculatorUK;
