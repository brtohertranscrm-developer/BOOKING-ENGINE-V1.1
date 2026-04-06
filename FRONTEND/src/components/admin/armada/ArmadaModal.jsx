import React, { useState, useEffect } from 'react';

const ArmadaModal = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '', category: 'Matic', location: 'Lempuyangan', 
    price_12h: 0, base_price: 0, stock: 1, image_url: ''
  });

  // Jika initialData ada (mode Edit), isi form dengan data tersebut
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Armada' : 'Tambah Armada Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Motor</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="Contoh: Honda Vario 160" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lokasi</label>
              <select name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                <option value="Lempuyangan">Lempuyangan</option>
                <option value="Tugu">Tugu / Malioboro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stok</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga 12 Jam</label>
              <input type="number" name="price_12h" value={formData.price_12h} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga 24 Jam</label>
              <input type="number" name="base_price" value={formData.base_price} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="https://..." />
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

export default ArmadaModal;