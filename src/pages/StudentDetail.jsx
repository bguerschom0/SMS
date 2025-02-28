import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi, feesApi, paymentsApi } from '../services/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch student data
  const { data: student, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsApi.getById(id)
  });
  
  // Fetch student fees
  const { data: fees, isLoading: isLoadingFees } = useQuery({
    queryKey: ['student-fees', id],
    queryFn: () => feesApi.getByStudentId(id)
  });
  
  // Fetch student payments
  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['student-payments', id],
    queryFn: () => paymentsApi.getByStudentId(id)
  });
  
  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: () => studentsApi.delete(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['students'] });
      navigate('/students');
    }
  });
  
  // Toggle student active status mutation
  const updateStudentStatusMutation = useMutation({
    mutationFn: (data) => studentsApi.update(id, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsDeactivateModalOpen(false);
    }
  });
  
  // Handle student deletion
  const handleDeleteStudent = () => {
    deleteStudentMutation.mutate();
  };
  
  // Handle student status toggle
  const handleToggleStatus = () => {
    updateStudentStatusMutation.mutate({ 
      is_active: !student.is_active 
    });
  };
  
  // Calculate financial summary
  const calculateFinancialSummary = () => {
    if (!fees || !payments) {
      return {
        totalFees: 0,
        totalPaid: 0,
        outstanding: 0,
        paymentRate: 0
      };
    }
    
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const outstanding = totalFees - totalPaid;
    const paymentRate = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;
    
    return {
      totalFees,
      totalPaid,
      outstanding,
      paymentRate
    };
  };
  
  const financialSummary = calculateFinancialSummary();
  
  // Fee table columns
  const feeColumns = [
    {
      key: 'due_date',
      title: 'Due Date',
      render: (date) => formatDate(date)
    },
    {
      key: 'fee_types',
      title: 'Fee Type',
      render: (feeType) => feeType?.name || 'Fee'
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (amount) => formatCurrency(amount)
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => <StatusBadge status={status} />
    }
  ];
  
  // Payment table columns
  const paymentColumns = [
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
      key: 'amount',
      title: 'Amount',
      render: (amount) => formatCurrency(amount)
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
  
  // Determine if any data is loading
  const isLoading = isLoadingStudent || isLoadingFees || isLoadingPayments;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading student information...</p>
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Student Not Found</h2>
        <p className="text-gray-600 mb-4">The student you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/students')}>
          Back to Students
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{student.first_name} {student.last_name}</h1>
          <p className="text-gray-500">Student ID: {student.student_id}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/students')}
          >
            Back to List
          </Button>
          
          <Button
            variant="primary"
            onClick={() => navigate(`/students/${id}/edit`)}
          >
            Edit Student
          </Button>
          
          <Button
            variant={student.is_active ? "warning" : "success"}
            onClick={() => setIsDeactivateModalOpen(true)}
          >
            {student.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Status badge */}
      <div>
        <StatusBadge 
          status={student.is_active ? 'active' : 'inactive'} 
          size="lg"
        />
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fees'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fees
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payments
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Student Information */}
            <Card title="Personal Information">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">First Name</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.first_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.last_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Student ID</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.student_id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Admission Date</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(student.admission_date)}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Guardian Information */}
            <Card title="Guardian Information">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Guardian Name</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.guardian_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.contact_number}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Financial Summary */}
            <Card title="Financial Summary" className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Fees</h4>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(financialSummary.totalFees)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Paid</h4>
                  <p className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(financialSummary.totalPaid)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Outstanding Balance</h4>
                  <p className="mt-1 text-lg font-semibold text-red-600">{formatCurrency(financialSummary.outstanding)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Payment Rate</h4>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{financialSummary.paymentRate.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Link to={`/payments/new?student=${id}`}>
                  <Button variant="primary">
                    Record Payment
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'fees' && (
          <Card
            title="Fee History"
            headerAction={
              <Link to="/fees/new">
                <Button variant="primary" size="sm">
                  Add Fee
                </Button>
              </Link>
            }
            noPadding
          >
            <Table
              columns={feeColumns}
              data={fees || []}
              isLoading={isLoadingFees}
              pagination={fees?.length > 10}
              itemsPerPage={10}
              emptyMessage="No fees found for this student."
            />
          </Card>
        )}
        
        {activeTab === 'payments' && (
          <Card
            title="Payment History"
            headerAction={
              <Link to={`/payments/new?student=${id}`}>
                <Button variant="primary" size="sm">
                  New Payment
                </Button>
              </Link>
            }
            noPadding
          >
            <Table
              columns={paymentColumns}
              data={payments || []}
              isLoading={isLoadingPayments}
              pagination={payments?.length > 10}
              itemsPerPage={10}
              emptyMessage="No payment history found for this student."
              onRowClick={(payment) => navigate(`/payments/${payment.id}`)}
            />
          </Card>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
      >
        <div>
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{student.first_name} {student.last_name}</span>? This action cannot be undone.
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
              onClick={handleDeleteStudent}
              disabled={deleteStudentMutation.isPending}
            >
              {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete Student'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Deactivate Confirmation Modal */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title={student.is_active ? "Deactivate Student" : "Activate Student"}
      >
        <div>
          <p className="text-gray-700">
            Are you sure you want to {student.is_active ? 'deactivate' : 'activate'} <span className="font-semibold">{student.first_name} {student.last_name}</span>?
          </p>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeactivateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={student.is_active ? "warning" : "success"}
              onClick={handleToggleStatus}
              disabled={updateStudentStatusMutation.isPending}
            >
              {updateStudentStatusMutation.isPending 
                ? 'Processing...'
                : (student.is_active ? 'Deactivate' : 'Activate')
              }
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDetail;
