import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '../services/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Fetch expense data
  const { data: expense, isLoading } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => expensesApi.getById(id)
  });
  
  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: () => expensesApi.delete(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      navigate('/expenses');
    }
  });
  
  // Handle expense deletion
  const handleDeleteExpense = () => {
    deleteExpenseMutation.mutate();
  };
  
  // Format expense type name
  const formatExpenseType = (expenseType) => {
    if (!expenseType) return 'Unknown';
    
    return expenseType.name || 'Unknown';
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading expense information...</p>
        </div>
      </div>
    );
  }
  
  if (!expense) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Expense Not Found</h2>
        <p className="text-gray-600 mb-4">The expense you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/expenses')}>
          Back to Expenses
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expense Detail</h1>
          <p className="text-gray-500">
            {expense.expense_types ? formatExpenseType(expense.expense_types) : 'Unknown Type'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/expenses')}
          >
            Back to List
          </Button>
          
          <Button
            variant="primary"
            onClick={() => navigate(`/expenses/${id}/edit`)}
          >
            Edit Expense
          </Button>
          
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Expense Details */}
      <Card title="Expense Information">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Expense Type</h4>
              <p className="mt-1 text-sm text-gray-900">
                {expense.expense_types ? formatExpenseType(expense.expense_types) : 'Unknown Type'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Expense Date</h4>
              <p className="mt-1 text-sm text-gray-900">{formatDate(expense.expense_date)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Amount</h4>
              <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Receipt Number</h4>
              <p className="mt-1 text-sm text-gray-900">{expense.receipt_number || 'N/A'}</p>
            </div>
            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-sm text-gray-900">{expense.description || 'No description provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Processed By</h4>
              <p className="mt-1 text-sm text-gray-900">{expense.processed_by || 'System'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created At</h4>
              <p className="mt-1 text-sm text-gray-900">{formatDate(expense.created_at)}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Accounting Information */}
      <Card title="Accounting Information">
        <div className="p-6">
          <div className="max-w-3xl mx-auto bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fiscal Year</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(expense.expense_date).getFullYear()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fiscal Quarter</h4>
                <p className="mt-1 text-sm text-gray-900">
                  Q{Math.floor((new Date(expense.expense_date).getMonth() + 3) / 3)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fiscal Month</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(expense.expense_date).toLocaleString('default', { month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Attachments */}
      {expense.attachments && expense.attachments.length > 0 ? (
        <Card title="Attachments">
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {expense.attachments.map((attachment, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-gray-900">{attachment.name}</span>
                  </div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-900"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ) : (
        <Card title="Attachments">
          <div className="p-6 text-center text-gray-500">
            No attachments for this expense.
          </div>
        </Card>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Expense"
      >
        <div>
          <p className="text-gray-700">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteExpense}
              disabled={deleteExpenseMutation.isPending}
            >
              {deleteExpenseMutation.isPending ? 'Deleting...' : 'Delete Expense'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExpenseDetail;
