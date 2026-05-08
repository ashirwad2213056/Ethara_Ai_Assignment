import { useState, useCallback, useEffect } from 'react';
import { expensesApi } from '../api/expenses.api.js';

export const useExpenses = (initialFilters = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expensesApi.list(filters);
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expenseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await expensesApi.create(expenseData);
      setExpenses((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeExpense = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await expensesApi.remove(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await expensesApi.update(id, expenseData);
      setExpenses((prev) => prev.map((exp) => (exp.id === id ? response.data : exp)));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    loading,
    error,
    filters,
    setFilters,
    fetchExpenses,
    addExpense,
    removeExpense,
    updateExpense,
  };
};
