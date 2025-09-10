import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi';
import Head from 'next/head';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        setError('');
       
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
       
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
       
        const data = await response.json();
       
        if (!data.user) {
          throw new Error('User data not available');
        }
       
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          mobileNo: data.user.mobileNo || '',
          city: data.user.city || ''
        });
      } catch (error) {
        console.error('Profile page error:', error);
        setError(error.message);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
   
    fetchUser();
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
   
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
     
      const data = await response.json();
     
      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }
     
      setSuccess('Profile updated successfully!');
      setUser(prev => ({
        ...prev,
        ...formData
      }));
    } catch (err) {
      setError(err.message);
    }
  };

const handleExport = async () => {
  try {
    setExporting(true);
    
    // First test with simple jsPDF endpoint
    // const response = await fetch('/api/export/test-jspdf', {
    
    // Then test with profile endpoint
    const response = await fetch('/api/export/profile-jspdf', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server returned ${response.status}`);
    }
    
    // Create blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.firstName}-${user.lastName}-profile.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('Export error:', error);
    alert(`Failed to export PDF: ${error.message}`);
  } finally {
    setExporting(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Profile not available</h3>
          <p className="mt-1 text-sm text-gray-500">Please log in to view your profile</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Profile | Mobile Bio Lab</title>
        <meta name="description" content="Manage your account information" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage your account information
              </p>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" />
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="md:flex">
                {/* Profile Picture Section */}
                <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser className="h-20 w-20 text-indigo-500" />
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    >
                      <FiCamera className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                    {user.role || 'member'}
                  </span>
                  
                  {/* PDF Export Button */}
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FiDownload className="mr-2 h-4 w-4" />
                        Download My Profile (PDF)
                      </>
                    )}
                  </button>
                </div>

                {/* Profile Form Section */}
                <div className="md:w-2/3 p-8">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                          <FiUser className="mr-2 text-indigo-500" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                              <FiMail className="mr-2 text-gray-400" />
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                              value={formData.email}
                              disabled
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 flex items-center">
                              <FiPhone className="mr-2 text-gray-400" />
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              id="mobileNo"
                              name="mobileNo"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.mobileNo}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 flex items-center">
                              <FiMapPin className="mr-2 text-gray-400" />
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}