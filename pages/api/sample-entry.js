// pages/api/sample-entry.js
import pool from '../../lib/db';
import { authMiddleware } from '../../lib/middleware';

export default async function handler(req, res) {
  try {
    // Verify authentication
    await authMiddleware(req, res);

    if (req.method === 'POST') {
      const { sampleType, geoLocation, collectionDateTime, barcodeID, temperature, pH, salinity } = req.body;
      const userId = req.user.userId;

      // Basic validation
      if (!sampleType || !collectionDateTime) {
        return res.status(400).json({ message: 'Sample type and collection date/time are required' });
      }

      // Insert sample into database
      const [result] = await pool.execute(
        `INSERT INTO Samples 
        (UserID, CollectionDateTime, SampleType, GeoLocation, Temperature, pH, Salinity, BarcodeID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          new Date(collectionDateTime),
          sampleType,
          geoLocation || null,
          temperature ? parseFloat(temperature) : null,
          pH ? parseFloat(pH) : null,
          salinity ? parseFloat(salinity) : null,
          barcodeID || null
        ]
      );

      // Generate report only after successful sample insertion
      const sampleId = result.insertId;
      const timestamp = new Date().getTime();
      const pdfPath = `report_${sampleId}_${timestamp}.pdf`;

      // Insert corresponding report
      await pool.execute(
        `INSERT INTO Reports 
        (SampleID, GeneratedDate, PDFPath) 
        VALUES (?, NOW(), ?)`,
        [sampleId, pdfPath]
      );

      return res.status(201).json({
        success: true,
        message: 'Sample submitted successfully',
        sampleId: sampleId
      });

    } else if (req.method === 'GET') {
      // Fetch all samples (for researcher dashboard)
      const [samples] = await pool.execute(
        `SELECT 
          s.SampleID AS id,
          CONCAT(u.FirstName, ' ', u.LastName) AS studentName,
          s.SampleType AS type,
          DATE_FORMAT(s.CollectionDateTime, '%Y-%m-%d %H:%i:%s') AS date,
          'pending' AS status
        FROM Samples s
        JOIN Users u ON s.UserID = u.UserID
        ORDER BY s.CollectionDateTime DESC`
      );

      return res.status(200).json({
        success: true,
        data: samples
      });

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Sample entry error:', error);
    if (error.message === 'Authentication required' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}
