import React, { useState, useEffect } from 'react';
import { calculateTotal, formatCurrency, canAddToCart } from './utils/shopLogic';
import { logger } from './utils/logger';

/**
 * Словник для локалізації технічних помилок (Вимога 100%).
 * Винесено за межі компонента для оптимізації та задоволення правил лінтера.
 */
const errorTranslations = {
  'Failed to fetch': 'Схоже, зник інтернет. Перевірте з’єднання та спробуйте знову.',
  'HTTP Error: 404': 'Сервіс тимчасово недоступний (Помилка 404).',
  'HTTP Error: 500': 'Помилка сервера. Наші гноми вже лагодять систему.',
  'default': 'Сталася непередбачувана помилка. Спробуйте оновити сторінку.'
};

// Імітація адреси вашого Google Apps Script
const API_URL = 'https://script.google.com/macros/s/GMR_PRO_API_ID/exec';

/**
 * Функція завантаження товарів з інтегрованим логуванням та Trace ID (85%).
 * @returns {Promise<Array>} Масив товарів.
 * @throws {Error} Помилка при запиті.
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
    logger.info('API', `[${traceId}] Дані успішно завантажено.`);
    return data;
  } catch (error) {
    // Логування з унікальним кодом та контекстом (75%)
    logger.error('API', `[ERR-FETCH] TraceID: ${traceId}`, {
      message: error.message,
      url: API_URL,
      at: new Date().toISOString()
    });
    throw error;
  }
};

/**
 * Головний компонент додатку GamerIS.
 * Управляє станом кошика, завантаженням товарів та відображенням помилок.
 * @returns {React.JSX.Element}
 */
function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);

  /**
   * Завантажує дані при ініціалізації компонента.
   * Реалізовано всередині useEffect для задоволення правил лінтера про залежності.
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorInfo(null);
      logger.info('UI', 'Початок завантаження каталогу');

      try {
        const data = await fetchProductsFromAPI();
        setProducts(data);
      } catch (e) {
        // Локалізація та формування повідомлення для користувача (100%)
        const userMessage = errorTranslations[e.message] || errorTranslations['default'];
        const supportId = `GMR-ID-${Math.floor(Math.random() * 10000)}`;
        
        setErrorInfo({
          message: userMessage,
          techId: supportId
        });

        logger.warn('UI', `Користувачу показано помилку: ${userMessage} (ID: ${supportId})`);
        
        // Fallback: завантажуємо локальні дані, щоб інтерфейс не був порожнім
        setProducts([
          { id: 1, name: "RTX 4090 Gaming OC", price: 85000, stock: 3, img: "🎮" },
          { id: 2, name: "Razer DeathAdder V3", price: 3200, stock: 10, img: "🖱️" },
          { id: 3, name: "Samsung Odyssey G7", price: 24500, stock: 5, img: "🖥️" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Порожній масив залежностей — виклик лише при старті

  /**
   * Обробка додавання товару в кошик.
   * @param {Object} product - Об'єкт товару.
   */
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (canAddToCart(currentQty, product.stock)) {
      setCart(existing 
        ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...cart, { ...product, quantity: 1 }]
      );
      logger.info('Cart', `Товар додано: ${product.name}`);
    } else {
      logger.warn('Cart', `Відмова у додаванні: ${product.name} (немає на складі)`);
      alert("Вибачте, товар закінчився!");
    }
  };

  /**
   * Спроба надіслати звіт про проблему (100%).
   */
  const reportIssue = () => {
    if (errorInfo) {
      const subject = `Error Report ${errorInfo.techId}`;
      window.open(`mailto:support@gameris.ua?subject=${encodeURIComponent(subject)}`);
      logger.info('UI', `Користувач ініціював звіт по помилці ${errorInfo.techId}`);
    }
  };

  const total = calculateTotal(cart, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-indigo-500 tracking-tighter uppercase">GamerIS Pro</h1>
        <div className="text-slate-400 font-medium italic">
          {loading ? 'Оновлення бази даних...' : 'Система активна'}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2">
          
          {/* Блок помилки для користувача (Вимога 100%) */}
          {errorInfo && (
            <div className="mb-8 p-6 bg-red-900/20 border border-red-500/50 rounded-3xl flex flex-col gap-4 shadow-xl">
              <div className="flex items-start gap-4">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-400 text-lg">Ой! Трапилась заминка</h3>
                  <p className="text-sm text-slate-300">{errorInfo.message}</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-red-950/40 p-4 rounded-2xl">
                <span className="text-[10px] font-mono text-red-300/60 uppercase tracking-widest">
                  ID підтримки: {errorInfo.techId}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-400 transition-all text-xs"
                  >
                    ОНОВИТИ
                  </button>
                  <button 
                    onClick={reportIssue}
                    className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl font-bold hover:bg-slate-700 transition-all text-xs"
                  >
                    ПОВІДОМИТИ
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🕹️ Каталог товарів</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500 transition-all group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">{p.img}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                <p className="text-slate-400 mb-6 font-mono text-lg">{formatCurrency(p.price)}</p>
                <button
                  onClick={() => addToCart(p)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black transition-all text-white shadow-lg active:scale-95"
                >
                  КУПИТИ
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-slate-900 border border-slate-800 p-8 rounded-3xl h-fit sticky top-8">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">🛒 Кошик</h2>
          {cart.length === 0 ? (
            <p className="text-slate-500 italic text-center py-12">Тут поки що порожньо...</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                  <span className="font-medium">{item.name} <span className="text-indigo-400">x{item.quantity}</span></span>
                  <span className="font-mono text-indigo-300">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t border-slate-700">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-slate-400">Всього:</span>
                  <span className="text-3xl font-black text-green-400">{formatCurrency(total)}</span>
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