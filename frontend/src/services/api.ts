import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string, phone: string) =>
    api.post('/auth/register', { email, password, name, phone }),
};

// Fields API
export const fieldsAPI = {
  getAll: () => api.get('/fields'),
  getById: (id: number) => api.get(`/fields/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (booking: {
    fieldId: number;
    bookingDate: string;
    startTime: string;
    duration: number;
    notes?: string;
  }) => api.post('/bookings', booking),
  getByField: (fieldId: number, date: string) =>
    api.get(`/bookings/field/${fieldId}?date=${date}`),
  getUserBookings: () => api.get('/bookings/my-bookings'),
  getAll: () => api.get('/bookings'),
};

export default api;
