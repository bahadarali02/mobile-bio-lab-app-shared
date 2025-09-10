//lib/middleware.js
import { verifyToken } from './auth';
import { NextResponse } from 'next/server';

// Unified auth middleware that works for both API routes and Next.js middleware
export const authMiddleware = async (req, res) => {
  try {
    // For API routes (req, res pattern)
    if (req && res) {
      const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return null;
      }

      const decoded = await verifyToken(token);
      req.user = decoded;
      return decoded;
    }
    // For Next.js middleware (Request object)
    else if (req instanceof Request) {
      const token = req.cookies.get('token')?.value;
      const { pathname } = req.nextUrl;

      const publicRoutes = ['/login', '/register', '/', '/features'];
      if (publicRoutes.includes(pathname)) return NextResponse.next();

      if (!token) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const decoded = await verifyToken(token);
      
      if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    if (res) {
      res.status(401).json({ message: error.message });
      return null;
    }
    if (req instanceof Request) {
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('token');
      return response;
    }
  }
};

// Role middleware for API routes
export const roleMiddleware = (roles) => async (req, res) => {
  try {
    const user = await authMiddleware(req, res);
    if (!user) return null;

    if (!user.role || !roles.includes(user.role)) {
      res.status(403).json({ 
        message: 'Forbidden: Admin access required',
        userRole: user.role 
      });
      return null;
    }
    
    return true;
  } catch (error) {
    console.error('Role check error:', error);
    if (res) {
      res.status(403).json({ message: error.message });
    }
    return null;
  }
};