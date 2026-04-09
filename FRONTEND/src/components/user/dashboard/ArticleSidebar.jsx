import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';

export default function ArticleSidebar({ navigate }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA ARTIKEL DARI BACKEND
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        
        // Asumsi endpoint artikel publik Anda ada di /api/articles atau /api/public/articles
        // Sesuaikan URL ini jika nama route di backend Anda berbeda
        const response = await fetch(`${apiUrl}/api/articles`);
        const result = await response.json();

        if (response.ok && result.success) {
          // Ambil 3 artikel terbaru saja agar sidebar tidak terlalu panjang
          setArticles(result.data.slice(0, 3));
        } else {
          console.error("Gagal load artikel:", result.message);
        }
      } catch (error) {
        console.error("Kesalahan jaringan saat mengambil artikel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // FUNGSI PINTAR: Mewarnai badge otomatis berdasarkan kata kunci Kategori
  const getCategoryColor = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('promo') || cat.includes('diskon')) return 'bg-rose-100 text-rose-700';
    if (cat.includes('tips') || cat.includes('edukasi')) return 'bg-blue-100 text-blue-700';
    if (cat.includes('wisata') || cat.includes('destinasi')) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700'; // Default color
  };

  // FUNGSI PINTAR: Format tanggal dari database (Contoh: "2024-04-12" jadi "12 Apr")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-500"/> Bacaan Menarik
        </h3>
      </div>

      <div className="space-y-4 flex-1">
        {/* State Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-slate-300" size={24} />
          </div>
        ) : articles.length > 0 ? (
          /* Render Artikel Real-Time */
          articles.map((article) => (
            <div 
              key={article.id} 
              // Sesuaikan rute URL detail artikel Anda di sini (misal: /article/1 atau /blog/1)
              onClick={() => navigate(`/article/${article.id}`)}
              className="group flex gap-4 items-center cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden relative bg-slate-100">
                <img 
                  // Dukung berbagai nama kolom gambar (image, thumbnail, image_url)
                  src={article.image || article.image_url || article.thumbnail || 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=200&auto=format&fit=crop'} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=200&auto=format&fit=crop'; }} // Fallback jika gambar error
                />
              </div>
              
              {/* Konten Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${getCategoryColor(article.category)}`}>
                    {article.category || 'Info'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    • {formatDate(article.created_at || article.date)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h4>
              </div>
            </div>
          ))
        ) : (
          /* State Kosong (Jika belum ada artikel di DB) */
          <div className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-2xl">
            Belum ada artikel terbaru.
          </div>
        )}
      </div>

      {/* Tombol Lihat Semua */}
      <button 
        onClick={() => navigate('/articles')}
        className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors pt-4 border-t border-slate-100"
      >
        Lihat Semua Artikel <ChevronRight size={14} />
      </button>
    </div>
  );
}