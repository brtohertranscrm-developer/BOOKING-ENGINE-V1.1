import React, { useState } from 'react';
import { AlertTriangle, Save } from 'lucide-react';

const SurgeTab = () => {
  const [surgeConfig, setSurgeConfig] = useState({ isActive: true, multiplier: 20, triggerStock: 2 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-brand-dark mb-1">Surge Pricing (Scarcity)</h3>
            <p className="text-gray-500 text-sm">Harga akan naik secara otomatis berdasarkan algoritma ketersediaan sisa armada/loker di lapangan.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-brand-dark">Status Algoritma</div>
              <div className="text-xs text-gray-400 font-medium">Nyalakan/matikan sistem harga dinamis stok.</div>
            </div>
            <button 
              onClick={() => setSurgeConfig({...surgeConfig, isActive: !surgeConfig.isActive})}
              className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${surgeConfig.isActive ? 'bg-amber-500' : 'bg-gray-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${surgeConfig.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Persentase Ekstra Kenaikan Harga</label>
            <div className="flex items-center gap-3">
              <input type="number" value={surgeConfig.multiplier} onChange={(e) => setSurgeConfig({...surgeConfig, multiplier: e.target.value})} disabled={!surgeConfig.isActive} className="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-lg text-brand-dark focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-50 text-center" />
              <span className="font-black text-gray-400 text-xl">%</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Pemicu Sistem (Sisa Stok)</label>
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-500 text-sm">Aktif jika sisa stok &le; </span>
              <input type="number" value={surgeConfig.triggerStock} onChange={(e) => setSurgeConfig({...surgeConfig, triggerStock: e.target.value})} disabled={!surgeConfig.isActive} className="w-20 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-brand-dark focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-50 text-center" />
              <span className="font-bold text-gray-500 text-sm">Unit</span>
            </div>
          </div>

          <button disabled={!surgeConfig.isActive} onClick={() => alert('Konfigurasi Surge Pricing berhasil disimpan!')} className="w-full bg-brand-dark text-white font-black py-4 rounded-xl hover:bg-amber-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            <Save size={18} /> Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
};
export default SurgeTab;