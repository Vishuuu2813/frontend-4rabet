import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://backend-4rabet.vercel.app/usersdetails', {
        params: {
          page: currentPage,
          limit: usersPerPage,
          search: searchTerm
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Make sure we're getting users from the response
      if (res.data && res.data.users) {
        setUsers(res.data.users);
        setTotalUsers(res.data.totalUsers || res.data.users.length);
      } else {
        console.error('Unexpected response format:', res.data);
        setUsers([]);
        setTotalUsers(0);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const refreshData = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const exportToCSV = () => {
    // Get all users for export
    axios.get('https://backend-4rabet.vercel.app/users/export', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const users = response.data;
      
      // Format data for CSV
      const headers = ['Email', 'Mobile Number', 'Withdrawal Amount', 'Problem'];
      const csvData = users.map(user => [
        user.email,
        user.mobileNumber,
        user.withdrawalAmount,
        user.problem
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
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px'
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      fontSize: '14px'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
      gap: '5px'
    },
    pageButton: {
      padding: '5px 10px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      cursor: 'pointer'
    },
    activePageButton: {
      backgroundColor: '#333',
      color: 'white',
      border: '1px solid #333'
    },
    message: {
      textAlign: 'center',
      margin: '40px 0',
      fontSize: '16px',
      color: '#666'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management Dashboard</h1>
        <div style={styles.statsBox}>
          Total Users: {totalUsers}
        </div>
      </div>

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
        <>
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
                  <td style={styles.td}>{(currentPage - 1) * usersPerPage + index + 1}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.password}</td>
                  <td style={styles.td}>{user.mobileNumber}</td>
                  <td style={styles.td}>{user.withdrawalAmount}</td>
                  <td style={styles.td}>{user.problem}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              First
            </button>
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
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                ...styles.pageButton,
                opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1
              }}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                ...styles.pageButton,
                opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1
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
