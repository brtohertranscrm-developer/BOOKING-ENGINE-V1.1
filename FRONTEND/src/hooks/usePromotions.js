import { useState, useEffect, useCallback } from 'react';

export const usePromotions = () => {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem('admin_token') || localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/promotions`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) setPromos(data.data);
    } catch (error) {
      console.error('Gagal mengambil data promo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, API_URL]);

  const savePromo = async (promoData, editingId) => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId 
        ? `${API_URL}/api/admin/promotions/${editingId}` 
        : `${API_URL}/api/admin/promotions`;

      const res = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(promoData)
      });
      
      const data = await res.json();
      if (data.success) {
        alert(editingId ? 'Promo berhasil diperbarui!' : 'Promo baru berhasil dipublikasikan!');
        fetchPromos();
        return true;
      } else {
        alert(`Gagal menyimpan promo: ${data.error || 'Kesalahan Server'}`);
        return false;
      }
    } catch (error) {
      alert('Gagal terhubung ke server.');
      return false;
    }
  };

  const deletePromo = async (id) => {
    if (!window.confirm('Hapus promo ini secara permanen?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/promotions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchPromos();
      } else {
        alert(`Gagal menghapus: ${data.error}`);
      }
    } catch (error) {
      alert('Gagal menghapus promo.');
    }
  };

  useEffect(() => { 
    if (authToken) fetchPromos(); 
  }, [fetchPromos, authToken]);

  return { promos, isLoading, savePromo, deletePromo };
};