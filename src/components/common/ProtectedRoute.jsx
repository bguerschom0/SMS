import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredPermission,
  redirectPath = '/login'
}) => {
  const { user, loading, hasPermission, isPasswordChangeRequired } = useAuth();
  const location = useLocation();
  
  // Handle case where user needs to change password
  useEffect(() => {
    if (user && isPasswordChangeRequired && location.pathname !== '/change-password') {
      // Redirect to change password page
      window.location.href = '/change-password?firstLogin=true';
    }
  }, [user, isPasswordChangeRequired, location.pathname]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If the user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // If password change is required, redirect to change password page
  if (isPasswordChangeRequired && location.pathname !== '/change-password') {
    return <Navigate to="/change-password?firstLogin=true" replace />;
  }
  
  // If a specific permission is required, check if the user has it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
