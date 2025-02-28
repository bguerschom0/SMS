import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import Card from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ExpenseList = ({ expenses, expenseTypes, isLoading }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
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
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    setSelectedExpenseType('');
  };
  
  return (
    <Card>
      <div className="p-4">
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
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Clear Filters
          </button>
          
          <div className="text-sm text-gray-700">
            Total: <span className="font-medium">{formatCurrency(totalFilteredExpenses)}</span>
          </div>
        </div>
      </div>
      
      <Table
        columns={columns}
        data={filteredExpenses}
        isLoading={isLoading}
        onRowClick={(expense) => navigate(`/expenses/${expense.id}`)}
        pagination
        itemsPerPage={10}
        emptyMessage="No expenses found matching your filters."
      />
    </Card>
  );
};

export default ExpenseList;
