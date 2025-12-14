/**
 * Tooltip content for US Mortgage Calculator
 * Educational content explaining each cost component
 */

export const mortgageTooltips = {
  homePrice: {
    title: "Home Price",
    content: "The total purchase price of the property before any down payment. This is the asking price or agreed purchase price."
  },
  
  downPayment: {
    title: "Down Payment",
    content: "Upfront payment made when purchasing a home, typically 3-20% of the home price. A 20%+ down payment avoids PMI insurance costs."
  },
  
  interestRate: {
    title: "Interest Rate",
    content: "Annual Percentage Rate (APR) charged by the lender. Current US average is 6-7%. Your actual rate depends on credit score, loan term, and market conditions."
  },
  
  loanTerm: {
    title: "Loan Term",
    content: "Length of the mortgage in years. 30-year terms have lower monthly payments but higher total interest. 15-year terms save on interest but have higher monthly costs."
  },
  
  propertyTax: {
    title: "Property Tax",
    content: "Annual tax based on assessed home value, typically 0.5-2.5% depending on location. Collected by local governments for schools, roads, and services. Paid monthly as part of mortgage."
  },
  
  homeInsurance: {
    title: "Home Insurance",
    content: "Homeowners insurance protects against damage, theft, and liability. Required by lenders. Cost varies by location, home value, and coverage level. National average: $1,200-$2,000/year."
  },
  
  pmi: {
    title: "PMI (Private Mortgage Insurance)",
    content: "Required when down payment is less than 20%. Protects lender if you default. Typically 0.3-1.5% of loan amount annually. Automatically drops when you reach 20% equity (80% loan-to-value)."
  },
  
  hoaFee: {
    title: "HOA Fee",
    content: "Homeowners Association monthly dues for condos, townhomes, or planned communities. Covers shared amenities, maintenance, landscaping, and community services."
  },
  
  otherCosts: {
    title: "Other Costs",
    content: "Additional annual expenses like maintenance, utilities, repairs, or closing costs. Industry standard: budget 1-2% of home value annually for maintenance."
  },
  
  startDate: {
    title: "Start Date",
    content: "When your mortgage begins. Used to calculate your exact payoff date and create an accurate amortization schedule."
  },
  
  monthlyPayment: {
    title: "Monthly Payment (PITI)",
    content: "Total monthly mortgage payment including Principal, Interest, Taxes, and Insurance. This is your actual out-of-pocket cost each month."
  },
  
  principalInterest: {
    title: "Principal & Interest",
    content: "Principal: Amount that reduces your loan balance. Interest: Cost of borrowing. Early payments are mostly interest; later payments are mostly principal."
  },
  
  totalInterest: {
    title: "Total Interest",
    content: "Total interest paid over the life of the loan. Making extra principal payments or choosing a shorter term significantly reduces this amount."
  },
  
  payoffDate: {
    title: "Mortgage Payoff Date",
    content: "When your final payment is due and you own the home free and clear. Making extra payments can move this date forward significantly."
  }
};

/**
 * Get tooltip content by key
 * @param {string} key - Tooltip key
 * @returns {Object} Tooltip object with title and content
 */
export function getTooltip(key) {
  return mortgageTooltips[key] || { title: "", content: "" };
}
