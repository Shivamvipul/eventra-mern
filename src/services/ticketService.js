import api from './api';

export const ticketService = {
  getMine: () => api.get('/tickets/mine'),
  getById: (id) => api.get(`/tickets/${id}`),
  downloadPdf: (id) => api.get(`/tickets/${id}/pdf`),
};
