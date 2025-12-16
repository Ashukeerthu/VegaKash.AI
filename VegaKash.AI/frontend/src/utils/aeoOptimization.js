/**
 * AEO (Answer Engine Optimization) Utilities
 * Optimized for Google SGE, ChatGPT, Perplexity, Gemini
 * 
 * @module utils/aeoOptimization
 * @description Provides answer-friendly content structures for AI search engines
 */

/**
 * Generate direct answer box content for calculators
 * @param {Object} config - Calculator configuration
 * @returns {Object} Structured answer content
 */
export const generateDirectAnswerBox = (config) => {
  const {
    toolName,
    shortDescription,
    primaryUseCase,
    keyBenefit
  } = config;

  return {
    question: `What is ${toolName}?`,
    answer: shortDescription,
    useCase: primaryUseCase,
    benefit: keyBenefit,
    // AI-friendly summary attribute
    aiSummary: `${toolName}: ${shortDescription}. ${keyBenefit}`
  };
};

/**
 * Generate step-by-step guide for calculators
 * @param {Array} steps - Array of step objects
 * @returns {Object} Structured step-by-step content
 */
export const generateStepByStepGuide = (steps) => {
  return {
    title: "How to Use This Calculator",
    steps: steps.map((step, index) => ({
      position: index + 1,
      title: step.title,
      description: step.description,
      example: step.example || null
    })),
    // Machine-readable format
    machineReadable: steps.map((s, i) => `Step ${i + 1}: ${s.title} - ${s.description}`).join(' | ')
  };
};

/**
 * Generate formula explanation
 * @param {Object} formula - Formula configuration
 * @returns {Object} Structured formula content
 */
export const generateFormulaExplanation = (formula) => {
  return {
    name: formula.name,
    formula: formula.expression,
    variables: formula.variables,
    example: formula.example,
    explanation: formula.explanation,
    // LaTeX for scientific display
    latex: formula.latex || null,
    // Plain text for AI engines
    plainText: `The formula is: ${formula.expression}. ${formula.explanation}`
  };
};

/**
 * Generate "When to Use" content
 * @param {Object} config - Use case configuration
 * @returns {Object} Structured use case content
 */
export const generateWhenToUse = (config) => {
  return {
    title: `When to Use ${config.toolName}`,
    scenarios: config.scenarios,
    benefits: config.benefits,
    bestFor: config.bestFor,
    // AI-friendly summary
    summary: `Use ${config.toolName} when ${config.scenarios.join(', or ')}. Best for ${config.bestFor.join(', ')}.`
  };
};

/**
 * Generate contextual content (150-300 words)
 * @param {Object} config - Content configuration
 * @returns {string} Long-form content
 */
export const generateContextualContent = (config) => {
  const {
    toolName,
    introduction,
    benefits,
    useCases,
    tips,
    conclusion
  } = config;

  return `
<section data-ai-summary="true" data-content-type="contextual">
  <h2>About ${toolName}</h2>
  
  <p>${introduction}</p>
  
  <h3>Key Benefits</h3>
  <ul>
    ${benefits.map(benefit => `<li>${benefit}</li>`).join('\n    ')}
  </ul>
  
  <h3>Common Use Cases</h3>
  <p>${useCases}</p>
  
  <h3>Pro Tips</h3>
  <ul>
    ${tips.map(tip => `<li>${tip}</li>`).join('\n    ')}
  </ul>
  
  <p>${conclusion}</p>
</section>
  `.trim();
};

/**
 * Calculator-specific AEO configurations
 */
export const calculatorAEOConfigs = {
  emi: {
    directAnswer: {
      toolName: "EMI Calculator",
      shortDescription: "A tool to calculate Equated Monthly Installment (EMI) for loans including principal and interest components",
      primaryUseCase: "Determining monthly loan payments for home, car, or personal loans",
      keyBenefit: "Helps you plan your budget by knowing exact monthly payment amounts before taking a loan"
    },
    stepByStep: [
      {
        title: "Enter Loan Amount",
        description: "Input the principal amount you want to borrow",
        example: "₹50,00,000 for a home loan"
      },
      {
        title: "Set Interest Rate",
        description: "Enter the annual interest rate offered by your lender",
        example: "8.5% per annum"
      },
      {
        title: "Choose Loan Tenure",
        description: "Select the repayment period in months or years",
        example: "20 years (240 months)"
      },
      {
        title: "Calculate",
        description: "Click calculate to see your monthly EMI, total interest, and payment breakdown"
      }
    ],
    formula: {
      name: "EMI Formula",
      expression: "EMI = [P × R × (1+R)^N] / [(1+R)^N-1]",
      variables: {
        P: "Principal loan amount",
        R: "Monthly interest rate (Annual Rate / 12 / 100)",
        N: "Loan tenure in months"
      },
      explanation: "This formula calculates equal monthly payments that include both principal and interest, ensuring the loan is fully repaid by the end of the tenure",
      example: "For ₹50L at 8.5% for 20 years: EMI = ₹43,391",
      latex: "EMI = \\frac{P \\times R \\times (1+R)^N}{(1+R)^N-1}"
    },
    whenToUse: {
      toolName: "EMI Calculator",
      scenarios: [
        "planning to take a home loan",
        "comparing loan offers from different banks",
        "checking affordability before applying for a car loan",
        "understanding impact of different tenures on monthly payments"
      ],
      benefits: [
        "Know exact monthly commitment",
        "Plan budget effectively",
        "Compare loan options",
        "Understand interest vs principal breakdown"
      ],
      bestFor: [
        "first-time home buyers",
        "car loan applicants",
        "personal loan seekers",
        "loan refinancing decisions"
      ]
    },
    contextual: {
      toolName: "EMI Calculator",
      introduction: "An EMI (Equated Monthly Installment) Calculator is an essential financial tool that helps borrowers understand their loan repayment obligations. Whether you're planning to buy a home, car, or need a personal loan, knowing your monthly payment amount is crucial for financial planning.",
      benefits: [
        "Instant calculation of monthly payments without manual formula work",
        "Detailed amortization schedule showing principal and interest breakdown",
        "Ability to compare different loan scenarios by adjusting tenure and interest rates",
        "Helps in making informed decisions about loan affordability",
        "Free and unlimited calculations with no registration required"
      ],
      useCases: "Use this calculator when evaluating home loans from multiple lenders, determining how much EMI you can afford based on your monthly income, comparing the impact of different down payments, or understanding how prepayments can reduce your total interest burden. It's particularly valuable during the loan application process to negotiate better terms with lenders.",
      tips: [
        "Keep EMI below 40% of your monthly income for healthy finances",
        "Longer tenure reduces EMI but increases total interest paid",
        "Even a 0.5% reduction in interest rate can save lakhs over 20 years",
        "Check for prepayment penalties before planning early loan closure",
        "Factor in processing fees and other charges when comparing loans"
      ],
      conclusion: "Understanding your EMI helps you make confident financial decisions. Use our calculator to explore different scenarios and find the perfect loan structure for your needs. Remember, the lowest EMI isn't always the best choice—consider total interest cost and flexibility as well."
    }
  },

  sip: {
    directAnswer: {
      toolName: "SIP Calculator",
      shortDescription: "A Systematic Investment Plan calculator that estimates returns from regular mutual fund investments using compound interest",
      primaryUseCase: "Planning monthly investments in mutual funds to build long-term wealth",
      keyBenefit: "Shows how small, regular investments can grow into substantial corpus through the power of compounding"
    },
    stepByStep: [
      {
        title: "Enter Monthly Investment",
        description: "Input the amount you plan to invest every month",
        example: "₹5,000 per month"
      },
      {
        title: "Expected Rate of Return",
        description: "Enter the annual return rate you expect from your investment",
        example: "12% per annum"
      },
      {
        title: "Investment Duration",
        description: "Select how long you plan to continue investing",
        example: "10 years"
      },
      {
        title: "View Results",
        description: "See your total investment, expected returns, and final corpus with visual charts"
      }
    ],
    formula: {
      name: "SIP Future Value Formula",
      expression: "FV = P × [(1 + r)^n - 1] / r × (1 + r)",
      variables: {
        FV: "Future Value of investment",
        P: "Monthly investment amount",
        r: "Monthly rate of return (Annual Rate / 12 / 100)",
        n: "Total number of months"
      },
      explanation: "This compound interest formula calculates the accumulated value of regular monthly investments, accounting for returns earned each month",
      example: "Investing ₹5,000/month at 12% for 10 years = ₹11.6 Lakhs (₹6L invested + ₹5.6L returns)"
    },
    whenToUse: {
      toolName: "SIP Calculator",
      scenarios: [
        "planning to start mutual fund investments",
        "setting financial goals like retirement or children's education",
        "comparing different investment amounts and durations",
        "understanding the power of compounding over time"
      ],
      benefits: [
        "Visualize wealth creation potential",
        "Set realistic investment goals",
        "Compare different SIP scenarios",
        "Understand returns vs time relationship"
      ],
      bestFor: [
        "beginners starting their investment journey",
        "goal-based financial planning",
        "retirement corpus building",
        "wealth accumulation strategies"
      ]
    }
  },

  fd: {
    directAnswer: {
      toolName: "FD Calculator",
      shortDescription: "A Fixed Deposit calculator that computes maturity amount and interest earned on your bank FD investments",
      primaryUseCase: "Calculating returns from fixed deposit investments with banks or post offices",
      keyBenefit: "Know exactly how much your FD will be worth at maturity before investing"
    }
  },

  mortgage: {
    directAnswer: {
      toolName: "US Mortgage Calculator",
      shortDescription: "Calculate monthly mortgage payments, total interest, and amortization schedule for US home loans",
      primaryUseCase: "Planning home purchase financing in the United States",
      keyBenefit: "Understand complete mortgage cost including property taxes and insurance"
    },
    formula: {
      name: "Mortgage Payment Formula",
      expression: "M = P[r(1+r)^n] / [(1+r)^n-1]",
      variables: {
        M: "Monthly mortgage payment",
        P: "Principal loan amount",
        r: "Monthly interest rate",
        n: "Number of payments"
      },
      explanation: "Calculates fixed monthly payments for US mortgages including principal and interest",
      example: "$300,000 at 6.5% for 30 years = $1,896/month"
    }
  },

  vat: {
    directAnswer: {
      toolName: "UK VAT Calculator",
      shortDescription: "Calculate Value Added Tax (VAT) and total price for UK purchases at 20% standard rate",
      primaryUseCase: "Adding or removing VAT from product prices for UK businesses",
      keyBenefit: "Instantly determine VAT amount and final prices for accurate invoicing"
    },
    formula: {
      name: "VAT Calculation",
      expression: "VAT Amount = Price × 0.20 (20%)",
      variables: {
        "Price": "Net price before VAT",
        "VAT Amount": "Tax to be added",
        "Total": "Price + VAT Amount"
      },
      explanation: "UK standard VAT rate is 20%. To find price excluding VAT: Price / 1.20",
      example: "£100 + 20% VAT = £120 total"
    }
  }
};

/**
 * Generate complete AEO content for a calculator page
 * @param {string} calculatorType - Type of calculator (emi, sip, etc.)
 * @returns {Object} Complete AEO content structure
 */
export const generateCompleteAEO = (calculatorType) => {
  const config = calculatorAEOConfigs[calculatorType];
  if (!config) return null;

  return {
    directAnswer: config.directAnswer ? generateDirectAnswerBox(config.directAnswer) : null,
    stepByStep: config.stepByStep ? generateStepByStepGuide(config.stepByStep) : null,
    formula: config.formula ? generateFormulaExplanation(config.formula) : null,
    whenToUse: config.whenToUse ? generateWhenToUse(config.whenToUse) : null,
    contextual: config.contextual ? generateContextualContent(config.contextual) : null
  };
};

export default {
  generateDirectAnswerBox,
  generateStepByStepGuide,
  generateFormulaExplanation,
  generateWhenToUse,
  generateContextualContent,
  generateCompleteAEO,
  calculatorAEOConfigs
};
