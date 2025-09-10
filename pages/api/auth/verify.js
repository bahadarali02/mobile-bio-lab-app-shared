import pool from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let connection;
  try {
    // Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token found' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    connection = await pool.getConnection();

    // Get user from database
    const [users] = await connection.execute(
      'SELECT UserID, FirstName, LastName, Email, StudentVUId, Role, Verified, ProfilePicture FROM users WHERE UserID = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = users[0];

    // Return user data (excluding sensitive information)
    return res.status(200).json({
      user: {
        userId: user.UserID,
        firstName: user.FirstName,
        lastName: user.LastName,
        email: user.Email,
        studentVUId: user.StudentVUId,
        role: user.Role,
        verified: user.Verified,
        profilePicture: user.ProfilePicture
      }
    });

  } catch (error) {
    console.error('Session verification error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}