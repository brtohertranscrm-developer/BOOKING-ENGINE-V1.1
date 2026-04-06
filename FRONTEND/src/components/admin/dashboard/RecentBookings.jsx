import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bike, Package } from 'lucide-react';

const RecentBookings = ({ bookings }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <h2 className="text-lg font-black text-slate-900">Transaksi Terbaru</h2>
        <button onClick={() => navigate('/admin/booking')} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-slate-900 transition-colors">
          Lihat Semua <ChevronRight size={14} className="inline ml-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
              <th className="p-6">Order ID</th>
              <th className="p-6">User</th>
              <th className="p-6">Item</th>
              <th className="p-6">Total</th>
              <th className="p-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center font-bold text-slate-400">Belum ada transaksi terbaru.</td>
              </tr>
            ) : (
              bookings.map((trx) => (
                <tr key={trx.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6 font-mono font-bold text-indigo-500">{trx.order_id}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                        {(trx.user_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{trx.user_name || 'Guest'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 font-medium italic text-xs">
                      {trx.item_type === 'motor' ? <Bike size={14}/> : <Package size={14}/>} {trx.item_name}
                    </div>
                  </td>
                  <td className="p-6 font-black text-slate-900">Rp {trx.total_price.toLocaleString('id-ID')}</td>
                  
                  <td className="p-6">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-3 py-1 inline-block rounded-lg text-[9px] font-black uppercase tracking-widest ${trx.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {trx.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </span>
                      
                      <span className={`px-3 py-1 inline-block rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        trx.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                        trx.status === 'active' ? 'bg-blue-100 text-blue-600' :
                        trx.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                        'bg-rose-100 text-rose-600'
                      }`}>
                        {trx.status === 'pending' ? 'Menunggu' :
                         trx.status === 'active' ? 'Disewa' :
                         trx.status === 'completed' ? 'Selesai' : 'Batal'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;