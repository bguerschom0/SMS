import { format, parseISO } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

// Format date
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' 
      ? parseISO(dateString) 
      : dateString;
    
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format student name
export const formatStudentName = (student) => {
  if (!student) return '';
  
  if (typeof student === 'string') return student;
  
  const { first_name, last_name } = student;
  return `${first_name} ${last_name}`;
};

// Format payment status
export const formatPaymentStatus = (status) => {
  if (!status) return '';
  
  const statusMap = {
    'completed': 'Completed',
    'pending': 'Pending',
    'failed': 'Failed',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

// Generate a receipt number
export const generateReceiptNumber = () => {
  const prefix = 'RCT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}-${timestamp}${random}`;
};

// Calculate fee status
export const calculateFeeStatus = (dueDate, isPaid) => {
  if (isPaid) return 'Paid';
  
  const today = new Date();
  const due = new Date(dueDate);
  
  if (due < today) {
    return 'Overdue';
  }
  
  return 'Pending';
};

// Calculate overdue days
export const calculateOverdueDays = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  
  if (due >= today) return 0;
  
  const diffTime = Math.abs(today - due);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Truncate text
export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phoneNumber;
};
