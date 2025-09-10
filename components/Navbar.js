// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaFlask, FaCalendarAlt, FaFileAlt, FaBook, FaUser, FaSignOutAlt, FaUsers, FaChartLine, FaMicroscope } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const roleLinks = {
    student: [
      { name: 'Reservations', href: '/reservation', icon: <FaCalendarAlt className="mr-1" /> },
      { name: 'Samples', href: '/sample-entry', icon: <FaFlask className="mr-1" /> },
      { name: 'Reports', href: '/report', icon: <FaFileAlt className="mr-1" /> }
    ],
    researcher: [
      { name: 'Samples', href: '/api/samples', icon: <FaFlask className="mr-1" /> },
      { name: 'Reports', href: '/report', icon: <FaFileAlt className="mr-1" /> },
      { name: 'Protocols', href: '/protocols', icon: <FaBook className="mr-1" /> }
    ],
    technician: [
      { name: 'Devices', href: '/devices', icon: <FaMicroscope className="mr-1" /> },
      { name: 'Protocols', href: '/protocols', icon: <FaBook className="mr-1" /> }
    ],
    admin: [
      { name: 'Users', href: '/admin/users', icon: <FaUsers className="mr-1" /> },
      { name: 'Statistics', href: '/admin/statistics', icon: <FaChartLine className="mr-1" /> }
    ]
  };

  const links = user ? roleLinks[user.role] || [] : [];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={user ? "/dashboard" : "/"} legacyBehavior>
              <a className="flex items-center text-indigo-600 font-bold text-xl">
                <FaFlask className="mr-2" /> Mobile Bio Lab
              </a>
            </Link>
          </div>
          
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {links.map((item) => (
                <Link key={item.name} href={item.href} legacyBehavior>
                  <a className={`flex items-center px-1 pt-1 border-b-2 ${
                    router.pathname === item.href 
                      ? 'border-indigo-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}>
                    {item.icon} {item.name}
                  </a>
                </Link>
              ))}
              <Link href="/profile" legacyBehavior>
                <a className={`flex items-center px-1 pt-1 border-b-2 ${
                  router.pathname === '/profile' 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                  <FaUser className="mr-1" /> Profile
                </a>
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center">
              <button 
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-indigo-600"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}