import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Page not found</h2>
        
        <p className="mt-2 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-10">
          <Link to="/dashboard">
            <Button variant="primary">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
