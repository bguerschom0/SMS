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

// Auth API
export const authApi = {
  // Get current user
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
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
  }
};

export default supabase;
