import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pathpilot_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('pathpilot_token', token);
    } else {
      localStorage.removeItem('pathpilot_token');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      apiClient('/auth/status')
        .then(() => {
          const stored = localStorage.getItem('pathpilot_user');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {}
          }
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName || email.split('@')[0],
      }),
    });
    const tokenData = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(tokenData.access_token);
    const userData = { email, name: fullName || email.split('@')[0] };
    setUser(userData);
    localStorage.setItem('pathpilot_user', JSON.stringify(userData));
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const newToken = data.access_token;
    setToken(newToken);

    const userData = { email, name: email.split('@')[0] };
    setUser(userData);
    localStorage.setItem('pathpilot_user', JSON.stringify(userData));

    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pathpilot_token');
    localStorage.removeItem('pathpilot_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
