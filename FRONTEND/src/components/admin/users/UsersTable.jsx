import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, CheckCircle, XCircle, Loader2, Mail, Phone, Key } from 'lucide-react';

const UsersTable = ({ users, isLoading, onUpdateKyc, onGenerateCode }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-center items-center p-20">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 text-center p-16">
        <Shield className="mx-auto text-slate-300 mb-3" size={40}/>
        <p className="text-slate-400 font-bold text-sm">Tidak ada data pengguna yang sesuai.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
              <th className="p-6">Profil Pelanggan</th>
              <th className="p-6">Kontak & Kode Aktif</th>
              <th className="p-6 text-center">Status KYC</th>
              <th className="p-6 text-right">Manajemen Akun</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => {
              const kyc = user.kyc_status || 'unverified';
              return (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Profil */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1rem] bg-slate-900 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base leading-tight line-clamp-1">{user.name}</h3>
                        <p className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">ID: {user.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Kontak */}
                  <td className="p-6">
                    <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-2 line-clamp-1"><Mail size={14} className="text-slate-400 shrink-0"/> {user.email}</span>
                      <span className="flex items-center gap-2"><Phone size={14} className="text-slate-400 shrink-0"/> {user.phone || 'Belum diatur'}</span>
                      {user.kyc_code && kyc !== 'verified' && (
                        <div className="mt-1"><span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Kode: {user.kyc_code}</span></div>
                      )}
                    </div>
                  </td>

                  {/* Status KYC */}
                  <td className="p-6 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border
                      ${kyc === 'verified' ? 'bg-green-50 text-green-700 border-green-200' : 
                        kyc === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' : 
                        kyc === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {kyc === 'verified' && <ShieldCheck size={14} />} 
                      {kyc === 'pending' && <ShieldAlert size={14} />} 
                      {kyc === 'rejected' && <XCircle size={14} />} 
                      {kyc === 'unverified' && <Shield size={14} />}
                      {kyc}
                    </div>
                  </td>

                  {/* Tombol Aksi */}
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {kyc !== 'verified' && (
                        <button onClick={() => onGenerateCode(user.id, user.name)} className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1" title="Buat & Salin Kode WA">
                          <Key size={14}/> {kyc === 'rejected' ? 'Kode Baru' : 'Buat Kode'}
                        </button>
                      )}
                      
                      {kyc !== 'verified' && (
                        <button onClick={() => onUpdateKyc(user.id, user.name, 'verified')} className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1">
                          <CheckCircle size={14}/> Acc
                        </button>
                      )}

                      {kyc === 'verified' && (
                        <button onClick={() => onUpdateKyc(user.id, user.name, 'unverified')} className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1" title="Kembalikan status menjadi butuh verifikasi">
                          <ShieldAlert size={14}/> Cabut Verif
                        </button>
                      )}

                      {kyc !== 'rejected' && (
                        <button onClick={() => onUpdateKyc(user.id, user.name, 'rejected')} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1">
                          <XCircle size={14}/> {kyc === 'verified' ? 'Bekukan' : 'Tolak'}
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;