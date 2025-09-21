// pages/api/devices.js
import { authMiddleware } from '../../lib/middleware';

export default async function handler(req, res) {
  try {
    // ✅ Protect route
    await authMiddleware(req, res);

    if (req.method === 'GET') {
      // Return list of all devices (mock/test data or DB query)
      return res.status(200).json({
        success: true,
        devices: [
          { id: 1, name: 'BLE Device A', status: 'connected', batteryLevel: 85, firmwareVersion: '1.2.0', lastActive: '2025-09-09 10:30' },
          { id: 2, name: 'BLE Device B', status: 'disconnected', batteryLevel: 40, firmwareVersion: '1.1.0', lastActive: '2025-09-08 17:45' }
        ]
      });
    }

    if (req.method === 'POST') {
      // 🔹 Handle actions like restart/update from TechnicianDashboard
      const { deviceId, action } = req.body;

      if (!deviceId || !action) {
        return res.status(400).json({
          success: false,
          message: 'deviceId and action are required'
        });
      }

      // 👉 Here add your DB update / BLE command logic
      // For now just mock a response
      console.log(`Device ${deviceId} action requested: ${action}`);

      // Example: mark device action as success
      return res.status(200).json({
        success: true,
        message: `Action '${action}' executed for device ${deviceId}`
      });
    }

    // ❌ If not GET or POST
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('Devices API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
