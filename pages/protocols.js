import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiDownload, 
  FiFileText, 
  FiDroplet, 
  FiGlobe, 
  FiLeaf,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import Head from 'next/head';

export default function Protocols() {
  const [protocols, setProtocols] = useState([]);
  const [filter, setFilter] = useState({
    experimentType: '',
    sampleType: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetchProtocols() {
      try {
        const authResponse = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!authResponse.ok) throw new Error('Not authenticated');
        
        const protocolsResponse = await fetch('/api/protocols');
        if (!protocolsResponse.ok) throw new Error('Failed to fetch protocols');
        
        const data = await protocolsResponse.json();
        setProtocols(data.protocols);
      } catch (error) {
        console.error('Protocols page error:', error);
        setError(error.message);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuthAndFetchProtocols();
  }, [router]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const filteredProtocols = protocols.filter(protocol => {
    return (
      (filter.experimentType === '' || protocol.ExperimentType === filter.experimentType) &&
      (filter.sampleType === '' || protocol.SampleType === filter.sampleType)
    );
  });

  const getIconForType = (type) => {
    switch(type.toLowerCase()) {
      case 'water': return <FiDroplet className="text-blue-500" />;
      case 'soil': return <FiGlobe className="text-amber-500" />;
      case 'plant': return <FiLeaf className="text-green-500" />;
      default: return <FiFileText className="text-gray-500" />;
    }
  };

  return (
    <>
      <Head>
        <title>Protocol Guide | Mobile Bio Lab</title>
        <meta name="description" content="Standard operating procedures for all experiments" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4"
            >
              Sample Protocol Guide
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Standard operating procedures for all laboratory experiments
            </motion.p>
            <motion.a
              href="#protocols"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              View Protocols
            </motion.a>
          </div>
        </motion.section>

        {/* Main Content */}
        <main id="protocols" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 mb-12"
          >
            <div className="flex items-center mb-4">
              <FiFilter className="text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Filter Protocols</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="experimentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Experiment Type
                </label>
                <select
                  id="experimentType"
                  name="experimentType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter.experimentType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Experiment Types</option>
                  <option value="Water Analysis">Water Analysis</option>
                  <option value="Soil Testing">Soil Testing</option>
                  <option value="Plant Biology">Plant Biology</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sampleType" className="block text-sm font-medium text-gray-700 mb-1">
                  Sample Type
                </label>
                <select
                  id="sampleType"
                  name="sampleType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter.sampleType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Sample Types</option>
                  <option value="water">Water</option>
                  <option value="soil">Soil</option>
                  <option value="plant">Plant</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Error Handling */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8"
            >
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {/* Protocols List */}
          <AnimatePresence>
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProtocols.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                      <FiFileText className="w-full h-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No protocols found</h3>
                    <p className="mt-2 text-gray-600">Try adjusting your filters</p>
                  </motion.div>
                ) : (
                  filteredProtocols.map((protocol) => (
                    <motion.div
                      key={protocol.ProtocolID}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-3 rounded-lg bg-indigo-50 text-indigo-600">
                            {getIconForType(protocol.SampleType)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">{protocol.Title}</h3>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {protocol.ExperimentType}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {protocol.SampleType}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-4 text-gray-600 line-clamp-3">
                          {protocol.Description}
                        </p>
                        
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>
                              {new Date(protocol.UpdatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {protocol.FilePath && (
                            <a
                              href={protocol.FilePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <FiDownload className="mr-2" />
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}