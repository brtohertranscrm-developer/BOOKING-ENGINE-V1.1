import { useState, useEffect, useCallback } from 'react';

export const useLoker = () => {
  const [lockers, setLockers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem('admin_token') || localStorage.getItem('token');

  const fetchLockers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/lockers', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) setLockers(data.data);
    } catch (error) {
      console.error('Gagal mengambil data loker:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  const addLocker = async (newLocker) => {
    try {
      const res = await fetch('http://localhost:5001/api/admin/lockers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        },
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
      const res = await fetch(`http://localhost:5001/api/admin/lockers/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
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