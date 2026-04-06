import React, { useState } from 'react';
import { useArmada } from '../../hooks/useArmada';
import ArmadaTable from '../../components/admin/armada/ArmadaTable';
import ArmadaModal from '../../components/admin/armada/ArmadaModal';

const AdminArmada = () => {
  const { armada, loading, addArmada, editArmada, deleteArmada } = useArmada();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null); // Menyimpan data yang mau diedit

  const handleOpenAdd = () => {
    setEditingData(null); // Kosongkan data untuk tambah baru
    setIsModalOpen(true);
  };

  const handleOpenEdit = (motor) => {
    setEditingData(motor); // Masukkan data motor ke modal
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (editingData) {
      editArmada(editingData.id, formData);
    } else {
      addArmada(formData);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Armada</h1>
        <button onClick={handleOpenAdd} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          + Tambah Armada
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <ArmadaTable 
          data={armada} 
          onEdit={handleOpenEdit} 
          onDelete={deleteArmada} 
        />
      )}

      {isModalOpen && (
        <ArmadaModal 
          initialData={editingData}
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleModalSubmit} 
        />
      )}
    </div>
  );
};

export default AdminArmada;