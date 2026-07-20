const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Reusable core request helper that handles environment URLs and auth headers
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid/expired - clear local memory to trigger auth redirect
      localStorage.removeItem('token');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  // Return json payload or true if status is empty but successful
  if (response.status === 204) return true;
  return response.json();
}

// Named API services wrapping clean endpoints
export const api = {
  auth: {
    login: (email, password) => 
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    verify: () => 
      request('/auth/verify', { method: 'GET' }),
  },
  dashboard: {
    getMetrics: () => request('/dashboard/metrics', { method: 'GET' }),
  },
  assignments: {
    getAll: () => request('/assignments', { method: 'GET' }),
  },
  purchases: {
    getAll: () => request('/purchases', { method: 'GET' }),
  },
  transfers: {
    getAll: () => request('/transfers', { method: 'GET' }),
  },
};