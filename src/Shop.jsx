import React, { useState } from 'react';
import { calculateTotal, formatCurrency, canAddToCart } from './utils/shopLogic';

const PRODUCTS = [
  { id: 1, name: "RTX 4090 Gaming OC", price: 85000, stock: 3, img: "🎮" },
  { id: 2, name: "Razer DeathAdder V3", price: 3200, stock: 10, img: "🖱️" },
  { id: 3, name: "Samsung Odyssey G7", price: 24500, stock: 5, img: "🖥️" },
];

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (canAddToCart(currentQty, product.stock)) {
      if (existing) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    } else {
      alert("Досягнуто ліміт товару або склад порожній!");
    }
  };

  const total = calculateTotal(cart, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-indigo-500 tracking-tighter uppercase">GamerIS Pro</h1>
        <div className="text-slate-400 font-medium">Кошик: {cart.length} тов.</div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Вітрина товарів */}
        <section className="lg:col-span-2">
          {/* Новий заголовок для виправлення ієрархії */}
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-500">🕹️</span> Каталог товарів
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRODUCTS.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500 transition-all group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{p.img}</div>
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <p className="text-slate-400 mb-4 font-mono">{formatCurrency(p.price)}</p>
                <button
                  onClick={() => addToCart(p)}
                  aria-label={`Купити ${p.name}`}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-all text-white"
                >
                  КУПИТИ
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Кошик */}
        <aside className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit sticky top-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🛒 Твоє замовлення</h2>

          {cart.length === 0 ? (
            // Новий контраст: text-slate-400 замість 600
            <p className="text-slate-400 italic text-center py-8">Кошик порожній...</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm border-b border-slate-800 pb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-mono text-indigo-400">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-700">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-slate-400">Всього до сплати:</span>
                  <span className="text-2xl font-black text-green-400">{formatCurrency(total)}</span>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-green-900/20 text-white">
                  Підтвердити
                </button>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
export default App;