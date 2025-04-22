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
  const [isExporting, setIsExporting] = useState(false);

  // Fetch users when any of these values change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortField, sortDirection, searchTerm]);

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

  // Changed to handle input change directly instead of form submission
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSort = (field) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sort changes
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
      setIsExporting(true);
      // Export all users with the current search filters and sorting
      const response = await axios.get('https://backend-4bet.vercel.app/users/export', {
        params: {
          search: searchTerm,
          sortField,
          sortDirection
        },
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
      setIsExporting(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
      setIsExporting(false);
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
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      borderBottom: '2px solid #f0f2f5',
      paddingBottom: '16px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1a1a1a',
      margin: '0',
    },
    statsBox: {
      backgroundColor: '#e6f7ff',
      padding: '12px 18px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #91d5ff',
      fontWeight: '500',
      color: '#0050b3',
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    searchForm: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      flex: '1',
    },
    input: {
      padding: '10px 14px',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      fontSize: '14px',
      minWidth: '300px',
      flex: '1',
      transition: 'all 0.3s',
      '&:focus': {
        borderColor: '#40a9ff',
        boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)',
        outline: 'none',
      },
    },
    button: {
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    buttonHover: {
      backgroundColor: '#096dd9',
    },
    exportButton: {
      backgroundColor: '#52c41a',
      color: 'white',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    exportButtonHover: {
      backgroundColor: '#389e0d',
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff',
    },
    table: {
      width: '100%',
      minWidth: '900px',
      borderCollapse: 'separate',
      borderSpacing: '0',
      marginBottom: '20px',
    },
    th: {
      backgroundColor: '#fafafa',
      padding: '14px 16px',
      textAlign: 'left',
      borderBottom: '2px solid #f0f0f0',
      fontSize: '14px',
      fontWeight: '600',
      color: '#262626',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.3s',
      position: 'sticky',
      top: '0',
      zIndex: '1',
    },
    thHover: {
      backgroundColor: '#f0f0f0',
    },
    td: {
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      fontSize: '14px',
      color: '#262626',
      verticalAlign: 'middle',
    },
    serialNumberCell: {
      textAlign: 'center',
      fontWeight: '500',
      backgroundColor: '#fafafa',
      width: '60px',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '24px',
      gap: '6px',
      flexWrap: 'wrap',
    },
    pageButton: {
      padding: '6px 12px',
      border: '1px solid #d9d9d9',
      backgroundColor: '#fff',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.3s',
      fontSize: '14px',
      fontWeight: '500',
      color: '#262626',
    },
    pageButtonHover: {
      borderColor: '#1890ff',
      color: '#1890ff',
    },
    activePageButton: {
      backgroundColor: '#1890ff',
      color: 'white',
      border: '1px solid #1890ff',
    },
    disabledButton: {
      opacity: '0.5',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    loadingMessage: {
      textAlign: 'center',
      margin: '60px 0',
      fontSize: '16px',
      color: '#595959',
    },
    emptyMessage: {
      textAlign: 'center',
      margin: '60px 0',
      fontSize: '16px',
      color: '#595959',
    },
    errorMessage: {
      textAlign: 'center',
      margin: '20px 0',
      color: '#ff4d4f',
      padding: '12px 16px',
      backgroundColor: '#fff1f0',
      borderRadius: '6px',
      border: '1px solid #ffccc7',
    },
    sortIndicator: {
      marginLeft: '5px',
      fontWeight: 'bold',
    },
    alternateRow: {
      backgroundColor: '#fafafa',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '50%',
      borderTopColor: '#fff',
      animation: 'spin 1s ease-in-out infinite',
      marginRight: '8px',
    },
    highlight: {
      backgroundColor: '#fff7e6',
      transition: 'background-color 0.3s',
    },
    searchHighlight: {
      backgroundColor: '#ffffb8',
      padding: '2px 0',
    },
  };

  // Function to highlight search terms in content
  const highlightSearchTerm = (content, term) => {
    if (!term || !content) return content;
    
    try {
      const regex = new RegExp(`(${term})`, 'gi');
      return content.replace(regex, `<span style="background-color: #ffffb8;">$1</span>`);
    } catch (e) {
      return content;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management Dashboard</h1>
        <div style={styles.statsBox}>
          <strong>Total Users:</strong> {totalUsers}
        </div>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by email, mobile number or problem description..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.input}
          />
          {/* Search button removed - search now happens in real-time */}
        </div>
        <button 
          onClick={exportToCSV} 
          style={styles.exportButton}
          disabled={isExporting || loading}
          onMouseOver={(e) => !isExporting && !loading && (e.currentTarget.style.backgroundColor = styles.exportButtonHover.backgroundColor)}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.exportButton.backgroundColor}
        >
          {isExporting ? (
            <>
              <span style={styles.loadingSpinner}></span>
              Exporting...
            </>
          ) : (
            'Export as CSV'
          )}
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div style={styles.loadingMessage}>
          <div style={{...styles.loadingSpinner, width: '24px', height: '24px', borderWidth: '3px', marginRight: '12px'}}></div>
          Loading user data...
        </div>
      ) : users.length === 0 ? (
        <div style={styles.emptyMessage}>No users found matching your criteria.</div>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.No</th>
                  <th 
                    style={styles.th} 
                    onClick={() => handleSort('email')}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.thHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.th.backgroundColor}
                  >
                    Email {getSortIndicator('email') && <span style={styles.sortIndicator}>{getSortIndicator('email')}</span>}
                  </th>
                  <th 
                    style={styles.th} 
                    onClick={() => handleSort('password')}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.thHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.th.backgroundColor}
                  >
                    Password {getSortIndicator('password') && <span style={styles.sortIndicator}>{getSortIndicator('password')}</span>}
                  </th>
                  <th 
                    style={styles.th} 
                    onClick={() => handleSort('mobileNumber')}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.thHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.th.backgroundColor}
                  >
                    Mobile Number {getSortIndicator('mobileNumber') && <span style={styles.sortIndicator}>{getSortIndicator('mobileNumber')}</span>}
                  </th>
                  <th 
                    style={styles.th} 
                    onClick={() => handleSort('withdrawalAmount')}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.thHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.th.backgroundColor}
                  >
                    Withdrawal Amount {getSortIndicator('withdrawalAmount') && <span style={styles.sortIndicator}>{getSortIndicator('withdrawalAmount')}</span>}
                  </th>
                  <th 
                    style={styles.th} 
                    onClick={() => handleSort('problem')}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.thHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.th.backgroundColor}
                  >
                    Problem {getSortIndicator('problem') && <span style={styles.sortIndicator}>{getSortIndicator('problem')}</span>}
                  </th>
                  <th 
                    style={styles.th} 
                    onClick={() => handleSort('createdAt')}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.thHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.th.backgroundColor}
                  >
                    Created At {getSortIndicator('createdAt') && <span style={styles.sortIndicator}>{getSortIndicator('createdAt')}</span>}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user._id} 
                    style={index % 2 === 1 ? styles.alternateRow : {}}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.highlight.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 1 ? styles.alternateRow.backgroundColor : ''}
                  >
                    <td style={{...styles.td, ...styles.serialNumberCell}}>
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </td>
                    <td style={styles.td} dangerouslySetInnerHTML={{ 
                      __html: highlightSearchTerm(user.email || 'N/A', searchTerm) 
                    }}></td>
                    <td style={styles.td}>{user.password || '••••••'}</td>
                    <td style={styles.td} dangerouslySetInnerHTML={{ 
                      __html: highlightSearchTerm(user.mobileNumber || 'N/A', searchTerm) 
                    }}></td>
                    <td style={styles.td}>{user.withdrawalAmount || '0'}</td>
                    <td style={styles.td} dangerouslySetInnerHTML={{ 
                      __html: highlightSearchTerm(user.problem || 'N/A', searchTerm) 
                    }}></td>
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
              onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.pageButtonHover.backgroundColor)}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.pageButton.backgroundColor}
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
              onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.pageButtonHover.backgroundColor)}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.pageButton.backgroundColor}
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
                onMouseOver={(e) => currentPage !== number && (e.currentTarget.style.backgroundColor = styles.pageButtonHover.backgroundColor)}
                onMouseOut={(e) => currentPage !== number && (e.currentTarget.style.backgroundColor = styles.pageButton.backgroundColor)}
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
              onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.pageButtonHover.backgroundColor)}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.pageButton.backgroundColor}
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
              onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = styles.pageButtonHover.backgroundColor)}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.pageButton.backgroundColor}
            >
              Last
            </button>
          </div>
        </>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default UserDetails;
