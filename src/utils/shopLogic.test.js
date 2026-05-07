import { describe, it, expect } from 'vitest';
import { calculateTotal, canAddToCart, isPromoValid } from './shopLogic';

describe('Тестування логіки GamerIS Pro', () => {

  // Тест 1: Розрахунок суми (FR-1)
  it('має правильно рахувати суму без знижки', () => {
    const items = [{ price: 1000, quantity: 2 }];
    expect(calculateTotal(items, 0)).toBe(2000);
  });

  // Тест 2: Розрахунок зі знижкою (FR-2)
  it('має застосовувати знижку 10%', () => {
    const items = [{ price: 1000, quantity: 1 }];
    expect(calculateTotal(items, 10)).toBe(900);
  });

  // Тест 3: Перевірка ліміту (Граничні значення)
  // it('не має дозволяти додавати більше 5 одиниць товару', () => {
  //   expect(canAddToCart(5, 10)).toBe(false); // Вже є 5, більше не можна
  // });
  it('має забороняти додавання, якщо склад порожній', () => {
    expect(canAddToCart(0, 0)).toBe(false);
  });
  
  it('має дозволяти додавати товар, якщо кількість менша за склад', () => {
    // На складі 10, у кошику вже 6 — це має бути дозволено
    expect(canAddToCart(6, 10)).toBe(true);
  });

  it('не має дозволяти додавання, якщо кількість у кошику зрівнялася зі складом', () => {
    // На складі 5, у кошику вже 5 — більше додати не можна
    expect(canAddToCart(5, 5)).toBe(false);
  });

  // Тест 4: Перевірка складу
  it('не має дозволяти додавати товар, якщо склад порожній', () => {
    expect(canAddToCart(0, 0)).toBe(false);
  });

  // Тест 5: Промокод
  it('має валідувати правильний промокод GGWP2026', () => {
    expect(isPromoValid("GGWP2026")).toBe(true);
    expect(isPromoValid("HACK")).toBe(false);
  });

  // Тест 6. Валідація номеру телефону
  it('має правильно валідувати українські номери', () => {
    expect(validatePhone("0971234567")).toBe(true);
    expect(validatePhone("123")).toBe(false);
  });
});