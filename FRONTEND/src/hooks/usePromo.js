import { useState, useEffect, useCallback } from 'react';

export const usePromo = () => {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Gunakan Environment Variable agar aman saat di-hosting
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // 2. Buat fungsi pembantu agar token selalu fresh setiap kali ditarik
  const getAuthHeaders = () => {
    // Cari token dengan nama 'token' atau 'admin_token'
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    
    // Jika tidak ada token sama sekali, lempar peringatan (bukan error API)
    if (!token) {
      console.warn("Peringatan: Token Admin tidak ditemukan. Anda mungkin perlu login ulang.");
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
  };

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/promos`, {
        headers: getAuthHeaders() // Gunakan fungsi pembantu di sini
      });
      const data = await res.json();
      if (data.success) setPromos(data.data);
    } catch (error) {
      console.error('Gagal mengambil data promo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addPromo = async (newPromo) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/promos`, {
        method: 'POST',
        headers: getAuthHeaders(), // Gunakan fungsi pembantu di sini
        body: JSON.stringify(newPromo)
      });
      const data = await res.json();
      if (data.success) {
        alert('Promo berhasil ditambahkan!');
        fetchPromos();
        return true; 
      } else {
        alert('Gagal menambah promo: ' + (data.error || data.message));
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
      const res = await fetch(`${API_URL}/api/admin/promos/${id}/toggle`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Gunakan fungsi pembantu di sini
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchPromos(); 
      } else {
        alert('Gagal mengubah status promo: ' + (data.error || data.message));
      }
    } catch (error) {
      alert('Gagal mengubah status promo.');
    }
  };

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  return { promos, isLoading, addPromo, togglePromoStatus };
};