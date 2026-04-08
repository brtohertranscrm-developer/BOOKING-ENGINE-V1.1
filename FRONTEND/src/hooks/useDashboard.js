import { useState, useEffect, useCallback } from 'react';

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    activeMotors: 0,
    activeLockers: 0,
    pendingKyc: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // 1. Fungsi penarik token yang selalu fresh (segar)
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 2. Tembak API Stats dengan header dinamis
      const resStats = await fetch(`${API_URL}/api/admin/stats`, {
        headers: getAuthHeaders() 
      });
      const dataStats = await resStats.json();
      if (dataStats.success) setStats(dataStats.data);

      // 3. Tembak API Bookings dengan header dinamis
      const resBookings = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: getAuthHeaders() 
      });
      const dataBookings = await resBookings.json();
      if (dataBookings.success) setRecentBookings(dataBookings.data.slice(0, 4));
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]); // Hapus authToken dari dependency karena sudah ditarik otomatis di dalam

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0);
  };

  return { isLoading, stats, recentBookings, formatRupiah };
};