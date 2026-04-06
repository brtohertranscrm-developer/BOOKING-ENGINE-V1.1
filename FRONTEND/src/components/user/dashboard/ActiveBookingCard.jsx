import React from 'react';
import { Bike, MapPin, AlertTriangle, QrCode } from 'lucide-react';

const ActiveBookingCard = ({ activeOrder, navigate }) => {
  if (!activeOrder) return null;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative animate-fade-in-up mb-8">
      <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2 border-r border-slate-200"></div>
      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2 border-l border-slate-200"></div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6 sm:p-8 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Order ID</span><span className="font-mono font-black text-slate-900 text-lg tracking-wider">{activeOrder.id}</span></div>
              <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {activeOrder.status}</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0"><Bike size={24} className="text-slate-700" /></div>
              <div><h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{activeOrder.item}</h3><p className="text-slate-500 text-xs font-medium flex items-center gap-1"><MapPin size={12} className="text-rose-500" /> {activeOrder.location || 'Lokasi belum diset'}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
              <div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ambil</span><span className="font-bold text-slate-900 text-xs sm:text-sm">{activeOrder.startDate}</span></div>
              <div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Kembali</span><span className="font-bold text-slate-900 text-xs sm:text-sm">{activeOrder.endDate}</span></div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
            <span className="text-[11px] font-medium text-slate-500">Ada kendala di jalan?</span>
            <button onClick={() => navigate('/support')} className="text-[11px] font-black text-rose-500 hover:text-rose-700 flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"><AlertTriangle size={14} /> Laporkan Masalah</button>
          </div>
        </div>
        <div className="md:w-64 p-6 sm:p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-4"><QrCode size={90} strokeWidth={1} className="text-slate-900" /></div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Tunjukkan QR</h4>
          <p className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-[150px]">ke Admin Lapangan saat pengambilan unit.</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveBookingCard;