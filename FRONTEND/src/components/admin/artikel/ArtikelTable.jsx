import React from 'react';

const ArtikelTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-4 border-b">ID</th>
            <th className="p-4 border-b">Judul</th>
            <th className="p-4 border-b">Kategori</th>
            <th className="p-4 border-b">Status</th>
            <th className="p-4 border-b">Tanggal Dibuat</th>
            <th className="p-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="6" className="p-4 text-center">Tidak ada data artikel</td></tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 border-b">
                <td className="p-4">{item.id}</td>
                <td className="p-4 font-semibold max-w-xs truncate">{item.title}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs text-white ${item.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => onEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                    Edit
                  </button>
                  <button onClick={() => onDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArtikelTable;