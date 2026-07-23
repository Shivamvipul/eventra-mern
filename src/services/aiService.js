import api from './api';

export const aiService = {
  getRecommendations: () => api.get('/ai/recommendations'),
  generateDescription: (payload) => api.post('/ai/generate-description', payload),
  chat: (message) => api.post('/ai/chat', { message }),
  predictAttendance: (eventId) => api.get(`/ai/predict-attendance/${eventId}`),
  predictDemand: (eventId) => api.get(`/ai/predict-demand/${eventId}`),
};
