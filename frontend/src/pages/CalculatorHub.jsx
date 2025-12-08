import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import './CalculatorHub.css';

/**
 * Calculator Hub Component
 * Central page listing all available financial calculators
 */
function CalculatorHub() {
  const calculators = [
    // TOP PRIORITY - HIGHEST SEO VALUE
    // === Global Calculators ===
    {
      id: 'mortgage-us',
      title: 'US Mortgage Calculator',
      description: 'Calculate US mortgage monthly payment, total interest, and amortization.',
      icon: '🇺🇸',
      category: 'Global',
      priority: 'high',
      route: '/calculators/mortgage-us'
    },
    {
      id: 'loan-payment-us',
      title: 'US Loan Payment Calculator',
      description: 'Calculate US loan monthly payment and total interest.',
      icon: '🇺🇸',
      category: 'Global',
      priority: 'high',
      route: '/calculators/loan-payment-us'
    },
    {
      id: 'credit-card-payoff-us',
      title: 'US Credit Card Payoff',
      description: 'Calculate months to pay off and total interest for US credit card debt.',
      icon: '🇺🇸',
      category: 'Global',
      priority: 'high',
      route: '/calculators/credit-card-payoff-us'
    },
    {
      id: '401k-retirement-us',
      title: 'US 401(k) Retirement',
      description: 'Estimate 401k retirement savings growth for US users.',
      icon: '🇺🇸',
      category: 'Global',
      priority: 'high',
      route: '/calculators/401k-retirement-us'
    },
    {
      id: 'savings-growth-us',
      title: 'US Savings Growth',
      description: 'Estimate future value of US savings with regular deposits.',
      icon: '🇺🇸',
      category: 'Global',
      priority: 'high',
      route: '/calculators/savings-growth-us'
    },
    {
      id: 'vat-uk',
      title: 'UK VAT Calculator',
      description: 'Calculate VAT and total price for UK purchases.',
      icon: '🇬🇧',
      category: 'Global',
      priority: 'high',
      route: '/calculators/vat-uk'
    },
    {
      id: 'mortgage-affordability-uk',
      title: 'UK Mortgage Affordability',
      description: 'Estimate how much mortgage you can afford in the UK.',
      icon: '🇬🇧',
      category: 'Global',
      priority: 'high',
      route: '/calculators/mortgage-affordability-uk'
    },
    {
      id: 'savings-interest-uk',
      title: 'UK Savings Interest',
      description: 'Estimate interest earned on UK savings accounts.',
      icon: '🇬🇧',
      category: 'Global',
      priority: 'high',
      route: '/calculators/savings-interest-uk'
    },
    // === India/Default Calculators ===
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate monthly installments for home, car, or personal loans',
      icon: '🏠',
      category: 'Loans',
      priority: 'high',
      route: '/emi-calculator'
    },
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate mutual fund SIP returns and wealth creation',
      icon: '📈',
      category: 'Investments',
      priority: 'high',
      route: '/sip-calculator'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Calculate Fixed Deposit maturity and interest',
      icon: '🏦',
      category: 'Savings',
      priority: 'high',
      route: '/fd-calculator'
    },
    {
      id: 'rd',
      title: 'RD Calculator',
      description: 'Calculate Recurring Deposit returns',
      icon: '📅',
      category: 'Savings',
      priority: 'high',
      route: '/rd-calculator'
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
        {filteredCalculators.map(calculator => (
          <div key={calculator.id} className="calculator-card">
            {calculator.comingSoon && (
              <div className="coming-soon-badge">Coming Soon</div>
            )}
            <div className="calculator-icon">{calculator.icon}</div>
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
        ))}
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
