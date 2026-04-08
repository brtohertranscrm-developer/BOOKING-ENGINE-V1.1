import React, { useState } from 'react';
import { Search, Plus, Loader2, Percent, Power, Ticket, X } from 'lucide-react';
import { usePromo } from '../../../hooks/usePromo';

const PromoTab = () => {
  const { promos, isLoading, addPromo, togglePromoStatus } = usePromo();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State (Tambahkan usage_limit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: '', discount_percent: '', max_discount: '', usage_limit: 0 });

  const filteredPromos = promos.filter(p => p.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await addPromo(newPromo);
    if (success) {
      setIsModalOpen(false);
      setNewPromo({ code: '', discount_percent: '', max_discount: '', usage_limit: 0 });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cari kode promo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-sm">
            <Plus size={18} /> Buat Promo
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black border-b border-gray-100">
                  <th className="p-5">Kode Voucher</th>
                  <th className="p-5 text-center">Besar Diskon</th>
                  <th className="p-5">Maks. Potongan</th>
                  <th className="p-5 text-center">Terpakai</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPromos.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-10 text-gray-400 font-bold">Tidak ada kode promo ditemukan.</td></tr>
                ) : (
                  filteredPromos.map((promo) => (
                    <tr key={promo.id} className="border-b border-gray-50 hover:bg-emerald-50/30">
                      <td className="p-5"><span className="font-mono font-black text-brand-dark bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">{promo.code}</span></td>
                      <td className="p-5 text-center"><span className="font-black text-emerald-600 flex items-center justify-center gap-1">{promo.discount_percent}<Percent size={14}/></span></td>
                      <td className="p-5 font-bold text-brand-dark">Rp {promo.max_discount ? promo.max_discount.toLocaleString('id-ID') : 'Tanpa Batas'}</td>
                      
                      {/* TAMPILAN LIMIT PENGGUNAAN */}
                      <td className="p-5 text-center font-bold text-slate-600">
                        {promo.current_usage} / {promo.usage_limit === 0 ? '∞' : promo.usage_limit}
                      </td>

                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-lg ${promo.is_active === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {promo.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button onClick={() => togglePromoStatus(promo.id, promo.is_active)} className={`p-2 rounded-lg font-bold text-xs inline-flex items-center justify-center transition-colors shadow-sm ${promo.is_active === 1 ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                          <Power size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-emerald-500 p-6 flex justify-between items-center text-white">
              <h3 className="font-black text-xl flex items-center gap-2"><Ticket /> Buat Kode Promo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-100 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Kode Voucher</label>
                <input type="text" required value={newPromo.code} onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-black tracking-widest uppercase focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Diskon (%)</label>
                  <input type="number" required min="1" max="100" value={newPromo.discount_percent} onChange={(e) => setNewPromo({...newPromo, discount_percent: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Batas Kuota Penggunaan</label>
                  <input type="number" required min="0" placeholder="0 = Unlimited" value={newPromo.usage_limit} onChange={(e) => setNewPromo({...newPromo, usage_limit: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Maksimal Potongan (Rp)</label>
                <input type="number" required min="5000" value={newPromo.max_discount} onChange={(e) => setNewPromo({...newPromo, max_discount: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full pt-4 mt-2 bg-emerald-500 text-white font-black py-4 rounded-xl hover:bg-emerald-600 transition-colors flex justify-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Simpan Promo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default PromoTab;