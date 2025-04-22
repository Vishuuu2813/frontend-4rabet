// FRONTEND SOLUTION - Complete UserDetails component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('https://backend-4bet.vercel.app/usersdetails', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Sort users by _id to preserve MongoDB's insertion order
        const sortedUsers = [...response.data.users];
        
        setUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Error fetching user data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>User Details</h1>
      <p>Total Users: {users.length}</p>
      <table style={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>No.</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile Number</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Withdrawal Amount</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Problem</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.mobileNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.withdrawalAmount}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.problem}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
