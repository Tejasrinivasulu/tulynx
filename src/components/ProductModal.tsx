import React from 'react';
import { X, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  gender: string;
  fragranceNotes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { dispatch } = useCart();

  if (!isOpen || !product) return null;

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-amber-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-purple-600 mb-4">${product.price}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fragrance Notes</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-purple-600">Top Notes:</span>
                      <p className="text-gray-600">{product.fragranceNotes.top.join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-600">Middle Notes:</span>
                      <p className="text-gray-600">{product.fragranceNotes.middle.join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-600">Base Notes:</span>
                      <p className="text-gray-600">{product.fragranceNotes.base.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <span className="text-sm text-gray-600">For: {product.gender}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">Category: {product.category}</span>
                </div>

                <button
                  onClick={addToCart}
                  className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-amber-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;