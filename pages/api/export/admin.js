import { jsPDF } from 'jspdf';
import pool from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin authentication
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { city, role } = req.query;
  let connection;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    connection = await pool.getConnection();
    
    // Build query based on filters
    let query = `
      SELECT FirstName, LastName, Email, Role, City, MobileNumber, StudentVUId, CreatedAt
      FROM users 
      WHERE 1=1
    `;
    const params = [];
    
    if (city) {
      query += ' AND City = ?';
      params.push(city);
    }
    
    if (role) {
      query += ' AND Role = ?';
      params.push(role);
    }
    
    query += ' ORDER BY CreatedAt DESC';
    
    const [users] = await connection.execute(query, params);

    // Create PDF with jsPDF
    const doc = new jsPDF();
    const margin = 15;
    let yPosition = margin;
    let currentPage = 1;
    const maxPageHeight = 280;

    // Function to add new page
    const addNewPage = () => {
      doc.addPage();
      yPosition = margin;
      currentPage++;
    };

    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MOBILE BIO LAB - USERS EXPORT', 105, yPosition, { align: 'center' });
    yPosition += 12;

    // Add generation info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, yPosition, { align: 'center' });
    yPosition += 8;

    // Add filter info
    let filterText = 'All Users';
    if (city || role) {
      filterText = 'Filtered: ';
      if (city) filterText += `City: ${city} `;
      if (role) filterText += `Role: ${role}`;
    }
    doc.text(filterText, 105, yPosition, { align: 'center' });
    yPosition += 20;

    // Add table headers
    if (yPosition > maxPageHeight - 30) addNewPage();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const headers = ['Name', 'Email', 'Role', 'City', 'Mobile', 'VU ID'];
    const colPositions = [20, 60, 100, 130, 150, 180];
    
    headers.forEach((header, index) => {
      doc.text(header, colPositions[index], yPosition);
    });
    
    yPosition += 10;
    doc.line(margin, yPosition, 200, yPosition);
    yPosition += 15;

    // Add user data
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    users.forEach((user, userIndex) => {
      // Check if we need a new page
      if (yPosition > maxPageHeight) {
        addNewPage();
        
        // Add table headers on new page
        doc.setFont('helvetica', 'bold');
        headers.forEach((header, index) => {
          doc.text(header, colPositions[index], yPosition);
        });
        yPosition += 10;
        doc.line(margin, yPosition, 200, yPosition);
        yPosition += 15;
        doc.setFont('helvetica', 'normal');
      }

      const userData = [
        `${user.FirstName} ${user.LastName}`.substring(0, 20),
        user.Email.substring(0, 25),
        user.Role || 'N/A',
        user.City || 'N/A',
        user.MobileNumber || 'N/A',
        user.StudentVUId || 'N/A'
      ];

      userData.forEach((data, colIndex) => {
        doc.text(data, colPositions[colIndex], yPosition);
      });

      yPosition += 15;
    });

    // Add page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${totalPages}`, 200, 290, { align: 'right' });
    }

    // Generate PDF as array buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    
    // Create filename with filters
    let fileName = 'users-export';
    if (city) fileName += `-${city}`;
    if (role) fileName += `-${role}`;
    fileName += `-${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.byteLength);
    
    // Send the PDF
    res.send(Buffer.from(pdfBuffer));
    
  } catch (error) {
    console.error('Admin PDF export error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}