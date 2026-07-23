import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return null; // wait for the initial /auth/me check to resolve
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}
