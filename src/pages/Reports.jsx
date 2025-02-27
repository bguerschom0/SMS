import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0], // 6 months ago
    endDate: new Date().toISOString().split('T')[0], // Today
  });
  
  // State for active report
  const [activeReport, setActiveReport] = useState('income-expense');
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Fetch fee collection data
  const { data: feeCollectionData, isLoading: isLoadingFeeCollection } = useQuery({
    queryKey: ['fee-collection', dateRange.startDate, dateRange.endDate],
    queryFn: () => reportsApi.getFeeCollectionSummary(dateRange.startDate, dateRange.endDate)
  });
  
  // Fetch outstanding fees
  const { data: outstandingFeesData, isLoading: isLoadingOutstandingFees } = useQuery({
    queryKey: ['outstanding-fees'],
    queryFn: () => reportsApi.getOutstandingFees()
  });
  
  // Fetch expenses summary
  const { data: expensesData, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses-summary', dateRange.startDate, dateRange.endDate],
    queryFn: () => reportsApi.getExpensesSummary(dateRange.startDate, dateRange.endDate)
  });
  
  // Process data for Income vs Expense chart
  const getIncomeExpenseData = () => {
    // If data is not loaded yet, return empty datasets
    if (!feeCollectionData || !expensesData) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Income',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Expenses',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }
        ]
      };
    }
    
    // Group data by month
    const months = {};
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    
    // Initialize months
    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = { income: 0, expense: 0 };
    }
    
    // Aggregate income data
    feeCollectionData.forEach(payment => {
      const date = new Date(payment.payment_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (months[monthKey]) {
        months[monthKey].income += payment.amount || 0;
      }
    });
    
    // Aggregate expense data
    expensesData.forEach(expense => {
      const date = new Date(expense.expense_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (months[monthKey]) {
        months[monthKey].expense += expense.amount || 0;
      }
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(months).sort();
    
    // Format month labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    
    // Prepare datasets
    const incomeData = sortedMonths.map(monthKey => months[monthKey].income);
    const expenseData = sortedMonths.map(monthKey => months[monthKey].expense);
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        }
      ]
    };
  };
  
  // Process data for Expense Breakdown chart
  const getExpenseBreakdownData = () => {
    // If data is not loaded yet, return empty datasets
    if (!expensesData) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          }
        ]
      };
    }
    
    // Group expenses by type
    const expensesByType = {};
    
    expensesData.forEach(expense => {
      const typeName = expense.expense_types?.name || 'Other';
      if (!expensesByType[typeName]) {
        expensesByType[typeName] = 0;
      }
      expensesByType[typeName] += expense.amount || 0;
    });
    
    const labels = Object.keys(expensesByType);
    const data = Object.values(expensesByType);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        }
      ]
    };
  };
  
  // Process data for Outstanding Fees chart
  const getOutstandingFeesData = () => {
    // If data is not loaded yet, return empty datasets
    if (!outstandingFeesData) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Outstanding Fees',
            data: [],
            backgroundColor: 'rgba(255, 159, 64, 0.7)',
          }
        ]
      };
    }
    
    // Group fees by due date month
    const feesByMonth = {};
    
    outstandingFeesData.forEach(fee => {
      const date = new Date(fee.due_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!feesByMonth[monthKey]) {
        feesByMonth[monthKey] = 0;
      }
      feesByMonth[monthKey] += fee.amount || 0;
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(feesByMonth).sort();
    
    // Format month labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    
    // Prepare dataset
    const data = sortedMonths.map(monthKey => feesByMonth[monthKey]);
    
    return {
      labels,
      datasets: [
        {
          label: 'Outstanding Fees',
          data,
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
        }
      ]
    };
  };
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
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
      },
    },
  };
  
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };
  
  const barChartOptions = {
    responsive: true,
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
      },
    },
  };
  
  // Generate reports for export (PDF, CSV)
  const generateReport = (format) => {
    alert(`Generating ${format.toUpperCase()} report...`);
    // In a real application, this would call an API to generate the report
  };
  
  // Get summary statistics
  const getSummaryStats = () => {
    // If data is not loaded yet, return empty stats
    if (!feeCollectionData || !expensesData || !outstandingFeesData) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        totalOutstanding: 0,
        profitMargin: 0
      };
    }
    
    const totalIncome = feeCollectionData.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const totalExpenses = expensesData.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    const totalOutstanding = outstandingFeesData.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      netProfit,
      totalOutstanding,
      profitMargin
    };
  };
  
  const summaryStats = getSummaryStats();
  
  // Check if any data is loading
  const isLoading = isLoadingFeeCollection || isLoadingOutstandingFees || isLoadingExpenses;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Financial Reports</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => generateReport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => generateReport('csv')}
          >
            Export CSV
          </Button>
        </div>
      </div>
      
      {/* Report Date Range */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Report Period</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div className="lg:col-span-2 flex items-end">
              <div className="flex space-x-2">
                <Button
                  variant={activeReport === 'income-expense' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveReport('income-expense')}
                >
                  Income vs Expense
                </Button>
                <Button
                  variant={activeReport === 'expense-breakdown' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveReport('expense-breakdown')}
                >
                  Expense Breakdown
                </Button>
                <Button
                  variant={activeReport === 'outstanding-fees' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveReport('outstanding-fees')}
                >
                  Outstanding Fees
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(summaryStats.totalIncome)}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(summaryStats.totalExpenses)}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
            <p className={`mt-2 text-xl font-semibold ${summaryStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summaryStats.netProfit)}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Outstanding Fees</h3>
            <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(summaryStats.totalOutstanding)}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
            <p className={`mt-2 text-xl font-semibold ${summaryStats.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summaryStats.profitMargin.toFixed(2)}%
            </p>
          </div>
        </Card>
      </div>
      
      {/* Chart */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {activeReport === 'income-expense' && 'Income vs Expenses'}
            {activeReport === 'expense-breakdown' && 'Expense Breakdown'}
            {activeReport === 'outstanding-fees' && 'Outstanding Fees'}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="h-96">
              {activeReport === 'income-expense' && (
                <Line options={lineChartOptions} data={getIncomeExpenseData()} />
              )}
              
              {activeReport === 'expense-breakdown' && (
                <div className="flex justify-center">
                  <div className="w-1/2">
                    <Pie options={pieChartOptions} data={getExpenseBreakdownData()} />
                  </div>
                </div>
              )}
              
              {activeReport === 'outstanding-fees' && (
                <Bar options={barChartOptions} data={getOutstandingFeesData()} />
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
