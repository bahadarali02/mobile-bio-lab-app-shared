// pages/api/admin/users/index.js
import pool from '../../../../lib/db';
import { authMiddleware, roleMiddleware } from '../../../../lib/middleware';

export default async function handler(req, res) {
  try {
    // Apply standardized middleware
    await authMiddleware(req, res);
    await roleMiddleware(['admin'])(req, res);

    if (req.method !== 'GET') {
      return res.status(405).json({ 
        success: false, 
        message: 'Method not allowed' 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const offset = (page - 1) * pageSize;

    const [users] = await pool.query(
      `SELECT UserID, FirstName, LastName, Email, Role
       FROM Users
       ORDER BY UserID DESC
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM Users`
    );

    return res.status(200).json({
      success: true,
      data: {
        users,
        total,
        page,
        pageSize
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}