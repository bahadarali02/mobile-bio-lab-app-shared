// lib/api.js
const API_BASE = '/api';

export async function fetchWithAuth(url, options = {}) {
  const apiUrl = url.startsWith('http') ? url :
                url.startsWith(API_BASE) ? url :
                `${API_BASE}/${url.replace(/^\//, '')}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      ...options,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      if (text.startsWith('<!DOCTYPE html>')) {
        throw new Error(`Endpoint not found: ${apiUrl}`);
      }
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (!response.ok) {
      const error = new Error(
        responseData.message || responseData.error || `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.url = apiUrl;
      error.data = responseData;
      throw error;
    }

    return responseData;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out:', apiUrl);
      throw new Error('Request timed out. Please try again.');
    }

    console.error('API request failed:', {
      url: apiUrl,
      message: error.message,
      status: error.status || 'Unknown',
    });

    throw error;
  }
}

// API wrapper functions
export const api = {
  // Generic methods
  get: (endpoint) => fetchWithAuth(endpoint),
  post: (endpoint, data) =>
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint) =>
    fetchWithAuth(endpoint, { method: 'DELETE' }),

  // Reservation-specific
  getReservations: (query = '') =>
    fetchWithAuth(`/reserve-slot${query ? `?${query}` : ''}`),

  createReservation: (data) =>
    fetchWithAuth('/reserve-slot', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelReservation: (id) =>
    fetchWithAuth(`/reserve-slot/${id}`, {
      method: 'DELETE',
    }),
};
export default api;