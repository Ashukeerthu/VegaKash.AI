import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { computeEmi, simulatePrepayment, shockRate } from '../../utils/emiEngine';
import { exportEMIPDF } from '../../utils/pdfExport';
import { useParams, Link } from 'react-router-dom';
import { formatSmartCurrency } from '../../utils/helpers';
import { EnhancedSEO } from '../../components/EnhancedSEO';
import Breadcrumb from '../../components/Breadcrumb';
import Tooltip from '../../components/Tooltip';
import ScrollToTop from '../../modules/core/ui/ScrollToTop';
import '../../styles/Calculator.css';

// Loan type presets configuration
const LOAN_PRESETS = {
  home: { rate: [7, 12], tenure: [10, 30], amount: [1000000, 50000000] }, // ₹1L–₹5Cr
  car: { rate: [7, 12], tenure: [3, 7], amount: [100000, 3000000] }, // ₹1L–₹30L
  personal: { rate: [10, 24], tenure: [1, 5], amount: [10000, 5000000] }, // ₹10k–₹50L
  education: { rate: [7, 12], tenure: [5, 15], amount: [50000, 5000000] } // ₹50k–₹50L
};

// Default values - only add to URL if user changes these
const DEFAULTS = {
  amount: 1000000,
  rate: 8.5,
  tenure: 20,
  type: 'home'
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
  const qpType = params.get('type');
  
  // Track if loading from URL params (for UX feedback)
  const hasUrlParams = !!(qpAmount || qpRate || qpTenure || qpType);
  
  const [loanAmount, setLoanAmount] = useState(qpAmount ? Math.max(100000, Math.min(50000000, parseFloat(qpAmount))) : DEFAULTS.amount);
  const [interestRate, setInterestRate] = useState(qpRate ? Math.max(5, Math.min(20, parseFloat(qpRate))) : DEFAULTS.rate);
  const [tenure, setTenure] = useState(qpTenure ? Math.max(1, Math.min(30, parseFloat(qpTenure))) : DEFAULTS.tenure);
  // Result computed via useMemo below (cleaner than useState + useEffect)
  const [amountError, setAmountError] = useState('');
  const [amortizationView, setAmortizationView] = useState('yearly'); // 'yearly' or 'monthly'
  // Prepayment and strategy
  const [prepayMode, setPrepayMode] = useState('reduceTenure'); // 'reduceEmi' | 'reduceTenure'
  const [yearlyPrepay, setYearlyPrepay] = useState(0);
  const [prepayStartYear, setPrepayStartYear] = useState(1);
  // Floating rate shock
  const [shockDelta, setShockDelta] = useState(0);
  // Floating rate behavior: 'raiseEMI' (default) | 'extendTenure'
  const [floatingBehavior, setFloatingBehavior] = useState('raiseEMI');
  // Income indicator
  const [monthlyIncome, setMonthlyIncome] = useState('');
  // Loan type presets - Initialize from URL if valid, otherwise default to 'home'
  const [loanType, setLoanType] = useState(qpType && LOAN_PRESETS[qpType] ? qpType : 'home');
  const amountRange = LOAN_PRESETS[loanType]?.amount || [100000, 50000000];
  const rateRange = LOAN_PRESETS[loanType]?.rate || [5, 20];
  const tenureRange = LOAN_PRESETS[loanType]?.tenure || [1, 30];
  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Interest type: fixed vs floating
  const [interestType, setInterestType] = useState('fixed'); // 'fixed' | 'floating'
  
  // Reset floating behavior when switching to fixed interest type
  useEffect(() => {
    if (interestType === 'fixed') {
      setFloatingBehavior('raiseEMI');
    }
  }, [interestType]);
  // Moratorium period (for education/home loans)
  const [moratoriumMonths, setMoratoriumMonths] = useState(0);
  // Existing EMIs for FOIR calculation
  const [existingEmis, setExistingEmis] = useState('');
  
  // PDF Export options
  const [includeAmortization, setIncludeAmortization] = useState(false);
  const [includeAdvancedAnalysis, setIncludeAdvancedAnalysis] = useState(true);
  const pieChartRef = useRef(null);

  // Normalize inputs when loanType changes (prevents invalid shared URLs)
  React.useEffect(() => {
    const preset = LOAN_PRESETS[loanType];
    if (!preset) return;

    setLoanAmount(v => Math.min(Math.max(v, preset.amount[0]), preset.amount[1]));
    setInterestRate(v => Math.min(Math.max(v, preset.rate[0]), preset.rate[1]));
    setTenure(v => Math.min(Math.max(v, preset.tenure[0]), preset.tenure[1]));
  }, [loanType]);

  // Track if component has mounted (to avoid URL sync on initial load)
  const [hasMounted, setHasMounted] = React.useState(false);
  
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Sync URL with current values for shareable links (only after user interaction)
  React.useEffect(() => {
    if (!hasMounted) return; // Don't sync on initial mount

    // Check if current values match defaults
    const isDefault =
      loanAmount === DEFAULTS.amount &&
      Number(interestRate) === DEFAULTS.rate &&
      Number(tenure) === DEFAULTS.tenure &&
      loanType === DEFAULTS.type;

    if (isDefault) {
      // Keep URL clean when using default values
      window.history.replaceState({}, '', location.pathname);
      return;
    }

    // Only add params when values differ from defaults
    const params = new URLSearchParams();
    params.set('amount', Math.round(loanAmount));
    params.set('rate', parseFloat(interestRate).toFixed(1));
    params.set('tenure', Math.round(tenure));
    params.set('type', loanType);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  }, [loanAmount, interestRate, tenure, loanType, location.pathname, hasMounted]);

  // Compute EMI result - canonical payload to avoid drift across UI/PDF/shocks
  const emiCore = useMemo(() => {
    const P = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const years = parseFloat(tenure);
    if (!P || !rate || !years) return null;
    
    // Apply moratorium logic if applicable
    let adjustedPrincipal = P;
    let moratoriumInterest = 0;
    
    if (moratoriumMonths > 0) {
      // Calculate simple interest during moratorium (standard for Indian banks)
      const monthlyRate = rate / 100 / 12;
      moratoriumInterest = P * monthlyRate * moratoriumMonths;
      // Add accrued interest to principal
      adjustedPrincipal = P + moratoriumInterest;
    }
    
    const { emi, totalInterest, totalAmount } = computeEmi(adjustedPrincipal, rate, years);
    if (!emi) return null;
    
    return {
      // Base values
      emi,
      totalInterest,
      totalAmount,
      principal: adjustedPrincipal, // canonical principal for EMI math
      originalPrincipal: P,
      rate,
      tenureYears: years,
      // Moratorium tracking
      moratoriumInterest,
      adjustedPrincipal
    };
  }, [loanAmount, interestRate, tenure, moratoriumMonths]);

  // Maintain legacy name for downstream usages without additional recalculation
  const result = emiCore;

  // BUG FIX 1: Canonical interest percentage (UI + PDF must use this)
  const interestPercent = useMemo(() => {
    if (!result || !result.originalPrincipal) return 0;
    return (result.totalInterest / result.originalPrincipal) * 100;
  }, [result]);

  // Memoize prepayment simulation (used in both amortization and summary)
  const prepaySim = useMemo(() => {
    // Use canonical adjustedPrincipal to prevent drift
    const P = result?.adjustedPrincipal ?? parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const years = parseFloat(tenure);
    
    return simulatePrepayment(P, rate, years, yearlyPrepay, prepayStartYear, prepayMode);
  }, [result, interestRate, tenure, yearlyPrepay, prepayStartYear, prepayMode]);

  // Compute amortization rows OUTSIDE conditional render (Rules of Hooks)
  const amortizationRows = useMemo(() => {
    if (!result) return [];
    const P = result.adjustedPrincipal;
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

  const handleReset = () => {
    setLoanAmount(DEFAULTS.amount);
    setInterestRate(DEFAULTS.rate);
    setTenure(DEFAULTS.tenure);
    setLoanType(DEFAULTS.type);
    setShockDelta(0);
    setPrepayMode('reduceTenure');
    setYearlyPrepay(0);
    setPrepayStartYear(1);
    setMonthlyIncome('');
    setExistingEmis('');
    setMoratoriumMonths(0);
    setInterestType('fixed');
    // Explicitly clean URL on reset
    window.history.replaceState({}, '', location.pathname);
  }

  // Removed unused formatCurrency. Using formatSmartCurrency across UI.

  // SEO configuration for global/country-specific versions
  const seoConfig = {
    title: (country && country.toLowerCase() === 'in')
      ? 'EMI Calculator India (2025) – Calculate Loan EMI Instantly'
      : country 
        ? `EMI Calculator for ${country.toUpperCase()} – Calculate Loan EMI`
        : 'EMI Calculator India (2025) – Calculate Loan EMI Instantly',
    description: country
      ? `Calculate EMI for ${country.toUpperCase()} with our free EMI calculator. Get monthly payment, total interest, and amortization schedule.`
      : 'Free EMI calculator to calculate equated monthly installment for home loans, car loans, and personal loans. Get amortization breakdown.',
    keywords: country
      ? `EMI calculator ${country.toUpperCase()}, loan EMI, monthly payment calculator`
      : 'EMI calculator, equated monthly installment, loan calculator, EMI formula, monthly payment',
    tool: null, // Set to null to disable duplicate FAQPage from EnhancedSEO (we have consolidated FAQPage at line 314)
    country: country || undefined,
    supportedCountries: ['in', 'us', 'uk'],
    isGlobal: !country,
    canonical: `https://vegaktools.com${location.pathname}`,
  };

  const geoNote = country
    ? (country.toLowerCase() === 'in'
        ? 'Based on typical Indian bank interest rates (RBI-linked).'
        : country.toLowerCase() === 'us'
          ? 'Aligned with typical US mortgage and personal loan standards.'
          : `Adjust the interest rate for local lender offerings in ${country.toUpperCase()}.`)
    : 'Adjust the interest rate slider to match your lender offer.';

  return (
    <>
      {/* SEO Tags - Global & Country-Specific */}
      <EnhancedSEO {...seoConfig} />
      {/* JSON-LD Schema for FinancialProduct with Geo signals */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          name: (country && country.toLowerCase() === 'in') ? 'EMI Calculator India' : 'EMI Calculator',
          applicationCategory: 'FinanceApplication',
          areaServed: country && country.toLowerCase() === 'in' ? { "@type": "Country", "name": "India" } : undefined,
          offers: {
            "@type": "Offer",
            price: '0',
            priceCurrency: (country && country.toLowerCase() === 'us') ? 'USD' : (country && country.toLowerCase() === 'uk') ? 'GBP' : 'INR'
          }
        })}
      </script>
      {/* JSON-LD Schema for FAQPage - Consolidated (Single Schema - No Duplicates) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What does EMI stand for?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "EMI stands for Equated Monthly Installment. It's the fixed monthly payment made towards a loan. It includes both principal and interest and remains relatively constant over the loan tenure."
              }
            },
            {
              "@type": "Question",
              "name": "How is EMI calculated?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "EMI is calculated using the formula: EMI = P × [r(1+r)^n]/[(1+r)^n-1], where P is loan principal, r is monthly interest rate, and n is the number of months."
              }
            },
            {
              "@type": "Question",
              "name": "What's the difference between EMI and monthly loan payment?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "EMI and monthly loan payment mean the same thing. EMI is the term commonly used in India for fixed monthly loan payments, while Western countries may just call it 'monthly payment.'"
              }
            },
            {
              "@type": "Question",
              "name": "How can I reduce my EMI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can reduce your EMI by: increasing your down payment, extending the loan tenure (though this increases total interest), improving your credit score for better rates, or paying a lump sum amount."
              }
            },
            {
              "@type": "Question",
              "name": "What is a good EMI to income ratio?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Financial experts recommend that your total EMI obligations should not exceed 40-50% of your monthly income. This ensures you have sufficient funds for other expenses and savings. For example, if your monthly income is ₹1,00,000, your total EMIs should ideally be below ₹40,000-50,000."
              }
            },
            {
              "@type": "Question",
              "name": "Can I prepay my loan to reduce EMI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, most loans allow part-prepayments. You can either reduce your EMI amount while keeping tenure same, or reduce tenure while keeping EMI same. Most lenders don't charge prepayment penalties on floating rate home loans. However, check your loan agreement for any applicable charges."
              }
            },
            {
              "@type": "Question",
              "name": "Is EMI amount fixed throughout the loan tenure?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For fixed-rate loans, EMI remains constant. However, for floating-rate loans (most common in India), EMI can change when the lender revises interest rates based on RBI's repo rate or other external benchmarks. Some lenders adjust tenure instead of EMI amount."
              }
            },
            {
              "@type": "Question",
              "name": "Can I change my loan tenure after taking the loan?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, many lenders allow you to increase or decrease your loan tenure through restructuring or part-prepayment options. Extending tenure will reduce your EMI but increase total interest. Shortening tenure will increase EMI but save on interest. Contact your lender to understand the process and any applicable charges."
              }
            },
            {
              "@type": "Question",
              "name": "What happens if I miss an EMI payment?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Missing EMI payments can have serious consequences: (1) Late payment charges and penalties, (2) Negative impact on your credit score, (3) Additional interest on unpaid amount, (4) Legal action or asset seizure in extreme cases. Always prioritize EMI payments or contact your lender immediately if facing financial difficulties."
              }
            },
            {
              "@type": "Question",
              "name": "How does CIBIL score affect my EMI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Your CIBIL score doesn't directly affect EMI amount, but it significantly impacts the interest rate offered by lenders. A higher score (750+) makes you eligible for lower interest rates, which in turn reduces your EMI. For example, a score above 750 might get you 8.5% interest, while a score of 650 might result in 10% interest on the same loan."
              }
            }
          ]
        })}
      </script>
      {/* JSON-LD Schema for Calculator intent */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: 'EMI Calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          offers: {
            "@type": "Offer",
            price: '0',
            priceCurrency: (country && country.toLowerCase() === 'us') ? 'USD' : (country && country.toLowerCase() === 'uk') ? 'GBP' : 'INR'
          },
          featureList: [
            'EMI calculation',
            'Moratorium handling',
            'Prepayment impact',
            'Amortization schedule',
            'Interest rate shock analysis'
          ]
        })}
      </script>
      
      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="calculator-header">
          <h1>
            {country && country.toLowerCase() === 'in'
              ? 'EMI Calculator – Calculate Home Loan, Car Loan & Personal Loan EMI'
              : country
                ? `EMI Calculator in ${country.toUpperCase()} – Loan EMI Calculator`
                : 'EMI Calculator – Calculate Home Loan, Car Loan & Personal Loan EMI'}
          </h1>
          <p>Calculate your Equated Monthly Installment with prepayment impact, EMI safety check, and interest rate shock analysis</p>
        </div>

        {/* Answer Block 1: What is EMI - Early visibility for Google */}
        <div className="answer-block primary-block">
          <h2>What is EMI (Equated Monthly Installment)?</h2>
          <p>
            EMI (Equated Monthly Installment) is the fixed monthly payment you make towards a loan. It includes both principal (the amount you borrowed) and interest (the cost of borrowing). EMI remains relatively constant throughout the loan tenure, making it easier to budget and plan your finances.
          </p>
        </div>

        {/* Answer Block 2: Common EMI Examples - High-intent featured snippet queries */}
        <div className="answer-block examples-block">
          <h3>Common EMI Examples in India</h3>
          <p><strong>Quick reference for typical loans:</strong></p>
          <ul className="examples-list">
            <li><strong>₹10 lakh home loan</strong> for 20 years at 8.5% → EMI ₹8,678</li>
            <li><strong>₹30 lakh home loan</strong> for 20 years at 8.5% → EMI ₹26,034</li>
            <li><strong>₹5 lakh car loan</strong> for 5 years at 9% → EMI ₹10,378</li>
            <li><strong>₹20 lakh personal loan</strong> for 5 years at 15% → EMI ₹47,210</li>
          </ul>
        </div>

        {/* Short Plain Answer for AEO */}
        <div className="answer-block concise-block">
          <p>
            <strong>EMI depends on three factors:</strong> loan amount, interest rate, and loan tenure. Increasing tenure lowers EMI but increases total interest paid.
          </p>
        </div>

        {/* Geo Trust Signal - Builds local authority */}
        {geoNote && (
          <p className="geo-trust">✓ {geoNote}</p>
        )}

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
                    if (num < amountRange[0] || num > amountRange[1]) {
                      setAmountError(`For ${loanType} loans, amount must be between ₹${amountRange[0].toLocaleString('en-IN')} and ₹${amountRange[1].toLocaleString('en-IN')}.`);
                    } else {
                      setAmountError('');
                    }
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.replace(/[₹,\s]/g, '');
                  const num = parseInt(val);
                  
                  if (val === '' || isNaN(num)) {
                    setLoanAmount(Math.max(amountRange[0], Math.min(amountRange[1], 1000000)));
                    setAmountError('');
                  } else if (num < amountRange[0]) {
                    setLoanAmount(amountRange[0]);
                    setAmountError('');
                  } else if (num > amountRange[1]) {
                    setLoanAmount(amountRange[1]);
                    setAmountError('');
                  } else {
                    setLoanAmount(num);
                    setAmountError('');
                  }
                }}
                className="input-display"
              />
            </div>
            <input
              type="range"
              min={amountRange[0]}
              max={amountRange[1]}
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>₹{amountRange[0].toLocaleString('en-IN')}</span>
              <span>₹{amountRange[1].toLocaleString('en-IN')}</span>
            </div>
            {amountError && (
              <div className="inline-error">
                {amountError} <span className="help-tip">Tip: Personal loan limits vary; high-value cases are rare.</span>
              </div>
            )}
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
              min={rateRange[0]}
              max={rateRange[1]}
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
              min={tenureRange[0]}
              max={tenureRange[1]}
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
                  setLoanAmount(Math.min(Math.max(loanAmount, preset.amount[0]), preset.amount[1]));
                  setAmountError('');
                }}
              >
                <option value="home">Home Loan</option>
                <option value="car">Car Loan</option>
                <option value="personal">Personal Loan</option>
                <option value="education">Education Loan</option>
              </select>
            </div>
          </div>

          {/* Interest Type Toggle */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Interest Type</label>
              <div className="toggle-row">
                <button 
                  className={`tab-btn ${interestType === 'fixed' ? 'active' : ''}`} 
                  onClick={() => setInterestType('fixed')}
                >
                  Fixed Rate
                </button>
                <button 
                  className={`tab-btn ${interestType === 'floating' ? 'active' : ''}`} 
                  onClick={() => setInterestType('floating')}
                >
                  Floating (Repo-linked)
                </button>
              </div>
            </div>
            {interestType === 'floating' && (
              <p className="info-text">ⓘ Floating rate EMI may change when your lender revises the repo-linked rate. Some lenders extend tenure instead of increasing EMI.</p>
            )}
          </div>
          </div>{/* End inputs-grid */}

          {/* Advanced Options Toggle */}
          <div className="advanced-toggle-row">
            <button 
              className="btn-secondary btn-compact" 
              onClick={()=>setShowAdvanced(!showAdvanced)}
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
                  if (v === '') {
                    setMonthlyIncome('');
                    return;
                  }
                  const num = parseInt(v);
                  if (!isNaN(num) && num >= 0 && num <= 10000000) {
                    setMonthlyIncome(v);
                  }
                }}
                onBlur={(e)=>{
                  const v=e.target.value.replace(/[₹,\s]/g,'');
                  const num = parseInt(v);
                  if (v === '' || isNaN(num)) {
                    setMonthlyIncome('');
                  } else if (num < 0) {
                    setMonthlyIncome('0');
                  } else if (num > 10000000) {
                    setMonthlyIncome('10000000');
                  }
                }}
                placeholder="e.g., ₹1,00,000"
                className="input-display"
              />
            </div>
            {monthlyIncome && (
              <>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="10000"
                  value={monthlyIncome || 0}
                  onChange={(e)=>setMonthlyIncome(e.target.value)}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹0</span>
                  <span>₹1 Cr</span>
                </div>
              </>
            )}
          </div>

          {/* Existing Monthly EMIs - for FOIR calculation */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Existing Monthly EMIs (INR)</label>
              <input
                type="text"
                value={existingEmis ? `₹${parseInt(existingEmis).toLocaleString('en-IN')}` : ''}
                onChange={(e)=>{
                  const v=e.target.value.replace(/[₹,\s]/g,'');
                  if (v === '') {
                    setExistingEmis('');
                    return;
                  }
                  const num = parseInt(v);
                  if (!isNaN(num) && num >= 0 && num <= 5000000) {
                    setExistingEmis(v);
                  }
                }}
                onBlur={(e)=>{
                  const v=e.target.value.replace(/[₹,\s]/g,'');
                  const num = parseInt(v);
                  if (v === '' || isNaN(num)) {
                    setExistingEmis('');
                  } else if (num < 0) {
                    setExistingEmis('0');
                  } else if (num > 5000000) {
                    setExistingEmis('5000000');
                  }
                }}
                placeholder="e.g., ₹25,000"
                className="input-display"
              />
            </div>
            {existingEmis && (
              <>
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="5000"
                  value={existingEmis || 0}
                  onChange={(e)=>setExistingEmis(e.target.value)}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹0</span>
                  <span>₹50 Lakh</span>
                </div>
              </>
            )}
            <p className="info-text">ⓘ Banks use FOIR (Fixed Obligation to Income Ratio) to determine eligibility. This includes all your existing loan EMIs.</p>
          </div>

          {/* Moratorium Period - for education/home loans */}
          {(loanType === 'education' || loanType === 'home') && (
            <div className="slider-group">
              <div className="slider-header">
                <label>Moratorium Period (months)</label>
                <span className="input-value">{moratoriumMonths} months</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={moratoriumMonths}
                onChange={(e)=>setMoratoriumMonths(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-labels"><span>0 months</span><span>60 months</span></div>
              {moratoriumMonths > 0 && (
                <>
                  <p className="info-text">ⓘ EMI will start {moratoriumMonths} months from now. Interest accrues during this period and is added to principal.</p>
                  <p className="info-text" style={{color: '#10b981', marginTop: '0.5rem'}}>✓ Moratorium impact fully calculated using simple interest method (standard for Indian banks).</p>
                </>
              )}
            </div>
          )}

          {/* Prepayment Simulator */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Prepayment Simulator</label>
            </div>
            <div className="toggle-row">
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
            <div className="shock-row">
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
          <div className="reset-row">
            {hasUrlParams && (
              <div style={{
                fontSize: '11px',
                color: '#667eea',
                marginBottom: '8px',
                padding: '6px 10px',
                background: '#f0f4ff',
                borderRadius: '6px',
                border: '1px solid #d0dcff'
              }}>
                ℹ️ Values loaded from shared link. Click reset to use defaults.
              </div>
            )}
            <button onClick={handleReset} className={`btn-reset ${hasUrlParams ? 'highlight' : ''}`}>
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
                  <Tooltip text="Your fixed monthly payment including interest and principal. Rounded to nearest rupee as per bank standards.">ℹ️</Tooltip>
                </div>
                <div className={`result-value ${String(result.emi).length > 14 ? 'long' : ''}`}>{formatSmartCurrency(Math.round(parseFloat(result.emi)))}</div>
                <div className="emi-note">Banks round to ₹{Math.round(parseFloat(result.emi))}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Principal Amount</div>
                <div className={`result-value ${String(result.originalPrincipal || result.principal).length > 14 ? 'long' : ''}`}>
                  {formatSmartCurrency(result.originalPrincipal || result.principal)}
                </div>
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

            {/* Moratorium Impact Display */}
            {moratoriumMonths > 0 && result.moratoriumInterest && parseFloat(result.moratoriumInterest) > 0 && (
              <div className="prepay-impact-section" style={{marginTop: '1.5rem'}}>
                <h4>⏳ Moratorium Period Impact</h4>
                <div className="prepay-impact-grid">
                  <div className="impact-card">
                    <div className="impact-label">Original Principal</div>
                    <div className="impact-value">{formatSmartCurrency(result.originalPrincipal || result.principal)}</div>
                  </div>
                  <div className="impact-card">
                    <div className="impact-label">Interest During {moratoriumMonths} Months</div>
                    <div className="impact-value" style={{color: '#f59e0b'}}>+{formatSmartCurrency(result.moratoriumInterest)}</div>
                  </div>
                  <div className="impact-card">
                    <div className="impact-label">Adjusted Principal
                      <Tooltip text="Interest accrued during moratorium is added to your loan principal. Your EMI is calculated on this adjusted amount.">ℹ️</Tooltip>
                    </div>
                    <div className="impact-value highlight">{formatSmartCurrency(result.adjustedPrincipal)}</div>
                  </div>
                </div>
                <p className="info-text" style={{marginTop: '0.75rem', textAlign: 'center'}}>
                  ℹ️ Your EMI of {formatSmartCurrency(result.emi)} is calculated on the adjusted principal. EMI payments begin after the {moratoriumMonths}-month moratorium period.
                </p>
              </div>
            )}

            <div className="result-chart">
              <div className="pie-chart" ref={pieChartRef} style={{
                background: `conic-gradient(
                  #667eea 0% ${((result.principal / result.totalAmount) * 100).toFixed(1)}%,
                  #10b981 ${((result.principal / result.totalAmount) * 100).toFixed(1)}% 100%
                )`
              }}>
                <div className="pie-center">
                  <span>Total</span>
                  <strong>₹{Math.round(result.totalAmount).toLocaleString('en-IN')}</strong>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Principal: ₹{Math.round(result.principal).toLocaleString('en-IN')}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Interest: ₹{Math.round(result.totalInterest).toLocaleString('en-IN')}</span>
                </div>
              </div>
              {/* Pie Chart Insight Text */}
              <div className="pie-insight">
                <span className="emoji">💡</span>
                You will pay <strong>{interestPercent.toFixed(0)}%</strong> of the loan amount as interest over <strong>{tenure}</strong> years
              </div>

              {/* EMI Timeline Breakdown - First 5 years interest */}
              {(() => {
                // BUG FIX 4: Use adjustedPrincipal for timeline calculation
                const P = result.adjustedPrincipal;
                const rate = parseFloat(interestRate) / 100 / 12;
                const n = parseFloat(tenure) * 12;
                const emi = parseFloat(result.emi);
                
                // Calculate interest paid in first 60 months (5 years) of EMI payments
                let balance = P;
                let first5YearsInterest = 0;
                for (let i = 0; i < Math.min(60, n); i++) {
                  const interest = balance * rate;
                  first5YearsInterest += interest;
                  balance -= (emi - interest);
                }
                
                const percentageFirst5 = ((first5YearsInterest / parseFloat(result.totalInterest)) * 100).toFixed(0);
                
                return (
                  <div className="timeline-insight">
                    <span className="emoji">📊</span>
                    In the first 5 years{moratoriumMonths > 0 ? ' of EMI payments' : ''}, <strong>{percentageFirst5}% of total interest</strong> (₹{Math.round(first5YearsInterest).toLocaleString('en-IN')}) goes towards interest, while <strong>{(100 - percentageFirst5)}% of EMI</strong> pays off principal.
                    {moratoriumMonths > 0 && <span style={{display: 'block', fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.8}}>*Timeline excludes {moratoriumMonths}-month moratorium period</span>}
                  </div>
                );
              })()}
            </div>

            {/* Income Analysis - Unified FOIR & EMI % of Income (Only show when income provided) */}
            {(() => {
              const incomeNum = parseFloat(monthlyIncome || '0');
              if (incomeNum <= 0) return null; // Don't render if no income provided
              
              const newEmi = parseFloat(result.emi);
              const existingEmisNum = parseFloat(existingEmis || '0');
              const totalEmis = newEmi + existingEmisNum;
              const foir = totalEmis / incomeNum;
              const emiRatio = newEmi / incomeNum;
              
              let foirStatus = 'Likely Eligible';
              let foirClass = 'safe';
              if (foir > 0.65) { foirStatus = 'High Risk'; foirClass = 'risky'; }
              else if (foir > 0.50) { foirStatus = 'Borderline'; foirClass = 'stretching'; }
              
              let emiStatus = 'Safe';
              let emiStatusClass = 'safe';
              if (emiRatio > 0.5) { emiStatus = 'Risky'; emiStatusClass = 'risky'; }
              else if (emiRatio > 0.4) { emiStatus = 'Stretching'; emiStatusClass = 'stretching'; }
              
              return (
                <div className="confidence-row">
                  {/* FOIR Section */}
                  <div className="foir-wrapper">
                    <div className="foir-label">
                      <div className="foir-title">
                        <strong>Bank Eligibility (FOIR):</strong> <span className="foir-percentage">{(foir*100).toFixed(1)}%</span>
                        <Tooltip text="FOIR = (All EMIs + New EMI) / Monthly Income. Banks prefer FOIR ≤ 50%, max 65%.">ℹ️</Tooltip>
                      </div>
                      <span className={`income-status-badge ${foirClass}`}>
                        <span className="status-dot"></span>
                        {foirStatus}
                      </span>
                    </div>
                    <div className="foir-breakdown">
                      <span>New EMI: ₹{Math.round(newEmi).toLocaleString('en-IN')}</span>
                      {existingEmisNum > 0 && <span>+ Existing: ₹{existingEmisNum.toLocaleString('en-IN')}</span>}
                      <span>= ₹{Math.round(totalEmis).toLocaleString('en-IN')} / ₹{Math.round(incomeNum).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* EMI % of Income Section */}
                  <div className="income-bar-wrapper">
                    <div className="income-bar-label">
                      <span>
                        <strong>EMI as % of Income:</strong> {(emiRatio*100).toFixed(1)}%
                        <Tooltip text="Banks prefer EMI ≤ 40–50% of monthly income for approval.">ℹ️</Tooltip>
                      </span>
                      <span className={`income-status-badge ${emiStatusClass}`}>
                        <span className="status-dot"></span>
                        {emiStatus}
                      </span>
                    </div>
                    <div className="income-bar-container">
                      <div 
                        className={`income-bar-fill ${emiStatusClass}`} 
                        style={{width:`${Math.min(emiRatio*100,100)}%`}}
                      ></div>
                      <div className="income-bar-zones"></div>
                    </div>
                    <div className="confidence-markers">
                      <span className="confidence-zone">Safe (0-40%)</span>
                      <span className="confidence-zone">Stretching (40-50%)</span>
                      <span className="confidence-zone">Risky (&gt;50%)</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Prepayment Impact Summary - Show when prepayment is active */}
            {yearlyPrepay > 0 && (
              <div className="prepay-impact-section">
                <h4>💰 Prepayment Impact</h4>
                <div className="prepay-impact-grid">
                  <div className="impact-card">
                    <div className="impact-label">Interest Saved</div>
                    <div className="impact-value highlight">{formatSmartCurrency(prepaySim.interestSaved)}</div>
                  </div>
                  <div className="impact-card">
                    <div className="impact-label">{prepayMode === 'reduceTenure' ? 'Loan Period Shortened' : 'EMI Reduced'}</div>
                    <div className="impact-value">
                      {prepayMode === 'reduceTenure' 
                        ? `${prepaySim.yearsReduced.toFixed(2)} years` 
                        : formatSmartCurrency(prepaySim.emiChanged)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shock Summary */}
            {interestType === 'floating' && (() => {
              if (shockDelta === 0) return null;
              const rate = parseFloat(interestRate); 
              const years = parseFloat(tenure);
              
              // BUG FIX 3: Use canonical adjustedPrincipal (no recalculation)
              const shock = shockRate(result.adjustedPrincipal, rate, years, shockDelta);
              if (!shock || !shock.shocked || !shock.shocked.emi) return null;
              
              // Calculate extended tenure (keep EMI same, solve for new tenure)
              let extendedTenure = years;
              if (floatingBehavior === 'extendTenure') {
                const currentEmi = result.emi;
                const newRate = (rate + shockDelta) / 100 / 12;
                const P = result.adjustedPrincipal;
                // Solve for n: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
                // Using approximation: n ≈ -log(1 - P*r/EMI) / log(1+r)
                if (newRate > 0 && currentEmi > P * newRate) {
                  const n = -Math.log(1 - (P * newRate) / currentEmi) / Math.log(1 + newRate);
                  extendedTenure = n / 12;
                }
              }
              
              // Use high-shock class for +2% rate increase
              const shockClass = shockDelta >= 2 ? 'shock-summary high-shock' : 'shock-summary';
              return (
                <div className={shockClass}>
                  <h4>📈 Interest Rate Shock Impact</h4>
                  
                  {interestType === 'floating' && (
                    <div style={{
                      marginBottom: '1.25rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                      borderRadius: '12px',
                      border: '1px solid #bae6fd',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <label style={{
                        fontWeight: 600,
                        marginBottom: '0.75rem',
                        display: 'block',
                        fontSize: '0.95rem',
                        color: '#0369a1'
                      }}>
                        Lender's Rate Adjustment Policy:
                      </label>
                      <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                        <label style={{
                          flex: '1 1 auto',
                          minWidth: '160px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 1rem',
                          background: floatingBehavior === 'raiseEMI' ? '#fff' : 'rgba(255,255,255,0.6)',
                          border: floatingBehavior === 'raiseEMI' ? '2px solid #3b82f6' : '2px solid transparent',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontWeight: floatingBehavior === 'raiseEMI' ? 600 : 400,
                          boxShadow: floatingBehavior === 'raiseEMI' ? '0 2px 6px rgba(59,130,246,0.2)' : 'none'
                        }}>
                          <input
                            type="radio"
                            name="floatingBehavior"
                            value="raiseEMI"
                            checked={floatingBehavior === 'raiseEMI'}
                            onChange={(e) => setFloatingBehavior(e.target.value)}
                            style={{
                              cursor: 'pointer',
                              accentColor: '#3b82f6',
                              width: '16px',
                              height: '16px'
                            }}
                          />
                          <span style={{fontSize: '0.9rem', color: '#1e3a8a'}}>Raise EMI (tenure unchanged)</span>
                        </label>
                        <label style={{
                          flex: '1 1 auto',
                          minWidth: '160px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 1rem',
                          background: floatingBehavior === 'extendTenure' ? '#fff' : 'rgba(255,255,255,0.6)',
                          border: floatingBehavior === 'extendTenure' ? '2px solid #3b82f6' : '2px solid transparent',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontWeight: floatingBehavior === 'extendTenure' ? 600 : 400,
                          boxShadow: floatingBehavior === 'extendTenure' ? '0 2px 6px rgba(59,130,246,0.2)' : 'none'
                        }}>
                          <input
                            type="radio"
                            name="floatingBehavior"
                            value="extendTenure"
                            checked={floatingBehavior === 'extendTenure'}
                            onChange={(e) => setFloatingBehavior(e.target.value)}
                            style={{
                              cursor: 'pointer',
                              accentColor: '#3b82f6',
                              width: '16px',
                              height: '16px'
                            }}
                          />
                          <span style={{fontSize: '0.9rem', color: '#1e3a8a'}}>Extend Tenure (EMI unchanged)</span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                      borderLeft: '4px solid #f97316',
                      borderRadius: '8px'
                    }}>
                      <div style={{fontSize: '0.85rem', color: '#9a3412', marginBottom: '0.25rem', fontWeight: 500}}>Current EMI</div>
                      <div style={{fontSize: '1.35rem', fontWeight: 700, color: '#c2410c'}}>{formatSmartCurrency(result.emi)}</div>
                    </div>
                    {floatingBehavior === 'raiseEMI' ? (
                      <>
                        <div style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                          borderLeft: '4px solid #ef4444',
                          borderRadius: '8px'
                        }}>
                          <div style={{fontSize: '0.85rem', color: '#991b1b', marginBottom: '0.25rem', fontWeight: 500}}>New EMI (+{shockDelta}% shock)</div>
                          <div style={{fontSize: '1.35rem', fontWeight: 700, color: '#dc2626'}}>{formatSmartCurrency(shock.shocked.emi)}</div>
                        </div>
                        <div style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                          borderLeft: '4px solid #f43f5e',
                          borderRadius: '8px'
                        }}>
                          <div style={{fontSize: '0.85rem', color: '#9f1239', marginBottom: '0.25rem', fontWeight: 500}}>EMI Increase</div>
                          <div style={{fontSize: '1.35rem', fontWeight: 700, color: '#e11d48'}}>+{formatSmartCurrency(shock.shocked.emi - parseFloat(result.emi))}</div>
                        </div>
                        <div style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          borderLeft: '4px solid #f59e0b',
                          borderRadius: '8px'
                        }}>
                          <div style={{fontSize: '0.85rem', color: '#92400e', marginBottom: '0.25rem', fontWeight: 500}}>Extra Interest</div>
                          <div style={{fontSize: '1.35rem', fontWeight: 700, color: '#d97706'}}>{formatSmartCurrency(shock.extraInterest)}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                          borderLeft: '4px solid #22c55e',
                          borderRadius: '8px'
                        }}>
                          <div style={{fontSize: '0.85rem', color: '#166534', marginBottom: '0.25rem', fontWeight: 500}}>EMI Remains</div>
                          <div style={{fontSize: '1.35rem', fontWeight: 700, color: '#16a34a'}}>
                            {formatSmartCurrency(result.emi)}
                            <span style={{fontSize: '0.75rem', color: '#059669', marginLeft: '0.5rem', fontWeight: 500}}>(unchanged)</span>
                          </div>
                        </div>
                        <div style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                          borderLeft: '4px solid #ef4444',
                          borderRadius: '8px'
                        }}>
                          <div style={{fontSize: '0.85rem', color: '#991b1b', marginBottom: '0.25rem', fontWeight: 500}}>Extended Tenure</div>
                          <div style={{fontSize: '1.35rem', fontWeight: 700, color: '#dc2626'}}>
                            {extendedTenure.toFixed(2)} years
                            <span style={{fontSize: '0.75rem', color: '#dc2626', marginLeft: '0.5rem', fontWeight: 500}}>(+{(extendedTenure - years).toFixed(2)} yrs)</span>
                          </div>
                        </div>
                        <div style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          borderLeft: '4px solid #f59e0b',
                          borderRadius: '8px'
                        }}>
                          <div style={{fontSize: '0.85rem', color: '#92400e', marginBottom: '0.25rem', fontWeight: 500}}>Extra Interest</div>
                          <div style={{fontSize: '1.35rem', fontWeight: 700, color: '#d97706'}}>{formatSmartCurrency(shock.extraInterest)}</div>
                        </div>
                      </>
                    )}
                  </div>
                  {interestType === 'floating' && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      borderLeft: '3px solid #3b82f6',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      color: '#1e40af'
                    }}>
                      <span style={{fontWeight: 600}}>💡 Pro Tip:</span> Choose the policy your lender follows when rates change. Most banks either raise EMI or extend tenure—not both.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Share & Copy */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <button onClick={() => {
                const text = `EMI: ${formatSmartCurrency(result.emi)}\nPrincipal: ${formatSmartCurrency(result.principal)}\nInterest: ${formatSmartCurrency(result.totalInterest)}\nTotal: ${formatSmartCurrency(result.totalAmount)}`;
                navigator.clipboard?.writeText(text);
              }} style={{
                flex: '1 1 auto',
                minWidth: '180px',
                padding: '0.85rem 1.5rem',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '2px solid #0ea5e9',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#0c4a6e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(14,165,233,0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(14,165,233,0.3)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(14,165,233,0.15)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Summary
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent('EMI Summary\n'+
                'EMI: '+formatSmartCurrency(result.emi)+'\n'+
                'Principal: '+formatSmartCurrency(result.principal)+'\n'+
                'Interest: '+formatSmartCurrency(result.totalInterest)+'\n'+
                'Total: '+formatSmartCurrency(result.totalAmount))}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 auto',
                  minWidth: '180px',
                  padding: '0.85rem 1.5rem',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  border: '2px solid #10b981',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.15)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Share WhatsApp
              </a>
            </div>
            
            {/* PDF Export Options */}
            <div className="pdf-export-options" style={{marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
              <h4 style={{fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151'}}>📄 PDF Export Options</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem'}}>
                  <input
                    type="checkbox"
                    checked={includeAdvancedAnalysis}
                    onChange={(e) => setIncludeAdvancedAnalysis(e.target.checked)}
                    style={{width: '16px', height: '16px', cursor: 'pointer'}}
                  />
                  <span>Include Prepayment, FOIR & Shock Analysis</span>
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem'}}>
                  <input
                    type="checkbox"
                    checked={includeAmortization}
                    onChange={(e) => setIncludeAmortization(e.target.checked)}
                    style={{width: '16px', height: '16px', cursor: 'pointer'}}
                  />
                  <span>Include Amortization Schedule (may create larger PDF)</span>
                </label>
              </div>
              <button 
                className="tab-btn" 
                style={{width: '100%', background: '#667eea', color: 'white', fontWeight: '600'}}
                onClick={async () => {
                  try {
                    // Capture pie chart as image
                    let chartImage = null;
                    if (pieChartRef.current) {
                      const html2canvas = (await import('html2canvas')).default;
                      const canvas = await html2canvas(pieChartRef.current, {
                        scale: 2,
                        backgroundColor: '#ffffff'
                      });
                      chartImage = canvas.toDataURL('image/png');
                    }
                    
                    // Prepare amortization data (yearly) - PASS RAW NUMBERS
                    let amortizationData = [];
                    if (includeAmortization && prepaySim && prepaySim.rows) {
                      const P = result.adjustedPrincipal;
                      const yearly = [];
                      let currentYear = 1;
                      let yearPrincipal = 0;
                      let yearInterest = 0;
                      let lastBalance = P;
                      
                      prepaySim.rows.forEach((row, idx) => {
                        const y = Math.ceil(row.period / 12);
                        if (y !== currentYear) {
                          yearly.push({
                            year: currentYear,
                            principal: yearPrincipal,
                            interest: yearInterest,
                            balance: lastBalance
                          });
                          currentYear = y;
                          yearPrincipal = 0;
                          yearInterest = 0;
                        }
                        yearPrincipal += row.principal;
                        yearInterest += row.interest;
                        lastBalance = row.balance;
                        
                        if (idx === prepaySim.rows.length - 1) {
                          yearly.push({
                            year: currentYear,
                            principal: yearPrincipal,
                            interest: yearInterest,
                            balance: lastBalance
                          });
                        }
                      });
                      amortizationData = yearly;
                    }
                    
                    // Prepare data for PDF - PASS RAW NUMBERS, NOT FORMATTED STRINGS
                    const basePrincipal = result.originalPrincipal || parseFloat(loanAmount);
                    const baseRate = parseFloat(interestRate);
                    const baseTenure = parseFloat(tenure);

                    // Canonical EMI payload reused everywhere
                    const pdfData = {
                      loanType,
                      loanAmount: basePrincipal,
                      interestRate: baseRate,
                      tenure: baseTenure,
                      interestType,
                      moratoriumMonths,
                      emi: result.emi,
                      principal: result.principal,
                      originalPrincipal: basePrincipal,
                      totalInterest: result.totalInterest,
                      totalAmount: result.totalAmount,
                      moratoriumInterest: result.moratoriumInterest || 0,
                      adjustedPrincipal: result.adjustedPrincipal || result.principal,
                      yearlyPrepay: parseFloat(yearlyPrepay) || 0,
                      prepayMode,
                      yearsReduced: prepaySim?.yearsReduced || 0,
                      interestSaved: prepaySim?.interestSaved || 0,
                      emiReduced: prepaySim?.emiChanged || 0,
                      monthlyIncome: parseFloat(monthlyIncome) || 0,
                      existingEmis: parseFloat(existingEmis) || 0,
                      shockDelta,
                      shockedEmi: shockDelta > 0 ? (() => {
                        // BUG FIX 3: Use canonical adjustedPrincipal
                        const shock = shockRate(result.adjustedPrincipal, baseRate, baseTenure, shockDelta);
                        return shock?.shocked?.emi || 0;
                      })() : 0,
                      emiIncrease: shockDelta > 0 ? (() => {
                        // BUG FIX 3: Use canonical adjustedPrincipal
                        const shock = shockRate(result.adjustedPrincipal, baseRate, baseTenure, shockDelta);
                        return shock?.shocked?.emi ? (shock.shocked.emi - result.emi) : 0;
                      })() : 0,
                      extraInterest: shockDelta > 0 ? (() => {
                        // BUG FIX 3: Use canonical adjustedPrincipal
                        const shock = shockRate(result.adjustedPrincipal, baseRate, baseTenure, shockDelta);
                        return shock?.extraInterest || 0;
                      })() : 0,
                      chartImage,
                      amortizationData
                    };
                    
                    await exportEMIPDF(pdfData, {
                      includeAmortization,
                      includeAdvancedAnalysis
                    });
                  } catch (error) {
                    console.error('PDF export failed:', error);
                    alert('Failed to generate PDF. Please try again.');
                  }
                }}
              >
                📥 Download Professional PDF Report
              </button>
            </div>
            <div className="content-block use-cases-block">
              <h2>Who Should Use This EMI Calculator?</h2>
              <ul>
                <li>Salaried individuals planning home or car loans</li>
                <li>Self-employed professionals checking loan affordability</li>
                <li>Borrowers comparing loan tenure vs EMI trade-offs</li>
                <li>Users planning part-prepayments or balance transfers</li>
              </ul>
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
              <div className="prepay-summary">
                <div><strong>Interest saved:</strong> {formatSmartCurrency(prepaySim.interestSaved)}</div>
                <div><strong>Years reduced:</strong> {prepaySim.yearsReduced.toFixed(2)}</div>
                {prepayMode==='reduceEmi' && <div><strong>EMI change:</strong> {formatSmartCurrency(prepaySim.emiChanged)}</div>}
              </div>
            )}
            <div className="disclaimer">
              ⚠️ Indicative only. Actual EMI may vary by lender.
            </div>
          </div>
        )}

      </div>

      {/* SEO Content Section */}
      <div className="seo-content-section">
        <div className="content-block">
          <h2>EMI recap (quick)</h2>
          <p>
            EMI is the fixed monthly payment covering both principal and interest, staying largely constant through the loan tenure to keep budgeting predictable.
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
            the principal amount and consequently lower your monthly EMI burden. Your <Link to="/in/calculators/home-loan-eligibility">home loan eligibility</Link> is also determined by your ability to service the EMI based on your income and existing obligations (FOIR).
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
            collateral but have stricter eligibility criteria based on income and credit score. Before taking a high-interest personal loan, 
            compare your returns from <Link to="/in/calculators/fd">fixed deposits</Link> or other safe investment options.
          </p>

          <h3>Education Loans</h3>
          <p>
            Education loans offer moratorium periods (no EMI during course duration) and competitive rates (7-12% p.a.). Some loans 
            also have subsidies and tax benefits under Section 80E. Parents can start planning early by using <Link to="/in/calculators/rd">recurring deposit (RD) calculators</Link> to build an education corpus.
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
          <p>
            <Link to="/india/calculators/home-loan-eligibility">
              Check your home loan eligibility before applying
            </Link>
          </p>
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
            <li><strong>Make Part Prepayments:</strong> Use bonuses or surplus funds to make part prepayments and reduce tenure or EMI. Consider setting up a <Link to="/in/calculators/sip">systematic investment plan (SIP)</Link> specifically for building prepayment corpus</li>
            <li><strong>Balance Transfer:</strong> If rates have dropped significantly, consider transferring to a lender with lower rates</li>
            <li><strong>Improve Credit Score:</strong> A higher CIBIL score (750+) helps you negotiate better interest rates</li>
          </ul>
        </div>

        <div className="content-block faq-section">
          <h2>Frequently Asked Questions (FAQs)</h2>
          
          <div className="faq-item">
            <h3>What does EMI stand for?</h3>
            <p>
              EMI stands for Equated Monthly Installment. It's the fixed monthly payment made towards a loan. It includes both principal and interest 
              and remains relatively constant over the loan tenure.
            </p>
          </div>

          <div className="faq-item">
            <h3>How is EMI calculated?</h3>
            <p>
              EMI is calculated using the formula: EMI = P × [r(1+r)^n]/[(1+r)^n-1], where P is loan principal, r is monthly interest rate, 
              and n is the number of months. Our calculator applies this formula instantly based on your inputs.
            </p>
          </div>

          <div className="faq-item">
            <h3>What's the difference between EMI and monthly loan payment?</h3>
            <p>
              EMI and monthly loan payment mean the same thing. EMI is the term commonly used in India for fixed monthly loan payments, while 
              Western countries may just call it 'monthly payment.' Both refer to the same concept of regular loan repayment.
            </p>
          </div>

          <div className="faq-item">
            <h3>How can I reduce my EMI?</h3>
            <p>
              You can reduce your EMI by: increasing your down payment, extending the loan tenure (though this increases total interest), 
              improving your credit score for better rates, or paying a lump sum amount. Use our calculator to experiment with different scenarios.
            </p>
          </div>

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
            <Link to="/in/calculators/sip" className="calc-card">
              <h3>SIP Calculator</h3>
              <p>Calculate returns on systematic investment plans</p>
            </Link>
            <Link to="/in/calculators/fd" className="calc-card">
              <h3>FD Calculator</h3>
              <p>Compute fixed deposit maturity amount</p>
            </Link>
            <Link to="/income-tax-calculator" className="calc-card">
              <h3>Income Tax Calculator</h3>
              <p>Calculate tax liability for FY 2024-25</p>
            </Link>
            <Link to="/in/calculators/rd" className="calc-card">
              <h3>RD Calculator</h3>
              <p>Calculate recurring deposit returns</p>
            </Link>
          </div>
        </div>
        </div>
      </div>
      {/* Floating Back-to-Top button */}
      <ScrollToTop threshold={300} />
    </>
  );
}

export default EMICalculator;
