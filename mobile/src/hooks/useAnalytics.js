import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api/analytics.api.js';

export function useAnalytics() {
  const [data, setData] = useState({
    summary: null,
    distribution: [],
    trends: [],
    recentExpenses: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, distRes, trendsRes] = await Promise.all([
        analyticsApi.summary(),
        analyticsApi.distribution(),
        analyticsApi.trends()
      ]);

      setData({
        summary: summaryRes.data.data.summary,
        recentExpenses: summaryRes.data.data.recentExpenses,
        distribution: distRes.data.data.distribution,
        trends: trendsRes.data.data.trends
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    ...data,
    loading,
    error,
    refresh: fetchAnalytics
  };
}
