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
 * Generate yearly amortization schedule
 * 
 * @param {Object} emiResult - Result from calculateEMI
 * @param {number} principal - Loan amount
 * @param {number} tenure - Loan tenure in years
 * @returns {Array} Yearly amortization data
 */
export const generateYearlyAmortization = (emiResult, principal, tenure) => {
  if (!emiResult) return [];

  const { emi, monthlyRate, totalMonths } = emiResult;
  let balance = principal;
  const schedule = [];

  for (let year = 1; year <= tenure; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    
    const monthsInYear = year === tenure ? (totalMonths % 12 || 12) : 12;
    
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
 * Generate monthly amortization schedule
 * 
 * @param {Object} emiResult - Result from calculateEMI
 * @param {number} principal - Loan amount
 * @returns {Array} Monthly amortization data
 */
export const generateMonthlyAmortization = (emiResult, principal) => {
  if (!emiResult) return [];

  const { emi, monthlyRate, totalMonths } = emiResult;
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= totalMonths; month++) {
    if (balance <= 0) break;
    
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(emi - interestPayment, balance);
    
    balance = Math.max(0, balance - principalPayment);
    
    schedule.push({
      month,
      emi: Math.round(emi),
      principalPaid: Math.round(principalPayment),
      interestPaid: Math.round(interestPayment),
      balance: Math.round(balance)
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
 * Calculate savings from prepayment
 * 
 * @param {Object} currentEMI - Current EMI result
 * @param {number} prepaymentAmount - Prepayment amount
 * @param {number} remainingMonths - Remaining months
 * @returns {Object} Savings calculation
 */
export const calculatePrepaymentSavings = (currentEMI, prepaymentAmount, remainingMonths) => {
  const { monthlyRate, emi } = currentEMI;
  const currentBalance = currentEMI.principal;
  
  // Calculate new balance after prepayment
  const newBalance = currentBalance - prepaymentAmount;
  
  // Calculate new tenure
  const newTenure = Math.ceil(
    Math.log(emi / (emi - (newBalance * monthlyRate))) / Math.log(1 + monthlyRate)
  );
  
  const monthsSaved = remainingMonths - newTenure;
  const interestSaved = (monthsSaved * emi) - (newBalance - (emi - (newBalance * monthlyRate)) * newTenure);
  
  return {
    newBalance: Math.round(newBalance),
    monthsSaved,
    newTenure,
    interestSaved: Math.round(interestSaved)
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
  }
};
