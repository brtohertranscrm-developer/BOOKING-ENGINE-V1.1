import React, { useState } from 'react';
import { CalendarDays, Plus, Trash2, Save } from 'lucide-react';

const SeasonalTab = () => {
  const [seasonalRules, setSeasonalRules] = useState([
    { id: 1, name: 'Long Weekend Waisak', startDate: '2026-05-28', endDate: '2026-06-02', markup: 25 },
    { id: 2, name: 'Libur Lebaran', startDate: '2026-03-15', endDate: '2026-03-25', markup: 50 },
  ]);

  const handleAddEvent = () => setSeasonalRules([...seasonalRules, { id: Date.now(), name: 'Event Baru', startDate: '', endDate: '', markup: 0 }]);
  const handleRemoveEvent = (id) => { if(window.confirm('Yakin ingin menghapus event ini?')) setSeasonalRules(seasonalRules.filter(r => r.id !== id)); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex items-start gap-4">
        <CalendarDays className="text-blue-600 shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Custom Best Available Rate (BAR)</h3>
          <p className="text-sm text-blue-800 leading-relaxed">Tetapkan persentase kenaikan harga untuk tanggal khusus. Aturan ini akan meng-override harga dasar.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-brand-dark">Event & Liburan Nasional</h2>
          <button onClick={handleAddEvent} className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"><Plus size={16}/> Tambah Event</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasonalRules.map(rule => (
            <div key={rule.id} className="border border-gray-200 rounded-2xl p-5 hover:border-blue-300 transition-colors bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <input type="text" defaultValue={rule.name} placeholder="Nama Event..." className="font-bold text-brand-dark border-b border-dashed border-gray-300 focus:border-blue-600 outline-none pb-1 bg-transparent w-3/4" />
                <button onClick={() => handleRemoveEvent(rule.id)} className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                  <span className="text-gray-500 font-bold">Periode:</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input type="date" defaultValue={rule.startDate} className="p-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-400 font-bold">-</span>
                    <input type="date" defaultValue={rule.endDate} className="p-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                  <span className="text-gray-500 font-bold">Kenaikan Harga:</span>
                  <div className="relative">
                    <input type="number" defaultValue={rule.markup} className="w-20 pl-3 pr-6 py-1.5 text-right font-black text-blue-600 bg-blue-50 rounded-lg border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-blue-600 text-xs">%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={() => alert('Kalender Event BAR berhasil disimpan!')} className="bg-blue-600 text-white font-bold px-8 py-4 sm:py-3.5 rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
            <Save size={18}/> Simpan Kalender
          </button>
        </div>
      </div>
    </div>
  );
};
export default SeasonalTab;