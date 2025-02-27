import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '../common/Card';
import Button from '../common/Button';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeeSummaryChart = ({ data = [] }) => {
  const [timeFrame, setTimeFrame] = useState('monthly'); // 'monthly', 'quarterly', 'yearly'
  
  // Button styling
  const getButtonStyle = (selected) => ({
    variant: selected ? 'primary' : 'secondary',
    size: 'sm',
    className: 'text-xs py-1 px-2'
  });
  
  // Process data based on timeframe
  const processData = () => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: 'Collections',
            data: [0],
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
          },
          {
            label: 'Outstanding',
            data: [0],
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
          }
        ]
      };
    }
    
    let labels = [];
    let collections = [];
    let outstanding = [];
    
    if (timeFrame === 'monthly') {
      // Last 6 months
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      collections = [12500, 15000, 13200, 16800, 14500, 18000];
      outstanding = [2000, 1800, 2500, 1500, 3000, 2200];
    } else if (timeFrame === 'quarterly') {
      // Last 4 quarters
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      collections = [38000, 42000, 45000, 40000];
      outstanding = [5000, 4500, 3800, 6000];
    } else {
      // Last 3 years
      labels = ['2023', '2024', '2025'];
      collections = [150000, 180000, 165000];
      outstanding = [15000, 12000, 18000];
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Collections',
          data: collections,
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
        },
        {
          label: 'Outstanding',
          data: outstanding,
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        }
      ]
    };
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (
    <Card
      title="Fee Collection Overview"
      headerAction={
        <div className="flex space-x-2">
          <Button 
            {...getButtonStyle(timeFrame === 'monthly')}
            onClick={() => setTimeFrame('monthly')}
          >
            Monthly
          </Button>
          <Button 
            {...getButtonStyle(timeFrame === 'quarterly')}
            onClick={() => setTimeFrame('quarterly')}
          >
            Quarterly
          </Button>
          <Button 
            {...getButtonStyle(timeFrame === 'yearly')}
            onClick={() => setTimeFrame('yearly')}
          >
            Yearly
          </Button>
        </div>
      }
    >
      <div className="h-64">
        <Bar options={options} data={processData()} />
      </div>
    </Card>
  );
};

export default FeeSummaryChart;
