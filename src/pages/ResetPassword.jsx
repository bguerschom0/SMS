import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import Button from '../components/common/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check for reset token in URL
  useEffect(() => {
    const handleHashParams = async () => {
      // Parse hash parameters from URL (Supabase adds these for password reset flow)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      
      // If this isn't a password recovery flow, redirect to login
      if (type !== 'recovery' || !accessToken) {
        navigate('/login');
      }
    };
    
    handleHashParams();
  }, [navigate]);
  
  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (newPassword) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      setSuccess(true);
      // After a brief delay, redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    onError: (error) => {
      setError(error.message || 'Failed to reset password. Please try again or request a new reset link.');
    }
  });
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    resetPasswordMutation.mutate(password);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Reset Your Password
      </h2>
      
      {success ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            <p>
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Please enter your new password below.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long.
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
