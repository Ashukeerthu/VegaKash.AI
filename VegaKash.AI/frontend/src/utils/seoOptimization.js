/**
 * SEO/GEO/AEO Optimization Utility
 * Provides utilities for Search Engine Optimization (SEO),
 * Geographic Optimization (GEO), and Answer Engine Optimization (AEO)
 */

/**
 * Generate FAQ Schema for AEO Optimization
 * Helps Answer Engines (Perplexity, ChatGPT, etc.) provide accurate answers
 */
export const generateFAQSchema = (tool, country = null) => {
  const faqs = {
    mortgage: {
      questions: [
        {
          question: "How is mortgage payment calculated?",
          answer: "The mortgage payment is calculated using the formula: M = P[r(1+r)^n]/[(1+r)^n-1], where M is monthly payment, P is principal, r is monthly interest rate, and n is total number of payments."
        },
        {
          question: "What does amortization mean in mortgages?",
          answer: "Amortization is the process of paying off a loan through regular payments over time. Early payments go mostly toward interest, while later payments focus more on principal reduction."
        },
        {
          question: "How can I reduce my mortgage interest?",
          answer: "You can reduce mortgage interest by: paying a larger down payment, choosing a shorter loan term, improving your credit score to get better rates, or making extra principal payments."
        },
        {
          question: "What is the typical mortgage term in the USA?",
          answer: "The most common mortgage terms in the USA are 15 years and 30 years. 30-year mortgages have lower monthly payments but higher total interest, while 15-year mortgages have higher payments but cost less overall."
        }
      ]
    },
    loan: {
      questions: [
        {
          question: "What is the difference between a loan and a mortgage?",
          answer: "A mortgage is a specific type of loan secured by real estate property. Other loans can be personal loans, auto loans, student loans, etc., which may or may not be secured by collateral."
        },
        {
          question: "How is monthly loan payment calculated?",
          answer: "Monthly loan payment is calculated using the formula: M = P[r(1+r)^n]/[(1+r)^n-1], where P is the principal amount, r is the monthly interest rate, and n is the number of payments."
        },
        {
          question: "What affects your loan interest rate?",
          answer: "Your interest rate is affected by: credit score, debt-to-income ratio, loan amount, loan term, current market rates, type of loan, and down payment amount."
        },
        {
          question: "Can you pay off a loan early?",
          answer: "Yes, most loans allow early payment. Paying early reduces the total interest you'll pay. However, some loans may have prepayment penalties, so check your loan agreement."
        }
      ]
    },
    emi: {
      questions: [
        {
          question: "What does EMI stand for?",
          answer: "EMI stands for Equated Monthly Installment. It's the fixed amount you pay every month to repay a loan over a specified period."
        },
        {
          question: "How is EMI calculated?",
          answer: "EMI is calculated using the formula: EMI = P × [r(1+r)^n]/[(1+r)^n-1], where P is loan principal, r is monthly interest rate, and n is the number of months."
        },
        {
          question: "What's the difference between EMI and monthly loan payment?",
          answer: "EMI and monthly loan payment mean the same thing. EMI is the term commonly used in India for fixed monthly loan payments, while Western countries may just call it 'monthly payment.'"
        },
        {
          question: "How can I reduce my EMI?",
          answer: "You can reduce your EMI by: increasing your down payment, extending the loan tenure (though this increases total interest), improving your credit score for better rates, or paying a lump sum amount."
        }
      ]
    },
    sip: {
      questions: [
        {
          question: "What is SIP in mutual funds?",
          answer: "SIP stands for Systematic Investment Plan. It's an investment method where you invest a fixed amount of money regularly (monthly, quarterly, etc.) in mutual funds."
        },
        {
          question: "How does SIP help in wealth creation?",
          answer: "SIP helps wealth creation through: rupee cost averaging, regular investing habits, compound growth, and reducing the impact of market volatility on your investments."
        },
        {
          question: "What is the minimum SIP investment amount?",
          answer: "Most mutual funds allow SIP starting from as low as ₹500 per month in India. This makes investing accessible to beginners and average investors."
        },
        {
          question: "Is SIP safe?",
          answer: "SIP is as safe as the mutual fund scheme you choose. Invest through SEBI-regulated funds from reputable asset management companies for better safety."
        }
      ]
    },
    fd: {
      questions: [
        {
          question: "What is a Fixed Deposit?",
          answer: "A Fixed Deposit (FD) is a financial instrument offered by banks and financial institutions where you deposit a lump sum amount for a fixed period at a predetermined interest rate."
        },
        {
          question: "How is FD interest calculated?",
          answer: "FD interest can be calculated using: Simple Interest = P × R × T / 100, or Compound Interest = P(1 + r/n)^(nt) - P, depending on the compounding frequency."
        },
        {
          question: "Can you withdraw from FD before maturity?",
          answer: "Yes, most banks allow premature withdrawal, but you may face a penalty (usually 0.5-1% lower interest rate). Some FDs are non-callable and don't allow early withdrawal."
        },
        {
          question: "What is the interest rate for FD in India?",
          answer: "FD interest rates vary by bank and duration. Currently, they range from 6.5% to 8.5% per annum, depending on the bank and tenure chosen."
        }
      ]
    },
    rd: {
      questions: [
        {
          question: "What is Recurring Deposit (RD)?",
          answer: "A Recurring Deposit (RD) is a savings scheme where you deposit a fixed amount every month for a specific tenure. You receive interest on the accumulated balance."
        },
        {
          question: "How is RD maturity amount calculated?",
          answer: "RD maturity = Monthly Deposit × [((1 + Interest Rate)^n - 1) / Interest Rate], where n is the number of months."
        },
        {
          question: "What is the difference between RD and FD?",
          answer: "In FD, you deposit a lump sum once; in RD, you deposit a fixed amount monthly. RD is ideal for regular savers, while FD is for those with a lump sum."
        },
        {
          question: "What RD interest rates are offered by banks?",
          answer: "RD interest rates typically range from 6% to 7.5% per annum, slightly lower than FD rates, as you're not depositing the full amount upfront."
        }
      ]
    },
    savings: {
      questions: [
        {
          question: "How much money should you save each month?",
          answer: "Financial experts recommend saving 20% of your income. However, start with what you can afford and gradually increase. Even 10% is better than nothing."
        },
        {
          question: "What is compound interest?",
          answer: "Compound interest is interest calculated on both the principal and previously earned interest. It leads to exponential growth over time."
        },
        {
          question: "How can I grow my savings faster?",
          answer: "To grow savings faster: increase monthly savings amount, invest in higher-yield instruments (bonds, mutual funds), use tax-advantaged accounts, and leverage compound interest."
        },
        {
          question: "What is the best way to save money?",
          answer: "Best practices include: automate savings (set up automatic transfers), use high-yield savings accounts, diversify investments, avoid unnecessary spending, and track your progress."
        }
      ]
    },
    'credit-card': {
      questions: [
        {
          question: "How is credit card debt interest calculated?",
          answer: "Credit card interest = Outstanding Balance × (Annual Rate / 365) × Days in Billing Cycle. Most cards charge daily interest on the outstanding balance."
        },
        {
          question: "What is credit utilization ratio?",
          answer: "Credit utilization ratio is the percentage of your credit limit that you're currently using (e.g., if your limit is ₹100,000 and you owe ₹30,000, utilization is 30%)."
        },
        {
          question: "How can I avoid credit card debt?",
          answer: "To avoid debt: pay the full balance monthly, set spending limits, avoid unnecessary purchases, track spending, and use budgeting apps to monitor expenses."
        },
        {
          question: "What happens if you only pay the minimum on credit cards?",
          answer: "Paying minimum means paying mostly interest and very little principal. It takes much longer to pay off and costs significantly more in total interest charges."
        }
      ]
    },
    '401k': {
      questions: [
        {
          question: "What is a 401(k) retirement plan?",
          answer: "A 401(k) is an employer-sponsored retirement savings plan where employees can contribute pre-tax income, and employers often match contributions. It grows tax-deferred until retirement."
        },
        {
          question: "What is the 401(k) contribution limit for 2024?",
          answer: "The 2024 401(k) contribution limit is $23,500 for individuals under 50, and $31,000 for those 50 and older (including the $7,500 catch-up contribution)."
        },
        {
          question: "When can you withdraw from a 401(k)?",
          answer: "You can typically withdraw from a 401(k) at age 59.5 without penalty. Earlier withdrawals may incur a 10% penalty plus income taxes. Some plans allow loans or hardship withdrawals."
        },
        {
          question: "Is employer match free money in a 401(k)?",
          answer: "Yes, employer match is free money you should take advantage of. Most employers match up to 3-6% of your salary. Failing to contribute enough to get the full match means leaving free money on the table."
        }
      ]
    },
    vat: {
      questions: [
        {
          question: "What is VAT (Value Added Tax)?",
          answer: "VAT is an indirect tax applied at each stage of the production and distribution of goods and services. It's ultimately borne by the end consumer."
        },
        {
          question: "What is the standard VAT rate in the UK?",
          answer: "The standard VAT rate in the UK is 20%. However, some goods and services have reduced rates (5%) or are zero-rated."
        },
        {
          question: "How is VAT calculated?",
          answer: "VAT = (Net Price × VAT Rate) / 100. For a 20% VAT on £100, the VAT is £20, making the total £120."
        },
        {
          question: "What goods are zero-rated for VAT in the UK?",
          answer: "Zero-rated items include: food (most), books, newspapers, children's clothing, and water supplies. Zero-rated means VAT is charged at 0%."
        }
      ]
    }
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs[tool] || faqs.mortgage).questions.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
};

/**
 * Generate BreadcrumbList Schema
 */
export const generateBreadcrumbSchema = (tool, country = null) => {
  const breadcrumbs = [
    {
      position: 1,
      name: 'Home',
      item: 'https://vegakash.ai/'
    },
    {
      position: 2,
      name: 'Calculators',
      item: 'https://vegakash.ai/calculators/'
    }
  ];

  if (country) {
    const countryNames = {
      us: 'US Calculators',
      uk: 'UK Calculators',
      in: 'India Calculators',
      ca: 'Canada Calculators',
      au: 'Australia Calculators',
      ae: 'UAE Calculators'
    };
    breadcrumbs.push({
      position: 3,
      name: countryNames[country] || 'Calculators',
      item: `https://vegakash.ai/${country}/calculators/`
    });
  }

  const toolNames = {
    mortgage: 'Mortgage Calculator',
    loan: 'Loan Payment Calculator',
    'credit-card': 'Credit Card Payoff',
    '401k': '401(k) Retirement',
    savings: 'Savings Growth',
    emi: 'EMI Calculator',
    sip: 'SIP Calculator',
    fd: 'FD Calculator',
    rd: 'RD Calculator',
    vat: 'VAT Calculator'
  };

  breadcrumbs.push({
    position: breadcrumbs.length + 1,
    name: toolNames[tool] || 'Calculator',
    item: country 
      ? `https://vegakash.ai/${country}/calculators/${tool}/`
      : `https://vegakash.ai/calculators/${tool}/`
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
  };
};

/**
 * Get AEO-optimized content questions for a calculator
 * Helps with featured snippets and voice search optimization
 */
export const getAEOQuestions = (tool) => {
  const aeoQuestions = {
    mortgage: [
      "How is mortgage payment calculated?",
      "What is amortization schedule?",
      "How much down payment is needed?",
      "What credit score is needed for a mortgage?"
    ],
    loan: [
      "How to calculate monthly loan payment?",
      "What factors affect loan interest rate?",
      "Can you pay off a loan early?",
      "How is total interest calculated on a loan?"
    ],
    emi: [
      "What does EMI stand for?",
      "How to calculate EMI?",
      "How to reduce EMI amount?",
      "What is the formula for EMI calculation?"
    ],
    sip: [
      "What is SIP in mutual funds?",
      "How does SIP work?",
      "What is the minimum SIP investment?",
      "How to calculate SIP returns?"
    ],
    fd: [
      "What is a fixed deposit?",
      "How to calculate FD interest?",
      "Can you withdraw FD before maturity?",
      "What are current FD interest rates?"
    ],
    rd: [
      "What is recurring deposit?",
      "How to calculate RD maturity amount?",
      "What is the difference between RD and FD?",
      "What are current RD interest rates?"
    ],
    savings: [
      "How much should you save monthly?",
      "How does compound interest work?",
      "What is the best way to save money?",
      "How to calculate savings growth?"
    ],
    'credit-card': [
      "How is credit card interest calculated?",
      "How to pay off credit card debt?",
      "What is credit utilization ratio?",
      "How long to pay off credit card debt?"
    ],
    '401k': [
      "What is a 401(k) plan?",
      "What is the 401(k) contribution limit?",
      "When can you withdraw from 401(k)?",
      "What is employer match in 401(k)?"
    ],
    vat: [
      "What is VAT?",
      "How to calculate VAT?",
      "What is the UK VAT rate?",
      "What goods are zero-rated for VAT?"
    ]
  };

  return aeoQuestions[tool] || aeoQuestions.mortgage;
};

/**
 * Get related tools for cross-linking
 */
export const getRelatedTools = (tool) => {
  const relatedTools = {
    mortgage: [
      { name: 'Loan Payment Calculator', path: '/calculators/loan', description: 'Calculate personal loan payments' },
      { name: 'EMI Calculator', path: '/calculators/emi', description: 'Calculate monthly installments' }
    ],
    loan: [
      { name: 'Mortgage Calculator', path: '/calculators/mortgage', description: 'Calculate mortgage payments' },
      { name: 'Credit Card Payoff', path: '/us/calculators/credit-card', description: 'Calculate credit card payoff timeline' }
    ],
    'credit-card': [
      { name: 'Loan Calculator', path: '/calculators/loan', description: 'Calculate loan payments' },
      { name: 'Savings Calculator', path: '/calculators/savings', description: 'Plan your savings' }
    ],
    '401k': [
      { name: 'Savings Calculator', path: '/calculators/savings', description: 'Plan your savings' },
      { name: 'SIP Calculator', path: '/calculators/sip', description: 'Calculate investment returns' }
    ],
    savings: [
      { name: 'SIP Calculator', path: '/calculators/sip', description: 'Calculate SIP returns' },
      { name: 'FD Calculator', path: '/calculators/fd', description: 'Calculate FD maturity' },
      { name: 'RD Calculator', path: '/calculators/rd', description: 'Calculate RD returns' }
    ],
    emi: [
      { name: 'Loan Calculator', path: '/calculators/loan', description: 'Calculate loan payments' },
      { name: 'Mortgage Calculator', path: '/calculators/mortgage', description: 'Calculate mortgage payments' }
    ],
    sip: [
      { name: 'Savings Calculator', path: '/calculators/savings', description: 'Plan your savings' },
      { name: '401(k) Calculator', path: '/us/calculators/401k', description: 'Plan retirement savings' }
    ],
    fd: [
      { name: 'RD Calculator', path: '/calculators/rd', description: 'Calculate RD returns' },
      { name: 'Savings Calculator', path: '/calculators/savings', description: 'Plan your savings' }
    ],
    rd: [
      { name: 'FD Calculator', path: '/calculators/fd', description: 'Calculate FD maturity' },
      { name: 'SIP Calculator', path: '/calculators/sip', description: 'Calculate investment returns' }
    ],
    vat: [
      { name: 'Mortgage Affordability (UK)', path: '/uk/calculators/mortgage', description: 'Calculate mortgage affordability' },
      { name: 'Savings Calculator (UK)', path: '/uk/calculators/savings', description: 'Plan UK savings' }
    ]
  };

  return relatedTools[tool] || relatedTools.mortgage;
};

/**
 * Generate GEO meta tags for country-specific pages
 */
export const generateGEOMetaTags = (country) => {
  const geoData = {
    us: {
      region: 'United States',
      placename: 'United States',
      position: '37.0902;-95.7129'
    },
    uk: {
      region: 'United Kingdom',
      placename: 'United Kingdom',
      position: '55.3781;-3.4360'
    },
    in: {
      region: 'India',
      placename: 'India',
      position: '20.5937;78.9629'
    },
    ca: {
      region: 'Canada',
      placename: 'Canada',
      position: '56.1304;-106.3468'
    },
    au: {
      region: 'Australia',
      placename: 'Australia',
      position: '-25.2744;133.7751'
    },
    ae: {
      region: 'United Arab Emirates',
      placename: 'United Arab Emirates',
      position: '23.4241;53.8478'
    }
  };

  return geoData[country] || null;
};

export default {
  generateFAQSchema,
  generateBreadcrumbSchema,
  getAEOQuestions,
  getRelatedTools,
  generateGEOMetaTags
};
