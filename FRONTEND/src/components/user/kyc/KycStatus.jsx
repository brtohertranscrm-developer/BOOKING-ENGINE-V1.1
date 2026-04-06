import React from 'react';
import { Clock } from 'lucide-react';

const KycStatus = ({ user, navigate }) => {
  return (
    <div className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-lg border border-gray-100 text-center animate-fade-in-up">
      <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock size={40} />
      </div>
      <h2 className="text-2xl font-bold text-brand-dark mb-3">Verifikasi Sedang Diproses</h2>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Terima kasih, <span className="font-semibold capitalize">{user?.name}</span>. Dokumen KTP dan Selfie Anda sedang ditinjau oleh tim admin kami. Proses ini biasanya memakan waktu maksimal 1x24 jam.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="w-full py-4 rounded-xl bg-gray-100 text-brand-dark font-bold hover:bg-gray-200 transition-colors active:scale-95"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
};

export default KycStatus;