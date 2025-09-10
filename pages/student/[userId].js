import { getSession } from 'next-auth/react';
import db from '@/lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      // Fetch student data with related records
      const student = await db.user.findUnique({
        where: { id: userId },
        include: {
          reservations: {
            where: { 
              endTime: { gt: new Date() } 
            },
            orderBy: { startTime: 'asc' }
          },
          samples: true,
          reports: true
        }
      });

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      return res.status(200).json(student);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}