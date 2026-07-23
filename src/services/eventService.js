import api from './api';

export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getFeatured: () => api.get('/events/featured'),
  getById: (id) => api.get(`/events/${id}`),
  getMine: () => api.get('/events/mine'),
  create: (formData) => api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/events/${id}`),
  setStatus: (id, status) => api.patch(`/events/${id}/status`, { status }),
  approve: (id) => api.patch(`/events/${id}/approve`),
};
