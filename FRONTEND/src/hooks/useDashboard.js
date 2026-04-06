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

  const authToken = localStorage.getItem('admin_token') || localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const resStats = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const dataStats = await resStats.json();
      if (dataStats.success) setStats(dataStats.data);

      const resBookings = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const dataBookings = await resBookings.json();
      if (dataBookings.success) setRecentBookings(dataBookings.data.slice(0, 4));
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, API_URL]);

  useEffect(() => {
    if (authToken) fetchDashboardData();
  }, [fetchDashboardData, authToken]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0);
  };

  return { isLoading, stats, recentBookings, formatRupiah };
};