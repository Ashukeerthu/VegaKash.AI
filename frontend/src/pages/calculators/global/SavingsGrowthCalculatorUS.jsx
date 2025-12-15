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
import ScrollToTop from '../../../modules/core/ui/ScrollToTop';

/**
 * US Savings Growth Calculator - PRODUCTION GRADE
 * Enterprise-level savings calculator with:
 * - Inflation adjustment, APY compounding, contribution frequencies
 * - Goal-based planning mode
 * - Emergency fund recommendations
 * - Year-by-year projections with charts
 * - Risk scenarios (Conservative/Average/Aggressive)
 */
function SavingsGrowthCalculatorUS() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Savings Growth Calculator', path: null }
  ];
  
  // Calculator Mode
  const [calculatorMode, setCalculatorMode] = useState('projection'); // 'projection' or 'goal'
  
  // Projection Mode Inputs
  const [initial, setInitial] = useState(5000);
  const [depositAmount, setDepositAmount] = useState(500);
  const [depositFrequency, setDepositFrequency] = useState('monthly'); // monthly, biweekly, weekly, annually
  const [years, setYears] = useState(10);
  const [apyRate, setApyRate] = useState(4.5);
  const [compoundingFrequency, setCompoundingFrequency] = useState('daily'); // daily, monthly, quarterly, annually
  const [inflationRate, setInflationRate] = useState(3.0);
  const [returnScenario, setReturnScenario] = useState('average'); // conservative, average, aggressive
  
  // Goal Mode Inputs
  const [savingsGoal, setSavingsGoal] = useState(50000);
  const [goalYears, setGoalYears] = useState(5);
  
  // Emergency Fund
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  
  const [result, setResult] = useState(null);

  // APY Scenarios (realistic for US savings accounts)
  const APY_SCENARIOS = {
    conservative: 3.0,   // Traditional banks
    average: 4.5,        // Online banks, high-yield savings
    aggressive: 5.25     // Top online banks, promotional rates
  };

  // Compounding periods per year
  const COMPOUNDING_PERIODS = {
    daily: 365,
    monthly: 12,
    quarterly: 4,
    annually: 1
  };

  // Deposit frequency multipliers
  const DEPOSIT_FREQUENCIES = {
    weekly: 52,
    biweekly: 26,
    monthly: 12,
    annually: 1
  };

  // Tooltips
  const tooltips = {
    initial: { text: 'Your current savings balance to start with.' },
    depositAmount: { text: 'How much you plan to deposit regularly.' },
    depositFrequency: { text: 'How often you make deposits. Biweekly = every 2 weeks (26x/year).' },
    apyRate: { text: 'Annual Percentage Yield. Top online banks offer 4-5% APY in 2025.' },
    compounding: { text: 'How often interest is calculated and added. Daily = 365 times per year.' },
    inflation: { text: 'Expected annual inflation rate. US average is 2-3%. Reduces purchasing power.' },
    savingsGoal: { text: 'Your target savings amount. We\'ll calculate required deposits.' },
    monthlyExpenses: { text: 'Average monthly expenses for emergency fund calculation (3-6 months recommended).' }
  };

  // Validate inputs
  const validateYears = (val) => {
    if (val < 1) return 1;
    if (val > 40) return 40;
    return val;
  };

  const validateAPY = (val) => {
    if (val < 0) return 0;
    if (val > 6) return 6; // Cap at 6% (unrealistic above this for savings)
    return val;
  };

  React.useEffect(() => {
    if (calculatorMode === 'projection') {
      calculateGrowth();
    } else {
      calculateGoal();
    }
  }, [calculatorMode, initial, depositAmount, depositFrequency, years, apyRate, 
      compoundingFrequency, inflationRate, returnScenario, savingsGoal, goalYears, monthlyExpenses]);

  const calculateGrowth = () => {
    const P = parseFloat(initial) || 0;
    const deposit = parseFloat(depositAmount) || 0;
    const yearsVal = validateYears(parseFloat(years));
    const apy = returnScenario !== 'custom' ? APY_SCENARIOS[returnScenario] : validateAPY(parseFloat(apyRate));
    const inflation = parseFloat(inflationRate) / 100;
    
    const compoundPerYear = COMPOUNDING_PERIODS[compoundingFrequency];
    const depositsPerYear = DEPOSIT_FREQUENCIES[depositFrequency];
    const periodsPerYear = compoundPerYear;
    const r = apy / 100 / periodsPerYear; // Rate per compounding period
    const n = yearsVal * periodsPerYear; // Total compounding periods
    
    // Calculate future value with deposits
    let balance = P;
    let totalDeposited = P;
    let yearlyData = [];
    
    // Year-by-year calculation
    for (let year = 1; year <= yearsVal; year++) {
      const yearDeposits = deposit * depositsPerYear;
      
      // Compound interest for the year with regular deposits
      // Using formula: FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
      const periodsThisYear = periodsPerYear;
      const depositPerPeriod = yearDeposits / periodsPerYear;
      
      // Compound existing balance
      balance = balance * Math.pow(1 + r, periodsThisYear);
      
      // Add deposits with compounding within the year
      balance += depositPerPeriod * ((Math.pow(1 + r, periodsThisYear) - 1) / r);
      
      totalDeposited += yearDeposits;
      
      yearlyData.push({
        year: year,
        balance: balance,
        deposited: totalDeposited,
        interest: balance - totalDeposited
      });
    }
    
    const totalInterest = balance - totalDeposited;
    const realValue = balance / Math.pow(1 + inflation, yearsVal); // Inflation-adjusted
    const interestGrowthPercent = ((totalInterest / totalDeposited) * 100).toFixed(1);
    
    // Emergency fund calculation
    const emergencyFund3Months = monthlyExpenses * 3;
    const emergencyFund6Months = monthlyExpenses * 6;
    const emergencyFundCoverage = balance >= emergencyFund6Months ? '6+ months' : 
                                   balance >= emergencyFund3Months ? '3-6 months' :
                                   `${(balance / monthlyExpenses).toFixed(1)} months`;
    
    setResult({
      mode: 'projection',
      futureValue: balance.toFixed(2),
      totalDeposited: totalDeposited.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      realValue: realValue.toFixed(2),
      interestGrowthPercent: interestGrowthPercent,
      inflationImpact: (balance - realValue).toFixed(2),
      yearlyData: yearlyData,
      years: yearsVal,
      apy: apy,
      emergencyFund3Months: emergencyFund3Months.toFixed(2),
      emergencyFund6Months: emergencyFund6Months.toFixed(2),
      emergencyFundCoverage: emergencyFundCoverage,
      monthsOfExpensesCovered: (balance / monthlyExpenses).toFixed(1)
    });
  };

  const calculateGoal = () => {
    const goal = parseFloat(savingsGoal) || 0;
    const yearsVal = validateYears(parseFloat(goalYears));
    const P = parseFloat(initial) || 0;
    const apy = returnScenario !== 'custom' ? APY_SCENARIOS[returnScenario] : validateAPY(parseFloat(apyRate));
    const inflation = parseFloat(inflationRate) / 100;
    
    const compoundPerYear = COMPOUNDING_PERIODS[compoundingFrequency];
    const depositsPerYear = DEPOSIT_FREQUENCIES[depositFrequency];
    const r = apy / 100 / compoundPerYear;
    const n = yearsVal * compoundPerYear;
    
    // Calculate required deposit to reach goal
    // FV = P(1+r)^n + PMT * [((1+r)^n - 1) / r]
    // Solve for PMT: PMT = (FV - P(1+r)^n) / [((1+r)^n - 1) / r]
    
    const futureValueOfInitial = P * Math.pow(1 + r, n);
    const requiredFromDeposits = goal - futureValueOfInitial;
    
    let requiredDepositPerPeriod = 0;
    if (requiredFromDeposits > 0) {
      requiredDepositPerPeriod = requiredFromDeposits / ((Math.pow(1 + r, n) - 1) / r);
    }
    
    const requiredDepositPerFrequency = (requiredDepositPerPeriod * compoundPerYear) / depositsPerYear;
    const totalWillDeposit = P + (requiredDepositPerFrequency * depositsPerYear * yearsVal);
    const interestEarned = goal - totalWillDeposit;
    
    const realGoalValue = goal / Math.pow(1 + inflation, yearsVal);
    
    setResult({
      mode: 'goal',
      goalAmount: goal.toFixed(2),
      requiredDeposit: requiredDepositPerFrequency.toFixed(2),
      depositFrequency: depositFrequency,
      totalWillDeposit: totalWillDeposit.toFixed(2),
      interestEarned: interestEarned.toFixed(2),
      years: yearsVal,
      realGoalValue: realGoalValue.toFixed(2),
      apy: apy
    });
  };

  const handleReset = () => {
    setCalculatorMode('projection');
    setInitial(5000);
    setDepositAmount(500);
    setDepositFrequency('monthly');
    setYears(10);
    setApyRate(4.5);
    setCompoundingFrequency('daily');
    setInflationRate(3.0);
    setReturnScenario('average');
    setSavingsGoal(50000);
    setGoalYears(5);
    setMonthlyExpenses(3000);
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const parseNumericInput = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned === '' ? '' : parseInt(cleaned);
  };

  const getDepositFrequencyLabel = (freq) => {
    const labels = {
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
      annually: 'Annually'
    };
    return labels[freq] || freq;
  };

  return (
    <>
      <ScrollToTop threshold={300} />
      <EnhancedSEO 
        title={`US Savings Growth Calculator${country ? ` for ${country.toUpperCase()}` : ''}`}
        description={`Estimate your savings growth with regular deposits${country ? ` for ${country.toUpperCase()}` : ''}. Free savings calculator.`}
        tool="savings"
        country={country}
        isGlobal={!country}
      />
      <SEO title="US Savings Growth Calculator | VegaKash" description="Estimate your US savings growth with regular deposits. Free savings calculator for the USA." />

      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        <div className="calculator-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>💰</span>
            US Savings Growth Calculator
          </h1>
          <p style={{ opacity: 0.75 }}>Plan your savings with inflation adjustment, emergency fund targets, and realistic APY scenarios</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              <div className="inputs-grid">
              {/* Savings Details Section */}
              <details open style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Savings Details</summary>
              
              {/* Calculator Mode Toggle */}
              <div style={{ marginBottom: '2rem' }}>
                <div className="loan-type-select">
                  <select 
                    value={calculatorMode} 
                    onChange={(e) => setCalculatorMode(e.target.value)}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: '8px', border: '2px solid #667eea', background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)', fontWeight: '600', color: '#1e293b' }}
                  >
                    <option value="projection">📈 Savings Projection Mode</option>
                    <option value="goal">🎯 Savings Goal Planner</option>
                  </select>
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                  <span style={{ fontSize: '0.85rem', color: '#075985', lineHeight: '1.5' }}>
                    {calculatorMode === 'projection' 
                      ? '📊 See how your savings grow with regular deposits'
                      : '🎯 Calculate how much to save to reach your goal'
                    }
                  </span>
                </div>
              </div>

              {calculatorMode === 'projection' ? (
                <>
                  {/* Initial Savings */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label>
                        Initial Savings
                        <InfoTooltip {...tooltips.initial} />
                      </label>
                      <input 
                        type="text" 
                        value={formatCurrency(initial)} 
                        onChange={(e) => { 
                          const val = parseNumericInput(e.target.value); 
                          if (val !== '') setInitial(val); 
                        }} 
                        className="input-display" 
                      />
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100000" 
                      step="1000" 
                      value={initial} 
                      onChange={(e) => setInitial(parseInt(e.target.value))} 
                      className="slider" 
                    />
                    <div className="slider-labels"><span>$0</span><span>$100K</span></div>
                  </div>

                  {/* Deposit Amount */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label>
                        Deposit Amount
                        <InfoTooltip {...tooltips.depositAmount} />
                      </label>
                      <input 
                        type="text" 
                        value={formatCurrency(depositAmount)} 
                        onChange={(e) => { 
                          const val = parseNumericInput(e.target.value); 
                          if (val !== '') setDepositAmount(val); 
                        }} 
                        className="input-display" 
                      />
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="5000" 
                      step="50" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(parseInt(e.target.value))} 
                      className="slider" 
                    />
                    <div className="slider-labels"><span>$0</span><span>$5K</span></div>
                  </div>

                  {/* Deposit Frequency */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label>
                        Deposit Frequency
                        <InfoTooltip {...tooltips.depositFrequency} />
                      </label>
                    </div>
                    <div className="loan-type-select">
                      <select 
                        value={depositFrequency} 
                        onChange={(e) => setDepositFrequency(e.target.value)}
                        style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', border: '1.5px solid #e8ecf3', background: '#ffffff' }}
                      >
                        <option value="weekly">Weekly (52 deposits/year)</option>
                        <option value="biweekly">Bi-weekly (26 deposits/year)</option>
                        <option value="monthly">Monthly (12 deposits/year)</option>
                        <option value="annually">Annually (1 deposit/year)</option>
                      </select>
                    </div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#059669', padding: '0.75rem', background: '#f0fdf4', borderRadius: '6px' }}>
                      💵 Annual deposits: {formatCurrency(depositAmount * DEPOSIT_FREQUENCIES[depositFrequency])}
                    </div>
                  </div>

                  {/* Years to Save */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label>Years to Save</label>
                      <input 
                        type="text" 
                        value={`${years} yrs`} 
                        onChange={(e) => { 
                          const val = parseNumericInput(e.target.value); 
                          if (val !== '') setYears(val); 
                        }} 
                        onBlur={(e) => {
                          const val = parseNumericInput(e.target.value);
                          setYears(validateYears(val || 1));
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
                      onChange={(e) => setYears(parseInt(e.target.value))} 
                      className="slider" 
                    />
                    <div className="slider-labels"><span>1 Yr</span><span>40 Yrs</span></div>
                  </div>
                </>
              ) : (
                <>
                  {/* Goal Mode Inputs */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label>
                        Savings Goal
                        <InfoTooltip {...tooltips.savingsGoal} />
                      </label>
                      <input 
                        type="text" 
                        value={formatCurrency(savingsGoal)} 
                        onChange={(e) => { 
                          const val = parseNumericInput(e.target.value); 
                          if (val !== '') setSavingsGoal(val); 
                        }} 
                        className="input-display" 
                      />
                    </div>
                    <input 
                      type="range" 
                      min="1000" 
                      max="500000" 
                      step="5000" 
                      value={savingsGoal} 
                      onChange={(e) => setSavingsGoal(parseInt(e.target.value))} 
                      className="slider" 
                    />
                    <div className="slider-labels"><span>$1K</span><span>$500K</span></div>
                  </div>

                  <div className="slider-group">
                    <div className="slider-header">
                      <label>
                        Current Savings
                        <InfoTooltip {...tooltips.initial} />
                      </label>
                      <input 
                        type="text" 
                        value={formatCurrency(initial)} 
                        onChange={(e) => { 
                          const val = parseNumericInput(e.target.value); 
                          if (val !== '') setInitial(val); 
                        }} 
                        className="input-display" 
                      />
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100000" 
                      step="1000" 
                      value={initial} 
                      onChange={(e) => setInitial(parseInt(e.target.value))} 
                      className="slider" 
                    />
                    <div className="slider-labels"><span>$0</span><span>$100K</span></div>
                  </div>

                  <div className="slider-group">
                    <div className="slider-header">
                      <label>Years to Reach Goal</label>
                      <input 
                        type="text" 
                        value={`${goalYears} yrs`} 
                        onChange={(e) => { 
                          const val = parseNumericInput(e.target.value); 
                          if (val !== '') setGoalYears(val); 
                        }} 
                        onBlur={(e) => {
                          const val = parseNumericInput(e.target.value);
                          setGoalYears(validateYears(val || 1));
                        }}
                        className="input-display" 
                      />
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="40" 
                      step="1" 
                      value={goalYears} 
                      onChange={(e) => setGoalYears(parseInt(e.target.value))} 
                      className="slider" 
                    />
                    <div className="slider-labels"><span>1 Yr</span><span>40 Yrs</span></div>
                  </div>

                  <div className="slider-group">
                    <div className="slider-header">
                      <label>
                        Deposit Frequency
                        <InfoTooltip {...tooltips.depositFrequency} />
                      </label>
                    </div>
                    <div className="loan-type-select">
                      <select 
                        value={depositFrequency} 
                        onChange={(e) => setDepositFrequency(e.target.value)}
                        style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', border: '1.5px solid #e8ecf3', background: '#ffffff' }}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>
                </>
              )}            
                </details>

                {/* Growth Factors Section */}
                <details style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer', marginBottom: '1rem' }}>Growth Factors</summary>

              {/* Common Inputs for Both Modes */}
              
              {/* APY Return Scenario */}
              <div className="slider-group" style={{ marginTop: '2rem', padding: '1.5rem', background: '#faf5ff', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                  </svg>
                  Savings Account Settings
                </h3>
                
                <div className="slider-header">
                  <label>
                    APY Return Scenario
                    <InfoTooltip {...tooltips.apyRate} />
                  </label>
                </div>
                <div className="loan-type-select">
                  <select 
                    value={returnScenario} 
                    onChange={(e) => {
                      setReturnScenario(e.target.value);
                      if (e.target.value !== 'custom') {
                        setApyRate(APY_SCENARIOS[e.target.value]);
                      }
                    }}
                    style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', border: '1.5px solid #e8ecf3', background: '#ffffff', marginBottom: '0.75rem' }}
                  >
                    <option value="conservative">Conservative (3.0% APY) - Traditional Banks</option>
                    <option value="average">Average (4.5% APY) - Online Banks</option>
                    <option value="aggressive">High-Yield (5.25% APY) - Top Online Banks</option>
                    <option value="custom">Custom APY Rate</option>
                  </select>
                </div>

                {returnScenario === 'custom' && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="slider-header">
                      <label>Custom APY Rate</label>
                      <input 
                        type="text" 
                        value={`${apyRate}%`} 
                        onChange={(e) => { 
                          const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')); 
                          if (!isNaN(val)) setApyRate(validateAPY(val)); 
                        }} 
                        className="input-display" 
                      />
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="6" 
                      step="0.1" 
                      value={apyRate} 
                      onChange={(e) => setApyRate(parseFloat(e.target.value))} 
                      className="slider" 
                    />
                    <div className="slider-labels"><span>0%</span><span>6%</span></div>
                    {apyRate > 5.5 && (
                      <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fbbf24' }}>
                        <span style={{ fontSize: '0.85rem', color: '#92400e' }}>
                          ⚠️ APY above 5.5% is rare for FDIC-insured savings accounts
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <div className="slider-header">
                    <label>
                      Interest Compounding
                      <InfoTooltip {...tooltips.compounding} />
                    </label>
                  </div>
                  <div className="loan-type-select">
                    <select 
                      value={compoundingFrequency} 
                      onChange={(e) => setCompoundingFrequency(e.target.value)}
                      style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', border: '1.5px solid #e8ecf3', background: '#ffffff' }}
                    >
                      <option value="daily">Daily (Most Common)</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div className="slider-header">
                    <label>
                      Expected Inflation Rate
                      <InfoTooltip {...tooltips.inflation} />
                    </label>
                    <input 
                      type="text" 
                      value={`${inflationRate}%`} 
                      onChange={(e) => { 
                        const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')); 
                        if (!isNaN(val)) setInflationRate(Math.min(val, 10)); 
                      }} 
                      className="input-display" 
                    />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="6" 
                    step="0.1" 
                    value={inflationRate} 
                    onChange={(e) => setInflationRate(parseFloat(e.target.value))} 
                    className="slider" 
                  />
                  <div className="slider-labels"><span>0%</span><span>6%</span></div>
                </div>
              </div>

              {/* Emergency Fund Calculator */}
              <div className="slider-group" style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#15803d', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🚨 Emergency Fund Target
                </h3>
                <div className="slider-header">
                  <label>
                    Monthly Expenses
                    <InfoTooltip {...tooltips.monthlyExpenses} />
                  </label>
                  <input 
                    type="text" 
                    value={formatCurrency(monthlyExpenses)} 
                    onChange={(e) => { 
                      const val = parseNumericInput(e.target.value); 
                      if (val !== '') setMonthlyExpenses(val); 
                    }} 
                    className="input-display" 
                  />
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="10000" 
                  step="100" 
                  value={monthlyExpenses} 
                  onChange={(e) => setMonthlyExpenses(parseInt(e.target.value))} 
                  className="slider" 
                />
                <div className="slider-labels"><span>$1K</span><span>$10K</span></div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>3-Month Fund:</span>
                    <strong style={{ color: '#15803d' }}>{formatCurrency(monthlyExpenses * 3)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>6-Month Fund (Recommended):</span>
                    <strong style={{ color: '#15803d' }}>{formatCurrency(monthlyExpenses * 6)}</strong>
                  </div>
                </div>
              </div>
                </details>
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

            {result && result.mode === 'projection' && (
              <div className="calculator-results">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Your Savings Projection</h2>
                
                {/* Main Future Value Card */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.25)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.95rem', opacity: '0.9', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    Total Savings in {result.years} Years
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                    {formatCurrency(result.futureValue)}
                  </div>
                  <div style={{ fontSize: '0.95rem', opacity: '0.85', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'inline-block' }}>
                    💰 Your money grew {result.interestGrowthPercent}% beyond deposits
                  </div>
                </div>

                {/* Inflation-Adjusted Value */}
                <div style={{ 
                  background: '#fef3c7',
                  border: '2px solid #fbbf24',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#78350f', marginBottom: '0.5rem', fontWeight: '600' }}>
                    📊 Real Value (Inflation-Adjusted)
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#92400e' }}>
                    {formatCurrency(result.realValue)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#78350f', marginTop: '0.5rem', opacity: '0.8' }}>
                    Purchasing power in today's dollars (after {inflationRate}% annual inflation)
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Total Deposited
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>
                      {formatCurrency(result.totalDeposited)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Interest Earned
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#059669' }}>
                      {formatCurrency(result.totalInterest)}
                    </div>
                  </div>
                </div>

                {/* Emergency Fund Status */}
                <div style={{ 
                  padding: '1.75rem',
                  background: parseFloat(result.monthsOfExpensesCovered) >= 6 ? '#f0fdf4' : '#fef3c7',
                  border: parseFloat(result.monthsOfExpensesCovered) >= 6 ? '2px solid #86efac' : '2px solid #fbbf24',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '700', 
                    color: parseFloat(result.monthsOfExpensesCovered) >= 6 ? '#15803d' : '#92400e',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {parseFloat(result.monthsOfExpensesCovered) >= 6 ? '✓' : '⚠️'} Emergency Fund Status
                  </h3>
                  <div style={{ fontSize: '0.95rem', color: parseFloat(result.monthsOfExpensesCovered) >= 6 ? '#166534' : '#78350f', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                    Your savings will cover <strong>{result.monthsOfExpensesCovered} months</strong> of expenses ({formatCurrency(monthlyExpenses)}/month)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1, height: '12px', background: '#e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min((parseFloat(result.monthsOfExpensesCovered) / 6) * 100, 100)}%`, 
                        height: '100%', 
                        background: parseFloat(result.monthsOfExpensesCovered) >= 6 ? '#22c55e' : '#f59e0b',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: parseFloat(result.monthsOfExpensesCovered) >= 6 ? '#15803d' : '#92400e',
                      minWidth: '70px',
                      textAlign: 'right'
                    }}>
                      {result.emergencyFundCoverage}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: parseFloat(result.monthsOfExpensesCovered) >= 6 ? '#166534' : '#78350f', opacity: '0.9' }}>
                    {parseFloat(result.monthsOfExpensesCovered) >= 6 
                      ? `✓ Excellent! You'll have a full 6-month emergency fund (${formatCurrency(result.emergencyFund6Months)}).`
                      : `Target: ${formatCurrency(result.emergencyFund6Months)} for a 6-month fund. Keep saving!`
                    }
                  </div>
                </div>

                {/* Year-by-Year Chart */}
                <div className="breakdown-chart">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11h4v8H2v-8zm6-7h4v15H8V4zm6 5h4v10h-4V9z"/>
                    </svg>
                    Growth Timeline
                  </h3>
                  <div style={{ marginTop: '1.5rem' }}>
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
                          width: `${(result.totalDeposited / result.futureValue * 100).toFixed(1)}%`,
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
                        {(result.totalDeposited / result.futureValue * 100).toFixed(0)}%
                      </div>
                      <div 
                        style={{ 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                        {(result.totalInterest / result.futureValue * 100).toFixed(0)}%
                      </div>
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Deposited</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{formatCurrency(result.totalDeposited)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Interest Earned</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{formatCurrency(result.totalInterest)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Emotional Impact Message */}
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                      <div style={{ fontSize: '0.9rem', color: '#075985', lineHeight: '1.6' }}>
                        💡 <strong>Your money worked for you:</strong> The {formatCurrency(result.totalInterest)} in interest you earned is equivalent to {(parseFloat(result.totalInterest) / (depositAmount * DEPOSIT_FREQUENCIES[depositFrequency])).toFixed(1)} years of deposits at no extra effort!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && result.mode === 'goal' && (
              <div className="calculator-results">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Your Savings Goal Plan</h2>
                
                {/* Required Deposit Card */}
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
                    Required {getDepositFrequencyLabel(result.depositFrequency)} Deposit
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                    {formatCurrency(result.requiredDeposit)}
                  </div>
                  <div style={{ fontSize: '0.95rem', opacity: '0.85', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'inline-block' }}>
                    🎯 To reach your goal of {formatCurrency(result.goalAmount)} in {result.years} years
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Total You'll Deposit
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>
                      {formatCurrency(result.totalWillDeposit)}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: '600' }}>
                      Interest Will Earn
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#059669' }}>
                      {formatCurrency(result.interestEarned)}
                    </div>
                  </div>
                </div>

                {/* Inflation Note */}
                <div style={{ 
                  padding: '1.5rem',
                  background: '#fef3c7',
                  border: '2px solid #fbbf24',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#92400e', marginBottom: '0.75rem' }}>
                    📊 Inflation Impact
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: '1.6' }}>
                    Your {formatCurrency(result.goalAmount)} will have the purchasing power of <strong>{formatCurrency(result.realGoalValue)}</strong> in today's dollars (accounting for {inflationRate}% annual inflation).
                  </div>
                </div>

                {/* Action Plan */}
                <div className="breakdown-chart">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🎯 Your Action Plan
                  </h3>
                  <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#1e293b', lineHeight: '1.8' }}>
                    <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '0.75rem' }}>
                      <strong>Step 1:</strong> Set up automatic {getDepositFrequencyLabel(result.depositFrequency).toLowerCase()} transfers of {formatCurrency(result.requiredDeposit)}
                    </div>
                    <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '0.75rem' }}>
                      <strong>Step 2:</strong> Choose a high-yield savings account earning {result.apy}% APY
                    </div>
                    <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <strong>Step 3:</strong> Review your progress quarterly and adjust as needed
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
            <h2>How to Estimate Savings Growth</h2>
            <p>The formula for future value with regular deposits is:</p>
            <div className="formula-box">
              <strong>FV = P×(1+r)ⁿ + PMT×(((1+r)ⁿ - 1)/r)</strong>
            </div>
            <p>Where:</p>
            <ul>
              <li><strong>FV</strong> = Future value of savings</li>
              <li><strong>P</strong> = Initial savings amount</li>
              <li><strong>PMT</strong> = Monthly deposit</li>
              <li><strong>r</strong> = Monthly return rate</li>
              <li><strong>n</strong> = Number of months</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Savings Growth FAQ</h2>
            <ul>
              <li><strong>How much will my savings grow?</strong> Use this calculator to estimate based on your deposits and expected returns.</li>
              <li><strong>What is compound interest?</strong> Interest earned on both principal and accumulated interest over time.</li>
              <li><strong>Where should I save?</strong> High-yield savings accounts, CDs, money market accounts offer better rates than regular savings.</li>
              <li><strong>How often does interest compound?</strong> Daily, monthly, quarterly - more frequent compounding means better returns.</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Best Savings Strategies</h2>
            <ul>
              <li><strong>Automate Your Savings:</strong> Set up automatic transfers to your savings account each payday</li>
              <li><strong>High-Yield Accounts:</strong> Choose accounts with competitive interest rates (currently 4-5% APY)</li>
              <li><strong>Emergency Fund First:</strong> Build 3-6 months of expenses before investing in higher-risk assets</li>
              <li><strong>Ladder Your CDs:</strong> Spread deposits across multiple maturity dates for liquidity and better rates</li>
            </ul>
          </div>
        </div>

        <AEOContentSection tool="savingsgrowth" country={country} />

        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FinancialProduct", "name": "US Savings Growth Calculator", "description": "Estimate your US savings growth with regular deposits.", "provider": {"@type": "Organization", "name": "VegaKash.AI"}, "applicationCategory": "Calculator", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"} })}</script>
      </div>
    </>
  );
}

export default SavingsGrowthCalculatorUS;
