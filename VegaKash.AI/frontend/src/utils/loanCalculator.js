/**
 * US Loan Calculator Utility Functions
 * Provides calculation logic for loan payments, amortization schedules, and helper functions
 */

/**
 * Calculate loan payment details
 * @param {Object} inputs - Loan parameters
 * @param {number} inputs.loanAmount - Principal loan amount
 * @param {number} inputs.interestRate - Annual interest rate (percentage)
 * @param {number} inputs.years - Loan term in years
 * @param {string} inputs.loanType - Type of loan (auto, personal, student, home-equity, business, other)
 * @param {string} inputs.startMonth - Start month (Jan-Dec)
 * @param {number} inputs.startYear - Start year
 * @returns {Object} - Calculation results including monthly payment, total interest, and amortization schedule
 */
export function calculateLoan(inputs) {
  const {
    loanAmount,
    interestRate,
    years,
    loanType = 'personal',
    startMonth = 'Dec',
    startYear = 2025
  } = inputs;

  // Validate inputs
  if (!loanAmount || loanAmount <= 0 || !years || years <= 0) {
    return null;
  }

  const P = parseFloat(loanAmount);
  const annualRate = parseFloat(interestRate);
  const r = annualRate / 100 / 12; // Monthly interest rate
  const n = parseFloat(years) * 12; // Total number of payments

  // Handle 0% interest edge case
  if (annualRate === 0 || r === 0) {
    const monthlyPayment = P / n;
    const totalAmount = P;
    const totalInterest = 0;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      loanAmount: P.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      effectiveRate: '0.00',
      loanType,
      amortizationSchedule: generateAmortizationSchedule(
        P,
        0,
        n,
        startMonth,
        startYear
      ),
      payoffDate: calculatePayoffDate(startMonth, startYear, n)
    };
  }

  // Standard loan payment formula: M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
  const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = monthlyPayment * n;
  const totalInterest = totalAmount - P;

  // Calculate effective annual rate (APR)
  const effectiveRate = (Math.pow(1 + r, 12) - 1) * 100;

  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    loanAmount: P.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    effectiveRate: effectiveRate.toFixed(2),
    loanType,
    amortizationSchedule: generateAmortizationSchedule(
      P,
      monthlyPayment,
      n,
      startMonth,
      startYear
    ),
    payoffDate: calculatePayoffDate(startMonth, startYear, n)
  };
}

/**
 * Generate monthly and yearly amortization schedules
 * @param {number} principal - Loan amount
 * @param {number} monthlyPayment - Monthly payment amount
 * @param {number} totalMonths - Total number of monthly payments
 * @param {string} startMonth - Start month
 * @param {number} startYear - Start year
 * @returns {Object} - Monthly and yearly amortization arrays
 */
export function generateAmortizationSchedule(principal, monthlyPayment, totalMonths, startMonth, startYear) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonthIndex = monthNames.indexOf(startMonth);
  
  const monthly = [];
  const yearly = [];
  
  let balance = principal;
  let currentMonth = startMonthIndex;
  let currentYear = startYear;
  
  // For 0% interest
  if (monthlyPayment === 0) {
    const zeroInterestPayment = principal / totalMonths;
    for (let i = 1; i <= totalMonths; i++) {
      const principalPaid = zeroInterestPayment;
      balance -= principalPaid;
      
      if (balance < 0.01) balance = 0;
      
      monthly.push({
        month: i,
        date: `${monthNames[currentMonth]} ${currentYear}`,
        principal: principalPaid.toFixed(2),
        interest: '0.00',
        balance: balance.toFixed(2)
      });
      
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  } else {
    // Standard amortization with interest
    const r = (monthlyPayment * totalMonths - principal) / (principal * totalMonths);
    const monthlyRate = r * 12 / 12; // Approximate monthly rate
    
    // More accurate calculation using the original rate
    const actualRate = Math.pow((monthlyPayment * totalMonths) / principal, 1 / totalMonths) - 1;
    
    for (let i = 1; i <= totalMonths; i++) {
      const interestPayment = balance * actualRate;
      let principalPayment = monthlyPayment - interestPayment;
      
      // Last payment adjustment
      if (i === totalMonths || balance < monthlyPayment) {
        principalPayment = balance;
        balance = 0;
      } else {
        balance -= principalPayment;
      }
      
      if (balance < 0.01) balance = 0;
      
      monthly.push({
        month: i,
        date: `${monthNames[currentMonth]} ${currentYear}`,
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        balance: balance.toFixed(2)
      });
      
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  }
  
  // Generate yearly summary
  const years = Math.ceil(totalMonths / 12);
  for (let year = 1; year <= years; year++) {
    const startIdx = (year - 1) * 12;
    const endIdx = Math.min(year * 12, totalMonths);
    const yearMonths = monthly.slice(startIdx, endIdx);
    
    const yearPrincipal = yearMonths.reduce((sum, m) => sum + parseFloat(m.principal), 0);
    const yearInterest = yearMonths.reduce((sum, m) => sum + parseFloat(m.interest), 0);
    const yearEndBalance = yearMonths[yearMonths.length - 1].balance;
    
    yearly.push({
      year,
      yearLabel: `Year ${year}`,
      principal: yearPrincipal.toFixed(2),
      interest: yearInterest.toFixed(2),
      balance: yearEndBalance
    });
  }
  
  return { monthly, yearly };
}

/**
 * Calculate loan payoff date
 * @param {string} startMonth - Start month
 * @param {number} startYear - Start year
 * @param {number} months - Number of months
 * @returns {string} - Formatted payoff date
 */
export function calculatePayoffDate(startMonth, startYear, months) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonthIndex = monthNames.indexOf(startMonth);
  
  const totalMonths = startMonthIndex + months;
  const endYear = startYear + Math.floor(totalMonths / 12);
  const endMonth = totalMonths % 12;
  
  return `${monthNames[endMonth]} ${endYear}`;
}

/**
 * Get typical interest rate range for loan type
 * @param {string} loanType - Type of loan
 * @returns {Object} - Min and max typical rates
 */
export function getTypicalRateRange(loanType) {
  const ranges = {
    'auto': { min: 4.5, max: 15, typical: 7.5 },
    'personal': { min: 6, max: 36, typical: 12 },
    'student': { min: 3, max: 12, typical: 6.5 },
    'home-equity': { min: 5, max: 12, typical: 7.5 },
    'business': { min: 6, max: 30, typical: 10 },
    'other': { min: 2, max: 25, typical: 7.5 }
  };
  
  return ranges[loanType] || ranges['other'];
}

/**
 * Debounce function to limit calculation frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
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
