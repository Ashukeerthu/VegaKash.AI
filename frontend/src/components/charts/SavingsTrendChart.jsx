import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function SavingsTrendChart({ monthlySavings, currency = '₹' }) {
  // Generate 12-month projection
  const generateSavingsProjection = () => {
    const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6',
                    'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
    
    let cumulativeSavings = 0;
    const projectedSavings = months.map((_, index) => {
      cumulativeSavings += monthlySavings;
      return cumulativeSavings;
    });

    return { months, projectedSavings };
  };

  if (!monthlySavings || monthlySavings <= 0) {
    return (
      <div className="chart-container">
        <p className="no-data-message">No positive savings to project</p>
      </div>
    );
  }

  const { months, projectedSavings } = generateSavingsProjection();

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Cumulative Savings',
        data: projectedSavings,
        fill: true,
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        borderColor: 'rgba(39, 174, 96, 1)',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(39, 174, 96, 1)'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Savings: ${currency}${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return currency + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">📈 Savings Growth Projection (12 Months)</h3>
      <div className="savings-summary">
        <p><strong>Monthly Savings:</strong> {currency}{monthlySavings.toLocaleString()}</p>
        <p><strong>Projected 1-Year Total:</strong> {currency}{(monthlySavings * 12).toLocaleString()}</p>
      </div>
      <div className="chart-wrapper" style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default SavingsTrendChart;
