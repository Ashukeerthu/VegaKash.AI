import React from 'react';
import { Link } from 'react-router-dom';
import './CalculatorHub.css';

/**
 * Calculator Hub Component
 * Central page listing all available financial calculators
 */
function CalculatorHub() {
  const calculators = [
    // TOP PRIORITY - HIGHEST SEO VALUE
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate monthly installments for home, car, or personal loans',
      icon: '🏠',
      category: 'Loans',
      priority: 'high',
      route: '/calculators/emi'
    },
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate mutual fund SIP returns and wealth creation',
      icon: '📈',
      category: 'Investments',
      priority: 'high',
      route: '/calculators/sip'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Calculate Fixed Deposit maturity and interest',
      icon: '🏦',
      category: 'Savings',
      priority: 'high',
      route: '/calculators/fd'
    },
    {
      id: 'rd',
      title: 'RD Calculator',
      description: 'Calculate Recurring Deposit returns',
      icon: '📅',
      category: 'Savings',
      priority: 'high',
      route: '/calculators/rd'
    },
    {
      id: 'income-tax',
      title: 'Income Tax Calculator',
      description: 'Compare old vs new tax regime (FY 2024-25)',
      icon: '📊',
      category: 'Tax',
      priority: 'high',
      route: '/calculators/income-tax',
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
