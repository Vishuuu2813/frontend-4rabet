import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          },
        }
      );

      // Get users from response
      const fetchedUsers = res.data.users || [];
      
      // Debug: Log the first user to see its structure
      if (fetchedUsers.length > 0) {
        console.log("Sample user data:", fetchedUsers[0]);
      }
      
      // Sort by createdAt timestamp (oldest first)
      const sortedUsers = [...fetchedUsers].sort((a, b) => {
        // Safely parse dates
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        
        // If both are valid timestamps, compare them
        if (dateA && dateB) {
          return dateA - dateB;
        }
        return 0;
      });
      
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      // Convert ISO string to date object
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      
      // Format date to a readable string: "DD/MM/YYYY, HH:MM:SS"
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
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
    userCount: {
      marginBottom: '15px',
      color: '#555',
      fontSize: '16px',
    },
    newestRow: {
      backgroundColor: '#f0f9ff',
    },
    dateCell: {
      fontFamily: 'monospace',
      fontSize: '13px',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Details</h1>
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
                    style={index === users.length - 1 ? {...styles.newestRow} : {}}
                  >
                    <td style={styles.td}>{user.email || 'N/A'}</td>
                    <td style={styles.td}>{user.password || 'N/A'}</td>
                    <td style={styles.td}>{user.mobileNumber || 'N/A'}</td>
                    <td style={styles.td}>{user.withdrawalAmount || 'N/A'}</td>
                    <td style={styles.td}>{user.problem || 'N/A'}</td>
                    <td style={{...styles.td, ...styles.dateCell}}>
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
