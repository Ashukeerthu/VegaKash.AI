/**
 * FAQ Schema Generator
 * Optimized for Google Rich Results and AI answer extraction
 */

/**
 * Generate FAQPage structured data
 * 
 * @param {Array} faqItems - Array of {question, answer} objects
 * @param {Object} options - Additional options
 * @returns {Object} FAQPage schema
 */
export function generateFAQSchema(faqItems, options = {}) {
  const {
    url,
    name,
    description,
    inLanguage = 'en'
  } = options;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(url && { url }),
    ...(name && { name }),
    ...(description && { description }),
    inLanguage,
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
        ...(item.author && {
          author: {
            '@type': 'Person',
            name: item.author
          }
        }),
        ...(item.dateCreated && { dateCreated: item.dateCreated }),
        ...(item.upvoteCount && { upvoteCount: item.upvoteCount })
      },
      ...(item.dateCreated && { dateCreated: item.dateCreated }),
      ...(item.answerCount && { answerCount: item.answerCount })
    }))
  };

  return schema;
}

/**
 * Generate FAQ schema for calculator-specific questions
 */
export function generateCalculatorFAQSchema({
  calculatorName,
  country,
  faqs,
  url
}) {
  return generateFAQSchema(faqs, {
    url,
    name: `${calculatorName} - Frequently Asked Questions`,
    description: `Common questions about ${calculatorName}${country ? ` for ${country}` : ''}`,
    inLanguage: 'en'
  });
}

/**
 * Predefined FAQ templates for common calculator types
 */
export const faqTemplates = {
  emi: (country = 'India') => [
    {
      question: 'What is EMI and how is it calculated?',
      answer: 'EMI (Equated Monthly Installment) is the fixed monthly payment you make towards a loan. It is calculated using the formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where P is principal, r is monthly interest rate, and n is tenure in months.'
    },
    {
      question: 'Does EMI include both principal and interest?',
      answer: 'Yes, each EMI payment includes both principal and interest components. In the initial months, the interest component is higher, and as you progress, the principal component increases.'
    },
    {
      question: 'Can I prepay my loan to reduce EMI?',
      answer: 'Yes, prepaying your loan reduces either the tenure or EMI amount. Most lenders allow partial prepayment, though some may charge a prepayment penalty.'
    },
    {
      question: 'How does interest rate affect my EMI?',
      answer: 'Higher interest rates result in higher EMIs. Even a 1% difference in interest rate can significantly impact your total payment over the loan tenure.'
    }
  ],

  sip: () => [
    {
      question: 'What is SIP in mutual funds?',
      answer: 'SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds. It helps in rupee cost averaging and disciplined investing over time.'
    },
    {
      question: 'What is the minimum SIP amount?',
      answer: 'Most mutual funds allow SIP starting from ₹500 per month. However, some funds may have higher minimum amounts.'
    },
    {
      question: 'Can I stop my SIP anytime?',
      answer: 'Yes, SIPs are flexible. You can pause, stop, or modify your SIP amount anytime without penalty. There is no lock-in period for most equity funds.'
    },
    {
      question: 'How is SIP return calculated?',
      answer: 'SIP returns are calculated using the XIRR (Extended Internal Rate of Return) method, which accounts for the timing and amount of each investment.'
    }
  ],

  mortgage: (country = 'US') => [
    {
      question: 'What is a mortgage calculator?',
      answer: `A mortgage calculator helps estimate your monthly payment, including principal, interest, taxes, and insurance (PITI) for a home loan${country === 'US' ? ' in the United States' : ''}.`
    },
    {
      question: 'What is included in a mortgage payment?',
      answer: 'A mortgage payment typically includes: Principal (loan amount), Interest (cost of borrowing), Property Taxes, Homeowners Insurance, and potentially PMI (Private Mortgage Insurance) if down payment is less than 20%.'
    },
    {
      question: 'How much down payment do I need?',
      answer: `Most conventional loans require ${country === 'US' ? '3-20%' : '5-20%'} down payment. FHA loans may allow as low as 3.5%. Higher down payments result in lower monthly payments and may eliminate PMI.`
    },
    {
      question: 'What is mortgage amortization?',
      answer: 'Amortization is the process of paying off your loan through regular payments. Early payments are mostly interest; later payments are mostly principal.'
    }
  ],

  vat: (country = 'UK') => [
    {
      question: 'What is VAT?',
      answer: `VAT (Value Added Tax) is a consumption tax applied to goods and services${country === 'UK' ? ' in the UK' : ''}. It is added at each stage of the supply chain.`
    },
    {
      question: `What is the current VAT rate${country === 'UK' ? ' in the UK' : ''}?`,
      answer: country === 'UK' 
        ? 'The standard VAT rate in the UK is 20%. Reduced rates of 5% and 0% apply to certain goods and services.'
        : 'VAT rates vary by country and product category. Check your local tax authority for current rates.'
    },
    {
      question: 'How do I calculate VAT from a total amount?',
      answer: `To extract VAT from a total: VAT Amount = Total ÷ (1 + VAT Rate). For example, with ${country === 'UK' ? '20%' : '20%'} VAT on £120 total: VAT = £120 ÷ 1.20 = £20.`
    },
    {
      question: 'Is VAT the same as sales tax?',
      answer: 'No, VAT is applied at each stage of production and distribution, while sales tax is typically applied only at the final point of sale.'
    }
  ]
};

/**
 * Get FAQ schema for specific calculator type
 */
export function getCalculatorFAQs(calculatorType, country) {
  const template = faqTemplates[calculatorType.toLowerCase()];
  if (!template) return [];
  
  return typeof template === 'function' ? template(country) : template;
}

export default {
  generateFAQSchema,
  generateCalculatorFAQSchema,
  getCalculatorFAQs,
  faqTemplates
};
