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
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Withdrawal Amount</th>
            <th>Problem</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.mobileNumber}</td>
              <td>{user.withdrawalAmount}</td>
              <td>{user.problem}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{new Date(user.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
