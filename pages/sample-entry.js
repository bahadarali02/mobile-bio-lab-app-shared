import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  FaFlask, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaBarcode, 
  FaBluetoothB,
  FaThermometerHalf,
  FaWater,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import Head from 'next/head';

export default function SampleEntry() {
  const [formData, setFormData] = useState({
    sampleType: 'water',
    geoLocation: '',
    collectionDateTime: new Date().toISOString().slice(0, 16),
    barcodeID: '',
    temperature: '',
    pH: '',
    salinity: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        router.push('/login');
      }
    }
    
    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sample-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Sample submission failed');
      }
      
      setSuccess('Sample submitted successfully!');
      setFormData({
        sampleType: 'water',
        geoLocation: '',
        collectionDateTime: new Date().toISOString().slice(0, 16),
        barcodeID: '',
        temperature: '',
        pH: '',
        salinity: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const connectBLEDevice = async () => {
    try {
      setIsLoading(true);
      setError('');
      // Simulate BLE connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(true);
      setDeviceName('BioSensor-001');
      setFormData(prev => ({
        ...prev,
        pH: '7.2',
        temperature: '24.5'
      }));
    } catch (error) {
      setError('Failed to connect to BLE device');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sample Entry | Mobile Bio Lab</title>
        <meta name="description" content="Submit biological sample data" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sample Data Collection</h1>
            <p className="text-lg text-gray-600">Record biological sample measurements</p>
          </motion.div>

          {/* Status Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-md"
            >
              <div className="flex items-center">
                <FaTimesCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-md"
            >
              <div className="flex items-center">
                <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Sample Info Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FaFlask className="text-indigo-600 mr-3" />
                    Sample Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sampleType" className="block text-sm font-medium text-gray-700 mb-1">
                        Sample Type
                      </label>
                      <select
                        id="sampleType"
                        name="sampleType"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border"
                        value={formData.sampleType}
                        onChange={handleChange}
                      >
                        <option value="water">Water Sample</option>
                        <option value="soil">Soil Sample</option>
                        <option value="plant">Plant Sample</option>
                        <option value="tissue">Tissue Sample</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="collectionDateTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Collection Date & Time
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="datetime-local"
                          id="collectionDateTime"
                          name="collectionDateTime"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.collectionDateTime}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FaMapMarkerAlt className="text-indigo-600 mr-3" />
                    Location Data
                  </h2>
                  <div>
                    <label htmlFor="geoLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Geographic Coordinates
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="geoLocation"
                        name="geoLocation"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., 40.7128° N, 74.0060° W"
                        value={formData.geoLocation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Barcode & BLE Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FaBarcode className="text-indigo-600 mr-3" />
                    Identification & Sensors
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="barcodeID" className="block text-sm font-medium text-gray-700 mb-1">
                        Barcode/QR Identifier
                      </label>
                      <div className="flex rounded-md shadow-sm">
                        <div className="relative flex-grow focus-within:z-10">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaBarcode className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="barcodeID"
                            name="barcodeID"
                            className="block w-full rounded-none rounded-l-md pl-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Scan or enter ID"
                            value={formData.barcodeID}
                            onChange={handleChange}
                          />
                        </div>
                        <button
                          type="button"
                          className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <FaBarcode className="h-4 w-4 text-gray-400" />
                          <span>Scan</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BLE Sensor Connection
                      </label>
                      <div className="flex items-center space-x-3">
                        <motion.button
                          type="button"
                          onClick={connectBLEDevice}
                          disabled={isConnected || isLoading}
                          whileHover={{ scale: isConnected ? 1 : 1.03 }}
                          whileTap={{ scale: isConnected ? 1 : 0.98 }}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isConnected 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : isLoading 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Connecting...
                            </>
                          ) : isConnected ? (
                            <>
                              <FaBluetoothB className="-ml-1 mr-2 h-4 w-4" />
                              Connected
                            </>
                          ) : (
                            <>
                              <FaBluetoothB className="-ml-1 mr-2 h-4 w-4" />
                              Connect Sensor
                            </>
                          )}
                        </motion.button>
                        {isConnected && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {deviceName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Measurements Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FaThermometerHalf className="text-indigo-600 mr-3" />
                    Sample Measurements
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature (°C)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaThermometerHalf className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="temperature"
                          name="temperature"
                          step="0.1"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="25.0"
                          value={formData.temperature}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pH" className="block text-sm font-medium text-gray-700 mb-1">
                        pH Level
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaWater className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="pH"
                          name="pH"
                          min="0"
                          max="14"
                          step="0.1"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="7.0"
                          value={formData.pH}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="salinity" className="block text-sm font-medium text-gray-700 mb-1">
                        Salinity (ppt)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaWater className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="salinity"
                          name="salinity"
                          step="0.1"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="35.0"
                          value={formData.salinity}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.03 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Sample'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}