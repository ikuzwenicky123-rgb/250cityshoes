import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { useTranslation } = require('react-i18next');
  const { useSelector } = require('react-redux');
  const { useRouter } = require('next/router');

  const { t, i18n } = useTranslation();
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.auth.user);
  const router = useRouter();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">🛍️ City Shoes</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-gray-100 px-3 py-1 rounded text-sm"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="sw">Kiswahili</option>
            </select>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Profile/Admin */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {userType === 'admin' ? (
                  <>
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-semibold">
                      👨‍💼 Admin
                    </Link>
                    <Link href="/admin/orders" className="text-gray-700 hover:text-blue-600 text-sm">
                      📦 Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/order-tracking" className="text-gray-700 hover:text-blue-600 text-sm">
                      🚚 My Orders
                    </Link>
                    <Link href="/profile" className="text-2xl">👤</Link>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}