import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import InfoTooltip from '../../../components/InfoTooltip';
import { calculateMortgage, debounce } from '../../../utils/mortgageCalculator';
import { getTooltip } from '../../../utils/mortgageTooltips';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';

/**
 * US Mortgage Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates monthly payment, total interest, and amortization for US mortgages with SEO
 * Uses production-grade layout matching existing calculator standards
 */
function MortgageCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Mortgage Calculator', path: null }
  ];
  
  // US Standard inputs: Home Price + Down Payment
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(20); // percentage
  const [interestRate, setInterestRate] = useState(6.348);
  const [years, setYears] = useState(30);
  
  // Optional costs (PITI components)
  const [includeCosts, setIncludeCosts] = useState(true);
  const [propertyTax, setPropertyTax] = useState(1.2); // annual %
  const [homeInsurance, setHomeInsurance] = useState(1500); // annual $
  const [pmiRate, setPmiRate] = useState(0.5); // annual % (if down < 20%)
  const [hoaFee, setHoaFee] = useState(0); // monthly $
  const [otherCosts, setOtherCosts] = useState(4000); // annual $
  
  // Start date for amortization
  const [startMonth, setStartMonth] = useState('Dec');
  const [startYear, setStartYear] = useState(2025);
  
  const [result, setResult] = useState(null);
  const [amortizationView, setAmortizationView] = useState('yearly'); // 'yearly' or 'monthly'
  const [showAmortization, setShowAmortization] = useState(false);

  // Calculate loan amount from home price and down payment (memoized)
  const loanAmount = useMemo(() => {
    return homePrice * (1 - downPayment / 100);
  }, [homePrice, downPayment]);

  // Debounced calculation function (prevents excessive re-renders)
  const performCalculation = useCallback(() => {
    const inputs = {
      homePrice,
      downPayment,
      interestRate,
      years,
      includeCosts,
      propertyTax,
      homeInsurance,
      pmiRate,
      hoaFee,
      otherCosts,
      startMonth,
      startYear
    };
    
    const calculatedResult = calculateMortgage(inputs);
    if (calculatedResult) {
      console.log('Mortgage calculation result:', calculatedResult);
      console.log('Amortization yearly:', calculatedResult.amortizationSchedule?.yearly);
      console.log('Amortization monthly:', calculatedResult.amortizationSchedule?.monthly);
      setResult(calculatedResult);
    }
  }, [homePrice, downPayment, interestRate, years, includeCosts, propertyTax, homeInsurance, pmiRate, hoaFee, otherCosts, startMonth, startYear]);

  // Create debounced version of calculation (300ms delay)
  const debouncedCalculate = useMemo(
    () => debounce(performCalculation, 300),
    [performCalculation]
  );

  // Trigger calculation on input changes
  useEffect(() => {
    debouncedCalculate();
  }, [debouncedCalculate]);

  // Initial calculation on mount
  useEffect(() => {
    performCalculation();
  }, []);

  const handleReset = () => {
    setHomePrice(400000);
    setDownPayment(20);
    setInterestRate(6.348);
    setYears(30);
    setIncludeCosts(true);
    setPropertyTax(1.2);
    setHomeInsurance(1500);
    setPmiRate(0.5);
    setHoaFee(0);
    setOtherCosts(4000);
    setStartMonth('Dec');
    setStartYear(2025);
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
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1>US Mortgage Calculator</h1>
          <p>Calculate your monthly mortgage payment, total interest, and amortization schedule</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              <div className="inputs-grid">
                <details open style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer' }}>Loan Details</summary>
              {/* Home Price */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Home Price
                    <InfoTooltip {...getTooltip('homePrice')} />
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(homePrice)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setHomePrice('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setHomePrice(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      
                      if (val === '' || isNaN(num)) {
                        setHomePrice(400000);
                      } else if (num < 10000) {
                        setHomePrice(10000);
                      } else if (num > 10000000) {
                        setHomePrice(10000000);
                      } else {
                        setHomePrice(num);
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
                  value={homePrice}
                  onChange={(e) => setHomePrice(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$10K</span>
                  <span>$10M</span>
                </div>
              </div>

              {/* Down Payment */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Down Payment
                    <InfoTooltip {...getTooltip('downPayment')} />
                  </label>
                  <input
                    type="text"
                    value={`${downPayment}% ${formatCurrency(homePrice * downPayment / 100)}`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      if (val === '') {
                        setDownPayment('');
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setDownPayment(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      const num = parseFloat(val);
                      
                      if (val === '' || isNaN(num)) {
                        setDownPayment(20);
                      } else if (num < 0) {
                        setDownPayment(0);
                      } else if (num > 100) {
                        setDownPayment(100);
                      } else {
                        setDownPayment(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Interest Rate (% p.a.)
                    <InfoTooltip {...getTooltip('interestRate')} />
                  </label>
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
                  <label>
                    Loan Term
                    <InfoTooltip {...getTooltip('loanTerm')} />
                  </label>
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

              {/* Start Date */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Start Date
                    <InfoTooltip {...getTooltip('startDate')} />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      className="input-display"
                      style={{ flex: 1 }}
                    >
                      <option value="Jan">Jan</option>
                      <option value="Feb">Feb</option>
                      <option value="Mar">Mar</option>
                      <option value="Apr">Apr</option>
                      <option value="May">May</option>
                      <option value="Jun">Jun</option>
                      <option value="Jul">Jul</option>
                      <option value="Aug">Aug</option>
                      <option value="Sep">Sep</option>
                      <option value="Oct">Oct</option>
                      <option value="Nov">Nov</option>
                      <option value="Dec">Dec</option>
                    </select>
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className="input-display"
                      style={{ flex: 1 }}
                      min="2020"
                      max="2100"
                    />
                  </div>
                </div>
              </div>

              </details>

                <details style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer' }}>Taxes & Costs (Optional)</summary>
              {/* Include Taxes & Costs Checkbox */}
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeCosts}
                    onChange={(e) => setIncludeCosts(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Include Taxes & Costs Below</span>
                </label>
              </div>

              {/* Conditional Annual Tax & Cost Section */}
              {includeCosts && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(79, 70, 229, 0.05)', 
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px solid rgba(79, 70, 229, 0.1)'
                }}>
                  <h3 style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#4f46e5'
                  }}>Annual Tax & Cost</h3>

                  {/* Property Tax */}
                  <div className="slider-group" style={{ marginBottom: '1rem' }}>
                    <div className="slider-header">
                      <label style={{ fontSize: '0.9rem' }}>
                        Property Taxes
                        <InfoTooltip {...getTooltip('propertyTax')} />
                      </label>
                      <input
                        type="text"
                        value={`${propertyTax}% ${formatCurrency(homePrice * propertyTax / 100)}/yr`}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          if (val) {
                            const num = parseFloat(val);
                            if (!isNaN(num)) setPropertyTax(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          const num = parseFloat(val) || 1.2;
                          setPropertyTax(Math.min(Math.max(num, 0), 5));
                        }}
                        className="input-display"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>0%</span>
                      <span>5%</span>
                    </div>
                  </div>

                  {/* Home Insurance */}
                  <div className="slider-group" style={{ marginBottom: '1rem' }}>
                    <div className="slider-header">
                      <label style={{ fontSize: '0.9rem' }}>
                        Home Insurance
                        <InfoTooltip {...getTooltip('homeInsurance')} />
                      </label>
                      <input
                        type="text"
                        value={`${formatCurrency(homeInsurance)}/yr`}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const num = parseInt(val);
                            if (!isNaN(num)) setHomeInsurance(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const num = parseInt(val) || 1500;
                          setHomeInsurance(Math.min(Math.max(num, 0), 20000));
                        }}
                        className="input-display"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="100"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>$0</span>
                      <span>$20K</span>
                    </div>
                  </div>

                  {/* PMI (only if down payment < 20%) */}
                  {downPayment < 20 && (
                    <div className="slider-group" style={{ marginBottom: '1rem' }}>
                      <div className="slider-header">
                        <label style={{ fontSize: '0.9rem' }}>
                          PMI Insurance
                          <InfoTooltip {...getTooltip('pmi')} />
                        </label>
                        <input
                          type="text"
                          value={`${pmiRate}% ${formatCurrency(loanAmount * pmiRate / 100)}/yr`}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            if (val) {
                              const num = parseFloat(val);
                              if (!isNaN(num)) setPmiRate(num);
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            const num = parseFloat(val) || 0.5;
                            setPmiRate(Math.min(Math.max(num, 0), 2));
                          }}
                          className="input-display"
                          style={{ fontSize: '0.85rem' }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={pmiRate}
                        onChange={(e) => setPmiRate(parseFloat(e.target.value))}
                        className="slider"
                      />
                      <div className="slider-labels">
                        <span>0%</span>
                        <span>2%</span>
                      </div>
                    </div>
                  )}

                  {/* HOA Fee */}
                  <div className="slider-group" style={{ marginBottom: '1rem' }}>
                    <div className="slider-header">
                      <label style={{ fontSize: '0.9rem' }}>
                        HOA Fee
                        <InfoTooltip {...getTooltip('hoaFee')} />
                      </label>
                      <input
                        type="text"
                        value={`${formatCurrency(hoaFee)}/mo`}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const num = parseInt(val);
                            if (!isNaN(num)) setHoaFee(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const num = parseInt(val) || 0;
                          setHoaFee(Math.min(Math.max(num, 0), 1000));
                        }}
                        className="input-display"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={hoaFee}
                      onChange={(e) => setHoaFee(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>$0</span>
                      <span>$1K</span>
                    </div>
                  </div>

                  {/* Other Costs */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label style={{ fontSize: '0.9rem' }}>
                        Other Costs
                        <InfoTooltip {...getTooltip('otherCosts')} />
                      </label>
                      <input
                        type="text"
                        value={`${formatCurrency(otherCosts)}/yr`}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const num = parseInt(val);
                            if (!isNaN(num)) setOtherCosts(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const num = parseInt(val) || 4000;
                          setOtherCosts(Math.min(Math.max(num, 0), 50000));
                        }}
                        className="input-display"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>$0</span>
                      <span>$50K</span>
                    </div>
                  </div>
                </div>
              )}

              </details>
              </div>

              {/* Reset Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleReset} className="btn-reset">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                    <div className="result-value">{formatCurrency(result.monthlyPayment)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Loan Amount</div>
                    <div className="result-value">{formatCurrency(result.loanAmount)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Down Payment</div>
                    <div className="result-value">{formatCurrency(result.downPaymentAmount)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Total Interest</div>
                    <div className="result-value">{formatCurrency(result.totalInterest)}</div>
                  </div>
                </div>

                {/* Detailed Monthly Breakdown */}
                {result.hasAdditionalCosts && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: 'rgba(79, 70, 229, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(79, 70, 229, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#4f46e5' }}>Monthly Payment Details</h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <span>Mortgage Payment (P&I)</span>
                        <strong>{formatCurrency(result.principalInterest)}</strong>
                      </div>
                      {parseFloat(result.monthlyPropertyTax) > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <span>Property Tax</span>
                          <strong>{formatCurrency(result.monthlyPropertyTax)}</strong>
                        </div>
                      )}
                      {parseFloat(result.monthlyHomeInsurance) > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <span>Home Insurance</span>
                          <strong>{formatCurrency(result.monthlyHomeInsurance)}</strong>
                        </div>
                      )}
                      {parseFloat(result.monthlyPMI) > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <span>PMI</span>
                          <strong>{formatCurrency(result.monthlyPMI)}</strong>
                        </div>
                      )}
                      {parseFloat(result.monthlyOther) > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <span>Other Costs (HOA + Other)</span>
                          <strong>{formatCurrency(result.monthlyOther)}</strong>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#4f46e5' }}>
                        <span>Total Out-of-Pocket</span>
                        <strong>{formatCurrency(result.monthlyPayment)}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* House Price & Mortgage Payoff Summary */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#059669' }}>
                    {result.hasAdditionalCosts ? 'Lifetime Cost Summary' : 'Loan Summary'}
                  </h3>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span>House Price</span>
                      <strong>{formatCurrency(homePrice)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span>Loan Amount</span>
                      <strong>{formatCurrency(result.loanAmount)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span>Down Payment</span>
                      <strong>{formatCurrency(result.downPaymentAmount)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                      <span>Total of {years * 12} Mortgage Payments (P&I)</span>
                      <strong>{formatCurrency(result.totalAmount)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span>Total Interest Paid</span>
                      <strong>{formatCurrency(result.totalInterest)}</strong>
                    </div>
                    
                    {result.hasAdditionalCosts && (
                      <>
                        {parseFloat(result.monthlyPropertyTax) > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span>Total Property Taxes ({years} years)</span>
                            <strong>{formatCurrency(parseFloat(result.monthlyPropertyTax) * years * 12)}</strong>
                          </div>
                        )}
                        {parseFloat(result.monthlyHomeInsurance) > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span>Total Home Insurance ({years} years)</span>
                            <strong>{formatCurrency(parseFloat(result.monthlyHomeInsurance) * years * 12)}</strong>
                          </div>
                        )}
                        {parseFloat(result.monthlyPMI) > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span>Total PMI (until 20% equity)</span>
                            <strong>{formatCurrency(parseFloat(result.monthlyPMI) * (result.pmiDropOffMonth || years * 12))}</strong>
                          </div>
                        )}
                        {parseFloat(result.monthlyOther) > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span>Total Other Costs ({years} years)</span>
                            <strong>{formatCurrency(parseFloat(result.monthlyOther) * years * 12)}</strong>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '1.05rem', fontWeight: '700', color: '#dc2626', borderTop: '2px solid rgba(220, 38, 38, 0.2)', background: 'rgba(220, 38, 38, 0.05)', padding: '0.75rem', borderRadius: '6px', marginLeft: '-0.5rem', marginRight: '-0.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                          <span>Total Cost of Homeownership</span>
                          <strong>{formatCurrency(
                            parseFloat(result.downPaymentAmount) +
                            parseFloat(result.totalAmount) +
                            (parseFloat(result.monthlyPropertyTax) * years * 12) +
                            (parseFloat(result.monthlyHomeInsurance) * years * 12) +
                            (parseFloat(result.monthlyPMI) * (result.pmiDropOffMonth || years * 12)) +
                            (parseFloat(result.monthlyOther) * years * 12)
                          )}</strong>
                        </div>
                      </>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#059669', borderTop: '2px solid rgba(16, 185, 129, 0.2)' }}>
                      <span>Mortgage Payoff Date</span>
                      <strong>{result.payoffDate}</strong>
                    </div>
                  </div>
                </div>

                <div className="breakdown-chart">
                  <h3>Payment Breakdown</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ width: `${(result.loanAmount / (parseFloat(result.loanAmount) + parseFloat(result.totalInterest)) * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Principal</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ width: `${(result.totalInterest / (parseFloat(result.loanAmount) + parseFloat(result.totalInterest)) * 100).toFixed(1)}%` }}
                    >
                      <span className="chart-label">Interest</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color principal"></div>
                      <span>Principal: {formatCurrency(result.loanAmount)}</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color interest"></div>
                      <span>Interest: {formatCurrency(result.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amortization Schedule Section */}
        {result && result.amortizationSchedule && (
          <div className="amortization-section" style={{ marginTop: '2rem', width: '100%', maxWidth: '100%' }}>
            <div 
              className="amortization-header" 
              onClick={() => setShowAmortization(!showAmortization)} 
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '1rem', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                borderRadius: '12px', 
                marginBottom: showAmortization ? '1.5rem' : '0'
              }}
            >
              <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: '700' }}>Mortgage Amortization Schedule</h3>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ 
                  transform: showAmortization ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.3s ease' 
                }}
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {showAmortization && (
              <>
                <div className="amortization-tabs" style={{ 
                  display: 'flex', 
                  gap: 'clamp(0.5rem, 2vw, 1rem)', 
                  marginBottom: '1.5rem',
                  width: '100%',
                  maxWidth: '100%'
                }}>
                  <button 
                    className={`tab-btn ${amortizationView === 'yearly' ? 'active' : ''}`}
                    onClick={() => setAmortizationView('yearly')}
                    style={{
                      flex: 1,
                      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.5rem)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: amortizationView === 'yearly' ? '#4f46e5' : '#e5e7eb',
                      color: amortizationView === 'yearly' ? 'white' : '#374151',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Yearly
                  </button>
                  <button 
                    className={`tab-btn ${amortizationView === 'monthly' ? 'active' : ''}`}
                    onClick={() => setAmortizationView('monthly')}
                    style={{
                      flex: 1,
                      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.5rem)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: amortizationView === 'monthly' ? '#4f46e5' : '#e5e7eb',
                      color: amortizationView === 'monthly' ? 'white' : '#374151',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Monthly
                  </button>
                </div>
                
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <div 
                    className="amortization-table" 
                    style={{ 
                      overflowX: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      width: '100%'
                    }}>
                    <table style={{ 
                      width: '100%', 
                      minWidth: amortizationView === 'monthly' ? '600px' : '500px',
                      borderCollapse: 'separate',
                      borderSpacing: 0,
                      fontSize: '14px'
                    }}>
                      <thead>
                        <tr style={{ 
                          background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)', 
                          borderBottom: '2px solid #dee2e6',
                          position: 'sticky',
                          top: 0,
                          zIndex: 10
                        }}>
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'left', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            borderRight: '1px solid #dee2e6',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {amortizationView === 'yearly' ? 'YEAR' : '#'}
                          </th>
                          {amortizationView === 'monthly' && (
                            <th style={{ 
                              padding: '12px 16px', 
                              textAlign: 'center', 
                              fontWeight: '700',
                              fontSize: '0.875rem',
                              color: '#212529',
                              borderRight: '1px solid #dee2e6',
                              background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>DATE</th>
                          )}
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            borderRight: '1px solid #dee2e6',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>PRINCIPAL</th>
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            borderRight: '1px solid #dee2e6',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>INTEREST</th>
                          <th style={{ 
                            padding: '12px 16px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            color: '#212529',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>ENDING BALANCE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationView === 'yearly' 
                          ? result.amortizationSchedule.yearly.map((row, index) => (
                              <tr key={index} className="am-row" style={{ 
                                background: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                borderBottom: '1px solid #e9ecef',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#e7f1ff'}
                              onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}
                              >
                                <td data-label="Year" style={{ 
                                  padding: '10px 16px', 
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  color: '#212529',
                                  borderRight: '1px solid #e9ecef'
                                }}>{row.yearLabel}</td>
                                <td data-label="Principal" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  color: '#495057',
                                  borderRight: '1px solid #e9ecef',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.principal)}</td>
                                <td data-label="Interest" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  color: '#495057',
                                  borderRight: '1px solid #e9ecef',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.interest)}</td>
                                <td data-label="Ending Balance" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right', 
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  color: '#0066cc',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.balance)}</td>
                              </tr>
                            ))
                          : result.amortizationSchedule.monthly.map((row, index) => (
                              <tr key={index} className="am-row" style={{ 
                                background: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                borderBottom: '1px solid #e9ecef',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#e7f1ff'}
                              onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}
                              >
                                <td data-label="#" style={{ 
                                  padding: '10px 16px', 
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  color: '#212529',
                                  borderRight: '1px solid #e9ecef'
                                }}>{row.month}</td>
                                <td data-label="Date" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'center', 
                                  fontSize: '0.8rem',
                                  color: '#495057',
                                  borderRight: '1px solid #e9ecef',
                                  whiteSpace: 'nowrap'
                                }}>{row.date}</td>
                                <td data-label="Principal" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  color: '#495057',
                                  borderRight: '1px solid #e9ecef',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.principal)}</td>
                                <td data-label="Interest" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  color: '#495057',
                                  borderRight: '1px solid #e9ecef',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.interest)}</td>
                                <td data-label="Ending Balance" style={{ 
                                  padding: '10px 16px', 
                                  textAlign: 'right', 
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  color: '#0066cc',
                                  fontFamily: 'monospace'
                                }}>{formatCurrency(row.balance)}</td>
                              </tr>
                            ))
                        }
                      </tbody>
                    </table>
                  </div>
                  
                </div>
              </>
            )}
          </div>
        )}

        {/* SEO Content Section */}
        <div className="seo-content-section">
          <div className="content-block">
            <h2>How to Calculate a US Mortgage</h2>
            <p>The formula for calculating your mortgage payment is:</p>
            <div className="formula-box">
              <strong>M = P × [r(1 + r)^n] / [(1 + r)^n - 1]</strong>
            </div>
            <p>Where:</p>
            <ul>
              <li><strong>M</strong> = Monthly payment</li>
              <li><strong>P</strong> = Principal loan amount</li>
              <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
              <li><strong>n</strong> = Number of payments (years × 12)</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>US Mortgage FAQ</h2>
            <ul>
              <li><strong>What is a mortgage?</strong> A mortgage is a secured loan you take to purchase real estate, repaid in monthly installments over 15-30 years.</li>
              <li><strong>What affects mortgage rates?</strong> Credit score, loan-to-value ratio, down payment, loan term, and current market rates all influence your interest rate.</li>
              <li><strong>What's the difference between 15-year and 30-year mortgages?</strong> 30-year mortgages have lower monthly payments but higher total interest. 15-year mortgages cost more monthly but save on total interest.</li>
              <li><strong>What is PMI?</strong> Private Mortgage Insurance is required if your down payment is less than 20% of the home's purchase price.</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Understanding Your Mortgage Payment</h2>
            <p>Your monthly mortgage payment typically includes four components (PITI):</p>
            <ul>
              <li><strong>Principal:</strong> The portion that reduces your loan balance</li>
              <li><strong>Interest:</strong> The cost of borrowing money from the lender</li>
              <li><strong>Taxes:</strong> Property taxes on your home</li>
              <li><strong>Insurance:</strong> Homeowners insurance and PMI (if applicable)</li>
            </ul>
          </div>
        </div>

        {/* AEO Content Section - Optimized for Answer Engines */}
        <AEOContentSection tool="mortgage" country={country} />

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
