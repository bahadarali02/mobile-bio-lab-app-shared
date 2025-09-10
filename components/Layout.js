// components/Layout.js
import { useRouter } from 'next/router'
import Navbar from './Navbar'
import useAuth from '../hooks/useAuth' // This imports the default export

export default function Layout({ children, allowedRoles }) {
  const { user, loading, error } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !user) {
    router.push('/login')
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  )
}