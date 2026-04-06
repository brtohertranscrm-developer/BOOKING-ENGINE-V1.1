import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bike, Package, ClipboardList, Ticket, LifeBuoy, FileText, TrendingUp } from 'lucide-react';

const QuickMenu = () => {
  const navigate = useNavigate();

  // ==========================================
  // DAFTAR MENU CEPAT ADMIN
  // ==========================================
  const adminMenus = [
    { name: 'Data Pesanan', path: '/admin/booking', icon: ClipboardList, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Armada Motor', path: '/admin/armada', icon: Bike, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Smart Loker', path: '/admin/loker', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Harga Dinamis', path: '/admin/pricing', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' }, // <-- Menu Baru Ditambahkan
    { name: 'Banner Promo', path: '/admin/promotions', icon: Ticket, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Konten Artikel', path: '/admin/artikel', icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-50' }, 
    { name: 'Data Pelanggan', path: '/admin/users', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Tiket Bantuan', path: '/admin/support', icon: LifeBuoy, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1">Manajemen Cepat</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {adminMenus.map((menu, index) => {
          const Icon = menu.icon;
          return (
            <button 
              key={index}
              onClick={() => navigate(menu.path)}
              className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-4 hover:border-rose-500/40 hover:shadow-xl transition-all group active:scale-95"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${menu.bg} ${menu.color} group-hover:-translate-y-1 transition-transform shadow-inner`}>
                <Icon size={26} />
              </div>
              <span className="font-black text-slate-900 text-[11px] sm:text-xs leading-tight">{menu.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickMenu;