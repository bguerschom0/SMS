import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anonymous Key is missing. Make sure to set the environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Students API
export const studentsApi = {
  // Get all students
  getAll: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('last_name', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Get student by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create student
  create: async (studentData) => {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update student
  update: async (id, studentData) => {
    const { data, error } = await supabase
      .from('students')
      .update(studentData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete student
  delete: async (id) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Payments API
export const paymentsApi = {
  // Get all payments
  getAll: async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        students:student_id (first_name, last_name)
      `)
      .order('payment_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get payment by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        students:student_id (first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Get payments by student ID
  getByStudentId: async (studentId) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Create payment
  create: async (paymentData) => {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update payment
  update: async (id, paymentData) => {
    const { data, error } = await supabase
      .from('payments')
      .update(paymentData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete payment
  delete: async (id) => {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Fees API
export const feesApi = {
  // Get all fees
  getAll: async () => {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        students:student_id (first_name, last_name),
        fee_types:fee_type_id (name, description)
      `)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Get fee by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        students:student_id (first_name, last_name),
        fee_types:fee_type_id (name, description)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Get fees by student ID
  getByStudentId: async (studentId) => {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        fee_types:fee_type_id (name, description)
      `)
      .eq('student_id', studentId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Create fee
  create: async (feeData) => {
    const { data, error } = await supabase
      .from('fees')
      .insert([feeData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update fee
  update: async (id, feeData) => {
    const { data, error } = await supabase
      .from('fees')
      .update(feeData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete fee
  delete: async (id) => {
    const { error } = await supabase
      .from('fees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Expenses API
export const expensesApi = {
  // Get all expenses
  getAll: async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_types:expense_type_id (name, description)
      `)
      .order('expense_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get expense by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_types:expense_type_id (name, description)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create expense
  create: async (expenseData) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update expense
  update: async (id, expenseData) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(expenseData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete expense
  delete: async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Reports API
export const reportsApi = {
  // Get fee collection summary
  getFeeCollectionSummary: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('payments')
      .select('payment_date, amount')
      .gte('payment_date', startDate)
      .lte('payment_date', endDate)
      .order('payment_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Get outstanding fees
  getOutstandingFees: async () => {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        students:student_id (first_name, last_name),
        fee_types:fee_type_id (name, description)
      `)
      .eq('status', 'unpaid')
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Get expenses summary
  getExpensesSummary: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('expenses')
      .select('expense_date, amount, expense_types:expense_type_id (name)')
      .gte('expense_date', startDate)
      .lte('expense_date', endDate)
      .order('expense_date', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Auth API - Enhanced for user management
export const authApi = {
  // Get current user
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    
    if (data?.user) {
      // Fetch additional user info from users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        return data.user;
      }
      
      // Merge auth user with user profile data
      return { ...data.user, ...userData };
    }
    
    return null;
  },
  
  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign up with email and password
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
  
  // Change password
  changePassword: async ({ currentPassword, newPassword }) => {
    // First verify current password by trying to sign in
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser?.user?.email) {
      throw new Error('No user is currently logged in');
    }
    
    // Skip verification for password reset flow (if no currentPassword provided)
    if (currentPassword) {
      try {
        await supabase.auth.signInWithPassword({
          email: currentUser.user.email,
          password: currentPassword
        });
      } catch (error) {
        throw new Error('Current password is incorrect');
      }
    }
    
    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    // Update password_change_required flag to false
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_change_required: false })
      .eq('id', currentUser.user.id);
    
    if (updateError) throw updateError;
    
    return true;
  },
  
  // Request password reset
  resetPasswordRequest: async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
  },
  
  // Reset password using token (for admin-triggered resets)
  resetPassword: async (userId, password) => {
    // In a real app, you'd typically use a token-based approach
    // For this example, we'll directly update the user's password
    // and set the password_change_required flag
    
    // Admin access to update user password would be handled by a serverless function
    // due to security restrictions. This is a simplified version.
    
    // Update password_change_required flag
    const { error } = await supabase
      .from('users')
      .update({ password_change_required: true })
      .eq('id', userId);
    
    if (error) throw error;
    
    // In a real app, you'd trigger a password reset email with a token
    // or use admin API access to directly set the password
    
    return true;
  },
  
  // Update user profile
  updateProfile: async (userId, data) => {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId);
    
    if (error) throw error;
    
    // Fetch updated user data
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    return updatedUser;
  },
  
  // Get user's role and permissions
  getUserRole: async (userId) => {
    // Get user's role
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!userRoles || userRoles.length === 0) {
      return { role: 'user', permissions: {} }; // Default role
    }
    
    // Get role details
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('name, permissions')
      .eq('id', userRoles[0].role_id)
      .single();
    
    if (roleError) throw roleError;
    
    return {
      role: role.name,
      permissions: role.permissions
    };
  },
  
  // Check if password change is required
  isPasswordChangeRequired: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('password_change_required')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data.password_change_required || false;
  },
  
  // Get all users (admin only)
  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        avatar_url,
        created_at,
        last_sign_in,
        is_active,
        password_change_required,
        user_roles (
          role_id,
          roles (
            id,
            name
          )
        )
      `);
    
    if (error) throw error;
    
    // Transform data to include role name directly
    return data.map(user => ({
      ...user,
      role: user.user_roles?.[0]?.roles?.name || 'user',
      user_roles: undefined // Remove nested data
    }));
  },
  
  // Get all roles
  getRoles: async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*');
    
    if (error) throw error;
    
    return data;
  },
  
  // Create new user (admin only)
  createUser: async (userData) => {
    // In a real app, this would be handled by a secure server function
    // This simplified version shows the general approach
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    });
    
    if (authError) throw authError;
    
    // 2. Add user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        is_active: true,
        password_change_required: true // Require password change on first login
      });
    
    if (profileError) throw profileError;
    
    // 3. Assign role
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', userData.role)
      .single();
    
    if (roleError) throw roleError;
    
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role_id: roleData.id
      });
    
    if (userRoleError) throw userRoleError;
    
    return authData.user;
  },
  
  // Update user (admin only)
  updateUser: async (userId, userData) => {
    // Update user profile
    const { error: profileError } = await supabase
      .from('users')
      .update({
        name: userData.name,
        is_active: userData.is_active
      })
      .eq('id', userId);
    
    if (profileError) throw profileError;
    
    // Update role if changed
    if (userData.role) {
      // Get role ID
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', userData.role)
        .single();
      
      if (roleError) throw roleError;
      
      // Get current user role
      const { data: currentRoles, error: currentRoleError } = await supabase
        .from('user_roles')
        .select('id, role_id')
        .eq('user_id', userId);
      
      if (currentRoleError) throw currentRoleError;
      
      if (currentRoles.length > 0) {
        // Update existing role
        const { error: updateRoleError } = await supabase
          .from('user_roles')
          .update({ role_id: roleData.id })
          .eq('id', currentRoles[0].id);
        
        if (updateRoleError) throw updateRoleError;
      } else {
        // Create new role assignment
        const { error: createRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_id: roleData.id
          });
        
        if (createRoleError) throw createRoleError;
      }
    }
    
    return true;
  },
  
  // Delete user (admin only)
  deleteUser: async (userId) => {
    // In a real app, this would trigger a cascade delete through RLS policies
    // or be handled by a secure server function
    
    // Delete auth user (requires admin access, simplified here)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;
    
    return true;
  }
};

export default supabase;
