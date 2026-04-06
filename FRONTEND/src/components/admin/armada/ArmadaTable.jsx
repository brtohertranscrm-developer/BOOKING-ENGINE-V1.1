import React from 'react';

const ArmadaTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-4 border-b">ID</th>
            <th className="p-4 border-b">Nama Motor</th>
            <th className="p-4 border-b">Lokasi</th>
            <th className="p-4 border-b">Harga/24 Jam</th>
            <th className="p-4 border-b">Stok</th>
            <th className="p-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="6" className="p-4 text-center">Tidak ada data armada</td></tr>
          ) : (
            data.map((motor) => (
              <tr key={motor.id} className="hover:bg-gray-50 border-b">
                <td className="p-4">{motor.id}</td>
                <td className="p-4 font-semibold">{motor.name}</td>
                <td className="p-4">{motor.location}</td>
                <td className="p-4">Rp {motor.base_price?.toLocaleString('id-ID')}</td>
                <td className="p-4">{motor.stock}</td>
                <td className="p-4 flex gap-2">
                  <button 
                    onClick={() => onEdit(motor)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(motor.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
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

export default ArmadaTable;