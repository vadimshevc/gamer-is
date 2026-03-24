import React, { useState } from 'react';
import Landing from './Landing';
import Shop from './Shop'; // Це твоя стара ІС

function App() {
  const [showShop, setShowShop] = useState(false);
  return showShop ? <Shop /> : <Landing onStart={() => setShowShop(true)} />;
}
export default App;