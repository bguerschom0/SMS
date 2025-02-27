import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { paymentsApi, feesApi } from '../../services/supabase';
import { formatCurrency, formatDate, generateReceiptNumber } from '../../utils/formatters';
import { downloadReceipt } from '../../utils/receiptGenerator';

const BulkPaymentProcessor = ({ students, onComplete }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    amount: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);

  // Mock fee types data
  useEffect(() => {
    // In a real app, this would be a query to fetch fee types
    setFeeTypes([
      { id: 1, name: 'Tuition Fee', amount: 500 },
      { id: 2, name: 'Registration Fee', amount: 100 },
      { id: 3, name: 'Library Fee', amount: 50 },
    ]);
  }, []);

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (paymentData) => paymentsApi.create(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  // Update fee status mutation
  const updateFeeMutation = useMutation({
    mutationFn: ({ id, data }) => feesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-fees'] });
    },
  });

  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Select all students
  const selectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.id));
    }
  };

  // Handle fee type change
  const handleFeeTypeChange = (e) => {
    const feeTypeId = e.target.value;
    setSelectedFeeType(feeTypeId);

    // Set amount based on fee type
    if (feeTypeId) {
      const selectedFee = feeTypes.find((ft) => ft.id === parseInt(feeTypeId));
      setPaymentDetails((prev) => ({
        ...prev,
        amount: selectedFee?.amount || '',
      }));
    } else {
      setPaymentDetails((prev) => ({
        ...prev,
        amount: '',
      }));
    }
  };

  // Handle payment details change
  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!paymentDetails.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }

    if (!paymentDetails.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }

    if (!paymentDetails.amount || parseFloat(paymentDetails.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (selectedStudents.length === 0) {
      newErrors.students = 'At least one student must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Process payments
  const processPayments = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const successfulPayments = [];
    const failedPayments = [];

    try {
      for (const studentId of selectedStudents) {
        const student = students.find((s) => s.id === studentId);

        try {
          // Create payment object
          const paymentData = {
            student_id: studentId,
            fee_id: selectedFeeType || null,
            payment_date: paymentDetails.payment_date,
            amount: parseFloat(paymentDetails.amount),
            payment_method: paymentDetails.payment_method,
            receipt_number: generateReceiptNumber(),
            status: 'completed',
            notes: paymentDetails.notes,
            processed_by: '00000000-0000-0000-0000-000000000000', // Replace with actual user ID
          };

          // Create payment
          const payment = await createPaymentMutation.mutateAsync(paymentData);

          // Update fee status if a fee is selected
          if (selectedFeeType) {
            // This would usually fetch actual fees for the student
            // For this example, we'll just update a mock fee status
            await updateFeeMutation.mutateAsync({
              id: selectedFeeType,
              data: { status: 'paid' },
            });
          }

          successfulPayments.push({
            studentId,
            studentName: `${student.first_name} ${student.last_name}`,
            payment,
          });
        } catch (error) {
          console.error(`Failed to process payment for student ${studentId}:`, error);
          failedPayments.push({
            studentId,
            studentName: `${student.first_name} ${student.last_name}`,
            error: error.message || 'Unknown error',
          });
        }
      }

      // Set results
      setResults({
        successful: successfulPayments,
        failed: failedPayments,
      });
    } catch (error) {
      console.error('Error during bulk payment processing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setSelectedStudents([]);
    setSelectedFeeType('');
    setPaymentDetails({
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      amount: '',
      notes: '',
    });
    setErrors({});
    setResults(null);
  };

  // Close the modal and reset
  const handleClose = () => {
    setIsOpen(false);
    resetForm();
    if (results && results.successful.length > 0) {
      onComplete?.();
    }
  };

  // Download receipt for a successful payment
  const handleDownloadReceipt = (payment, student) => {
    const fee = selectedFeeType
      ? { fee_types: { name: feeTypes.find((ft) => ft.id === parseInt(selectedFeeType))?.name } }
      : null;
    
    downloadReceipt(payment, student, fee);
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        }
      >
        Process Bulk Payments
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Bulk Payment Processing"
        size="xl"
      >
        {!results ? (
          <div className="space-y-6">
            {/* Student Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Select Students
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={selectAllStudents}
                >
                  {selectedStudents.length === students.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>

              {errors.students && (
                <p className="mt-1 text-sm text-red-600">{errors.students}</p>
              )}

              <div className="mt-2 border rounded-md overflow-hidden max-h-60 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Select
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Student ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.student_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Details
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fee_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fee Type (Optional)
                  </label>
                  <select
                    id="fee_type"
                    value={selectedFeeType}
                    onChange={handleFeeTypeChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select a fee type</option>
                    {feeTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {formatCurrency(type.amount)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="payment_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="payment_date"
                    name="payment_date"
                    value={paymentDetails.payment_date}
                    onChange={handlePaymentDetailsChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.payment_date
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.payment_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment_date}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      value={paymentDetails.amount}
                      onChange={handlePaymentDetailsChange}
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
                  <label
                    htmlFor="payment_method"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    value={paymentDetails.payment_method}
                    onChange={handlePaymentDetailsChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.payment_method
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="check">Check/Cheque</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                  {errors.payment_method && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment_method}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={paymentDetails.notes}
                    onChange={handlePaymentDetailsChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Selected Students:</span>{' '}
                  {selectedStudents.length}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Fee Type:</span>{' '}
                  {selectedFeeType
                    ? feeTypes.find(
                        (ft) => ft.id === parseInt(selectedFeeType)
                      )?.name
                    : 'Not specified'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Amount per Student:</span>{' '}
                  {paymentDetails.amount
                    ? formatCurrency(paymentDetails.amount)
                    : 'Not specified'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Total Amount:</span>{' '}
                  {paymentDetails.amount && selectedStudents.length > 0
                    ? formatCurrency(
                        parseFloat(paymentDetails.amount) *
                          selectedStudents.length
                      )
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900">
                Processing Results
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Successfully processed {results.successful.length} payments.{' '}
                {results.failed.length > 0 && (
                  <span className="text-red-600">
                    {results.failed.length} payments failed.
                  </span>
                )}
              </p>
            </div>

            {results.successful.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Successful Payments
                </h4>
                <div className="border rounded-md overflow-hidden max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Student
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Receipt #
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.successful.map((item) => (
                        <tr key={item.payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.studentName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.payment.receipt_number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(item.payment.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() =>
                                handleDownloadReceipt(
                                  item.payment,
                                  students.find((s) => s.id === item.studentId)
                                )
                              }
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Download Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {results.failed.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Failed Payments
                </h4>
                <div className="border border-red-200 rounded-md overflow-hidden max-h-60 overflow-y-auto bg-red-50">
                  <table className="min-w-full divide-y divide-red-200">
                    <thead className="bg-red-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider"
                        >
                          Student
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider"
                        >
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-200">
                      {results.failed.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-red-900">
                              {item.studentName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-red-700">
                              {item.error}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          {!results ? (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={processPayments}
                disabled={isLoading}
              >
                {isLoading ? (
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
                    Processing...
                  </>
                ) : (
                  'Process Payments'
                )}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default BulkPaymentProcessor;
