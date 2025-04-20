import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles = ['admin'] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Use the correct API endpoint without '/api/'
        const response = await axios.get('https://backend-4bet.vercel.app/verify-auth', config);
        
        if (response.data.user && response.data.user.role) {
          setUserRole(response.data.user.role);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, []);
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Verifying authentication...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <Outlet />;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    color: '#4b5563',
  }
};

export default ProtectedRoute;