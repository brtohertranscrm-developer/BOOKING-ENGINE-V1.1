import React from 'react';
import { ShieldCheck, Wallet, Banknote, CreditCard } from 'lucide-react';

const RenterForm = ({ user, paymentMethod, setPaymentMethod }) => {
  return (
    <div className="w-full lg:w-2/3 space-y-6">
      
      {/* Box 1: Data Penyewa */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span> 
          Data Penyewa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nama Lengkap (Sesuai KTP)</label>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-not-allowed">
              {user.name}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email</label>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-not-allowed">
              {user.email}
            </div>
          </div>
        </div>
        <p className="text-xs font-bold text-amber-500 mt-4 flex items-center gap-1.5 bg-amber-50 p-3 rounded-xl border border-amber-100">
          <ShieldCheck size={16}/> Pastikan akun Anda sudah lolos verifikasi KTP (KYC) agar motor bisa diserahterimakan.
        </p>
      </div>

      {/* Box 2: Metode Pembayaran */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span> 
          Pilih Metode Pembayaran
        </h2>
        
        <div className="space-y-3">
          {/* Opsi QRIS */}
          <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-rose-300'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'qris' ? 'border-rose-500' : 'border-slate-300'}`}>
                {paymentMethod === 'qris' && <div className="w-3 h-3 bg-rose-500 rounded-full"></div>}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900">QRIS (Gopay, OVO, Dana, LinkAja)</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Otomatis Terverifikasi</span>
              </div>
            </div>
            <Wallet className={paymentMethod === 'qris' ? 'text-rose-500' : 'text-slate-400'} />
          </label>

          {/* Opsi Virtual Account */}
          <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'va' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-rose-300'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'va' ? 'border-rose-500' : 'border-slate-300'}`}>
                {paymentMethod === 'va' && <div className="w-3 h-3 bg-rose-500 rounded-full"></div>}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900">Virtual Account (BCA, Mandiri, BNI)</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Otomatis Terverifikasi</span>
              </div>
            </div>
            <Banknote className={paymentMethod === 'va' ? 'text-rose-500' : 'text-slate-400'} />
          </label>

          {/* Opsi Kartu Kredit */}
          <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cc' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-rose-300'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cc' ? 'border-rose-500' : 'border-slate-300'}`}>
                {paymentMethod === 'cc' && <div className="w-3 h-3 bg-rose-500 rounded-full"></div>}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-900">Kartu Kredit / Debit</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visa, Mastercard, JCB</span>
              </div>
            </div>
            <CreditCard className={paymentMethod === 'cc' ? 'text-rose-500' : 'text-slate-400'} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default RenterForm;