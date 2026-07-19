import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">City Shoes Store</h3>
          <p className="text-gray-400">Quality is our priority</p>
          <p className="text-gray-400 text-sm mt-2">Premium shoes and clothing in Kigali, Rwanda</p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contact</h4>
          <p className="text-gray-400">📍 KG 1 Ave, Kigali, Rwanda 00250</p>
          <p className="text-gray-400">📱 +250785634773</p>
          <p className="text-gray-400">📧 info@cityshoes.store</p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Products</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-bold mb-4">Legal</h4>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Return Policy</a></li>
            <li><a href="#" className="hover:text-white">Shipping Info</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 City Shoes Store. All rights reserved. Commercial use restricted.</p>
      </div>
    </footer>
  );
}