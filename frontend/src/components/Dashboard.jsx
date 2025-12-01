import React, { useState, useEffect } from 'react';
import ExpenseBreakdownChart from './charts/ExpenseBreakdownChart';
import SavingsTrendChart from './charts/SavingsTrendChart';
import BeforeAfterChart from './charts/BeforeAfterChart';
import SkeletonLoader from './SkeletonLoader';
import '../styles/Dashboard.css';

function Dashboard({ formData, summary }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for smooth transition
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [formData, summary]);

  if (!summary || !formData) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <h2>📊 Dashboard</h2>
          <p>Calculate your financial summary to view the dashboard</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="dashboard-container page-transition">
        <div className="dashboard-header">
          <h2>📊 Financial Dashboard</h2>
          <p className="dashboard-subtitle">Loading your insights...</p>
        </div>
        <SkeletonLoader type="dashboard" />
      </div>
    );
  }

  const currency = formData.currency === 'INR' ? '₹' : formData.currency;

  return (
    <div className="dashboard-container page-transition">
      <div className="dashboard-header">
        <h2>📊 Financial Dashboard</h2>
        <p className="dashboard-subtitle">Visual insights into your finances</p>
      </div>

      <div className="dashboard-grid">
        {/* Key Metrics Cards */}
        <div className="metrics-row">
          <div className="metric-card positive stagger-item hover-lift">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h4>Total Income</h4>
              <p className="metric-value">{currency}{summary.total_income.toLocaleString()}</p>
            </div>
          </div>

          <div className="metric-card expense stagger-item hover-lift">
            <div className="metric-icon">📉</div>
            <div className="metric-content">
              <h4>Total Expenses</h4>
              <p className="metric-value">{currency}{summary.total_expenses.toLocaleString()}</p>
            </div>
          </div>

          <div className={`metric-card ${summary.net_savings > 0 ? 'positive' : 'deficit'} stagger-item hover-lift`}>
            <div className="metric-icon">{summary.net_savings > 0 ? '✅' : '⚠️'}</div>
            <div className="metric-content">
              <h4>Net Savings</h4>
              <p className="metric-value">{currency}{summary.net_savings.toLocaleString()}</p>
            </div>
          </div>

          <div className="metric-card info stagger-item hover-lift">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h4>Savings Rate</h4>
              <p className="metric-value">{summary.savings_rate_percent.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-card">
            <ExpenseBreakdownChart 
              expenses={formData.expenses} 
              currency={currency} 
            />
          </div>

          <div className="chart-card">
            <SavingsTrendChart 
              monthlySavings={summary.net_savings} 
              currency={currency} 
            />
          </div>

          <div className="chart-card full-width">
            <BeforeAfterChart 
              summary={summary} 
              currency={currency} 
            />
          </div>
        </div>

        {/* 50-30-20 Rule Visualization */}
        <div className="rule-section">
          <h3>🎯 50-30-20 Budget Rule Guide</h3>
          <p className="rule-description">
            The 50-30-20 rule suggests dividing your after-tax income into three categories
          </p>
          <div className="rule-grid">
            <div className="rule-card needs">
              <div className="rule-percentage">50%</div>
              <h4>Needs</h4>
              <p className="rule-amount">{currency}{summary.rule_50_30_20_needs.toLocaleString()}</p>
              <p className="rule-detail">Essentials like rent, groceries, utilities</p>
            </div>

            <div className="rule-card wants">
              <div className="rule-percentage">30%</div>
              <h4>Wants</h4>
              <p className="rule-amount">{currency}{summary.rule_50_30_20_wants.toLocaleString()}</p>
              <p className="rule-detail">Entertainment, dining out, hobbies</p>
            </div>

            <div className="rule-card savings">
              <div className="rule-percentage">20%</div>
              <h4>Savings</h4>
              <p className="rule-amount">{currency}{summary.rule_50_30_20_savings.toLocaleString()}</p>
              <p className="rule-detail">Investments, emergency fund, debt payoff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
