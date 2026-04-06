import React from 'react';
import { ChevronLeft, Wallet } from 'lucide-react';
import { useCheckoutMotor } from '../../hooks/useCheckoutMotor';
import RenterForm from '../../components/user/checkout/RenterForm';
import OrderSummary from '../../components/user/checkout/OrderSummary';

export default function CheckoutMotor() {
  const {
    isReady, user, navigate, bookingData, isLoading,
    paymentMethod, setPaymentMethod,
    subTotal, adminFee, insuranceFee, grandTotal,
    handleCheckout
  } = useCheckoutMotor();

  if (!isReady) return null;

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 font-sans text-slate-900 animate-fade-in-up">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors w-fit">
          <ChevronLeft size={20} /> Kembali ke Pencarian
        </button>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-8">Selesaikan Pesanan Anda</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* KIRI: Formulir Pembayaran & Detail User */}
          <RenterForm 
            user={user} 
            paymentMethod={paymentMethod} 
            setPaymentMethod={setPaymentMethod} 
          />

          {/* KANAN: Ringkasan Pesanan (Sticky) */}
          <OrderSummary 
            bookingData={bookingData}
            subTotal={subTotal}
            insuranceFee={insuranceFee}
            adminFee={adminFee}
            grandTotal={grandTotal}
            isLoading={isLoading}
            handleCheckout={handleCheckout}
          />

        </div>
      </div>

      {/* OVERLAY LOADING PEMBAYARAN */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/80 z-[100] backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-bounce">
            <Wallet size={40} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-2">Memproses Pembayaran...</h2>
          <p className="text-slate-300 font-medium">Mohon jangan tutup atau muat ulang halaman ini.</p>
        </div>
      )}

    </div>
  );
}