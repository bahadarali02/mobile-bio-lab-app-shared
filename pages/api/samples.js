import pool from '../../lib/db';
import { authMiddleware } from '../../lib/middleware';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await authMiddleware(req, res);
      const userId = req.user.userId;
      
      const [samples] = await pool.execute(
        'SELECT SampleID, SampleType, CollectionDateTime, Temperature, pH FROM Samples WHERE UserID = ? ORDER BY CollectionDateTime DESC',
        [userId]
      );
      
      return res.status(200).json({ samples });
    } catch (error) {
      console.error('Fetch samples error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}