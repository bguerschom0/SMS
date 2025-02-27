import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, studentsApi, feesApi } from '../services/supabase';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { formatCurrency, generateReceiptNumber } from '../utils/formatters';

const PaymentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    fee_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    amount: '',
    payment_method: 'cash',
    receipt_number: generateReceiptNumber(),
    notes: '',
    status: 'completed'
  });
  
  const [errors, setErrors] = useState({});
  const [selectedFee, setSelectedFee] = useState(null);
  
  // Fetch all students
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll()
  });
  
  // Fetch fees for selected student
  const { data: studentFees, isLoading: isLoadingFees } = useQuery({
    queryKey: ['student-fees', formData.student_id],
    queryFn: () => feesApi.getByStudentId(formData.student_id),
    enabled: Boolean(formData.student_id)
  });
  
  // Fetch payment data if in edit mode
  const { data: payment, isLoading: isLoadingPayment } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      if (data) {
        // Format date to YYYY-MM-DD for input
        const formattedData = {
          ...data,
          payment_date: data.payment_date ? new Date(data.payment_date).toISOString().split('T')[0] : '',
        };
        setFormData(formattedData);
      }
    }
  });
  
  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (data) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      navigate('/payments');
    }
  });
  
  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, data }) => paymentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', id] });
      navigate(`/payments/${id}`);
    }
  });
  
  // Update fee status mutation
  const updateFeeMutation = useMutation({
    mutationFn: ({ id, data }) => feesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-fees'] });
    }
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // If student changes, reset fee selection
    if (name === 'student_id') {
      setFormData(prev => ({
        ...prev,
        fee_id: '',
        amount: ''
      }));
      setSelectedFee(null);
    }
    
    // If fee changes, update amount
    if (name === 'fee_id' && value) {
      const fee = studentFees?.find(fee => fee.id === value);
      if (fee) {
        setSelectedFee(fee);
        setFormData(prev => ({
          ...prev,
          amount: fee.amount
        }));
      }
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.student_id) {
      newErrors.student_id = 'Student is required';
    }
    
    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }
    
    if (!formData.receipt_number) {
      newErrors.receipt_number = 'Receipt number is required';
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
    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    try {
      if (isEditMode) {
        await updatePaymentMutation.mutateAsync({ id, data: paymentData });
      } else {
        await createPaymentMutation.mutateAsync(paymentData);
        
        // Update fee status if a fee was selected
        if (formData.fee_id && selectedFee) {
          // Determine fee status based on payment amount
          let status = 'unpaid';
          if (parseFloat(formData.amount) >= selectedFee.amount) {
            status = 'paid';
          } else if (parseFloat(formData.amount) > 0) {
            status = 'partial';
          }
          
          await updateFeeMutation.mutateAsync({
            id: formData.fee_id,
            data: { status }
          });
        }
      }
    } catch (error) {
      console.error("Payment submission error:", error);
    }
  };
  
  // Payment methods
  const paymentMethods = [
    { id: 'cash', label: 'Cash' },
    { id: 'bank_transfer', label: 'Bank Transfer' },
    { id: 'mobile_money', label: 'Mobile Money' },
    { id: 'check', label: 'Check/Cheque' },
    { id: 'card', label: 'Credit/Debit Card' }
  ];
  
  // Payment statuses
  const paymentStatuses = [
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Failed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];
  
  // Determine if any data is loading
  const isLoading = isLoadingStudents || isLoadingFees || (isEditMode && isLoadingPayment);
  
  // Determine if mutation is loading
  const isMutationLoading = createPaymentMutation.isPending || updatePaymentMutation.isPending;
  
  // Display error message from mutation
  const mutationError = createPaymentMutation.error || updatePaymentMutation.error;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Payment' : 'Record New Payment'}
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
            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                    Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    disabled={isEditMode}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.student_id
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  >
                    <option value="">Select a student</option>
                    {students?.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} ({student.student_id})
                      </option>
                    ))}
                  </select>
                  {errors.student_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="fee_id" className="block text-sm font-medium text-gray-700">
                    Fee (Optional)
                  </label>
                  <select
                    id="fee_id"
                    name="fee_id"
                    value={formData.fee_id}
                    onChange={handleChange}
                    disabled={!formData.student_id || isEditMode}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select a fee</option>
                    {studentFees?.map(fee => (
                      <option key={fee.id} value={fee.id}>
                        {fee.fee_types?.name || 'Fee'} - {formatCurrency(fee.amount)} 
                        {fee.status !== 'unpaid' && ` (${fee.status})`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="payment_date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.payment_date
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.payment_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_date}</p>
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
                  <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.payment_method
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  >
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {errors.payment_method && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="receipt_number" className="block text-sm font-medium text-gray-700">
                    Receipt Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="receipt_number"
                    name="receipt_number"
                    value={formData.receipt_number}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.receipt_number
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.receipt_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.receipt_number}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {paymentStatuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  ></textarea>
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
                  isEditMode ? 'Update Payment' : 'Record Payment'
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default PaymentForm;
