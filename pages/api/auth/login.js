import { loginUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await loginUser(email, password);

    // Set secure HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `token=${user.token}; Path=/; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax; Max-Age=${3600}`
    ]);

    // FIX: Add proper role-based redirect logic
    let redirectTo;
    switch (user.role) {
      case 'admin':
        redirectTo = '/admin/dashboard';
        break;
      case 'student':
        redirectTo = '/student/dashboard';
        break;
      case 'researcher':
        redirectTo = '/researcher/dashboard';
        break;
      case 'technician':
        redirectTo = '/technician/dashboard';
        break;
      default:
        redirectTo = '/dashboard';
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
      redirectTo // This now matches the login page logic
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === 'User not found' || error.message === 'Invalid password') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}