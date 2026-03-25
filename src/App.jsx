import React, { useState } from 'react';
import Landing from './Landing';
import Shop from './Shop';

/**
 * Головний компонент додатку GamerIS.
 * Керує станом перемикання між лендінгом та основним інтерфейсом магазину.
 * * @returns {React.JSX.Element} Повертає дерево компонентів додатку.
 */

function App() {
  const [showShop, setShowShop] = useState(false);
  return showShop ? <Shop /> : <Landing onStart={() => setShowShop(true)} />;
}
export default App;