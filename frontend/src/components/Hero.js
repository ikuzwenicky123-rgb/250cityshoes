import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">City Shoes Store</h1>
        <p className="text-xl mb-8">Quality is our priority</p>
        <p className="text-lg mb-8">Premium shoes and clothing in Kigali, Rwanda</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100">
          Shop Now
        </button>
      </div>
    </section>
  );
}