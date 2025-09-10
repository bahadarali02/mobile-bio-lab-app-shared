// pages/api/protocols.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [protocols] = await pool.execute(
      'SELECT * FROM Protocols ORDER BY Title'
    );
    
    return res.status(200).json({ protocols });
  } catch (error) {
    console.error('Fetch protocols error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}