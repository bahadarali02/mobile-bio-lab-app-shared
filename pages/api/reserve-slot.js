// pages/api/reserve-slot.js
import pool from '../../lib/db';
import { authMiddleware } from '../../lib/middleware';

export default async function handler(req, res) {
  try {
    // GET endpoint to fetch reservations
    if (req.method === 'GET') {
      const user = await authMiddleware(req, res);
      if (!user) return;

      const { date, user: userQuery, action } = req.query;
      
      // Handle researcher dashboard request (action=list)
      if (action === 'list') {
        try {
          // Get all reservations for researcher dashboard
          const [results] = await pool.execute(
            `SELECT 
              r.ReservationID as id,
              CONCAT(u.FirstName, ' ', u.LastName) as studentName,
              r.Date as date,
              TIME_FORMAT(r.TimeSlot, '%H:%i') AS slot,
              r.Status as status,
              'Main Lab' as location,
              'Lab Equipment' as equipment
             FROM Reservations r
             JOIN Users u ON r.UserID = u.UserID
             ORDER BY r.Date DESC, r.TimeSlot DESC 
             LIMIT 100`
          );
          
          return res.status(200).json(results);
        } catch (dbError) {
          console.error('Database error:', dbError);
          // Fallback: return empty array if there's a database error
          return res.status(200).json([]);
        }
      }
      
      // Fetch user's reservations (student view)
      if (userQuery === 'true') {
        const [results] = await pool.execute(
          `SELECT ReservationID, UserID, Date, TIME_FORMAT(TimeSlot, '%H:%i') AS TimeSlot, Status
           FROM Reservations 
           WHERE UserID = ? 
           AND Date >= CURDATE()
           AND Status = 'confirmed'
           ORDER BY Date ASC, TimeSlot ASC`,
          [user.userId]
        );
        return res.status(200).json(results);
      }
      
      // Fetch reservations for a specific date (calendar view)
      if (date) {
        const [results] = await pool.execute(
          `SELECT ReservationID, UserID, Date, TIME_FORMAT(TimeSlot, '%H:%i') AS TimeSlot, Status
           FROM Reservations 
           WHERE Date = ? 
           AND Status = 'confirmed'`,
          [date]
        );
        return res.status(200).json(results);
      }
      
      return res.status(400).json({ message: 'Missing query parameters' });
    }
    
    // POST endpoint to create a new reservation
    if (req.method === 'POST') {
      const user = await authMiddleware(req, res);
      if (!user) return;

      const connection = await pool.getConnection();
      try {
        const { date, timeSlot } = req.body;
        
        if (!date || !timeSlot) {
          return res.status(400).json({ message: 'Date and time slot are required' });
        }
        
        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return res.status(400).json({ message: 'Invalid date format' });
        }
        
        // Validate time format (HH:MM)
        if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeSlot)) {
          return res.status(400).json({ message: 'Invalid time format' });
        }
        
        await connection.beginTransaction();
        
        // Check if slot is available
        const [existing] = await connection.execute(
          `SELECT * FROM Reservations 
           WHERE Date = ? 
           AND TimeSlot = ?
           AND Status = 'confirmed'
           FOR UPDATE`,
          [date, timeSlot + ':00']
        );
        
        if (existing.length > 0) {
          await connection.rollback();
          return res.status(409).json({ message: 'This time slot is already booked' });
        }
        
        // Create reservation
        const [result] = await connection.execute(
          `INSERT INTO Reservations 
           (UserID, Date, TimeSlot, Status) 
           VALUES (?, ?, ?, 'confirmed')`,
          [user.userId, date, timeSlot + ':00']
        );
        
        await connection.commit();
        
        return res.status(201).json({ 
          success: true,
          message: 'Reservation created successfully',
          reservationId: result.insertId
        });
      } catch (error) {
        if (connection) await connection.rollback();
        console.error('Reservation error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      } finally {
        if (connection) connection.release();
      }
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}