import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Card from '../common/Card';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentMethodsChart = ({ data = [] }) => {
  // Process data for the chart
  const processData = () => {
    if (!data || data.length === 0) {
      // Sample data if none provided
      return {
        labels: ['Cash', 'Bank Transfer', 'Mobile Money', 'Cheque'],
        datasets: [
          {
            data: [45, 25, 20, 10],
            backgroundColor: [
              'rgba(99, 102, 241, 0.7)',
              'rgba(6, 182, 212, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
            ],
            borderColor: [
              'rgba(99, 102, 241, 1)',
              'rgba(6, 182, 212, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    }

    // If you have actual data, process it here
    // This would involve counting payment methods frequency
    // and formatting it for the pie chart
    const counts = data.reduce((acc, payment) => {
      const method = payment.payment_method || 'Unknown';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(6, 182, 212, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card title="Payment Methods">
      <div className="h-64">
        <Pie options={options} data={processData()} />
      </div>
    </Card>
  );
};

export default PaymentMethodsChart;
