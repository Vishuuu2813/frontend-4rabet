import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Get admin info
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser'));
      setAdminInfo(adminUser);
    } catch (e) {
      console.error("Error parsing admin user data");
    }
    
    fetchUsers(1);
  }, [navigate]);

  const fetchUsers = async (page = 1, limit = 10, search = searchQuery) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page,
          limit,
          sortField: 'createdAt',
          sortDirection: 'desc'
        }
      };
      
      // Add search query if provided
      if (search) {
        config.params.search = search;
      }
      
      const response = await axios.get('https://backend-4bet.vercel.app/usersdetails', config);
      
      setUsers(response.data.users);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalUsers: response.data.totalUsers
      });
      
    } catch (err) {
      console.error('Error fetching users:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        navigate('/login');
      } else {
        setError('Failed to load users data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, 10, searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            ...styles.paginationButton,
            ...(pagination.currentPage === i ? styles.activePage : {})
          }}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        {adminInfo && (
          <div style={styles.userInfo}>
            <p style={styles.welcomeText}>Welcome, {adminInfo.name}</p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>

      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by email, mobile, or problem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Users</h3>
          <p style={styles.statValue}>{pagination.totalUsers}</p>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      
      {loading ? (
        <div style={styles.loading}>Loading users data...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Mobile Number</th>
                <th style={styles.th}>Withdrawal Amount</th>
                <th style={styles.th}>Problem</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} style={styles.tr}>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.mobileNumber}</td>
                    <td style={styles.td}>{user.withdrawalAmount}</td>
                    <td style={styles.td}>{user.problem}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={styles.noData}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                style={{
                  ...styles.paginationButton,
                  ...(pagination.currentPage === 1 ? styles.disabledButton : {})
                }}
              >
                Previous
              </button>
              
              {renderPagination()}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                style={{
                  ...styles.paginationButton,
                  ...(pagination.currentPage === pagination.totalPages ? styles.disabledButton : {})
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  welcomeText: {
    margin: '0',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
  },
  searchInput: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    flexGrow: '1',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    minWidth: '150px',
  },
  statTitle: {
    margin: '0',
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '5px',
  },
  statValue: {
    margin: '0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    color: '#4b5563',
    fontSize: '14px',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px 16px',
    color: '#111827',
    fontSize: '14px',
  },
  noData: {
    textAlign: 'center',
    padding: '30px',
    color: '#6b7280',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
    padding: '15px 0',
  },
  paginationButton: {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  activePage: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6',
  },
  disabledButton: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '10px 15px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '30px',
    color: '#6b7280',
  }
};

export default AdminDashboard;