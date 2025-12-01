import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseBreakdownChart({ expenses, currency = '₹' }) {
  // Filter out zero expenses
  const expenseCategories = {
    'Housing/Rent': expenses?.housing_rent || 0,
    'Groceries & Food': expenses?.groceries_food || 0,
    'Transport': expenses?.transport || 0,
    'Utilities': expenses?.utilities || 0,
    'Insurance': expenses?.insurance || 0,
    'EMI/Loans': expenses?.emi_loans || 0,
    'Entertainment': expenses?.entertainment || 0,
    'Subscriptions': expenses?.subscriptions || 0,
    'Others': expenses?.others || 0
  };

  const filteredCategories = Object.entries(expenseCategories)
    .filter(([_, value]) => value > 0);

  if (filteredCategories.length === 0) {
    return (
      <div className="chart-container">
        <p className="no-data-message">No expense data to display</p>
      </div>
    );
  }

  const data = {
    labels: filteredCategories.map(([label]) => label),
    datasets: [
      {
        label: 'Expenses',
        data: filteredCategories.map(([_, value]) => value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
          'rgba(255, 99, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 255, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${currency}${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">💰 Monthly Expense Breakdown</h3>
      <div className="chart-wrapper" style={{ height: '350px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default ExpenseBreakdownChart;
