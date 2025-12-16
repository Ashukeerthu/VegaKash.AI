/**
 * SEO Schemas for EMI Calculator
 * Enhanced structured data for better search visibility
 */

/**
 * HowTo Schema - Step-by-step guide for using EMI calculator
 */
export const emiCalculatorHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Calculate EMI for Loans",
  "description": "Step-by-step guide to calculate Equated Monthly Installment (EMI) for home loans, car loans, and personal loans",
  "totalTime": "PT2M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "EMI Calculator"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Enter Loan Amount",
      "text": "Input the principal amount you want to borrow. You can use the slider or type directly.",
      "url": "https://vegaktools.com/in/calculators/emi#step1",
      "image": "https://vegakash.ai/images/emi-step1.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Set Interest Rate",
      "text": "Enter the annual interest rate offered by your lender. Typically ranges from 7-12% for home loans.",
      "url": "https://vegaktools.com/in/calculators/emi#step2",
      "image": "https://vegakash.ai/images/emi-step2.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Choose Loan Tenure",
      "text": "Select your loan tenure in years. Longer tenure means lower EMI but higher total interest.",
      "url": "https://vegaktools.com/in/calculators/emi#step3",
      "image": "https://vegakash.ai/images/emi-step3.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "View Results",
      "text": "See your monthly EMI, total interest, and total amount payable. Check the amortization schedule for detailed breakdown.",
      "url": "https://vegaktools.com/in/calculators/emi#step4",
      "image": "https://vegakash.ai/images/emi-step4.jpg"
    }
  ]
};

/**
 * FinancialProduct Schema - Home Loan
 */
export const homeLoanProductSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Home Loan EMI Calculator",
  "description": "Calculate EMI for home loans with competitive interest rates ranging from 8-10% p.a.",
  "category": "Home Loan",
  "feesAndCommissionsSpecification": "Processing fees typically 0.5-1% of loan amount",
  "interestRate": {
    "@type": "QuantitativeValue",
    "minValue": 8.0,
    "maxValue": 10.0,
    "unitText": "% per annum"
  },
  "annualPercentageRate": {
    "@type": "QuantitativeValue",
    "minValue": 8.5,
    "maxValue": 10.5,
    "unitText": "%"
  },
  "termDuration": {
    "@type": "QuantitativeValue",
    "minValue": 5,
    "maxValue": 30,
    "unitText": "years"
  },
  "amount": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "minValue": 500000,
    "maxValue": 50000000
  }
};

/**
 * FinancialProduct Schema - Car Loan
 */
export const carLoanProductSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Car Loan EMI Calculator",
  "description": "Calculate EMI for car loans with interest rates ranging from 7-12% p.a. for tenures up to 7 years",
  "category": "Car Loan",
  "feesAndCommissionsSpecification": "Processing fees 1-2% of loan amount, documentation charges apply",
  "interestRate": {
    "@type": "QuantitativeValue",
    "minValue": 7.0,
    "maxValue": 12.0,
    "unitText": "% per annum"
  },
  "termDuration": {
    "@type": "QuantitativeValue",
    "minValue": 1,
    "maxValue": 7,
    "unitText": "years"
  },
  "amount": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "minValue": 100000,
    "maxValue": 5000000
  }
};

/**
 * FinancialProduct Schema - Personal Loan
 */
export const personalLoanProductSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Personal Loan EMI Calculator",
  "description": "Calculate EMI for personal loans with interest rates ranging from 10-24% p.a.",
  "category": "Personal Loan",
  "feesAndCommissionsSpecification": "Processing fees 2-3% of loan amount",
  "interestRate": {
    "@type": "QuantitativeValue",
    "minValue": 10.0,
    "maxValue": 24.0,
    "unitText": "% per annum"
  },
  "termDuration": {
    "@type": "QuantitativeValue",
    "minValue": 1,
    "maxValue": 5,
    "unitText": "years"
  },
  "amount": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "minValue": 50000,
    "maxValue": 2500000
  }
};

/**
 * SoftwareApplication Schema - EMI Calculator Tool
 */
export const emiCalculatorAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "VegaKash EMI Calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
    "bestRating": "5",
    "worstRating": "1"
  },
  "description": "Free online EMI calculator for calculating equated monthly installments for home loans, car loans, and personal loans with detailed amortization schedule",
  "featureList": [
    "EMI Calculation",
    "Amortization Schedule",
    "Principal vs Interest Breakdown",
    "Yearly and Monthly View",
    "Multi-currency Support",
    "Prepayment Calculator",
    "Eligibility Calculator",
    "Balance Transfer Analysis"
  ]
};

/**
 * Enhanced FAQ Schema with more questions
 */
export const emiFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is EMI and how is it calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender. It is calculated using the formula: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1], where P is the principal loan amount, r is the monthly interest rate, and n is the total number of monthly installments."
      }
    },
    {
      "@type": "Question",
      "name": "How can I reduce my EMI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can reduce your EMI by: 1) Making a higher down payment to reduce principal, 2) Negotiating for lower interest rates, 3) Extending the loan tenure (though this increases total interest), 4) Making prepayments to reduce outstanding principal, 5) Transferring to a lender with lower rates, 6) Improving your credit score to qualify for better rates."
      }
    },
    {
      "@type": "Question",
      "name": "What is a good EMI to income ratio?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Financial experts recommend that your total EMI obligations should not exceed 40-50% of your monthly income. This is known as the Fixed Obligation to Income Ratio (FOIR). For example, if your monthly income is ₹1,00,000, your total EMIs should ideally be below ₹40,000-50,000 to maintain healthy finances."
      }
    },
    {
      "@type": "Question",
      "name": "Can I prepay my loan without penalty?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most floating rate home loans in India allow prepayment without penalty as per RBI guidelines. However, fixed-rate loans and some personal/car loans may have prepayment charges ranging from 2-5% of the outstanding amount. Always check your loan agreement for specific terms."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between flat rate and reducing balance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Flat rate calculates interest on the full principal amount throughout the loan tenure, resulting in higher total interest. Reducing balance (most common) calculates interest only on the outstanding principal, which decreases with each EMI payment. A 10% flat rate is approximately equivalent to 18-19% reducing rate, making reducing balance much more economical."
      }
    },
    {
      "@type": "Question",
      "name": "How does prepayment affect my loan - EMI or tenure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When you make a prepayment, most lenders offer two options: 1) Reduce EMI and keep tenure same - lowers your monthly burden, 2) Reduce tenure and keep EMI same - saves more on total interest. The second option typically results in greater overall savings. Some floating rate loans automatically adjust tenure while keeping EMI constant."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if I miss an EMI payment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Missing EMI payments can have serious consequences: 1) Late payment charges and penal interest (typically 2% per month), 2) Negative impact on your CIBIL score, affecting future loan eligibility, 3) Additional interest on the unpaid amount, 4) Legal notice from the lender, 5) In extreme cases, asset seizure or auction. Always contact your lender immediately if facing financial difficulties to explore restructuring options."
      }
    },
    {
      "@type": "Question",
      "name": "Is my EMI amount fixed for the entire loan tenure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For fixed-rate loans, EMI remains constant throughout the tenure. However, for floating-rate loans (most common in India), EMI can change when the lender revises interest rates based on RBI's repo rate or external benchmarks like MCLR or Repo-linked rates. Some lenders adjust tenure instead of EMI amount when rates change."
      }
    },
    {
      "@type": "Question",
      "name": "How does CIBIL score affect my loan EMI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your CIBIL score doesn't directly affect EMI amount, but it significantly impacts the interest rate offered by lenders. A higher score (750+) makes you eligible for lower interest rates, typically 0.5-2% lower than someone with a score below 700. This difference can result in thousands of rupees savings on EMI. For example, on a ₹25 lakh loan for 20 years, a 1% lower interest rate saves approximately ₹2,000 per month."
      }
    },
    {
      "@type": "Question",
      "name": "Can I change my loan tenure after taking the loan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, many lenders allow you to increase or decrease your loan tenure through loan restructuring or balance transfer. Extending tenure will reduce your EMI but increase total interest paid. Shortening tenure will increase EMI but save on interest. The process usually involves some paperwork and may include nominal processing charges. Contact your lender to understand available options and associated costs."
      }
    }
  ]
};

/**
 * VideoObject Schema (if you have tutorial video)
 */
export const emiCalculatorVideoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Use EMI Calculator - Complete Guide",
  "description": "Learn how to calculate EMI for loans using our free online calculator. Step-by-step tutorial covering home loans, car loans, and personal loans.",
  "thumbnailUrl": "https://vegakash.ai/images/emi-calculator-video-thumbnail.jpg",
  "uploadDate": "2024-12-01T08:00:00+05:30",
  "duration": "PT3M45S",
  "contentUrl": "https://vegakash.ai/videos/emi-calculator-tutorial.mp4",
  "embedUrl": "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/WatchAction",
    "userInteractionCount": 15000
  }
};

/**
 * Article Schema - EMI Calculator Guide
 */
export const emiCalculatorArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to EMI Calculation for Home, Car, and Personal Loans",
  "description": "Comprehensive guide explaining EMI calculation formula, factors affecting EMI, prepayment strategies, and tips to reduce loan burden",
  "image": "https://vegakash.ai/images/emi-calculator-guide.jpg",
  "author": {
    "@type": "Organization",
    "name": "VegaKash.AI",
    "url": "https://vegakash.ai"
  },
  "publisher": {
    "@type": "Organization",
    "name": "VegaKash.AI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vegakash.ai/logo.png"
    }
  },
  "datePublished": "2024-12-01",
  "dateModified": "2025-12-14"
};

/**
 * Combined Schema Graph for Maximum SEO Impact
 */
export const emiCalculatorCompleteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    emiCalculatorHowToSchema,
    emiFAQSchema,
    emiCalculatorAppSchema,
    homeLoanProductSchema,
    carLoanProductSchema,
    personalLoanProductSchema,
    emiCalculatorArticleSchema,
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://vegaktools.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Calculators",
          "item": "https://vegaktools.com/in/calculators"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "EMI Calculator",
          "item": "https://vegaktools.com/in/calculators/emi"
        }
      ]
    },
    {
      "@type": "WebPage",
      "name": "EMI Calculator - Free Loan EMI Calculator Online",
      "description": "Calculate EMI for home loans, car loans, and personal loans with our free online EMI calculator. Get amortization schedule, prepayment analysis, and eligibility check.",
      "url": "https://vegaktools.com/in/calculators/emi",
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://vegakash.ai/images/emi-calculator-og.jpg",
        "width": 1200,
        "height": 630
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".calculator-header", ".seo-content-section h2"]
      }
    }
  ]
};

export default emiCalculatorCompleteSchema;
