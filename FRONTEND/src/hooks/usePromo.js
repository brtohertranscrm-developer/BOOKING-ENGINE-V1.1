import { useState, useEffect, useCallback } from 'react';

export const usePromo = () => {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/promos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPromos(data.data);
    } catch (error) {
      console.error('Gagal mengambil data promo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addPromo = async (newPromo) => {
    try {
      const res = await fetch('http://localhost:5001/api/admin/promos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newPromo)
      });
      const data = await res.json();
      if (data.success) {
        alert('Promo berhasil ditambahkan!');
        fetchPromos();
        return true; // Beri tahu komponen kalau sukses
      } else {
        alert('Gagal menambah promo: ' + data.error);
        return false;
      }
    } catch (error) {
      alert('Koneksi ke server gagal.');
      return false;
    }
  };

  const togglePromoStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    if (!window.confirm(`Yakin ingin ${newStatus === 1 ? 'mengaktifkan' : 'mematikan'} promo ini?`)) return;
    try {
      const res = await fetch(`http://localhost:5001/api/admin/promos/${id}/toggle`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) fetchPromos(); 
    } catch (error) {
      alert('Gagal mengubah status promo.');
    }
  };

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  return { promos, isLoading, addPromo, togglePromoStatus };
};