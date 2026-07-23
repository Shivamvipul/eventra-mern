import api from './api';

export const analyticsService = {
  registrationTrends: (params) => api.get('/analytics/registration-trends', { params }),
  attendanceRatio: (params) => api.get('/analytics/attendance-ratio', { params }),
  popularCategories: (params) => api.get('/analytics/popular-categories', { params }),
  peakRegistrationTimings: (params) => api.get('/analytics/peak-registration-timings', { params }),
};
