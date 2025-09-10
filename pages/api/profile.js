// pages/api/profile.js
import pool from '../../../lib/db';
import { authMiddleware } from '../../../lib/middleware';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    await authMiddleware(req, res);
    const userId = req.user.userId;
    
    const { firstName, lastName, email, mobileNo, city } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }
    
    // Update user profile
    await pool.execute(
      'UPDATE Users SET FirstName = ?, LastName = ?, MobileNo = ?, City = ? WHERE UserID = ?',
      [firstName, lastName, mobileNo || null, city || null, userId]
    );
    
    return res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}