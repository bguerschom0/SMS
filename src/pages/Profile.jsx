import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const location = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Set form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);
  
  // Check for message from other pages (e.g., password change success)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear message after 5 seconds
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsEditing(false);
      setMessage('Profile updated successfully');
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
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
    
    updateProfileMutation.mutate(formData);
  };
  
  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Not Logged In</h2>
        <p className="text-gray-600 mb-4">You need to be logged in to view this page.</p>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h1>
      
      {/* Success message */}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <div className="p-6 flex flex-col items-center">
            {formData.avatar_url ? (
              <img
                src={formData.avatar_url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <span className="text-4xl font-medium text-primary-700">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
            
            <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
            <p className="text-gray-500">{formData.email}</p>
            
            <div className="mt-6 w-full">
              <Link to="/change-password">
                <Button variant="secondary" fullWidth>
                  Change Password
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        
        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
              
              {!isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email address cannot be changed.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      id="avatar_url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a URL for your profile picture. Leave blank to use default.
                    </p>
                  </div>
                </div>
                
                {/* Show error message if mutation fails */}
                {updateProfileMutation.isError && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {updateProfileMutation.error?.message || 'Failed to update profile. Please try again.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data to original user data
                      if (user) {
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          avatar_url: user.avatar_url || ''
                        });
                      }
                      // Clear any errors
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{formData.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="mt-1 text-sm text-gray-900">{formData.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.last_sign_in ? formatDate(user.last_sign_in) : 'Never'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
