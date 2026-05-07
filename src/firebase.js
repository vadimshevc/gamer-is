import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCo6J7JeGqzZGvKiNKxih34ScapojyYJpQ",
  authDomain: "ecommerce-serverless-ai-a89f0.firebaseapp.com",
  projectId: "ecommerce-serverless-ai-a89f0",
  storageBucket: "ecommerce-serverless-ai-a89f0.firebasestorage.app",
  messagingSenderId: "884640030257",
  appId: "1:884640030257:web:f4b3356db928731d9eff10"
};

const app = initializeApp(firebaseConfig);
// Експортуємо db, щоб логіка могла її використовувати
export const db = getFirestore(app);