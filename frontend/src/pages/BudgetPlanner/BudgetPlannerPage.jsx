/**
 * Budget Planner Page
 * Main page integrating all budget planner components
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BudgetInputForm from '../../components/BudgetPlanner/BudgetInputForm';
import BudgetResults from '../../components/BudgetPlanner/BudgetResults';
import { generateBudget, formatBudgetRequest } from '../../services/budgetPlannerApi';
import './BudgetPlannerPage.css';

const BudgetPlannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [budgetPlan, setBudgetPlan] = useState(null);
  const [originalInputs, setOriginalInputs] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Handle form submission
  const handleGenerateBudget = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format the request
      const budgetRequest = formatBudgetRequest(formData);
      
      // Store original inputs for rebalancing
      setOriginalInputs(budgetRequest);
      
      // Call API
      const response = await generateBudget(budgetRequest);
      
      // Set results
      setBudgetPlan(response);
      setShowResults(true);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
    } catch (err) {
      console.error('Error generating budget:', err);
      setError(err.message || 'Failed to generate budget. Please try again.');
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle rebalanced budget update
  const handleRebalanced = (rebalancedResponse) => {
    setBudgetPlan(rebalancedResponse);
  };

  // Handle create new budget
  const handleCreateNew = () => {
    setBudgetPlan(null);
    setShowResults(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="budget-planner-page">
      <Helmet>
        <title>AI Budget Planner - VegaKash.AI</title>
        <meta 
          name="description" 
          content="Generate your personalized AI-powered budget plan. Smart 50/30/20 allocation with cost-of-living adjustments, alerts, and recommendations." 
        />
        <meta name="keywords" content="budget planner, AI budget, financial planning, 50/30/20 rule, money management" />
      </Helmet>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>🤖 AI Budget Planner</h1>
          <p className="hero-subtitle">
            Get your personalized budget plan powered by AI. We analyze your income, expenses, and goals 
            to create a smart financial plan tailored just for you.
          </p>
          <div className="hero-features">
            <div className="feature-badge">
              <span className="badge-icon">🌍</span>
              <span>Global Support</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">📊</span>
              <span>Smart Analysis</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">⚡</span>
              <span>Instant Results</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">💡</span>
              <span>Expert Advice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">❌</span>
            <div className="error-text">
              <strong>Error:</strong> {error}
            </div>
            <button onClick={() => setError(null)} className="error-close">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      {!showResults && (
        <div className="form-section">
          <div className="section-header">
            <h2>Create Your Budget Plan</h2>
            <p>Fill in your financial details to get started. All fields are secure and never stored on our servers.</p>
          </div>
          <BudgetInputForm
            onSubmit={handleGenerateBudget}
            loading={loading}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Generating Your Budget Plan...</h3>
            <p>Our AI is analyzing your data and creating a personalized plan</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {showResults && budgetPlan && (
        <div id="results-section" className="results-section">
          <BudgetResults 
            budgetPlan={budgetPlan}
            currency={budgetPlan.plan?.metadata?.currency || '₹'}
            originalInputs={originalInputs}
            onRebalanced={handleRebalanced}
          />
          
          <div className="results-footer">
            <button onClick={handleCreateNew} className="btn-new-budget">
              📝 Create New Budget
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="info-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Enter Your Details</h3>
            <p>Provide your income, expenses, loans, and savings goals</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI analyzes your data with cost-of-living adjustments</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Get Your Plan</h3>
            <p>Receive a personalized budget with smart recommendations</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Track & Adjust</h3>
            <p>Monitor your budget and adjust as your needs change</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose Our AI Budget Planner?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">🌍</span>
            <h4>Global Coverage</h4>
            <p>Support for 25+ countries with automatic cost-of-living adjustments</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <h4>Smart Allocation</h4>
            <p>AI-optimized 50/30/20 budget split based on your lifestyle and location</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚠️</span>
            <h4>Risk Alerts</h4>
            <p>Get instant alerts for high rent, excessive EMI, and low savings</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📈</span>
            <h4>Goal Tracking</h4>
            <p>Set and track multiple savings goals with priority management</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💳</span>
            <h4>Loan Management</h4>
            <p>Track up to 5 loans with EMI calculations and burden analysis</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h4>Private & Secure</h4>
            <p>Your data is never stored. Everything happens in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlannerPage;
