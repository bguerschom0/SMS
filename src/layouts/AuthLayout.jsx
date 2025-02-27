import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-primary-600 mb-4"
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" className="h-16 w-auto">
            <rect x="10" y="10" width="40" height="40" rx="8" fill="#4F46E5" />
            <path d="M22 20C22 19.4477 22.4477 19 23 19H37C37.5523 19 38 19.4477 38 20V40C38 40.5523 37.5523 41 37 41H23C22.4477 41 22 40.5523 22 40V20Z" fill="white" />
            <path d="M26 23H34V27H26V23Z" fill="#4F46E5" />
            <path d="M26 29H34V33H26V29Z" fill="#4F46E5" />
            <path d="M26 35H34V37H26V35Z" fill="#4F46E5" />
            <text x="55" y="30" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" fill="#4F46E5">School</text>
            <text x="55" y="45" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" fill="#4F46E5">Manager</text>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          School Management System
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
