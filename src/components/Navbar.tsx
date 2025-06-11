import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, dispatch } = useCart();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
              Tulynx
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium ${
                isActive('/') ? 'text-purple-600 border-b-2 border-purple-600' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium ${
                isActive('/products') ? 'text-purple-600 border-b-2 border-purple-600' : ''
              }`}
            >
              Products
            </Link>
            <Link
              to="/about"
              className={`text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium ${
                isActive('/about') ? 'text-purple-600 border-b-2 border-purple-600' : ''
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium ${
                isActive('/contact') ? 'text-purple-600 border-b-2 border-purple-600' : ''
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <ShoppingBag className="w-6 h-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={toggleMenu}
                className={`block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 ${
                  isActive('/') ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={toggleMenu}
                className={`block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 ${
                  isActive('/products') ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={toggleMenu}
                className={`block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 ${
                  isActive('/about') ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={toggleMenu}
                className={`block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 ${
                  isActive('/contact') ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;