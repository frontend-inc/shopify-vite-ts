import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './contexts/CartContext';
import Home from '@/components/Home';
import ProductDetail from './components/ProductDetail';
import Collections from './components/Collections';
import CollectionDetail from './components/CollectionDetail';
import CartDrawer from './components/CartDrawer';

const CartIcon: React.FC = () => {
  const { state, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-black hover:text-gray-600 transition-colors"
    >
      <i className="ri-shopping-cart-line text-2xl"></i>
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  );
};

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-black" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Store
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-black hover:text-gray-600 font-medium transition-colors"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              Home
            </Link>
            <Link 
              to="/collections" 
              className="text-black hover:text-gray-600 font-medium transition-colors"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              Collections
            </Link>
            
            {/* Cart Icon */}
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:handle" element={<CollectionDetail />} />
          <Route path="/products/:handle" element={<ProductDetail />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 
            className="text-2xl font-bold mb-4" 
            style={{fontFamily: 'Space Grotesk, sans-serif'}}
          >
            Store
          </h3>
          <p className="text-gray-400 mb-6">
            Your premium shopping destination
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/collections" className="text-gray-400 hover:text-white transition-colors">
              Collections
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400">
            <p>&copy; 2025 Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

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