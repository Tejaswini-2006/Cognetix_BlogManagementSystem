const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper for making API requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status: ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  auth: {
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    getMe: () => request('/auth/me')
  },
  posts: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);
      if (params.category && params.category !== 'All')
        searchParams.append('category', params.category);
      if (params.search) searchParams.append('search', params.search);

      const qs = searchParams.toString();
      return request(`/posts${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => request(`/posts/${id}`),
    create: (postData) =>
      request('/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      }),
    update: (id, postData) =>
      request(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData)
      }),
    delete: (id) =>
      request(`/posts/${id}`, {
        method: 'DELETE'
      }),
    getMine: (params = {}) => {
      const searchParams = new URLSearchParams();
      if (params.category && params.category !== 'All')
        searchParams.append('category', params.category);
      if (params.search) searchParams.append('search', params.search);

      const qs = searchParams.toString();
      return request(`/posts/mine${qs ? `?${qs}` : ''}`);
    },
    getCategories: () => request('/posts/categories')
  }
};

export default api;
