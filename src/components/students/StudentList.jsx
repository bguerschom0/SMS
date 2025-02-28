import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

const StudentList = ({ students, isLoading }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Filter students based on search term and status
  const filteredStudents = students?.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.guardian_name && student.guardian_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && student.is_active) || 
      (statusFilter === 'inactive' && !student.is_active);
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Table columns
  const columns = [
    {
      key: 'student_id',
      title: 'Student ID',
      render: (student_id) => (
        <span className="font-medium text-gray-900">{student_id}</span>
      )
    },
    {
      key: 'first_name',
      title: 'Name',
      render: (_, student) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {student.first_name} {student.last_name}
          </div>
        </div>
      )
    },
    {
      key: 'guardian_name',
      title: 'Guardian',
      render: (guardian_name) => guardian_name || 'N/A'
    },
    {
      key: 'contact_number',
      title: 'Contact',
      render: (contact_number) => contact_number || 'N/A'
    },
    {
      key: 'admission_date',
      title: 'Admission Date',
      render: (date) => formatDate(date)
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (is_active) => <StatusBadge status={is_active ? 'active' : 'inactive'} />
    }
  ];
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };
  
  return (
    <Card>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="all">All Students</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        
        {/* Filter actions */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Clear Filters
          </button>
          
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredStudents.length}</span> students
          </div>
        </div>
      </div>
      
      <Table
        columns={columns}
        data={filteredStudents}
        isLoading={isLoading}
        onRowClick={(student) => navigate(`/students/${student.id}`)}
        pagination
        itemsPerPage={10}
        emptyMessage="No students found matching your filters."
      />
    </Card>
  );
};

export default StudentList;
