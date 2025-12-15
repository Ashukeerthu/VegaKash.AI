import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EnhancedSEO } from '../../../components/EnhancedSEO';
import { AEOContentSection } from '../../../components/AEOContentSection';
import SEO from '../../../components/SEO';
import Breadcrumb from '../../../components/Breadcrumb';
import '../../../styles/Calculator.css';
import '../../../styles/SEOContent.css';
import '../../../styles/AEOContent.css';
import ScrollToTop from '../../../modules/core/ui/ScrollToTop';

/**
 * India Home Loan Eligibility Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates home loan eligibility based on Indian banking norms (FOIR, LTV, income multipliers)
 * Includes processing fees, registration charges, and GST considerations
 */
function HomeLoanEligibilityIndia() {
  const { country } = useParams();
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: '/calculators' },
    { label: 'India Home Loan Eligibility', path: null }
  ];
  
  // Income inputs
  const [annualIncome, setAnnualIncome] = useState(1200000); // ₹12 lakhs
  const [spouseIncome, setSpouseIncome] = useState(0); // Joint application
  const [otherIncome, setOtherIncome] = useState(0); // Rental, etc.
  
  // Applicant details
  const [applicantAge, setApplicantAge] = useState(35); // Age in years
  const [employmentType, setEmploymentType] = useState('salaried'); // salaried or self-employed
  const [creditScore, setCreditScore] = useState('750+'); // 750+, 700-749, 650-699, <650
  const [propertyType, setPropertyType] = useState('ready'); // ready or under-construction
  const [housingCategory, setHousingCategory] = useState('non-affordable'); // affordable or non-affordable
  const [bankType, setBankType] = useState('private'); // PSU, Private, NBFC
  
  // Obligations
  const [existingEMI, setExistingEMI] = useState(15000); // ₹15k
  
  // Loan parameters
  const [interestRate, setInterestRate] = useState(8.5); // Current avg rate
  const [loanTenure, setLoanTenure] = useState(20); // years
  const [propertyValue, setPropertyValue] = useState(5000000); // ₹50 lakhs
  
  // Advanced settings
  const [foir, setFoir] = useState(50); // Fixed Obligation to Income Ratio (%)
  const [ltv, setLtv] = useState(80); // Loan-to-Value ratio (%) - will be auto-adjusted
  const [includeCharges, setIncludeCharges] = useState(true);
  
  const [result, setResult] = useState(null);

  // Memoize calculation inputs to prevent unnecessary recalculations
  const calculationInputs = React.useMemo(() => ({
    annualIncome,
    spouseIncome,
    otherIncome,
    existingEMI,
    interestRate,
    loanTenure,
    propertyValue,
    foir,
    ltv,
    includeCharges,
    applicantAge,
    employmentType,
    creditScore,
    propertyType,
    housingCategory,
    bankType
  }), [annualIncome, spouseIncome, otherIncome, existingEMI, interestRate, loanTenure, propertyValue, foir, ltv, includeCharges, applicantAge, employmentType, creditScore, propertyType, housingCategory, bankType]);

  // Reusable dropdown style object
  const dropdownStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%), url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: '0 0, right 1rem center',
    backgroundSize: 'auto, 20px',
    paddingRight: '3rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    outline: 'none'
  };

  const dropdownHoverStyle = {
    borderColor: '#667eea',
    boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.1), 0 2px 4px -1px rgba(102, 126, 234, 0.06)',
    transform: 'translateY(-1px)'
  };

  const dropdownFocusStyle = {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  React.useEffect(() => {
    calculateAffordability();
  }, [calculationInputs]);

  const calculateAffordability = () => {
    // Apply Bank Type specific FOIR
    let bankFOIR = parseFloat(foir);
    if (bankType === 'psu') {
      bankFOIR = Math.min(bankFOIR, 55); // PSU banks are conservative
    } else if (bankType === 'private') {
      bankFOIR = Math.min(bankFOIR, 60); // Private banks allow more
    } else if (bankType === 'nbfc') {
      bankFOIR = Math.min(bankFOIR, 65); // NBFCs are most flexible
    }
    
    // Apply Income Weightage (Indian Banking Standard)
    // Primary income: 100%, Spouse: 75%, Other (rental): 60%
    const primaryIncome = parseFloat(annualIncome);
    const coApplicantIncome = parseFloat(spouseIncome) * 0.75; // 75% weightage for co-applicant
    const rentalOtherIncome = parseFloat(otherIncome) * 0.6; // 60% weightage for rental/other income
    
    const totalAnnualIncome = primaryIncome + parseFloat(spouseIncome) + parseFloat(otherIncome); // Total income before weightage
    const effectiveAnnualIncome = primaryIncome + coApplicantIncome + rentalOtherIncome;
    const monthlyIncome = effectiveAnnualIncome / 12;
    
    if (!monthlyIncome || monthlyIncome <= 0) return;
    
    // Apply Age-Based Tenure Cap (Indian Banking Standard)
    const retirementAge = employmentType === 'salaried' ? 60 : 65;
    const maxTenureByAge = retirementAge - parseInt(applicantAge);
    const effectiveTenure = Math.min(parseFloat(loanTenure), maxTenureByAge, 30); // Cap at 30 years max
    
    if (effectiveTenure <= 0) {
      setResult({
        eligible: false,
        message: 'Your age does not permit a home loan. Please check your age or retirement age.'
      });
      return;
    }
    
    // FOIR-based calculation (using bank-specific FOIR)
    const maxMonthlyEMI = (monthlyIncome * (bankFOIR / 100)) - parseFloat(existingEMI);
    
    if (maxMonthlyEMI <= 0) {
      setResult({
        eligible: false,
        message: 'Your existing EMI exceeds the maximum allowed FOIR. Please reduce existing obligations.'
      });
      return;
    }
    
    // Apply credit score impact on interest rate
    let effectiveInterestRate = parseFloat(interestRate);
    if (creditScore === '700-749') {
      effectiveInterestRate += 0.25;
    } else if (creditScore === '650-699') {
      effectiveInterestRate += 0.75;
    } else if (creditScore === 'below-650') {
      effectiveInterestRate += 1.5;
    }
    
    // Calculate max loan based on EMI capacity
    const r = effectiveInterestRate / 100 / 12; // monthly rate (credit-adjusted)
    const n = effectiveTenure * 12; // total months (age-adjusted)
    
    let maxLoanByEMI = 0;
    if (r > 0) {
      // Reverse EMI formula: P = EMI × [(1+r)^n - 1] / [r(1+r)^n]
      maxLoanByEMI = maxMonthlyEMI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    } else {
      maxLoanByEMI = maxMonthlyEMI * n;
    }
    
    // Apply RBI LTV Slabs (Programmatic Enforcement)
    // As per RBI guidelines:
    // ≤ ₹30L: 90% LTV, ₹30-75L: 80% LTV, > ₹75L: 75% LTV
    let rbiMaxLTV = 90;
    const propValue = parseFloat(propertyValue);
    
    if (propValue <= 3000000) {
      rbiMaxLTV = 90; // Up to ₹30 lakhs
    } else if (propValue <= 7500000) {
      rbiMaxLTV = 80; // ₹30-75 lakhs
    } else {
      rbiMaxLTV = 75; // Above ₹75 lakhs
    }
    
    // Use the lower of user-selected LTV and RBI max LTV
    const effectiveLTV = Math.min(parseFloat(ltv), rbiMaxLTV);
    
    // Calculate max loan based on LTV
    const maxLoanByLTV = propValue * (effectiveLTV / 100);
    
    // Actual eligible loan is minimum of both
    const eligibleLoan = Math.min(maxLoanByEMI, maxLoanByLTV);
    
    // Calculate actual EMI for eligible loan
    let monthlyEMI = 0;
    if (r > 0) {
      monthlyEMI = eligibleLoan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    } else {
      monthlyEMI = eligibleLoan / n;
    }
    
    // Down payment required
    const downPayment = parseFloat(propertyValue) - eligibleLoan;
    
    // Calculate additional charges (if included)
    let processingFee = 0;
    let stampDutyAndRegistration = 0;
    let gst = 0;
    let legalCharges = 0;
    let totalUpfrontCost = downPayment;
    
    if (includeCharges) {
      // Processing fee: Typically 0.5% of loan amount (varies by bank)
      processingFee = eligibleLoan * 0.005;
      
      // Stamp duty and registration: Varies by state, average 5-7%
      stampDutyAndRegistration = parseFloat(propertyValue) * 0.06;
      
      // GST on under-construction property only
      if (propertyType === 'under-construction') {
        if (housingCategory === 'affordable') {
          gst = parseFloat(propertyValue) * 0.01; // 1% for affordable
        } else {
          gst = parseFloat(propertyValue) * 0.05; // 5% for non-affordable
        }
      } else {
        gst = 0; // No GST for ready-to-move
      }
      
      // Legal charges: Typically ₹5,000 - ₹25,000
      legalCharges = 15000;
      
      totalUpfrontCost = downPayment + processingFee + stampDutyAndRegistration + gst + legalCharges;
    }
    
    // Total interest payable
    const totalAmountPayable = monthlyEMI * n;
    const totalInterest = totalAmountPayable - eligibleLoan;
    
    // Calculate FOIR utilization (clamped to 100% max)
    const foirUtilization = Math.min(
      ((monthlyEMI + parseFloat(existingEMI)) / monthlyIncome * 100),
      100
    );
    
    // Debt-to-income ratio (clamped to 100% max)
    const dti = Math.min(
      ((monthlyEMI + parseFloat(existingEMI)) / monthlyIncome * 100),
      100
    );
    
    // Calculate typical multiplier range based on employment type
    const typicalMultiplierMin = employmentType === 'salaried' ? 4 : 3;
    const typicalMultiplierMax = employmentType === 'salaried' ? 6 : 5;
    
    setResult({
      eligible: true,
      eligibleLoan: Math.round(eligibleLoan),
      monthlyEMI: Math.round(monthlyEMI),
      downPayment: Math.round(downPayment),
      totalIncome: Math.round(primaryIncome + parseFloat(spouseIncome) + parseFloat(otherIncome)),
      effectiveIncome: Math.round(effectiveAnnualIncome),
      monthlyIncome: Math.round(monthlyIncome),
      maxMonthlyEMI: Math.round(maxMonthlyEMI),
      propertyValue: Math.round(propValue),
      ltvUsed: ((eligibleLoan / propValue) * 100).toFixed(1),
      effectiveLTV: effectiveLTV.toFixed(1),
      rbiMaxLTV: rbiMaxLTV,
      effectiveTenure: effectiveTenure,
      requestedTenure: parseFloat(loanTenure),
      tenureCapped: effectiveTenure < parseFloat(loanTenure),
      processingFee: Math.round(processingFee),
      stampDutyAndRegistration: Math.round(stampDutyAndRegistration),
      gst: Math.round(gst),
      legalCharges: Math.round(legalCharges),
      totalUpfrontCost: Math.round(totalUpfrontCost),
      totalAmountPayable: Math.round(totalAmountPayable),
      totalInterest: Math.round(totalInterest),
      foirUtilization: foirUtilization.toFixed(1),
      dti: dti.toFixed(1),
      incomeMultiplier: (eligibleLoan / effectiveAnnualIncome).toFixed(2),
      typicalMultiplierMin: typicalMultiplierMin,
      typicalMultiplierMax: typicalMultiplierMax,
      effectiveInterestRate: effectiveInterestRate.toFixed(2),
      creditScore: creditScore,
      limitingFactor: maxLoanByEMI < maxLoanByLTV ? 'FOIR' : 'LTV',
      // Approval probability calculation
      approvalProbability: (() => {
        let score = 0;
        
        // FOIR component (30%)
        if (foirUtilization < 40) score += 30;
        else if (foirUtilization < 50) score += 25;
        else if (foirUtilization < 60) score += 15;
        else score += 5;
        
        // LTV component (25%)
        const actualLTV = (eligibleLoan / propValue) * 100;
        if (actualLTV < 70) score += 25;
        else if (actualLTV < 80) score += 20;
        else if (actualLTV < 90) score += 10;
        else score += 5;
        
        // Credit score component (30%)
        if (creditScore === '750+') score += 30;
        else if (creditScore === '700-749') score += 20;
        else if (creditScore === '650-699') score += 10;
        else score += 3;
        
        // Age component (15%)
        const age = parseInt(applicantAge);
        if (age >= 25 && age <= 40) score += 15;
        else if (age >= 41 && age <= 50) score += 12;
        else if (age >= 51 && age <= 55) score += 8;
        else score += 3;
        
        return Math.min(Math.round(score), 100);
      })(),
      bankType: bankType
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatLakhs = (value) => {
    const lakhs = value / 100000;
    return `₹${lakhs.toFixed(2)}L`;
  };

  const handleReset = () => {
    setAnnualIncome(1200000);
    setSpouseIncome(0);
    setOtherIncome(0);
    setApplicantAge(35);
    setEmploymentType('salaried');
    setCreditScore('750+');
    setPropertyType('ready');
    setHousingCategory('non-affordable');
    setBankType('private');
    setExistingEMI(15000);
    setInterestRate(8.5);
    setLoanTenure(20);
    setPropertyValue(5000000);
    setFoir(50);
    setLtv(80);
    setIncludeCharges(true);
  };

  return (
    <>
      <ScrollToTop threshold={300} />
      <SEO 
        title="India Home Loan Eligibility Calculator | VegaKash"
        description="Calculate your home loan eligibility in India. Free calculator with FOIR, LTV, processing fees, stamp duty, and GST. Check how much home loan you can get instantly."
        keywords="home loan calculator india, home loan eligibility, loan affordability india, FOIR calculator, LTV calculator, home loan EMI india"
        canonical="/india/calculators/home-loan-eligibility"
      />
      
      <div className="calculator-container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="calculator-header">
          <h1>🏠 India Home Loan Eligibility Calculator</h1>
          <p>Calculate your home loan eligibility based on income, FOIR, and LTV norms as per Indian banking guidelines</p>
        </div>

        <div className="calculator-content">
          <div className="calculator-main-grid">
            <div className="calculator-inputs">
              <div className="inputs-grid">
                <details open style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer' }}>Core Profile</summary>
                {/* Annual Income */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Annual Income (Primary)</label>
                  <input
                    type="text"
                    value={formatCurrency(annualIncome)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setAnnualIncome('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setAnnualIncome(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setAnnualIncome(1200000);
                      } else if (num < 300000) {
                        setAnnualIncome(300000);
                      } else if (num > 50000000) {
                        setAnnualIncome(50000000);
                      } else {
                        setAnnualIncome(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="300000"
                  max="50000000"
                  step="100000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹3L</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Spouse Income */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Co-Applicant Income (Optional)</label>
                  <input
                    type="text"
                    value={spouseIncome > 0 ? formatCurrency(spouseIncome) : '₹0'}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setSpouseIncome('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setSpouseIncome(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setSpouseIncome(0);
                      } else if (num < 0) {
                        setSpouseIncome(0);
                      } else if (num > 50000000) {
                        setSpouseIncome(50000000);
                      } else {
                        setSpouseIncome(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="100000"
                  value={spouseIncome}
                  onChange={(e) => setSpouseIncome(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹0</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Other Income */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Other Income (Rental, etc.)</label>
                  <input
                    type="text"
                    value={otherIncome > 0 ? formatCurrency(otherIncome) : '₹0'}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setOtherIncome('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setOtherIncome(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setOtherIncome(0);
                      } else if (num < 0) {
                        setOtherIncome(0);
                      } else if (num > 10000000) {
                        setOtherIncome(10000000);
                      } else {
                        setOtherIncome(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹0</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              {/* Income Weightage Notice */}
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(59, 130, 246, 0.05)', 
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#1e40af'
              }}>
                <strong>ℹ️ Income Weightage Applied:</strong> Co-applicant (75%), Other income (60%) as per banking norms
              </div>

              {/* Applicant Age */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Your Current Age</label>
                  <input
                    type="text"
                    value={`${applicantAge} Years`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setApplicantAge('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setApplicantAge(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setApplicantAge(35);
                      } else if (num < 21) {
                        setApplicantAge(21);
                      } else if (num > 65) {
                        setApplicantAge(65);
                      } else {
                        setApplicantAge(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="21"
                  max="65"
                  step="1"
                  value={applicantAge}
                  onChange={(e) => setApplicantAge(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>21 Yrs</span>
                  <span>65 Yrs</span>
                </div>
              </div>

              {/* Employment Type */}
              <div className="slider-group">
                <label style={{ fontWeight: '600', color: '#334155', marginBottom: '0.75rem', display: 'block', fontSize: '0.95rem' }}>Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="input-display"
                  style={dropdownStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.target.style, dropdownHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    onFocus={(e) => {
                      Object.assign(e.target.style, dropdownFocusStyle);
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                  <option value="salaried" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>💼 Salaried (Retire at 60)</option>
                  <option value="self-employed" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>🏢 Self-Employed (Retire at 65)</option>
                </select>
              </div>

              {/* Credit Score */}
              <div className="slider-group">
                <label style={{ fontWeight: '600', color: '#334155', marginBottom: '0.75rem', display: 'block', fontSize: '0.95rem' }}>CIBIL Score</label>
                <select
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className="input-display"
                  style={dropdownStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.target.style, dropdownHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    onFocus={(e) => {
                      Object.assign(e.target.style, dropdownFocusStyle);
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                  <option value="750+" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>🌟 750+ (Best Rates)</option>
                  <option value="700-749" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>🟢 700-749 (+0.25% rate)</option>
                  <option value="650-699" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>🟡 650-699 (+0.75% rate)</option>
                  <option value="below-650" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>🔴 Below 650 (+1.5% rate)</option>
                </select>
              </div>

              </details>

                <details open style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                  <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer' }}>Property & Loan</summary>

              {/* Property Type */}
              <div className="slider-group">
                <label style={{ fontWeight: '600', color: '#334155', marginBottom: '0.75rem', display: 'block', fontSize: '0.95rem' }}>Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="input-display"
                    style={{ 
                      width: '100%', 
                      padding: '1rem 1.25rem', 
                      fontSize: '1rem',
                      background: 'white',
                      border: '2px solid #cbd5e1',
                      borderRadius: '10px',
                      fontWeight: '600',
                      color: '#1e293b',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23667eea\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '24px',
                      paddingRight: '3rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                  >
                    <option value="ready" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600' }}>✅ Ready-to-Move</option>
                    <option value="under-construction" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600' }}>🏭 Under Construction</option>
                  </select>
              </div>

              {/* Bank Type Selector */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155', fontSize: '1rem' }}>
                  🏦 Preferred Lender Type
                </label>
                <select
                  value={bankType}
                  onChange={(e) => setBankType(e.target.value)}
                  style={dropdownStyle}
                  onMouseEnter={(e) => Object.assign(e.target.style, dropdownHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.target.style, dropdownStyle)}
                  onFocus={(e) => Object.assign(e.target.style, dropdownFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, dropdownStyle)}
                >
                  <option value="psu" style={{ padding: '0.5rem', background: '#fff' }}>PSU Bank (Conservative, Max FOIR 55%)</option>
                  <option value="private" style={{ padding: '0.5rem', background: '#fff' }}>Private Bank (Balanced, Max FOIR 60%)</option>
                  <option value="nbfc" style={{ padding: '0.5rem', background: '#fff' }}>NBFC (Flexible, Max FOIR 65%)</option>
                </select>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                  💡 Different lenders have varying FOIR limits and approval criteria
                </p>
              </div>

              {/* Housing Category (show only if under-construction) */}
              {propertyType === 'under-construction' && (
                <div className="slider-group">
                  <div className="slider-header">
                    <label style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block', fontSize: '0.95rem' }}>Housing Category</label>
                    <select
                      value={housingCategory}
                      onChange={(e) => setHousingCategory(e.target.value)}
                      className="input-display"
                      style={dropdownStyle}
                      onMouseEnter={(e) => {
                        Object.assign(e.target.style, dropdownHoverStyle);
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                      onFocus={(e) => {
                        Object.assign(e.target.style, dropdownFocusStyle);
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                      }}
                    >
                      <option value="affordable" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>🏘️ Affordable (1% GST)</option>
                      <option value="non-affordable" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', background: '#fff' }}>🏛️ Non-Affordable (5% GST)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Existing EMI */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Existing Monthly EMI</label>
                  <input
                    type="text"
                    value={formatCurrency(existingEMI)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setExistingEMI('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setExistingEMI(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setExistingEMI(15000);
                      } else if (num < 0) {
                        setExistingEMI(0);
                      } else if (num > 500000) {
                        setExistingEMI(500000);
                      } else {
                        setExistingEMI(num);
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
                  value={existingEMI}
                  onChange={(e) => setExistingEMI(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹0</span>
                  <span>₹5L</span>
                </div>
              </div>

              {/* Property Value */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Desired Property Value</label>
                  <input
                    type="text"
                    value={formatCurrency(propertyValue)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setPropertyValue('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setPropertyValue(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setPropertyValue(5000000);
                      } else if (num < 1000000) {
                        setPropertyValue(1000000);
                      } else if (num > 100000000) {
                        setPropertyValue(100000000);
                      } else {
                        setPropertyValue(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="500000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>₹10L</span>
                  <span>₹10Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
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
                      } else if (num < 6) {
                        setInterestRate(6);
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
                  min="6"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>6%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Loan Tenure */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Loan Tenure</label>
                  <input
                    type="text"
                    value={`${loanTenure} Years`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val === '') {
                        setLoanTenure('');
                        return;
                      }
                      const num = parseInt(val);
                      if (!isNaN(num)) {
                        setLoanTenure(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const num = parseInt(val);
                      if (val === '' || isNaN(num)) {
                        setLoanTenure(20);
                      } else if (num < 5) {
                        setLoanTenure(5);
                      } else if (num > 30) {
                        setLoanTenure(30);
                      } else {
                        setLoanTenure(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>5 Yrs</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              </details>

              <details open style={{ gridColumn: '1 / -1', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', background: 'white' }}>
                <summary style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', cursor: 'pointer' }}>Advanced Bank Parameters</summary>

              {/* FOIR */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>FOIR Limit (%)</label>
                  <input
                    type="text"
                    value={`${foir}%`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      if (val === '') {
                        setFoir('');
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setFoir(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      const num = parseFloat(val);
                      if (val === '' || isNaN(num)) {
                        setFoir(50);
                      } else if (num < 30) {
                        setFoir(30);
                      } else if (num > 70) {
                        setFoir(70);
                      } else {
                        setFoir(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  step="5"
                  value={foir}
                  onChange={(e) => setFoir(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>30%</span>
                  <span>70%</span>
                </div>
                {foir > 60 && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.5rem', 
                    background: foir > 65 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '6px',
                    border: `1px solid ${foir > 65 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
                    fontSize: '0.85rem',
                    color: foir > 65 ? '#dc2626' : '#d97706'
                  }}>
                    <strong>⚠️ {foir > 65 ? 'Very Low Approval Probability' : 'Aggressive FOIR'}</strong> - Most banks approve 50-60% only
                  </div>
                )}
              </div>

              {/* LTV */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>Max LTV Ratio (%)</label>
                  <input
                    type="text"
                    value={`${ltv}%`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      if (val === '') {
                        setLtv('');
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setLtv(num);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[%\s]/g, '');
                      const num = parseFloat(val);
                      if (val === '' || isNaN(num)) {
                        setLtv(80);
                      } else if (num < 50) {
                        setLtv(50);
                      } else if (num > 90) {
                        setLtv(90);
                      } else {
                        setLtv(num);
                      }
                    }}
                    className="input-display"
                  />
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  value={ltv}
                  onChange={(e) => setLtv(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>50%</span>
                  <span>90%</span>
                </div>
              </div>

              {/* Include Charges */}
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeCharges}
                    onChange={(e) => setIncludeCharges(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Include Processing & Registration Charges</span>
                </label>
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

            {result && result.eligible && (
              <div className="calculator-results">
                <h2>Your Home Loan Eligibility</h2>

                {/* Approval Probability Meter */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '2px solid #bae6fd',
                  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '1.2rem', 
                      color: '#0c4a6e',
                      fontWeight: '700'
                    }}>
                      🎯 Approval Probability
                    </h3>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      color: result.approvalProbability >= 70 ? '#15803d' : result.approvalProbability >= 50 ? '#ca8a04' : '#dc2626'
                    }}>
                      {result.approvalProbability}%
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '24px',
                    background: '#e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${result.approvalProbability}%`,
                      height: '100%',
                      background: result.approvalProbability >= 70 
                        ? 'linear-gradient(90deg, #22c55e 0%, #15803d 100%)'
                        : result.approvalProbability >= 50
                        ? 'linear-gradient(90deg, #facc15 0%, #ca8a04 100%)'
                        : 'linear-gradient(90deg, #f87171 0%, #dc2626 100%)',
                      transition: 'width 0.6s ease-out',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}></div>
                  </div>
                  <p style={{ 
                    marginTop: '0.75rem', 
                    fontSize: '0.9rem', 
                    color: '#475569',
                    margin: '0.75rem 0 0 0'
                  }}>
                    {result.approvalProbability >= 70 && '🟢 High - Strong approval chances with most lenders'}
                    {result.approvalProbability >= 50 && result.approvalProbability < 70 && '🟡 Moderate - Consider improving credit score or reducing EMI obligations'}
                    {result.approvalProbability < 50 && '🔴 Low - May need co-applicant or higher down payment'}
                  </p>
                </div>

                <div className="result-cards">
                  <div className="result-card highlight" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '2rem 1.5rem',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                    border: 'none'
                  }}>
                    <div className="result-label" style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>✨ Eligible Loan Amount</div>
                    <div className="result-value" style={{ 
                      fontSize: '3.5rem', 
                      fontWeight: '800',
                      color: 'white',
                      marginBottom: '0.5rem',
                      textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      lineHeight: '1.1'
                    }}>{formatCurrency(result.eligibleLoan)}</div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      color: 'rgba(255, 255, 255, 0.95)', 
                      marginTop: '0.5rem',
                      fontWeight: '600',
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '20px',
                      display: 'inline-block'
                    }}>
                      {formatLakhs(result.eligibleLoan)}
                    </div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Monthly EMI</div>
                    <div className="result-value">{formatCurrency(result.monthlyEMI)}</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Down Payment Required</div>
                    <div className="result-value">{formatCurrency(result.downPayment)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                      {formatLakhs(result.downPayment)}
                    </div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">LTV Used</div>
                    <div className="result-value">{result.ltvUsed}%</div>
                    {result.effectiveLTV < result.ltvUsed && (
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                        RBI Max: {result.rbiMaxLTV}%
                      </div>
                    )}
                  </div>

                  <div className="result-card">
                    <div className="result-label">Loan Tenure</div>
                    <div className="result-value">{result.effectiveTenure} Yrs</div>
                    {result.tenureCapped && (
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                        Capped by age
                      </div>
                    )}
                  </div>

                  <div className="result-card">
                    <div className="result-label">FOIR Utilization</div>
                    <div className="result-value">{result.foirUtilization}%</div>
                  </div>

                  <div className="result-card">
                    <div className="result-label">Income Multiplier</div>
                    <div className="result-value">{result.incomeMultiplier}x</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                      Typical: {result.typicalMultiplierMin}x - {result.typicalMultiplierMax}x
                    </div>
                  </div>
                </div>

                {/* Credit Score Impact Notice */}
                {result.creditScore !== '750+' && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: 'rgba(239, 68, 68, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#dc2626' }}>
                      📊 Credit Score Impact
                    </h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <strong>Effective Interest Rate:</strong> {result.effectiveInterestRate}% (base {interestRate}% + premium)
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                      {(() => {
                        const baseRate = interestRate / 100 / 12;
                        const adjustedRate = parseFloat(result.effectiveInterestRate) / 100 / 12;
                        const n = result.effectiveTenure * 12;
                        const baseEMI = result.eligibleLoan * baseRate * Math.pow(1 + baseRate, n) / (Math.pow(1 + baseRate, n) - 1);
                        const adjustedEMI = result.eligibleLoan * adjustedRate * Math.pow(1 + adjustedRate, n) / (Math.pow(1 + adjustedRate, n) - 1);
                        const monthlySavings = Math.round(adjustedEMI - baseEMI);
                        const yearlySavings = monthlySavings * 12;
                        return `Improving your CIBIL score to 750+ could reduce your EMI by approx ₹${monthlySavings.toLocaleString('en-IN')}/month (₹${yearlySavings.toLocaleString('en-IN')}/year)`;
                      })()}
                    </p>
                  </div>
                )}

                {/* Eligibility Limiting Factor */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  background: result.limitingFactor === 'FOIR' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  border: `1px solid ${result.limitingFactor === 'FOIR' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: result.limitingFactor === 'FOIR' ? '#d97706' : '#2563eb' }}>
                    📊 Eligibility Analysis
                  </h3>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    <strong>Limiting Factor:</strong> {result.limitingFactor === 'FOIR' ? 'FOIR (Income-based)' : 'LTV (Property Value-based)'}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {result.limitingFactor === 'FOIR' 
                      ? 'Your loan amount is limited by your income and FOIR. Increase income or reduce existing EMI to get higher loan amount.'
                      : 'Your loan amount is limited by property value and LTV ratio. You have good income capacity for higher loan.'}
                  </p>
                </div>

                {/* Total Interest */}
                <div className="breakdown-chart">
                  <h3>Loan Breakdown</h3>
                  <div className="chart-bar">
                    <div 
                      className="chart-segment principal"
                      style={{ width: `${(result.eligibleLoan / (result.eligibleLoan + result.totalInterest) * 100).toFixed(1)}%` }}
                    >
                      <span>Principal</span>
                    </div>
                    <div 
                      className="chart-segment interest"
                      style={{ width: `${(result.totalInterest / (result.eligibleLoan + result.totalInterest) * 100).toFixed(1)}%` }}
                    >
                      <span>Interest</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color principal"></span>
                      <span>Principal: {formatCurrency(result.eligibleLoan)}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color interest"></span>
                      <span>Interest: {formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ background: '#10b981' }}></span>
                      <span>Total Payable: {formatCurrency(result.totalAmountPayable)}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Charges */}
                {includeCharges && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: 'rgba(239, 68, 68, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#dc2626' }}>
                      💰 Upfront Costs Summary
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <span>Down Payment</span>
                        <strong>{formatCurrency(result.downPayment)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <span>Processing Fee (0.5%)</span>
                        <strong>{formatCurrency(result.processingFee)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <span>Stamp Duty & Registration (~6%)</span>
                        <strong>{formatCurrency(result.stampDutyAndRegistration)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <span>GST (if applicable, ~1%)</span>
                        <strong>{formatCurrency(result.gst)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <span>Legal & Documentation Charges</span>
                        <strong>{formatCurrency(result.legalCharges)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#dc2626' }}>
                        <span>Total Upfront Cost</span>
                        <strong>{formatCurrency(result.totalUpfrontCost)}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {result.foirUtilization > 60 && (
                  <div className="alert alert-warning">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <strong>High FOIR Utilization</strong>
                      <p>Your FOIR is {result.foirUtilization}%. Most banks prefer FOIR below 50-60%. Consider reducing existing EMI or increasing income.</p>
                    </div>
                  </div>
                )}

                {result.ltvUsed > 85 && (
                  <div className="alert alert-info">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 11V15M10 7H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <strong>High LTV Ratio</strong>
                      <p>Your LTV is {result.ltvUsed}%. Some banks may require additional documentation or charge higher interest rates for LTV above 80%.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {result && !result.eligible && (
              <div className="calculator-results">
                <div className="alert alert-warning" style={{ marginTop: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <strong>Not Eligible</strong>
                    <p>{result.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mandatory Disclaimer - Compliance */}
        <div style={{ 
          margin: '2rem 0',
          padding: '1.25rem', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)',
          borderRadius: '12px',
          border: '2px solid rgba(239, 68, 68, 0.2)',
          borderLeft: '6px solid #dc2626'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            marginBottom: '0.75rem', 
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Important Disclaimer
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: '#374151' }}>
            This calculator provides <strong>indicative eligibility</strong> based on general Indian banking norms. 
            Final loan approval, FOIR, LTV ratio, interest rate, processing charges, and tenure <strong>may vary significantly</strong> by:
          </p>
          <ul style={{ marginTop: '0.75rem', marginBottom: 0, paddingLeft: '1.5rem', color: '#374151' }}>
            <li>Bank or NBFC policy (PSU banks, private banks, housing finance companies)</li>
            <li>Applicant’s credit score (CIBIL 750+ gets better terms)</li>
            <li>Employment type, stability, and company profile</li>
            <li>City/location of property (metro vs tier-2/tier-3 cities)</li>
            <li>Property type (ready vs under-construction, residential vs commercial)</li>
            <li>Existing relationship with the bank (salary account, deposits, etc.)</li>
          </ul>
          <p style={{ fontSize: '0.9rem', marginTop: '0.75rem', marginBottom: 0, color: '#6b7280', fontStyle: 'italic' }}>
            📌 <strong>Income Weightage:</strong> Co-applicant income weighted at 75%, rental/other income at 60% as per typical banking practice. Actual weightage may vary.
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: 0, color: '#6b7280', fontStyle: 'italic' }}>
            📌 <strong>RBI LTV Caps:</strong> ≤₹30L: 90%, ₹30-75L: 80%, &gt;₹75L: 75% — programmatically enforced in this calculator.
          </p>
        </div>

        {/* SEO Content Section */}
        <div className="seo-content-section">
          <div className="content-block">
            <h2>How to Calculate Home Loan Eligibility in India</h2>
            <p>
              Indian banks and NBFCs use two primary criteria to determine your home loan eligibility:
            </p>
            <ol>
              <li><strong>FOIR (Fixed Obligation to Income Ratio):</strong> Your total monthly EMIs (including the new home loan) should not exceed 50-60% of your gross monthly income.</li>
              <li><strong>LTV (Loan-to-Value Ratio):</strong> As per RBI guidelines, banks can lend up to 75-90% of the property value depending on the loan amount.</li>
            </ol>
            <div className="formula-box">
              <strong>Max EMI = (Monthly Income × FOIR%) - Existing EMIs</strong><br />
              <strong>Max Loan by LTV = Property Value × LTV%</strong>
            </div>
            <p>Your actual eligible loan will be the lower of these two amounts.</p>
          </div>

          <div className="content-block">
            <h2>Understanding Home Loan Eligibility Criteria in India</h2>
            
            <h3>1. FOIR (Fixed Obligation to Income Ratio)</h3>
            <p>
              FOIR is the percentage of your monthly income that goes toward EMI payments. Most Indian banks allow FOIR of 50-60%:
            </p>
            <ul>
              <li><strong>Salaried Employees:</strong> 50-55% FOIR</li>
              <li><strong>Self-Employed:</strong> 50-60% FOIR</li>
              <li><strong>High Income (₹10L+ annually):</strong> Up to 65% FOIR</li>
            </ul>

            <h3>2. LTV (Loan-to-Value) Ratio - RBI Guidelines</h3>
            <p>RBI mandates maximum LTV ratios based on loan amount:</p>
            <ul>
              <li><strong>Up to ₹30 lakhs:</strong> 90% LTV (10% down payment)</li>
              <li><strong>₹30 lakhs - ₹75 lakhs:</strong> 80% LTV (20% down payment)</li>
              <li><strong>Above ₹75 lakhs:</strong> 75% LTV (25% down payment)</li>
            </ul>

            <h3>3. Income Considerations & Weightage</h3>
            <p>Banks apply different weightage to various income sources:</p>
            <ul>
              <li><strong>Primary Income:</strong> Salary, business income (100% weightage)</li>
              <li><strong>Co-Applicant Income:</strong> Spouse, parent, or child (50-100% weightage, typically 75%)</li>
              <li><strong>Rental Income:</strong> From existing properties (50-70% weightage, typically 60%)</li>
              <li><strong>Other Income:</strong> Investment returns, freelance work (40-60% weightage, case-by-case)</li>
            </ul>
            <p style={{ 
              padding: '0.75rem', 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '6px',
              marginTop: '0.75rem',
              fontSize: '0.95rem'
            }}>
              <strong>ℹ️ This calculator applies conservative weightage:</strong> Co-applicant at 75%, Rental/Other at 60%
            </p>

            <h3>4. Age Factor</h3>
            <p>
              Maximum loan tenure is limited by retirement age:
            </p>
            <ul>
              <li><strong>Salaried:</strong> Up to 60-65 years of age</li>
              <li><strong>Self-Employed:</strong> Up to 65-70 years of age</li>
              <li><strong>Maximum Tenure:</strong> Typically 30 years</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Home Loan Processing Fees and Charges in India</h2>
            <p>Apart from the loan amount and interest, consider these costs:</p>
            
            <h3>Upfront Costs:</h3>
            <ul>
              <li><strong>Processing Fee:</strong> 0.25% - 1% of loan amount (₹5,000 - ₹50,000 typically)</li>
              <li><strong>Stamp Duty & Registration:</strong> 5-8% of property value (varies by state)</li>
              <li><strong>GST on Under-Construction:</strong> 1% (non-affordable) or 5% (affordable housing)</li>
              <li><strong>Legal & Technical Valuation:</strong> ₹5,000 - ₹25,000</li>
              <li><strong>Documentation Charges:</strong> ₹2,000 - ₹10,000</li>
            </ul>

            <h3>Ongoing Costs:</h3>
            <ul>
              <li><strong>Prepayment Charges:</strong> 0-3% for fixed-rate loans (nil for floating-rate)</li>
              <li><strong>Late Payment Penalty:</strong> 2% per month on overdue EMI</li>
              <li><strong>Conversion Charges:</strong> ₹5,000 - ₹10,000 for balance transfer</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Tips to Improve Your Home Loan Eligibility</h2>
            <ul>
              <li><strong>Add a Co-Applicant:</strong> Joint applications with working spouse can increase eligibility by 50-70%</li>
              <li><strong>Close Existing Loans:</strong> Pay off personal loans and credit cards before applying</li>
              <li><strong>Improve Credit Score:</strong> Maintain CIBIL score above 750 for best rates</li>
              <li><strong>Increase Tenure:</strong> Opt for 25-30 years to reduce EMI and increase eligibility</li>
              <li><strong>Show Additional Income:</strong> Include rental income, business income with proper documentation</li>
              <li><strong>Opt for Step-Up Loans:</strong> Some banks offer lower initial EMI with annual increments</li>
              <li><strong>Larger Down Payment:</strong> 25-30% down payment can get you better interest rates</li>
              <li><strong>Choose Right Bank:</strong> Different banks have different FOIR norms and policies</li>
            </ul>
          </div>

          <div className="content-block">
            <h2>Tax Benefits on Home Loans in India</h2>
            <p>Home loan borrowers can claim significant tax deductions:</p>
            <ul>
              <li><strong>Section 80C:</strong> Up to ₹1.5 lakh deduction on principal repayment</li>
              <li><strong>Section 24(b):</strong> Up to ₹2 lakh deduction on interest paid (self-occupied)</li>
              <li><strong>Section 80EEA:</strong> Additional ₹1.5 lakh interest deduction for first-time buyers</li>
              <li><strong>Section 80EE:</strong> Additional ₹50,000 for first-time buyers (loan sanctioned before March 2017)</li>
            </ul>
            <p>Total maximum tax benefit: Up to ₹5 lakh per year for first-time home buyers!</p>
          </div>

          <div className="content-block faq-section">
            <h2>India Home Loan Eligibility FAQ</h2>
            
            <div className="faq-item">
              <h3>How much home loan can I get on ₹50,000 monthly salary?</h3>
              <p>
                With ₹50,000 monthly salary (₹6 lakhs annual) and 50% FOIR, you can afford approximately ₹25,000 EMI. 
                At 8.5% interest for 20 years, this translates to approximately ₹30 lakhs loan eligibility. With a co-applicant 
                earning similar income, you could qualify for ₹60 lakhs or more.
              </p>
            </div>

            <div className="faq-item">
              <h3>What is the minimum salary required for a home loan in India?</h3>
              <p>
                Most banks require minimum monthly income of ₹25,000 for salaried individuals in metros, and ₹20,000 in 
                non-metros. Self-employed individuals typically need minimum annual income of ₹3-4 lakhs with proper ITR documentation.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do all banks use the same FOIR percentage?</h3>
              <p>
                No, FOIR varies by bank and profile. Public sector banks typically use 50-55% FOIR, while private banks and 
                NBFCs may allow up to 60-65% for high-income borrowers. Some banks offer higher FOIR for existing customers 
                with good banking relationships.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I get a home loan with existing personal loan EMI?</h3>
              <p>
                Yes, but your existing EMI will reduce available home loan eligibility. Banks deduct existing EMIs from your 
                maximum allowable EMI. It's advisable to close high-interest loans (personal loans, credit cards) before 
                applying for home loan to maximize eligibility.
              </p>
            </div>

            <div className="faq-item">
              <h3>What is the maximum home loan tenure in India?</h3>
              <p>
                Maximum tenure is typically 30 years, but it depends on your age. Most banks cap the loan tenure such that 
                it ends by your retirement age (60-65 for salaried, 65-70 for self-employed). For example, a 35-year-old 
                can get 25-30 years tenure, while a 50-year-old may only get 10-15 years.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is joint home loan better than individual loan?</h3>
              <p>
                Yes, joint home loans offer multiple benefits: (1) Combined income increases eligibility by 50-70%, 
                (2) Both applicants can claim tax deductions, (3) Lower interest rates in some cases, (4) Women co-applicants 
                may get 0.05% interest rate concession. However, both applicants are equally liable for repayment.
              </p>
            </div>

            <div className="faq-item">
              <h3>How does credit score affect home loan eligibility?</h3>
              <p>
                CIBIL score significantly impacts both eligibility and interest rate. Score 750+: Best rates and easy approval. 
                Score 700-749: Good rates with standard approval. Score 650-699: Higher rates, stricter conditions. 
                Below 650: Difficult to get approval, may require co-applicant or larger down payment.
              </p>
            </div>
          </div>

          <div className="related-calculators">
            <h2>Related Home Loan Calculators</h2>
            <p>Explore our other India home loan calculators</p>
            <div className="calculator-grid">
              <Link to="/emi-calculator" className="calc-card">
                <h3>🏠 Home Loan EMI Calculator</h3>
                <p>Calculate monthly EMI with amortization</p>
              </Link>
              <Link to="/india/calculators/property-registration" className="calc-card">
                <h3>📋 Property Registration Calculator</h3>
                <p>Stamp duty and registration charges</p>
              </Link>
              <Link to="/sip-calculator" className="calc-card">
                <h3>💰 Investment Calculator</h3>
                <p>Plan savings for down payment</p>
              </Link>
              <Link to="/calculators" className="calc-card">
                <h3>🧮 All Calculators</h3>
                <p>View complete calculator collection</p>
              </Link>
            </div>
          </div>
        </div>

        <AEOContentSection tool="homeloan" country={country} />
      </div>

      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MortgageLoan",
        "name": "India Home Loan Eligibility Calculator",
        "description": "Calculate home loan eligibility in India based on FOIR, LTV, and RBI guidelines. Includes processing fees, stamp duty, and GST calculations.",
        "provider": {"@type": "Organization", "name": "VegaKash.AI"},
        "applicationCategory": "FinanceApplication",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "INR"},
        "featureList": [
          "FOIR-based eligibility calculation",
          "LTV ratio compliance check",
          "Processing fee estimation",
          "Stamp duty calculator",
          "GST calculation for under-construction",
          "Co-applicant income consideration",
          "Multiple income source support"
        ]
      })}</script>
    </>
  );
}

export default HomeLoanEligibilityIndia;
