import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Authentication Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import StudentForm from './pages/StudentForm';
import Payments from './pages/Payments';
import PaymentDetail from './pages/PaymentDetail';
import PaymentForm from './pages/PaymentForm';
import Expenses from './pages/Expenses';
import ExpenseDetail from './pages/ExpenseDetail';
import ExpenseForm from './pages/ExpenseForm';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import RolesPermissions from './pages/RolesPermissions';
import NotFound from './pages/NotFound';

// Protected Route wrapper component
const ProtectedRoute = ({ element, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if password change is required
  const { isPasswordChangeRequired } = useAuth();
  if (isPasswordChangeRequired) {
    // Allow access to change password page
    if (window.location.pathname === '/change-password') {
      return element;
    }
    // Redirect to change password for all other routes
    return <Navigate to="/change-password?firstLogin=true" replace />;
  }
  
  return element;
};

const Router = () => {
  return (
    <Routes>
      {/* Auth Routes - Accessible when not logged in */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Main Application Routes - Protected */}
      <Route element={<MainLayout />}>
        {/* Dashboard - Accessible to all authenticated users */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        
        {/* Profile and Password Change - Accessible to all authenticated users */}
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/change-password" element={<ProtectedRoute element={<ChangePassword />} />} />
        
        {/* Student Routes - Require student management permissions */}
        <Route path="/students" element={<ProtectedRoute element={<Students />} requiredPermission="students.read" />} />
        <Route path="/students/:id" element={<ProtectedRoute element={<StudentDetail />} requiredPermission="students.read" />} />
        <Route path="/students/new" element={<ProtectedRoute element={<StudentForm />} requiredPermission="students.create" />} />
        <Route path="/students/:id/edit" element={<ProtectedRoute element={<StudentForm />} requiredPermission="students.update" />} />
        
        {/* Payment Routes - Require payment management permissions */}
        <Route path="/payments" element={<ProtectedRoute element={<Payments />} requiredPermission="payments.read" />} />
        <Route path="/payments/:id" element={<ProtectedRoute element={<PaymentDetail />} requiredPermission="payments.read" />} />
        <Route path="/payments/new" element={<ProtectedRoute element={<PaymentForm />} requiredPermission="payments.create" />} />
        <Route path="/payments/:id/edit" element={<ProtectedRoute element={<PaymentForm />} requiredPermission="payments.update" />} />
        
        {/* Expense Routes - Require expense management permissions */}
        <Route path="/expenses" element={<ProtectedRoute element={<Expenses />} requiredPermission="expenses.read" />} />
        <Route path="/expenses/:id" element={<ProtectedRoute element={<ExpenseDetail />} requiredPermission="expenses.read" />} />
        <Route path="/expenses/new" element={<ProtectedRoute element={<ExpenseForm />} requiredPermission="expenses.create" />} />
        <Route path="/expenses/:id/edit" element={<ProtectedRoute element={<ExpenseForm />} requiredPermission="expenses.update" />} />
        
        {/* Report Routes - Require report access permissions */}
        <Route path="/reports" element={<ProtectedRoute element={<Reports />} requiredPermission="reports.read" />} />
        
        {/* Settings & Admin Routes - Require admin permissions */}
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} requiredPermission="settings.update" />} />
        <Route path="/user-management" element={<ProtectedRoute element={<UserManagement />} requiredPermission="users.manage" />} />
        <Route path="/roles-permissions" element={<ProtectedRoute element={<RolesPermissions />} requiredPermission="roles.manage" />} />
      </Route>

      {/* Redirect to dashboard from root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
