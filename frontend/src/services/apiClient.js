import { API_BASE_URL } from '../utils/constants';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('pathpilot_token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.detail || `API Error: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error.status) throw error;
    console.error('API Client Error:', error);
    throw error;
  }
};
