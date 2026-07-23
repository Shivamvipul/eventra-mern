import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (formData) => api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleWishlist: (eventId) => api.post(`/users/wishlist/${eventId}`),
};
