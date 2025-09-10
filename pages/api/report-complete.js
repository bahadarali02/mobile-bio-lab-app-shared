// pages/api/report-complete.js
import pool from '../../lib/db';
import { authMiddleware } from '../../lib/middleware';

export default async function handler(req, res) {
  try {
    // Verify authentication
    const user = await authMiddleware(req, res);
    if (!user) return;

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false,
        message: 'Method not allowed' 
      });
    }

    const { reportId } = req.body;

    if (!reportId) {
      return res.status(400).json({ 
        success: false,
        message: 'Report ID is required' 
      });
    }

    // Update report status to completed
    const [result] = await pool.execute(
      `UPDATE Reports SET Status = 'completed', CompletedDate = NOW() 
       WHERE ReportID = ?`,
      [reportId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Report not found' 
      });
    }

    // Get the updated report to return complete data
    const [updatedReports] = await pool.execute(
      `SELECT * FROM Reports WHERE ReportID = ?`,
      [reportId]
    );

    const completedReport = updatedReports[0];

    return res.status(200).json({ 
      success: true,
      message: 'Report completed successfully',
      data: {
        id: completedReport.ReportID,
        status: 'completed',
        completedDate: completedReport.CompletedDate || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Complete report error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}