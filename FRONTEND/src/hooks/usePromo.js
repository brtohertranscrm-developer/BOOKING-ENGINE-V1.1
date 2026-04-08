import { useState, useEffect, useCallback } from 'react';

export const usePromo = () => {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
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
        headers: getAuthHeaders()
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
        headers: getAuthHeaders(),
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

  const updatePromo = async (id, updatedPromo) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/promos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedPromo)
      });
      const data = await res.json();
      if (data.success) {
        alert('Promo berhasil diperbarui!');
        fetchPromos();
        return true; 
      } else {
        alert('Gagal memperbarui promo: ' + (data.error || data.message));
        return false;
      }
    } catch (error) {
      alert('Koneksi ke server gagal saat memperbarui promo.');
      return false;
    }
  };

  const deletePromo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/promos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        alert('Promo berhasil dihapus!');
        fetchPromos();
        return true; 
      } else {
        alert('Gagal menghapus promo: ' + (data.error || data.message));
        return false;
      }
    } catch (error) {
      alert('Koneksi ke server gagal saat menghapus promo.');
      return false;
    }
  };

  const togglePromoStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    if (!window.confirm(`Yakin ingin ${newStatus === 1 ? 'mengaktifkan' : 'mematikan'} promo ini?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/promos/${id}/toggle`, {
        method: 'PUT',
        headers: getAuthHeaders(),
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

  return { 
    promos, 
    isLoading, 
    addPromo, 
    updatePromo, 
    deletePromo, 
    togglePromoStatus,
    fetchPromos
  };
};