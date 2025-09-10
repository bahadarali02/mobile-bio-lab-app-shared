import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, studentId } = req.query;

  if (!token || !studentId) {
    return res.status(400).json({ message: 'Missing token or student ID' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Find user by student ID and verification token
    const [users] = await connection.execute(
      'SELECT UserID, FirstName, Email FROM users WHERE StudentVUId = ? AND VerificationToken = ? AND Verified = FALSE',
      [studentId, token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    const user = users[0];

    // Update user as verified and remove verification token
    await connection.execute(
      'UPDATE users SET Verified = TRUE, VerificationToken = NULL, UpdatedAt = NOW() WHERE UserID = ?',
      [user.UserID]
    );

    // Redirect to success page
    res.redirect(`/verify-success?email=${encodeURIComponent(user.Email)}`);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}