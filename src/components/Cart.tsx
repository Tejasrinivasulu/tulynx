import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowLeft, Trash2, Package, Shield, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const closeCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={closeCart}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">Your Shopping Cart</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                <ShoppingBag className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-xl font-medium mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add some perfumes to get started</p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center gap-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-purple-600 font-semibold mb-2">${item.price}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${state.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (8%)</span>
                        <span>${(state.total * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${(state.total * 1.08).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-5 h-5 text-purple-600" />
                        <span className="text-sm">Free shipping on all orders</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-sm">Secure payment processing</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Truck className="w-5 h-5 text-purple-600" />
                        <span className="text-sm">Fast delivery</span>
                      </div>
                    </div>

                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-amber-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Checkout</span>
                    </Link>

                    <button
                      onClick={closeCart}
                      className="w-full mt-3 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;