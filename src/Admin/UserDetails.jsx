import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Function to fetch all users
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('https://backend-4bet.vercel.app/usersdetails', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Store current time for tracking new users
      const currentTime = new Date();
      
      // If this is the initial load, set all users
      if (!lastFetchTime) {
        setUsers(response.data.users);
        setLastFetchTime(currentTime);
      } else {
        // Filter new users (created after last fetch)
        const existingUsers = response.data.users.filter(user => 
          new Date(user.createdAt) <= lastFetchTime
        );
        
        const recentUsers = response.data.users.filter(user => 
          new Date(user.createdAt) > lastFetchTime
        );
        
        setUsers(existingUsers);
        setNewUsers([...recentUsers, ...newUsers]);
        setLastFetchTime(currentTime);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error fetching user data');
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUserDetails();
    
    // Set up periodic polling for new users (every 30 seconds)
    const intervalId = setInterval(fetchUserDetails, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Table component for reusability
  const UserTable = ({ userData, title }) => (
    <>
      {title && <h2>{title}</h2>}
      <table style={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse', marginBottom: '20px' }}>
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
          {userData.map((user, index) => (
            <tr key={user._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
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
    </>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div>
      <h1>User Details</h1>
      
      {/* Display new users section if any */}
      {newUsers.length > 0 && <UserTable userData={newUsers} title="New Users" />}
      
      {/* Display all existing users */}
      <UserTable userData={users} title="All Users" />
      
      {/* Refresh button */}
      <button 
        onClick={fetchUserDetails}
        style={{
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh Users
      </button>
    </div>
  );
};

export default UserDetails;
