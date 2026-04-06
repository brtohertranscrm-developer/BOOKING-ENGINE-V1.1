import { useState, useEffect, useCallback } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const authToken = localStorage.getItem('admin_token') || localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().getTime(); 
      const res = await fetch(`${API_URL}/api/admin/kyc?_t=${timestamp}`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`, 
          'Cache-Control': 'no-cache, no-store' 
        }
      });
      
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        console.error("Server menjawab gagal:", data.message || data.error);
      }
    } catch (error) {
      console.error('Gagal mengambil data pelanggan:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, API_URL]);

  const updateKyc = async (id, name, newStatus) => {
    const actionText = newStatus === 'verified' ? 'ACC MANUAL' : 
                       newStatus === 'rejected' ? 'TOLAK / BEKUKAN' : 
                       newStatus === 'unverified' ? 'CABUT VERIFIKASI' : newStatus;

    if (!window.confirm(`Yakin ingin ${actionText} akun ${name}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/kyc/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (data.success) {
        fetchUsers(); 
      } else {
        alert('Gagal mengupdate status KYC: ' + (data.message || ''));
      }
    } catch (error) {
      alert('Koneksi ke server gagal.');
    }
  };

  const generateCode = async (id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/kyc/${id}/code`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        navigator.clipboard.writeText(data.code);
        alert(`Kode KYC untuk ${name}:\n\n${data.code}\n\n✅ Disalin otomatis.`);
        fetchUsers(); 
      } else {
        alert('Gagal membuat kode unik.');
      }
    } catch (err) {
      alert('Gagal terhubung ke server.');
    }
  };

  useEffect(() => {
    if (authToken) fetchUsers();
  }, [fetchUsers, authToken]);

  return { users, isLoading, updateKyc, generateCode };
};