import pool from '../../../../lib/db';
import { authMiddleware } from '../../../../lib/middleware';
import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  try {
    // Verify authentication
    const user = await authMiddleware(req, res);
    if (!user) return;

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: 'Report ID is required' 
      });
    }

    // Handle download
    return await handleDownloadReport(req, res, user);
    
  } catch (error) {
    console.error('Download API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
}

// Handle downloading a report
async function handleDownloadReport(req, res, user) {
  let doc;
  
  try {
    const reportId = req.query.id;

    // Get report data with proper field names
    const [reports] = await pool.execute(
      `SELECT 
        r.ReportID,
        r.Status,
        r.GeneratedDate,
        r.CompletedDate,
        r.Title,
        s.SampleID,
        s.SampleType,
        s.CollectionDateTime,
        s.GeoLocation,
        s.Temperature,
        s.pH,
        s.Salinity,
        u.FirstName,
        u.LastName
      FROM Reports r
      JOIN Samples s ON r.SampleID = s.SampleID
      JOIN Users u ON s.UserID = u.UserID
      WHERE r.ReportID = ?`,
      [reportId]
    );

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const report = reports[0];

    // Check if report is completed
    if (report.Status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Report is not ready for download. Please complete the report first.'
      });
    }

    // Create PDF document - SIMPLIFIED VERSION
    doc = new PDFDocument();
    
    // Set PDF headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${reportId}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // SIMPLE PDF CONTENT - minimal to avoid errors
    doc.fontSize(16).text('MOBILE BIO LAB REPORT', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`Report ID: ${report.ReportID}`);
    doc.text(`Title: ${report.Title || 'No title'}`);
    doc.text(`Sample ID: ${report.SampleID}`);
    doc.text(`Sample Type: ${report.SampleType}`);
    doc.text(`Status: ${report.Status}`);
    
    if (report.GeneratedDate) {
      doc.text(`Generated: ${new Date(report.GeneratedDate).toLocaleDateString()}`);
    }
    
    if (report.CompletedDate) {
      doc.text(`Completed: ${new Date(report.CompletedDate).toLocaleDateString()}`);
    }
    
    doc.moveDown();
    doc.text(`Researcher: ${report.FirstName} ${report.LastName}`);
    
    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Download error:', error);
    
    // If PDF generation started but failed, we can't send JSON
    if (res.headersSent) {
      console.error('PDF generation failed after headers were sent');
      if (doc) {
        doc.end();
      }
      return;
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to generate PDF: ' + error.message
    });
  }
}