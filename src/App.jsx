import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes.jsx';
import { fetchCurrentUser } from './redux/slices/authSlice.js';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <AppRoutes />;
}
