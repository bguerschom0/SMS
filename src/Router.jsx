import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Authentication Pages
import Login from './pages/Login';
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

import ExpenseForm from './pages/ExpenseForm';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// User Management
import UserManagement from './pages/UserManagement';
import RolesPermissions from './pages/RolesPermissions';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

// Protection constants
const PERMISSIONS = {
  MANAGE_STUDENTS: 'students.manage',
  MANAGE_PAYMENTS: 'payments.manage',
  MANAGE_EXPENSES: 'expenses.manage',
  VIEW_REPORTS: 'reports.view',
  MANAGE_SETTINGS: 'settings.manage',
  MANAGE_USERS: 'users.manage',
  MANAGE_ROLES: 'roles.manage'
};

const Router = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Change Password (Special Route) */}
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        {/* Dashboard - Accessible to all authenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Student Routes - Requires student management permission */}
        <Route path="/students" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_STUDENTS}>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/students/:id" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_STUDENTS}>
            <StudentDetail />
          </ProtectedRoute>
        } />
        <Route path="/students/new" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_STUDENTS}>
            <StudentForm />
          </ProtectedRoute>
        } />
        <Route path="/students/:id/edit" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_STUDENTS}>
            <StudentForm />
          </ProtectedRoute>
        } />
        
        {/* Payment Routes - Requires payment management permission */}
        <Route path="/payments" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_PAYMENTS}>
            <Payments />
          </ProtectedRoute>
        } />
        <Route path="/payments/:id" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_PAYMENTS}>
            <PaymentDetail />
          </ProtectedRoute>
        } />
        <Route path="/payments/new" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_PAYMENTS}>
            <PaymentForm />
          </ProtectedRoute>
        } />
        <Route path="/payments/:id/edit" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_PAYMENTS}>
            <PaymentForm />
          </ProtectedRoute>
        } />
        
        {/* Expense Routes - Requires expense management permission */}
        <Route path="/expenses" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_EXPENSES}>
            <Expenses />
          </ProtectedRoute>
        } />

        <Route path="/expenses/new" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_EXPENSES}>
            <ExpenseForm />
          </ProtectedRoute>
        } />
        <Route path="/expenses/:id/edit" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_EXPENSES}>
            <ExpenseForm />
          </ProtectedRoute>
        } />
        
        {/* Report Routes - Requires report viewing permission */}
        <Route path="/reports" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_REPORTS}>
            <Reports />
          </ProtectedRoute>
        } />
        
        {/* Settings & Profile */}
        <Route path="/settings" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_SETTINGS}>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Profile is accessible to all authenticated users */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* User Management - Requires user management permission */}
        <Route path="/users" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
            <UserManagement />
          </ProtectedRoute>
        } />
        
        {/* Roles & Permissions - Requires role management permission */}
        <Route path="/roles" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_ROLES}>
            <RolesPermissions />
          </ProtectedRoute>
        } />
        
        {/* Access Denied Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Redirect to dashboard from root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
