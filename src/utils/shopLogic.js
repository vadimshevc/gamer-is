// 1. Форматування ціни
export const formatCurrency = (val) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(val);

// 2. Розрахунок суми кошика зі знижкою
export const calculateTotal = (items, discount = 0) => {
  const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return sum - (sum * (discount / 100));
};

// 3. Перевірка ліміту замовлення (не більше 5 штук одного товару в одні руки)
export const canAddToCart = (currentQty, stock) => currentQty < stock && currentQty < 5;

// 4. Розрахунок кешбеку (геймерські бали - 2% від суми)
export const calculateCashback = (amount) => Math.floor(amount * 0.02);

// 5. Перевірка валідності промокоду
export const isPromoValid = (code) => code === "GGWP2026";