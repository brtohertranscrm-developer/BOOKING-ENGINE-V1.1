import { useState, useEffect } from 'react';

export const useArtikel = () => {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchArtikel = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/articles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) setArtikel(result.data);
    } catch (error) {
      console.error("Gagal mengambil data artikel:", error);
    } finally {
      setLoading(false);
    }
  };

  const addArtikel = async (data) => {
    try {
      await fetch('http://localhost:5001/api/admin/articles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      fetchArtikel();
    } catch (error) { console.error(error); }
  };

  const editArtikel = async (id, data) => {
    try {
      await fetch(`http://localhost:5001/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      fetchArtikel(); 
    } catch (error) { console.error(error); }
  };

  const deleteArtikel = async (id) => {
    if(!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await fetch(`http://localhost:5001/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchArtikel();
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  return { artikel, loading, addArtikel, editArtikel, deleteArtikel };
};