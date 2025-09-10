import pool from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export async function registerUser(userData) {
  const { firstName, lastName, email, password, mobileNo, role, city } = userData;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insert user into database
  const [result] = await pool.execute(
    'INSERT INTO Users (FirstName, LastName, Email, Password, MobileNo, Role, City) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [firstName, lastName, email, hashedPassword, mobileNo, role, city]
  );
  
  return result.insertId;
}

export async function loginUser(email, password) {
  // Find user by email
  const [users] = await pool.execute(
    'SELECT * FROM Users WHERE Email = ?',
    [email]
  );
  
  if (users.length === 0) {
    throw new Error('User not found');
  }
  
  const user = users[0];
  
  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.Password);
  
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }
  
  // Create JWT token
  const token = jwt.sign(
    { userId: user.UserID, email: user.Email, role: user.Role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  return {
    userId: user.UserID,
    email: user.Email,
    role: user.Role,
    token
  };
}

export async function verifyToken(token) {
  try {
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Additional validation
    if (!decoded.userId) {
      throw new Error('Invalid token payload');
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    throw new Error('Invalid token');
  }
}

export async function getUserById(userId) {
  const [users] = await pool.execute(
    'SELECT UserID, FirstName, LastName, Email, MobileNo, Role, City, ProfilePicture FROM Users WHERE UserID = ?',
    [userId]
  );
  
  return users[0];
}