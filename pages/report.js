import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiDownload, FiCalendar, FiMapPin, FiThermometer, FiDroplet, FiFileText } from 'react-icons/fi';

export default function ReportDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/report', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        setReports(data.data || []);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err.message);
        if (err.message.includes('Authentication')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

 const handleDownload = async (reportId) => {
  try {
    // Create a hidden anchor tag to trigger download
    const link = document.createElement('a');
    link.href = `/api/reports/download/${reportId}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (err) {
    console.error('Download error:', err);
    setError('Failed to download report');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Lab Reports</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and download your sample analysis reports
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-red-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {reports.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't generated any reports yet.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {reports.map((report) => (
                <li key={report.ReportID} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-blue-600">
                          {report.SampleType} - #{report.SampleID}
                        </h3>
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>
                            {new Date(report.CollectionDateTime).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>{report.GeoLocation || 'Unknown location'}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FiThermometer className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>{report.Temperature}°C</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FiDroplet className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>pH {report.pH}, Salinity {report.Salinity}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        <span className="font-medium">Researcher:</span> {report.FirstName} {report.LastName}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <button
                        onClick={() => handleDownload(report.ReportID)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiDownload className="-ml-0.5 mr-2 h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}