import api from './api';

export const reportService = {
  generate: (type, format, eventId) => api.get('/reports', { params: { type, format, eventId } }),
};
