import React, { useState } from 'react';
import { validatePhone } from '../utils/shopLogic'; // Шлях на рівень вище у папку utils

const OrderModal = ({ isOpen, onClose, cart, total, onConfirm }) => {
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (validatePhone(phone)) {
      onConfirm(phone);
    } else {
      alert("Некоректний формат телефону! Спробуйте 0XXXXXXXXX");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8">
        <h2 className="text-2xl font-black mb-6 text-indigo-500 uppercase">Оформлення</h2>
        <div className="space-y-4 mb-6">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-slate-300">
              <span>{item.name} x{item.quantity}</span>
              <span className="font-mono">{item.price * item.quantity} грн</span>
            </div>
          ))}
          <div className="border-t border-slate-800 pt-4 font-bold text-xl flex justify-between">
            <span>РАЗОМ:</span>
            <span className="text-green-400">{total} грн</span>
          </div>
        </div>
        <input 
          type="tel" 
          placeholder="Ваш телефон: 0XXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 mb-6 text-white outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 text-slate-400 font-bold">СКАСУВАТИ</button>
          <button onClick={handleConfirm} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all">ПІДТВЕРДИТИ</button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;