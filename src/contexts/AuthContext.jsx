import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, authApi } from '../services/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPasswordChangeRequired, setIsPasswordChangeRequired] = useState(false);

  useEffect(() => {
    // Check for active session
    const checkUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Get user's role and permissions
          try {
            const { role, permissions } = await authApi.getUserRole(currentUser.id);
            setUserRole(role);
            setPermissions(permissions || {});
            
            // Check if password change is required (first login or admin reset)
            const passwordChangeRequired = await authApi.isPasswordChangeRequired(currentUser.id);
            setIsPasswordChangeRequired(passwordChangeRequired);
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const currentUser = session?.user || null;
          setUser(currentUser);
          
          if (currentUser) {
            try {
              const { role, permissions } = await authApi.getUserRole(currentUser.id);
              setUserRole(role);
              setPermissions(permissions || {});
              
              // Check if password change is required
              const passwordChangeRequired = await authApi.isPasswordChangeRequired(currentUser.id);
              setIsPasswordChangeRequired(passwordChangeRequired);
            } catch (error) {
              console.error('Error fetching user role:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setPermissions({});
          setIsPasswordChangeRequired(false);
        }
        setLoading(false);
      }
    );

    checkUser();

    // Clean up subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Auth methods
  const signIn = async (email, password) => {
    try {
      const { data, error } = await authApi.signIn(email, password);
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      const { data, error } = await authApi.signUp(email, password);
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
      setUser(null);
      setUserRole(null);
      setPermissions({});
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword
      });
      
      // If this was a required password change, update the state
      if (isPasswordChangeRequired) {
        setIsPasswordChangeRequired(false);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await authApi.resetPasswordRequest(email);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      const updatedUser = await authApi.updateProfile(user.id, data);
      setUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Permission check helper
  const hasPermission = (permissionKey) => {
    if (userRole === 'admin') return true; // Admin has all permissions
    return Boolean(permissions[permissionKey]);
  };

  const value = {
    user,
    loading,
    userRole,
    permissions,
    isPasswordChangeRequired,
    signIn,
    signUp,
    signOut,
    changePassword,
    resetPassword,
    updateProfile,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
