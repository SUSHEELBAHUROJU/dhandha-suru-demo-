import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/login/', credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  logout: async () => {
    await api.post('/logout/');
  }
};

export const profile = {
  get: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },
  update: async (data: any) => {
    const response = await api.put('/profile/', data);
    return response.data;
  }
};

export const retailers = {
  getAll: async () => {
    const response = await api.get('/retailers/');
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/retailers/search/?q=${query}`);
    return response.data;
  }
};

export const dues = {
  getAll: async () => {
    const response = await api.get('/dues/');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/dues/', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/dues/${id}/`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/dues/${id}/`);
    return response.data;
  }
};

export const transactions = {
  getAll: async () => {
    const response = await api.get('/transactions/');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/transactions/', data);
    return response.data;
  }
};

export default api;