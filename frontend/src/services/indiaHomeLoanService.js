/**
 * India Home Loan Business Logic Service
 * 
 * Centralized service for home loan calculations following Indian banking standards.
 * Includes RBI guidelines, FOIR calculations, EMI formulas, and bank-specific rules.
 * 
 * This service can be:
 * - Unit tested independently
 * - Reused across multiple components
 * - Extended for bank comparison features
 * - Integrated with affiliate/API systems
 */

/**
 * Apply income weightage as per Indian banking standards
 * Primary: 100%, Co-applicant: 75%, Other income: 60%
 */
export const calculateWeightedIncome = (primaryIncome, spouseIncome, otherIncome) => {
  const coApplicantIncome = spouseIncome * 0.75;
  const rentalOtherIncome = otherIncome * 0.6;
  
  return {
    totalIncome: primaryIncome + spouseIncome + otherIncome,
    effectiveIncome: primaryIncome + coApplicantIncome + rentalOtherIncome,
    monthlyIncome: (primaryIncome + coApplicantIncome + rentalOtherIncome) / 12
  };
};

/**
 * Calculate maximum tenure based on applicant age and employment type
 * Salaried: Retirement at 60, Self-employed: 65
 */
export const calculateEffectiveTenure = (applicantAge, employmentType, requestedTenure) => {
  const retirementAge = employmentType === 'salaried' ? 60 : 65;
  const maxTenureByAge = retirementAge - applicantAge;
  const effectiveTenure = Math.min(requestedTenure, maxTenureByAge, 30);
  
  return {
    effectiveTenure,
    tenureCapped: effectiveTenure < requestedTenure,
    retirementAge,
    maxTenureByAge
  };
};

/**
 * Get bank-specific FOIR (Fixed Obligation to Income Ratio) cap
 * PSU: 55%, Private: 60%, NBFC: 65%
 */
export const getBankFOIR = (bankType, requestedFOIR) => {
  const foirCaps = {
    psu: 55,
    private: 60,
    nbfc: 65
  };
  
  const maxFOIR = foirCaps[bankType] || 60;
  return Math.min(requestedFOIR, maxFOIR);
};

/**
 * Calculate credit score impact on interest rate
 */
export const getCreditScoreAdjustment = (creditScore) => {
  const adjustments = {
    '750+': 0,
    '700-749': 0.25,
    '650-699': 0.75,
    'below-650': 1.5
  };
  
  return adjustments[creditScore] || 0;
};

/**
 * Get RBI LTV (Loan-to-Value) limits based on property value
 * ≤₹30L: 90%, ₹30-75L: 80%, >₹75L: 75%
 */
export const getRBIMaxLTV = (propertyValue) => {
  if (propertyValue <= 3000000) {
    return 90;
  } else if (propertyValue <= 7500000) {
    return 80;
  } else {
    return 75;
  }
};

/**
 * Calculate EMI using standard formula
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export const calculateEMI = (principal, annualRate, tenureYears) => {
  const r = annualRate / 100 / 12; // Monthly rate
  const n = tenureYears * 12; // Total months
  
  if (r === 0) {
    return principal / n;
  }
  
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
};

/**
 * Reverse EMI calculation to find maximum loan amount
 * P = EMI × [(1+r)^n - 1] / [r(1+r)^n]
 */
export const calculateMaxLoanByEMI = (maxEMI, annualRate, tenureYears) => {
  const r = annualRate / 100 / 12;
  const n = tenureYears * 12;
  
  if (r === 0) {
    return maxEMI * n;
  }
  
  return maxEMI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
};

/**
 * Calculate processing and registration charges
 */
export const calculateCharges = (loanAmount, propertyValue) => {
  // Processing fee: Typically 0.5% + GST
  const processingFee = loanAmount * 0.005;
  const gst = processingFee * 0.18;
  
  // Stamp duty varies by state; using 5% average
  const stampDutyAndRegistration = propertyValue * 0.05;
  
  // Legal charges: Flat fee
  const legalCharges = 15000;
  
  return {
    processingFee,
    gst,
    stampDutyAndRegistration,
    legalCharges,
    total: processingFee + gst + stampDutyAndRegistration + legalCharges
  };
};

/**
 * Calculate approval probability based on multiple factors
 * FOIR: 30%, LTV: 25%, Credit Score: 30%, Age: 15%
 */
export const calculateApprovalProbability = (params) => {
  const { foirUtilization, actualLTV, creditScore, applicantAge } = params;
  let score = 0;
  
  // FOIR component (30%)
  if (foirUtilization < 40) score += 30;
  else if (foirUtilization < 50) score += 25;
  else if (foirUtilization < 60) score += 15;
  else score += 5;
  
  // LTV component (25%)
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
};

/**
 * Calculate EMI difference for credit score improvement
 * More accurate than linear interest calculation
 */
export const calculateCreditScoreSavings = (loanAmount, baseRate, adjustedRate, tenureYears) => {
  const baseEMI = calculateEMI(loanAmount, baseRate, tenureYears);
  const adjustedEMI = calculateEMI(loanAmount, adjustedRate, tenureYears);
  
  return {
    monthlySavings: Math.round(adjustedEMI - baseEMI),
    yearlySavings: Math.round((adjustedEMI - baseEMI) * 12),
    totalSavings: Math.round((adjustedEMI - baseEMI) * tenureYears * 12)
  };
};

/**
 * Main home loan eligibility calculation
 */
export const calculateHomeLoanEligibility = (inputs) => {
  const {
    annualIncome,
    spouseIncome,
    otherIncome,
    existingEMI,
    interestRate,
    loanTenure,
    propertyValue,
    foir,
    ltv,
    applicantAge,
    employmentType,
    creditScore,
    bankType,
    includeCharges
  } = inputs;
  
  // 1. Calculate weighted income
  const income = calculateWeightedIncome(
    parseFloat(annualIncome),
    parseFloat(spouseIncome),
    parseFloat(otherIncome)
  );
  
  // 2. Calculate effective tenure
  const tenure = calculateEffectiveTenure(
    parseInt(applicantAge),
    employmentType,
    parseFloat(loanTenure)
  );
  
  if (tenure.effectiveTenure <= 0) {
    return {
      eligible: false,
      message: 'Your age does not permit a home loan. Please check your age or retirement age.'
    };
  }
  
  // 3. Get bank-specific FOIR
  const bankFOIR = getBankFOIR(bankType, parseFloat(foir));
  
  // 4. Calculate max EMI capacity
  const maxMonthlyEMI = (income.monthlyIncome * (bankFOIR / 100)) - parseFloat(existingEMI);
  
  if (maxMonthlyEMI <= 0) {
    return {
      eligible: false,
      message: 'Your existing EMI exceeds the maximum allowed FOIR. Please reduce existing obligations.'
    };
  }
  
  // 5. Apply credit score adjustment
  const rateAdjustment = getCreditScoreAdjustment(creditScore);
  const effectiveInterestRate = parseFloat(interestRate) + rateAdjustment;
  
  // 6. Calculate max loan by EMI capacity
  const maxLoanByEMI = calculateMaxLoanByEMI(
    maxMonthlyEMI,
    effectiveInterestRate,
    tenure.effectiveTenure
  );
  
  // 7. Get RBI LTV limit
  const propValue = parseFloat(propertyValue);
  const rbiMaxLTV = getRBIMaxLTV(propValue);
  const effectiveLTV = Math.min(parseFloat(ltv), rbiMaxLTV);
  
  // 8. Calculate max loan by LTV
  const maxLoanByLTV = propValue * (effectiveLTV / 100);
  
  // 9. Eligible loan is minimum of both
  const eligibleLoan = Math.min(maxLoanByEMI, maxLoanByLTV);
  
  // 10. Calculate actual EMI
  const monthlyEMI = calculateEMI(eligibleLoan, effectiveInterestRate, tenure.effectiveTenure);
  
  // 11. Calculate charges
  const downPayment = propValue - eligibleLoan;
  const charges = includeCharges ? calculateCharges(eligibleLoan, propValue) : {
    processingFee: 0,
    gst: 0,
    stampDutyAndRegistration: 0,
    legalCharges: 0,
    total: 0
  };
  
  // 12. Calculate total interest
  const totalAmountPayable = monthlyEMI * tenure.effectiveTenure * 12;
  const totalInterest = totalAmountPayable - eligibleLoan;
  
  // 13. Calculate FOIR and DTI
  const foirUtilization = Math.min(
    ((monthlyEMI + parseFloat(existingEMI)) / income.monthlyIncome * 100),
    100
  );
  const dti = foirUtilization;
  
  // 14. Calculate approval probability
  const actualLTV = (eligibleLoan / propValue) * 100;
  const approvalProbability = calculateApprovalProbability({
    foirUtilization,
    actualLTV,
    creditScore,
    applicantAge
  });
  
  // 15. Calculate typical multiplier range
  const typicalMultiplierMin = employmentType === 'salaried' ? 4 : 3;
  const typicalMultiplierMax = employmentType === 'salaried' ? 6 : 5;
  
  return {
    eligible: true,
    eligibleLoan: Math.round(eligibleLoan),
    monthlyEMI: Math.round(monthlyEMI),
    downPayment: Math.round(downPayment),
    totalIncome: Math.round(income.totalIncome),
    effectiveIncome: Math.round(income.effectiveIncome),
    monthlyIncome: Math.round(income.monthlyIncome),
    maxMonthlyEMI: Math.round(maxMonthlyEMI),
    propertyValue: Math.round(propValue),
    ltvUsed: ((eligibleLoan / propValue) * 100).toFixed(1),
    effectiveLTV: effectiveLTV.toFixed(1),
    rbiMaxLTV: rbiMaxLTV,
    effectiveTenure: tenure.effectiveTenure,
    requestedTenure: parseFloat(loanTenure),
    tenureCapped: tenure.tenureCapped,
    processingFee: Math.round(charges.processingFee),
    stampDutyAndRegistration: Math.round(charges.stampDutyAndRegistration),
    gst: Math.round(charges.gst),
    legalCharges: Math.round(charges.legalCharges),
    totalUpfrontCost: Math.round(downPayment + charges.total),
    totalAmountPayable: Math.round(totalAmountPayable),
    totalInterest: Math.round(totalInterest),
    foirUtilization: foirUtilization.toFixed(1),
    dti: dti.toFixed(1),
    incomeMultiplier: (eligibleLoan / income.effectiveIncome).toFixed(2),
    typicalMultiplierMin,
    typicalMultiplierMax,
    effectiveInterestRate: effectiveInterestRate.toFixed(2),
    creditScore,
    limitingFactor: maxLoanByEMI < maxLoanByLTV ? 'FOIR' : 'LTV',
    approvalProbability,
    bankType,
    bankFOIR
  };
};

export default {
  calculateWeightedIncome,
  calculateEffectiveTenure,
  getBankFOIR,
  getCreditScoreAdjustment,
  getRBIMaxLTV,
  calculateEMI,
  calculateMaxLoanByEMI,
  calculateCharges,
  calculateApprovalProbability,
  calculateCreditScoreSavings,
  calculateHomeLoanEligibility
};
