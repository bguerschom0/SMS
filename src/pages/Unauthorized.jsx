import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const { userRole } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h1>
        
        <p className="mt-2 text-lg text-gray-600">
          You don't have permission to access this page.
        </p>
        
        <p className="mt-2 text-sm text-gray-500">
          Your current role is: <span className="font-semibold">{userRole || 'Unknown'}</span>
        </p>
        
        <div className="mt-10 space-y-4">
          <Link to="/dashboard">
            <Button variant="primary">
              Go to Dashboard
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500">
            If you believe you should have access to this page,
            please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
