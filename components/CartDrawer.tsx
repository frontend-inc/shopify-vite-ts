import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { createCart, addCartLines, redirectToCheckout } from '../services/shopify/api.js';

const CartDrawer: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // Create a new cart
      const cart = await createCart();
      
      // Add items to the cart
      const lines = state.items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }));
      
      if (lines.length > 0) {
        const updatedCart = await addCartLines(cart.id, lines);
        // Redirect to Shopify checkout
        redirectToCheckout(updatedCart.checkoutUrl);
      } else {
        // If cart is empty, just create an empty cart and redirect
        redirectToCheckout(cart.checkoutUrl);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to proceed to checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          state.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        state.isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 
              className="text-2xl font-bold"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Shopping Cart ({state.itemCount})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <button
                  onClick={closeCart}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {state.items.map((item) => (
                  <div key={item.variantId} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <i className="ri-image-line text-2xl"></i>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      
                      {/* Variant Info */}
                      {item.variant.selectedOptions.length > 0 && (
                        <div className="text-sm text-gray-500 mb-2">
                          {item.variant.selectedOptions.map((option, index) => (
                            <span key={option.name}>
                              {option.value}
                              {index < item.variant.selectedOptions.length - 1 ? ' / ' : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quantity Controls - smaller size */}
                      <div className="flex items-center mt-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors text-gray-500"
                            disabled={item.quantity <= 1}
                          >
                            <i className="ri-subtract-line text-sm"></i>
                          </button>
                          <span className="px-2 py-1 font-semibold min-w-[30px] text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors text-gray-500"
                          >
                            <i className="ri-add-line text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0">
                      <span className="font-semibold text-gray-900">
                        ${parseFloat(item.price.amount).toFixed(2)}
                      </span>
                    </div>

                    {/* Remove Button with "X" icon */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-red-500"
                      >
                        <i className="ri-close-line text-lg font-bold"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Checkout Section */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              {/* Subtotal - without currency display */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Subtotal</span>
                <span className="text-2xl font-bold">
                  ${state.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Shipping and taxes calculated at checkout
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors ${
                    isCheckingOut 
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                      : 'bg-black text-white'
                  }`}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center space-x-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    'Checkout'
                  )}
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={closeCart}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your cart?')) {
                        clearCart();
                      }
                    }}
                    className="px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;