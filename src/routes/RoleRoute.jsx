import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Usage: <RoleRoute roles={['organizer', 'super_admin']}>...</RoleRoute>
export default function RoleRoute({ roles, children }) {
  const { role } = useAuth();
  if (!roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}
