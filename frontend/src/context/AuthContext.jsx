import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient, getToken, getStoredUser, setToken, setStoredUser } from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getStoredUser);
  const [token, setTokenState] = useState(getToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyAuth = useCallback(({ access_token, user: userData }) => {
    setToken(access_token);
    setStoredUser(userData);
    setTokenState(access_token);
    setUserState(userData);
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setTokenState(null);
    setUserState(null);
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setError(null);
    try {
      const created = await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name: name }),
      });
      const loginRes = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const me = created.full_name
        ? { ...created, name: created.full_name }
        : { id: created.id, email: created.email, name };
      applyAuth({ access_token: loginRes.access_token, user: me });
      return me;
    } catch (err) {
      setError(err.detail || err.message);
      throw err;
    }
  }, [applyAuth]);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const loginRes = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const me = await apiClient('/auth/me', {
        headers: { Authorization: `Bearer ${loginRes.access_token}` },
      });
      const userData = { id: me.id, email: me.email, name: me.full_name || me.email };
      applyAuth({ access_token: loginRes.access_token, user: userData });
      return userData;
    } catch (err) {
      setError(err.detail || err.message);
      throw err;
    }
  }, [applyAuth]);

  const fetchMe = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return null;
    }
    try {
      const me = await apiClient('/auth/me');
      const userData = { id: me.id, email: me.email, name: me.full_name || me.email };
      setStoredUser(userData);
      setUserState(userData);
      return userData;
    } catch (err) {
      clearAuth();
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  useEffect(() => {
    const handleUnauthorized = () => clearAuth();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [clearAuth]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: !!token && !!user,
      register,
      login,
      logout,
      fetchMe,
    }),
    [user, token, loading, error, register, login, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
