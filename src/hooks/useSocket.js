import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { connectSocket, disconnectSocket } from '../services/socketService';
import { addRealtimeNotification } from '../redux/slices/notificationSlice';
import { useAuth } from './useAuth';

// Connects to Socket.IO once the user is authenticated and wires up live notification toasts
export const useSocket = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = connectSocket();

    socket.on('notification', (payload) => {
      toast(payload.message || payload.title, { icon: '🔔' });
      dispatch(addRealtimeNotification({ title: payload.title, message: payload.message, isRead: false, createdAt: new Date().toISOString() }));
    });

    return () => {
      socket.off('notification');
      disconnectSocket();
    };
  }, [isAuthenticated, dispatch]);
};
