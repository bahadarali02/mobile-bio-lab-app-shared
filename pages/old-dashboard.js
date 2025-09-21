import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaFlask, 
  FaCalendarAlt, 
  FaFilePdf, 
  FaUser, 
  FaBluetoothB,
  FaClock,
  FaChevronRight
} from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    reservations: 0,
    samples: 0,
    reports: 0,
    bleConnected: false,
    recentActivity: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch stats from your API
      async function fetchStats() {
        try {
          const response = await fetch('/api/admin/stats');
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setStatsLoading(false);
        }
      }
      fetchStats();
    }
  }, [isAuthenticated]);

  if (loading || !user || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Mobile Bio Lab</title>
        <meta name="description" content="Your personalized lab dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, <span className="text-indigo-600">{user.name}</span>
                </h1>
                <p className="text-gray-600 mt-2">
                  {user.role === 'admin' ? 'Administrator' : 
                   user.role === 'technician' ? 'Lab Technician' : 
                   'Researcher'} • {user.email}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </motion.section>

          {/* Stats Cards */}
          <motion.section 
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Reservations Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-100"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                      <FaCalendarAlt className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Your Reservations</h3>
                      <p className="text-2xl font-semibold text-gray-900">{stats.reservations}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/reservation" legacyBehavior>
                      <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                        View all <FaChevronRight className="ml-1 h-3 w-3" />
                      </a>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Samples Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-100"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                      <FaFlask className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Samples Submitted</h3>
                      <p className="text-2xl font-semibold text-gray-900">{stats.samples}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/sample-entry" legacyBehavior>
                      <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                        View all <FaChevronRight className="ml-1 h-3 w-3" />
                      </a>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Reports Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-100"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                      <FaFilePdf className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Pending Reports</h3>
                      <p className="text-2xl font-semibold text-gray-900">{stats.reports}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/report" legacyBehavior>
                      <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                        View all <FaChevronRight className="ml-1 h-3 w-3" />
                      </a>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* BLE Status Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-100"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                      <FaBluetoothB className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">BLE Device</h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats.bleConnected ? "Connected" : "Disconnected"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/technician/dashboard" legacyBehavior>
                      <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                        Manage devices <FaChevronRight className="ml-1 h-3 w-3" />
                      </a>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/reservation" legacyBehavior>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-indigo-100 cursor-pointer"
                >
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <FaCalendarAlt className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Book Lab</h3>
                  <p className="mt-2 text-sm text-gray-500">Reserve your lab time slot</p>
                  <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center">
                    Go to page <FaChevronRight className="ml-1 h-3 w-3" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/sample-entry" legacyBehavior>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-indigo-100 cursor-pointer"
                >
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <FaFlask className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Add Sample</h3>
                  <p className="mt-2 text-sm text-gray-500">Submit new biological sample</p>
                  <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center">
                    Go to page <FaChevronRight className="ml-1 h-3 w-3" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/report" legacyBehavior>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-indigo-100 cursor-pointer"
                >
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <FaFilePdf className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Generate Report</h3>
                  <p className="mt-2 text-sm text-gray-500">Create PDF report with charts</p>
                  <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center">
                    Go to page <FaChevronRight className="ml-1 h-3 w-3" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/profile" legacyBehavior>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-indigo-100 cursor-pointer"
                >
                  <div className="bg-purple-100 p-4 rounded-full mb-4">
                    <FaUser className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
                  <p className="mt-2 text-sm text-gray-500">View and edit your account</p>
                  <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center">
                    Go to page <FaChevronRight className="ml-1 h-3 w-3" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.section>

          {/* Recent Activity */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {stats.recentActivity?.map((activity, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gray-100 p-2 rounded-lg">
                        {activity.type === 'reservation' && <FaCalendarAlt className="h-5 w-5 text-indigo-600" />}
                        {activity.type === 'sample' && <FaFlask className="h-5 w-5 text-green-600" />}
                        {activity.type === 'report' && <FaFilePdf className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <span className="text-xs text-gray-400">
                          <FaClock className="inline mr-1" /> {activity.time}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-3 bg-gray-50 text-right">
                <Link href="/activity" legacyBehavior>
                  <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all activity
                  </a>
                </Link>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </>
  );
}