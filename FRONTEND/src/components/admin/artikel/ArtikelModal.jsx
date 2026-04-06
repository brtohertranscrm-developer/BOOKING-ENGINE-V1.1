import React, { useState, useEffect } from 'react';

const ArtikelModal = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '', category: 'Wisata', image_url: '', 
    content: '', status: 'published', scheduled_at: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul Artikel</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                <option value="Wisata">Wisata</option>
                <option value="Tips & Trik">Tips & Trik</option>
                <option value="Promo">Promo</option>
                <option value="Berita">Berita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL Gambar Banner</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Isi Konten Artikel</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows="6" className="mt-1 w-full p-2 border rounded-md"></textarea>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtikelModal;