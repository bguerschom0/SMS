import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '../services/supabase';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { formatCurrency } from '../utils/formatters';

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    expense_type_id: '',
    expense_date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    receipt_number: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Fetch expense types
  const { data: expenseTypes, isLoading: isLoadingExpenseTypes } = useQuery({
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
  
  // Fetch expense data if in edit mode
  const { data: expense, isLoading: isLoadingExpense } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => expensesApi.getById(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      if (data) {
        // Format date to YYYY-MM-DD for input
        const formattedData = {
          ...data,
          expense_date: data.expense_date ? new Date(data.expense_date).toISOString().split('T')[0] : '',
        };
        setFormData(formattedData);
      }
    }
  });
  
  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: (data) => expensesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      navigate('/expenses');
    }
  });
  
  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }) => expensesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', id] });
      navigate(`/expenses/${id}`);
    }
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.expense_type_id) {
      newErrors.expense_type_id = 'Expense type is required';
    }
    
    if (!formData.expense_date) {
      newErrors.expense_date = 'Expense date is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for submission
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      processed_by: '00000000-0000-0000-0000-000000000000' // Replace with actual user ID from auth context
    };
    
    try {
      if (isEditMode) {
        await updateExpenseMutation.mutateAsync({ id, data: expenseData });
      } else {
        await createExpenseMutation.mutateAsync(expenseData);
      }
    } catch (error) {
      console.error("Expense submission error:", error);
    }
  };
  
  // Determine if any data is loading
  const isLoading = isLoadingExpenseTypes || (isEditMode && isLoadingExpense);
  
  // Determine if mutation is loading
  const isMutationLoading = createExpenseMutation.isPending || updateExpenseMutation.isPending;
  
  // Display error message from mutation
  const mutationError = createExpenseMutation.error || updateExpenseMutation.error;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Expense' : 'Record New Expense'}
        </h1>
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>
      
      {mutationError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {mutationError.message || 'An error occurred. Please try again.'}
        </div>
      )}
      
      <Card>
        {isLoading ? (
          <div className="flex justify-center p-6">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expense Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Details</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="expense_type_id" className="block text-sm font-medium text-gray-700">
                    Expense Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="expense_type_id"
                    name="expense_type_id"
                    value={formData.expense_type_id}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.expense_type_id
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  >
                    <option value="">Select expense type</option>
                    {expenseTypes?.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.expense_type_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.expense_type_id}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700">
                    Expense Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="expense_date"
                    name="expense_date"
                    value={formData.expense_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.expense_date
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.expense_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.expense_date}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.amount
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="receipt_number" className="block text-sm font-medium text-gray-700">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    id="receipt_number"
                    name="receipt_number"
                    value={formData.receipt_number || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description || ''}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.description
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isMutationLoading}
              >
                {isMutationLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    {isEditMode ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  isEditMode ? 'Update Expense' : 'Record Expense'
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ExpenseForm;
