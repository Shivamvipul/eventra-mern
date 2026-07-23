import api from './api';

export const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  getPendingOrganizers: () => api.get('/admin/organizers/pending'),
  approveOrganizer: (id, approve) => api.patch(`/admin/organizers/${id}/approve`, { approve }),
  getPendingEvents: () => api.get('/admin/events/pending'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  getActivityLogs: () => api.get('/admin/activity-logs'),
  getUsers: (params) => api.get('/users', { params }),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload),
  getCategories: () => api.get('/categories'),
  createCategory: (payload) => api.post('/categories', payload),
};
