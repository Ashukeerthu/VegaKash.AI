/**
 * Loan Calculator Tooltips
 * Provides helpful information for each input field
 */

export const loanTooltips = {
  loanAmount: {
    title: 'Loan Amount',
    content: 'The total amount you want to borrow. This is the principal that you\'ll pay back with interest over the loan term.'
  },
  interestRate: {
    title: 'Interest Rate',
    content: 'The annual percentage rate (APR) charged by the lender. This determines how much extra you\'ll pay on top of the principal.'
  },
  loanTerm: {
    title: 'Loan Term',
    content: 'The length of time you have to repay the loan. Longer terms mean lower monthly payments but more total interest paid.'
  },
  loanType: {
    title: 'Loan Type',
    content: 'The purpose of your loan affects typical interest rates. Auto loans typically have lower rates than personal loans, while student loans may qualify for special terms.'
  },
  startDate: {
    title: 'Start Date',
    content: 'The month and year when you\'ll begin making loan payments. This affects your amortization schedule and payoff date.'
  }
};

export function getTooltip(key) {
  return loanTooltips[key] || { title: key, content: 'Helpful information coming soon.' };
}
