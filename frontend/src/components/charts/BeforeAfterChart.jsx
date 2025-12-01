import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BeforeAfterChart({ summary, currency = '₹' }) {
  if (!summary) {
    return (
      <div className="chart-container">
        <p className="no-data-message">No summary data available</p>
      </div>
    );
  }

  const currentExpenses = summary.total_expenses;
  const currentSavings = summary.net_savings > 0 ? summary.net_savings : 0;
  
  // Optimized scenario: Reduce expenses by 15%, increase savings
  const optimizedExpenses = currentExpenses * 0.85;
  const optimizedSavings = summary.total_income - optimizedExpenses;

  const data = {
    labels: ['Current', 'Optimized (Goal)'],
    datasets: [
      {
        label: 'Expenses',
        data: [currentExpenses, optimizedExpenses],
        backgroundColor: 'rgba(231, 76, 60, 0.7)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 2
      },
      {
        label: 'Savings',
        data: [currentSavings, optimizedSavings],
        backgroundColor: 'rgba(39, 174, 96, 0.7)',
        borderColor: 'rgba(39, 174, 96, 1)',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${currency}${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: false,
        ticks: {
          callback: function(value) {
            return currency + value.toLocaleString();
          }
        }
      },
      x: {
        stacked: false
      }
    }
  };

  const potentialSavingsIncrease = optimizedSavings - currentSavings;

  return (
    <div className="chart-container">
      <h3 className="chart-title">🎯 Before vs After Optimization</h3>
      <div className="optimization-summary">
        <p><strong>Potential Monthly Savings Increase:</strong> {currency}{potentialSavingsIncrease.toLocaleString()}</p>
        <p className="tip">💡 By reducing expenses by 15%, you could save {currency}{(potentialSavingsIncrease * 12).toLocaleString()} more per year!</p>
      </div>
      <div className="chart-wrapper" style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default BeforeAfterChart;
