import api from './api';

export const bookingService = {
  create: (payload) => api.post('/bookings', payload),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.delete(`/bookings/${id}`),
};
