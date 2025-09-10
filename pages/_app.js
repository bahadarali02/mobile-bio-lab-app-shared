// pages/_app.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Public pages should NOT trigger auth check
  const isPublicRoute = () => {
    const publicPaths = [
      '/', '/features', '/how-it-works', '/docs', '/pricing',
      '/demo', '/updates', '/tutorials', '/api', '/support',
      '/about', '/blog', '/careers', '/contact',
      '/privacy', '/terms', '/cookies',
      '/login', '/register'
    ];
    return publicPaths.includes(router.pathname);
  };

  useEffect(() => {
    if (isPublicRoute()) {
      setLoading(false); // Skip auth check
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);

          // If already logged in and on login/register page, redirect
          if (['/login', '/register'].includes(router.pathname)) {
            router.push(data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-t-2 border-indigo-500 rounded-full border-b-2" />
      </div>
    );
  }

  return <Component {...pageProps} user={user} />;
}

export default MyApp;
