/**
 * HowTo Schema Generator
 * Optimized for Google Rich Results and AI step-by-step extraction
 */

/**
 * Generate HowTo structured data
 * 
 * @param {Object} config - HowTo configuration
 * @returns {Object} HowTo schema
 */
export function generateHowToSchema({
  name,
  description,
  image,
  totalTime,
  estimatedCost,
  supply = [],
  tool = [],
  steps = [],
  video,
  url
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(url && { url }),
    ...(image && { 
      image: Array.isArray(image) ? image : [image]
    }),
    ...(totalTime && { totalTime }), // ISO 8601 format: PT30M (30 minutes)
    ...(estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: estimatedCost.currency || 'USD',
        value: estimatedCost.value
      }
    }),
    ...(supply.length > 0 && {
      supply: supply.map(item => ({
        '@type': 'HowToSupply',
        name: item
      }))
    }),
    ...(tool.length > 0 && {
      tool: tool.map(item => ({
        '@type': 'HowToTool',
        name: item
      }))
    }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name || step.title,
      text: step.text || step.description,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
      itemListElement: {
        '@type': 'HowToDirection',
        text: step.text || step.description
      },
      ...(step.tip && {
        tip: {
          '@type': 'HowToTip',
          text: step.tip
        }
      })
    })),
    ...(video && {
      video: {
        '@type': 'VideoObject',
        name: video.name,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.uploadDate,
        contentUrl: video.contentUrl,
        embedUrl: video.embedUrl
      }
    })
  };

  return schema;
}

/**
 * Predefined HowTo templates for calculators
 */
export const howToTemplates = {
  emi: {
    name: 'How to Calculate EMI',
    description: 'Step-by-step guide to calculate your loan EMI accurately',
    totalTime: 'PT5M',
    tool: ['EMI Calculator', 'Loan Agreement'],
    steps: [
      {
        name: 'Enter Loan Amount',
        text: 'Input the total loan amount you need or have been approved for. This is the principal amount.',
        tip: 'Borrow only what you need to minimize interest costs'
      },
      {
        name: 'Set Interest Rate',
        text: 'Enter the annual interest rate offered by your lender. You can find this in your loan agreement.',
        tip: 'Compare rates from multiple lenders to get the best deal'
      },
      {
        name: 'Choose Loan Tenure',
        text: 'Select the loan duration in months or years. Longer tenure means lower EMI but higher total interest.',
        tip: 'Balance between affordable EMI and total interest cost'
      },
      {
        name: 'Calculate EMI',
        text: 'Click the calculate button to see your monthly EMI, total interest, and total payment amount.',
        tip: 'Review the amortization schedule to understand principal vs interest breakdown'
      },
      {
        name: 'Adjust If Needed',
        text: 'Modify loan amount, rate, or tenure to find a comfortable EMI that fits your budget.',
        tip: 'Keep EMI below 40% of your monthly income for financial stability'
      }
    ]
  },

  sip: {
    name: 'How to Calculate SIP Returns',
    description: 'Complete guide to calculate your mutual fund SIP investment returns',
    totalTime: 'PT5M',
    tool: ['SIP Calculator', 'Investment Goals'],
    steps: [
      {
        name: 'Set Monthly Investment',
        text: 'Enter the amount you want to invest monthly in your SIP. Start with an amount you can sustain long-term.',
        tip: 'Even ₹500/month can grow significantly over 10+ years'
      },
      {
        name: 'Enter Expected Return Rate',
        text: 'Input the expected annual return rate. Equity funds typically average 10-12% over long periods.',
        tip: 'Be conservative with return estimates for realistic planning'
      },
      {
        name: 'Choose Investment Period',
        text: 'Select how long you plan to invest. SIPs work best over 5+ years for wealth creation.',
        tip: 'Longer investment periods allow compounding to work its magic'
      },
      {
        name: 'Calculate Returns',
        text: 'Click calculate to see total investment, estimated returns, and final corpus amount.',
        tip: 'Review the year-by-year growth chart to understand wealth accumulation'
      },
      {
        name: 'Plan Your Goals',
        text: 'Match your SIP amount and tenure to specific financial goals like retirement, education, or home purchase.',
        tip: 'Start SIPs early and stay invested through market ups and downs'
      }
    ]
  },

  mortgage: {
    name: 'How to Calculate Mortgage Payments',
    description: 'Complete guide to estimate your monthly mortgage payment accurately',
    totalTime: 'PT7M',
    tool: ['Mortgage Calculator', 'Loan Estimate'],
    steps: [
      {
        name: 'Enter Home Price',
        text: 'Input the purchase price of the home you want to buy.',
        tip: 'Include all costs like closing fees when planning your budget'
      },
      {
        name: 'Set Down Payment',
        text: 'Enter your down payment amount or percentage. 20% down avoids PMI requirements.',
        tip: 'Higher down payment = lower monthly payment and less interest'
      },
      {
        name: 'Input Interest Rate',
        text: 'Enter the annual interest rate from your lender. Check current market rates.',
        tip: 'Even 0.5% rate difference can save thousands over loan life'
      },
      {
        name: 'Choose Loan Term',
        text: 'Select 15-year or 30-year loan term. Shorter terms have higher payments but less total interest.',
        tip: '30-year loans offer lower payments; 15-year builds equity faster'
      },
      {
        name: 'Add Property Tax',
        text: 'Enter annual property tax amount. This is usually 0.5-2% of home value.',
        tip: 'Property taxes vary by location - check local rates'
      },
      {
        name: 'Include Insurance',
        text: 'Add homeowners insurance cost. Lenders require this to protect the property.',
        tip: 'Shop around for insurance to get competitive rates'
      },
      {
        name: 'Calculate Total Payment',
        text: 'Review your complete monthly payment including principal, interest, taxes, and insurance (PITI).',
        tip: 'Ensure total housing costs stay under 28% of gross monthly income'
      }
    ]
  },

  vat: {
    name: 'How to Calculate VAT',
    description: 'Step-by-step guide to calculate Value Added Tax correctly',
    totalTime: 'PT3M',
    tool: ['VAT Calculator', 'Invoice'],
    steps: [
      {
        name: 'Identify Base Amount',
        text: 'Determine if you have the net amount (before VAT) or gross amount (including VAT).',
        tip: 'Check your invoice carefully to identify which amount you have'
      },
      {
        name: 'Select VAT Rate',
        text: 'Choose the correct VAT rate for your product/service. Standard UK rate is 20%.',
        tip: 'Some items have reduced rates (5%) or zero rates (0%)'
      },
      {
        name: 'Calculate VAT Amount',
        text: 'For adding VAT: multiply net amount by VAT rate. For extracting: divide gross by (1 + VAT rate).',
        tip: 'Double-check your calculation as VAT errors can be costly'
      },
      {
        name: 'Verify Total',
        text: 'Ensure Net Amount + VAT Amount = Gross Amount. All three numbers should reconcile.',
        tip: 'Keep accurate records for VAT returns and audits'
      }
    ]
  }
};

/**
 * Get HowTo schema for specific calculator
 */
export function getCalculatorHowToSchema(calculatorType, options = {}) {
  const template = howToTemplates[calculatorType.toLowerCase()];
  if (!template) return null;

  return generateHowToSchema({
    ...template,
    ...options,
    steps: template.steps.map(step => ({
      ...step,
      ...options.customStepData
    }))
  });
}

export default {
  generateHowToSchema,
  getCalculatorHowToSchema,
  howToTemplates
};
