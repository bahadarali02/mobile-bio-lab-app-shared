import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { api } from '../../lib/api'; // Changed to named import
import { useBLEDevice } from '../../hooks/useBLEDevice';

export default function TechnicianDashboard() {
  const [devices, setDevices] = useState([]);
  const [protocolUpdates, setProtocolUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bleStatus, refreshStatus } = useBLEDevice();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resDevices, resProtocols] = await Promise.all([
          api.get('devices'), // Removed /api prefix
          api.get('protocols') // Removed /api prefix
        ]);
        setDevices(resDevices.data || []);
        setProtocolUpdates(resProtocols.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeviceAction = async (deviceId, action) => {
    try {
      await api.post(`devices/${deviceId}/${action}`); // Removed /api prefix
      // Refresh device status
      const res = await api.get('devices'); // Removed /api prefix
      setDevices(res.data || []);
    } catch (error) {
      console.error(`Error ${action} device:`, error);
    }
  };

   return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Technician Dashboard
          </motion.h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className={`h-3 w-3 rounded-full ${
                bleStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">BLE: {bleStatus}</span>
            </div>
            <button
              onClick={refreshStatus}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <FiRefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          >
            <div className="flex items-center">
              <FiAlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('devices')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'devices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Devices
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'protocols'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Protocol Updates
            </button>
          </nav>
        </div>

        {activeTab === 'devices' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">BLE Device Management</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-48 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <motion.div
                    key={device.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg flex items-center">
                          <FiBluetooth className="h-5 w-5 text-blue-500 mr-2" />
                          {device.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">ID: {device.id}</p>
                      </div>
                      <DeviceStatus status={device.status} />
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Active:</span>
                        <span>{device.lastActive || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Battery:</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              device.batteryLevel > 50 ? 'bg-green-500' : 
                              device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${device.batteryLevel}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{device.batteryLevel}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Firmware:</span>
                        <span>{device.firmwareVersion || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-2">
                      <button
                        onClick={() => handleDeviceAction(device.id, 'restart')}
                        disabled={device.status !== 'online'}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                          device.status === 'online'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiPower className="h-4 w-4" />
                        <span>Restart</span>
                      </button>
                      <button
                        onClick={() => handleDeviceAction(device.id, 'update')}
                        disabled={device.status !== 'online'}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                          device.status === 'online'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiUpload className="h-4 w-4" />
                        <span>Update</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Protocol Updates</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-32 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {protocolUpdates.map((protocol) => (
                  <motion.div
                    key={protocol.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{protocol.name}</h3>
                        <div className="mt-1 flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Version: {protocol.version}</span>
                          <span className="text-sm text-gray-500">Released: {protocol.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`/api/protocols/download/${protocol.id}`}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200"
                        >
                          <FiDownload className="h-4 w-4" />
                          <span>Download</span>
                        </a>
                        <button
                          onClick={() => handleProtocolPush(protocol.id)}
                          disabled={!protocol.requiresUpdate}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                            protocol.requiresUpdate
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <FiUpload className="h-4 w-4" />
                          <span>Push Update</span>
                        </button>
                      </div>
                    </div>
                    
                    {protocol.changes && protocol.changes.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Changes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {protocol.changes.map((change, index) => (
                            <li key={index}>{change}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}