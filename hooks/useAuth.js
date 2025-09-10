// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const verifyAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        setUser(null);
        if (response.status === 401) {
          const currentPath = router.asPath;
          if (currentPath !== '/login' && currentPath !== '/register') {
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          }
        }
      }
    } catch (err) {
      console.error('Auth verification error:', err);
      setError(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    verifyAuth();

    // Set up interval for token refresh (every 5 minutes)
    const interval = setInterval(verifyAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifyAuth]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err);
    }
  }, [router]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    user, 
    loading, 
    error, 
    logout,
    login,
    verifyAuth,
    isAuthenticated: !!user
  };
};

export default useAuth;