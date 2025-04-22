import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple fetch without any sorting or processing
    axios.get('https://backend-4bet.vercel.app/usersdetails', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      // Just use the data exactly as it comes from the server
      setUsers(response.data.users);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Details</h1>
      <div>
        {users.map((user, index) => (
          <div key={user._id} style={{margin: '10px 0', padding: '10px', border: '1px solid #ccc'}}>
            <p><strong>No: {index + 1}</strong></p>
            <p>ID: {user._id}</p>
            <p>Email: {user.email}</p>
            <p>Mobile: {user.mobileNumber}</p>
            <p>Amount: {user.withdrawalAmount}</p>
            <p>Problem: {user.problem}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetails;
