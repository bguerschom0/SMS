import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../services/supabase';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import BulkPaymentProcessor from '../components/payments/BulkPaymentProcessor';

const Payments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  
  // Fetch payments data
  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.getAll()
  });
  
  // Fetch students data for bulk operations
  const { data: students } = useQuery({
    queryKey: ['students-active'],
    queryFn: async () => {
      // In a real app, this would filter for active students only
      const allStudents = await studentsApi.getAll();
      return allStudents.filter(student => student.is_active);
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
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle payment method filter change
  const handlePaymentMethodFilterChange = (e) => {
    setPaymentMethodFilter(e.target.value);
  };
  
  // Filter payments based on search, date range, status, and payment method
  const filteredPayments = payments?.filter(payment => {
    // Search filter (check receipt number, student name, or payment method)
    const searchMatch = 
      payment.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.students?.first_name + ' ' + payment.students?.last_name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    const paymentDate = new Date(payment.payment_date);
    const startDateMatch = dateRange.startDate 
      ? paymentDate >= new Date(dateRange.startDate) 
      : true;
    const endDateMatch = dateRange.endDate 
      ? paymentDate <= new Date(dateRange.endDate) 
      : true;
    
    // Status filter
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    
    // Payment method filter
    const methodMatch = paymentMethodFilter === 'all' || payment.payment_method === paymentMethodFilter;
    
    return searchMatch && startDateMatch && endDateMatch && statusMatch && methodMatch;
  }) || [];
  
  // Calculate total filtered payments
  const totalFilteredAmount = filteredPayments.reduce(
    (sum, payment) => sum + payment.amount, 
    0
  );
  
  // Table columns
  const columns = [
    {
      key: 'payment_date',
      title: 'Date',
      render: (date) => formatDate(date)
    },
    {
      key: 'receipt_number',
      title: 'Receipt #',
    },
    {
      key: 'students',
      title: 'Student',
      render: (student) => student 
        ? `${student.first_name} ${student.last_name}`
        : 'Unknown Student'
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (amount) => (
        <span className="font-medium">{formatCurrency(amount)}</span>
      )
    },
    {
      key: 'payment_method',
      title: 'Method',
      render: (method) => method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => <StatusBadge status={status} />
    }
  ];
  
  // Payment method options
  const paymentMethods = [
    { value: 'all', label: 'All Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'check', label: 'Check/Cheque' },
    { value: 'card', label: 'Credit/Debit Card' }
  ];
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    setStatusFilter('all');
    setPaymentMethodFilter('all');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
        
        <div className="flex flex-wrap gap-2">
          {students && (
            <BulkPaymentProcessor 
              students={students}
              onComplete={refetch}
            />
          )}
          
          <Link to="/payments/new">
            <Button
              variant="primary"
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
              New Payment
            </Button>
          </Link>
        </div>
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
                placeholder="Search payments..."
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
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethodFilter}
                onChange={handlePaymentMethodFilterChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
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
              Total: <span className="font-medium">{formatCurrency(totalFilteredAmount)}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Payments Table */}
      <Card noPadding>
        <Table
          columns={columns}
          data={filteredPayments}
          isLoading={isLoading}
          onRowClick={(payment) => navigate(`/payments/${payment.id}`)}
          pagination
          itemsPerPage={10}
          emptyMessage="No payments found matching your filters."
        />
      </Card>
    </div>
  );
};

export default Payments;
