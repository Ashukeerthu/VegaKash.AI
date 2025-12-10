export const getCalculatorData = (slug: string) => {
  const calculators = {
    emi: {
      title: 'EMI Calculator',
      description: 'Calculate your monthly EMI for loans.',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: 'EMI Calculator',
        description: 'Calculate your monthly EMI for loans.',
      },
      directAnswer: 'Monthly EMI: ₹12,345',
      summary: 'For ₹X loan at Y% for Z months, EMI is ₹12,345.',
      steps: [
        'Convert annual interest to monthly: r = annual/12/100',
        'EMI = P * r * (1+r)^n / ((1+r)^n - 1)',
        'Result rounding and currency format',
      ],
      formula: 'EMI = P × r × (1+r)^n ÷ ((1+r)^n−1)',
      whenToUse: 'Use when estimating monthly payments for fixed-rate loans in India.',
    },
    sip: {
      title: 'SIP Calculator',
      description: 'Calculate your SIP returns.',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: 'SIP Calculator',
        description: 'Calculate your SIP returns.',
      },
      directAnswer: 'Total SIP Returns: ₹1,23,456',
      summary: 'For ₹X monthly SIP at Y% for Z years, returns are ₹1,23,456.',
      steps: [
        'Determine monthly investment amount.',
        'Apply compound interest formula.',
        'Calculate total returns.',
      ],
      formula: 'FV = P × ((1 + r)^n - 1) / r × (1 + r)',
      whenToUse: 'Use when estimating returns for systematic investment plans.',
    },
  };

  return calculators[slug] || null;
};