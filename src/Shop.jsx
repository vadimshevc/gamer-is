import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { calculateTotal, formatCurrency, canAddToCart } from './utils/shopLogic';
import { logger } from './utils/logger';
import { fetchProductsFromCloud } from './services/firebaseService';
import OrderModal from './components/OrderModal';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';


const errorTranslations = {
  'Failed to fetch': 'Схоже, зник інтернет. Перевірте з’єднання та спробуйте знову.',
  'Firestore Error': 'Помилка зв’язку з базою даних GamerIS.',
  'default': 'Сталася непередбачувана помилка. Спробуйте оновити сторінку.'
};

/**
 * Окремий мемоїзований компонент для картки товару.
 */
const ProductCard = memo(({ product, onAdd }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`bg-slate-900 border ${isOutOfStock ? 'opacity-60 grayscale' : 'border-slate-800'} p-6 rounded-3xl hover:border-indigo-500 transition-all group flex flex-col h-full`}>

      {/* БЛОК ЗОБРАЖЕННЯ (WebP + Універсальна заглушка) */}
      <div className="w-full aspect-square mb-4 overflow-hidden rounded-2xl bg-white flex items-center justify-center p-6">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Універсальна іконка для всіх типів товарів */
          <span className="text-6xl opacity-20">🎮</span>
        )}
      </div>

      {/* НАЗВА (Повний текст) */}
      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
        {product.name}
      </h3>

      {/* ОПИС (Повний текст) */}
      <div className="text-slate-400 text-sm mb-6 leading-relaxed">
        {product.description || "Опис завантажується..."}
      </div>

      {/* ФУТЕР КАРТКИ */}
      <div className="mt-auto pt-4 border-t border-slate-800/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Склад</span>
          <span className={`text-xs font-mono font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-400'}`}>
            {isOutOfStock ? 'SOLD OUT' : `${product.stock} ШТ.`}
          </span>
        </div>

        <p className="text-indigo-400 mb-6 font-mono text-2xl font-black">
          {formatCurrency(product.price)}
        </p>

        <button
          onClick={() => onAdd(product)}
          disabled={isOutOfStock}
          className={`w-full py-4 rounded-2xl font-black transition-all text-white shadow-lg active:scale-95 ${isOutOfStock ? 'bg-slate-800 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
        >
          {isOutOfStock ? 'НЕМАЄ В НАЯВНОСТІ' : 'КУПИТИ'}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

/**
 * Головний компонент додатку GamerIS.
 */
function App() {
  // Ініціалізація кошика з LocalStorage (Lazy Initializer)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('gamer_is_cart');
    // Якщо в сховищі є дані — перетворюємо рядок у масив, інакше повертаємо []
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);

  const unsubscribeRef = useRef(null);

  // Стан модального вікна
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Ефект для автоматичного збереження змін у кошику
  useEffect(() => {
    // Кожного разу, коли масив cart змінюється, ми оновлюємо запис у сховищі
    localStorage.setItem('gamer_is_cart', JSON.stringify(cart));
  }, [cart]);

  // Функція завантаження даних із хмари
  const loadData = () => {
    setLoading(true);
    setErrorInfo(null);
    logger.info('UI', 'Ініціалізація реактивного слухача Firestore');

    // "Дзен-очищення": якщо слухач вже висів, знімаємо його перед створенням нового
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    try {
      // Створюємо запит (замініть 'products' на вашу назву колекції)
      const q = query(collection(db, "products"));

      // Встановлюємо живий слухач
      unsubscribeRef.current = onSnapshot(q, (snapshot) => {
        const cloudData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (cloudData.length === 0) {
          throw new Error('Firestore Error');
        }

        setProducts(cloudData);
        setLoading(false);
      }, (error) => {
        // Обробка помилок підключення
        logger.error('API', '[ERR-STREAM]', { message: error.message });
        setErrorInfo({
          message: errorTranslations['Firestore Error'] || errorTranslations['default'],
          techId: `GMR-FIRE-${Math.floor(Math.random() * 10000)}`
        });
        setLoading(false);
      });
    } catch (e) {
      logger.error('API', '[ERR-CLOUD]', { message: e.message });
      setErrorInfo({
        message: errorTranslations[e.message] || errorTranslations['default'],
        techId: `GMR-FIRE-${Math.floor(Math.random() * 10000)}`
      });
      setLoading(false);
    }
  };

  // Функція оформлення замовлення
  const handleCheckout = async (phone) => {
    setLoading(true);
    try {
      const GAS_URL = "https://script.google.com/macros/s/AKfycbz5b64DoNFJCzweGm-w_9lco1K6pmcCexIrtwgV51SYVCRospCisuuXuimkfKhXTuXk/exec";

      const requests = cart.map(item =>
        fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            firebaseId: item.firebaseId || item.id,
            phone: phone, // Тепер передаємо реальний телефон
            quantityChange: 0, // Склад уже було зменшено при додаванні в кошик
            price: item.price // Передаємо поточну ціну за одиницю товару
          })
        })
      );

      // Виконуємо всі запити паралельно для швидкості
      await Promise.all(requests);
      await loadData(); // Підтягуємо фінальні дані з Firestore для повної синхронізації

      return true;
    } catch (e) {
      logger.error('Checkout', 'Помилка при оформленні', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Викликається один раз при старті
  useEffect(() => {
    loadData();

    // Це "прибере" за собою, коли користувач закриє сторінку
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // --- ОБЛАСТЬ ВЗАЄМОДІЇ З БЕКЕНДОМ (GAS) ---  
  const syncWithInventory = async (productId, change, phone = "") => {
    // Константа знаходиться ТУТ, щоб не дублювати її в кожній функції
    const GAS_URL = "https://script.google.com/macros/s/AKfycbz5b64DoNFJCzweGm-w_9lco1K6pmcCexIrtwgV51SYVCRospCisuuXuimkfKhXTuXk/exec";

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          firebaseId: productId,
          phone: phone,
          quantityChange: change
        })
      });
      // Після успішної відправки оновлюємо дані з Firestore
      loadData();
    } catch (e) {
      logger.error('Inventory', 'Помилка синхронізації', e);
    }
  };

  // --- ОБРОБНИКИ ПОДІЙ (HANDLERS) ---
  const addToCart = useCallback(async (product) => {
    // 1. Отримуємо кількість у кошику (для UI або лімітів)
    const inCart = cart.find(i => i.id === product.id)?.quantity || 0;

    // 2. ВИПРАВЛЕНО: Перевіряємо лише наявність на складі
    if (canAddToCart(inCart, product.stock)) {

      // 3. Оновлюємо кошик локально
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      // 4. Оптимістичне оновлення інтерфейсу: віднімаємо одиницю в UI миттєво
      setProducts(prev => prev.map(p =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      ));

      // 5. Відправляємо запит на бронювання в Google Таблицю
      await syncWithInventory(product.id, -1, "RESERVE");

    } else {
      alert("Вибачте, товар закінчився.");
    }
  }, [cart]);

  // 1. Функція видалення однієї одиниці товару
  const removeFromCart = useCallback(async (productId) => {
    const itemInCart = cart.find(i => i.id === productId);
    if (!itemInCart) return;

    // Оновлюємо стан кошика локально
    setCart(prev => {
      if (itemInCart.quantity > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });

    // Оптимістично повертаємо 1 одиницю в UI каталог
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, stock: p.stock + 1 } : p
    ));

    // Синхронізуємо з бекендом: передаємо +1 (повернення на склад)
    await syncWithInventory(productId, 1, "RETURN");
  }, [cart]);

  // 2. Функція повного очищення кошика
  const clearCart = async () => {
    if (cart.length === 0) return;

    // Створюємо масив промісів для повернення ВСІХ товарів паралельно
    const returnRequests = cart.map(item =>
      syncWithInventory(item.id, item.quantity, "RESTORE_ALL")
    );

    // Чекаємо завершення всіх запитів до GAS
    await Promise.all(returnRequests);

    // Очищуємо локальний стан та localStorage
    setCart([]);
    localStorage.removeItem('gamer_is_cart');

    // Оновлюємо дані, щоб отримати актуальні залишки
    loadData();
  };

  const total = useMemo(() => {
    return calculateTotal(cart, 0);
  }, [cart]);

  const [categoryFilter, setCategoryFilter] = useState('Всі');
  const [brandFilter, setBrandFilter] = useState('Всі');
  const [maxPrice, setMaxPrice] = useState(50000); // Максимальна початкова ціна

  // Отримуємо унікальні категорії з масиву products
  const categories = useMemo(() => {
    return ['Всі', ...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  // Отримуємо унікальні бренди з масиву products
  const brands = useMemo(() => {
    return ['Всі', ...new Set(products.map(p => p.brand).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Перевірка категорії
      const matchesCategory = categoryFilter === 'Всі' || product.category === categoryFilter;

      // 2. Перевірка бренду (якщо у тебе є поле brand у базі)
      const matchesBrand = brandFilter === 'Всі' || product.brand === brandFilter;

      // 3. Перевірка ціни
      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesBrand && matchesPrice;
    });
  }, [products, categoryFilter, brandFilter, maxPrice]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="max-w-[1400px] mx-auto mb-12 flex justify-between items-center border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-indigo-500 tracking-tighter uppercase">GamerIS Cloud</h1>
        <div className="text-slate-400 font-medium italic">
          {loading ? 'З’єднання з базою...' : `В ефірі: ${products.length} товарів`}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto mb-20 pt-10 grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            New Season 2026
          </div>
          <h2 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tighter">
            Твій <span className="text-indigo-500 text-glow">Ігровий</span> <br />
            Арсенал
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
            Професійні девайси з AI-описами та блискавичною синхронізацією. Відчуй перевагу в кожному кліку.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() =>
                document.getElementById('catalog')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
              className="bg-indigo-600 px-10 py-5 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95"
            >
              ПЕРЕЙТИ ДО КАТАЛОГУ
            </button>
            {/* <button className="bg-slate-900 border border-slate-800 px-10 py-5 rounded-2xl font-black text-slate-300 hover:bg-slate-800 transition-all">
              ПРО ПРОЄКТ
            </button> */}
          </div>
        </div>

        <div className="relative group">
          {/* Декоративне сяйво позаду картинки */}
          <div className="absolute -inset-10 bg-indigo-500/20 blur-[120px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>

          {/* Фото компа (замініть src на шлях до вашого файлу) */}
          <img
            src={`${import.meta.env.BASE_URL}hero-pc.png`}
            alt="Gaming PC Build"
            className="relative z-10 w-full h-auto object-contain transform hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          />
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto mb-10 p-1 bg-gradient-to-r from-indigo-500/20 via-slate-800/50 to-purple-500/20 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)]">
        <div className="bg-slate-950/80 backdrop-blur-xl p-8 rounded-[1.8rem] border border-slate-800/50 flex flex-wrap items-end gap-8">

          {/* Фільтр Категорії */}
          <div className="flex flex-col gap-3 min-w-[180px]">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">
              Категорія
            </label>
            <div className="relative group">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-2xl px-5 py-3.5 appearance-none outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer hover:bg-slate-800"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-indigo-400 transition-colors">
                ▼
              </div>
            </div>
          </div>

          {/* Фільтр Бренду */}
          <div className="flex flex-col gap-3 min-w-[180px]">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">
              Бренд
            </label>
            <div className="relative group">
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-2xl px-5 py-3.5 appearance-none outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer hover:bg-slate-800"
              >
                {brands.map(br => <option key={br} value={br}>{br}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-indigo-400 transition-colors">
                ▼
              </div>
            </div>
          </div>

          {/* Фільтр Ціни */}
          <div className="flex flex-col gap-3 flex-1 min-w-[250px]">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Ціна до</label>
              <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-black border border-indigo-500/20">
                {maxPrice.toLocaleString()} грн
              </span>
            </div>
            <div className="relative h-10 flex items-center">
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Кнопка Скидання (опціонально) */}
          <button
            onClick={() => { setCategoryFilter('Всі'); setBrandFilter('Всі'); setMaxPrice(50000); }}
            className="p-3.5 rounded-2xl border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-400/50 transition-all active:scale-95"
            title="Скинути фільтри"
          >
            ↺
          </button>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12" id="catalog" >
        <section className="lg:col-span-2">
          {errorInfo && (
            <div className="mb-8 p-6 bg-red-900/20 border border-red-500/50 rounded-3xl text-sm">
              <p className="text-red-400 font-bold">{errorInfo.message}</p>
              <p className="text-xs text-slate-500 mt-2">ID помилки: {errorInfo.techId}</p>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🕹️ Хмарний каталог</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>

        {/* Кошик залишається без змін */}
        <aside className="bg-slate-900 border border-slate-800 p-8 rounded-3xl h-fit sticky top-8 shadow-2xl">
          {/* Заголовок кошика та кнопка швидкого очищення */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🛒 Кошик
              <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-lg">
                {cart.length}
              </span>
            </h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] text-red-400 hover:text-red-300 uppercase font-black tracking-widest transition-colors"
              >
                Очистити все
              </button>
            )}
          </div>

          {/* Список товарів або повідомлення про порожній кошик */}
          {cart.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-500 italic text-sm">Ваш інвентар порожній</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-height-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-3 mb-3 group">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200">{item.name}</span>
                      <span className="text-indigo-400 font-mono text-xs">x{item.quantity}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-indigo-300 font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      {/* Кнопка видалення однієї одиниці (Хрестик) */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        title="Видалити 1 шт."
                        className="text-slate-600 hover:text-red-500 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-500/10 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Блок підсумку та кнопка Оформити */}
              <div className="pt-6 mt-6 border-t border-slate-700">
                <div className="flex justify-between items-end mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Разом до сплати</span>
                    <span className="text-3xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black text-white shadow-[0_10px_30px_rgba(22,163,74,0.3)] active:scale-95 transition-all uppercase tracking-widest text-sm"
                >
                  ПІДТВЕРДИТИ ЗАМОВЛЕННЯ
                </button>

                <p className="text-[9px] text-slate-500 text-center mt-4 uppercase tracking-tighter">
                  * Натискаючи кнопку, ви погоджуєтесь на обробку даних
                </p>
              </div>
            </div>
          )}
        </aside>
      </main>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        total={total}
        onConfirm={async (phone) => {
          // 1. Викликаємо сервер через handleCheckout
          const success = await handleCheckout(phone);

          if (success) {
            // 2. Очищуємо кошик ТІЛЬКИ після підтвердження сервером
            setCart([]);
            setIsOrderModalOpen(false);
            alert("✅ Замовлення зафіксовано! Менеджер зателефонує на номер: " + phone);
          } else {
            alert("❌ Помилка при оформленні. Перевірте з'єднання.");
          }
        }}
      />

    </div>
  );
}

export default App;