// pages/api/devices.js
import { authMiddleware } from '../../lib/middleware';

export default async function handler(req, res) {
  try {
    await authMiddleware(req, res);

    if (req.method === 'GET') {
      // Filhaal test data
      return res.status(200).json({
        success: true,
        devices: [
          { id: 1, name: 'BLE Device A', status: 'connected' },
          { id: 2, name: 'BLE Device B', status: 'disconnected' }
        ]
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Devices API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
