/**
 * Schema Generators for Calculator-related structured data
 * Optimized for Google Rich Results and AI search engines
 */

/**
 * Generate Calculator schema (WebApplication + SoftwareApplication)
 */
export function generateCalculatorSchema({
  name,
  description,
  url,
  country,
  applicationCategory = 'FinanceApplication',
  operatingSystem = 'Any',
  offers = {
    price: '0',
    priceCurrency: 'USD'
  },
  image,
  aggregateRating
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'SoftwareApplication', 'Calculator'],
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    ...(image && { image }),
    offers: {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency || 'USD',
      availability: 'https://schema.org/InStock'
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: '5',
        worstRating: '1'
      }
    }),
    featureList: [
      'Free to use',
      'No registration required',
      'Instant calculations',
      'Mobile responsive',
      `Optimized for ${country || 'multiple countries'}`
    ],
    screenshot: image
  };

  return schema;
}

/**
 * Generate FinancialProduct schema
 */
export function generateFinancialProductSchema({
  name,
  description,
  url,
  provider,
  category = 'FinancialCalculator',
  feesAndCommissions = 'No fees',
  interestRate
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name,
    description,
    url,
    category,
    feesAndCommissionsSpecification: feesAndCommissions,
    ...(provider && {
      provider: {
        '@type': 'Organization',
        name: provider.name,
        url: provider.url
      }
    }),
    ...(interestRate && {
      interestRate: {
        '@type': 'QuantitativeValue',
        value: interestRate.value,
        unitText: interestRate.unit || 'P1Y'
      }
    })
  };

  return schema;
}

/**
 * Generate multiple calculator schemas for a calculator page
 */
export function generateCompleteCalculatorSchemas({
  calculator,
  financialProduct,
  breadcrumb,
  faq,
  howTo
}) {
  const schemas = [
    generateCalculatorSchema(calculator)
  ];

  if (financialProduct) {
    schemas.push(generateFinancialProductSchema(financialProduct));
  }

  if (breadcrumb) {
    schemas.push(generateBreadcrumbSchema(breadcrumb));
  }

  if (faq) {
    schemas.push(generateFAQSchema(faq));
  }

  if (howTo) {
    schemas.push(generateHowToSchema(howTo));
  }

  return schemas;
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export default {
  generateCalculatorSchema,
  generateFinancialProductSchema,
  generateCompleteCalculatorSchemas,
  generateBreadcrumbSchema
};
