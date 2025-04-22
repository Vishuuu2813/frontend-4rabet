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
            Authorization: `Bearer ${localStorage.getItem('token')}` // assuming you're storing the JWT token in localStorage
          }
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
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
      <table style={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile Number</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Withdrawal Amount</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Problem</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.mobileNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.withdrawalAmount}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.problem}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {new Date(user.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {new Date(user.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
