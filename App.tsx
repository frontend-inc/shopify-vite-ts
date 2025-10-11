import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Home from '@/components/Home';
import ProductDetail from './components/ProductDetail';
import Collections from './components/Collections';
import CollectionDetail from './components/CollectionDetail';
import CartDrawer from './components/CartDrawer';
import Header from './components/Header';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:handle" element={<CollectionDetail />} />
          <Route path="/products/:handle" element={<ProductDetail />} />
        </Routes>
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;