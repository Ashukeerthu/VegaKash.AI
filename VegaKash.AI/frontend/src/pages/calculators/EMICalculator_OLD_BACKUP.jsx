import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatSmartCurrency } from '../../utils/helpers';
import { EnhancedSEO } from '../../components/EnhancedSEO';
import Breadcrumb from '../../components/Breadcrumb';
import InfoTooltip from '../../components/InfoTooltip';
import '../../styles/Calculator.css';
import '../../styles/EMICalculator.css';

/**
 * EMI Calculator Component - GLOBAL & COUNTRY-SPECIFIC
 * Calculates Equated Monthly Installment for loans with proper SEO
 */
function EMICalculator() {
  const { country } = useParams(); // From URL if available
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'EMI Calculator', path: '/calculators/emi' }
  ];

  // Main EMI Calculation with Advanced Features
  const calculateEMI = useCallback(() => {
      let P = parseFloat(loanAmount);
      const annualRate = parseFloat(interestRate);
      const years = parseFloat(tenure);
    
      if (!P || !annualRate || !years || P <= 0 || annualRate < 0 || years <= 0) return;
    
      if (interestMethod === 'flat') {
        const flatInterest = P * (annualRate / 100) * years;
        const totalAmount = P + flatInterest;
        const n = years * 12;
        const emi = totalAmount / n;
        const totalInterest = flatInterest;
        const effectiveRate = flatToEffectiveRate(annualRate / 100, years) * 100;
      
        setResult({
          mode: 'emi',
          emi: emi.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          principal: P.toFixed(2),
          interestMethod: 'flat',
          effectiveRate: effectiveRate.toFixed(2),
          loanType: loanType,
          totalMonths: Math.ceil(n),
          prepaymentSavings: 0,
          prepaymentPenaltyCost: 0,
          adjustedEmi: emi.toFixed(2),
          adjustedMonths: Math.ceil(n)
        });
        return;
      }

      const r = annualRate / 12 / 100;
      const n = years * 12;
      const baseEmi = calculateEMIValue(P, r, n);

      let effectiveEmi = baseEmi;
      let effectiveMonths = n;
      let balance = P;
      let totalPaid = 0;
      let interestPaid = 0;
      let prepaymentPenaltyCost = 0;
      let prepaymentMonthApplied = null;

      if (prepaymentEnabled && prepaymentAmount > 0 && prepaymentYear > 0 && prepaymentYear <= years) {
        const prepayMonths = prepaymentYear * 12;
        prepaymentMonthApplied = prepayMonths;

        for (let month = 1; month <= prepayMonths; month++) {
          const interest = balance * r;
          const principal = Math.min(effectiveEmi - interest, balance);
          balance -= principal;
          totalPaid += effectiveEmi;
          interestPaid += interest;
        }

        prepaymentPenaltyCost = prepaymentAmount * (prepaymentPenalty / 100);
        const effectivePrepayment = prepaymentAmount + prepaymentPenaltyCost;
        balance = Math.max(0, balance - prepaymentAmount);
        totalPaid += effectivePrepayment;

        if (balance <= 0) {
          const totalAmount = totalPaid;
          const totalInterest = interestPaid;
          setResult({
            mode: 'emi',
            emi: 0,
            adjustedEmi: 0,
            baseEmi: baseEmi.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            principal: P.toFixed(2),
            interestMethod: 'reducing',
            loanType: loanType,
            totalMonths: Math.ceil(n),
            adjustedMonths: prepayMonths,
            prepaymentSavings: Math.max(0, (baseEmi * n - totalAmount)).toFixed(2),
            prepaymentPenaltyCost: prepaymentPenaltyCost.toFixed(2),
            prepaymentMonthApplied
          });
          return;
        }

        if (loanType === 'floating-tenure' || prepaymentOption === 'tenure') {
          const remainingTenure = calculateTenureFromEmi(effectiveEmi, balance, r);
          const remainingMonths = Math.max(1, Math.ceil(remainingTenure));
          effectiveMonths = prepayMonths + remainingMonths;
          const totalAmount = totalPaid + (effectiveEmi * remainingMonths);
          const totalInterest = totalAmount - P;
          setResult({
            mode: 'emi',
            emi: effectiveEmi.toFixed(2),
            adjustedEmi: effectiveEmi.toFixed(2),
            baseEmi: baseEmi.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            principal: P.toFixed(2),
            interestMethod: 'reducing',
            loanType: loanType,
            totalMonths: Math.ceil(n),
            adjustedMonths: Math.ceil(effectiveMonths),
            prepaymentSavings: Math.max(0, (baseEmi * n - totalAmount)).toFixed(2),
            prepaymentPenaltyCost: prepaymentPenaltyCost.toFixed(2),
            prepaymentMonthApplied
          });
          return;
        }

        const remainingMonths = Math.max(1, Math.ceil(n - prepayMonths));
        effectiveEmi = calculateEMIValue(balance, r, remainingMonths);
        effectiveMonths = prepayMonths + remainingMonths;
        const totalAmount = totalPaid + (effectiveEmi * remainingMonths);
        const totalInterest = totalAmount - P;
        setResult({
          mode: 'emi',
          emi: effectiveEmi.toFixed(2),
          adjustedEmi: effectiveEmi.toFixed(2),
          baseEmi: baseEmi.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          principal: P.toFixed(2),
          interestMethod: 'reducing',
          loanType: loanType,
          totalMonths: Math.ceil(n),
          adjustedMonths: Math.ceil(effectiveMonths),
          prepaymentSavings: Math.max(0, (baseEmi * n - totalAmount)).toFixed(2),
          prepaymentPenaltyCost: prepaymentPenaltyCost.toFixed(2),
          prepaymentMonthApplied
        });
        return;
      }

      const totalAmount = effectiveEmi * effectiveMonths;
      const totalInterest = totalAmount - P;
      setResult({
        mode: 'emi',
        emi: effectiveEmi.toFixed(2),
        adjustedEmi: effectiveEmi.toFixed(2),
        baseEmi: baseEmi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        principal: P.toFixed(2),
        interestMethod: 'reducing',
        loanType: loanType,
        totalMonths: Math.ceil(n),
        adjustedMonths: Math.ceil(effectiveMonths),
        prepaymentSavings: prepaymentEnabled ? Math.max(0, (baseEmi * n - totalAmount)).toFixed(2) : 0,
        prepaymentPenaltyCost: prepaymentPenaltyCost.toFixed(2),
        prepaymentMonthApplied
      });
  }, [loanAmount, interestRate, tenure, interestMethod, loanType, prepaymentEnabled, prepaymentAmount, prepaymentYear, prepaymentOption, prepaymentPenalty, calculateEMIValue, calculateTenureFromEmi, flatToEffectiveRate]);

  // Eligibility Calculator
  const calculateEligibility = useCallback(() => {
    const income = parseFloat(monthlyIncome);
    const existingObligations = parseFloat(existingEMI);
    const foirPercent = parseFloat(foir) / 100;
    const rate = parseFloat(interestRate) / 12 / 100;
    const months = parseFloat(tenure) * 12;
    
    if (!income || income <= 0) return;
    
    const maxEmiFoir = (income * foirPercent) - existingObligations;
    const minDisposable = 15000; // simple floor often seen in underwriting
    const disposableIncome = income - existingObligations - maxEmiFoir;
    const baseMaxEmi = Math.max(0, maxEmiFoir);
    
    if (baseMaxEmi <= 0 || disposableIncome < minDisposable) {
      setResult({
        mode: 'eligibility',
        eligible: false,
        maxEMI: 0,
        maxLoanAmount: 0,
        message: disposableIncome < minDisposable
          ? 'Disposable income below bank minimum threshold.'
          : 'Existing EMI is too high. Reduce obligations to become eligible.'
      });
      return;
    }
    
    const maxLoan = baseMaxEmi * ((Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months)));
    const propertyValue = maxLoan / 0.8;
    const ltv = maxLoan / propertyValue;
    const meetsLtv = ltv <= 0.8;
    const salaryToLoanRatio = maxLoan / (income * 12);
    const meetsSalaryRatio = salaryToLoanRatio <= 6;
    
    setResult({
      mode: 'eligibility',
      eligible: meetsLtv && meetsSalaryRatio,
      maxEMI: baseMaxEmi.toFixed(2),
      maxLoanAmount: maxLoan.toFixed(2),
      recommendedDownPayment: (maxLoan * 0.2).toFixed(2),
      propertyValue: propertyValue.toFixed(2),
      ltv: ltv.toFixed(2),
      salaryToLoanRatio: salaryToLoanRatio.toFixed(2),
      message: meetsLtv && meetsSalaryRatio
        ? `You are eligible for a loan up to ${formatSmartCurrency(maxLoan)}`
        : 'Eligibility limited due to LTV or salary-to-loan ratio.'
    });
  }, [monthlyIncome, existingEMI, foir, interestRate, tenure]);

  // Balance Transfer Calculator
  const calculateBalanceTransfer = useCallback(() => {
    const outstanding = parseFloat(currentOutstanding);
    const currentR = parseFloat(currentRate) / 12 / 100;
    const newR = parseFloat(newRate) / 12 / 100;
    const months = parseFloat(remainingTenure) * 12;
    const fees = parseFloat(processingFee);
    const exitPenalty = outstanding * 0.01; // default 1% closure charge
    const stampDuty = outstanding * 0.002; // nominal state charges
    
    if (!outstanding || outstanding <= 0 || months <= 0) return;
    
    // Current EMI
    const currentEMI = calculateEMIValue(outstanding, currentR, months);
    const currentTotal = currentEMI * months;
    
    // New EMI after transfer
    const newEMI = calculateEMIValue(outstanding, newR, months);
    const switchingCharges = fees + exitPenalty + stampDuty;
    const newTotal = (newEMI * months) + switchingCharges;
    
    // Savings
    const savings = currentTotal - newTotal;
    const monthlySavings = currentEMI - newEMI;
    const breakevenMonths = switchingCharges / Math.max(monthlySavings, 1e-6);
    
    setResult({
      mode: 'balance-transfer',
      currentEMI: currentEMI.toFixed(2),
      newEMI: newEMI.toFixed(2),
      monthlySavings: monthlySavings.toFixed(2),
      totalSavings: savings.toFixed(2),
      breakevenMonths: Math.ceil(breakevenMonths),
      worthIt: savings > 0,
      processingFee: fees.toFixed(2),
      switchingCharges: switchingCharges.toFixed(2),
      exitPenalty: exitPenalty.toFixed(2),
      stampDuty: stampDuty.toFixed(2)
    });
  }, [currentOutstanding, currentRate, newRate, remainingTenure, processingFee, calculateEMIValue]);

  // Optimized Amortization Schedule (memoized to prevent recalculation)
  const amortizationSchedule = useMemo(() => {
    if (calculatorMode !== 'emi' || !result || !result.adjustedEmi) return [];

    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const emiValue = parseFloat(result.adjustedEmi);
    const totalMonths = result.adjustedMonths || result.totalMonths || (tenure * 12);
    const prepayMonth = result.prepaymentMonthApplied || (prepaymentEnabled ? prepaymentYear * 12 : -1);
    const prepayAmt = prepaymentEnabled ? parseFloat(prepaymentAmount) : 0;

    let balance = P;
    const schedule = [];

    for (let month = 1; month <= totalMonths; month++) {
      if (balance <= 0) break;

      const interestPayment = balance * r;
      let principalPayment = Math.min(emiValue - interestPayment, balance);

      if (month === prepayMonth && prepayAmt > 0) {
        principalPayment += prepayAmt;
      }

      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        year: Math.ceil(month / 12),
        emi: emiValue,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance,
        isPrepaymentMonth: month === prepayMonth
      });
    }

    return schedule;
  }, [calculatorMode, loanAmount, interestRate, tenure, prepaymentEnabled, prepaymentAmount, prepaymentYear, result?.adjustedEmi, result?.adjustedMonths, result?.prepaymentMonthApplied]);

  // Quick value setters (Indian banking standards)
  const setQuickAmount = (amount) => setLoanAmount(amount);
  const setQuickRate = (rate) => setInterestRate(rate);
  const setQuickTenure = (years) => setTenure(years);
  const formatQuickAmountLabel = (amt) => (amt >= 10000000 ? `₹${(amt / 10000000).toFixed(0)}Cr` : `₹${(amt / 100000).toFixed(0)}L`);

  const handleReset = () => {
    setLoanAmount(2500000);
    setInterestRate(8.5);
    setTenure(20);
    setLoanType('fixed');
    setInterestMethod('reducing');
    setPrepaymentEnabled(false);
    setPrepaymentAmount(100000);
    setPrepaymentYear(5);
    setPrepaymentOption('tenure');
    setPrepaymentPenalty(0);
    setCalculatorMode('emi');
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

  const exportScheduleToCsv = useCallback(() => {
    if (!amortizationSchedule.length) return;
    const headers = ['Month', 'EMI', 'Principal', 'Interest', 'Balance', 'Prepayment'];
    const rows = amortizationSchedule.map((row) => [
      row.month,
      row.emi.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.balance.toFixed(2),
      row.isPrepaymentMonth ? 'Yes' : 'No'
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emi-amortization.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [amortizationSchedule]);

  const exportScheduleToExcel = useCallback(() => {
    exportScheduleToCsv();
  }, [exportScheduleToCsv]);

  const printSchedule = useCallback(() => {
    window.print();
  }, []);

  // SEO configuration for global/country-specific versions
  const seoConfig = {
    title: country 
      ? `EMI Calculator for ${country.toUpperCase()}`
      : 'EMI Calculator - Free Equated Monthly Installment Calculator',
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

  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'LoanOrCreditCalculator',
    name: seoConfig.title,
    description: seoConfig.description,
    provider: { '@type': 'Organization', name: 'VegaKash.AI' },
    inLanguage: 'en',
    offers: { '@type': 'Offer', availability: 'https://schema.org/InStock' },
    applicationCategory: 'FinanceApplication',
    variablesMeasured: ['Monthly EMI', 'Total Interest', 'Total Amount'],
    potentialAction: {
      '@type': 'Action',
      name: 'Calculate EMI',
      target: seoConfig.isGlobal ? 'https://vegakash.ai/calculators/emi' : undefined
    },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is EMI calculated?',
          acceptedAnswer: { '@type': 'Answer', text: 'EMI = P * r * (1+r)^n / ((1+r)^n - 1) where P is principal, r is monthly rate, and n is total months.' }
        },
        {
          '@type': 'Question',
          name: 'Can I reduce my EMI?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, by making part-prepayments or extending tenure. Floating loans often adjust tenure first.' }
        }
      ]
    }
  }), [seoConfig.title, seoConfig.description, seoConfig.isGlobal]);

  return (
    <>
      {/* SEO Tags - Global & Country-Specific */}
      <EnhancedSEO {...seoConfig} />
      
      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="calculator-header">
          <h1>{country ? `EMI Calculator (${country.toUpperCase()})` : 'EMI Calculator'}</h1>
          <p>Calculate your Equated Monthly Installment for home loans, car loans, personal loans</p>
        </div>

        <div className="calculator-content">
        <div className="calculator-inputs">
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
            <div className="quick-buttons">
              {[1000000, 2500000, 5000000, 10000000].map((amt) => (
                <button key={amt} type="button" onClick={() => setQuickAmount(amt)}>
                  {formatQuickAmountLabel(amt)}
                </button>
              ))}
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
            <div className="quick-buttons">
              {[8, 8.5, 9, 10].map((rate) => (
                <button key={rate} type="button" onClick={() => setQuickRate(rate)}>
                  {rate}%
                </button>
              ))}
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
                  } else if (num > 40) {
                    setTenure(40);
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
              max="40"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>1 Yr</span>
              <span>40 Yrs</span>
            </div>
            <div className="quick-buttons">
              {[10, 15, 20, 30, 40].map((yr) => (
                <button key={yr} type="button" onClick={() => setQuickTenure(yr)}>
                  {yr}Y
                </button>
              ))}
            </div>
          </div>

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
          <div className="calculator-results" style={{ position: 'sticky', top: '1rem', alignSelf: 'flex-start', zIndex: 1 }}>
            <h2>Your Loan Breakdown</h2>
            <div className="result-cards">
              <div className="result-card highlight">
                <div className="result-label">Monthly EMI</div>
                <div className={`result-value ${String(result.emi).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.emi)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Principal Amount</div>
                <div className={`result-value ${String(result.principal).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(result.principal)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Interest</div>
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
            </div>

            {prepaymentEnabled && (
              <div className="result-cards" style={{ marginTop: '1rem' }}>
                <div className="result-card">
                  <div className="result-label">Interest Saved</div>
                  <div className="result-value">{formatSmartCurrency(result.prepaymentSavings || 0)}</div>
                </div>
                <div className="result-card">
                  <div className="result-label">Time Saved</div>
                  <div className="result-value">{result.adjustedMonths ? `${Math.max(0, Math.round((result.totalMonths || tenure * 12) - result.adjustedMonths))} months` : 'N/A'}</div>
                </div>
                <div className="result-card">
                  <div className="result-label">Penalty Cost</div>
                  <div className="result-value">{formatSmartCurrency(result.prepaymentPenaltyCost || 0)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="amortization-section">
            <h3>Loan Amortization Schedule</h3>
            <div className="amortization-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <button type="button" onClick={exportScheduleToCsv}>Export CSV</button>
              <button type="button" onClick={exportScheduleToExcel}>Export Excel</button>
              <button type="button" onClick={printSchedule}>Print / PDF</button>
            </div>
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
                  {(amortizationView === 'yearly'
                    ? Object.values(
                        amortizationSchedule.reduce((acc, row) => {
                          const key = row.year;
                          if (!acc[key]) {
                            acc[key] = {
                              year: row.year,
                              principal: 0,
                              interest: 0,
                              balance: row.balance,
                            };
                          }
                          acc[key].principal += row.principal;
                          acc[key].interest += row.interest;
                          acc[key].balance = row.balance;
                          return acc;
                        }, {})
                      )
                    : amortizationSchedule
                  ).map((row, idx) => (
                    <tr key={`${amortizationView}-${idx}`}>
                      <td>{amortizationView === 'yearly' ? row.year : row.month}</td>
                      {amortizationView === 'monthly' && <td>₹{Math.round(row.emi).toLocaleString('en-IN')}</td>}
                      <td>₹{Math.round(row.principal).toLocaleString('en-IN')}</td>
                      <td>₹{Math.round(row.interest).toLocaleString('en-IN')}</td>
                      <td>₹{Math.round(row.balance).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
