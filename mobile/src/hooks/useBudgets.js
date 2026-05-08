import { useState, useEffect, useCallback } from 'react';
import { budgetsApi } from '../api/budgets.api.js';

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetsApi.list();
      setBudgets(response.data.data.budgets);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBudget = async (data) => {
    setLoading(true);
    try {
      await budgetsApi.upsert(data);
      await fetchBudgets();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (id) => {
    try {
      await budgetsApi.remove(id);
      await fetchBudgets();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete budget');
      return false;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    refresh: fetchBudgets,
    saveBudget,
    deleteBudget
  };
}
