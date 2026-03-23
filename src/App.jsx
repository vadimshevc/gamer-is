import React, { useState } from 'react';
import Shop from './Shop';
import Landing from './Landing';

function App() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  return isShopOpen ? <Shop /> : <Landing onStart={() => setIsShopOpen(true)} />;
}
export default App;