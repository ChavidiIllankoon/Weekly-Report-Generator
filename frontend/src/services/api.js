import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle 401 (expired token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  getUsers: () => API.get('/auth/users'),
};

// Reports API
export const reportsAPI = {
  create: (data) => API.post('/reports', data),
  getMyReports: (params) => API.get('/reports/my', { params }),
  update: (id, data) => API.put(`/reports/${id}`, data),
  delete: (id) => API.delete(`/reports/${id}`),
  submit: (id) => API.patch(`/reports/submit/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: () => API.get('/projects'),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
};

// Manager API
export const managerAPI = {
  getAllReports: (params) => API.get('/manager/reports', { params }),
  getDashboard: () => API.get('/manager/dashboard'),
};

// AI API
export const aiAPI = {
  ask: (question) => API.post('/ai/ask', { question }),
};

export default API;
