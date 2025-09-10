// pages/api/admin/users/[id].js
import pool from '../../../../../lib/db';
import { authMiddleware, roleMiddleware } from '../../../../../lib/middleware';

export default async function handler(req, res) {
  try {
    // Verify authentication and admin role
    await authMiddleware(req, res);
    await roleMiddleware(['admin'])(req, res);
    
    const userId = req.query.id;
    
    if (req.method === 'DELETE') {
      // Delete user
      await pool.execute('DELETE FROM Users WHERE UserID = ?', [userId]);
      
      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin user delete error:', error);
    if (error.message === 'Authentication required' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ message: error.message });
    }
    if (error.message === 'Forbidden') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}