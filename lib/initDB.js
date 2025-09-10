import pool from './db';

export async function initializeDatabase() {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        FirstName VARCHAR(50) NOT NULL,
        LastName VARCHAR(50) NOT NULL,
        Email VARCHAR(100) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        MobileNo VARCHAR(15),
        Role ENUM('student', 'researcher', 'technician', 'admin') NOT NULL,
        City VARCHAR(50),
        ProfilePicture VARCHAR(255),
        INDEX idx_email (Email)
      )
    `);

    // Create Reservations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Reservations (
        ReservationID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        Date DATE NOT NULL,
        TimeSlot TIME NOT NULL,
        Status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        INDEX idx_user_date (UserID, Date)
      )
    `);

    // Create Samples table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Samples (
        SampleID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        CollectionDateTime DATETIME NOT NULL,
        SampleType ENUM('soil', 'water', 'plant', 'other') NOT NULL,
        GeoLocation VARCHAR(100),
        Temperature DECIMAL(5,2),
        pH DECIMAL(4,2),
        Salinity DECIMAL(5,2),
        BarcodeID VARCHAR(50) UNIQUE,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        INDEX idx_barcode (BarcodeID)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}