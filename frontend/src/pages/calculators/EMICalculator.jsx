import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { computeEmi, buildAmortization, simulatePrepayment, shockRate } from '../../utils/emiEngine';
import { exportCalculatorPDF } from '../../utils/pdfExport';
import { useParams, Link } from 'react-router-dom';
import { formatSmartCurrency } from '../../utils/helpers';
import { EnhancedSEO } from '../../components/EnhancedSEO';
import Breadcrumb from '../../components/Breadcrumb';
import Tooltip from '../../components/Tooltip';
import '../../styles/Calculator.css';

// Loan type presets configuration
const LOAN_PRESETS = {
  home: { rate: [7, 12], tenure: [10, 30] },
  car: { rate: [7, 12], tenure: [3, 7] },
  personal: { rate: [10, 24], tenure: [1, 5] },
  education: { rate: [7, 12], tenure: [5, 15] }
};

/**
 * EMI Calculator Component - GLOBAL & COUNTRY-SPECIFIC
 * Calculates Equated Monthly Installment for loans with proper SEO
 */
function EMICalculator() {
  const location = useLocation();
  const { country } = useParams(); // From URL if available
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'EMI Calculator', path: null }
  ];
  // Initialize from query params if present
  const params = new URLSearchParams(location.search);
  const qpAmount = params.get('amount');
  const qpRate = params.get('rate');
  const qpTenure = params.get('tenure');
  const [loanAmount, setLoanAmount] = useState(qpAmount ? Math.max(100000, Math.min(50000000, parseFloat(qpAmount))) : 1000000);
  const [interestRate, setInterestRate] = useState(qpRate ? Math.max(5, Math.min(20, parseFloat(qpRate))) : 8.5);
  const [tenure, setTenure] = useState(qpTenure ? Math.max(1, Math.min(30, parseFloat(qpTenure))) : 20);
  const [result, setResult] = useState(null);
  const [amortizationView, setAmortizationView] = useState('yearly'); // 'yearly' or 'monthly'
  // Prepayment and strategy
  const [prepayMode, setPrepayMode] = useState('reduceTenure'); // 'reduceEmi' | 'reduceTenure'
  const [yearlyPrepay, setYearlyPrepay] = useState(0);
  const [prepayStartYear, setPrepayStartYear] = useState(1);
  // Floating rate shock
  const [shockDelta, setShockDelta] = useState(0);
  // Income indicator
  const [monthlyIncome, setMonthlyIncome] = useState('');
  // Loan type presets
  const [loanType, setLoanType] = useState('home'); // home | car | personal | education
  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-calculate on mount and whenever values change
  React.useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure, loanType]);

  // Memoize prepayment simulation (used in both amortization and summary)
  const prepaySim = useMemo(() => {
    const P = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const years = parseFloat(tenure);
    return simulatePrepayment(P, rate, years, yearlyPrepay, prepayStartYear, prepayMode);
  }, [loanAmount, interestRate, tenure, yearlyPrepay, prepayStartYear, prepayMode]);

  // Compute amortization rows OUTSIDE conditional render (Rules of Hooks)
  const amortizationRows = useMemo(() => {
    if (!result) return [];
    const P = parseFloat(loanAmount);
    const prepay = prepaySim;
    
    if (amortizationView === 'monthly') {
      return prepay.rows.map((row) => (
        <tr key={`m-${row.period}`}>
          <td>{row.period}</td>
          <td>₹{Math.round(row.emi).toLocaleString('en-IN')}</td>
          <td>₹{Math.round(row.principal).toLocaleString('en-IN')}</td>
          <td>₹{Math.round(row.interest).toLocaleString('en-IN')}</td>
          <td>₹{Math.round(row.balance).toLocaleString('en-IN')}</td>
        </tr>
      ));
    } else {
      // Yearly view
      const yearly = [];
      let currentYear = 1;
      let yearPrincipal = 0;
      let yearInterest = 0;
      let lastBalance = P;
      prepay.rows.forEach((row, idx) => {
        const y = Math.ceil(row.period / 12);
        if (y !== currentYear) {
          yearly.push(
            <tr key={`y-${currentYear}`}>
              <td>{currentYear}</td>
              <td>₹{Math.round(yearPrincipal).toLocaleString('en-IN')}</td>
              <td>₹{Math.round(yearInterest).toLocaleString('en-IN')}</td>
              <td>₹{Math.round(lastBalance).toLocaleString('en-IN')}</td>
            </tr>
          );
          currentYear = y;
          yearPrincipal = 0;
          yearInterest = 0;
        }
        yearPrincipal += row.principal;
        yearInterest += row.interest;
        lastBalance = row.balance;
        if (idx === prepay.rows.length - 1) {
          yearly.push(
            <tr key={`y-${currentYear}`}>
              <td>{currentYear}</td>
              <td>₹{Math.round(yearPrincipal).toLocaleString('en-IN')}</td>
              <td>₹{Math.round(yearInterest).toLocaleString('en-IN')}</td>
              <td>₹{Math.round(lastBalance).toLocaleString('en-IN')}</td>
            </tr>
          );
        }
      });
      return yearly;
    }
  }, [result, loanAmount, amortizationView, prepaySim]);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const years = parseFloat(tenure);
    const { emi, totalInterest, totalAmount } = computeEmi(P, rate, years);
    if (!emi) return;
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

  // Removed unused formatCurrency. Using formatSmartCurrency across UI.

  // SEO configuration for global/country-specific versions
  const seoConfig = {
    title: (country && country.toLowerCase() === 'in')
      ? 'EMI Calculator India – Home Loan, Car Loan & Personal Loan'
      : country 
        ? `EMI Calculator for ${country.toUpperCase()}`
        : 'EMI Calculator India – Home Loan, Car Loan & Personal Loan',
    description: country
      ? `Calculate EMI for ${country.toUpperCase()} with our free EMI calculator. Get monthly payment, total interest, and amortization schedule.`
      : 'Free EMI calculator to calculate equated monthly installment for home loans, car loans, and personal loans. Get amortization breakdown.',
    keywords: country
      ? `EMI calculator ${country.toUpperCase()}, loan EMI, monthly payment calculator`
      : 'EMI calculator, equated monthly installment, loan calculator, EMI formula, monthly payment',
    tool: 'emi',
    country: country || undefined,
    supportedCountries: ['in', 'us', 'uk'],
    isGlobal: !country,
  };

  return (
    <>
      {/* SEO Tags - Global & Country-Specific */}
      <EnhancedSEO {...seoConfig} />
      {/* JSON-LD Schema for FinancialProduct */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          name: (country && country.toLowerCase() === 'in') ? 'EMI Calculator India' : 'EMI Calculator',
          applicationCategory: 'FinanceApplication',
          offers: {
            "@type": "Offer",
            price: '0',
            priceCurrency: 'INR'
          }
        })}
      </script>
      
      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="calculator-header">
          <h1>{country ? `EMI Calculator (${country.toUpperCase()})` : 'EMI Calculator'}</h1>
          <p>Calculate your Equated Monthly Installment for home loans, car loans, personal loans</p>
        </div>

        <div className="calculator-content">
        <div className="calculator-inputs">
          <div className="inputs-grid">
            <div className="slider-group">
            <div className="slider-header">
              <label>Loan Amount</label>
              <input
                type="text"
                value={`₹${loanAmount.toLocaleString('en-IN')}`}
                onChange={(e) => {
                  const val = e.target.value.replace(/[₹,\s]/g, '');
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
                  const val = e.target.value.replace(/[₹,\s]/g, '');
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

          {/* Loan Type - Dropdown (compact) */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Loan Type</label>
              <select
                className="input-select"
                value={loanType}
                onChange={(e)=>{
                  const t = e.target.value;
                  setLoanType(t);
                  const preset = LOAN_PRESETS[t];
                  setInterestRate(Math.min(Math.max(interestRate, preset.rate[0]), preset.rate[1]));
                  setTenure(Math.min(Math.max(tenure, preset.tenure[0]), preset.tenure[1]));
                }}
              >
                <option value="home">Home Loan</option>
                <option value="car">Car Loan</option>
                <option value="personal">Personal Loan</option>
                <option value="education">Education Loan</option>
              </select>
            </div>
          </div>
          </div>{/* End inputs-grid */}

          {/* Advanced Options Toggle */}
          <div style={{textAlign:'center',marginTop:'0.75rem'}}>
            <button 
              className="btn-secondary" 
              onClick={()=>setShowAdvanced(!showAdvanced)}
              style={{fontSize:'0.82rem',padding:'0.5rem 1rem'}}
            >
              {showAdvanced ? '▲ Hide' : '▼ Show'} Advanced Options
            </button>
          </div>

          {showAdvanced && (
            <div className="advanced-section">
            <>
          {/* Income Indicator */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Monthly Income (INR)</label>
              <input
                type="text"
                value={monthlyIncome ? `₹${parseInt(monthlyIncome).toLocaleString('en-IN')}` : ''}
                onChange={(e)=>{
                  const v=e.target.value.replace(/[₹,\s]/g,'');
                  setMonthlyIncome(v);
                }}
                placeholder="e.g., ₹1,00,000"
                className="input-display"
              />
            </div>
          </div>

          {/* Prepayment Simulator */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Prepayment Simulator</label>
            </div>
            <div className="toggle-row" style={{gap:'0.5rem'}}>
              <span>Strategy:</span>
              <button className={`tab-btn ${prepayMode==='reduceTenure'?'active':''}`} onClick={()=>setPrepayMode('reduceTenure')}>Reduce Tenure</button>
              <button className={`tab-btn ${prepayMode==='reduceEmi'?'active':''}`} onClick={()=>setPrepayMode('reduceEmi')}>Reduce EMI</button>
            </div>
            <div className="slider-header">
              <label>Yearly Prepayment</label>
              <span className="input-value">₹{yearlyPrepay.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={yearlyPrepay}
              onChange={(e)=>setYearlyPrepay(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels"><span>₹0</span><span>₹5L</span></div>
            <div className="slider-header">
              <label>Start Year</label>
              <span className="input-value">Year {prepayStartYear}</span>
            </div>
            <input
              type="range"
              min="1"
              max={Math.max(1, parseFloat(tenure))}
              step="1"
              value={prepayStartYear}
              onChange={(e)=>setPrepayStartYear(parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels"><span>Year 1</span><span>Year {tenure}</span></div>
          </div>

          {/* Floating Rate Shock */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Interest Rate Shock</label>
            </div>
            <div className="shock-row" style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {[0,0.5,1,2].map(d=>{
                // Determine severity class for color coding
                const severityClass = d === 0 ? 'shock-none' : d <= 1 ? 'shock-low' : 'shock-high';
                return (
                  <button 
                    key={d} 
                    className={`tab-btn ${shockDelta===d?`active ${severityClass}`:''}`} 
                    onClick={()=>setShockDelta(d)}
                  >
                    {d===0? 'No Shock' : `+${d}%`}
                  </button>
                );
              })}
            </div>
          </div>
            </>
            </div>
          )}

          {/* Reset Button Inside Input Box */}
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
            <h2>Your Loan Breakdown</h2>
            <div className="result-cards">
              <div className="result-card highlight">
                <div className="result-label">
                  Monthly EMI
                  <Tooltip text="Your fixed monthly payment including interest and principal.">ℹ️</Tooltip>
                </div>
                <div className={`result-value ${String(result.emi).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.emi)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Principal Amount</div>
                <div className={`result-value ${String(result.principal).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.principal)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">
                  Total Interest
                  <Tooltip text="Sum of all interest over the full loan. Longer tenures raise this.">ℹ️</Tooltip>
                </div>
                <div className={`result-value ${String(result.totalInterest).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.totalInterest)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Amount Payable</div>
                <div className={`result-value ${String(result.totalAmount).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.totalAmount)}</div>
              </div>
            </div>

            <div className="result-chart">
              <div className="pie-chart" style={{
                background: `conic-gradient(
                  #667eea 0% ${(result.principal / result.totalAmount * 100).toFixed(1)}%,
                  #10b981 ${(result.principal / result.totalAmount * 100).toFixed(1)}% 100%
                )`
              }}>
                <div className="pie-center">
                  <span>Total</span>
                  <strong>₹{Number(result.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Principal: ₹{Number(result.principal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Interest: ₹{Number(result.totalInterest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              {/* Pie Chart Insight Text */}
              <div className="pie-insight">
                <span className="emoji">💡</span>
                You will pay <strong>{((parseFloat(result.totalInterest) / parseFloat(result.principal)) * 100).toFixed(0)}%</strong> of the loan amount as interest over <strong>{tenure}</strong> years
              </div>
            </div>

            {/* Confidence Meter & EMI to Income */}
            <div className="confidence-row" style={{marginTop:'1rem'}}>
              {(() => {
                const emiNum = parseFloat(result.emi);
                const incomeNum = parseFloat(monthlyIncome || '0');
                const ratio = incomeNum>0 ? (emiNum / incomeNum) : 0;
                let status = 'Safe';
                let statusClass = 'safe';
                if (ratio > 0.5) { status = 'Risky'; statusClass = 'risky'; }
                else if (ratio > 0.4) { status = 'Stretching'; statusClass = 'stretching'; }
                return (
                  <div className="income-bar-wrapper">
                    <div className="income-bar-label">
                      <span>
                        <strong>EMI as % of Income:</strong> {incomeNum>0 ? (ratio*100).toFixed(1)+'%' : '—'}
                        <Tooltip text="Banks prefer EMI ≤ 40–50% of monthly income for approval.">ℹ️</Tooltip>
                      </span>
                      <span className={`income-status-badge ${statusClass}`}>
                        <span style={{width:8,height:8,borderRadius:'50%',background:'currentColor'}}></span>
                        {status}
                      </span>
                    </div>
                    {incomeNum > 0 && (
                      <>
                        <div className="income-bar-container">
                          <div 
                            className={`income-bar-fill ${statusClass}`} 
                            style={{width:`${Math.min(ratio*100,100)}%`}}
                          ></div>
                          <div className="income-bar-zones"></div>
                        </div>
                        <div className="confidence-markers">
                          <span className="confidence-zone">Safe (0-40%)</span>
                          <span className="confidence-zone">Stretching (40-50%)</span>
                          <span className="confidence-zone">Risky (&gt;50%)</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Shock Summary */}
            {(() => {
              const P = parseFloat(loanAmount); const rate = parseFloat(interestRate); const years = parseFloat(tenure);
              const shock = shockRate(P, rate, years, shockDelta);
              if (!shock.base.emi || shockDelta === 0) return null;
              // Use high-shock class for +2% rate increase
              const shockClass = shockDelta >= 2 ? 'shock-summary high-shock' : 'shock-summary';
              return (
                <div className={shockClass} style={{marginTop:'1rem'}}>
                  <div><strong>New EMI with +{shockDelta}% shock:</strong> {formatSmartCurrency(shock.shocked.emi)}</div>
                  <div><strong>Extra interest payable:</strong> {formatSmartCurrency(shock.extraInterest)}</div>
                </div>
              );
            })()}

            {/* Share & Copy */}
            <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem',flexWrap:'wrap'}}>
              <button className="tab-btn" onClick={() => {
                const text = `EMI: ${formatSmartCurrency(result.emi)}\nPrincipal: ${formatSmartCurrency(result.principal)}\nInterest: ${formatSmartCurrency(result.totalInterest)}\nTotal: ${formatSmartCurrency(result.totalAmount)}`;
                navigator.clipboard?.writeText(text);
              }}>Copy Summary</button>
              <a className="tab-btn" href={`https://wa.me/?text=${encodeURIComponent('EMI Summary\n'+
                'EMI: '+formatSmartCurrency(result.emi)+'\n'+
                'Principal: '+formatSmartCurrency(result.principal)+'\n'+
                'Interest: '+formatSmartCurrency(result.totalInterest)+'\n'+
                'Total: '+formatSmartCurrency(result.totalAmount))}`} target="_blank" rel="noopener noreferrer">Share WhatsApp</a>
              <button className="tab-btn" onClick={() => exportCalculatorPDF('.calculator-container','emi-summary.pdf')}>Download PDF</button>
            </div>
          </div>
        )}

        {result && (
          <div className="amortization-section">
            <h3>Loan Amortization Schedule</h3>
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
                  {amortizationRows}
                </tbody>
              </table>
            </div>
            {/* Prepayment summary - only show if prepayment is active */}
            {yearlyPrepay > 0 && (
              <div className="prepay-summary" style={{marginTop:'1rem'}}>
                <div><strong>Interest saved:</strong> {formatSmartCurrency(prepaySim.interestSaved)}</div>
                <div><strong>Years reduced:</strong> {prepaySim.yearsReduced.toFixed(2)}</div>
                {prepayMode==='reduceEmi' && <div><strong>EMI change:</strong> {formatSmartCurrency(prepaySim.emiChanged)}</div>}
              </div>
            )}
            <div className="disclaimer" style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
              ⚠️ Indicative only. Actual EMI may vary by lender.
            </div>
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
          <h2>Types of Loans Using EMI</h2>
          
          <h3>Home Loans</h3>
          <p>
            Home loans typically have the longest tenures (up to 30 years) and the lowest interest rates (currently 8-10% p.a. in India). 
            They also offer tax benefits under Section 80C (principal) and Section 24(b) (interest) of the Income Tax Act.
          </p>

          <h3>Car Loans</h3>
          <p>
            Car loans usually have shorter tenures (3-7 years) with interest rates ranging from 7-12% p.a. The loan amount is typically 
            80-90% of the car's on-road price, requiring a 10-20% down payment.
          </p>

          <h3>Personal Loans</h3>
          <p>
            Personal loans are unsecured loans with tenures of 1-5 years and higher interest rates (10-24% p.a.). They don't require 
            collateral but have stricter eligibility criteria based on income and credit score.
          </p>

          <h3>Education Loans</h3>
          <p>
            Education loans offer moratorium periods (no EMI during course duration) and competitive rates (7-12% p.a.). Some loans 
            also have subsidies and tax benefits under Section 80E.
          </p>

          <h3>Business Loans</h3>
          <p>
            Business loans help entrepreneurs finance their ventures with flexible tenures and rates depending on business type, 
            turnover, and creditworthiness.
          </p>
        </div>

        <div className="content-block">
          <h2>How to Use This EMI Calculator</h2>
          <ol>
            <li><strong>Enter Loan Amount:</strong> Use the slider or type directly to input your desired loan amount (₹1 Lakh to ₹5 Crore)</li>
            <li><strong>Set Interest Rate:</strong> Input the annual interest rate offered by your lender (5% to 20%)</li>
            <li><strong>Choose Tenure:</strong> Select your loan tenure in years (1 to 30 years)</li>
            <li><strong>View Results:</strong> The calculator instantly shows your monthly EMI, total interest, and total amount payable</li>
            <li><strong>Analyze Breakdown:</strong> Check the amortization schedule to see year-wise principal and interest payments</li>
            <li><strong>Adjust & Compare:</strong> Modify values to find the optimal loan structure for your needs</li>
          </ol>
        </div>

        {/* Answer Block for AEO */}
        <div className="content-block">
          <h2>EMI on ₹10 Lakh Home Loan for 20 Years</h2>
          <p>At 8.5% interest, EMI is approximately ₹8,678.</p>
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

        <div className="content-block faq-section">
          <h2>Frequently Asked Questions (FAQs)</h2>
          
          <div className="faq-item">
            <h3>What is a good EMI to income ratio?</h3>
            <p>
              Financial experts recommend that your total EMI obligations should not exceed 40-50% of your monthly income. This ensures 
              you have sufficient funds for other expenses and savings. For example, if your monthly income is ₹1,00,000, your total EMIs 
              should ideally be below ₹40,000-50,000.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I prepay my loan to reduce EMI?</h3>
            <p>
              Yes, most loans allow part-prepayments. You can either reduce your EMI amount while keeping tenure same, or reduce tenure 
              while keeping EMI same. Most lenders don't charge prepayment penalties on floating rate home loans. However, check your 
              loan agreement for any applicable charges.
            </p>
          </div>

          <div className="faq-item">
            <h3>What happens if I miss an EMI payment?</h3>
            <p>
              Missing EMI payments can have serious consequences: (1) Late payment charges and penalties, (2) Negative impact on your 
              credit score, (3) Additional interest on unpaid amount, (4) Legal action or asset seizure in extreme cases. Always prioritize 
              EMI payments or contact your lender immediately if facing financial difficulties.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is EMI amount fixed throughout the loan tenure?</h3>
            <p>
              For fixed-rate loans, EMI remains constant. However, for floating-rate loans (most common in India), EMI can change when 
              the lender revises interest rates based on RBI's repo rate or other external benchmarks. Some lenders adjust tenure instead 
              of EMI amount.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I change my loan tenure after taking the loan?</h3>
            <p>
              Yes, many lenders allow you to increase or decrease your loan tenure through restructuring or part-prepayment options. 
              Extending tenure will reduce your EMI but increase total interest. Shortening tenure will increase EMI but save on interest. 
              Contact your lender to understand the process and any applicable charges.
            </p>
          </div>

          <div className="faq-item">
            <h3>How does CIBIL score affect my EMI?</h3>
            <p>
              Your CIBIL score doesn't directly affect EMI amount, but it significantly impacts the interest rate offered by lenders. 
              A higher score (750+) makes you eligible for lower interest rates, which in turn reduces your EMI. For example, a score 
              above 750 might get you 8.5% interest, while a score of 650 might result in 10% interest on the same loan.
            </p>
          </div>
        </div>

        <div className="related-calculators">
          <h2>Related Financial Calculators</h2>
          <p>Explore our other calculators to plan your finances better:</p>
          <div className="calculator-grid">
            <Link to="/sip-calculator" className="calc-card">
              <h3>SIP Calculator</h3>
              <p>Calculate returns on systematic investment plans</p>
            </Link>
            <Link to="/fd-calculator" className="calc-card">
              <h3>FD Calculator</h3>
              <p>Compute fixed deposit maturity amount</p>
            </Link>
            <Link to="/income-tax-calculator" className="calc-card">
              <h3>Income Tax Calculator</h3>
              <p>Calculate tax liability for FY 2024-25</p>
            </Link>
            <Link to="/rd-calculator" className="calc-card">
              <h3>RD Calculator</h3>
              <p>Calculate recurring deposit returns</p>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default EMICalculator;
