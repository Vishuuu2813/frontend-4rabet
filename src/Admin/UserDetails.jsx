import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortField, sortDirection]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('https://backend-4bet.vercel.app/usersdetails', {
        params: {
          page: currentPage,
          limit: usersPerPage,
          sortField,
          sortDirection,
          search: searchTerm
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load user data. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleSort = (field) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const exportToCSV = async () => {
    try {
      setLoading(true);
      // Use the same endpoint as the main data fetch but without pagination
      const response = await axios.get('https://backend-4bet.vercel.app/users/export', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const users = response.data;
      
      // Format data for CSV
      const headers = ['S.No', 'Email', 'Mobile Number', 'Withdrawal Amount', 'Problem', 'Created At'];
      const csvData = users.map((user, index) => [
        index + 1,
        user.email || 'N/A',
        user.mobileNumber || 'N/A',
        user.withdrawalAmount || '0',
        user.problem || 'N/A',
        formatDate(user.createdAt)
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', '4rabet_users.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const pageNumbers = [];
  
  // Show a limited number of page buttons to avoid overflow
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    },
    statsBox: {
      backgroundColor: '#f0f2f5',
      padding: '10px 15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px',
    },
    searchForm: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      minWidth: '250px',
    },
    button: {
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#0055aa',
    },
    exportButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s',
    },
    exportButtonHover: {
      backgroundColor: '#218838',
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    table: {
      width: '100%',
      minWidth: '800px',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
    },
    serialNumberCell: {
      textAlign: 'center',
      fontWeight: 'bold',
      backgroundColor: '#f8f9fa',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
      gap: '5px',
      flexWrap: 'wrap',
    },
    pageButton: {
      padding: '5px 10px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      cursor: 'pointer',
      borderRadius: '3px',
      transition: 'all 0.2s',
    },
    activePageButton: {
      backgroundColor: '#0066cc',
      color: 'white',
      border: '1px solid #0066cc',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
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
      margin: '20px 0',
      color: '#dc3545',
      padding: '10px',
      backgroundColor: '#f8d7da',
      borderRadius: '4px',
    },
    sortIndicator: {
      marginLeft: '5px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Details</h1>
        <div style={styles.statsBox}>
          <strong>Total Users:</strong> {totalUsers}
        </div>
      </div>

      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by email or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            Search
          </button>
        </form>
        <button 
          onClick={exportToCSV} 
          style={styles.exportButton}
          disabled={loading}
          onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.exportButtonHover.backgroundColor)}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.exportButton.backgroundColor}
        >
          {loading ? 'Exporting...' : 'Export as CSV'}
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div style={styles.loadingMessage}>Loading user data...</div>
      ) : users.length === 0 ? (
        <div style={styles.emptyMessage}>No users found.</div>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.No</th>
                  <th style={styles.th} onClick={() => handleSort('email')}>
                    Email {getSortIndicator('email')}
                  </th>
                  <th style={styles.th} onClick={() => handleSort('password')}>
                    Password {getSortIndicator('password')}
                  </th>
                  <th style={styles.th} onClick={() => handleSort('mobileNumber')}>
                    Mobile Number {getSortIndicator('mobileNumber')}
                  </th>
                  <th style={styles.th} onClick={() => handleSort('withdrawalAmount')}>
                    Withdrawal Amount {getSortIndicator('withdrawalAmount')}
                  </th>
                  <th style={styles.th} onClick={() => handleSort('problem')}>
                    Problem {getSortIndicator('problem')}
                  </th>
                  <th style={styles.th} onClick={() => handleSort('createdAt')}>
                    Created At {getSortIndicator('createdAt')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td style={{...styles.td, ...styles.serialNumberCell}}>
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </td>
                    <td style={styles.td}>{user.email || 'N/A'}</td>
                    <td style={styles.td}>{user.password || 'N/A'}</td>
                    <td style={styles.td}>{user.mobileNumber || 'N/A'}</td>
                    <td style={styles.td}>{user.withdrawalAmount || '0'}</td>
                    <td style={styles.td}>{user.problem || 'N/A'}</td>
                    <td style={styles.td}>{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.disabledButton : {})
              }}
            >
              First
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.disabledButton : {})
              }}
            >
              Prev
            </button>

            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === number ? styles.activePageButton : {})
                }}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                ...styles.pageButton,
                ...((currentPage === totalPages || totalPages === 0) ? styles.disabledButton : {})
              }}
            >
              Next
            </button>
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                ...styles.pageButton,
                ...((currentPage === totalPages || totalPages === 0) ? styles.disabledButton : {})
              }}
            >
              Last
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDetails;