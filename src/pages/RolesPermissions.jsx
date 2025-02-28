import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';

const RolesPermissions = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    permissions: {}
  });
  const [errors, setErrors] = useState({});
  
  // Fetch roles
  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => authApi.getRoles()
  });
  
  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: (roleData) => authApi.createRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsCreateModalOpen(false);
      resetForm();
    }
  });
  
  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: (roleData) => authApi.updateRole(roleData.id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsEditModalOpen(false);
    }
  });
  
  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: (roleId) => authApi.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsDeleteModalOpen(false);
    }
  });
  
  // Reset form
  const resetForm = () => {
    setNewRole({
      name: '',
      permissions: {}
    });
    setErrors({});
  };
  
  // Open edit modal
  const handleOpenEditModal = (role) => {
    setSelectedRole({...role});
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const handleOpenDeleteModal = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };
  
  // Handle input change for new role form
  const handleNewRoleChange = (e) => {
    const { name, value } = e.target;
    setNewRole(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle input change for edit role form
  const handleEditRoleChange = (e) => {
    const { name, value } = e.target;
    setSelectedRole(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle permission change
  const handlePermissionChange = (e, isEditMode = false) => {
    const { name, checked } = e.target;
    const [module, action] = name.split('.');
    
    if (isEditMode) {
      setSelectedRole(prev => {
        const updatedPermissions = { ...prev.permissions };
        
        if (!updatedPermissions[module]) {
          updatedPermissions[module] = {};
        }
        
        updatedPermissions[module][action] = checked;
        
        return {
          ...prev,
          permissions: updatedPermissions
        };
      });
    } else {
      setNewRole(prev => {
        const updatedPermissions = { ...prev.permissions };
        
        if (!updatedPermissions[module]) {
          updatedPermissions[module] = {};
        }
        
        updatedPermissions[module][action] = checked;
        
        return {
          ...prev,
          permissions: updatedPermissions
        };
      });
    }
  };
  
  // Validate role form
  const validateRoleForm = (data) => {
    const newErrors = {};
    
    if (!data.name) {
      newErrors.name = 'Role name is required';
    } else if (data.name.length < 2) {
      newErrors.name = 'Role name must be at least 2 characters';
    }
    
    // Check if any permissions are selected
    const hasPermissions = Object.values(data.permissions).some(modulePerms => 
      Object.values(modulePerms).some(value => value === true)
    );
    
    if (!hasPermissions) {
      newErrors.permissions = 'At least one permission must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle create role submit
  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateRoleForm(newRole)) {
      return;
    }
    
    createRoleMutation.mutate(newRole);
  };
  
  // Handle edit role submit
  const handleEditRoleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateRoleForm(selectedRole)) {
      return;
    }
    
    updateRoleMutation.mutate(selectedRole);
  };
  
  // Handle delete role
  const handleDeleteRole = () => {
    deleteRoleMutation.mutate(selectedRole.id);
  };
  
  // Format permission name
  const formatPermissionName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
  };
  
  // Permission modules and actions
  const permissionModules = {
    students: ['create', 'read', 'update', 'delete'],
    payments: ['create', 'read', 'update', 'delete'],
    fees: ['create', 'read', 'update', 'delete'],
    expenses: ['create', 'read', 'update', 'delete'],
    reports: ['read'],
    settings: ['update'],
    users: ['create', 'read', 'update', 'delete']
  };
  
  // Check if a permission is granted
  const hasPermission = (permissions, module, action) => {
    return permissions?.[module]?.[action] === true;
  };
  
  // Count permissions for a role
  const countPermissions = (permissions) => {
    let count = 0;
    Object.keys(permissions || {}).forEach(module => {
      Object.keys(permissions[module]).forEach(action => {
        if (permissions[module][action]) {
          count++;
        }
      });
    });
    return count;
  };
  
  // Format role name
  const formatRoleName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  // Table columns
  const columns = [
    {
      key: 'name',
      title: 'Role Name',
      render: (name) => (
        <span className="font-medium text-gray-900">{formatRoleName(name)}</span>
      )
    },
    {
      key: 'permissions',
      title: 'Permissions',
      render: (permissions) => (
        <span className="text-gray-500">{countPermissions(permissions)} permissions</span>
      )
    },
    {
      key: 'users_count',
      title: 'Users',
      render: (count) => count || 0
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, role) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(role);
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            Edit
          </button>
          {role.name !== 'admin' && role.name !== 'user' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDeleteModal(role);
              }}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
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
          Create Role
        </Button>
      </div>
      
      {/* Roles Table */}
      <Card noPadding>
        <Table
          columns={columns}
          data={roles || []}
          isLoading={isLoading}
          pagination
          itemsPerPage={10}
          emptyMessage="No roles found."
        />
      </Card>
      
      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Role"
        size="lg"
      >
        <form onSubmit={handleCreateRoleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newRole.name}
                onChange={handleNewRoleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
                placeholder="Enter role name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Permissions <span className="text-red-500">*</span>
              </h3>
              
              {errors.permissions && (
                <p className="mt-1 text-sm text-red-600 mb-3">{errors.permissions}</p>
              )}
              
              <div className="border rounded-md divide-y">
                {Object.entries(permissionModules).map(([module, actions]) => (
                  <div key={module} className="p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {formatPermissionName(module)}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {actions.map(action => (
                        <label key={`${module}.${action}`} className="flex items-center">
                          <input
                            type="checkbox"
                            name={`${module}.${action}`}
                            checked={hasPermission(newRole.permissions, module, action)}
                            onChange={(e) => handlePermissionChange(e)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {formatPermissionName(action)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
              disabled={createRoleMutation.isPending}
            >
              {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Role"
        size="lg"
      >
        {selectedRole && (
          <form onSubmit={handleEditRoleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={selectedRole.name}
                  onChange={handleEditRoleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                  placeholder="Enter role name"
                  // Disable editing of built-in roles
                  disabled={selectedRole.name === 'admin' || selectedRole.name === 'user'}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
                {(selectedRole.name === 'admin' || selectedRole.name === 'user') && (
                  <p className="mt-1 text-xs text-gray-500">
                    Built-in role names cannot be modified.
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Permissions <span className="text-red-500">*</span>
                </h3>
                
                {errors.permissions && (
                  <p className="mt-1 text-sm text-red-600 mb-3">{errors.permissions}</p>
                )}
                
                <div className="border rounded-md divide-y">
                  {Object.entries(permissionModules).map(([module, actions]) => (
                    <div key={module} className="p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        {formatPermissionName(module)}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {actions.map(action => (
                          <label key={`${module}.${action}`} className="flex items-center">
                            <input
                              type="checkbox"
                              name={`${module}.${action}`}
                              checked={hasPermission(selectedRole.permissions, module, action)}
                              onChange={(e) => handlePermissionChange(e, true)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              // Admin role always has all permissions
                              disabled={selectedRole.name === 'admin'}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {formatPermissionName(action)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedRole.name === 'admin' && (
                  <p className="mt-2 text-xs text-gray-500">
                    Admin role always has all permissions.
                  </p>
                )}
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
                disabled={
                  updateRoleMutation.isPending || 
                  (selectedRole.name === 'admin' && selectedRole.permissions)
                }
              >
                {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      
      {/* Delete Role Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Role"
      >
        {selectedRole && (
          <div>
            <p className="text-gray-700">
              Are you sure you want to delete the <span className="font-semibold">{formatRoleName(selectedRole.name)}</span> role? 
              {selectedRole.users_count > 0 && (
                <span className="text-red-600"> This will affect {selectedRole.users_count} user(s).</span>
              )}
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
                onClick={handleDeleteRole}
                disabled={deleteRoleMutation.isPending}
              >
                {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete Role'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RolesPermissions;
