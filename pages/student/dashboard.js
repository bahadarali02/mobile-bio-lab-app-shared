// pages/student/dashboard.js
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FiPlus, FiCalendar, FiDownload, FiRefreshCw } from 'react-icons/fi';
import Layout from '../../components/Layout';
import { api } from '../../lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState({
    reservations: [],
    samples: [],
    reports: []
  });
  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' | 'samples' | 'reports'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const normalizeApiResult = (res) => {
    // Many variants: { data: [...] }, { success: true, data: [...] }, direct array [...]
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.reports && Array.isArray(res.reports)) return res.reports;
    if (res.users && Array.isArray(res.users)) return res.users;
    // fallback: try any property that's an array
    const arrProp = Object.keys(res).find(k => Array.isArray(res[k]));
    if (arrProp) return res[arrProp];
    return [];
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use api.get('reservations') so lib/api will map to /api/reservations
      const [resReservations, resSamples, resReports] = await Promise.all([
        api.get('reservation').catch(err => ({ error: err })),
        api.get('samples').catch(err => ({ error: err })),
        api.get('report').catch(err => ({ error: err }))
      ]);

      const reservations = normalizeApiResult(resReservations);
      const samples = normalizeApiResult(resSamples);
      const reports = normalizeApiResult(resReports);

      // Map items to consistent field names to avoid UI breakages
      const mappedReservations = reservations.map(r => ({
        id: r.id ?? r.ReservationID ?? r.reservationId ?? null,
        date: r.date ?? r.Date ?? r.DateTime ?? r.createdAt ?? null,
        timeSlot: r.timeSlot ?? r.TimeSlot ?? r.slot ?? null,
        location: r.location ?? r.Location ?? r.lab ?? 'Main Lab',
        status: (r.status ?? r.Status ?? 'pending').toString()
      }));

      const mappedSamples = samples.map(s => ({
        id: s.id ?? s.SampleID ?? s.sampleId ?? null,
        name: s.name ?? s.SampleName ?? s.BarcodeID ?? 'Sample',
        type: s.type ?? s.SampleType ?? s.sampleType ?? 'other',
        status: (s.status ?? s.Status ?? s.processingStatus ?? 'pending').toString(),
        date: s.date ?? s.createdAt ?? s.CollectionDateTime ?? null
      }));

      const mappedReports = reports.map(r => ({
        id: r.id ?? r.ReportID ?? r.reportId ?? null,
        title: r.title ?? r.PDFPath ?? 'Lab Report',
        sampleId: r.sampleId ?? r.SampleID ?? (r.sample && (r.sample.SampleID ?? r.sample.id)) ?? null,
        status: (r.status ?? r.Status ?? 'pending').toString(),
        date: r.date ?? r.GeneratedDate ?? r.createdAt ?? null
      }));

      setData({
        reservations: mappedReservations,
        samples: mappedSamples,
        reports: mappedReports
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // If reservation page redirected back with ?refresh=1 then refresh
    if (router.query?.refresh) {
      fetchDashboardData();
      // remove query param (keep URL clean)
      const newUrl = router.pathname;
      router.replace(newUrl, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handleSubmitSample = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // call /api/samples via api.post('samples', ...) (lib/api maps)
      await api.post('samples', formData);
      setShowSampleForm(false);
      setFormData({ name: '', type: '', description: '' });
      await fetchDashboardData();
      setActiveTab('samples');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit sample');
    } finally {
      setSubmitting(false);
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'approved' || status === 'processed' ? 'bg-green-100 text-green-800' :
      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
      status === 'rejected' ? 'bg-red-100 text-red-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchDashboardData}
              className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              <FiRefreshCw className="mr-1.5 h-3 w-3" />
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bio Lab Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your lab reservations, samples, and reports</p>
        </motion.div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['reservations', 'samples', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Reservations</h2>
                <div className="flex gap-3">
                  <button onClick={fetchDashboardData} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <FiRefreshCw className="mr-1.5 h-4 w-4" /> Refresh
                  </button>
                  <a href="/reservation" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    <FiPlus className="mr-2 h-4 w-4" /> New Reservation
                  </a>
                </div>
              </div>

              {data.reservations.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
                  <p className="mt-1 text-sm text-gray-500">Create a reservation to use lab resources.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.reservations.map((reservation, index) => (
                    <motion.div key={reservation.id ?? index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg text-gray-900">{reservation.equipment || 'Lab Equipment'}</h3>
                        <StatusBadge status={reservation.status} />
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center"><FiCalendar className="mr-2 h-4 w-4 text-gray-400" /> {reservation.date ? new Date(reservation.date).toLocaleDateString() : 'N/A'}</div>
                        <div><span className="font-medium">Time:</span> {reservation.timeSlot || 'N/A'}</div>
                        <div><span className="font-medium">Location:</span> {reservation.location}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Samples Tab */}
          {activeTab === 'samples' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Samples</h2>
                <div className="flex gap-3">
                  <button onClick={fetchDashboardData} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50"><FiRefreshCw className="mr-1.5 h-4 w-4" /> Refresh</button>
                  <button onClick={() => setShowSampleForm(true)} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                    <FiPlus className="mr-2 h-4 w-4" /> Submit Sample
                  </button>
                </div>
              </div>

              {showSampleForm && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Submit New Sample</h3>
                    <button onClick={() => setShowSampleForm(false)} className="text-gray-400 hover:text-gray-500">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <form onSubmit={handleSubmitSample} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sample Name</label>
                      <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sample Type</label>
                      <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
                        <option value="">Select type</option>
                        <option value="biological">Biological</option>
                        <option value="chemical">Chemical</option>
                        <option value="material">Material</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea rows={3} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button type="button" onClick={() => setShowSampleForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white">Cancel</button>
                      <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        {submitting ? 'Submitting...' : 'Submit Sample'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {data.samples.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No samples submitted</h3>
                  <p className="mt-1 text-sm text-gray-500">Submit your first sample to begin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.samples.map((sample, index) => (
                    <motion.div key={sample.id ?? index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md p-6">
                      <h3 className="font-medium text-lg text-gray-900">{sample.name}</h3>
                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <div><span className="font-medium text-gray-500">Type:</span> {sample.type}</div>
                        <div><span className="font-medium text-gray-500">Status:</span> <StatusBadge status={sample.status} /></div>
                        <div className="text-sm text-gray-600"><span className="font-medium text-gray-500">Submitted:</span> {sample.date ? new Date(sample.date).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Reports</h2>
                <button onClick={fetchDashboardData} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50"><FiRefreshCw className="mr-1.5 h-4 w-4" /> Refresh</button>
              </div>

              {data.reports.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No reports available</h3>
                  <p className="mt-1 text-sm text-gray-500">Reports will appear here when generated.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.reports.map((report, index) => {
                    const reportId = report.id ?? report.ReportID ?? report.reportId;
                    return (
                      <motion.div key={reportId ?? index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div>
                            <h3 className="font-medium text-lg text-gray-900">{report.title || 'Lab Report'}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                              {report.sampleId && <span>Sample: {report.sampleId}</span>}
                              <span>Date: {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={report.status} />
                            {reportId ? (
                              <a href={`/api/reports/download/${reportId}`} className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                                <FiDownload className="mr-1.5 h-3 w-3" /> Download
                              </a>
                            ) : (
                              <button disabled className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gray-400">Download</button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
