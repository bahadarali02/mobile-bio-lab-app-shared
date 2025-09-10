import pool from '../../../lib/db'; 

import { authMiddleware, roleMiddleware } from '../../../lib/middleware';

export default async function handler(req, res) {
  try {
    // Apply auth and admin role middleware
    await authMiddleware(req, res);
    await roleMiddleware(['admin'])(req, res);
    
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Get all stats in a single query
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM Users) as totalUsers,
        (SELECT COUNT(*) FROM Users WHERE Role = 'student') as totalStudents,
        (SELECT COUNT(*) FROM Users WHERE Role = 'researcher') as totalResearchers,
        (SELECT COUNT(*) FROM Users WHERE Role = 'technician') as totalTechnicians,
        (SELECT COUNT(*) FROM Users WHERE Role = 'admin') as totalAdmins,
        (SELECT COUNT(*) FROM Reservations WHERE DATE(Date) = CURDATE()) as totalReservationsToday,
        (SELECT COUNT(*) FROM Samples WHERE DATE(CollectionDateTime) = CURDATE()) as totalSamplesToday,
        (SELECT COUNT(*) FROM Reports) as totalReports
    `);

    return res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}