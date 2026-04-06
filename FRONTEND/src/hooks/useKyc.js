import { useState, useEffect, useCallback } from 'react';

export const useKyc = () => {
  const [kycData, setKycData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token') || localStorage.getItem('admin_token');

  const fetchKycData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/kyc', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setKycData(data.data);
    } catch (error) {
      console.error('Gagal mengambil data KYC:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateKycStatus = async (id, newStatus, userName) => {
    const actionName = newStatus === 'approved' ? 'MENYETUJUI' : 'MENCABUT';
    if (!window.confirm(`Anda yakin ingin ${actionName} verifikasi akun ${userName}?`)) return;

    try {
      const res = await fetch(`http://localhost:5001/api/admin/kyc/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (data.success) {
        fetchKycData(); 
      } else {
        alert('Gagal memproses verifikasi.');
      }
    } catch (error) {
      alert('Koneksi ke server gagal.');
    }
  };

  useEffect(() => {
    fetchKycData();
  }, [fetchKycData]);

  return { kycData, isLoading, updateKycStatus };
};