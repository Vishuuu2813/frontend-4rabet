import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawMongoData, setRawMongoData] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // This function will fetch MongoDB data exactly as stored
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Make the API call with a special parameter to get raw MongoDB format
      const res = await axios.get(
        'https://backend-4bet.vercel.app/usersdetails?format=raw&limit=1000',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      console.log('API Response data:', res.data);

      // Store the raw response for display
      setRawMongoData(JSON.stringify(res.data, null, 2));
      
      let fetchedUsers = [];
      if (res.data && res.data.users) {
        fetchedUsers = res.data.users;
      }

      console.log('Total users fetched:', fetchedUsers.length);
      setUsers(fetchedUsers);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      
      return date.toLocaleString(); // Simple date format
    } catch (e) {
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
      justifyContent: 'space-between',
    },
    tableContainer: {
      marginTop: '20px',
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
    viewButtons: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    },
    viewButton: {
      padding: '8px 16px',
      backgroundColor: '#2980b9',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'normal',
    },
    activeButton: {
      backgroundColor: '#1c638d',
    },
    rawDataContainer: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      border: '1px solid #ddd',
      overflow: 'auto',
      height: '650px',
      whiteSpace: 'pre-wrap',
      fontFamily: 'monospace',
      fontSize: '14px',
    },
    serialNumber: {
      textAlign: 'center',
      fontWeight: 'bold',
    }
  };

  // State for view toggle
  const [view, setView] = useState('table'); // 'table' or 'raw'

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span>User Details</span>
        <button 
          style={styles.refreshButton} 
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
      
      <div style={styles.viewButtons}>
        <button 
          style={{
            ...styles.viewButton,
            ...(view === 'table' ? styles.activeButton : {})
          }}
          onClick={() => setView('table')}
        >
          Table View
        </button>
        <button 
          style={{
            ...styles.viewButton,
            ...(view === 'raw' ? styles.activeButton : {})
          }}
          onClick={() => setView('raw')}
        >
          MongoDB Raw Format
        </button>
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
          
          {view === 'table' ? (
            <div style={styles.tableContainer}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.th, width: '60px'}}>S.No</th>
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
                        <td style={{...styles.td, ...styles.serialNumber}}>{index + 1}</td>
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
            </div>
          ) : (
            <div style={styles.rawDataContainer}>
              {rawMongoData || "No raw data available"}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserDetails;
