import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { expensesApi } from '../services/supabase';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { formatCurrency, formatDate } from '../utils/formatters';

const Expenses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  
  // Fetch expenses
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => expensesApi.getAll()
  });
  
  // Fetch expense types
  const { data: expenseTypes } = useQuery({
    queryKey: ['expense-types'],
    queryFn: async () => {
      // Mocked expense types fetch - replace with actual API call
      return [
        { id: 1, name: 'Salaries' },
        { id: 2, name: 'Utilities' },
        { id: 3, name: 'Supplies' },
        { id: 4, name: 'Maintenance' },
        { id: 5, name: 'Transport' }
      ];
    }
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle expense type filter change
  const handleExpenseTypeChange = (e) => {
    setSelectedExpenseType(e.target.value);
  };
  
  // Filter expenses based on search, date range, and expense type
  const filteredExpenses = expenses?.filter(expense => {
    // Search filter
    const searchMatch = 
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.expense_types?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    const expenseDate = new Date(expense.expense_date);
    const startDateMatch = dateRange.startDate 
      ? expenseDate >= new Date(dateRange.startDate) 
      : true;
    const endDateMatch = dateRange.endDate 
      ? expenseDate <= new Date(dateRange.endDate) 
      : true;
    
    // Expense type filter
    const expenseTypeMatch = selectedExpenseType 
      ? expense.expense_type_id === parseInt(selectedExpenseType) 
      : true;
    
    return searchMatch && startDateMatch && endDateMatch && expenseTypeMatch;
  }) || [];
  
  // Calculate total filtered expenses
  const totalFilteredExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount, 
    0
  );
  
  // Table columns
  const columns = [
    {
      key: 'expense_date',
      title: 'Date',
      render: (date) => formatDate(date)
    },
    {
      key: 'expense_types',
      title: 'Expense Type',
      render: (expenseType) => expenseType?.name || 'Unknown Type'
    },
    {
      key: 'description',
      title: 'Description',
      render: (description) => (
        <div className="max-w-xs truncate">{description}</div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (amount) => (
        <span className="font-medium">{formatCurrency(amount)}</span>
      )
    },
    {
      key: 'receipt_number',
      title: 'Receipt #',
      render: (receiptNumber) => receiptNumber || 'N/A'
    }
  ];
  
  // Sample expense data (if no data is loaded yet)
  const sampleExpenses = [
    {
      id: '1',
      expense_date: '2025-02-15',
      expense_type_id: 1,
      expense_types: { name: 'Salaries' },
      description: 'Monthly salaries for teaching staff',
      amount: 5000.00,
      receipt_number: 'EXP-001'
    },
    {
      id: '2',
      expense_date: '2025-02-14',
      expense_type_id: 2,
      expense_types: { name: 'Utilities' },
      description: 'Electricity and water bills',
      amount: 850.00,
      receipt_number: 'EXP-002'
    },
    {
      id: '3',
      expense_date: '2025-02-10',
      expense_type_id: 3,
      expense_types: { name: 'Supplies' },
      description: 'Classroom supplies and textbooks',
      amount: 1200.00,
      receipt_number: 'EXP-003'
    }
  ];
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    setSelectedExpenseType('');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/expenses/new')}
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          }
        >
          Add Expense
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            {/* Start Date */}
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
            
            {/* End Date */}
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
            
            {/* Expense Type */}
            <div>
              <label htmlFor="expenseType" className="block text-sm font-medium text-gray-700 mb-1">
                Expense Type
              </label>
              <select
                id="expenseType"
                value={selectedExpenseType}
                onChange={handleExpenseTypeChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">All Types</option>
                {expenseTypes?.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filter actions */}
          <div className="mt-4 flex justify-between items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            
            <div className="text-sm text-gray-700">
              Total: <span className="font-medium">{formatCurrency(totalFilteredExpenses)}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Expenses Table */}
      <Card noPadding>
        <Table
          columns={columns}
          data={filteredExpenses.length > 0 ? filteredExpenses : sampleExpenses}
          isLoading={isLoading}
          onRowClick={(expense) => navigate(`/expenses/${expense.id}`)}
          pagination
          itemsPerPage={10}
          emptyMessage="No expenses found matching your filters."
        />
      </Card>
    </div>
  );
};

export default Expenses;
