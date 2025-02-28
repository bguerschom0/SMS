import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/formatters';

const StudentProfile = ({ student, financialSummary }) => {
  if (!student) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-gray-500">Student information not available</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Student Status Badge */}
      <div>
        <StatusBadge 
          status={student.is_active ? 'active' : 'inactive'} 
          size="lg"
        />
      </div>
      
      {/* Personal Information */}
      <Card title="Personal Information">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">First Name</h4>
              <p className="mt-1 text-sm text-gray-900">{student.first_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
              <p className="mt-1 text-sm text-gray-900">{student.last_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Student ID</h4>
              <p className="mt-1 text-sm text-gray-900">{student.student_id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Admission Date</h4>
              <p className="mt-1 text-sm text-gray-900">{formatDate(student.admission_date)}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Guardian Information */}
      <Card title="Guardian Information">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Guardian Name</h4>
              <p className="mt-1 text-sm text-gray-900">{student.guardian_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
              <p className="mt-1 text-sm text-gray-900">{student.contact_number}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1 text-sm text-gray-900">{student.email || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="mt-1 text-sm text-gray-900">{student.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Financial Summary */}
      {financialSummary && (
        <Card title="Financial Summary">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Fees</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(financialSummary.totalFees)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Paid</h4>
              <p className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(financialSummary.totalPaid)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Outstanding Balance</h4>
              <p className="mt-1 text-lg font-semibold text-red-600">{formatCurrency(financialSummary.outstanding)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Payment Rate</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{financialSummary.paymentRate.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Link to={`/payments/new?student=${student.id}`}>
              <Button variant="primary">
                Record Payment
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentProfile;
