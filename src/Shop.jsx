import React, { useState, useEffect } from 'react';
import { calculateTotal, formatCurrency, canAddToCart } from './utils/shopLogic';
import { logger } from './utils/logger';

/**
 * Локалізація повідомлень про помилки (100% за Лабою №7).
 * Винесено за межі компонента, щоб уникнути зайвих залежностей у useEffect.
 */
const errorTranslations = {
  'Failed to fetch': 'Не вдалося з’єднатися з сервером. Перевірте інтернет.',
  'HTTP Error: 404': 'Ресурс не знайдено (Помилка 404).',
  'default': 'Щось пішло не так. Наші гноми вже лагодять систему.'
};

// Імітація адреси API (Middleware на Google Apps Script)
const API_URL = 'https://script.google.com/macros/s/GMR_PRO_API_ID/exec';

/**
 * Функція завантаження товарів з інтегрованим логуванням.
 * @returns {Promise<Array|null>} Масив товарів або null у разі помилки.
 */
const fetchProductsFromAPI = async () => {
  const traceId = `TRC-${Math.floor(Math.random() * 9000) + 1000}`;
  
  try {
    logger.debug('API', `[${traceId}] Запит до сервера: ${API_URL}`);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    logger.info('API', `[${traceId}] Дані отримано успішно.`);
    return data;
  } catch (error) {
    logger.error('API', `[ERR-FETCH-001] TraceID: ${traceId}`, {
      message: error.message,
      url: API_URL
    });
    throw error;
  }
};

/**
 * Головний компонент додатку GamerIS.
 * @returns {React.JSX.Element}
 * Управляє станом кошика, завантаженням товарів та відображенням помилок.
 */
function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);

  /**
   * Завантажує дані та обробляє можливі винятки.
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorInfo(null);
      logger.info('UI', 'Ініціалізація завантаження каталогу');

      try {
        const data = await fetchProductsFromAPI();
        setProducts(data);
      } catch (e) {
        // Використовуємо винесений словник (виправлення помилки unused-vars)
        const userMessage = errorTranslations[e.message] || errorTranslations['default'];
        const errorId = `GMR-ID-${Math.floor(Math.random() * 10000)}`;
        
        setErrorInfo({
          message: userMessage,
          techId: errorId,
          details: e.message
        });

        logger.warn('UI', `Помилка UI: ${userMessage} (ID: ${errorId})`);
        
        // Резервні дані (Fallback)
        setProducts([
          { id: 1, name: "RTX 4090 Gaming OC", price: 85000, stock: 3, img: "🎮" },
          { id: 2, name: "Razer DeathAdder V3", price: 3200, stock: 10, img: "🖱️" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Порожній масив залежностей тепер не викликає варнінгів

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
      logger.warn('Cart', `Перевищено ліміт для: ${product.name}`);
      alert("На складі більше немає!");
    }
  };

  const total = calculateTotal(cart, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-indigo-500 tracking-tighter uppercase">GamerIS Pro</h1>
        <div className="text-slate-400 font-medium italic">
          {loading ? 'Оновлення...' : 'Магазин онлайн'}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2">
          
          {/* Кастомізований блок помилки (100% Лаби №7) */}
          {errorInfo && (
            <div className="mb-8 p-6 bg-red-900/20 border border-red-500/50 rounded-3xl flex flex-col gap-4 shadow-2xl shadow-red-900/10">
              <div className="flex items-center gap-4">
                <span className="text-4xl animate-pulse">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-400 text-lg">Упс! Трапилась технічна заминка</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{errorInfo.message}</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-red-950/40 p-4 rounded-2xl text-[10px] font-mono text-red-300/60 uppercase tracking-widest">
                <span>Support ID: {errorInfo.techId}</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-400 transition-all active:scale-95 shadow-lg"
                >
                  Оновити сторінку
                </button>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🕹️ Каталог товарів</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500 transition-all group relative overflow-hidden">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">{p.img}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                <p className="text-slate-400 mb-6 font-mono text-lg">{formatCurrency(p.price)}</p>
                <button
                  onClick={() => addToCart(p)}
                  className="w-full bg-indigo-600 hover:bg-indigo-400 py-4 rounded-2xl font-black transition-all text-white shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
                >
                  У КОШИК
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-slate-900 border border-slate-800 p-8 rounded-3xl h-fit sticky top-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">🛒</span>
            Ваше замовлення
          </h2>
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 italic mb-2">Кошик порожній</p>
              <div className="text-4xl opacity-20">🧊</div>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm bg-slate-800/30 p-3 rounded-xl">
                  <span className="font-medium">{item.name} <span className="text-indigo-400 ml-1">x{item.quantity}</span></span>
                  <span className="font-mono font-bold text-indigo-300">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t border-slate-800">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-slate-400 font-medium">Сума замовлення:</span>
                  <span className="text-3xl font-black text-green-400 tracking-tight">{formatCurrency(total)}</span>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-green-900/20 text-white active:translate-y-1">
                  ПІДТВЕРДИТИ
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