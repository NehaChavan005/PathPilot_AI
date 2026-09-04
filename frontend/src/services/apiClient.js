import { API_BASE_URL } from '../utils/constants';

export const TOKEN_KEY = 'pathpilot_token';
export const USER_KEY = 'pathpilot_user';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function setStoredUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Request failed (${status})`);
    this.status = status;
    this.detail = detail;
  }
}

// A lightweight wrapper around fetch for standardized API calls.
// Attaches the JWT bearer token automatically and parses error bodies.
export const apiClient = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new ApiError(0, 'Unable to reach the server. Please check your connection.');
  }

  if (response.status === 401 || response.status === 403) {
    setToken(null);
    setStoredUser(null);
    try {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    } catch {}
  }

  let body = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const detail =
      (body && (body.detail || body.message)) ||
      response.statusText ||
      `Request failed (${response.status})`;
    throw new ApiError(response.status, detail);
  }

  return body;
};
