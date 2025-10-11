import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

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

const Header: React.FC = () => {
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
              Products
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

export default Header;
