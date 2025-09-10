// pages/admin/statistics.js
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../lib/api';

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/stats');
        
        if (!response.success) {
          throw new Error('Failed to load statistics');
        }

        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Layout><div>Loading statistics...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">Error: {error}</div></Layout>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">System Statistics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Active Today</h3>
            <p className="text-3xl font-bold mt-2">{stats?.totalReservationsToday || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Samples Collected</h3>
            <p className="text-3xl font-bold mt-2">{stats?.totalSamplesToday || 0}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}