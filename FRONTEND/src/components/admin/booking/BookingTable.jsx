import React from 'react';

const BookingTable = ({ data, onEdit }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-4 border-b">Order ID</th>
            <th className="p-4 border-b">Pelanggan</th>
            <th className="p-4 border-b">Item</th>
            <th className="p-4 border-b">Tanggal Sewa</th>
            <th className="p-4 border-b">Total (Rp)</th>
            <th className="p-4 border-b">Pembayaran</th>
            <th className="p-4 border-b">Status</th>
            <th className="p-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="8" className="p-4 text-center">Belum ada transaksi</td></tr>
          ) : (
            data.map((b) => (
              <tr key={b.order_id} className="hover:bg-gray-50 border-b">
                <td className="p-4 font-mono text-sm">{b.order_id}</td>
                <td className="p-4">
                  <div className="font-semibold">{b.user_name}</div>
                  <div className="text-xs text-gray-500">{b.user_phone}</div>
                </td>
                <td className="p-4">
                  <div>{b.item_name}</div>
                  <div className="text-xs text-gray-500 uppercase">{b.item_type}</div>
                </td>
                <td className="p-4 text-sm">
                  {new Date(b.start_date).toLocaleDateString('id-ID')} - <br/>
                  {new Date(b.end_date).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4 font-semibold">{b.total_price?.toLocaleString('id-ID')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs text-white ${b.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {b.payment_status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs text-white ${
                    b.status === 'active' ? 'bg-blue-500' : 
                    b.status === 'completed' ? 'bg-green-500' : 
                    b.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => onEdit(b)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Update
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

export default BookingTable;