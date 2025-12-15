import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import InfoTooltip from '../../../components/InfoTooltip';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';

/**
 * US 401(k) Retirement Calculator - PRODUCTION GRADE
 * Enterprise-level retirement calculator with:
 * - Employer matching, salary-based contributions, age-based limits
 * - Conservative/Average/Aggressive scenarios
 * - Fidelity benchmark comparisons
 * - Full accessibility & UX best practices
 */
function Retirement401kCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: '401(k) Retirement Calculator', path: null }
  ];
  
  // User Demographics
  const [currentAge, setCurrentAge] = useState(33);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [annualSalary, setAnnualSalary] = useState(75000);
  
  // Contribution Settings
  const [contributionPercent, setContributionPercent] = useState(8);
  const [employerMatchPercent, setEmployerMatchPercent] = useState(4);
  const [employerMatchLimit, setEmployerMatchLimit] = useState(6);
  const [salaryIncreasePercent, setSalaryIncreasePercent] = useState(3);
  
  // Investment Settings
  const [returnScenario, setReturnScenario] = useState('average'); // conservative, average, aggressive
  const [contributionType, setContributionType] = useState('traditional'); // traditional, roth
  
  const [result, setResult] = useState(null);

  // IRS Contribution Limits (2025)
  const IRS_LIMITS = {
    under50: 23000,
    catchUp: 7500, // Additional for 50+
    total50Plus: 30500
  };

  // Return scenarios based on market research
  const RETURN_SCENARIOS = {
    conservative: 4.0,
    average: 7.0,
    aggressive: 10.0
  };

  // Tooltips for accessibility
  const tooltips = {
    currentAge: { text: 'Your current age. Used to calculate catch-up contributions after age 50.' },
    retirementAge: { text: 'Age you plan to retire. Most Americans retire between 62-67.' },
    currentBalance: { text: 'Your current 401(k) balance across all accounts.' },
    salary: { text: 'Your current annual gross salary before taxes.' },
    contributionPercent: { text: 'Percentage of salary you contribute. IRS limits apply.' },
    employerMatch: { text: 'Employer match percentage. Typical is 50% of first 6% = 3% match.' },
    matchLimit: { text: 'Maximum salary percentage your employer will match.' },
    salaryIncrease: { text: 'Expected annual salary increase. US average is 3-4%.' },
    returnScenario: { text: 'Conservative 4%, Average 7%, Aggressive 10% annual return.' },
    contributionType: { text: 'Traditional = pre-tax now, taxed later. Roth = post-tax now, tax-free later.' }
  };

  // Calculate years to retirement
  const yearsToRetirement = useMemo(() => {
    return Math.max(1, retirementAge - currentAge);
  }, [currentAge, retirementAge]);

  // Check if user qualifies for catch-up contributions
  const isCatchUpEligible = useMemo(() => {
    return currentAge >= 50;
  }, [currentAge]);

  // Calculate annual contribution limit
  const annualContributionLimit = useMemo(() => {
    return isCatchUpEligible ? IRS_LIMITS.total50Plus : IRS_LIMITS.under50;
  }, [isCatchUpEligible]);

  React.useEffect(() => {
    calculate401k();
  }, [currentAge, retirementAge, currentBalance, annualSalary, contributionPercent, 
      employerMatchPercent, employerMatchLimit, salaryIncreasePercent, returnScenario]);

  const calculate401k = () => {
    const years = yearsToRetirement;
    if (years <= 0 || annualSalary <= 0) return;

    const annualReturn = RETURN_SCENARIOS[returnScenario] / 100;
    let balance = parseFloat(currentBalance);
    let totalContributed = balance;
    let totalEmployerMatch = 0;
    let yearlyData = [];
    
    let salary = parseFloat(annualSalary);
    const salaryGrowth = parseFloat(salaryIncreasePercent) / 100;
    const empMatchPercent = parseFloat(employerMatchPercent) / 100;
    const empMatchMax = parseFloat(employerMatchLimit) / 100;
    const contribPercent = parseFloat(contributionPercent) / 100;

    for (let year = 1; year <= years; year++) {
      const age = currentAge + year;
      const isCatchUp = age >= 50;
      const yearLimit = isCatchUp ? IRS_LIMITS.total50Plus : IRS_LIMITS.under50;
      
      // Employee contribution (capped by IRS limits)
      let employeeContrib = salary * contribPercent;
      employeeContrib = Math.min(employeeContrib, yearLimit);
      
      // Employer match (up to match limit)
      const matchableAmount = salary * Math.min(contribPercent, empMatchMax);
      const employerContrib = matchableAmount * empMatchPercent;
      
      const totalYearContrib = employeeContrib + employerContrib;
      
      // Apply contributions and growth
      balance = balance * (1 + annualReturn) + totalYearContrib;
      totalContributed += employeeContrib;
      totalEmployerMatch += employerContrib;
      
      // Salary increase for next year
      salary *= (1 + salaryGrowth);
      
      // Store data for timeline chart
      if (year % Math.ceil(years / 20) === 0 || year === years) {
        yearlyData.push({
          year: year,
          age: age,
          balance: balance,
          contributed: totalContributed,
          employerMatch: totalEmployerMatch
        });
      }
    }

    const totalInvested = totalContributed + totalEmployerMatch;
    const investmentGain = balance - totalInvested;
    
    // Fidelity benchmark (age-based savings guideline)
    const fidelityBenchmark = getFidelityBenchmark(retirementAge, annualSalary);
    const benchmarkComparison = ((balance / fidelityBenchmark) * 100).toFixed(0);
    
    // Estimated monthly income (4% withdrawal rule)
    const monthlyIncome = (balance * 0.04) / 12;

    setResult({
      futureValue: balance.toFixed(2),
      totalContributed: totalContributed.toFixed(2),
      totalEmployerMatch: totalEmployerMatch.toFixed(2),
      totalInvested: totalInvested.toFixed(2),
      investmentGain: investmentGain.toFixed(2),
      monthlyIncome: monthlyIncome.toFixed(2),
      fidelityBenchmark: fidelityBenchmark.toFixed(2),
      benchmarkComparison: benchmarkComparison,
      yearlyData: yearlyData,
      yearsToRetirement: years,
      finalAge: retirementAge,
      returnRate: RETURN_SCENARIOS[returnScenario]
    });
  };

  // Fidelity savings benchmarks by age
  const getFidelityBenchmark = (age, salary) => {
    const multipliers = {
      30: 1, 35: 2, 40: 3, 45: 4, 50: 6, 55: 7, 60: 8, 65: 10, 67: 10
    };
    
    let multiplier = 0;
    for (let benchmarkAge in multipliers) {
      if (age >= parseInt(benchmarkAge)) {
        multiplier = multipliers[benchmarkAge];
      }
    }
    
    return salary * multiplier;
  };

  const handleReset = () => {
    setCurrentAge(33);
    setRetirementAge(65);
    setCurrentBalance(50000);
    setAnnualSalary(75000);
    setContributionPercent(8);
    setEmployerMatchPercent(4);
    setEmployerMatchLimit(6);
    setSalaryIncreasePercent(3);
    setReturnScenario('average');
    setContributionType('traditional');
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const parseNumericInput = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned === '' ? '' : parseInt(cleaned);
  };

  const validateAge = (age, min = 18, max = 80) => {
    if (age === '' || age < min) return min;
    if (age > max) return max;
    return age;
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
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>🏦</span>
            US 401(k) Retirement Calculator
          </h1>
          <p style={{ opacity: 0.75 }}>Estimate your 401k retirement savings with employer match, salary growth, and IRS contribution limits</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              <div className="inputs-grid">
              {/* Current Situation Section */}
              <details open style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Current Situation</summary>
              
              {/* Age & Timeline Section */}
              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9ff', borderRadius: '12px', border: '1px solid #e0e7ff' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2C5.582 2 2 5.582 2 10s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm1-9h-2v4h4v-2h-2V7z"/>
                  </svg>
                  Your Timeline
                </h3>
                
                <div className="slider-group">
                  <div className="slider-header">
                    <label>
                      Current Age
                      <InfoTooltip {...tooltips.currentAge} />
                    </label>
                    <input
                      type="text"
                      value={`${currentAge} yrs`}
                      onChange={(e) => {
                        const val = parseNumericInput(e.target.value);
                        if (val !== '') setCurrentAge(val);
                      }}
                      onBlur={(e) => {
                        const val = parseNumericInput(e.target.value);
                        setCurrentAge(validateAge(val, 18, 75));
                      }}
                      className="input-display"
                    />
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="75"
                    step="1"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>18</span>
                    <span>75</span>
                  </div>
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <label>
                      Retirement Age
                      <InfoTooltip {...tooltips.retirementAge} />
                    </label>
                    <input
                      type="text"
                      value={`${retirementAge} yrs`}
                      onChange={(e) => {
                        const val = parseNumericInput(e.target.value);
                        if (val !== '') setRetirementAge(val);
                      }}
                      onBlur={(e) => {
                        const val = parseNumericInput(e.target.value);
                        setRetirementAge(validateAge(val, currentAge + 1, 80));
                      }}
                      className="input-display"
                    />
                  </div>
                  <input
                    type="range"
                    min={currentAge + 1}
                    max="80"
                    step="1"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>{currentAge + 1}</span>
                    <span>80</span>
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', marginTop: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Years Until Retirement</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#667eea' }}>{yearsToRetirement} years</div>
                  {isCatchUpEligible && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
                      <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '600' }}>✓ Catch-up contributions eligible</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Balance */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Current 401(k) Balance
                    <InfoTooltip {...tooltips.currentBalance} />
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(currentBalance)}
                    onChange={(e) => {
                      const val = parseNumericInput(e.target.value);
                      if (val !== '') setCurrentBalance(val);
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="5000"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>$1M</span>
                </div>
              </div>

              {/* Annual Salary */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Annual Salary
                    <InfoTooltip {...tooltips.salary} />
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(annualSalary)}
                    onChange={(e) => {
                      const val = parseNumericInput(e.target.value);
                      if (val !== '') setAnnualSalary(val);
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="20000"
                  max="500000"
                  step="5000"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>$20K</span>
                  <span>$500K</span>
                </div>
              </div>
                </details>

                {/* Projections Section */}
                <details style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Projections</summary>

              {/* Contribution Percentage */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Your Contribution (% of Salary)
                    <InfoTooltip {...tooltips.contributionPercent} />
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={`${contributionPercent}%`}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(val)) setContributionPercent(Math.min(val, 100));
                      }}
                      className="input-display"
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      = {formatCurrency(annualSalary * contributionPercent / 100)}/yr
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={contributionPercent}
                  onChange={(e) => setContributionPercent(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>0%</span>
                  <span>50%</span>
                </div>
                {(annualSalary * contributionPercent / 100) > annualContributionLimit && (
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fbbf24' }}>
                    <span style={{ fontSize: '0.85rem', color: '#92400e' }}>
                      ⚠️ Exceeds IRS limit of {formatCurrency(annualContributionLimit)}. Will be capped.
                    </span>
                  </div>
                )}
              </div>

              {/* Employer Match */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Employer Match
                    <InfoTooltip {...tooltips.employerMatch} />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={`${employerMatchPercent}%`}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(val)) setEmployerMatchPercent(Math.min(val, 100));
                      }}
                      className="input-display"
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#64748b', alignSelf: 'center' }}>up to</span>
                    <input
                      type="text"
                      value={`${employerMatchLimit}%`}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(val)) setEmployerMatchLimit(Math.min(val, 100));
                      }}
                      className="input-display"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '0.5rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '6px' }}>
                  💰 Free money: ~{formatCurrency(annualSalary * Math.min(contributionPercent / 100, employerMatchLimit / 100) * employerMatchPercent / 100)}/year
                </div>
              </div>

              {/* Expected Salary Increase */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Expected Annual Raise
                    <InfoTooltip {...tooltips.salaryIncrease} />
                  </label>
                  <input
                    type="text"
                    value={`${salaryIncreasePercent}%`}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(val)) setSalaryIncreasePercent(Math.min(val, 20));
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={salaryIncreasePercent}
                  onChange={(e) => setSalaryIncreasePercent(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>

              {/* Investment Return Scenario */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Investment Return Scenario
                    <InfoTooltip {...tooltips.returnScenario} />
                  </label>
                </div>
                <div className="loan-type-select">
                  <select 
                    value={returnScenario} 
                    onChange={(e) => setReturnScenario(e.target.value)}
                    style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', border: '1.5px solid #e8ecf3', background: '#ffffff' }}
                  >
                    <option value="conservative">Conservative (4% annually)</option>
                    <option value="average">Average (7% annually)</option>
                    <option value="aggressive">Aggressive (10% annually)</option>
                  </select>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  {returnScenario === 'conservative' && '📊 Low-risk bonds, stable growth'}
                  {returnScenario === 'average' && '📊 Balanced portfolio, historical S&P 500 average'}
                  {returnScenario === 'aggressive' && '📊 Stock-heavy, higher volatility & growth'}
                </div>
              </div>

              {/* Contribution Type */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>
                    Contribution Type
                    <InfoTooltip {...tooltips.contributionType} />
                  </label>
                </div>
                <div className="loan-type-select">
                  <select 
                    value={contributionType} 
                    onChange={(e) => setContributionType(e.target.value)}
                    style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', border: '1.5px solid #e8ecf3', background: '#ffffff' }}
                  >
                    <option value="traditional">Traditional 401(k) (Pre-tax)</option>
                    <option value="roth">Roth 401(k) (Post-tax)</option>
                  </select>
                </div>
              </div>
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
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Your 401(k) Projection</h2>
                
                {/* Main Projection Card */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 6px 18px rgba(102, 126, 234, 0.25)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.95rem', opacity: '0.9', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    Estimated Balance at Retirement (Age {result.finalAge})
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                    {formatCurrency(result.futureValue)}
                  </div>
                  <div style={{ fontSize: '0.95rem', opacity: '0.85', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'inline-block' }}>
                    📊 {returnScenario.charAt(0).toUpperCase() + returnScenario.slice(1)} scenario ({result.returnRate}% annual return)
                  </div>
                </div>

                {/* Monthly Income Card */}
                <div style={{ 
                  background: '#f0fdf4',
                  border: '2px solid #86efac',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#16a34a', marginBottom: '0.5rem', fontWeight: '600' }}>
                    💰 Estimated Monthly Income in Retirement
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#15803d' }}>
                    {formatCurrency(result.monthlyIncome)}/month
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '0.5rem', opacity: '0.8' }}>
                    Based on 4% annual withdrawal rule
                  </div>
                </div>

                {/* Breakdown Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Your Contributions
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>
                      {formatCurrency(result.totalContributed)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Employer Match
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#059669' }}>
                      {formatCurrency(result.totalEmployerMatch)}
                    </div>
                  </div>
                </div>

                {/* Total Investment & Gain */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Total Invested
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>
                      {formatCurrency(result.totalInvested)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Investment Gain
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#7c3aed' }}>
                      {formatCurrency(result.investmentGain)}
                    </div>
                  </div>
                </div>

                {/* Fidelity Benchmark Comparison */}
                <div style={{ 
                  padding: '1.75rem',
                  background: result.benchmarkComparison >= 100 ? '#f0fdf4' : '#fef3c7',
                  border: result.benchmarkComparison >= 100 ? '2px solid #86efac' : '2px solid #fbbf24',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '700', 
                    color: result.benchmarkComparison >= 100 ? '#15803d' : '#92400e',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {result.benchmarkComparison >= 100 ? '🎯' : '⚠️'} Fidelity Retirement Benchmark
                  </h3>
                  <div style={{ fontSize: '0.95rem', color: result.benchmarkComparison >= 100 ? '#166534' : '#78350f', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                    Fidelity recommends having <strong>{formatCurrency(result.fidelityBenchmark)}</strong> saved by age {result.finalAge}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1, height: '12px', background: '#e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min(result.benchmarkComparison, 100)}%`, 
                        height: '100%', 
                        background: result.benchmarkComparison >= 100 ? '#22c55e' : '#f59e0b',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: result.benchmarkComparison >= 100 ? '#15803d' : '#92400e',
                      minWidth: '70px',
                      textAlign: 'right'
                    }}>
                      {result.benchmarkComparison}%
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: result.benchmarkComparison >= 100 ? '#166534' : '#78350f', opacity: '0.9' }}>
                    {result.benchmarkComparison >= 100 
                      ? `✓ You're on track! You're projected to have ${result.benchmarkComparison}% of the recommended savings.`
                      : `You're at ${result.benchmarkComparison}% of the recommended target. Consider increasing contributions or adjusting retirement age.`
                    }
                  </div>
                </div>

                {/* Growth Timeline Chart */}
                <div className="breakdown-chart">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11h4v8H2v-8zm6-7h4v15H8V4zm6 5h4v10h-4V9z"/>
                    </svg>
                    Growth Timeline
                  </h3>
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Age {currentAge}</span>
                      <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Age {result.finalAge}</span>
                    </div>
                    
                    {/* Stacked bar showing composition */}
                    <div style={{ 
                      display: 'flex', 
                      height: '48px', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.08)',
                      marginBottom: '1rem'
                    }}>
                      <div 
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: `${(result.totalContributed / result.futureValue * 100).toFixed(1)}%`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          padding: '0 0.5rem'
                        }}
                      >
                        {(result.totalContributed / result.futureValue * 100).toFixed(0)}%
                      </div>
                      <div 
                        style={{ 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          width: `${(result.totalEmployerMatch / result.futureValue * 100).toFixed(1)}%`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          padding: '0 0.5rem'
                        }}
                      >
                        {(result.totalEmployerMatch / result.futureValue * 100).toFixed(0)}%
                      </div>
                      <div 
                        style={{ 
                          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          padding: '0 0.5rem'
                        }}
                      >
                        {(result.investmentGain / result.futureValue * 100).toFixed(0)}%
                      </div>
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Your Contributions</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{formatCurrency(result.totalContributed)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Employer Match</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{formatCurrency(result.totalEmployerMatch)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' }}></div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Investment Growth</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{formatCurrency(result.investmentGain)}</div>
                        </div>
                      </div>
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
            <h2>How to Estimate 401(k) Growth</h2>
            <p>The formula for future value with regular contributions is:</p>
            <div className="formula-box">
              <strong>FV = P×(1+r)ⁿ + C×(((1+r)ⁿ - 1)/r)</strong>
            </div>
            <p>Where:</p>
            <ul>
              <li><strong>FV</strong> = Future value of your 401k</li>
              <li><strong>P</strong> = Current 401k balance</li>
              <li><strong>C</strong> = Annual contribution amount</li>
              <li><strong>r</strong> = Annual return rate (as decimal)</li>
              <li><strong>n</strong> = Number of years</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>401(k) Retirement FAQ</h2>
            <ul>
              <li><strong>What is a 401(k)?</strong> A US retirement savings plan with tax advantages, often with employer matching.</li>
              <li><strong>Can I contribute more?</strong> 2024 limits are $23,500 per year ($31,000 if age 50+).</li>
              <li><strong>What are typical return rates?</strong> Historical S&P 500 average is around 10%, but varies by market conditions.</li>
              <li><strong>Should I maximize employer match?</strong> Yes, free money from employer match is essential to take advantage of.</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Maximizing Your 401(k)</h2>
            <ul>
              <li>Contribute enough to get full employer match</li>
              <li>Increase contributions with annual salary increases</li>
              <li>Review and rebalance your investment allocation periodically</li>
              <li>Consider target-date funds for automatic adjustments as you near retirement</li>
            </ul>
          </div>
        </div>

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
