import pool from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    connection.release();
    
    res.status(200).json({ 
      success: true,
      result: rows[0].solution,
      serverInfo: {
        version: await getServerVersion(),
        database: 'mobile_bio_lab'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        config: {
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER,
          database: process.env.DB_NAME
        }
      }
    });
  }
}

async function getServerVersion() {
  const [versionRows] = await pool.query('SELECT VERSION() AS version');
  return versionRows[0].version;
}