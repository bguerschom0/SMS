// src/hooks/useSupabase.js
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

/**
 * Custom hook to perform a Supabase query with state management
 * @param {function} queryFn - Function that returns a Supabase query
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} { data, error, loading, refetch }
 */
export function useSupabaseQuery(queryFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const execute = async () => {
    try {
      setLoading(true);
      const { data, error } = await queryFn();
      
      if (error) {
        setError(error);
        setData(null);
      } else {
        setData(data);
        setError(null);
      }
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    execute();
  }, dependencies);
  
  const refetch = () => execute();
  
  return { data, error, loading, refetch };
}

/**
 * Custom hook to perform a Supabase mutation with state management
 * @param {function} mutationFn - Function that returns a Supabase mutation
 * @returns {Object} { mutate, error, loading, data }
 */
export function useSupabaseMutation(mutationFn) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const mutate = async (variables) => {
    try {
      setLoading(true);
      const { data, error } = await mutationFn(variables);
      
      if (error) {
        setError(error);
        setData(null);
        return { error };
      } else {
        setData(data);
        setError(null);
        return { data };
      }
    } catch (err) {
      setError(err);
      setData(null);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };
  
  return { mutate, data, error, loading };
}

/**
 * Custom hook to listen to Supabase realtime changes
 * @param {string} table - Table name to subscribe to
 * @param {string} event - Event type (INSERT, UPDATE, DELETE, *)
 * @param {function} callback - Callback function when event occurs
 * @returns {function} Unsubscribe function
 */
export function useSupabaseSubscription(table, event = '*', callback) {
  useEffect(() => {
    const subscription = supabase
      .channel(`table-changes-${table}`)
      .on('postgres_changes', { event, schema: 'public', table }, callback)
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [table, event, callback]);
}

// Export all hooks
export { useAuth };
