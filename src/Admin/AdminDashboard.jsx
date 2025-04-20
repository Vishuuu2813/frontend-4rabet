import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://backend-4bet.vercel.app/admin-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://backend-4bet.vercel.app/update-password',
        {
          currentPassword,
          newPassword
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setPasswordMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Failed to update password');
    }
  };

  const navigateToUserDetails = () => {
    navigate('/user-details');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Mobile menu button */}
      <button 
        style={styles.menuButton} 
        onClick={toggleSidebar}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>Admin Panel</h3>
          <button 
            style={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={styles.userDetails}>
            <p style={styles.userName}>{user?.name || 'Admin'}</p>
            <p style={styles.userEmail}>{user?.email || 'admin@example.com'}</p>
          </div>
        </div>

        <nav style={styles.nav}>
          <button 
            style={{
              ...styles.navButton,
              backgroundColor: activeTab === 'dashboard' ? '#2563eb' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : '#1f2937'
            }}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            style={{
              ...styles.navButton,
              backgroundColor: activeTab === 'userDetails' ? '#2563eb' : 'transparent',
              color: activeTab === 'userDetails' ? 'white' : '#1f2937'
            }}
            onClick={navigateToUserDetails}
          >
            User Details
          </button>
    
     
        </nav>

        <button 
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        {activeTab === 'dashboard' && (
          <div style={styles.dashboard}>
            <h1 style={styles.dashboardTitle}>Welcome to Admin Dashboard 👋</h1>
          
          </div>
        )}

        {activeTab === 'password' && (
          <div style={styles.dashboard}>
            <h1 style={styles.dashboardTitle}>Change Password</h1>
            <div style={styles.passwordForm}>
              {passwordMessage && (
                <p style={{
                  ...styles.message,
                  color: passwordMessage.includes('successfully') ? '#16a34a' : '#dc2626'
                }}>
                  {passwordMessage}
                </p>
              )}
              <form onSubmit={updatePassword}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Current Password</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    style={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" style={styles.saveButton}>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={styles.dashboard}>
            <h1 style={styles.dashboardTitle}>Settings</h1>
            <div style={styles.settingsContent}>
              <p>Settings page content will go here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal CSS
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  menuButton: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 100,
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '@media (min-width: 768px)': {
      display: 'none',
    }
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
    transition: 'transform 0.3s ease',
    overflowY: 'auto',
    '@media (max-width: 768px)': {
      width: '240px'
    }
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  closeSidebar: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    fontSize: '18px',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'block',
    }
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '20px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  userDetails: {
    overflow: 'hidden',
  },
  userName: {
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    fontSize: '16px',
    color: '#1f2937',
  },
  userEmail: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    textOverflow: 'ellipsis',
    overflow: 'hidden', 
    whiteSpace: 'nowrap',
    maxWidth: '180px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  navButton: {
    border: 'none',
    textAlign: 'left',
    padding: '12px 15px',
    margin: '2px 0',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  logoutButton: {
    marginTop: 'auto',
    padding: '12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  content: {
    flex: 1,
    padding: '20px',
    paddingLeft: '300px',
    backgroundColor: '#f9fafb',
    '@media (max-width: 768px)': {
      paddingLeft: '20px',
    }
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  dashboardTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#1f2937',
  },
  dashboardContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    }
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  statsNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb',
    margin: '10px 0 0 0',
  },
  passwordForm: {
    maxWidth: '500px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    fontSize: '16px',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '10px',
  },
  message: {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  settingsContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  }
};

export default AdminDashboard;