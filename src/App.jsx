import React, { useState } from 'react';
import Landing from './Landing';
import Shop from './Shop';
import { useEffect } from 'react';
import { logger } from './utils/logger';
/**
 * Головний компонент додатку GamerIS.
 * Керує станом перемикання між лендінгом та основним інтерфейсом магазину.
 * @returns {React.JSX.Element} Повертає дерево компонентів додатку.
 */
function App() {
  useEffect(() => {
    logger.info('System', 'Застосунок GamerIS запущено');
    return () => logger.info('System', 'Застосунок зупинено/перезавантажено');
  }, []);
  const [showShop, setShowShop] = useState(false);
  return showShop ? <Shop /> : <Landing onStart={() => setShowShop(true)} />;
}
export default App;