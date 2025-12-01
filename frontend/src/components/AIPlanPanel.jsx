import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import ProgressBar from './ProgressBar';

/**
 * AI Plan Panel Component
 * Displays AI-generated financial plan
 */
function AIPlanPanel({ aiPlan, error, isGenerating, onGenerate, currency }) {
  if (isGenerating) {
    return (
      <div className="panel ai-plan-panel page-transition" id="ai-plan-section">
        <div className="panel-header">
          <h2>🤖 AI-Powered Financial Plan</h2>
        </div>
        <div className="panel-body">
          <LoadingSpinner 
            size="medium" 
            message="Analyzing your finances with AI..." 
          />
          <ProgressBar indeterminate={true} label="This may take 10-30 seconds" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel ai-plan-panel" id="ai-plan-section">
        <div className="panel-header">
          <h2>🤖 AI-Powered Financial Plan</h2>
        </div>
        <div className="panel-body">
          <div className="error-box">
            <p>⚠️ {error}</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={onGenerate}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!aiPlan) {
    return (
      <div className="panel ai-plan-panel page-transition" id="ai-plan-section">
        <div className="panel-header">
          <h2>🤖 AI-Powered Financial Plan</h2>
          <p>Get personalized recommendations powered by AI</p>
        </div>
        <div className="panel-body">
          <button 
            className="btn btn-primary btn-large ripple-button hover-lift"
            onClick={onGenerate}
          >
            ✨ Generate AI Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel ai-plan-panel page-transition" id="ai-plan-section">
      <div className="panel-header">
        <h2>🤖 AI-Powered Financial Plan</h2>
        <button 
          className="btn btn-sm btn-outline"
          onClick={onGenerate}
        >
          🔄 Regenerate Plan
        </button>
      </div>
      
      <div className="panel-body">
        {/* AI Summary */}
        <div className="ai-section">
          <h3>📋 Summary</h3>
          <p>{aiPlan.summary_text}</p>
        </div>

        {/* Budget Breakdown */}
        <div className="ai-section">
          <h3>💰 Recommended Budget Breakdown</h3>
          <div className="content-box">
            <p style={{ whiteSpace: 'pre-line' }}>{aiPlan.budget_breakdown}</p>
          </div>
        </div>

        {/* Expense Optimizations */}
        <div className="ai-section">
          <h3>✂️ Expense Optimization Tips</h3>
          <ul className="ai-list">
            {aiPlan.expense_optimizations.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Savings and Investment Plan */}
        <div className="ai-section">
          <h3>📈 Savings & Investment Plan</h3>
          <div className="content-box">
            <p style={{ whiteSpace: 'pre-line' }}>{aiPlan.savings_and_investment_plan}</p>
          </div>
        </div>

        {/* Debt Strategy */}
        <div className="ai-section">
          <h3>💳 Debt Repayment Strategy</h3>
          <div className="content-box">
            <p style={{ whiteSpace: 'pre-line' }}>{aiPlan.debt_strategy}</p>
          </div>
        </div>

        {/* Goal Plan */}
        <div className="ai-section">
          <h3>🎯 Goal Achievement Plan</h3>
          <div className="content-box">
            <p style={{ whiteSpace: 'pre-line' }}>{aiPlan.goal_plan}</p>
          </div>
        </div>

        {/* Action Items */}
        <div className="ai-section highlight-section">
          <h3>✅ Next 30 Days - Action Checklist</h3>
          <ul className="action-list">
            {aiPlan.action_items_30_days.map((action, index) => (
              <li key={index}>
                <span className="action-number">{index + 1}</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          <p><strong>⚠️ Disclaimer:</strong> {aiPlan.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

export default AIPlanPanel;
