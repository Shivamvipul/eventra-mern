import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import bookingReducer from './slices/bookingSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    bookings: bookingReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
});
