//pages/reservation.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaUserClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Reservation() {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const router = useRouter();

  // Initialize time slots and check auth
  useEffect(() => {
    // Initialize time slots (9am to 5pm)
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00 - ${hour + 1}:00`);
    }
    setTimeSlots(slots);

    // Fetch data if date is set
    if (date) {
      fetchBookedSlots();
      fetchUserReservations();
    }
  }, [date]);

  const fetchBookedSlots = async () => {
    try {
      setLoadingSlots(true);
      setError('');
      const dateString = date.toISOString().split('T')[0];
      const response = await fetch(`/api/reserve-slot?date=${dateString}`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch booked slots');
      }
      
      const data = await response.json();
      setBookedSlots(data.map(reservation => reservation.TimeSlot));
    } catch (err) {
      console.error('Error fetching booked slots:', err);
      setError(err.message.includes('{') ? 'Failed to load availability' : err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchUserReservations = async () => {
    try {
      setLoadingReservations(true);
      setError('');
      const response = await fetch('/api/reserve-slot?user=true', {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch your reservations');
      }
      
      const data = await response.json();
      setUserReservations(data);
    } catch (err) {
      console.error('Error fetching user reservations:', err);
      setError(err.message.includes('{') ? 'Failed to load your reservations' : err.message);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
    setSelectedSlot('');
    setSuccess('');
    setError('');
  };

  const handleSlotSelect = (slot) => {
    const slotStart = slot.split(' - ')[0];
    if (bookedSlots.includes(slotStart)) {
      setError('This time slot is already booked. Please select another time.');
      return;
    }
    setSelectedSlot(slot);
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!selectedSlot) {
      setError('Please select a time slot');
      setLoading(false);
      return;
    }
    
    try {
      const slotStart = selectedSlot.split(' - ')[0];
      const dateString = date.toISOString().split('T')[0];
      
      const response = await fetch('/api/reserve-slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          date: dateString,
          timeSlot: slotStart
        })
      });
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          // Slot was just booked - refresh availability and show specific message
          await fetchBookedSlots();
          setError('This time slot was just booked. Please select another time.');
          return;
        }
        throw new Error(data.message || 'Reservation failed. Please try again.');
      }
      
      setSuccess('Reservation created successfully!');
      setSelectedSlot('');
      // Refresh both availability and user reservations
      await Promise.all([fetchBookedSlots(), fetchUserReservations()]);
    } catch (err) {
      console.error('Reservation error:', err);
      setError(err.message || 'Failed to create reservation. Please try again.');
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Reservation</h1>
          <p className="text-lg text-gray-600">Book your lab time slot for experiments</p>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-md"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
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
              <div className="flex-shrink-0">
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <FaCalendarAlt className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Select Date</h2>
              </div>
              
              <div className="border rounded-xl p-4">
                <Calendar
                  date={date}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  color="#6366F1"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <FaClock className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Available Time Slots</h2>
              </div>
              
              {date ? (
                <>
                  {loadingSlots ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {timeSlots.map((slot) => {
                          const isBooked = bookedSlots.includes(slot.split(' - ')[0]);
                          const isSelected = selectedSlot === slot;
                          
                          return (
                            <motion.button
                              key={slot}
                              type="button"
                              onClick={() => handleSlotSelect(slot)}
                              disabled={isBooked}
                              whileHover={{ scale: isBooked ? 1 : 1.03 }}
                              whileTap={{ scale: isBooked ? 1 : 0.98 }}
                              className={`py-3 px-4 border rounded-lg text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700 shadow-sm'
                                  : isBooked
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                              }`}
                            >
                              {slot}
                              {isBooked && <span className="block text-xs mt-1">Booked</span>}
                            </motion.button>
                          );
                        })}
                      </div>
                      
                      {selectedSlot && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-indigo-50 p-6 rounded-xl border border-indigo-100"
                        >
                          <h3 className="text-lg font-medium text-indigo-800 mb-2">Selected Reservation</h3>
                          <p className="text-indigo-600 mb-6">
                            {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedSlot}
                          </p>
                          
                          <motion.button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                              loading ? 'opacity-80 cursor-not-allowed' : ''
                            }`}
                          >
                            {loading ? (
                              <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </div>
                            ) : (
                              'Confirm Reservation'
                            )}
                          </motion.button>
                        </motion.div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <p className="text-gray-500">Please select a date to view available time slots</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Your Reservations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                <FaUserClock className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Your Reservations</h2>
            </div>
            
            {loadingReservations ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : userReservations.length > 0 ? (
              <div className="space-y-4">
                {userReservations.map(reservation => (
                  <div key={reservation.ReservationID} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(reservation.Date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-gray-600">
                          {reservation.TimeSlot}:00 - {parseInt(reservation.TimeSlot.split(':')[0]) + 1}:00
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.Status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.Status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any reservations yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}