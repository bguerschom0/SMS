import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ExpenseSummary = ({ expenses, expenseTypes, period = 'monthly' }) => {
  // If no expenses or expense types, show empty state
  if (!expenses?.length || !expenseTypes?.length) {
    return (
      <Card title="Expense Summary">
        <div className="p-6 text-center">
          <p className="text-gray-500">No expense data available</p>
        </div>
      </Card>
    );
  }
  
  // Group expenses by type
  const expensesByType = {};
  expenseTypes.forEach(type => {
    expensesByType[type.id] = 0;
  });
  
  expenses.forEach(expense => {
    if (expensesByType[expense.expense_type_id] !== undefined) {
      expensesByType[expense.expense_type_id] += expense.amount;
    }
  });
  
  // Prepare data for pie chart
  const pieChartData = {
    labels: expenseTypes.map(type => type.name),
    datasets: [
      {
        data: expenseTypes.map(type => expensesByType[type.id]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Group expenses by period (monthly, quarterly, yearly)
  const groupExpensesByPeriod = () => {
    const expensesByPeriod = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.expense_date);
      let periodKey;
      
      if (period === 'monthly') {
        // Format: "Jan 2025"
        periodKey = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
      } else if (period === 'quarterly') {
        // Calculate quarter (0-3)
        const quarter = Math.floor(date.getMonth() / 3);
        // Format: "Q1 2025"
        periodKey = `Q${quarter + 1} ${date.getFullYear()}`;
      } else {
        // Yearly - Format: "2025"
        periodKey = date.getFullYear().toString();
      }
      
      if (!expensesByPeriod[periodKey]) {
        expensesByPeriod[periodKey] = 0;
      }
      
      expensesByPeriod[periodKey] += expense.amount;
    });
    
    return expensesByPeriod;
  };
  
  const expensesByPeriod = groupExpensesByPeriod();
  
  // Sort periods chronologically
  const sortedPeriods = Object.keys(expensesByPeriod).sort((a, b) => {
    if (period === 'monthly') {
      // Convert "Jan 2025" to Date for sorting
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    } else if (period === 'quarterly') {
      // Extract year and quarter for sorting
      const [quarterA, yearA] = a.split(' ');
      const [quarterB, yearB] = b.split(' ');
      
      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }
      
      return parseInt(quarterA.substring(1)) - parseInt(quarterB.substring(1));
    } else {
      // Yearly - simple numeric sort
      return parseInt(a) - parseInt(b);
    }
  });
  
  // Prepare data for bar chart
  const barChartData = {
    labels: sortedPeriods,
    datasets: [
      {
        label: 'Expenses',
        data: sortedPeriods.map(period => expensesByPeriod[period]),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <div className="space-y-6">
      <Card title="Expense by Type">
        <div className="p-4">
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </Card>
      
      <Card title={`Expense by ${period.charAt(0).toUpperCase() + period.slice(1)} Period`}>
        <div className="p-4">
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </Card>
      
      <Card title="Expense Summary">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Expenses</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Expense Categories</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{expenseTypes.length}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Number of Expenses</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{expenses.length}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Average Expense</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatCurrency(expenses.length > 0 ? totalExpenses / expenses.length : 0)}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Top Expense Categories</h4>
            <div className="space-y-2">
              {expenseTypes
                .map(type => ({
                  id: type.id,
                  name: type.name,
                  amount: expensesByType[type.id] || 0
                }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 3)
                .map(type => (
                  <div key={type.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{type.name}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(type.amount)}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExpenseSummary;
