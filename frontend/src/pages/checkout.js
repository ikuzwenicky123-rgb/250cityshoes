import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { clearCart } from '../redux/cartSlice';

export default function Checkout() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
  });
  const [paymentProof, setPaymentProof] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods`);
      const data = await response.json();
      setPaymentMethods(data);
      if (data.length > 0) {
        setSelectedPaymentMethod(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentProofUpload = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!paymentProof && cartItems.length > 0) {
      alert('Please upload payment proof');
      return;
    }

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('customerInfo', JSON.stringify(customerInfo));
    formData.append('paymentMethodId', selectedPaymentMethod);
    formData.append('items', JSON.stringify(cartItems));
    formData.append('totalAmount', calculateTotal());
    if (paymentProof) {
      formData.append('paymentProof', paymentProof);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Order placed successfully! Admin will verify payment shortly.');
        dispatch(clearCart());
        setPaymentProof(null);
        setCustomerInfo({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          region: '',
        });
      } else {
        alert('Error placing order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="text-center py-20">Loading payment methods...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmitOrder} className="space-y-8">
                {/* Customer Information */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-6">📋 Customer Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="text"
                      name="region"
                      placeholder="Region"
                      value={customerInfo.region}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <textarea
                      name="address"
                      placeholder="Full Address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 md:col-span-2"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-6">💳 Select Payment Method</h2>
                  {paymentMethods.length === 0 ? (
                    <p className="text-gray-500">No payment methods available</p>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <label key={method.id} className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="mt-1 w-4 h-4"
                          />
                          <div className="ml-4 flex-1">
                            <p className="font-bold text-lg">{method.name}</p>
                            <p className="text-gray-600">{method.description}</p>
                            <p className="text-blue-600 font-semibold mt-2">{method.accountNumber}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Instructions */}
                {selectedMethod && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-bold mb-4">📝 Payment Instructions</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Method:</strong> {selectedMethod.name}</p>
                      <p><strong>Account:</strong> {selectedMethod.accountNumber}</p>
                      <p><strong>Amount to Pay:</strong> RWF {calculateTotal()}</p>
                      <p className="text-red-600 mt-4">
                        ⚠️ After payment, upload proof (screenshot) below
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Proof Upload */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-6">📸 Upload Payment Proof</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentProofUpload}
                      className="block w-full"
                    />
                    <p className="text-gray-500 mt-4">Upload screenshot or photo of payment confirmation</p>
                    {paymentProof && (
                      <p className="text-green-600 font-semibold mt-2">✅ {paymentProof.name}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700"
                >
                  Complete Order
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow sticky top-20">
                <h2 className="text-2xl font-bold mb-6">📦 Order Summary</h2>
                <div className="space-y-4 mb-6 border-b pb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">RWF {calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}