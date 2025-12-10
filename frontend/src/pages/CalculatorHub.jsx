import React from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
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
      title: 'Mortgage Calculator',
      description: 'Calculate monthly payment, total interest, and amortization schedule for US mortgages.',
      icon: '🏠',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/calculators/mortgage-us',
      region: 'US'
    },
    {
      id: 'loan-payment-us',
      title: 'Loan Payment Calculator',
      description: 'Calculate US loan monthly payment and total interest for personal loans.',
      icon: '💰',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/calculators/loan-payment-us',
      region: 'US'
    },
    {
      id: 'credit-card-payoff-us',
      title: 'Credit Card Payoff Calculator',
      description: 'Calculate months to pay off and total interest for US credit card debt.',
      icon: '💳',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/calculators/credit-card-payoff-us',
      region: 'US'
    },
    {
      id: '401k-retirement-us',
      title: '401(k) Retirement Calculator',
      description: 'Estimate 401k retirement savings growth with employer matching for US users.',
      icon: '📈',
      category: 'Investments & Savings',
      priority: 'high',
      route: '/calculators/401k-retirement-us',
      region: 'US'
    },
    {
      id: 'savings-growth-us',
      title: 'Savings Growth Calculator',
      description: 'Estimate future value of US savings with regular deposits and compound interest.',
      icon: '💵',
      category: 'Investments & Savings',
      priority: 'high',
      route: '/calculators/savings-growth-us',
      region: 'US'
    },
    {
      id: 'vat-uk',
      title: 'VAT Calculator',
      description: 'Calculate VAT and total price for UK purchases with 20% rate.',
      icon: '📄',
      category: 'Tax & VAT',
      priority: 'high',
      route: '/calculators/vat-uk',
      region: 'UK'
    },
    {
      id: 'mortgage-affordability-uk',
      title: 'Mortgage Affordability Calculator',
      description: 'Estimate how much mortgage you can afford in the UK based on income.',
      icon: '🏠',
      category: 'Loans & Mortgages',
      priority: 'high',
      route: '/calculators/mortgage-affordability-uk',
      region: 'UK'
    },
    {
      id: 'savings-interest-uk',
      title: 'Savings Interest Calculator',
      description: 'Estimate interest earned on UK savings accounts with compound growth.',
      icon: '💵',
      category: 'Investments & Savings',
      priority: 'high',
      route: '/calculators/savings-interest-uk',
      region: 'UK'
    },
    // === India/Default Calculators ===
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate monthly installments for home, car, or personal loans.',
      icon: '🏠',
      category: 'Loans',
      priority: 'high',
      route: '/emi-calculator',
      region: 'India'
    },
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate mutual fund SIP returns and wealth creation.',
      icon: '📊',
      category: 'Investments',
      priority: 'high',
      route: '/sip-calculator',
      region: 'India'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Calculate Fixed Deposit maturity and interest.',
      icon: '🏦',
      category: 'Savings',
      priority: 'high',
      route: '/fd-calculator',
      region: 'India'
    },
    {
      id: 'rd',
      title: 'RD Calculator',
      description: 'Calculate Recurring Deposit returns.',
      icon: '🗓️',
      category: 'Savings',
      priority: 'high',
      route: '/rd-calculator',
      region: 'India'
    },
    {
      id: 'auto-loan',
      title: 'Auto Loan Calculator',
      description: 'Calculate car loan EMI and total interest',
      icon: '🚗',
      category: 'Loans',
      priority: 'high',
      route: '/car-loan-calculator'
    },
    {
      id: 'income-tax',
      title: 'Income Tax Calculator',
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
      id: 'home-loan-affordability',
      title: 'Home Loan Affordability',
      description: 'Calculate maximum home loan you can afford',
      icon: '🏡',
      category: 'Loans',
      priority: 'high',
      route: '/calculators/home-loan-affordability',
      comingSoon: true
    }
  ];

  const categories = ['All', 'Loans', 'Investments', 'Savings', 'Tax', 'Planning'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredCalculators = selectedCategory === 'All' 
    ? calculators 
    : calculators.filter(calc => calc.category === selectedCategory);

  return (
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
  );
}

export default CalculatorHub;
