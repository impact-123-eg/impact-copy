import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
 const { isAuthenticated } = useAuth();

 if (!isAuthenticated) {
  return <Navigate to="/dash/login" />;
 }

 return element;
};

export default ProtectedRoute;