import React from 'react';
import { formatCurrency } from '../utils/helpers';

/**
 * Summary Panel Component
 * Displays calculated financial summary (non-AI)
 */
function SummaryPanel({ summary, error, isCalculating, currency }) {
  if (isCalculating) {
    return (
      <div className="panel summary-panel" id="summary-section">
        <div className="panel-header">
          <h2>📊 Financial Summary</h2>
        </div>
        <div className="panel-body">
          <div className="loading">
            <div className="spinner"></div>
            <p>Calculating your financial summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel summary-panel" id="summary-section">
        <div className="panel-header">
          <h2>📊 Financial Summary</h2>
        </div>
        <div className="panel-body">
          <div className="error-box">
            <p>⚠️ {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="panel summary-panel placeholder" id="summary-section">
        <div className="panel-header">
          <h2>📊 Financial Summary</h2>
        </div>
        <div className="panel-body">
          <p className="placeholder-text">
            Fill in your financial information and click "Calculate Summary" to see your results here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel summary-panel" id="summary-section">
      <div className="panel-header">
        <h2>📊 Financial Summary</h2>
      </div>
      
      <div className="panel-body">
        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Total Income</div>
            <div className="metric-value positive">
              {formatCurrency(summary.total_income, currency)}
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Total Expenses</div>
            <div className="metric-value negative">
              {formatCurrency(summary.total_expenses, currency)}
            </div>
          </div>
          
          <div className="metric-card highlight">
            <div className="metric-label">Net Savings</div>
            <div className={`metric-value ${summary.has_deficit ? 'negative' : 'positive'}`}>
              {formatCurrency(summary.net_savings, currency)}
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Savings Rate</div>
            <div className={`metric-value ${summary.savings_rate_percent < 10 ? 'warning' : 'positive'}`}>
              {summary.savings_rate_percent.toFixed(1)}%
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Debt-to-Income Ratio</div>
            <div className={`metric-value ${summary.debt_to_income_ratio_percent > 40 ? 'negative' : 'positive'}`}>
              {summary.debt_to_income_ratio_percent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Basic Advice */}
        <div className="advice-box">
          <h3>💡 Quick Insights</h3>
          <p>{summary.basic_advice}</p>
        </div>

        {/* 50-30-20 Rule */}
        <div className="rule-section">
          <h3>📐 50-30-20 Rule Recommendation</h3>
          <p className="rule-description">
            The 50-30-20 rule suggests allocating your income as follows:
          </p>
          
          <div className="rule-bars">
            <div className="rule-bar">
              <div className="rule-bar-label">
                <span>Needs (50%)</span>
                <span className="amount">{formatCurrency(summary.rule_50_30_20_needs, currency)}</span>
              </div>
              <div className="rule-bar-bg">
                <div className="rule-bar-fill needs" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div className="rule-bar">
              <div className="rule-bar-label">
                <span>Wants (30%)</span>
                <span className="amount">{formatCurrency(summary.rule_50_30_20_wants, currency)}</span>
              </div>
              <div className="rule-bar-bg">
                <div className="rule-bar-fill wants" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div className="rule-bar">
              <div className="rule-bar-label">
                <span>Savings (20%)</span>
                <span className="amount">{formatCurrency(summary.rule_50_30_20_savings, currency)}</span>
              </div>
              <div className="rule-bar-bg">
                <div className="rule-bar-fill savings" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryPanel;
