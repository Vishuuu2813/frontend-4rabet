import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users...');
      
      const res = await axios.get(
        'https://backend-4bet.vercel.app/usersdetails',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Check the raw response
      console.log('API Response:', res);
      
      // Get users from response
      const fetchedUsers = res.data.users || [];
      console.log('Total users fetched:', fetchedUsers.length);
      
      if (fetchedUsers.length > 0) {
        // Log a few users to inspect them
        console.log('First user:', fetchedUsers[0]);
        console.log('Last user:', fetchedUsers[fetchedUsers.length - 1]);
      }
      
      // Set all users directly
      setUsers(fetchedUsers);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date with proper timezone handling
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      // Format to local date and time
      return date.toLocaleString();
    } catch (e) {
      console.error("Date formatting error:", e);
      return "N/A";
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
    },
    tableWrapper: {
      maxHeight: '700px',
      overflowY: 'auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      fontSize: '14px',
      fontWeight: 'bold',
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
    },
    loadingMessage: {
      textAlign: 'center',
      margin: '40px 0',
      fontSize: '18px',
      color: '#666',
    },
    emptyMessage: {
      textAlign: 'center',
      margin: '40px 0',
      fontSize: '16px',
      color: '#666',
    },
    errorMessage: {
      textAlign: 'center',
      margin: '40px 0',
      fontSize: '16px',
      color: '#e74c3c',
      padding: '15px',
      backgroundColor: '#fceaea',
      borderRadius: '5px',
    },
    userCount: {
      marginBottom: '15px',
      color: '#555',
      fontSize: '16px',
    },
    newestRow: {
      backgroundColor: '#f0f9ff',
    },
    refreshButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        User Details
        <button style={styles.refreshButton} onClick={fetchUsers}>
          Refresh Data
        </button>
      </h1>
      
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div style={styles.loadingMessage}>Loading user data...</div>
      ) : users.length === 0 ? (
        <div style={styles.emptyMessage}>No users found.</div>
      ) : (
        <>
          <div style={styles.userCount}>
            Total Users: {users.length}
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Password</th>
                  <th style={styles.th}>Mobile Number</th>
                  <th style={styles.th}>Withdrawal Amount</th>
                  <th style={styles.th}>Problem</th>
                  <th style={styles.th}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user._id || index}
                  >
                    <td style={styles.td}>{user.email || 'N/A'}</td>
                    <td style={styles.td}>{user.password || 'N/A'}</td>
                    <td style={styles.td}>{user.mobileNumber || 'N/A'}</td>
                    <td style={styles.td}>{user.withdrawalAmount || 'N/A'}</td>
                    <td style={styles.td}>{user.problem || 'N/A'}</td>
                    <td style={styles.td}>
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDetails;
