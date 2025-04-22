import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDetailsPage() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('email');
  const [exportLoading, setExportLoading] = useState(false);
  
  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get('https://backend-4bet.vercel.app/usersdetails/count');
      setTotalUsers(response.data.count || 0);
    } catch (err) {
      console.error('Error fetching total users count:', err);
      setError('Failed to fetch total users count');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Using only the base URL without any parameters
      const response = await axios.get('https://backend-4bet.vercel.app/usersdetails');
      
      // Check if data is an array or has a specific property containing the array
      const data = response.data;
      const userArray = Array.isArray(data) ? data : 
                        (data.users ? data.users : 
                        (data.data ? data.data : []));
      
      setUsers(userArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users data');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCsv = async () => {
    setExportLoading(true);
    try {
      const response = await axios.get('https://backend-4bet.vercel.app/users/export', {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV');
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterBy('email');
    setPage(1);
    fetchUsers();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Client-side pagination logic
  const indexOfLastUser = page * limit;
  const indexOfFirstUser = indexOfLastUser - limit;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / limit);

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif',
      margin: 0,
      padding: '20px',
      backgroundColor: '#f5f5f5',
      color: '#333',
      minHeight: '100vh'
    },
    card: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    title: {
      color: '#2c3e50',
      margin: '0',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    stats: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '6px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    },
    searchContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    input: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      flexGrow: '1',
      minWidth: '200px'
    },
    select: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    buttonHover: {
      backgroundColor: '#2980b9'
    },
    resetButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    exportButton: {
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    th: {
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold'
    },
    td: {
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd'
    },
    tr: {
      ':hover': {
        backgroundColor: '#f5f5f5'
      }
    },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px'
    },
    paginationControls: {
      display: 'flex',
      gap: '5px'
    },
    paginationButton: {
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#3498db',
      color: 'white'
    },
    paginationDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    paginationInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    currentPage: {
      padding: '5px 10px',
      backgroundColor: '#f2f2f2',
      borderRadius: '4px'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px'
    },
    error: {
      backgroundColor: '#ffebee',
      border: '1px solid #ffcdd2',
      color: '#c62828',
      padding: '10px 15px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    noData: {
      backgroundColor: '#fff8e1',
      border: '1px solid #ffecb3',
      color: '#ff8f00',
      padding: '10px 15px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    tableWrapper: {
      overflowX: 'auto'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>User Details</h1>
          <div style={styles.stats}>
            Total Users: {users.length}
          </div>
        </div>

        <div style={styles.searchContainer}>
          <form onSubmit={handleSearch} style={{display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1}}>
            <select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={styles.select}
            >
              <option value="email">Email</option>
              <option value="mobileNumber">Mobile Number</option>
              <option value="problem">Problem</option>
            </select>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
            <button 
              type="submit" 
              style={styles.button}
            >
              Search
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              style={styles.resetButton}
            >
              Reset
            </button>
          </form>
          <button 
            onClick={exportToCsv}
            disabled={exportLoading}
            style={styles.exportButton}
          >
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div>Loading user data...</div>
          </div>
        ) : error ? (
          <div style={styles.error}>
            {error}
          </div>
        ) : users.length === 0 ? (
          <div style={styles.noData}>
            No users found.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Mobile Number</th>
                  <th style={styles.th}>Withdrawal Amount</th>
                  <th style={styles.th}>Problem</th>
                  <th style={styles.th}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user._id || index} style={styles.tr}>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.mobileNumber}</td>
                    <td style={styles.td}>{user.withdrawalAmount}</td>
                    <td style={styles.td}>{user.problem}</td>
                    <td style={styles.td}>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={styles.pagination}>
          <div style={styles.paginationInfo}>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              style={styles.select}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <span>
              Showing {loading ? '...' : `${(page - 1) * limit + 1}-${Math.min(page * limit, users.length)}`} of {users.length}
            </span>
          </div>

          <div style={styles.paginationControls}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                ...styles.paginationButton,
                ...(page === 1 ? styles.paginationDisabled : {})
              }}
            >
              Previous
            </button>
            <span style={styles.currentPage}>
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              style={{
                ...styles.paginationButton,
                ...(page >= totalPages ? styles.paginationDisabled : {})
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
