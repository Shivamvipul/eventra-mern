import api from './api';

export const feedbackService = {
  create: (payload) => api.post('/feedback', payload),
  getForEvent: (eventId) => api.get('/feedback', { params: { eventId } }),
  reply: (id, reply) => api.put(`/feedback/${id}/reply`, { reply }),
};
