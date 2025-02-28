import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

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

// Auth context
import { useAuth } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ requiredPermissions = [], redirectPath = '/dashboard', children }) => {
  const { user, hasPermission } = useAuth();
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If requiredPermissions is provided and user doesn't have one of the required permissions,
  // redirect to specified redirectPath
  if (
    requiredPermissions.length > 0 &&
    !requiredPermissions.every(permission => {
      const [module, action] = permission.split('.');
      return hasPermission(module, action);
    })
  ) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Render children or outlet
  return children || <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      
      {/* Change Password Route (special case - accessible both as authenticated and first login) */}
      <Route path="/change-password" element={<ChangePassword />} />
      
      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        {/* Dashboard - accessible to all authenticated users */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Student Routes */}
        <Route
          path="/students"
          element={<ProtectedRoute requiredPermissions={['students.read']}><Students /></ProtectedRoute>}
        />
        <Route
          path="/students/:id"
          element={<ProtectedRoute requiredPermissions={['students.read']}><StudentDetail /></ProtectedRoute>}
        />
        <Route
          path="/students/new"
          element={<ProtectedRoute requiredPermissions={['students.create']}><StudentForm /></ProtectedRoute>}
        />
        <Route
          path="/students/:id/edit"
          element={<ProtectedRoute requiredPermissions={['students.update']}><StudentForm /></ProtectedRoute>}
        />
        
        {/* Payment Routes */}
        <Route
          path="/payments"
          element={<ProtectedRoute requiredPermissions={['payments.read']}><Payments /></ProtectedRoute>}
        />
        <Route
          path="/payments/:id"
          element={<ProtectedRoute requiredPermissions={['payments.read']}><PaymentDetail /></ProtectedRoute>}
        />
        <Route
          path="/payments/new"
          element={<ProtectedRoute requiredPermissions={['payments.create']}><PaymentForm /></ProtectedRoute>}
        />
        <Route
          path="/payments/:id/edit"
          element={<ProtectedRoute requiredPermissions={['payments.update']}><PaymentForm /></ProtectedRoute>}
        />
        
        {/* Expense Routes */}
        <Route
          path="/expenses"
          element={<ProtectedRoute requiredPermissions={['expenses.read']}><Expenses /></ProtectedRoute>}
        />
        <Route
          path="/expenses/:id"
          element={<ProtectedRoute requiredPermissions={['expenses.read']}><ExpenseDetail /></ProtectedRoute>}
        />
        <Route
          path="/expenses/new"
          element={<ProtectedRoute requiredPermissions={['expenses.create']}><ExpenseForm /></ProtectedRoute>}
        />
        <Route
          path="/expenses/:id/edit"
          element={<ProtectedRoute requiredPermissions={['expenses.update']}><ExpenseForm /></ProtectedRoute>}
        />
        
        {/* Report Routes */}
        <Route
          path="/reports"
          element={<ProtectedRoute requiredPermissions={['reports.read']}><Reports /></ProtectedRoute>}
        />
        
        {/* Settings Routes */}
        <Route
          path="/settings"
          element={<ProtectedRoute requiredPermissions={['settings.update']}><Settings /></ProtectedRoute>}
        />
        
        {/* User Management Routes */}
        <Route
          path="/users"
          element={<ProtectedRoute requiredPermissions={['users.read']}><UserManagement /></ProtectedRoute>}
        />
        
        {/* Roles & Permissions Routes */}
        <Route
          path="/roles"
          element={<ProtectedRoute requiredPermissions={['users.update']}><RolesPermissions /></ProtectedRoute>}
        />
        
        {/* Profile - accessible to all authenticated users */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      {/* Redirect to dashboard from root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
