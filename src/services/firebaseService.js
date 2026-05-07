import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Імпортуємо нашу базу з конфігу

/**
 * Функція для отримання всіх товарів з колекції "products"
 */
export const fetchProductsFromCloud = async () => {
  try {
    // 1. Отримуємо посилання на колекцію
    const productsCol = collection(db, "products");
    
    // 2. Робимо запит до Firestore
    const productSnapshot = await getDocs(productsCol);
    
    // 3. Перетворюємо "сирі" дані у зручний масив об'єктів
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,         // Беремо ID документа (той довгий код)
      ...doc.data()       // Розгортаємо всі поля (name, price, description...)
    }));

    return productList;
  } catch (error) {
    console.error("Помилка завантаження товарів GamerIS:", error);
    return []; // Повертаємо порожній масив, щоб сайт не "впав"
  }
};