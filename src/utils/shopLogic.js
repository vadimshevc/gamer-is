// 1. Форматування ціни
export const formatCurrency = (val) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(val);

// 2. Розрахунок суми кошика зі знижкою
export const calculateTotal = (items, discount = 0) => {
  const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return sum - (sum * (discount / 100));
};

// 3. Перевірка ліміту замовлення (не більше 5 штук одного товару в одні руки)
// export const canAddToCart = (currentQty, stock) => currentQty < stock && currentQty < 5;

// 3. Перевірка можливості додавання в кошик.
// В архітектурі з бронюванням ми просто перевіряємо, чи є товар на складі.
export const canAddToCart = (currentQty, stock) => {
  // Приводимо до числа для безпеки розрахунків
  const availableStock = Number(stock);
  
  // Якщо на складі більше 0 — товар можна додати
  return availableStock > 0;
};

// 4. Розрахунок кешбеку (геймерські бали - 2% від суми)
export const calculateCashback = (amount) => Math.floor(amount * 0.02);

// 5. Перевірка валідності промокоду
export const isPromoValid = (code) => code === "GGWP2026";

// 6. Валідація номера телефону (Україна)
export const validatePhone = (phone) => {
  const re = /^(?:\+38)?(0\d{9})$/; // Перевірка формату 0XXXXXXXXX
  return re.test(phone);
};

export const getNextStock = (currentStock, change) => {
  const next = currentStock + change;
  return next >= 0 ? next : 0; // Захист від від'ємних значень на рівні розрахунків
};