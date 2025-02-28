import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/supabase';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (email) => authApi.resetPasswordRequest(email),
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error) => {
      setError(error.message || 'Failed to send reset email. Please try again.');
    }
  });
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    resetPasswordMutation.mutate(email);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Reset Your Password
      </h2>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            <p>
              If an account exists with <span className="font-semibold">{email}</span>, 
              you will receive an email with instructions to reset your password.
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            Please check your email and follow the link to reset your password.
            The link will expire after 24 hours.
          </p>
          
          <Link
            to="/login"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Enter your email address below, and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="youremail@example.com"
                />
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
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
                    Sending Reset Instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
