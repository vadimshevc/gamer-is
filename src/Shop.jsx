import React, { useState, useEffect } from 'react';
import { calculateTotal, formatCurrency, canAddToCart } from './utils/shopLogic';
import { logger } from './utils/logger';

/**
 * Словник для локалізації помилок (100%).
 */
const errorTranslations = {
  'Failed to fetch': 'Не вдалося з’єднатися з сервером. Перевірте інтернет.',
  'HTTP Error: 404': 'Ресурс не знайдено (Помилка 404).',
  'default': 'Щось пішло не так. Наші гноми вже лагодять систему.'
};

const API_URL = 'https://script.google.com/macros/s/GMR_PRO_API_ID/exec';

/*
 * Функція завантаження товарів з API.
 */
const fetchProductsFromAPI = async () => {
  const traceId = `TRC-${Math.floor(Math.random() * 9000) + 1000}`;
  try {
    logger.debug('API', `[${traceId}] Запит до: ${API_URL}`);
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    logger.error('API', `[ERR-FETCH] TraceID: ${traceId}`, { message: error.message });
    throw error;
  }
};

/**
 * Головний компонент магазину.
 * @returns {React.JSX.Element}
 */
function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    /**
     * Внутрішня функція для асинхронного завантаження.
     */
    const loadData = async () => {
      setLoading(true);
      setErrorInfo(null);
      logger.info('UI', 'Початок завантаження даних');

      try {
        const data = await fetchProductsFromAPI();
        setProducts(data);
      } catch (e) {
        const userMessage = errorTranslations[e.message] || errorTranslations['default'];
        const errorId = `GMR-ID-${Math.floor(Math.random() * 10000)}`;
        
        setErrorInfo({ message: userMessage, techId: errorId });
        logger.warn('UI', `Помилка: ${userMessage} (ID: ${errorId})`);
        
        setProducts([
          { id: 1, name: "RTX 4090 Gaming OC", price: 85000, stock: 3, img: "🎮" },
          { id: 2, name: "Razer DeathAdder V3", price: 3200, stock: 10, img: "🖱️" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData(); // ВИКЛИК ФУНКЦІЇ — це прибере червоне з loadData
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (canAddToCart(currentQty, product.stock)) {
      setCart(existing 
        ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...cart, { ...product, quantity: 1 }]
      );
      logger.info('Cart', `Додано: ${product.name}`);
    } else {
      alert("На складі порожньо!");
    }
  };

  const total = calculateTotal(cart, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-indigo-500 uppercase">GamerIS Pro</h1>
        {/* ВИКОРИСТАННЯ loading */}
        <div className="text-sm italic text-slate-500">
          {loading ? "Завантаження каталогу..." : "Система готова"}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          {errorInfo && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-2xl">
              <p className="text-red-400 font-bold">{errorInfo.message}</p>
              <span className="text-[10px] text-slate-500 uppercase font-mono">ID: {errorInfo.techId}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div className="text-4xl mb-2">{p.img}</div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-indigo-400 font-mono mb-4">{formatCurrency(p.price)}</p>
                <button onClick={() => addToCart(p)} className="w-full bg-indigo-600 p-2 rounded-lg font-bold">КУПИТИ</button>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-slate-900 p-6 rounded-2xl h-fit">
          <h2 className="font-bold mb-4">🛒 Кошик ({cart.length})</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between font-bold">
            <span>Разом:</span>
            <span className="text-green-400">{formatCurrency(total)}</span>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;