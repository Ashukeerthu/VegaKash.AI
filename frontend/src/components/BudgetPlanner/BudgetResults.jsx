/**
 * Budget Results Display Component
 * Shows generated budget with charts, breakdowns, and alerts
 * V1.2: Includes inline editing, rebalancing, and localStorage integration
 */
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { rebalanceBudget } from '../../services/budgetPlannerApi';
import './BudgetResults.css';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BudgetResults = ({ budgetPlan, currency = '₹', originalInputs = null, onRebalanced = null }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState(null);
  const [rebalancing, setRebalancing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (budgetPlan?.plan) {
      setEditedPlan(budgetPlan.plan);
    }
  }, [budgetPlan]);

  if (!budgetPlan || !budgetPlan.plan) {
    return null;
  }

  const { plan } = budgetPlan;
  const displayPlan = editMode ? editedPlan : plan;

  // Prepare pie chart data for budget split
  const pieData = {
    labels: ['Needs', 'Wants', 'Savings'],
    datasets: [
      {
        data: [
          plan.budget_split.needs_percent,
          plan.budget_split.wants_percent,
          plan.budget_split.savings_percent
        ],
        backgroundColor: [
          '#ef4444', // Red for Needs
          '#f59e0b', // Amber for Wants
          '#10b981', // Green for Savings
        ],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 3,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            weight: 600,
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
  };

  // Prepare bar chart data for category breakdown
  const needsData = plan.categories.needs;
  const wantsData = plan.categories.wants;
  const savingsData = plan.categories.savings;

  const barData = {
    labels: [
      ...Object.keys(needsData).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
      ...Object.keys(wantsData).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
      ...Object.keys(savingsData).map(k => k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')),
    ],
    datasets: [
      {
        label: 'Amount',
        data: [
          ...Object.values(needsData),
          ...Object.values(wantsData),
          ...Object.values(savingsData),
        ],
        backgroundColor: [
          ...Array(Object.keys(needsData).length).fill('#ef4444'),
          ...Array(Object.keys(wantsData).length).fill('#f59e0b'),
          ...Array(Object.keys(savingsData).length).fill('#10b981'),
        ],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y || 0;
            return `${currency}${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `${currency}${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#dc2626',
      high: '#ea580c',
      moderate: '#f59e0b',
      warning: '#eab308',
      info: '#3b82f6',
    };
    return colors[severity] || colors.info;
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    const icons = {
      critical: '🚨',
      high: '⚠️',
      moderate: '⚡',
      warning: '💡',
      info: 'ℹ️',
    };
    return icons[severity] || icons.info;
  };

  // Handle category amount edit
  const handleAmountEdit = (category, subcategory, newValue) => {
    const value = parseFloat(newValue) || 0;
    setEditedPlan(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [subcategory]: value
        }
      }
    }));
  };

  // Handle rebalance
  const handleRebalance = async () => {
    if (!originalInputs) {
      alert('Original inputs not available for rebalancing');
      return;
    }

    try {
      setRebalancing(true);
      const rebalanceRequest = {
        edited_plan: editedPlan,
        original_inputs: originalInputs,
        city_tier: plan.metadata?.city_tier || 'tier_1',
        col_multiplier: plan.metadata?.col_multiplier || 1.0
      };

      const response = await rebalanceBudget(rebalanceRequest);
      
      if (response.success && response.plan) {
        setEditedPlan(response.plan);
        setEditMode(false);
        if (onRebalanced) {
          onRebalanced(response);
        }
        alert('Budget rebalanced successfully!');
      }
    } catch (error) {
      console.error('Error rebalancing budget:', error);
      alert('Failed to rebalance budget. Please try again.');
    } finally {
      setRebalancing(false);
    }
  };

  // Removed localStorage functionality to prevent navigation blocking
  const handleSaveBudget = () => {
    alert('💾 Save functionality coming soon! Use the PDF export instead.');
  };

  const handleToggleHistory = () => {
    alert('📊 History feature coming soon!');
  };

  return (
    <div className="budget-results">
      {/* Header */}
      <div className="results-header">
        <h2>Your Personalized Budget Plan</h2>
        <div className="income-display">
          <span className="label">Monthly Income:</span>
          <span className="amount">{currency}{plan.income.toLocaleString()}</span>
        </div>
      </div>

      {/* Budget Split Overview */}
      <div className="split-overview">
        <div className="split-card needs">
          <div className="split-header">
            <span className="icon">🏠</span>
            <h3>Needs</h3>
          </div>
          <div className="split-percentage">{plan.budget_split.needs_percent.toFixed(1)}%</div>
          <div className="split-amount">{currency}{plan.budget_amounts.needs.toLocaleString()}</div>
        </div>

        <div className="split-card wants">
          <div className="split-header">
            <span className="icon">🎉</span>
            <h3>Wants</h3>
          </div>
          <div className="split-percentage">{plan.budget_split.wants_percent.toFixed(1)}%</div>
          <div className="split-amount">{currency}{plan.budget_amounts.wants.toLocaleString()}</div>
        </div>

        <div className="split-card savings">
          <div className="split-header">
            <span className="icon">💰</span>
            <h3>Savings</h3>
          </div>
          <div className="split-percentage">{plan.budget_split.savings_percent.toFixed(1)}%</div>
          <div className="split-amount">{currency}{plan.budget_amounts.savings.toLocaleString()}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Budget Distribution</h3>
          <div className="chart-wrapper pie-chart">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Category Breakdown</h3>
          <div className="chart-wrapper bar-chart">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Edit Mode Toggle */}
      <div className="edit-controls">
        <button
          className={`btn-toggle-edit ${editMode ? 'active' : ''}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? '📊 View Mode' : '✏️ Edit Mode'}
        </button>
        {editMode && (
          <button
            className="btn-rebalance"
            onClick={handleRebalance}
            disabled={rebalancing}
          >
            {rebalancing ? '⏳ Rebalancing...' : '🔄 Rebalance Budget'}
          </button>
        )}
      </div>

      {/* Detailed Breakdown with Inline Editing */}
      <div className="detailed-breakdown">
        <h3>Detailed Category Breakdown {editMode && <span className="edit-hint">(Click amounts to edit)</span>}</h3>

        <div className="category-section">
          <h4 className="category-title needs-title">
            <span className="icon">🏠</span> Needs ({currency}{Object.values(editMode ? editedPlan.categories.needs : needsData).reduce((a, b) => a + b, 0).toLocaleString()})
          </h4>
          <div className="category-items">
            {Object.entries(editMode ? editedPlan.categories.needs : needsData).map(([key, value]) => (
              <div key={key} className="category-item">
                <span className="item-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                {editMode ? (
                  <input
                    type="number"
                    className="item-value-edit"
                    value={value}
                    onChange={(e) => handleAmountEdit('needs', key, e.target.value)}
                    min="0"
                  />
                ) : (
                  <span className="item-value">{currency}{value.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="category-section">
          <h4 className="category-title wants-title">
            <span className="icon">🎉</span> Wants ({currency}{Object.values(editMode ? editedPlan.categories.wants : wantsData).reduce((a, b) => a + b, 0).toLocaleString()})
          </h4>
          <div className="category-items">
            {Object.entries(editMode ? editedPlan.categories.wants : wantsData).map(([key, value]) => (
              <div key={key} className="category-item">
                <span className="item-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                {editMode ? (
                  <input
                    type="number"
                    className="item-value-edit"
                    value={value}
                    onChange={(e) => handleAmountEdit('wants', key, e.target.value)}
                    min="0"
                  />
                ) : (
                  <span className="item-value">{currency}{value.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="category-section">
          <h4 className="category-title savings-title">
            <span className="icon">💰</span> Savings ({currency}{Object.values(editMode ? editedPlan.categories.savings : savingsData).reduce((a, b) => a + b, 0).toLocaleString()})
          </h4>
          <div className="category-items">
            {Object.entries(editMode ? editedPlan.categories.savings : savingsData).map(([key, value]) => (
              <div key={key} className="category-item">
                <span className="item-label">{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:</span>
                {editMode ? (
                  <input
                    type="number"
                    className="item-value-edit"
                    value={value}
                    onChange={(e) => handleAmountEdit('savings', key, e.target.value)}
                    min="0"
                  />
                ) : (
                  <span className="item-value">{currency}{value.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {plan.alerts && plan.alerts.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Alerts & Recommendations</h3>
          <div className="alerts-list">
            {plan.alerts.map((alert, index) => (
              <div
                key={index}
                className="alert-card"
                style={{ borderLeftColor: getSeverityColor(alert.severity) }}
              >
                <div className="alert-header">
                  <span className="alert-icon">{getSeverityIcon(alert.severity)}</span>
                  <span
                    className="alert-severity"
                    style={{ color: getSeverityColor(alert.severity) }}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <h4 className="alert-message">{alert.message}</h4>
                <p className="alert-suggestion">{alert.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      {plan.explanation && (
        <div className="explanation-section">
          <h3>💡 Budget Explanation</h3>
          <p className="explanation-text">{plan.explanation}</p>
        </div>
      )}

      {/* Metadata with Tooltip */}
      {plan.metadata && (
        <div className="metadata-section">
          {plan.metadata.city && (
            <div className="metadata-item" title={`Adjusted for ${plan.metadata.city_tier?.replace('_', ' ').toUpperCase()} city with ${plan.metadata.col_multiplier}x cost-of-living multiplier`}>
              <strong>📍 Location:</strong> {plan.metadata.city}, {plan.metadata.city_tier?.replace('_', ' ').toUpperCase()}
              <span className="tooltip-icon" title="Budget adjusted for local cost of living">ℹ️</span>
            </div>
          )}
          {plan.metadata.col_multiplier && (
            <div className="metadata-item">
              <strong>💰 COL Multiplier:</strong> {plan.metadata.col_multiplier}x
            </div>
          )}
          {plan.metadata.notes && (
            <div className="metadata-item">
              <strong>📝 Notes:</strong> {plan.metadata.notes}
            </div>
          )}
        </div>
      )}

      {/* Budget History Panel */}
      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>📚 Budget History</h3>
            <button className="btn-close" onClick={handleToggleHistory}>×</button>
          </div>
          <div className="history-list">
            {getBudgetHistory().map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-meta">
                  <span className="history-date">{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span className="history-mode">{item.mode}</span>
                  {item.edited && <span className="history-badge">Edited</span>}
                </div>
                <div className="history-summary">
                  Income: {currency}{item.plan?.income?.toLocaleString() || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="results-actions">
        <button
          className="btn-action btn-export"
          onClick={() => window.print()}
          title="Export budget as PDF"
        >
          📄 Export PDF
        </button>
        <button
          className="btn-action btn-save"
          onClick={handleSaveBudget}
          title="Save budget to browser storage"
        >
          💾 Save Budget
        </button>
        <button
          className="btn-action btn-history"
          onClick={handleToggleHistory}
          title="View saved budget history"
        >
          📚 History
        </button>
        <button
          className="btn-action btn-share"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Budget Plan',
                text: `Check out my budget plan: ${currency}${plan.income.toLocaleString()} income with ${plan.budget_split.savings_percent.toFixed(0)}% savings!`
              });
            } else {
              alert('Sharing not supported on this browser');
            }
          }}
          title="Share budget plan"
        >
          🔗 Share
        </button>
      </div>
    </div>
  );
};

export default BudgetResults;
