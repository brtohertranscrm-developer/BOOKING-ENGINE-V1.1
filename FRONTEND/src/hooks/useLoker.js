import { useState, useEffect, useCallback } from 'react';

export const useLoker = () => {
  const [lockers, setLockers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Gunakan URL dinamis agar aman saat web di-hosting
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // 2. Fungsi penarik token yang selalu fresh (segar) saat fungsi dipanggil
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchLockers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/lockers`, {
        headers: getAuthHeaders() // Gunakan header dinamis
      });
      const data = await res.json();
      if (data.success) setLockers(data.data);
    } catch (error) {
      console.error('Gagal mengambil data loker:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]); // authToken tidak lagi jadi dependency

  const addLocker = async (newLocker) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/lockers`, {
        method: 'POST',
        headers: getAuthHeaders(), // Gunakan header dinamis
        body: JSON.stringify({
          ...newLocker,
          price_per_hour: Number(newLocker.price_per_hour)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Loker ${newLocker.locker_number} berhasil ditambahkan!`);
        fetchLockers(); 
        return true;
      }
      return false;
    } catch (error) {
      alert('Koneksi gagal.');
      return false;
    }
  };

  const updateLockerStatus = async (id, currentStatus) => {
    if (currentStatus === 'occupied') {
      alert('Loker sedang digunakan pelanggan!');
      return;
    }
    const newStatus = currentStatus === 'available' ? 'maintenance' : 'available';
    if (!window.confirm(`Ubah status ke ${newStatus}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/lockers/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Gunakan header dinamis
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) fetchLockers(); 
    } catch (error) {
      alert('Gagal update.');
    }
  };

  useEffect(() => {
    fetchLockers();
  }, [fetchLockers]);

  return { lockers, isLoading, addLocker, updateLockerStatus };
};