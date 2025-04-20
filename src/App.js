import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import AdminDashboard from "./Admin/AdminDashboard";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import UserDetails from "./Admin/UserDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
         <Route 
          path="/user-details" 
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }/>
      </Routes>
    </Router>
  );
}

export default App;
