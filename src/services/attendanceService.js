import api from './api';

export const attendanceService = {
  scan: (qrCodeData) => api.post('/attendance/scan', { qrCodeData }),
  getLogs: (eventId) => api.get('/attendance', { params: { eventId } }),
};
