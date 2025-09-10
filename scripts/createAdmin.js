// scripts/createAdmin.js
import bcrypt from 'bcryptjs';
import pool from '../lib/db.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const firstName = process.env.ADMIN_FIRSTNAME || 'Admin';
    const lastName = process.env.ADMIN_LASTNAME || 'User';

    if (!email || !password) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      process.exit(1);
    }

    // Check if admin already exists
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE Email = ? AND Role = ?',
      [email, 'admin']
    );

    if (rows.length > 0) {
      console.log('✅ Admin already exists:', email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO Users (FirstName, LastName, Email, Password, Role) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, 'admin']
    );

    console.log('✅ Admin created successfully:', email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
})();

