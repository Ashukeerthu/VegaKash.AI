/**
 * EMI Calculator Business Logic
 * 
 * @module modules/calculators/emi/emiUtils
 * @description Pure functions for EMI calculations and related utilities
 * Separated from UI for better testing and reusability
 */

/**
 * Calculate EMI using standard formula
 * 
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenureYears - Loan tenure in years
 * @returns {Object} EMI calculation results
 */
export const calculateEMI = (principal, annualRate, tenureYears) => {
  const P = parseFloat(principal);
  const r = parseFloat(annualRate) / 12 / 100; // Monthly interest rate
  const n = parseFloat(tenureYears) * 12; // Total months

  if (!P || !r || !n || P <= 0 || r < 0 || n <= 0) {
    return null;
  }

  // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - P;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    principal: Math.round(P),
    monthlyRate: r,
    totalMonths: n
  };
};

/**
 * Generate yearly amortization schedule with prepayment support
 * 
 * @param {Object} emiResult - Result from calculateEMIWithPrepayment or calculateEMI
 * @param {number} principal - Loan amount
 * @param {number} tenure - Loan tenure in years
 * @returns {Array} Yearly amortization data
 */
export const generateYearlyAmortization = (emiResult, principal, tenure) => {
  if (!emiResult) return [];

  const { finalEmi, monthlyRate, totalMonths, adjustedMonths, prepaymentMonthApplied, prepaymentApplied } = emiResult;
  const emi = finalEmi || emiResult.emi; // Use finalEmi for consistency
  let balance = principal;
  const schedule = [];

  const months = adjustedMonths || totalMonths;
  const years = Math.ceil(months / 12);

  for (let year = 1; year <= years; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    
    const monthsInYear = year === years ? (months % 12 || 12) : 12;
    
    for (let month = 1; month <= monthsInYear; month++) {
      if (balance <= 0) break;
      
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(emi - interestPayment, balance);
      
      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      balance = Math.max(0, balance - principalPayment);
    }
    
    schedule.push({
      year,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
      balance: Math.round(balance)
    });
  }

  return schedule;
};

/**
 * Generate monthly amortization schedule with prepayment support
 * 
 * @param {Object} emiResult - Result from calculateEMIWithPrepayment or calculateEMI
 * @param {number} principal - Loan amount
 * @returns {Array} Monthly amortization data
 */
export const generateMonthlyAmortization = (emiResult, principal) => {
  if (!emiResult) return [];

  const { finalEmi, monthlyRate, totalMonths, adjustedMonths, prepaymentMonthApplied, prepaymentApplied } = emiResult;
  const emi = finalEmi || emiResult.emi; // Use finalEmi for consistency
  let balance = principal;
  const schedule = [];

  const months = adjustedMonths || totalMonths;

  for (let month = 1; month <= months; month++) {
    if (balance <= 0) break;
    
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(emi - interestPayment, balance);
    
    balance = Math.max(0, balance - principalPayment);
    
    schedule.push({
      month,
      year: Math.ceil(month / 12),
      emi: Math.round(emi),
      principalPaid: Math.round(principalPayment),
      interestPaid: Math.round(interestPayment),
      balance: Math.round(balance),
      isPrepaymentMonth: prepaymentApplied && month === prepaymentMonthApplied
    });
  }

  return schedule;
};

/**
 * Calculate loan eligibility based on income
 * 
 * @param {number} monthlyIncome - Monthly income
 * @param {number} existingEMI - Existing EMI obligations
 * @param {number} foir - Fixed Obligation to Income Ratio (default 50%)
 * @returns {number} Maximum eligible EMI
 */
export const calculateEligibleEMI = (monthlyIncome, existingEMI = 0, foir = 0.5) => {
  return Math.round((monthlyIncome * foir) - existingEMI);
};

/**
 * Calculate maximum loan amount based on EMI affordability
 * 
 * @param {number} affordableEMI - EMI you can afford
 * @param {number} annualRate - Annual interest rate
 * @param {number} tenureYears - Loan tenure in years
 * @returns {number} Maximum loan amount
 */
export const calculateMaxLoanAmount = (affordableEMI, annualRate, tenureYears) => {
  const r = parseFloat(annualRate) / 12 / 100;
  const n = parseFloat(tenureYears) * 12;
  
  // Reverse EMI formula to get Principal
  // P = EMI × ((1 + r)^n - 1) / (r × (1 + r)^n)
  const maxPrincipal = affordableEMI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
  
  return Math.round(maxPrincipal);
};

/**
 * Compare EMI for different tenures
 * 
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Interest rate
 * @param {Array<number>} tenures - Array of tenures to compare
 * @returns {Array} Comparison data
 */
export const compareEMIByTenure = (principal, annualRate, tenures) => {
  return tenures.map(tenure => {
    const result = calculateEMI(principal, annualRate, tenure);
    return {
      tenure,
      ...result
    };
  });
};

/**
 * Calculate EMI with prepayment scenarios
 * 
 * @param {Object} params - Prepayment parameters
 * @returns {Object} Complete EMI calculation with prepayment impact
 */
export const calculateEMIWithPrepayment = ({
  principal,
  annualRate,
  tenureYears,
  prepaymentAmount = 0,
  prepaymentYear = 0,
  prepaymentOption = 'tenure', // 'tenure' or 'emi'
  prepaymentPenalty = 0
}) => {
  const P = parseFloat(principal);
  const r = parseFloat(annualRate) / 12 / 100;
  const n = parseFloat(tenureYears) * 12;

  if (!P || !r || !n || P <= 0) return null;

  // Calculate base EMI
  const baseEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  // No prepayment scenario
  if (!prepaymentAmount || !prepaymentYear || prepaymentYear > tenureYears) {
    const totalAmount = baseEmi * n;
    const totalInterest = totalAmount - P;

    return {
      baseEmi: Math.round(baseEmi),
      finalEmi: Math.round(baseEmi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principal: Math.round(P),
      totalMonths: n,
      adjustedMonths: n,
      monthlyRate: r,
      prepaymentApplied: false,
      prepaymentSavings: 0,
      prepaymentPenaltyCost: 0
    };
  }

  // With prepayment
  const prepayMonths = prepaymentYear * 12;
  let balance = P;
  let totalPaid = 0;
  let interestPaid = 0;

  // Calculate balance at prepayment point
  for (let month = 1; month <= prepayMonths; month++) {
    const interest = balance * r;
    const principalPmt = Math.min(baseEmi - interest, balance);
    balance -= principalPmt;
    totalPaid += baseEmi;
    interestPaid += interest;
  }

  // Apply prepayment with penalty
  const penaltyCost = prepaymentAmount * (prepaymentPenalty / 100);
  const effectivePrepayment = prepaymentAmount + penaltyCost;
  balance = Math.max(0, balance - prepaymentAmount);
  totalPaid += effectivePrepayment;

  // Loan fully paid
  if (balance <= 0) {
    return {
      baseEmi: Math.round(baseEmi),
      finalEmi: 0,
      totalInterest: Math.round(interestPaid),
      totalAmount: Math.round(totalPaid),
      principal: Math.round(P),
      totalMonths: n,
      adjustedMonths: prepayMonths,
      monthlyRate: r,
      prepaymentApplied: true,
      prepaymentMonthApplied: prepayMonths,
      prepaymentSavings: Math.round((baseEmi * n) - totalPaid),
      prepaymentPenaltyCost: Math.round(penaltyCost)
    };
  }

  let finalEmi = baseEmi;
  let adjustedMonths = n;

  if (prepaymentOption === 'tenure') {
    // Reduce tenure, keep EMI same
    const remainingTenure = Math.log(finalEmi / (finalEmi - balance * r)) / Math.log(1 + r);
    const remainingMonths = Math.max(1, Math.ceil(remainingTenure));
    adjustedMonths = prepayMonths + remainingMonths;
    const totalAmount = totalPaid + (finalEmi * remainingMonths);
    const totalInterest = totalAmount - P;

    return {
      baseEmi: Math.round(baseEmi),
      finalEmi: Math.round(finalEmi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principal: Math.round(P),
      totalMonths: n,
      adjustedMonths: Math.ceil(adjustedMonths),
      monthlyRate: r,
      prepaymentApplied: true,
      prepaymentMonthApplied: prepayMonths,
      prepaymentSavings: Math.round((baseEmi * n) - totalAmount),
      prepaymentPenaltyCost: Math.round(penaltyCost)
    };
  } else {
    // Reduce EMI, keep tenure same
    const remainingMonths = Math.max(1, Math.ceil(n - prepayMonths));
    finalEmi = (balance * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
    adjustedMonths = prepayMonths + remainingMonths;
    const totalAmount = totalPaid + (finalEmi * remainingMonths);
    const totalInterest = totalAmount - P;

    return {
      baseEmi: Math.round(baseEmi),
      finalEmi: Math.round(finalEmi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principal: Math.round(P),
      totalMonths: n,
      adjustedMonths: Math.ceil(adjustedMonths),
      monthlyRate: r,
      prepaymentApplied: true,
      prepaymentMonthApplied: prepayMonths,
      prepaymentSavings: Math.round((baseEmi * n) - totalAmount),
      prepaymentPenaltyCost: Math.round(penaltyCost)
    };
  }
};

/**
 * Calculate flat interest EMI and convert to effective rate
 * 
 * @param {Object} params - Flat interest parameters
 * @returns {Object} Flat interest calculation with effective rate
 */
export const calculateFlatInterestEMI = ({ principal, annualRate, tenureYears }) => {
  const P = parseFloat(principal);
  const flatRate = parseFloat(annualRate) / 100;
  const years = parseFloat(tenureYears);

  if (!P || !flatRate || !years || P <= 0) return null;

  // Flat interest calculation
  const flatInterest = P * flatRate * years;
  const totalAmount = P + flatInterest;
  const n = years * 12;
  const emi = totalAmount / n;

  // Convert flat to effective rate (approximate)
  // Effective rate ≈ Flat rate × 1.9
  const effectiveRate = flatRate * 1.9 * 100;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(flatInterest),
    totalAmount: Math.round(totalAmount),
    principal: Math.round(P),
    totalMonths: n,
    flatRate: annualRate,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    interestMethod: 'flat'
  };
};

/**
 * Calculate eligibility for a loan
 * 
 * @param {Object} params - Eligibility parameters
 * @returns {Object} Eligibility calculation
 */
export const calculateLoanEligibility = ({
  monthlyIncome,
  existingEMI = 0,
  foir = 50, // Fixed Obligation to Income Ratio (%)
  interestRate,
  tenure
}) => {
  const income = parseFloat(monthlyIncome);
  const existing = parseFloat(existingEMI);
  const foirPercent = parseFloat(foir) / 100;
  const rate = parseFloat(interestRate) / 12 / 100;
  const months = parseFloat(tenure) * 12;

  if (!income || income <= 0) return null;

  const maxEmiFoir = (income * foirPercent) - existing;
  const minDisposable = 15000; // Minimum disposable income required
  const disposableIncome = income - existing - maxEmiFoir;
  const baseMaxEmi = Math.max(0, maxEmiFoir);

  if (baseMaxEmi <= 0 || disposableIncome < minDisposable) {
    return {
      eligible: false,
      maxEMI: 0,
      maxLoanAmount: 0,
      message: disposableIncome < minDisposable
        ? 'Disposable income below minimum threshold (₹15,000).'
        : 'Existing EMI is too high. Reduce obligations to become eligible.'
    };
  }

  // Calculate max loan using reverse EMI formula
  const maxLoan = baseMaxEmi * ((Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months)));
  const recommendedDownPayment = maxLoan * 0.2; // 20% down payment
  const propertyValue = maxLoan / 0.8; // 80% LTV
  const ltv = 0.8;
  const salaryToLoanRatio = maxLoan / (income * 12);

  return {
    eligible: true,
    maxEMI: Math.round(baseMaxEmi),
    maxLoanAmount: Math.round(maxLoan),
    recommendedDownPayment: Math.round(recommendedDownPayment),
    propertyValue: Math.round(propertyValue),
    ltv: ltv,
    salaryToLoanRatio: Math.round(salaryToLoanRatio * 10) / 10,
    disposableIncome: Math.round(income - existing - baseMaxEmi),
    message: `You are eligible for a loan up to ₹${formatIndianCurrency(maxLoan)}`
  };
};

/**
 * Calculate balance transfer savings
 * 
 * @param {Object} params - Balance transfer parameters
 * @returns {Object} Balance transfer analysis
 */
export const calculateBalanceTransfer = ({
  currentOutstanding,
  currentRate,
  newRate,
  remainingTenure,
  processingFee = 0,
  closurePenalty = 1 // Default 1%
}) => {
  const outstanding = parseFloat(currentOutstanding);
  const currentR = parseFloat(currentRate) / 12 / 100;
  const newR = parseFloat(newRate) / 12 / 100;
  const months = parseFloat(remainingTenure) * 12;
  const fees = parseFloat(processingFee);

  if (!outstanding || outstanding <= 0 || months <= 0) return null;

  // Current EMI
  const currentEMI = (outstanding * currentR * Math.pow(1 + currentR, months)) / (Math.pow(1 + currentR, months) - 1);
  const currentTotal = currentEMI * months;

  // New EMI after transfer
  const newEMI = (outstanding * newR * Math.pow(1 + newR, months)) / (Math.pow(1 + newR, months) - 1);
  
  // Switching costs
  const exitPenalty = outstanding * (closurePenalty / 100);
  const stampDuty = outstanding * 0.002; // 0.2% nominal stamp duty
  const switchingCharges = fees + exitPenalty + stampDuty;
  const newTotal = (newEMI * months) + switchingCharges;

  // Savings analysis
  const savings = currentTotal - newTotal;
  const monthlySavings = currentEMI - newEMI;
  const breakevenMonths = switchingCharges / Math.max(monthlySavings, 1);

  return {
    currentEMI: Math.round(currentEMI),
    newEMI: Math.round(newEMI),
    monthlySavings: Math.round(monthlySavings),
    totalSavings: Math.round(savings),
    breakevenMonths: Math.ceil(breakevenMonths),
    worthIt: savings > 0 && breakevenMonths < months,
    processingFee: Math.round(fees),
    switchingCharges: Math.round(switchingCharges),
    exitPenalty: Math.round(exitPenalty),
    stampDuty: Math.round(stampDuty),
    recommendation: savings > 0 && breakevenMonths < months
      ? `✅ Recommended! You'll break even in ${Math.ceil(breakevenMonths)} months and save ₹${formatIndianCurrency(savings)} overall.`
      : `❌ Not recommended. Break-even period (${Math.ceil(breakevenMonths)} months) is too long or total savings are negative.`
  };
};

/**
 * Format currency in Indian format
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatIndianCurrency = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

/**
 * Calculate EMI with interest-only period (moratorium/construction period)
 * Common in education loans, construction loans, and business loans
 * 
 * @param {Object} params - Interest-only calculation parameters
 * @returns {Object} Complete calculation with interest-only period
 */
export const calculateEMIWithInterestOnly = ({
  principal,
  annualRate,
  tenureYears,
  interestOnlyMonths = 0, // Months with interest-only payment
  payInterestDuringMoratorium = true // Pay interest or capitalize it
}) => {
  const P = parseFloat(principal);
  const r = parseFloat(annualRate) / 12 / 100;
  const totalMonths = parseFloat(tenureYears) * 12;
  const moratoriumMonths = parseInt(interestOnlyMonths);

  if (!P || !r || !totalMonths || P <= 0) return null;

  // No moratorium - standard EMI
  if (moratoriumMonths <= 0) {
    return calculateEMI(principal, annualRate, tenureYears);
  }

  let result = {
    principal: Math.round(P),
    annualRate: annualRate,
    totalMonths: totalMonths,
    moratoriumMonths: moratoriumMonths,
    monthlyRate: r
  };

  if (payInterestDuringMoratorium) {
    // Pay interest during moratorium, then regular EMI
    const monthlyInterest = P * r;
    const totalInterestPaidDuringMoratorium = monthlyInterest * moratoriumMonths;
    
    // Calculate EMI for remaining tenure
    const remainingMonths = totalMonths - moratoriumMonths;
    const emi = (P * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
    
    const totalInterestAfterMoratorium = (emi * remainingMonths) - P;
    const totalInterest = totalInterestPaidDuringMoratorium + totalInterestAfterMoratorium;
    const totalAmount = P + totalInterest;

    return {
      ...result,
      interestOnlyEMI: Math.round(monthlyInterest),
      regularEMI: Math.round(emi),
      finalEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      interestDuringMoratorium: Math.round(totalInterestPaidDuringMoratorium),
      interestAfterMoratorium: Math.round(totalInterestAfterMoratorium),
      paymentStructure: 'interest-paid',
      moratoriumMonths: moratoriumMonths,
      regularPaymentMonths: remainingMonths
    };
  } else {
    // Capitalize interest during moratorium (add to principal)
    let accruedPrincipal = P;
    let totalAccruedInterest = 0;

    // Compound interest during moratorium
    for (let month = 1; month <= moratoriumMonths; month++) {
      const interest = accruedPrincipal * r;
      totalAccruedInterest += interest;
      accruedPrincipal += interest;
    }

    // Calculate EMI on new principal for remaining tenure
    const remainingMonths = totalMonths - moratoriumMonths;
    const emi = (accruedPrincipal * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
    
    const totalInterestAfterMoratorium = (emi * remainingMonths) - accruedPrincipal;
    const totalInterest = totalAccruedInterest + totalInterestAfterMoratorium;
    const totalAmount = P + totalInterest;

    return {
      ...result,
      interestOnlyEMI: 0,
      regularEMI: Math.round(emi),
      finalEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      interestDuringMoratorium: Math.round(totalAccruedInterest),
      interestAfterMoratorium: Math.round(totalInterestAfterMoratorium),
      accruedPrincipal: Math.round(accruedPrincipal),
      paymentStructure: 'interest-capitalized',
      moratoriumMonths: moratoriumMonths,
      regularPaymentMonths: remainingMonths,
      additionalPrincipal: Math.round(accruedPrincipal - P)
    };
  }
};

/**
 * Calculate bullet repayment (interest-only throughout, principal at end)
 * Common in business loans and short-term credit facilities
 * 
 * @param {Object} params - Bullet repayment parameters
 * @returns {Object} Bullet repayment calculation
 */
export const calculateBulletRepayment = ({
  principal,
  annualRate,
  tenureYears
}) => {
  const P = parseFloat(principal);
  const r = parseFloat(annualRate) / 12 / 100;
  const months = parseFloat(tenureYears) * 12;

  if (!P || !r || !months || P <= 0) return null;

  const monthlyInterest = P * r;
  const totalInterest = monthlyInterest * months;
  const totalAmount = P + totalInterest;

  return {
    monthlyInterestPayment: Math.round(monthlyInterest),
    principalAtEnd: Math.round(P),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    totalMonths: months,
    paymentStructure: 'bullet',
    finalPayment: Math.round(P) // Principal paid at end
  };
};

/**
 * Calculate step-up EMI (EMI increases periodically)
 * Useful for young professionals expecting salary growth
 * 
 * @param {Object} params - Step-up EMI parameters
 * @returns {Object} Step-up EMI calculation
 */
export const calculateStepUpEMI = ({
  principal,
  annualRate,
  tenureYears,
  stepUpPercentage = 5, // Annual EMI increase %
  stepUpFrequency = 12 // Increase every N months
}) => {
  const P = parseFloat(principal);
  const r = parseFloat(annualRate) / 12 / 100;
  const totalMonths = parseFloat(tenureYears) * 12;
  const stepUp = parseFloat(stepUpPercentage) / 100;
  const frequency = parseInt(stepUpFrequency);

  if (!P || !r || !totalMonths || P <= 0) return null;

  // This is a simplified step-up calculation
  // Real implementation requires iterative loan amortization
  
  // Calculate base EMI (lower initial EMI)
  const standardEMI = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
  const initialEMI = standardEMI * 0.7; // Start with 70% of standard EMI
  
  // Calculate steps
  const numberOfSteps = Math.floor(totalMonths / frequency);
  let currentEMI = initialEMI;
  let totalPaid = 0;
  let balance = P;
  
  const schedule = [];
  for (let step = 0; step <= numberOfSteps; step++) {
    const stepMonths = step === numberOfSteps ? (totalMonths % frequency || frequency) : frequency;
    
    for (let month = 1; month <= stepMonths && balance > 0; month++) {
      const interest = balance * r;
      const principal = Math.min(currentEMI - interest, balance);
      balance -= principal;
      totalPaid += currentEMI;
      
      if (month === 1) {
        schedule.push({
          step: step + 1,
          emi: Math.round(currentEMI),
          months: stepMonths
        });
      }
    }
    
    // Increase EMI for next step
    currentEMI = currentEMI * (1 + stepUp);
  }

  const totalInterest = totalPaid - P;

  return {
    initialEMI: Math.round(initialEMI),
    finalEMI: Math.round(currentEMI / (1 + stepUp)), // Last step EMI
    averageEMI: Math.round(totalPaid / totalMonths),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalPaid),
    principal: Math.round(P),
    totalMonths: totalMonths,
    stepSchedule: schedule,
    paymentStructure: 'step-up'
  };
};

/**
 * Default EMI configuration
 */
export const EMI_CONFIG = {
  loanAmount: {
    min: 100000,
    max: 50000000,
    step: 100000,
    default: 2500000
  },
  interestRate: {
    min: 5,
    max: 20,
    step: 0.1,
    default: 8.5
  },
  tenure: {
    min: 1,
    max: 30,
    step: 1,
    default: 20
  },
  paymentTypes: [
    { value: 'standard', label: 'Standard EMI', description: 'Equal monthly payments of principal + interest' },
    { value: 'interest-only', label: 'Interest-Only Period', description: 'Pay interest first, then regular EMI' },
    { value: 'bullet', label: 'Bullet Repayment', description: 'Interest monthly, principal at end' },
    { value: 'step-up', label: 'Step-Up EMI', description: 'EMI increases annually' }
  ]
};
