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
        }
      });
      
      // Sort users to ensure newest users are at the end
      // Assuming the backend sends data in chronological order
      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
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
    axios.get('https://backend-4rabet.vercel.app/users/export')
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management Dashboard</h1>
        <div className="bg-blue-50 p-3 rounded-lg shadow">
          <strong>Total Users:</strong> {totalUsers}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-lg">
          <input
            type="text"
            placeholder="Search by email, mobile number or problem description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        </form>
        <div className="flex gap-2">
          <button onClick={refreshData} className="bg-blue-500 text-white px-4 py-2 rounded">
            Refresh Data
          </button>
          <button onClick={exportToCSV} className="bg-green-500 text-white px-4 py-2 rounded">
            Export as CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-10 text-gray-600">Loading user data...</div>
      ) : users.length === 0 ? (
        <div className="text-center my-10 text-gray-600">No users found.</div>
      ) : (
        <>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b border-gray-200 p-3 text-left">S.No</th>
                  <th className="border-b border-gray-200 p-3 text-left">Email</th>
                  <th className="border-b border-gray-200 p-3 text-left">Password</th>
                  <th className="border-b border-gray-200 p-3 text-left">Mobile Number</th>
                  <th className="border-b border-gray-200 p-3 text-left">Withdrawal Amount</th>
                  <th className="border-b border-gray-200 p-3 text-left">Problem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 p-3">
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </td>
                    <td className="border-b border-gray-200 p-3">{user.email}</td>
                    <td className="border-b border-gray-200 p-3">{user.password}</td>
                    <td className="border-b border-gray-200 p-3">{user.mobileNumber}</td>
                    <td className="border-b border-gray-200 p-3">{user.withdrawalAmount}</td>
                    <td className="border-b border-gray-200 p-3">{user.problem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="border border-gray-300 px-3 py-1 mx-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border border-gray-300 px-3 py-1 mx-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`border px-3 py-1 mx-1 rounded ${
                  currentPage === number 
                    ? 'bg-blue-500 text-white' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border border-gray-300 px-3 py-1 mx-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="border border-gray-300 px-3 py-1 mx-1 rounded hover:bg-gray-100 disabled:opacity-50"
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
