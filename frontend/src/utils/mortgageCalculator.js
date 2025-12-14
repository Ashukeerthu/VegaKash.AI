/**
 * US Mortgage Calculator Utilities
 * Production-grade calculation engine for mortgage payments
 */

/**
 * Calculate mortgage payment with PITI breakdown
 * @param {Object} inputs - Mortgage calculation inputs
 * @returns {Object} Complete mortgage calculation results
 */
export function calculateMortgage(inputs) {
  const {
    homePrice,
    downPayment, // percentage
    interestRate, // annual %
    years,
    includeCosts,
    propertyTax, // annual %
    homeInsurance, // annual $
    pmiRate, // annual %
    hoaFee, // monthly $
    otherCosts, // annual $
    startMonth,
    startYear
  } = inputs;

  // Calculate loan amount
  const loanAmount = homePrice * (1 - downPayment / 100);
  const P = parseFloat(loanAmount);
  const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
  const n = parseFloat(years) * 12; // Total months

  // Validation
  if (!P || !n || P <= 0 || n <= 0) {
    return null;
  }

  // Calculate Principal + Interest (handle 0% interest case)
  let principalInterest;
  if (r === 0) {
    // Special case: 0% interest
    principalInterest = P / n;
  } else if (r < 0) {
    return null; // Invalid negative interest
  } else {
    // Standard mortgage formula: M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
    principalInterest = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  // Additional monthly costs (PITI components)
  let monthlyPropertyTax = 0;
  let monthlyHomeInsurance = 0;
  let monthlyPMI = 0;
  let monthlyOther = 0;

  if (includeCosts) {
    monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
    monthlyHomeInsurance = homeInsurance / 12;
    
    // PMI only applies if down payment < 20%
    monthlyPMI = downPayment < 20 ? (P * (pmiRate / 100)) / 12 : 0;
    
    monthlyOther = (parseFloat(hoaFee) || 0) + (parseFloat(otherCosts) / 12);
  }

  // Total monthly payment
  const totalMonthlyPayment = principalInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + monthlyOther;
  
  // Total amounts over loan term
  const totalPrincipalInterest = principalInterest * n;
  const totalInterest = totalPrincipalInterest - P;
  const downPaymentAmount = homePrice - P;

  // Calculate payoff date
  const payoffDate = calculatePayoffDate(startMonth, startYear, n);

  // Calculate PMI drop-off month (when equity reaches 20%)
  const pmiDropOffMonth = calculatePMIDropOff(P, principalInterest, r, downPayment);

  // Generate amortization schedule
  const amortizationSchedule = generateAmortizationSchedule(P, principalInterest, r, n, startMonth, startYear);

  return {
    monthlyPayment: totalMonthlyPayment.toFixed(2),
    principalInterest: principalInterest.toFixed(2),
    monthlyPropertyTax: monthlyPropertyTax.toFixed(2),
    monthlyHomeInsurance: monthlyHomeInsurance.toFixed(2),
    monthlyPMI: monthlyPMI.toFixed(2),
    monthlyOther: monthlyOther.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    totalAmount: totalPrincipalInterest.toFixed(2),
    loanAmount: P.toFixed(2),
    downPaymentAmount: downPaymentAmount.toFixed(2),
    payoffDate: payoffDate,
    pmiDropOffMonth: pmiDropOffMonth,
    hasAdditionalCosts: includeCosts,
    amortizationSchedule: amortizationSchedule
  };
}

/**
 * Calculate mortgage payoff date
 * @param {string} startMonth - Starting month (e.g., "Dec")
 * @param {number} startYear - Starting year (e.g., 2025)
 * @param {number} totalMonths - Total loan term in months
 * @returns {string} Payoff date (e.g., "Dec. 2055")
 */
function calculatePayoffDate(startMonth, startYear, totalMonths) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonthIndex = months.indexOf(startMonth);
  
  if (startMonthIndex === -1) {
    return 'Invalid Date';
  }

  const payoffMonthIndex = (startMonthIndex + totalMonths) % 12;
  const payoffYear = parseInt(startYear) + Math.floor((startMonthIndex + totalMonths) / 12);
  
  return `${months[payoffMonthIndex]}. ${payoffYear}`;
}

/**
 * Calculate when PMI can be dropped (when equity reaches 20%)
 * @param {number} loanAmount - Original loan amount
 * @param {number} monthlyPI - Monthly principal + interest payment
 * @param {number} monthlyRate - Monthly interest rate
 * @param {number} downPaymentPercent - Down payment percentage
 * @returns {number|null} Month number when PMI drops off, or null if not applicable
 */
function calculatePMIDropOff(loanAmount, monthlyPI, monthlyRate, downPaymentPercent) {
  // PMI only applies if down payment < 20%
  if (downPaymentPercent >= 20) {
    return null;
  }

  // Calculate when loan balance reaches 80% of original (20% equity)
  const targetBalance = loanAmount * 0.8;
  let balance = loanAmount;
  let month = 0;

  // Simulate amortization until 20% equity is reached
  while (balance > targetBalance && month < 360) {
    month++;
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPI - interestPayment;
    balance -= principalPayment;
  }

  return month <= 360 ? month : null;
}

/**
 * Generate complete amortization schedule
 * @param {number} loanAmount - Original loan amount
 * @param {number} monthlyPayment - Monthly principal + interest payment
 * @param {number} monthlyRate - Monthly interest rate
 * @param {number} totalMonths - Total loan term in months
 * @param {string} startMonth - Starting month
 * @param {number} startYear - Starting year
 * @returns {Object} Amortization schedule with yearly and monthly data
 */
function generateAmortizationSchedule(loanAmount, monthlyPayment, monthlyRate, totalMonths, startMonth, startYear) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonthIndex = months.indexOf(startMonth);
  
  let balance = loanAmount;
  const monthlySchedule = [];
  const yearlySchedule = [];
  
  let currentYear = parseInt(startYear);
  let currentMonthIndex = startMonthIndex;
  
  // Generate monthly schedule
  for (let month = 1; month <= totalMonths; month++) {
    if (balance <= 0) break;
    
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
    balance = Math.max(0, balance - principalPayment);
    
    monthlySchedule.push({
      month: month,
      date: `${months[currentMonthIndex]} ${currentYear}`,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: balance
    });
    
    // Move to next month
    currentMonthIndex++;
    if (currentMonthIndex === 12) {
      currentMonthIndex = 0;
      currentYear++;
    }
  }
  
  // Generate yearly summary
  balance = loanAmount;
  const years = Math.ceil(totalMonths / 12);
  
  for (let year = 1; year <= years; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    const startBalance = balance;
    
    const monthsInYear = year === years ? (totalMonths % 12 || 12) : 12;
    
    for (let month = 1; month <= monthsInYear; month++) {
      if (balance <= 0) break;
      
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
      
      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      balance = Math.max(0, balance - principalPayment);
    }
    
    yearlySchedule.push({
      year: year,
      yearLabel: `Year ${year}`,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      balance: balance,
      totalPayment: yearlyPrincipal + yearlyInterest
    });
  }
  
  return {
    monthly: monthlySchedule,
    yearly: yearlySchedule
  };
}

/**
 * Debounce function to prevent excessive calculations
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
