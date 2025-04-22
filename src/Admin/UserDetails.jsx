import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 20; // Show 20 entries per page

  useEffect(() => {
    fetchUsers(currentPage);
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
      
      setUsers(response.data.users);
      setTotalUsers(response.data.totalUsers);
      setTotalPages(Math.ceil(response.data.totalUsers / pageSize));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load users. Please try again.');
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Details</h1>
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
    </div>
  );
};

export default UserDetails;
