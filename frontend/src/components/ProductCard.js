import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlist } from '../redux/wishlistSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert('Product added to cart!');
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
          👕
        </div>
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-red-100"
        >
          <span className="text-xl">{isWishlisted ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Price */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <span className="text-yellow-400">{'⭐'.repeat(Math.floor(product.rating || 0))}</span>
          <span className="ml-2 text-gray-600 text-sm">({product.reviews || 0})</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Add to Cart
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-semibold text-center"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}