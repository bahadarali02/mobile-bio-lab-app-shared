import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Navbar from './Navbar';

export default function DashboardLayout({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p>You don't have permission to view this page.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">Mobile Bio Lab</h2>
            <p className="text-sm text-gray-500">{user.role} Dashboard</p>
          </div>
          <nav className="mt-6">
            {user.role === 'student' && (
              <>
                <NavLink href="/student/dashboard">Dashboard</NavLink>
                <NavLink href="/sample-entry">Submit Sample</NavLink>
                <NavLink href="/reservation">Lab Reservations</NavLink>
                <NavLink href="/report">Your Reports</NavLink>
              </>
            )}
            {user.role === 'researcher' && (
              <>
                <NavLink href="/researcher/dashboard">Dashboard</NavLink>
                <NavLink href="/samples">All Samples</NavLink>
                <NavLink href="/report">Reports</NavLink>
                <NavLink href="/protocols">Protocols</NavLink>
              </>
            )}
            {user.role === 'technician' && (
              <>
                <NavLink href="/technician/dashboard">Dashboard</NavLink>
                <NavLink href="/samples">Sample Verification</NavLink>
                <NavLink href="/report/generate">Generate Reports</NavLink>
                <NavLink href="/devices">Device Management</NavLink>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <NavLink href="/admin/dashboard">Dashboard</NavLink>
                <NavLink href="/admin/users">User Management</NavLink>
                <NavLink href="/admin/stats">System Analytics</NavLink>
                <NavLink href="/admin/logs">Activity Logs</NavLink>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, children }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium ${
        isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}