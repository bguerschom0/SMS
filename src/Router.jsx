import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Authentication Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
import NotFound from './pages/NotFound';

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

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Student Routes */}
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/new" element={<StudentForm />} />
        <Route path="/students/:id/edit" element={<StudentForm />} />
        
        {/* Payment Routes */}
        <Route path="/payments" element={<Payments />} />
        <Route path="/payments/:id" element={<PaymentDetail />} />
        <Route path="/payments/new" element={<PaymentForm />} />
        <Route path="/payments/:id/edit" element={<PaymentForm />} />
        
        {/* Expense Routes */}
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
        <Route path="/expenses/new" element={<ExpenseForm />} />
        <Route path="/expenses/:id/edit" element={<ExpenseForm />} />
        
        {/* Report Routes */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Settings & Profile */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Redirect to dashboard from root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
