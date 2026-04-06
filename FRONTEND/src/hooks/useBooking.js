import { useState, useEffect, useCallback } from 'react';

export const useBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) setBookings(result.data);
    } catch (error) {
      console.error("Gagal mengambil data booking:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateBookingStatus = async (orderId, data) => {
    try {
      await fetch(`http://localhost:5001/api/admin/bookings/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      fetchBookings(); // Refresh data setelah update
    } catch (error) { console.error(error); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, updateBookingStatus };
};