import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showNewUsers, setShowNewUsers] = useState(false);
  const pageSize = 20; // Show 20 entries per page
  
  // Use this date as reference point to separate existing vs new users
  const referenceDate = new Date(); // Current time when component loads

  useEffect(() => {
    fetchUsers(currentPage);
    // Set up polling for new users
    const newUsersInterval = setInterval(() => {
      fetchNewUsers();
    }, 30000); // Check for new users every 30 seconds
    
    // Initial fetch of new users
    fetchNewUsers();
    
    // Cleanup interval on component unmount
    return () => clearInterval(newUsersInterval);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get('https://backend-4bet.vercel.app/usersdetails', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          page: page,
          limit: pageSize
        }
      });
      
      // Filter out any users that might be considered "new" based on reference date
      const existingUsers = response.data.users.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt < referenceDate;
      });
      
      setUsers(existingUsers);
      setTotalUsers(response.data.totalUsers);
      setTotalPages(Math.ceil(response.data.totalUsers / pageSize));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load users. Please try again.');
      setLoading(false);
    }
  };
  
  const fetchNewUsers = async () => {
    try {
      const response = await axios.get('https://backend-4bet.vercel.app/usersdetails', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          // Get a larger batch to ensure we catch all new users
          limit: 100,
          page: 1
        }
      });
      
      // Filter users created after our reference date
      const recentUsers = response.data.users.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= referenceDate;
      });
      
      setNewUsers(recentUsers);
    } catch (err) {
      console.error('Error fetching new users:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const toggleNewUsers = () => {
    setShowNewUsers(!showNewUsers);
  };

  if (loading && !showNewUsers) return <div>Loading users...</div>;
  if (error && !showNewUsers) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Details</h1>
      
      {/* Button to toggle between existing and new users */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={toggleNewUsers}
          style={{
            padding: '10px 15px',
            backgroundColor: showNewUsers ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showNewUsers ? 'Show Existing Users' : 'Show New Users'}
          {newUsers.length > 0 && !showNewUsers && (
            <span style={{ 
              marginLeft: '10px', 
              backgroundColor: 'red', 
              color: 'white', 
              borderRadius: '50%', 
              padding: '2px 8px' 
            }}>
              {newUsers.length}
            </span>
          )}
        </button>
      </div>
      
      {!showNewUsers ? (
        // Existing users table
        <>
          <div style={{ margin: '10px 0' }}>
            <p>Showing {users.length} of {totalUsers} users (Page {currentPage} of {totalPages})</p>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>No.</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile Number</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Withdrawal Amount</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Problem</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.mobileNumber}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.withdrawalAmount}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.problem}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
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
        </>
      ) : (
        // New users table
        <>
          <div style={{ margin: '10px 0' }}>
            <h2>New Users <span style={{ color: 'green' }}>({newUsers.length})</span></h2>
          </div>
          
          {newUsers.length === 0 ? (
            <p>No new users have been created since this page was loaded.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e8f5e9' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>No.</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile Number</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Withdrawal Amount</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Problem</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {newUsers.map((user, index) => (
                  <tr key={user._id} style={{ backgroundColor: '#f1f8e9' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.mobileNumber}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.withdrawalAmount}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.problem}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default UserDetails;
