import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, adminOnly = true }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token and get user data from the server
        const response = await axios.get('https://backend-4bet.vercel.app/api/verify-auth', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Check if user has required role
        if (adminOnly && response.data.user.role !== 'admin') {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('token');
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [token, adminOnly]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;