import React from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import ScrollToTop from '../modules/core/ui/ScrollToTop';
import './CalculatorHub.css';

/**
 * Calculator Hub Component
 * Central page listing all available financial calculators
 */
function CalculatorHub() {
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: true },
    { label: 'Calculators', path: null }
  ];
  
  const calculators = [
    // TOP PRIORITY - HIGHEST SEO VALUE
    // === Global Calculators ===
    {
      id: 'mortgage-us',
      title: 'Mortgage Calculator (US)',
      description: 'Calculate monthly payment, total interest, and amortization schedule for US mortgages.',
      icon: '🏠',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/us/calculators/mortgage',
      region: 'US'
    },
    {
      id: 'loan-payment-us',
      title: 'Loan Payment Calculator (US)',
      description: 'Calculate US loan monthly payment and total interest for personal loans.',
      icon: '💰',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/us/calculators/loan',
      region: 'US'
    },
    {
      id: 'credit-card-payoff-us',
      title: 'Credit Card Payoff Calculator (US)',
      description: 'Calculate months to pay off and total interest for US credit card debt.',
      icon: '💳',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/us/calculators/credit-card',
      region: 'US'
    },
    {
      id: '401k-retirement-us',
      title: '401(k) Retirement Calculator (US)',
      description: 'Estimate 401k retirement savings growth with employer matching for US users.',
      icon: '📈',
      category: 'Investments & Savings',
      priority: 'high',
      route: '/us/calculators/401k',
      region: 'US'
    },
    {
      id: 'savings-growth-us',
      title: 'Savings Growth Calculator (US)',
      description: 'Estimate future value of US savings with regular deposits and compound interest.',
      icon: '💵',
      category: 'Investments & Savings',
      priority: 'high',
      route: '/us/calculators/savings',
      region: 'US'
    },
    {
      id: 'vat-uk',
      title: 'VAT Calculator (UK)',
      description: 'Calculate VAT and total price for UK purchases with 20% rate.',
      icon: '📄',
      category: 'Tax & VAT',
      priority: 'high',
      route: '/uk/calculators/vat',
      region: 'UK'
    },
    {
      id: 'mortgage-affordability-uk',
      title: 'Mortgage Affordability Calculator (UK)',
      description: 'Estimate how much mortgage you can afford in the UK based on income, salary multipliers, and deposit.',
      icon: '🏠',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/uk/calculators/mortgage',
      region: 'UK'
    },
    {
      id: 'savings-interest-uk',
      title: 'Savings Interest Calculator (UK)',
      description: 'Estimate interest earned on UK savings accounts with compound growth.',
      icon: '💵',
      category: 'Investments & Savings',
      priority: 'high',
      route: '/uk/calculators/savings',
      region: 'UK'
    },
    // === India/Default Calculators ===
    {
      id: 'emi',
      title: 'EMI Calculator (India)',
      description: 'Calculate monthly installments for home, car, or personal loans.',
      icon: '🏠',
      category: 'Loans',
      priority: 'high',
      route: '/in/calculators/emi',
      region: 'India'
    },
    {
      id: 'sip',
      title: 'SIP Calculator (India)',
      description: 'Calculate mutual fund SIP returns and wealth creation.',
      icon: '📊',
      category: 'Investments',
      priority: 'high',
      route: '/in/calculators/sip',
      region: 'India'
    },
    {
      id: 'fd',
      title: 'FD Calculator (India)',
      description: 'Calculate Fixed Deposit maturity and interest.',
      icon: '🏦',
      category: 'Savings',
      priority: 'high',
      route: '/in/calculators/fd',
      region: 'India'
    },
    {
      id: 'rd',
      title: 'RD Calculator (India)',
      description: 'Calculate Recurring Deposit returns.',
      icon: '🗓️',
      category: 'Savings',
      priority: 'high',
      route: '/in/calculators/rd',
      region: 'India'
    },
    {
      id: 'auto-loan',
      title: 'Auto Loan Calculator (India)',
      description: 'Calculate car loan EMI and total interest',
      icon: '🚗',
      category: 'Loans',
      priority: 'high',
      route: '/in/calculators/auto-loan',
      region: 'India'
    },
    {
      id: 'income-tax',
      title: 'Income Tax Calculator (India)',
      description: 'Compare old vs new tax regime (FY 2024-25)',
      icon: '📊',
      category: 'Tax',
      priority: 'high',
      route: '/income-tax-calculator',
      comingSoon: true
    },
    {
      id: 'savings-goal',
      title: 'Savings Goal Calculator',
      description: 'Plan monthly investments to reach financial goals',
      icon: '🎯',
      category: 'Planning',
      priority: 'high',
      route: '/calculators/savings-goal',
      comingSoon: true
    },
    {
      id: 'emergency-fund',
      title: 'Emergency Fund Calculator',
      description: 'Calculate emergency fund requirements',
      icon: '🆘',
      category: 'Planning',
      priority: 'high',
      route: '/calculators/emergency-fund',
      comingSoon: true
    },
    // COMING SOON
    {
      id: 'retirement',
      title: 'Retirement Calculator',
      description: 'Plan your retirement corpus and investments',
      icon: '🏖️',
      category: 'Planning',
      priority: 'high',
      route: '/calculators/retirement',
      comingSoon: true
    },
    {
      id: 'home-loan-eligibility',
      title: 'Home Loan Eligibility (India)',
      description: 'Calculate home loan eligibility with bank-specific FOIR, approval probability, and RBI-compliant LTV calculations',
      icon: '🏡',
      category: 'Loans',
      priority: 'high',
      route: '/india/calculators/home-loan-eligibility',
      region: 'India'
    }
  ];

  const categories = ['All', 'Loans', 'Investments', 'Savings', 'Tax', 'Planning'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredCalculators = selectedCategory === 'All' 
    ? calculators 
    : calculators.filter(calc => calc.category === selectedCategory);

  return (
    <>
      <ScrollToTop threshold={300} />
      <div className="calculator-hub">
        <SEO 
          title="Financial Calculators | VegaKash.AI"
          description="All financial calculators in one place — EMI, SIP, FD, RD, Car Loan, Income Tax and more."
          keywords="financial calculators, emi calculator, sip calculator, fd calculator, rd calculator, car loan calculator, income tax calculator"
          canonical="/calculators"
        structuredData={{
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Financial Calculators",
              "url": "https://vegaktools.com/calculators"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vegaktools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://vegaktools.com/calculators" }
              ]
            }
          ]
        }}
      />
      
      <div className="hub-header">
        <Breadcrumb items={breadcrumbItems} />
        <h1>Financial Calculators</h1>
        <p>Free online calculators to plan your financial future</p>
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="calculators-grid">
        {filteredCalculators.map(calculator => {
          const countryBadge = calculator.region || 'Global';

          return (
            <div key={calculator.id} className="calculator-card">
              {calculator.comingSoon && (
                <div className="coming-soon-badge">Coming Soon</div>
              )}
              <div className="card-header">
                <div className="calculator-icon">{calculator.icon}</div>
                <span className="country-badge">{countryBadge}</span>
              </div>
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
              <div className="calculator-meta">
                <span className="category-badge">{calculator.category}</span>
              </div>
              {calculator.comingSoon ? (
                <button className="calc-button disabled" disabled>
                  Coming Soon
                </button>
              ) : (
                <Link to={calculator.route} className="calc-button">
                  Use Calculator →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="hub-footer">
        <div className="feature-section">
          <h2>Why Use Our Calculators?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <h4>100% Free</h4>
              <p>No hidden charges or registration required</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <h4>Secure & Private</h4>
              <p>Your data stays on your device</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <h4>Instant Results</h4>
              <p>Get calculations in real-time</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <h4>Mobile Friendly</h4>
              <p>Works on all devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default CalculatorHub;
