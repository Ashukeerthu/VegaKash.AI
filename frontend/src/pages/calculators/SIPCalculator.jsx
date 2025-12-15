import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EnhancedSEO } from '../../components/EnhancedSEO';
import { AEOContentSection } from '../../components/AEOContentSection';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import InfoTooltip from '../../components/InfoTooltip';
import { formatSmartCurrency } from '../../utils/helpers';
import '../../styles/Calculator.css';
import '../../styles/SEOContent.css';
import '../../styles/AEOContent.css';

/**
 * SIP Calculator India - PRODUCTION GRADE
 * Enhanced SIP calculator with tax implications, inflation adjustment, step-up SIP
 * Includes goal planning, fund categories, and expense ratio considerations
 */
function SIPCalculator() {
  const { country } = useParams();
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'SIP Calculator', path: null }
  ];

  // Core state variables
  const [investmentMode, setInvestmentMode] = useState('sip'); // 'sip' or 'lumpsum'
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [duration, setDuration] = useState(10);
  
  // Enhanced features
  const [fundCategory, setFundCategory] = useState('equity'); // 'equity', 'debt', 'hybrid'
  const [expenseRatio, setExpenseRatio] = useState(1.5);
  const [stepUpRate, setStepUpRate] = useState(0); // Annual SIP increase %
  const [inflationRate, setInflationRate] = useState(6.0);
  const [showInflationAdjusted, setShowInflationAdjusted] = useState(false);
  const [goalMode, setGoalMode] = useState(false);
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [taxOptimized, setTaxOptimized] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30); // Tax slab for debt funds (5%, 20%, 30%)
  const [hybridType, setHybridType] = useState('equity-oriented'); // 'equity-oriented' or 'debt-oriented'
  const [isIndexFund, setIsIndexFund] = useState(false); // Index fund toggle
  
  const [result, setResult] = useState(null);

  // Enhanced tooltips
  const tooltips = {
    monthlyInvestment: { text: 'Monthly SIP amount. Minimum ₹500. Consider 15-20% of income for wealth building.' },
    expectedReturn: { text: 'Expected annual return. Equity: 10-15%, Debt: 6-8%, Hybrid: 8-12%. Use conservative estimates.' },
    duration: { text: 'Investment tenure. Longer duration benefits from compounding. Minimum 3 years recommended.' },
    fundCategory: { text: 'Equity: High growth, high risk, 10+ years. Debt: Stable returns, 1-3 years. Hybrid: Balanced, 3-7 years.' },
    expenseRatio: { text: 'Annual fund management charges. Passive funds: 0.1-0.5%, Active funds: 1-2.5%. Lower is better.' },
    stepUpSip: { text: 'Annual SIP increase %. Recommended 10-15% to beat inflation. Accelerates wealth creation.' },
    inflation: { text: 'Shows purchasing power after inflation. India average: 6%. Helps in real planning.' },
    goalMode: { text: 'Calculate monthly SIP needed to reach target amount. Reverse calculation for goal planning.' },
    taxOptimized: { text: 'Considers LTCG tax (>1 year: 10% above ₹1L), STCG tax (15%), and indexation for debt funds.' }
  };

  // Fund categories with typical characteristics
  const fundCategories = {
    equity: { 
      label: 'Equity Funds',
      expectedReturn: 12,
      expenseRatio: isIndexFund ? 0.3 : 1.5,
      riskLevel: 'High',
      horizon: '7+ Years',
      description: isIndexFund ? 'Low-cost market tracking with minimal management' : 'High growth potential with market risk'
    },
    debt: { 
      label: 'Debt Funds',
      expectedReturn: 7,
      expenseRatio: isIndexFund ? 0.2 : 0.8,
      riskLevel: 'Low',
      horizon: '1-3 Years', 
      description: 'Stable returns with lower risk'
    },
    hybrid: { 
      label: 'Hybrid Funds',
      expectedReturn: 10,
      expenseRatio: 1.2,
      riskLevel: 'Medium',
      horizon: '3-7 Years',
      description: hybridType === 'equity-oriented' 
        ? 'Aggressive hybrid with 65%+ equity allocation'
        : 'Conservative hybrid with 65%+ debt allocation'
    },
    elss: {
      label: 'ELSS (Tax Saver)',
      expectedReturn: 12,
      expenseRatio: 1.8,
      riskLevel: 'High',
      horizon: '3+ Years (Lock-in)',
      description: 'Tax benefits + equity growth. 3-year lock-in mandatory'
    }
  };

  // Enhanced calculation with debouncing
  const debouncedCalculate = useCallback(() => {
    const timeoutId = setTimeout(() => {
      if (goalMode) {
        calculateRequiredSIP();
      } else if (investmentMode === 'sip') {
        calculateEnhancedSIP();
      } else {
        calculateEnhancedLumpsum();
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [investmentMode, monthlyInvestment, initialInvestment, lumpsumAmount, expectedReturn, duration, 
      fundCategory, expenseRatio, stepUpRate, inflationRate, showInflationAdjusted, goalMode, targetAmount, 
      taxOptimized, taxSlab, hybridType, isIndexFund]);

  useEffect(() => {
    const cleanup = debouncedCalculate();
    return cleanup;
  }, [debouncedCalculate]);

  // Enhanced SIP calculation with step-up, tax, and inflation
  const calculateEnhancedSIP = () => {
    const P = parseFloat(monthlyInvestment) || 0;
    const initial = parseFloat(initialInvestment) || 0;
    const annualReturn = (parseFloat(expectedReturn) - parseFloat(expenseRatio)) / 100; // Net returns
    const monthlyReturn = annualReturn / 12;
    const years = parseFloat(duration) || 0;
    const stepUp = parseFloat(stepUpRate) / 100;
    const inflRate = parseFloat(inflationRate) / 100;
    
    if (P <= 0 || annualReturn < 0 || years <= 0) return;

    let futureValue = 0;
    let totalInvested = initial;
    let currentSIP = P;
    let monthlyBreakdown = [];
    let yearlyBreakdown = [];
    
    // Calculate SIP with step-up
    for (let year = 1; year <= years; year++) {
      let yearlyInvested = 0;
      let yearStartFV = futureValue;
      
      for (let month = 1; month <= 12; month++) {
        if (year === 1 && month === 1) {
          futureValue += initial; // Add initial investment
        }
        
        futureValue += currentSIP; // Add monthly SIP
        futureValue *= (1 + monthlyReturn); // Apply monthly returns
        yearlyInvested += currentSIP;
        totalInvested += currentSIP;
        
        if (year === 1) {
          monthlyBreakdown.push({
            month,
            sipAmount: currentSIP,
            balance: futureValue,
            invested: totalInvested
          });
        }
      }
      
      yearlyBreakdown.push({
        year,
        sipAmount: currentSIP,
        yearlyInvested,
        yearEndValue: futureValue,
        totalInvested
      });
      
      // Step-up SIP for next year
      currentSIP = currentSIP * (1 + stepUp);
    }

    // Calculate tax implications
    const totalReturns = futureValue - totalInvested;
    let taxOnReturns = 0;
    
    if (taxOptimized && totalReturns > 0) {
      if (fundCategory === 'equity' || fundCategory === 'elss') {
        // LTCG: 10% above ₹1L per financial year (corrected logic)
        const exemptAmount = 100000; // ₹1L exemption per year, not cumulative
        const taxableGains = Math.max(0, totalReturns - exemptAmount);
        taxOnReturns = taxableGains * 0.10;
      } else if (fundCategory === 'debt') {
        // Debt funds: As per income tax slab (post-April 2023 rules)
        taxOnReturns = totalReturns * (taxSlab / 100);
      } else if (fundCategory === 'hybrid') {
        // Hybrid: Based on equity vs debt orientation
        const equityPortion = hybridType === 'equity-oriented' 
          ? totalReturns * 0.65 
          : totalReturns * 0.35;
        const debtPortion = totalReturns - equityPortion;
        
        const exemptAmount = 100000; // Corrected: ₹1L per year
        const taxableEquity = Math.max(0, equityPortion - exemptAmount);
        taxOnReturns = (taxableEquity * 0.10) + (debtPortion * (taxSlab / 100));
      }
    }

    const afterTaxValue = futureValue - taxOnReturns;
    const netReturns = totalReturns - taxOnReturns;

    // Inflation-adjusted values
    const inflationFactor = Math.pow(1 + inflRate, years);
    const realValue = afterTaxValue / inflationFactor;
    const realReturns = netReturns / inflationFactor;

    // Calculate CAGR
    const cagr = years > 0 ? (Math.pow(afterTaxValue / totalInvested, 1/years) - 1) * 100 : 0;

    setResult({
      futureValue: Math.round(futureValue),
      afterTaxValue: Math.round(afterTaxValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
      netReturns: Math.round(netReturns),
      taxOnReturns: Math.round(taxOnReturns),
      realValue: Math.round(realValue),
      realReturns: Math.round(realReturns),
      cagr: cagr.toFixed(2),
      monthlyBreakdown,
      yearlyBreakdown,
      finalSIP: Math.round(currentSIP),
      mode: 'sip'
    });
  };

  // Enhanced Lumpsum calculation
  const calculateEnhancedLumpsum = () => {
    const P = parseFloat(lumpsumAmount) || 0;
    const annualReturn = (parseFloat(expectedReturn) - parseFloat(expenseRatio)) / 100;
    const years = parseFloat(duration) || 0;
    const inflRate = parseFloat(inflationRate) / 100;
    
    if (P <= 0 || annualReturn < 0 || years <= 0) return;

    const futureValue = P * Math.pow(1 + annualReturn, years);
    const totalReturns = futureValue - P;

    // Tax calculation for lumpsum
    let taxOnReturns = 0;
    if (taxOptimized && totalReturns > 0) {
      if (fundCategory === 'equity' || fundCategory === 'elss') {
        const exemptAmount = 100000; // ₹1L exempt per year
        const taxableGains = Math.max(0, totalReturns - exemptAmount);
        taxOnReturns = taxableGains * 0.10;
      } else if (fundCategory === 'debt') {
        // Post-2023 debt fund taxation as per income slab
        taxOnReturns = totalReturns * (taxSlab / 100);
      } else if (fundCategory === 'hybrid') {
        const equityPortion = hybridType === 'equity-oriented'
          ? totalReturns * 0.65
          : totalReturns * 0.35;
        const debtPortion = totalReturns - equityPortion;
        const taxableEquity = Math.max(0, equityPortion - 100000);
        taxOnReturns = (taxableEquity * 0.10) + (debtPortion * (taxSlab / 100));
      }
    }

    const afterTaxValue = futureValue - taxOnReturns;
    const netReturns = totalReturns - taxOnReturns;

    // Inflation adjustment
    const inflationFactor = Math.pow(1 + inflRate, years);
    const realValue = afterTaxValue / inflationFactor;
    const realReturns = netReturns / inflationFactor;

    const cagr = years > 0 ? (Math.pow(afterTaxValue / P, 1/years) - 1) * 100 : 0;

    setResult({
      futureValue: Math.round(futureValue),
      afterTaxValue: Math.round(afterTaxValue),
      totalInvested: Math.round(P),
      totalReturns: Math.round(totalReturns),
      netReturns: Math.round(netReturns),
      taxOnReturns: Math.round(taxOnReturns),
      realValue: Math.round(realValue),
      realReturns: Math.round(realReturns),
      cagr: cagr.toFixed(2),
      mode: 'lumpsum'
    });
  };

  // Goal-based SIP calculation
  const calculateRequiredSIP = () => {
    const goal = parseFloat(targetAmount) || 0;
    const annualReturn = (parseFloat(expectedReturn) - parseFloat(expenseRatio)) / 100;
    const monthlyReturn = annualReturn / 12;
    const years = parseFloat(duration) || 0;
    const months = years * 12;
    const stepUp = parseFloat(stepUpRate) / 100;
    
    if (goal <= 0 || annualReturn <= 0 || years <= 0) return;

    // Calculate required SIP using complex step-up formula
    let requiredSIP;
    
    if (stepUp === 0) {
      // Simple SIP without step-up
      requiredSIP = goal / (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
    } else {
      // Complex calculation for step-up SIP
      let presentValueFactor = 0;
      for (let year = 1; year <= years; year++) {
        const yearMultiplier = Math.pow(1 + stepUp, year - 1);
        const periodFactor = Math.pow(1 + monthlyReturn, 12 * (years - year + 1));
        presentValueFactor += yearMultiplier * 12 * periodFactor;
      }
      requiredSIP = goal / presentValueFactor;
    }

    setResult({
      requiredSIP: Math.round(requiredSIP),
      targetAmount: goal,
      duration: years,
      expectedReturn: expectedReturn,
      mode: 'goal'
    });
  };

  // Enhanced export functionality
  const exportToCSV = () => {
    if (!result) return;
    
    let csvContent = '';
    
    if (goalMode) {
      // Goal mode CSV
      csvContent = `SIP Goal Calculator - VegaKash.AI\n\n`;
      csvContent += `Investment Goal,${formatSmartCurrency(result.targetAmount, 'INR')}\n`;
      csvContent += `Investment Duration,${result.duration} years\n`;
      csvContent += `Expected Return,${expectedReturn}%\n`;
      csvContent += `Fund Category,${fundCategory}\n`;
      csvContent += `Required Monthly SIP,${formatSmartCurrency(result.requiredSIP, 'INR')}\n`;
      csvContent += `\nNote: This calculation assumes step-up of ${stepUpRate}% annually\n`;
    } else {
      // Regular SIP/Lumpsum CSV with detailed breakdown
      const title = result.mode === 'sip' ? 'SIP Calculator' : 'Lumpsum Calculator';
      csvContent = `${title} Report - VegaKash.AI\n`;
      csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
      
      csvContent += `Investment Details\n`;
      csvContent += `Fund Category,${fundCategory}${isIndexFund ? ' (Index Fund)' : ''}\n`;
      if (fundCategory === 'hybrid') {
        csvContent += `Hybrid Type,${hybridType}\n`;
      }
      if (result.mode === 'sip') {
        csvContent += `Monthly Investment,${formatSmartCurrency(monthlyInvestment, 'INR')}\n`;
        csvContent += `Initial Investment,${formatSmartCurrency(initialInvestment, 'INR')}\n`;
        csvContent += `Step-up Rate,${stepUpRate}% annually\n`;
      } else {
        csvContent += `Lumpsum Amount,${formatSmartCurrency(lumpsumAmount, 'INR')}\n`;
      }
      csvContent += `Investment Duration,${duration} years\n`;
      csvContent += `Expected Return,${expectedReturn}% p.a.\n`;
      csvContent += `Expense Ratio,${expenseRatio}%\n`;
      if (taxOptimized && (fundCategory === 'debt' || fundCategory === 'hybrid')) {
        csvContent += `Tax Slab Used,${taxSlab}%\n`;
      }
      csvContent += `\n`;
      
      csvContent += `Returns Summary\n`;
      csvContent += `Total Invested,${formatSmartCurrency(result.totalInvested, 'INR')}\n`;
      csvContent += `Future Value (Gross),${formatSmartCurrency(result.futureValue, 'INR')}\n`;
      csvContent += `Gross Returns,${formatSmartCurrency(result.totalReturns, 'INR')}\n`;
      
      if (taxOptimized) {
        csvContent += `Tax on Returns,${formatSmartCurrency(result.taxOnReturns, 'INR')}\n`;
        csvContent += `After-Tax Value,${formatSmartCurrency(result.afterTaxValue, 'INR')}\n`;
        csvContent += `Net Returns,${formatSmartCurrency(result.netReturns, 'INR')}\n`;
      }
      
      if (showInflationAdjusted) {
        csvContent += `Real Value (Inflation Adjusted),${formatSmartCurrency(result.realValue, 'INR')}\n`;
        csvContent += `Real Returns,${formatSmartCurrency(result.realReturns, 'INR')}\n`;
      }
      
      csvContent += `CAGR,${result.cagr}%\n\n`;
      
      // Add yearly breakdown for SIP
      if (result.mode === 'sip' && result.yearlyBreakdown) {
        csvContent += `Year-wise Breakdown\n`;
        csvContent += `Year,SIP Amount,Yearly Investment,Year-end Value,Total Invested\n`;
        result.yearlyBreakdown.forEach(year => {
          csvContent += `${year.year},${formatSmartCurrency(year.sipAmount, 'INR')},${formatSmartCurrency(year.yearlyInvested, 'INR')},${formatSmartCurrency(year.yearEndValue, 'INR')},${formatSmartCurrency(year.totalInvested, 'INR')}\n`;
        });
      }
      
      csvContent += `\nDisclaimer:\n`;
      csvContent += `Mutual fund investments are subject to market risks. Please read the offer documents carefully.\n`;
      csvContent += `Past performance is not indicative of future returns.\n`;
      csvContent += `This calculator provides estimates based on assumed rates of return.\n`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${goalMode ? 'SIP_Goal' : result.mode === 'sip' ? 'SIP' : 'Lumpsum'}_Calculator_Report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fund category characteristics
  const getFundCharacteristics = (category) => {
    const characteristics = {
      equity: {
        name: isIndexFund ? 'Equity Index Funds' : 'Equity Funds',
        riskLevel: 'High',
        expectedReturn: '12-15%',
        description: isIndexFund 
          ? 'Low-cost passive funds tracking market indices. Minimal fund manager risk.'
          : 'Invest primarily in stocks. Higher risk, higher potential returns.',
        taxTreatment: 'LTCG: 10% above ₹1L per year, STCG: 15%'
      },
      debt: {
        name: 'Debt Funds',
        riskLevel: 'Low to Medium',
        expectedReturn: '6-9%',
        description: 'Invest in bonds and fixed income securities. Lower risk, stable returns.',
        taxTreatment: `As per income tax slab (${taxSlab}% assumed). Post-April 2023 rules.`
      },
      hybrid: {
        name: `${hybridType === 'equity-oriented' ? 'Aggressive' : 'Conservative'} Hybrid Funds`,
        riskLevel: hybridType === 'equity-oriented' ? 'Medium to High' : 'Low to Medium',
        expectedReturn: '8-12%',
        description: hybridType === 'equity-oriented'
          ? 'Equity-oriented hybrid with 65%+ equity allocation for growth.'
          : 'Debt-oriented hybrid with 65%+ debt allocation for stability.',
        taxTreatment: `Equity portion: 10% above ₹1L. Debt portion: ${taxSlab}% slab rate.`
      },
      elss: {
        name: 'ELSS (Tax Saver)',
        riskLevel: 'High',
        expectedReturn: '12-15%',
        description: 'Equity funds with 3-year mandatory lock-in. Tax deduction up to ₹1.5L under 80C.',
        taxTreatment: 'LTCG: 10% above ₹1L per year. 3-year lock-in period.'
      }
    };
    return characteristics[category] || characteristics.equity;
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

  // SEO configuration for global/country-specific versions
  const seoConfig = {
    title: country 
      ? `SIP Calculator for ${country.toUpperCase()}`
      : 'SIP Calculator - Free Systematic Investment Plan Calculator',
    description: country
      ? `Calculate SIP returns and mutual fund investments for ${country.toUpperCase()}. Free SIP calculator with detailed breakdown and charts.`
      : 'Free SIP calculator to calculate mutual fund SIP returns, lumpsum investments, and wealth growth. Get accurate projections and analysis.',
    keywords: country
      ? `SIP calculator ${country.toUpperCase()}, mutual fund SIP, investment returns`
      : 'SIP calculator, systematic investment plan, mutual fund calculator, investment returns',
    tool: 'sip',
    country: country || undefined,
    supportedCountries: ['in', 'us', 'uk'],
    isGlobal: !country,
  };

  return (
    <>
      {/* SEO Tags - Global & Country-Specific */}
      <EnhancedSEO {...seoConfig} />
      
      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="calculator-header">
          <h1>{country ? `SIP Calculator (${country.toUpperCase()})` : 'SIP Calculator'}</h1>
          <p>Calculate returns from Systematic Investment Plan and one-time investments in mutual funds</p>
        </div>

        <div className="calculator-content">
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
                  value={`₹${monthlyInvestment.toLocaleString('en-IN')}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[₹,\s]/g, '');
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
                    const val = e.target.value.replace(/[₹,\s]/g, '');
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
                  value={`₹${initialInvestment.toLocaleString('en-IN')}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[₹,\s]/g, '');
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
                    const val = e.target.value.replace(/[₹,\s]/g, '');
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
                  value={`₹${lumpsumAmount.toLocaleString('en-IN')}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[₹,\s]/g, '');
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
                    const val = e.target.value.replace(/[₹,\s]/g, '');
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

          {/* Enhanced Features Section */}
          <div className="advanced-options" style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{ 
              color: '#495057', 
              marginBottom: '1.5rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              🎯 Advanced Options
            </h3>
            
            {/* Fund Category Selection */}
            <div className="slider-group">
              <div className="slider-header">
                <label>
                  Fund Category
                  <InfoTooltip content="Choose fund type based on your risk profile and investment horizon" />
                </label>
                <select
                  value={fundCategory}
                  onChange={(e) => {
                    setFundCategory(e.target.value);
                    const category = fundCategories[e.target.value];
                    setExpectedReturn(category.expectedReturn);
                    setExpenseRatio(category.expenseRatio);
                  }}
                  className="select-input"
                >
                  <option value="equity">Equity Funds (12%)</option>
                  <option value="debt">Debt Funds (7%)</option>
                  <option value="hybrid">Hybrid Funds (10%)</option>
                  <option value="elss">ELSS - Tax Saver (12%)</option>
                </select>
              </div>
              
              {/* Index Fund Toggle */}
              <div style={{ marginTop: '1rem' }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isIndexFund}
                    onChange={(e) => {
                      setIsIndexFund(e.target.checked);
                      const category = fundCategories[fundCategory];
                      setExpenseRatio(e.target.checked ? (fundCategory === 'equity' ? 0.3 : 0.2) : category.expenseRatio);
                    }}
                  />
                  <span className="checkmark"></span>
                  Index Fund (Low-cost passive investing)
                  <InfoTooltip content="Index funds track market indices with minimal expenses (0.1-0.5% vs 1-2.5% for active funds)" />
                </label>
              </div>
              
              {/* Hybrid Fund Type */}
              {fundCategory === 'hybrid' && (
                <div style={{ marginTop: '1rem' }}>
                  <label>
                    Hybrid Fund Type
                    <InfoTooltip content="Equity-oriented: >65% equity allocation. Debt-oriented: >65% debt allocation" />
                  </label>
                  <select
                    value={hybridType}
                    onChange={(e) => setHybridType(e.target.value)}
                    className="select-input"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <option value="equity-oriented">Equity-Oriented (65%+ Equity)</option>
                    <option value="debt-oriented">Debt-Oriented (65%+ Debt)</option>
                  </select>
                </div>
              )}
              
              {/* ELSS Lock-in Warning */}
              {fundCategory === 'elss' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#fef3c7', 
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  color: '#92400e'
                }}>
                  ⚠️ <strong>ELSS Lock-in:</strong> 3-year mandatory lock-in period. No partial withdrawals allowed.
                </div>
              )}
            </div>

            {/* Expense Ratio */}
            <div className="slider-group">
              <div className="slider-header">
                <label>
                  Expense Ratio
                  <InfoTooltip content="Annual fund management fee that reduces your returns" />
                </label>
                <input
                  type="text"
                  value={`${expenseRatio}%`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[%\s]/g, '');
                    if (val === '') {
                      setExpenseRatio('');
                      return;
                    }
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 0 && num <= 5) {
                      setExpenseRatio(num);
                    }
                  }}
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={expenseRatio}
                onChange={(e) => setExpenseRatio(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>0.1%</span>
                <span>3%</span>
              </div>
            </div>

            {/* Step-up SIP */}
            <div className="slider-group">
              <div className="slider-header">
                <label>
                  Annual Step-up Rate
                  <InfoTooltip content="Increase your SIP amount annually to beat inflation and accelerate wealth creation" />
                </label>
                <input
                  type="text"
                  value={`${stepUpRate}%`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[%\s]/g, '');
                    if (val === '') {
                      setStepUpRate('');
                      return;
                    }
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 0 && num <= 25) {
                      setStepUpRate(num);
                    }
                  }}
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={stepUpRate}
                onChange={(e) => setStepUpRate(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>0%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="slider-group">
              <div className="slider-header">
                <label>
                  Inflation Rate
                  <InfoTooltip content="Expected annual inflation to calculate real purchasing power of your returns" />
                </label>
                <input
                  type="text"
                  value={`${inflationRate}%`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[%\s]/g, '');
                    if (val === '') {
                      setInflationRate('');
                      return;
                    }
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 2 && num <= 12) {
                      setInflationRate(num);
                    }
                  }}
                  className="input-display"
                />
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>2%</span>
                <span>12%</span>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="toggle-options" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showInflationAdjusted}
                  onChange={(e) => setShowInflationAdjusted(e.target.checked)}
                />
                <span className="checkmark"></span>
                Show Inflation-Adjusted Returns
                <InfoTooltip content="View real purchasing power of your returns after adjusting for inflation" />
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={taxOptimized}
                  onChange={(e) => setTaxOptimized(e.target.checked)}
                />
                <span className="checkmark"></span>
                Include Tax Calculations
                <InfoTooltip content="Calculate LTCG/STCG tax impact based on fund category and holding period" />
              </label>
              
              {/* Tax Slab Selector for Debt Funds */}
              {taxOptimized && (fundCategory === 'debt' || fundCategory === 'hybrid') && (
                <div style={{ marginTop: '1rem', marginLeft: '2rem' }}>
                  <label>
                    Your Income Tax Slab
                    <InfoTooltip content="Debt fund gains are taxed as per your income tax slab (post-April 2023 rules)" />
                  </label>
                  <select
                    value={taxSlab}
                    onChange={(e) => setTaxSlab(parseInt(e.target.value))}
                    className="select-input"
                    style={{ marginTop: '0.5rem', width: '200px' }}
                  >
                    <option value={5}>5% (Income up to ₹3L)</option>
                    <option value={20}>20% (Income ₹3-7L)</option>
                    <option value={30}>30% (Income ₹7L+)</option>
                  </select>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    marginTop: '0.5rem'
                  }}>
                    💡 Tax laws subject to change. Assumptions based on current regulations.
                  </div>
                </div>
              )}

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={goalMode}
                  onChange={(e) => setGoalMode(e.target.checked)}
                />
                <span className="checkmark"></span>
                Goal-based Planning
                <InfoTooltip content="Calculate required SIP amount to reach a specific financial goal" />
              </label>
            </div>

            {/* Goal Mode - Target Amount */}
            {goalMode && (
              <div className="slider-group" style={{ marginTop: '1rem' }}>
                <div className="slider-header">
                  <label>
                    Target Amount
                    <InfoTooltip content="Your financial goal amount that you want to achieve" />
                  </label>
                  <input
                    type="text"
                    value={`₹${targetAmount.toLocaleString('en-IN')}`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[₹,\s]/g, '');
                      if (val === '') {
                        setTargetAmount('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setTargetAmount(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[₹,\s]/g, '');
                      const num = parseInt(val);
                      
                      if (val === '' || isNaN(num)) {
                        setTargetAmount(1000000);
                      } else if (num < 100000) {
                        setTargetAmount(100000);
                      } else if (num > 100000000) {
                        setTargetAmount(100000000);
                      } else {
                        setTargetAmount(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="100000"
                  max="100000000"
                  step="100000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹1L</span>
                  <span>₹10Cr</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="calculator-results">
            {goalMode ? (
              <>
                <h2>Goal-Based SIP Calculation</h2>
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">Required Monthly SIP</div>
                    <div className="result-value">{formatSmartCurrency(result.requiredSIP, 'INR')}</div>
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Target Amount</div>
                    <div className="result-value">{formatSmartCurrency(result.targetAmount, 'INR')}</div>
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Investment Duration</div>
                    <div className="result-value">{result.duration} Years</div>
                  </div>
                  
                  <div className="result-card">
                    <div className="result-label">Expected Return</div>
                    <div className="result-value">{result.expectedReturn}% p.a.</div>
                  </div>
                  
                  {stepUpRate > 0 && (
                    <div className="result-card">
                      <div className="result-label">Final SIP Amount</div>
                      <div className="result-value">{formatSmartCurrency(result.requiredSIP * Math.pow(1 + stepUpRate/100, result.duration), 'INR')}</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2>
                  {investmentMode === 'sip' ? 'Your SIP Breakdown' : 'Your Investment Breakdown'}
                  {result.mode === 'sip' && stepUpRate > 0 && ` (with ${stepUpRate}% Step-up)`}
                </h2>
                <div className="result-cards">
                  <div className="result-card highlight">
                    <div className="result-label">
                      {taxOptimized ? 'After-Tax Value' : 'Future Value'}
                      <InfoTooltip content={taxOptimized ? "Final value after deducting applicable taxes" : "Gross value before taxes"} />
                    </div>
                    <div className="result-value">{formatSmartCurrency(taxOptimized ? result.afterTaxValue : result.futureValue, 'INR')}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Total Invested</div>
                    <div className="result-value">{formatSmartCurrency(result.totalInvested, 'INR')}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">
                      {taxOptimized ? 'Net Returns' : 'Gross Returns'}
                      <InfoTooltip content={taxOptimized ? "Returns after deducting applicable taxes" : "Returns before taxes"} />
                    </div>
                    <div className="result-value">{formatSmartCurrency(taxOptimized ? result.netReturns : result.totalReturns, 'INR')}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">
                      CAGR
                      <InfoTooltip content="Compound Annual Growth Rate - your effective annual return" />
                    </div>
                    <div className="result-value">{result.cagr}%</div>
                  </div>

                  {taxOptimized && result.taxOnReturns > 0 && (
                    <div className="result-card">
                      <div className="result-label">
                        Tax on Returns
                        <InfoTooltip content="Applicable LTCG/STCG tax based on fund category and holding period" />
                      </div>
                      <div className="result-value">{formatSmartCurrency(result.taxOnReturns, 'INR')}</div>
                    </div>
                  )}

                  {showInflationAdjusted && (
                    <>
                      <div className="result-card">
                        <div className="result-label">
                          Real Value (Inflation Adjusted)
                          <InfoTooltip content={`Purchasing power of your returns adjusted for ${inflationRate}% inflation`} />
                        </div>
                        <div className="result-value">{formatSmartCurrency(result.realValue, 'INR')}</div>
                      </div>
                      
                      <div className="result-card">
                        <div className="result-label">
                          Real Returns
                          <InfoTooltip content="Returns adjusted for inflation - your actual wealth gain" />
                        </div>
                        <div className="result-value">{formatSmartCurrency(result.realReturns, 'INR')}</div>
                      </div>
                    </>
                  )}

                  {result.mode === 'sip' && result.finalSIP && stepUpRate > 0 && (
                    <div className="result-card">
                      <div className="result-label">
                        Final SIP Amount
                        <InfoTooltip content={`Your SIP amount in the last year after ${stepUpRate}% annual increase`} />
                      </div>
                      <div className="result-value">{formatSmartCurrency(result.finalSIP, 'INR')}</div>
                    </div>
                  )}
                </div>

                <div className="result-chart">
                  <div 
                    className="pie-chart" 
                    style={{
                      background: `conic-gradient(
                        #667eea 0% ${(result.totalInvested / (taxOptimized ? result.afterTaxValue : result.futureValue) * 100).toFixed(1)}%,
                        #10b981 ${(result.totalInvested / (taxOptimized ? result.afterTaxValue : result.futureValue) * 100).toFixed(1)}% 100%
                      )`
                    }}>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color principal"></span>
                      <span>Invested: {formatSmartCurrency(result.totalInvested, 'INR')}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color interest"></span>
                      <span>{taxOptimized ? 'Net Returns' : 'Returns'}: {formatSmartCurrency(taxOptimized ? result.netReturns : result.totalReturns, 'INR')}</span>
                    </div>
                  </div>
                </div>

                {/* Fund Category Information */}
                <div className="fund-info-section" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h3>Fund Category: {getFundCharacteristics(fundCategory).name}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <strong>Risk Level:</strong> {getFundCharacteristics(fundCategory).riskLevel}
                    </div>
                    <div>
                      <strong>Expected Return:</strong> {getFundCharacteristics(fundCategory).expectedReturn}
                    </div>
                    <div>
                      <strong>Tax Treatment:</strong> {getFundCharacteristics(fundCategory).taxTreatment}
                    </div>
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    {getFundCharacteristics(fundCategory).description}
                  </p>
                </div>
              </>
            )}

            {/* Export Button */}
            <div className="export-section" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                onClick={exportToCSV} 
                className="btn-export"
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                📊 Export Detailed Report (CSV)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="calculator-external-actions">
        <button onClick={handleReset} className="btn-reset">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset to Default
        </button>
      </div>

      {/* Enhanced Financial Disclaimer */}
      <div className="financial-disclaimer" style={{ 
        backgroundColor: '#fffbeb', 
        border: '2px solid #f59e0b', 
        borderRadius: '12px', 
        padding: '2rem', 
        margin: '2rem 0' 
      }}>
        <h3 style={{ color: '#d97706', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          ⚠️ Important Disclaimers & Risk Factors
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Investment Risks</h4>
            <p>• <strong>Market Risk:</strong> Mutual fund investments are subject to market fluctuations. Past performance does not guarantee future returns.</p>
            <p>• <strong>No Guaranteed Returns:</strong> The expected returns shown are estimates. Actual returns may vary significantly based on market conditions.</p>
            <p>• <strong>Principal Risk:</strong> There is no assurance that your investment objective will be achieved. You may lose part or all of your principal.</p>
          </div>
          
          <div>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Tax Implications (Updated Rules)</h4>
            <p>• <strong>Equity Fund LTCG:</strong> 10% on gains above ₹1 lakh per financial year (holding period > 1 year)</p>
            <p>• <strong>Equity Fund STCG:</strong> 15% on gains from investments held less than 1 year</p>
            <p>• <strong>Debt Fund Taxation:</strong> As per income tax slab rates for all gains (post-April 2023 rules)</p>
            <p>• <strong>ELSS Funds:</strong> 3-year mandatory lock-in + tax deduction benefits under Section 80C up to ₹1.5 lakh</p>
            <p>• <strong>Hybrid Funds:</strong> Pro-rata taxation based on equity vs debt allocation and fund type</p>
            <p>• <strong>Index Funds:</strong> Same tax treatment as underlying category but with lower expense burden</p>
            <p style={{ fontSize: '0.9rem', color: '#b45309', marginTop: '0.5rem' }}>
              💡 <strong>Important:</strong> Tax laws are subject to change. Current calculations based on regulations as of 2023-24.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Regulatory Compliance</h4>
            <p>• This calculator is for illustrative purposes only and should not be considered as investment advice</p>
            <p>• Consult with a SEBI registered investment advisor before making investment decisions</p>
            <p>• Read the Scheme Information Document (SID) and Key Information Memorandum (KIM) carefully</p>
            <p>• Ensure KYC compliance before investing</p>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#fef3c7', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#92400e' }}>
            💡 <strong>Professional Advice:</strong> Consider consulting with a certified financial planner for personalized investment strategy
          </p>
        </div>
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

        <div className="related-calculators">
          <h2>Related Financial Calculators</h2>
          <p>Explore our other calculators to plan your finances better:</p>
          <div className="calculator-grid">
            <Link to="/fd-calculator" className="calc-card">
              <h3>FD Calculator</h3>
              <p>Calculate fixed deposit maturity and interest</p>
            </Link>
            <Link to="/rd-calculator" className="calc-card">
              <h3>RD Calculator</h3>
              <p>Calculate recurring deposit returns</p>
            </Link>
            <Link to="/emi-calculator" className="calc-card">
              <h3>EMI Calculator</h3>
              <p>Calculate loan EMI and total interest</p>
            </Link>
            <Link to="/calculators/savings-goal" className="calc-card">
              <h3>Savings Goal Calculator</h3>
              <p>Plan monthly investment for your goals</p>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default SIPCalculator;
