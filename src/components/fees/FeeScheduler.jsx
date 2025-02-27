import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { feesApi } from '../../services/supabase';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FeeScheduler = ({ students, feeTypes, onComplete }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [selectedStudentGroup, setSelectedStudentGroup] = useState('all');
  const [selectedClass, setSelectedClass] = useState('');
  const [customStudents, setCustomStudents] = useState([]);
  const [scheduleDetails, setScheduleDetails] = useState({
    due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Default to 30 days from now
    amount: '',
    customize_amount: false,
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Mock classes data
  const classes = [
    { id: 1, name: 'Class 1', level: 'Primary' },
    { id: 2, name: 'Class 2', level: 'Primary' },
    { id: 3, name: 'Nursery A', level: 'Nursery' },
  ];

  // Create fee mutation
  const createFeeMutation = useMutation({
    mutationFn: (feeData) => feesApi.create(feeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });

  // Handle fee type change
  const handleFeeTypeChange = (e) => {
    const feeTypeId = e.target.value;
    setSelectedFeeType(feeTypeId);

    // Set amount based on fee type
    if (feeTypeId) {
      const selectedFee = feeTypes.find((ft) => ft.id === parseInt(feeTypeId));
      setScheduleDetails((prev) => ({
        ...prev,
        amount: selectedFee?.amount || '',
      }));
    } else {
      setScheduleDetails((prev) => ({
        ...prev,
        amount: '',
      }));
    }
  };

  // Handle student group change
  const handleStudentGroupChange = (e) => {
    const group = e.target.value;
    setSelectedStudentGroup(group);

    // Reset custom students and class selection
    if (group !== 'custom') {
      setCustomStudents([]);
    }
    if (group !== 'class') {
      setSelectedClass('');
    }
  };

  // Handle class change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  // Toggle student selection for custom group
  const toggleStudentSelection = (studentId) => {
    setCustomStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Select all students for custom group
  const selectAllStudents = () => {
    if (customStudents.length === students.length) {
      setCustomStudents([]);
    } else {
      setCustomStudents(students.map((student) => student.id));
    }
  };

  // Handle schedule details change
  const handleScheduleDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setScheduleDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // If customizing amount is toggled off, reset to fee type amount
    if (name === 'customize_amount' && !checked && selectedFeeType) {
      const selectedFee = feeTypes.find(
        (ft) => ft.id === parseInt(selectedFeeType)
      );
      setScheduleDetails((prev) => ({
        ...prev,
        amount: selectedFee?.amount || '',
      }));
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!selectedFeeType) {
      newErrors.feeType = 'Fee type is required';
    }

    if (!scheduleDetails.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    if (!scheduleDetails.amount || parseFloat(scheduleDetails.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (selectedStudentGroup === 'custom' && customStudents.length === 0) {
      newErrors.customStudents = 'At least one student must be selected';
    }

    if (selectedStudentGroup === 'class' && !selectedClass) {
      newErrors.class = 'A class must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get students based on the selected group
  const getTargetStudents = () => {
    switch (selectedStudentGroup) {
      case 'all':
        return students;
      case 'class':
        // In a real app, this would filter students by class
        return students.filter((_, index) => index % 2 === 0); // Mock filter for demo
      case 'custom':
        return students.filter((student) => customStudents.includes(student.id));
      default:
        return [];
    }
  };

  // Schedule fees
  const scheduleFees = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const targetStudents = getTargetStudents();
    const successfulFees = [];
    const failedFees = [];

    try {
      for (const student of targetStudents) {
        try {
          // Create fee object
          const feeData = {
            student_id: student.id,
            fee_type_id: parseInt(selectedFeeType),
            due_date: scheduleDetails.due_date,
            amount: parseFloat(scheduleDetails.amount),
            status: 'unpaid',
            notes: scheduleDetails.notes,
          };

          // Create fee
          const fee = await createFeeMutation.mutateAsync(feeData);

          successfulFees.push({
            studentId: student.id,
            studentName: `${student.first_name} ${student.last_name}`,
            fee,
          });
        } catch (error) {
          console.error(`Failed to schedule fee for student ${student.id}:`, error);
          failedFees.push({
            studentId: student.id,
            studentName: `${student.first_name} ${student.last_name}`,
            error: error.message || 'Unknown error',
          });
        }
      }

      // Set results
      setResults({
        successful: successfulFees,
        failed: failedFees,
      });
    } catch (error) {
      console.error('Error during fee scheduling:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setSelectedFeeType('');
    setSelectedStudentGroup('all');
    setSelectedClass('');
    setCustomStudents([]);
    setScheduleDetails({
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      amount: '',
      customize_amount: false,
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
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        }
      >
        Schedule Fees
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Schedule Fees"
        size="xl"
      >
        {!results ? (
          <div className="space-y-6">
            {/* Fee Type Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Fee Type
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fee_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Fee Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="fee_type"
                    value={selectedFeeType}
                    onChange={handleFeeTypeChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.feeType
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  >
                    <option value="">Select a fee type</option>
                    {feeTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {formatCurrency(type.amount)}
                      </option>
                    ))}
                  </select>
                  {errors.feeType && (
                    <p className="mt-1 text-sm text-red-600">{errors.feeType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Student Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Student Selection
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="student_group"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apply To
                  </label>
                  <select
                    id="student_group"
                    value={selectedStudentGroup}
                    onChange={handleStudentGroupChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="all">All Students</option>
                    <option value="class">Specific Class</option>
                    <option value="custom">Custom Selection</option>
                  </select>
                </div>

                {selectedStudentGroup === 'class' && (
                  <div>
                    <label
                      htmlFor="class"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="class"
                      value={selectedClass}
                      onChange={handleClassChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.class
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.level}
                        </option>
                      ))}
                    </select>
                    {errors.class && (
                      <p className="mt-1 text-sm text-red-600">{errors.class}</p>
                    )}
                  </div>
                )}

                {selectedStudentGroup === 'custom' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Students <span className="text-red-500">*</span>
                      </label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={selectAllStudents}
                      >
                        {customStudents.length === students.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </div>
                    {errors.customStudents && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customStudents}
                      </p>
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
                                  checked={customStudents.includes(student.id)}
                                  onChange={() =>
                                    toggleStudentSelection(student.id)
                                  }
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
                )}
              </div>
            </div>

            {/* Fee Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Fee Details
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="due_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={scheduleDetails.due_date}
                    onChange={handleScheduleDetailsChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.due_date
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.due_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.due_date}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-start mb-2">
                    <div className="flex items-center h-5">
                      <input
                        id="customize_amount"
                        name="customize_amount"
                        type="checkbox"
                        checked={scheduleDetails.customize_amount}
                        onChange={handleScheduleDetailsChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="customize_amount"
                        className="font-medium text-gray-700"
                      >
                        Customize Amount
                      </label>
                    </div>
                  </div>

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
                      value={scheduleDetails.amount}
                      onChange={handleScheduleDetailsChange}
                      disabled={!selectedFeeType && !scheduleDetails.customize_amount}
                      readOnly={!scheduleDetails.customize_amount && selectedFeeType}
                      className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.amount
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      } ${
                        !scheduleDetails.customize_amount && selectedFeeType
                          ? 'bg-gray-100'
                          : ''
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
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
                    value={scheduleDetails.notes}
                    onChange={handleScheduleDetailsChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Fee Type:</span>{' '}
                  {selectedFeeType
                    ? feeTypes.find(
                        (ft) => ft.id === parseInt(selectedFeeType)
                      )?.name
                    : 'Not selected'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Due Date:</span>{' '}
                  {scheduleDetails.due_date
                    ? formatDate(scheduleDetails.due_date)
                    : 'Not set'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Amount per Student:</span>{' '}
                  {scheduleDetails.amount
                    ? formatCurrency(scheduleDetails.amount)
                    : 'Not set'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Student Group:</span>{' '}
                  {selectedStudentGroup === 'all'
                    ? 'All Students'
                    : selectedStudentGroup === 'class'
                    ? `Class: ${
                        classes.find(
                          (cls) => cls.id === parseInt(selectedClass)
                        )?.name || 'Not selected'
                      }`
                    : `Custom Selection (${customStudents.length} students)`}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Total Students:</span>{' '}
                  {getTargetStudents().length}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Total Amount:</span>{' '}
                  {scheduleDetails.amount && getTargetStudents().length > 0
                    ? formatCurrency(
                        parseFloat(scheduleDetails.amount) *
                          getTargetStudents().length
                      )
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900">
                Scheduling Results
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Successfully scheduled {results.successful.length} fees.{' '}
                {results.failed.length > 0 && (
                  <span className="text-red-600">
                    {results.failed.length} failed.
                  </span>
                )}
              </p>
            </div>

            {results.successful.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Successfully Scheduled Fees
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
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.successful.map((item) => (
                        <tr key={item.fee.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.studentName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(item.fee.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(item.fee.due_date)}
                            </div>
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
                  Failed Fee Schedules
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
                onClick={scheduleFees}
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
                    Scheduling...
                  </>
                ) : (
                  'Schedule Fees'
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

export default FeeScheduler;
