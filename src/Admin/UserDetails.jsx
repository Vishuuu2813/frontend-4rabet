import { useState, useEffect } from 'react';

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
      const response = await fetch('https://backend-4bet.vercel.app/usersdetails/count');
      if (!response.ok) throw new Error('Failed to fetch total users count');
      const data = await response.json();
      setTotalUsers(data.count);
    } catch (err) {
      console.error('Error fetching total users count:', err);
      setError('Failed to fetch total users count');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `https://backend-4bet.vercel.app/usersdetails?page=${page}&limit=${limit}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}&filterBy=${filterBy}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users data');
      const data = await response.json();
      setUsers(data);
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
      const response = await fetch('https://backend-4bet.vercel.app/users/export');
      if (!response.ok) throw new Error('Failed to export CSV');
      
      const blob = await response.blob();
      // Create blob link to download
      const url = window.URL.createObjectURL(blob);
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
  }, [page, limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
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

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
          <div className="bg-blue-600 text-white py-2 px-4 rounded-md shadow font-medium">
            Total Users: {totalUsers}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2 flex-1">
            <select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
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
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Search
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          </form>
          <button 
            onClick={exportToCsv}
            disabled={exportLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center"
          >
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left">Email</th>
                  <th className="py-3 px-4 border-b text-left">Mobile Number</th>
                  <th className="py-3 px-4 border-b text-left">Withdrawal Amount</th>
                  <th className="py-3 px-4 border-b text-left">Problem</th>
                  <th className="py-3 px-4 border-b text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b">{user.mobileNumber}</td>
                    <td className="py-3 px-4 border-b">{user.withdrawalAmount}</td>
                    <td className="py-3 px-4 border-b">{user.problem}</td>
                    <td className="py-3 px-4 border-b">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset to first page when changing limit
              }}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <span className="text-gray-600">
              Showing {loading ? '...' : `${(page - 1) * limit + 1}-${Math.min(page * limit, totalUsers)}`} of {totalUsers}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded">
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className={`px-3 py-1 rounded ${
                page >= totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
