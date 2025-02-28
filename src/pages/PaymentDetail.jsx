import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, studentsApi } from '../services/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { downloadReceipt, emailReceipt } from '../utils/receiptGenerator';

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  
  // Fetch payment data
  const { data: payment, isLoading: isLoadingPayment } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id)
  });
  
  // Fetch student data if payment data is available
  const { data: student, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', payment?.student_id],
    queryFn: () => studentsApi.getById(payment.student_id),
    enabled: !!payment?.student_id
  });
  
  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: () => paymentsApi.delete(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      navigate('/payments');
    }
  });
  
  // Handle payment deletion
  const handleDeletePayment = () => {
    deletePaymentMutation.mutate();
  };
  
  // Handle download receipt
  const handleDownloadReceipt = () => {
    if (payment && student) {
      downloadReceipt(payment, student);
    }
  };
  
  // Handle open email modal
  const handleOpenEmailModal = () => {
    if (student && student.email) {
      setEmailAddress(student.email);
    }
    setIsEmailModalOpen(true);
  };
  
  // Handle email change
  const handleEmailChange = (e) => {
    setEmailAddress(e.target.value);
    setEmailError('');
  };
  
  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Handle send email
  const handleSendEmail = async () => {
    if (!validateEmail(emailAddress)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setIsEmailSending(true);
    try {
      await emailReceipt(payment, student, null, null, emailAddress);
      setIsEmailModalOpen(false);
      alert('Receipt sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailError('Failed to send email. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };
  
  // Format payment method for display
  const formatPaymentMethod = (method) => {
    if (!method) return '';
    return method
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Determine if any data is loading
  const isLoading = isLoadingPayment || isLoadingStudent;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading payment information...</p>
        </div>
      </div>
    );
  }
  
  if (!payment) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Not Found</h2>
        <p className="text-gray-600 mb-4">The payment you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/payments')}>
          Back to Payments
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payment Detail</h1>
          <p className="text-gray-500">Receipt: {payment.receipt_number}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/payments')}
          >
            Back to List
          </Button>
          
          <Button
            variant="primary"
            onClick={() => navigate(`/payments/${id}/edit`)}
          >
            Edit Payment
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
          status={payment.status} 
          size="lg"
        />
      </div>
      
      {/* Payment Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Payment Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Receipt Number</h4>
                <p className="mt-1 text-sm text-gray-900">{payment.receipt_number}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Payment Date</h4>
                <p className="mt-1 text-sm text-gray-900">{formatDate(payment.payment_date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                <p className="mt-1 text-sm text-gray-900">{formatPaymentMethod(payment.payment_method)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <p className="mt-1">
                  <StatusBadge status={payment.status} />
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Processed By</h4>
                <p className="mt-1 text-sm text-gray-900">{payment.processed_by || 'System'}</p>
              </div>
            </div>
            
            {payment.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="mt-1 text-sm text-gray-900">{payment.notes}</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card title="Student Information">
          {student ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Student Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{student.first_name} {student.last_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Student ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{student.student_id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Guardian</h4>
                  <p className="mt-1 text-sm text-gray-900">{student.guardian_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                  <p className="mt-1 text-sm text-gray-900">{student.contact_number}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link to={`/students/${student.id}`}>
                  <Button variant="secondary" size="sm">
                    View Student Profile
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Student information not available</p>
          )}
        </Card>
      </div>
      
      {/* Receipt Actions */}
      <Card title="Receipt Actions">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={handleDownloadReceipt}
            disabled={!student}
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Receipt
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleOpenEmailModal}
            disabled={!student}
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Receipt
          </Button>
        </div>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Payment"
      >
        <div>
          <p className="text-gray-700">
            Are you sure you want to delete this payment? This action cannot be undone.
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
              onClick={handleDeletePayment}
              disabled={deletePaymentMutation.isPending}
            >
              {deletePaymentMutation.isPending ? 'Deleting...' : 'Delete Payment'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Email Receipt Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Email Receipt"
      >
        <div>
          <p className="text-gray-700 mb-4">
            Enter the email address where you'd like to send the receipt:
          </p>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={emailAddress}
              onChange={handleEmailChange}
              className={`block w-full border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                emailError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsEmailModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              disabled={isEmailSending}
            >
              {isEmailSending ? 'Sending...' : 'Send Receipt'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentDetail;
