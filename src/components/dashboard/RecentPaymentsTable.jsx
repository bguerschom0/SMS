import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../common/Table';
import Card from '../common/Card';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const RecentPaymentsTable = ({ payments = [], isLoading = false, limit = 5 }) => {
  // Table columns configuration
  const columns = [
    {
      key: 'student',
      title: 'Student',
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.student ? `${row.student.first_name} ${row.student.last_name}` : row.student_name}
          </div>
          <div className="text-xs text-gray-500">ID: {row.student?.student_id || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'receipt_number',
      title: 'Receipt #',
      render: (receipt) => (
        <span className="text-sm font-medium text-gray-600">{receipt}</span>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (amount) => (
        <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
      )
    },
    {
      key: 'payment_date',
      title: 'Date',
      render: (date) => formatDate(date)
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => <StatusBadge status={status} />
    }
  ];

  // Sample payments data if none provided
  const displayPayments = payments.length > 0 
    ? payments.slice(0, limit)
    : [
        { 
          id: 1, 
          student_name: 'John Doe', 
          receipt_number: 'RCT-1001', 
          amount: 350.00, 
          payment_date: '2025-02-25', 
          status: 'Completed' 
        },
        { 
          id: 2, 
          student_name: 'Jane Smith', 
          receipt_number: 'RCT-1002', 
          amount: 420.00, 
          payment_date: '2025-02-24', 
          status: 'Completed' 
        },
        { 
          id: 3, 
          student_name: 'Michael Brown', 
          receipt_number: 'RCT-1003', 
          amount: 210.00, 
          payment_date: '2025-02-23', 
          status: 'Pending' 
        },
        { 
          id: 4, 
          student_name: 'Sarah Wilson', 
          receipt_number: 'RCT-1004', 
          amount: 520.00, 
          payment_date: '2025-02-22', 
          status: 'Completed' 
        },
        { 
          id: 5, 
          student_name: 'David Miller', 
          receipt_number: 'RCT-1005', 
          amount: 180.00, 
          payment_date: '2025-02-21', 
          status: 'Failed' 
        }
      ];

  return (
    <Card
      title="Recent Payments"
      headerAction={
        <Link to="/payments">
          <Button variant="link" size="sm">
            View All
          </Button>
        </Link>
      }
      noPadding
    >
      <Table
        columns={columns}
        data={displayPayments}
        isLoading={isLoading}
        onRowClick={(row) => {
          window.location.href = `/payments/${row.id}`;
        }}
        emptyMessage="No recent payments found"
      />
    </Card>
  );
};

export default RecentPaymentsTable;
