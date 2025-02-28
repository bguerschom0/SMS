import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/formatters';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  });
  const [resetPassword, setResetPassword] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  
  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => authApi.getUsers()
  });
  
  // Fetch roles
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => authApi.getRoles()
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData) => authApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
      resetForm();
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (userData) => authApi.updateUser(userData.id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditModalOpen(false);
    }
  });
  
  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data) => authApi.resetPassword(data.userId, data.password),
    onSuccess: () => {
      setIsResetPasswordModalOpen(false);
      setResetPassword({ password: '', confirmPassword: '' });
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => authApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteModalOpen(false);
    }
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };
  
  // Reset form
  const resetForm = () => {
    setNewUser({
      email: '',
      password: '',
      name: '',
      role: 'user'
    });
    setErrors({});
  };
  
  // Open edit modal
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  // Open reset password modal
  const handleOpenResetPasswordModal = (user) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };
  
  // Open delete modal
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  // Handle input change for new user form
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle input change for edit user form
  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle input change for reset password form
  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPassword(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate create user form
  const validateCreateUserForm = () => {
    const newErrors = {};
    
    if (!newUser.email || !newUser.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!newUser.password || newUser.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!newUser.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate edit user form
  const validateEditUserForm = () => {
    const newErrors = {};
    
    if (!selectedUser.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate reset password form
  const validateResetPasswordForm = () => {
    const newErrors = {};
    
    if (!resetPassword.password || resetPassword.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (resetPassword.password !== resetPassword.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle create user submit
  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    
    if (!validateCreateUserForm()) {
      return;
    }
    
    createUserMutation.mutate(newUser);
  };
  
  // Handle edit user submit
  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEditUserForm()) {
      return;
    }
    
    updateUserMutation.mutate(selectedUser);
  };
  
  // Handle reset password submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    
    if (!validateResetPasswordForm()) {
      return;
    }
    
    resetPasswordMutation.mutate({
      userId: selectedUser.id,
      password: resetPassword.password
    });
  };
  
  // Handle delete user
  const handleDeleteUser = () => {
    deleteUserMutation.mutate(selectedUser.id);
  };
  
  // Filter users based on search and role filter
  const filteredUsers = users?.filter(user => {
    // Search filter
    const searchMatch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    
    return searchMatch && roleMatch;
  }) || [];
  
  // Format role name
  const formatRoleName = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  
  // Table columns
  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (name) => (
        <span className="font-medium text-gray-900">{name}</span>
      )
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'role',
      title: 'Role',
      render: (role) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
          {formatRoleName(role)}
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (date) => formatDate(date)
    },
    {
      key: 'last_sign_in',
      title: 'Last Login',
      render: (date) => date ? formatDate(date) : 'Never'
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, user) => (
        <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(user);
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenResetPasswordModal(user);
            }}
            className="text-yellow-600 hover:text-yellow-900"
          >
            Reset Password
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDeleteModal(user);
            }}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      )
    }
  ];
  
  // Role options for dropdown
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...(roles?.map(role => ({
      value: role.name,
      label: formatRoleName(role.name)
    })) || [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' }
    ])
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
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
          Create User
        </Button>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            {/* Role Filter */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Users Table */}
      <Card noPadding>
        <Table
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          pagination
          itemsPerPage={10}
          emptyMessage="No users found matching your filters."
        />
      </Card>
      
      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New User"
      >
        <form onSubmit={handleCreateUserSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Temporary Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                User will be prompted to change this on first login.
              </p>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleNewUserChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {roles?.map(role => (
                  <option key={role.id} value={role.name}>
                    {formatRoleName(role.name)}
                  </option>
                )) || (
                  <>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </>
                )}
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <form onSubmit={handleEditUserSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={selectedUser.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email address cannot be changed.
                </p>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleEditUserChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={selectedUser.role}
                  onChange={handleEditUserChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {roles?.map(role => (
                    <option key={role.id} value={role.name}>
                      {formatRoleName(role.name)}
                    </option>
                  )) || (
                    <>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label htmlFor="is_active" className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={selectedUser.is_active}
                    onChange={(e) => {
                      handleEditUserChange({
                        target: {
                          name: 'is_active',
                          value: e.target.checked
                        }
                      });
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      
      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={() => {
          setIsResetPasswordModalOpen(false);
          setResetPassword({ password: '', confirmPassword: '' });
        }}
        title="Reset Password"
      >
        {selectedUser && (
          <form onSubmit={handleResetPasswordSubmit}>
            <div className="space-y-4">
              <p className="text-gray-700">
                You are resetting the password for <span className="font-semibold">{selectedUser.email}</span>. 
                The user will be prompted to change this password on next login.
              </p>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={resetPassword.password}
                  onChange={handleResetPasswordChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={resetPassword.confirmPassword}
                  onChange={handleResetPasswordChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setResetPassword({ password: '', confirmPassword: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      
      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        {selectedUser && (
          <div>
            <p className="text-gray-700">
              Are you sure you want to delete the user <span className="font-semibold">{selectedUser.email}</span>? 
              This action cannot be undone.
            </p>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
