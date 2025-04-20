import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import Home from './components/Home'; // Import the Home component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} /> {/* Set Home as the root path */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Simple Unauthorized component
const Unauthorized = () => (
  <div style={{ 
    padding: '50px', 
    textAlign: 'center',
    maxWidth: '500px',
    margin: '100px auto',
    backgroundColor: '#fee2e2',
    borderRadius: '8px'
  }}>
    <h2>Unauthorized Access</h2>
    <p>You don't have permission to access this page.</p>
    <button 
      onClick={() => window.location.href = '/login'}
      style={{
        padding: '10px 20px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '20px'
      }}
    >
      Back to Login
    </button>
  </div>
);

export default App;