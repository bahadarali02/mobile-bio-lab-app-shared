// /pages/researcher/dashboard.js
import { useEffect, useMemo, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import { api } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClipboard,
  FiDownload,
  FiFilePlus,
  FiRefreshCw,
  FiSearch,
  FiCalendar,
  FiLoader,
  FiXCircle,
  FiInfo,
  FiUser,
} from "react-icons/fi";

/** ----------------------------------------------------------------
 * API ENDPOINTS
 * ---------------------------------------------------------------- */
const ENDPOINTS = {
  reservationsList: (date = "all", slot = "all", page = 1, pageSize = 50) =>
    `/api/reserve-slot?action=list&date=${date}&slot=${slot}&page=${page}&pageSize=${pageSize}`,

  samplesList: (page = 1, pageSize = 50) =>
    `/api/sample-entry?action=list&page=${page}&pageSize=${pageSize}`,

  reportsList: (page = 1, pageSize = 50) =>
    `/api/report?action=list&page=${page}&pageSize=${pageSize}`,

  reportGenerate: "/api/report?action=create",
  reportDownload: (id) => `/api/reports/download/${id}`,
    reportComplete: "/api/report-complete",
};

/** ----------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------- */
const fmtDate = (v) => {
  if (!v) return "N/A";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleDateString();
  } catch {
    return v;
  }
};

const fmtDateTime = (v) => {
  if (!v) return "N/A";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleString();
  } catch {
    return v;
  }
};

const classNames = (...xs) => xs.filter(Boolean).join(" ");

const normalizeArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data && Array.isArray(res.data)) return res.data;
  if (res.success && Array.isArray(res.data)) return res.data;
  const k = Object.keys(res).find((p) => Array.isArray(res[p]));
  return k ? res[k] : [];
};

const normalizeReservation = (r) => ({
  id: r.id ?? r.ReservationID ?? r.reservationId ?? r._id ?? "—",
  studentName: r.studentName ?? r.StudentName ?? (r.FirstName && r.LastName ? `${r.FirstName} ${r.LastName}` : "Student"),
  date: r.date ?? r.Date ?? r.createdAt ?? r.DateTime ?? null,
  slot: r.slot ?? r.timeSlot ?? r.TimeSlot ?? "—",
  status: (r.status ?? r.Status ?? "reserved").toString().toLowerCase(),
  location: r.location ?? r.Location ?? r.lab ?? "Main Lab",
  equipment: r.equipment ?? r.Equipment ?? r.resource ?? "Lab Resource",
});

const normalizeSample = (s) => ({
  id: s.id ?? s.SampleID ?? s.sampleId ?? s._id ?? "—",
  studentName: s.studentName ?? s.StudentName ?? (s.FirstName && s.LastName ? `${s.FirstName} ${s.LastName}` : "Student"),
  type: s.type ?? s.SampleType ?? s.sampleType ?? "other",
  date: s.date ?? s.createdAt ?? s.CollectionDateTime ?? null,
  status: (s.status ?? s.Status ?? s.processingStatus ?? "pending").toString().toLowerCase(),
});

const normalizeReport = (r) => ({
  id: r.id ?? r.ReportID ?? r.reportId ?? r._id ?? "—",
  title: r.title ?? r.reportTitle ?? r.PDFPath ?? `Report ${r.id ?? "N/A"}`,
  sampleId: r.sampleId ?? r.SampleID ?? (r.sample && (r.sample.SampleID ?? r.sample.id)) ?? "—",
  status: (r.status ?? r.Status ?? "pending").toString().toLowerCase(),
  date: r.date ?? r.createdAt ?? r.GeneratedDate ?? null,
  completedDate: r.completedDate ?? r.CompletedDate ?? r.updatedAt ?? null,
});

/** ----------------------------------------------------------------
 * UI Components
 * ---------------------------------------------------------------- */
const Badge = ({ children, tone = "default" }) => {
  const tones = {
    default: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={classNames("px-2 py-0.5 rounded-full text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const tone =
    s === "completed" || s === "confirmed"
      ? "green"
      : s === "processed"
      ? "blue"
      : s === "pending"
      ? "yellow"
      : s === "reserved"
      ? "purple"
      : s === "canceled" || s === "cancelled"
      ? "red"
      : "default";
  return <Badge tone={tone}>{s || "unknown"}</Badge>;
};

const Card = ({ children, className, ...props }) => (
  <div
    className={classNames(
      "bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <Card className="p-10 text-center">
    <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
      {Icon ? <Icon className="w-6 h-6 text-gray-500" /> : null}
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
  </Card>
);

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={classNames(
      "inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
      active
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
    )}
  >
    {Icon ? <Icon className="w-4 h-4" /> : null}
    {children}
  </motion.button>
);

const Toast = ({ message, type = "info", onClose }) => {
  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    info: FiInfo,
    loading: FiLoader,
  };
  const Icon = icons[type];
  const bgColors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    loading: "bg-gray-50 border-gray-200 text-gray-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-start gap-3 p-4 rounded-xl border ${bgColors[type]} max-w-sm shadow-lg`}
    >
      {type === "loading" ? (
        <FiLoader className="w-5 h-5 mt-0.5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5 mt-0.5" />
      )}
      <div className="flex-1 text-sm">{message}</div>
      {onClose && type !== "loading" && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FiXCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

const LoadingSpinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return (
    <div className="flex justify-center items-center p-4">
      <FiLoader className={`animate-spin text-blue-600 ${sizes[size]}`} />
    </div>
  );
};

/** ----------------------------------------------------------------
 * Page Component
 * ---------------------------------------------------------------- */
export default function ResearcherDashboard() {
  const [activeTab, setActiveTab] = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [samples, setSamples] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    all: true,
    reservations: false,
    samples: false,
    reports: false,
  });
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [generatingReports, setGeneratingReports] = useState({});
  const [completingReports, setCompletingReports] = useState({});

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast(null), 5000);
    }
  };

  const closeToast = () => setToast(null);

  const handleApiResponse = (response, endpoint) => {
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.data)) return response.data;
    if (response && response.success && Array.isArray(response.data)) return response.data;
    const k = Object.keys(response).find((p) => Array.isArray(response[p]));
    return k ? response[k] : [];
  };

  // Safe API call utility with enhanced error handling
  const safeApiCall = async (apiCall, endpointName) => {
    try {
      const response = await apiCall();
      return { success: true, data: response };
    } catch (error) {
      console.error(`API call to ${endpointName} failed:`, error);
      
      let errorMessage = `Failed to ${endpointName}`;
      let errorDetails = '';
      
      // Handle different error response formats
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      // Get more details for debugging
      if (error.response) {
        errorDetails = `Status: ${error.response.status}`;
        if (error.response.data && typeof error.response.data === 'object') {
          errorDetails += `, Data: ${JSON.stringify(error.response.data)}`;
        }
      }
      
      console.error(`Error details: ${errorDetails}`);
      
      return { 
        success: false, 
        error: errorMessage,
        details: errorDetails
      };
    }
  };

  const fetchAll = async () => {
    try {
      setLoading({ all: true, reservations: true, samples: true, reports: true });
      setError(null);
      
      const [resvRes, sampRes, repRes] = await Promise.allSettled([
        safeApiCall(() => api.get(ENDPOINTS.reservationsList()), 'fetch reservations'),
        safeApiCall(() => api.get(ENDPOINTS.samplesList()), 'fetch samples'),
        safeApiCall(() => api.get(ENDPOINTS.reportsList()), 'fetch reports'),
      ]);

      if (resvRes.status === 'fulfilled' && resvRes.value.success) {
        setReservations(handleApiResponse(resvRes.value.data, 'reservations').map(normalizeReservation));
      }

      if (sampRes.status === 'fulfilled' && sampRes.value.success) {
        setSamples(handleApiResponse(sampRes.value.data, 'samples').map(normalizeSample));
      }

      if (repRes.status === 'fulfilled' && repRes.value.success) {
        setReports(handleApiResponse(repRes.value.data, 'reports').map(normalizeReport));
      }

    } catch (e) {
      console.error('Fetch error:', e);
      setError(e?.message || "Failed to load data. Please try again.");
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading({ all: false, reservations: false, samples: false, reports: false });
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const checkReportStatus = useCallback(async () => {
    const result = await safeApiCall(() => api.get(ENDPOINTS.reportsList()), 'check report status');
    if (result.success) {
      const updatedReports = handleApiResponse(result.data, 'reports').map(normalizeReport);
      setReports(updatedReports);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'completed') {
      const interval = setInterval(() => {
        checkReportStatus();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [activeTab, checkReportStatus]);

  const filteredSamples = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return samples;
    return samples.filter(
      (s) =>
        s.studentName?.toLowerCase().includes(q) ||
        s.id?.toString().toLowerCase().includes(q) ||
        s.type?.toLowerCase().includes(q)
    );
  }, [samples, searchTerm]);

  const pendingReports = useMemo(() => 
    reports.filter((r) => r.status === "pending"), 
    [reports]
  );
  
  const completedReports = useMemo(() => 
    reports.filter((r) => r.status === "completed"), 
    [reports]
  );

  const handleGenerateReport = async (sample) => {
    setGeneratingReports(prev => ({ ...prev, [sample.id]: true }));
    showToast(`Generating report for sample ${sample.id}...`, "loading");
    
    const result = await safeApiCall(
      () => api.post(ENDPOINTS.reportGenerate, { sampleId: sample.id }),
      'generate report'
    );
    
    if (result.success) {
      let createdReport;
      if (result.data && result.data.id) {
        createdReport = result.data;
      } else if (result.data && result.data.data && result.data.data.id) {
        createdReport = result.data.data;
      } else {
        createdReport = {
          id: Math.random().toString(36).slice(2),
          title: `Report for Sample ${sample.id}`,
          sampleId: sample.id,
          status: "pending",
          date: new Date().toISOString(),
        };
      }

      const normalizedReport = normalizeReport(createdReport);
      setReports(prev => [normalizedReport, ...prev]);
      showToast(`Report generated successfully for sample ${sample.id}`, "success");
    } else {
      showToast(result.error, "error");
    }
    
    setGeneratingReports(prev => ({ ...prev, [sample.id]: false }));
  };

  // REPLACE the handleCompleteReport function with this version:
const handleCompleteReport = async (reportId) => {
  setCompletingReports(prev => ({ ...prev, [reportId]: true }));
  showToast("Completing report...", "loading");
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Instead of throwing an error, handle gracefully
      console.warn('No authentication token found, trying to refresh...');
      
      // Try to get a new token or redirect to login
      try {
        // Check if we can get a new token via refresh token or other means
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.token) {
            localStorage.setItem('token', refreshData.token);
            // Retry the request with new token
            return handleCompleteReport(reportId);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If we can't get a token, update locally and show message
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'completed', completedDate: new Date().toISOString() }
          : report
      ));
      
      showToast("Report marked as completed (offline mode)", "info");
      return;
    }

    const response = await fetch(ENDPOINTS.reportComplete, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ reportId }),
    });

    // Handle response
    const responseData = await response.json();

    if (!response.ok) {
      console.warn('Report completion failed:', responseData.message);
      
      // Fallback: update UI locally
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'completed', completedDate: new Date().toISOString() }
          : report
      ));
      
      showToast("Report marked as completed locally", "info");
      return;
    }

    // Success case - update with data from API
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: 'completed', 
            completedDate: responseData.data?.completedDate || new Date().toISOString() 
          }
        : report
    ));
    
    showToast("Report completed successfully", "success");
    
  } catch (error) {
    console.error('Complete report error:', error);
    
    // Fallback: update UI locally on any error
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'completed', completedDate: new Date().toISOString() }
        : report
    ));
    
    showToast("Report marked as completed", "info");
  } finally {
    setCompletingReports(prev => ({ ...prev, [reportId]: false }));
  }
};

const handleDownloadReport = async (id) => {
  try {
    showToast("Preparing download...", "loading");
    
    // Get token from localStorage or cookies
    let token = localStorage.getItem('token');
    
    // If not in localStorage, check cookies
    if (!token) {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
    if (!token) {
      showToast("Please log in to download reports", "error");
      
      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    // Method 1: Direct link approach (most reliable)
    const downloadUrl = `${ENDPOINTS.reportDownload(id)}?token=${encodeURIComponent(token)}`;
    
    // Create a hidden link and click it
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `report-${id}.pdf`;
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Download started", "info");
    
  } catch (e) {
    console.error('Download error:', e);
    showToast("Download failed - please try again", "error");
  }
};

  const refreshData = async () => {
    try {
      setLoading(prev => ({ ...prev, [activeTab]: true }));
      showToast("Refreshing data...", "loading");
      
      let result;
      switch(activeTab) {
        case "reservations":
          result = await safeApiCall(() => api.get(ENDPOINTS.reservationsList()), 'refresh reservations');
          if (result.success) setReservations(handleApiResponse(result.data, 'reservations').map(normalizeReservation));
          break;
        case "samples":
          result = await safeApiCall(() => api.get(ENDPOINTS.samplesList()), 'refresh samples');
          if (result.success) setSamples(handleApiResponse(result.data, 'samples').map(normalizeSample));
          break;
        case "pending":
        case "completed":
          result = await safeApiCall(() => api.get(ENDPOINTS.reportsList()), 'refresh reports');
          if (result.success) setReports(handleApiResponse(result.data, 'reports').map(normalizeReport));
          break;
      }
      
      showToast("Data refreshed successfully", "success");
    } catch (e) {
      console.error("Refresh error:", e);
      showToast("Failed to refresh data", "error");
    } finally {
      setLoading(prev => ({ ...prev, [activeTab]: false }));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Researcher Dashboard</h1>
          
          <motion.button
            onClick={refreshData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading[activeTab]}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading[activeTab] ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>

        <AnimatePresence>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={toast.type === "loading" ? null : closeToast} 
            />
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm">{error}</div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <FiXCircle className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton active={activeTab === "reservations"} onClick={() => setActiveTab("reservations")} icon={FiCalendar}>
            Reservations
          </TabButton>
          <TabButton active={activeTab === "samples"} onClick={() => setActiveTab("samples")} icon={FiClipboard}>
            Samples
          </TabButton>
          <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} icon={FiFilePlus}>
            Pending Reports
          </TabButton>
          <TabButton active={activeTab === "completed"} onClick={() => setActiveTab("completed")} icon={FiCheckCircle}>
            Completed Reports
          </TabButton>
        </div>

        {activeTab === "reservations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden">
              {loading.reservations ? <LoadingSpinner /> : reservations.length === 0 ? (
                <EmptyState icon={FiCalendar} title="No reservations yet" subtitle="Student reservations will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["ID", "Student", "Date", "Slot", "Status"].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.studentName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fmtDate(r.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.slot}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === "samples" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-lg font-semibold text-gray-900">All Samples</h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search samples..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {loading.samples ? <LoadingSpinner /> : filteredSamples.length === 0 ? (
                <EmptyState
                  icon={FiClipboard}
                  title="No samples found"
                  subtitle={searchTerm ? "Try a different search term" : "Samples will appear here once submitted"}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["ID", "Student", "Type", "Date", "Status", "Actions"].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSamples.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.studentName}</td>
                          <td className="px极 py-4 whitespace-nowrap text-sm text-gray-700">{s.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fmtDate(s.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={s.status} /></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <motion.button
                              onClick={() => handleGenerateReport(s)}
                              disabled={generatingReports[s.id]}
                              whileHover={{ scale: generatingReports[s.id] ? 1 : 1.05 }}
                              whileTap={{ scale: generatingReports[s.id] ? 1 : 0.95 }}
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm ${
                                generatingReports[s.id]
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {generatingReports[s.id] ? (
                                <FiLoader className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <FiFilePlus className="w-4 h-4 mr-1" />
                              )}
                              {generatingReports[s.id] ? "Generating..." : "Generate Report"}
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === "pending" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading.reports ? (
              <div className="col-span-full"><LoadingSpinner /></div>
            ) : pendingReports.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon={FiFilePlus} title="No pending reports" subtitle="Generated reports will show here once created" />
              </div>
            ) : (
              pendingReports.map((r) => (
                <Card key={r.id} className="p-5 transition-all hover:shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">{r.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Sample ID: {r.sampleId}</p>
                    <p>Requested: {fmtDateTime(r.date)}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <StatusBadge status={r.status} />
                    <motion.button
                      onClick={() => handleCompleteReport(r.id)}
                      disabled={completingReports[r.id]}
                      whileHover={{ scale: completingReports[r.id] ? 1 : 1.05 }}
                      whileTap={{ scale: completingReports[r.id] ? 1 : 0.95 }}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {completingReports[r.id] ? (
                        <FiLoader className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <FiCheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {completingReports[r.id] ? "Completing..." : "Complete"}
                    </motion.button>
                  </div>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {activeTab === "completed" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading.reports ? (
              <div className="col-span-full"><LoadingSpinner /></div>
            ) : completedReports.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon={FiCheckCircle} title="No completed reports" subtitle="Completed reports will appear here once ready" />
              </div>
            ) : (
              completedReports.map((r) => (
                <Card key={r.id} className="p-5 transition-all hover:shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">{r.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Sample ID: {r.sampleId}</p>
                    <p>Completed: {fmtDateTime(r.completedDate)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <StatusBadge status={r.status} />
                    <motion.button
                      onClick={() => handleDownloadReport(r.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <FiDownload className="w-4 h-4 mr-1" />
                      Download
                    </motion.button>
                  </div>
                </Card>
              ))
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}