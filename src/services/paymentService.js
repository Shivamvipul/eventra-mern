import api from './api';

export const paymentService = {
  createOrder: (bookingId) => api.post('/payment/create-order', { bookingId }),
  verify: (paymentId) => api.post('/payment/verify', { paymentId }),
  refund: (paymentId, reason) => api.post(`/payment/${paymentId}/refund`, { reason }),
};
