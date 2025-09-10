// lib/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Only load environment variables on server side
if (typeof window === 'undefined') {
  dotenv.config();
}

let pool;

if (typeof window === 'undefined') {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'bio_lab_user',
    password: process.env.DB_PASSWORD || 'MobileBiolabappdatabase@123',
    database: process.env.DB_NAME || 'mobile_bio_lab',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

export default pool;