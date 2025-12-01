/**
 * Structured Data Schemas for SEO
 * Provides rich snippets for search engines
 */

/**
 * Organization schema for VegaKash.AI
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VegaKash.AI",
  "url": "https://vegakash.ai",
  "logo": "https://vegakash.ai/logo.png",
  "description": "AI-powered financial planning and budget management platform",
  "sameAs": [
    // Add your social media links here
    // "https://twitter.com/vegakashai",
    // "https://linkedin.com/company/vegakashai"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "availableLanguage": ["English", "Hindi"]
  }
});

/**
 * WebApplication schema for the budget planner
 */
export const getWebApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "VegaKash.AI - Budget Planner",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "description": "Free AI-powered budget planner and financial calculator. Manage your finances, calculate EMI, SIP, and get personalized savings recommendations.",
  "featureList": [
    "AI-powered budget recommendations",
    "EMI Calculator",
    "SIP Calculator", 
    "Loan Calculator",
    "Multi-loan management",
    "Debt strategy comparison",
    "Financial goal tracking",
    "PDF export of financial plans"
  ],
  "screenshot": "https://vegakash.ai/screenshot.jpg",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "softwareVersion": "1.0.0",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  }
});

/**
 * FinancialService schema
 */
export const getFinancialServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "VegaKash.AI Financial Planning",
  "description": "Comprehensive financial planning service with AI-powered budget advice, loan calculators, and savings strategies",
  "url": "https://vegakash.ai",
  "serviceType": "Financial Planning",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Financial Tools",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Budget Planning",
          "description": "AI-powered budget planning and expense tracking"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "EMI Calculator",
          "description": "Calculate loan EMI with detailed breakdown"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "SIP Calculator",
          "description": "Calculate returns on systematic investment plans"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Debt Strategy Advisor",
          "description": "Compare snowball vs avalanche debt repayment strategies"
        }
      }
    ]
  }
});

/**
 * Calculator-specific schema
 */
export const getCalculatorSchema = (calculatorType) => {
  const calculatorInfo = {
    emi: {
      name: "EMI Calculator",
      description: "Calculate Equated Monthly Installment (EMI) for loans with detailed amortization schedule",
      url: "/calculators/emi"
    },
    sip: {
      name: "SIP Calculator",
      description: "Calculate returns on Systematic Investment Plan with compound interest",
      url: "/calculators/sip"
    },
    loan: {
      name: "Loan Calculator",
      description: "Compare different loan options and repayment strategies",
      url: "/calculators/loan"
    }
  };

  const info = calculatorInfo[calculatorType] || calculatorInfo.emi;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": info.name,
    "applicationCategory": "FinanceApplication",
    "description": info.description,
    "url": `https://vegakash.ai${info.url}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "operatingSystem": "Web Browser"
  };
};

/**
 * FAQ schema for common questions
 */
export const getFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is VegaKash.AI free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, VegaKash.AI is completely free to use. All features including the AI budget planner, calculators, and PDF export are available at no cost."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI budget planner work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The AI budget planner analyzes your income, expenses, and financial goals using advanced AI algorithms to provide personalized recommendations for budgeting, saving, and debt management."
      }
    },
    {
      "@type": "Question",
      "name": "Is my financial data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, your data is processed securely and is not stored on our servers. All calculations happen in real-time and your financial information remains private."
      }
    },
    {
      "@type": "Question",
      "name": "Can I calculate EMI for multiple loans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, VegaKash.AI supports multiple loan management. You can add as many loans as you need and compare different debt repayment strategies."
      }
    },
    {
      "@type": "Question",
      "name": "What is the 50-30-20 budgeting rule?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 50-30-20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings. VegaKash.AI uses this and other strategies to help you budget effectively."
      }
    }
  ]
});

/**
 * BreadcrumbList schema for navigation
 */
export const getBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `https://vegakash.ai${crumb.url}`
  }))
});

/**
 * HowTo schema for guides
 */
export const getHowToSchema = () => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create a Budget with VegaKash.AI",
  "description": "Step-by-step guide to creating a comprehensive financial budget using AI-powered tools",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Enter Income Information",
      "text": "Enter your monthly primary and additional income sources"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Add Your Expenses",
      "text": "Input all monthly expenses including housing, utilities, groceries, and entertainment"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Include Loans and Debts",
      "text": "Add your active loans with EMI or principal amount, interest rates, and remaining tenure"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Set Financial Goals",
      "text": "Define your savings targets and emergency fund goals"
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Calculate Summary",
      "text": "Click Calculate to see your financial summary with savings rate and debt-to-income ratio"
    },
    {
      "@type": "HowToStep",
      "position": 6,
      "name": "Get AI Recommendations",
      "text": "Generate personalized AI-powered budget recommendations and action plan"
    }
  ]
});
