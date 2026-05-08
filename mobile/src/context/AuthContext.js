import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth.api.js';
import { saveTokens, clearTokens } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Restore session on app launch ─────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        const userData = await SecureStore.getItemAsync('user_data');
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch {
        // Token missing or invalid — stay logged out
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { data } = await authApi.login(email, password);
      await saveTokens(data.accessToken, data.refreshToken);
      await SecureStore.setItemAsync('user_data', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      let message = 'An unexpected error occurred.';
      
      if (!error.response) {
        message = 'Network error: Cannot reach the server. Please check your backend terminal to find your local IP and update it in mobile/src/api/client.js.';
      } else {
        message = error.response.data?.error || `Server Error: ${error.response.status}`;
      }
      
      alert(message);
      throw error;
    }
  };

  // ─── Register ───────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    try {
      const { data } = await authApi.register({ name, email, password });
      await saveTokens(data.accessToken, data.refreshToken);
      await SecureStore.setItemAsync('user_data', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      let message = 'An unexpected error occurred.';
      
      if (!error.response) {
        // No response from server (Network Error)
        message = 'Network error: Cannot reach the server. Please check your backend terminal to find your local IP and update it in mobile/src/api/client.js.';
      } else {
        // Server returned an error (4xx, 5xx)
        message = error.response.data?.error || `Server Error: ${error.response.status}`;
      }
      
      alert(message);
      throw error;
    }
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {}); // best-effort
      }
    } finally {
      await clearTokens();
      await SecureStore.deleteItemAsync('user_data');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access auth context.
 * Must be used inside <AuthProvider>.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
