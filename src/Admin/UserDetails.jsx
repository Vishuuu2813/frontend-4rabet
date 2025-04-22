import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token missing. Please login again.");
        setLoading(false);
        return;
      }
      
      const res = await axios.get('https://backend-4rabet.vercel.app/allusers', {
        params: {
          search: searchTerm || ""
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("API Response:", res.data);
      
      if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error('Unexpected response format:', res.data);
        setError("Received unexpected data format from server");
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error.response || error);
      setError(error.response?.data?.message || error.message || "Failed to fetch users");
      setUsers([]);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const refreshData = () => {
    setSearchTerm('');
    fetchUsers();
  };

  const exportToCSV = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token missing. Please login again.");
      return;
    }
    
    axios.get('https://backend-4rabet.vercel.app/users/export', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      let users = [];
      if (Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        users = response.data.users;
      } else {
        throw new Error("Unexpected data format");
      }
      
      if (users.length === 0) {
        setError("No data to export");
        return;
      }
      
      const headers = ['Email', 'Mobile Number', 'Withdrawal Amount', 'Problem'];
      const csvData = users.map(user => [
        user.email || '',
        user.mobileNumber || '',
        user.withdrawalAmount || '',
        user.problem || ''
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', '4rabet_users.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error('Error exporting data:', error);
      setError("Failed to export data: " + (error.message || "Unknown error"));
    });
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#000',
      margin: '0'
    },
    statsBox: {
      fontSize: '16px',
      fontWeight: 'bold'
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    searchForm: {
      display: 'flex',
      gap: '10px'
    },
    searchInput: {
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      width: '300px'
    },
    button: {
      backgroundColor: '#333',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    exportButton: {
      marginLeft: '10px'
    },
    tableContainer: {
      maxHeight: '600px',
      overflowY: 'auto',
      border: '1px solid #eee',
      borderRadius: '4px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      fontWeight: 'bold',
      position: 'sticky',
      top: 0
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      fontSize: '14px'
    },
    message: {
      textAlign: 'center',
      margin: '40px 0',
      fontSize: '16px',
      color: '#666'
    },
    errorMessage: {
      textAlign: 'center',
      margin: '20px 0',
      padding: '10px',
      backgroundColor: '#ffebee',
      color: '#c62828',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management Dashboard</h1>
        <div style={styles.statsBox}>
          Total Users: {users.length}
        </div>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          Error: {error}
        </div>
      )}

      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by email, mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.button}>Search</button>
        </form>
        <div>
          <button onClick={refreshData} style={styles.button}>
            Refresh Data
          </button>
          <button 
            onClick={exportToCSV} 
            style={{...styles.button, ...styles.exportButton}}
          >
            Export as CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.message}>Loading user data...</div>
      ) : users.length === 0 ? (
        <div style={styles.message}>No users found.</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Mobile Number</th>
                <th style={styles.th}>Withdrawal Amount</th>
                <th style={styles.th}>Problem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id || index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.password}</td>
                  <td style={styles.td}>{user.mobileNumber}</td>
                  <td style={styles.td}>{user.withdrawalAmount}</td>
                  <td style={styles.td}>{user.problem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
