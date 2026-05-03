const API_BASE = '/api';

const api = {
  getHeaders: (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },

  handleResponse: async (response) => {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login.html';
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    const text = await response.text();
    let result = {};
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      result = { message: text };
    }

    if (!response.ok || (result.success === false)) {
      return Promise.reject(new Error(result.message || 'An error occurred'));
    }

    return result;
  },

  get: async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      return await api.handleResponse(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  post: async (endpoint, data, isFormData = false) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: api.getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data)
      });
      return await api.handleResponse(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  put: async (endpoint, data, isFormData = false) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: api.getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data)
      });
      return await api.handleResponse(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  delete: async (endpoint, data = null) => {
    try {
      const options = {
        method: 'DELETE',
        headers: api.getHeaders()
      };
      if (data) {
        options.body = JSON.stringify(data);
      }
      const res = await fetch(`${API_BASE}${endpoint}`, options);
      return await api.handleResponse(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default api;
