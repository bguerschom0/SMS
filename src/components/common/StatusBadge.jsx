import React from 'react';

const StatusBadge = ({ status, size = 'md', withDot = true }) => {
  // Determine status configuration
  const statusConfig = {
    completed: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      dotColor: 'bg-green-500',
      label: 'Completed'
    },
    pending: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      dotColor: 'bg-yellow-500',
      label: 'Pending'
    },
    overdue: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      dotColor: 'bg-red-500',
      label: 'Overdue'
    },
    cancelled: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      dotColor: 'bg-gray-500',
      label: 'Cancelled'
    },
    active: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      dotColor: 'bg-blue-500',
      label: 'Active'
    },
    inactive: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      dotColor: 'bg-gray-500',
      label: 'Inactive'
    },
    paid: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      dotColor: 'bg-green-500',
      label: 'Paid'
    },
    unpaid: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      dotColor: 'bg-red-500',
      label: 'Unpaid'
    },
    partial: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      dotColor: 'bg-yellow-500',
      label: 'Partial'
    },
    approved: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      dotColor: 'bg-green-500',
      label: 'Approved'
    },
    rejected: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      dotColor: 'bg-red-500',
      label: 'Rejected'
    },
    processing: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      dotColor: 'bg-blue-500',
      label: 'Processing'
    },
    // If status doesn't match any predefined configs, use this as default
    default: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      dotColor: 'bg-gray-500',
      label: status
    }
  };

  // Get status configuration, fallback to default config if status not found
  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        config.bgColor
      } ${config.textColor} ${sizeStyles[size]}`}
    >
      {withDot && (
        <span
          className={`${
            config.dotColor
          } h-1.5 w-1.5 rounded-full mr-1.5`}
        ></span>
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
