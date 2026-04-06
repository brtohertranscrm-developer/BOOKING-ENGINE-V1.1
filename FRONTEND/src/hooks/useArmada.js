import { useState, useEffect } from 'react';

export const useArmada = () => {
  const [armada, setArmada] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token'); // Asumsi token disimpan di localStorage

  const fetchArmada = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/motors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) setArmada(result.data);
    } catch (error) {
      console.error("Gagal mengambil data armada:", error);
    } finally {
      setLoading(false);
    }
  };

  const addArmada = async (data) => {
    try {
      await fetch('http://localhost:5001/api/admin/motors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      fetchArmada(); // Refresh data
    } catch (error) { console.error(error); }
  };

  const editArmada = async (id, data) => {
    try {
      await fetch(`http://localhost:5001/api/admin/motors/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      fetchArmada(); 
    } catch (error) { console.error(error); }
  };

  const deleteArmada = async (id) => {
    if(!window.confirm("Yakin ingin menghapus motor ini?")) return;
    try {
      await fetch(`http://localhost:5001/api/admin/motors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchArmada();
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchArmada();
  }, []);

  return { armada, loading, addArmada, editArmada, deleteArmada };
};