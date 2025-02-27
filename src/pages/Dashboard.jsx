import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi, feesApi, studentsApi } from '../services/supabase';
import StatCard from '../components/dashboard/StatCard';
import FeeSummaryChart from '../components/dashboard/FeeSummaryChart';
import PaymentMethodsChart from '../components/dashboard/PaymentMethodsChart';
import RecentPaymentsTable from '../components/dashboard/RecentPaymentsTable';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCollections: 0,
    pendingFees: 0,
    totalStudents: 0,
    dueToday: 0
  });

  // Fetch payments data
  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['recent-payments'],
    queryFn: () => paymentsApi.getAll(),
    staleTime: 60 * 1000 // 1 minute
  });

  // Fetch outstanding fees
  const { data: outstandingFees, isLoading: isLoadingFees } = useQuery({
    queryKey: ['outstanding-fees'],
    queryFn: () => feesApi.getAll(),
    staleTime: 60 * 1000 // 1 minute
  });

  // Fetch students count
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Calculate dashboard stats when data is loaded
  useEffect(() => {
    if (payments && outstandingFees && students) {
      const today = new Date().toISOString().split('T')[0];

      // Calculate total collections
      const totalCollections = payments.reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate pending fees
      const pendingFees = outstandingFees
        .filter(fee => fee.status === 'unpaid')
        .reduce((sum, fee) => sum + fee.amount, 0);

      // Calculate due today count
      const dueToday = outstandingFees.filter(
        fee => fee.due_date === today && fee.status === 'unpaid'
      ).length;

      setStats({
        totalCollections,
        pendingFees,
        totalStudents: students.length,
        dueToday
      });
    }
  }, [payments, outstandingFees, students]);

  // Stat cards icons
  const icons = {
    collections: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
      </svg>
    ),
    pendingFees: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-14h2v7h-2zm0 8h2v2h-2z" />
      </svg>
    ),
    totalStudents: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
        <circle cx="8" cy="6" r="3" />
        <path d="M4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14V16H4V14Z" />
        <circle cx="16" cy="6" r="3" />
        <path d="M12 14C12 11.7909 13.7909 10 16 10C18.2091 10 20 11.7909 20 14V16H12V14Z" />
      </svg>
    ),
    dueToday: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
        <path fillRule="evenodd" d="M19 3h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H8V2c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 10c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm-4 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm8 2c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-4 0c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
      </svg>
    )
  };

  // Determine if any data is loading
  const isLoading = isLoadingPayments || isLoadingFees || isLoadingStudents;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Collections"
          value={formatCurrency(stats.totalCollections)}
          icon={icons.collections}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          change="+8%"
          changeText="from last month"
          changeType="positive"
        />
        
        <StatCard
          title="Pending Fees"
          value={formatCurrency(stats.pendingFees)}
          icon={icons.pendingFees}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          changeText={`${outstandingFees?.filter(fee => fee.status === 'unpaid').length || 0} students with defaults`}
          changeType="negative"
        />
        
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={icons.totalStudents}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          change="+12"
          changeText="new admissions"
          changeType="positive"
        />
        
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          icon={icons.dueToday}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          changeText="payments due today"
          changeType="neutral"
        />
      </div>
      
      {/* Recent Payments Table */}
      <RecentPaymentsTable
        payments={payments || []}
        isLoading={isLoadingPayments}
      />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FeeSummaryChart data={payments || []} />
        <PaymentMethodsChart data={payments || []} />
      </div>
    </div>
  );
};

export default Dashboard;
