import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../services/supabase';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    student_id: '',
    guardian_name: '',
    contact_number: '',
    email: '',
    address: '',
    admission_date: new Date().toISOString().split('T')[0],
    is_active: true
  });
  
  const [errors, setErrors] = useState({});
  
  // Fetch student data if in edit mode
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsApi.getById(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      if (data) {
        // Format date to YYYY-MM-DD for input
        const formattedData = {
          ...data,
          admission_date: data.admission_date ? new Date(data.admission_date).toISOString().split('T')[0] : '',
        };
        setFormData(formattedData);
      }
    }
  });
  
  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: (data) => studentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      navigate('/students');
    }
  });
  
  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }) => studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      navigate(`/students/${id}`);
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
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.student_id.trim()) {
      newErrors.student_id = 'Student ID is required';
    }
    
    if (!formData.guardian_name.trim()) {
      newErrors.guardian_name = 'Guardian name is required';
    }
    
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.admission_date) {
      newErrors.admission_date = 'Admission date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode) {
      updateStudentMutation.mutate({ id, data: formData });
    } else {
      createStudentMutation.mutate(formData);
    }
  };
  
  // Determine if mutation is loading
  const isMutationLoading = createStudentMutation.isPending || updateStudentMutation.isPending;
  
  // Display error message from mutation
  const mutationError = createStudentMutation.error || updateStudentMutation.error;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Student' : 'Add New Student'}
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
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.first_name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.last_name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.student_id
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.student_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="admission_date" className="block text-sm font-medium text-gray-700">
                    Admission Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="admission_date"
                    name="admission_date"
                    value={formData.admission_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.admission_date
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.admission_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.admission_date}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Guardian Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="guardian_name" className="block text-sm font-medium text-gray-700">
                    Guardian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="guardian_name"
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.guardian_name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.guardian_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.guardian_name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact_number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.contact_number
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.contact_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">
                  Active Student
                </label>
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
                  isEditMode ? 'Update Student' : 'Save Student'
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default StudentForm;
