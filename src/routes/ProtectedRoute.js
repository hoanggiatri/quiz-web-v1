// routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
