import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartDrawer: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart, clearCart } = useCart();

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const handleCheckout = () => {
    // This would typically redirect to Shopify checkout
    alert('Redirecting to checkout... (not implemented yet)');
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
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

                      {/* Price and Remove Button - Price moved to the right */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Remove Button with "X" icon */}
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-red-500"
                        >
                          <i className="ri-close-line text-lg font-bold"></i>
                        </button>
                        
                        {/* Price - without currency display */}
                        <span className="font-semibold text-gray-900">
                          ${parseFloat(item.price.amount).toFixed(2)}
                        </span>
                      </div>

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
                  className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Checkout
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