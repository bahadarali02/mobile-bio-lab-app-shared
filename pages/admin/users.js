// pages/admin/users.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function AdminUsers() {
  const [state, setState] = useState({
    users: [], // Initialize as empty array
    loading: true,
    error: null
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch('/api/admin/users', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        
        const data = await response.json();
        
        // Verify the response structure
        if (!data.success || !Array.isArray(data.data?.users)) {
          throw new Error('Invalid data format');
        }
        
        setState({
          users: data.data.users,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
        
        if (error.message.includes('Unauthorized')) {
          router.push('/login');
        }
      }
    }
    
    fetchUsers();
  }, [router]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      // Refresh the list
      setState(prev => ({ ...prev, loading: true }));
      const newResponse = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      const newData = await newResponse.json();
      setState({
        users: newData.data.users,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Headers */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.users.map((user) => (
                    <tr key={user.UserID}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.FirstName} {user.LastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.Email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.Role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.Role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(user.UserID)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}