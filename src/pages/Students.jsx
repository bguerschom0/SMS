import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../services/supabase';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate } from '../utils/formatters';

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch students data
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll()
  });
  
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <Link to="/students/new">
          <Button
            variant="primary"
            icon={
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
            }
          >
            Add Student
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
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
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredStudents.length}</span> students
            </div>
          </div>
        </div>
      </Card>
      
      {/* Students Table */}
      <Card noPadding>
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
    </div>
  );
};

export default Students;
