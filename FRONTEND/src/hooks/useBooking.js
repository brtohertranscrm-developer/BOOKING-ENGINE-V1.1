import { useState, useEffect, useCallback } from 'react';

export const useBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. URL Dinamis
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // 2. Fungsi penarik token segar
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: getAuthHeaders() // Gunakan header dinamis
      });
      const result = await response.json();
      if (result.success) setBookings(result.data);
    } catch (error) {
      console.error("Gagal mengambil data booking:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const updateBookingStatus = async (orderId, data) => {
    try {
      await fetch(`${API_URL}/api/admin/bookings/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Gunakan header dinamis
        body: JSON.stringify(data)
      });
      fetchBookings(); // Refresh data setelah update
    } catch (error) { 
      console.error(error); 
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); // Dependency yang aman tanpa peringatan eslint

  return { bookings, loading, updateBookingStatus };
};