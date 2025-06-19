import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PaymentSection from '../components/PaymentSection';

const Checkout: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-amber-600 transition-all duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return <PaymentSection />;
};

export default Checkout;