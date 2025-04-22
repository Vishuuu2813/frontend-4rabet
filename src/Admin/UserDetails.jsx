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
      
      const res = await axios.get(
        'https://backend-4bet.vercel.app/usersdetails',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      // Log the raw API response to inspect the data structure
      console.log('API Response data:', res.data);
      
      // Get the users array from the response
      let fetchedUsers = [];
      if (res.data && res.data.users) {
        fetchedUsers = res.data.users;
        console.log('First user in response:', fetchedUsers[0]);
      }
      
      console.log('Total users fetched:', fetchedUsers.length);
      
      // Make sure we properly handle the data that's coming from the API
      setUsers(fetchedUsers);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Improved date formatter that handles different date formats
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      // Handle different date formats that might come from the API
      let date;
      
      // Check if it's an ISO string
      if (typeof dateString === 'string') {
        date = new Date(dateString);
      } 
      // Check if it's a timestamp
      else if (typeof dateString === 'number') {
        date = new Date(dateString);
      }
      // Handle MongoDB ObjectID timestamp extraction
      else if (dateString._id && dateString._id.$oid) {
        // Extract timestamp from MongoDB ObjectID
        const timestamp = parseInt(dateString._id.$oid.substring(0, 8), 16) * 1000;
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        console.log("Invalid date for:", dateString);
        return "Invalid date";
      }
      
      // Format to readable date and time
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Date formatting error:", e, "for date:", dateString);
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
      display: 'flex',
      alignItems: 'center',
    },
    tableWrapper: {
      height: '650px',
      overflowY: 'auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
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
      zIndex: 10,
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
      wordBreak: 'break-word',
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
      fontWeight: 'bold',
    },
    refreshButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px',
      fontWeight: 'normal',
    },
    debug: {
      padding: '10px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      marginBottom: '10px',
      fontSize: '12px',
      whiteSpace: 'pre-wrap',
      display: 'none' // Set to 'block' to see debug info
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        User Details
        <button 
          style={styles.refreshButton} 
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </h1>
      
      {/* Debug information - hidden by default */}
      <div style={styles.debug}>
        API returned {users.length} users
        {users.length > 0 && (
          <pre>
            {JSON.stringify(users[0], null, 2)}
          </pre>
        )}
      </div>
      
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
                  <tr key={user._id || index}>
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
