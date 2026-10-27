// API Base URL config
// If VITE_API_URL is provided in .env use it, otherwise fall back to relative /api handled by Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('stm_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Build clean URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = API_BASE_URL.endsWith('/')
    ? `${API_BASE_URL.slice(0, -1)}${cleanEndpoint}`
    : `${API_BASE_URL}${cleanEndpoint}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError) {
    // Distinguish network/server down from application error responses
    const error = new Error('Cannot connect to the server. Please check your backend connection.');
    error.isNetworkError = true;
    error.originalError = networkError;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
