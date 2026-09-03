import { API_BASE_URL } from '../utils/constants';

// A lightweight wrapper around fetch for standardized API calls
export const apiClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Uncomment when adding real auth
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
};
