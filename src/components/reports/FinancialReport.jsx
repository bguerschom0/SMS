import React, { useState } from 'react';
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
import { Line } from 'react-chartjs-2';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Register Chart.js components
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

const FinancialReport = ({ payments = [], expenses = [], period = 'monthly' }) => {
  const [timeframe, setTimeframe] = useState(period); // 'monthly', 'quarterly', 'yearly'
  
  // Helper to generate time periods
  const generatePeriods = () => {
    const now = new Date();
    const periods = [];
    
    if (timeframe === 'monthly') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periods.push(new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date));
      }
    } else if (timeframe === 'quarterly') {
      // Last 8 quarters
      for (let i = 7; i >= 0; i--) {
        const quarterNum = Math.floor((now.getMonth() - (i * 3)) / 3);
        const year = now.getFullYear() - Math.floor((i + (now.getMonth() % 3) / 3) / 4);
        const quarter = ((quarterNum % 4) + 4) % 4; // Ensure positive [0-3]
        periods.push(`Q${quarter + 1} ${year}`);
      }
    } else {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        periods.push(`${now.getFullYear() - i}`);
      }
    }
    
    return periods;
  };
  
  // Group financial data by period
  const groupByPeriod = (data, amountKey) => {
    const result = {};
    const periods = generatePeriods();
    
    // Initialize periods with zero
    periods.forEach(period => {
      result[period] = 0;
    });
    
    // Aggregate data by period
    data.forEach(item => {
      const date = new Date(item.payment_date || item.expense_date);
      let periodKey;
      
      if (timeframe === 'monthly') {
        periodKey = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
      } else if (timeframe === 'quarterly') {
        const quarter = Math.floor(date.getMonth() / 3);
        periodKey = `Q${quarter + 1} ${date.getFullYear()}`;
      } else {
        periodKey = date.getFullYear().toString();
      }
      
      if (result[periodKey] !== undefined) {
        result[periodKey] += item[amountKey] || 0;
      }
    });
    
    return periods.map(period => result[period]);
  };
  
  // Generate chart data
  const chartData = {
    labels: generatePeriods(),
    datasets: [
      {
        label: 'Income',
        data: groupByPeriod(payments, 'amount'),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Expenses',
        data: groupByPeriod(expenses, 'amount'),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
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
  
  // Calculate totals
  const totalIncome = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  
  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  return (
    <div className="space-y-6">
      <Card 
        title="Income vs Expenses"
        headerAction={
          <div className="flex space-x-2">
            <Button 
              variant={timeframe === 'monthly' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleTimeframeChange('monthly')}
            >
              Monthly
            </Button>
            <Button 
              variant={timeframe === 'quarterly' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleTimeframeChange('quarterly')}
            >
              Quarterly
            </Button>
            <Button 
              variant={timeframe === 'yearly' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleTimeframeChange('yearly')}
            >
              Yearly
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <div className="h-80">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      </Card>
      
      <Card title="Financial Summary">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Income</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(totalIncome)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Expenses</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Net Profit</h4>
              <p className={`mt-1 text-lg font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Profit Margin</h4>
              <p className={`mt-1 text-lg font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Recent Income">
          <div className="p-4">
            <div className="overflow-hidden border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.slice(0, 5).map((payment, index) => (
                    <tr key={payment.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.payment_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.students ? `${payment.students.first_name} ${payment.students.last_name}` : 'Unknown Student'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                    </tr>
                  ))}
                  
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No income data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        
        <Card title="Recent Expenses">
          <div className="p-4">
            <div className="overflow-hidden border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.slice(0, 5).map((expense, index) => (
                    <tr key={expense.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(expense.expense_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.expense_types?.name || 'Unknown Category'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                  
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No expense data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReport;
