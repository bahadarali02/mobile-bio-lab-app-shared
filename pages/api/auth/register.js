import pool from '../../../lib/db'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  let connection
  try {
    // Parse form data
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: path.join(process.cwd(), 'public/uploads'),
    })

    const [fields, files] = await form.parse(req)

    // Extract form fields
    const firstName = fields.firstName?.[0] || ''
    const lastName = fields.lastName?.[0] || ''
    const studentVUId = fields.studentVUId?.[0] || ''
    const email = fields.email?.[0] || ''
    const mobileNumber = fields.mobileNumber?.[0] || null
    const role = fields.role?.[0] || 'student'
    const city = fields.city?.[0] || null
    const password = fields.password?.[0] || ''
    const confirmPassword = fields.confirmPassword?.[0] || ''

    // Basic validation
    if (!firstName || !lastName || !email || !password || !role || !studentVUId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Validate VU email format
    if (!email.endsWith('@vu.edu')) {
      return res.status(400).json({ message: 'Must use a VU email address' })
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Get database connection
    connection = await pool.getConnection()

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT UserID FROM users WHERE Email = ? OR StudentVUId = ?',
      [email, studentVUId]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email or Student VU ID already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = uuidv4()

    // Handle profile picture upload
    let profilePicturePath = null
    if (files.profilePicture && files.profilePicture[0]) {
      const file = files.profilePicture[0]
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const newFilename = `profile-${uniqueSuffix}${path.extname(file.originalFilename)}`
      const newPath = path.join(process.cwd(), 'public/uploads', newFilename)
      
      // Move file to permanent location
      fs.renameSync(file.filepath, newPath)
      profilePicturePath = `/uploads/${newFilename}`
    }

    // Create user
    const [result] = await connection.execute(
      `INSERT INTO users 
       (FirstName, LastName, StudentVUId, Email, MobileNumber, Role, City, ProfilePicture, Password, Verified, VerificationToken, CreatedAt, UpdatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [firstName, lastName, studentVUId, email, mobileNumber, role, city, profilePicturePath, hashedPassword, false, verificationToken]
    )

    // Send verification email - FIXED THIS LINE
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}&studentId=${studentVUId}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email for Mobile Bio Lab',
      html: `
        <p>Hello ${firstName},</p>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link is specifically for your Student VU ID: ${studentVUId}</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    })

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      userId: result.insertId
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A user with this email or student ID already exists' })
    }
    
    res.status(500).json({ message: 'Internal server error' })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}