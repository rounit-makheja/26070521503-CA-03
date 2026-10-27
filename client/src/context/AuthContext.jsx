import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('stm_token'));
  const [loading, setLoading] = useState(true);

  // Validate existing token on boot
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('stm_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest('/auth/me');
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('[Auth] Session expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('stm_token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('stm_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
