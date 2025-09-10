// pages/api/report.js
import pool from '../../lib/db';
import { verifyToken } from '../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    // Verify authentication from cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = await verifyToken(token);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      // Get all reports for the user with sample details
      const [reports] = await pool.execute(
        `SELECT 
          r.ReportID AS id,
          r.GeneratedDate,
          r.PDFPath,
          s.SampleID AS sampleId,
          s.SampleType,
          s.CollectionDateTime,
          s.GeoLocation,
          s.Temperature,
          s.pH,
          s.Salinity,
          u.FirstName,
          u.LastName,
          'completed' AS status
        FROM Reports r
        JOIN Samples s ON r.SampleID = s.SampleID
        JOIN Users u ON s.UserID = u.UserID
        WHERE s.UserID = ?
        ORDER BY r.GeneratedDate DESC`,
        [userId]
      );

      return res.status(200).json({
        success: true,
        data: reports
      });

    } else if (req.method === 'POST') {
      // Example: manual report generation
      const { sampleId } = req.body;
      if (!sampleId) {
        return res.status(400).json({ message: 'Sample ID is required' });
      }

      const timestamp = new Date().getTime();
      const pdfPath = `report_${sampleId}_${timestamp}.pdf`;

      await pool.execute(
        `INSERT INTO Reports (SampleID, GeneratedDate, PDFPath) VALUES (?, NOW(), ?)`,
        [sampleId, pdfPath]
      );

      return res.status(201).json({
        success: true,
        message: 'Report generated successfully',
        data: { sampleId, pdfPath, status: 'completed' }
      });

    } else {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Report API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
