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

      const fetchedUsers = res.data.users || [];
      console.log('Total users fetched:', fetchedUsers.length);
      
      // Sort by createdAt timestamp (oldest first)
      const sortedUsers = [...fetchedUsers].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : null;
        const dateB = b.createdAt ? new Date(b.createdAt) : null;
        
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
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
    userItem: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9',
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
          {users.map((user, index) => (
            <div key={user._id || index} style={styles.userItem}>
              <p>Email: {user.email || 'N/A'}</p>
              <p>Password: {user.password || 'N/A'}</p>
              <p>Mobile Number: {user.mobileNumber || 'N/A'}</p>
              <p>Withdrawal Amount: {user.withdrawalAmount || 'N/A'}</p>
              <p>Problem: {user.problem || 'N/A'}</p>
              <p>Created At: {formatDate(user.createdAt)}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default UserDetails;
