import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

let socket;

export default function OrderTracking() {
  const router = useRouter();
  const user = useSelector(state => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user ID from stored user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.id;

    // Fetch user orders
    fetchOrders(userId);

    // Initialize Socket.io for real-time updates
    initializeSocket(userId);

    return () => {
      if (socket) socket.disconnect();
    };
  }, [router]);

  const initializeSocket = (userId) => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      reconnection: true,
    });

    socket.on('connect', () => {
      console.log('Connected to order tracking');
      // Join room for this user
      socket.emit('join_user_room', { userId });
    });

    // Listen for payment verification updates
    socket.on('payment_verified', (data) => {
      setRealTimeUpdates(prev => ({
        ...prev,
        [data.orderId]: 'Payment verified! Order is now being processed.',
      }));
      fetchOrders(userId);
    });

    // Listen for payment rejection
    socket.on('payment_rejected', (data) => {
      setRealTimeUpdates(prev => ({
        ...prev,
        [data.orderId]: `Payment rejected: ${data.reason}`,
      }));
      fetchOrders(userId);
    });

    // Listen for order status updates
    socket.on('order_status_update', (data) => {
      setRealTimeUpdates(prev => ({
        ...prev,
        [data.orderId]: `Order status: ${data.status}`,
      }));
      fetchOrders(userId);
    });
  };

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 border-blue-400';
      case 'processing':
        return 'bg-purple-100 border-purple-400';
      case 'shipped':
        return 'bg-orange-100 border-orange-400';
      case 'delivered':
        return 'bg-green-100 border-green-400';
      case 'cancelled':
        return 'bg-red-100 border-red-400';
      default:
        return 'bg-gray-100 border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'processing':
        return '🔄';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '🚚';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="text-center py-20">Loading your orders...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">🚚 Order Tracking</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
            <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className={`border-2 p-6 rounded-lg ${getStatusColor(order.status)}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-2xl font-bold">Order #{order.id}</p>
                    <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl">{getStatusIcon(order.status)}</p>
                    <p className="text-xl font-bold capitalize">{order.status}</p>
                  </div>
                </div>

                {/* Real-time Update Message */}
                {realTimeUpdates[order.id] && (
                  <div className="bg-blue-200 border border-blue-400 text-blue-800 px-4 py-2 rounded mb-4">
                    🔔 {realTimeUpdates[order.id]}
                  </div>
                )}

                {/* Payment Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Payment Status</p>
                    <p className="text-lg font-semibold">
                      {order.paymentStatus === 'pending' && '⏳ Pending Verification'}
                      {order.paymentStatus === 'verified' && '✅ Verified'}
                      {order.paymentStatus === 'rejected' && '❌ Rejected'}
                    </p>
                    {order.rejectReason && (
                      <p className="text-red-600 text-sm mt-1">Reason: {order.rejectReason}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">RWF {order.totalAmount}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Items:</p>
                  <div className="bg-white bg-opacity-50 p-3 rounded space-y-1">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm">
                        • {item.name} (Qty: {item.quantity}) - RWF {(item.price * item.quantity).toFixed(2)}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white bg-opacity-50 p-4 rounded">
                  <p className="font-semibold mb-2">📍 Delivery Address:</p>
                  <p className="text-sm">{order.customerInfo.address}</p>
                  <p className="text-sm">{order.customerInfo.city}, {order.customerInfo.region}</p>
                  <p className="text-sm mt-2">📞 {order.customerInfo.phone}</p>
                </div>

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-opacity-30 border-gray-400">
                  <p className="font-semibold text-sm mb-3">Timeline:</p>
                  <div className="flex justify-between text-xs">
                    <div className={`flex-1 text-center ${order.paymentStatus === 'verified' ? 'font-bold' : ''}`}>
                      ✅ Order Placed
                    </div>
                    <div className={`flex-1 text-center ${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'font-bold' : ''}`}>
                      {order.status !== 'pending' ? '✅' : '⏳'} Payment Verified
                    </div>
                    <div className={`flex-1 text-center ${['shipped', 'delivered'].includes(order.status) ? 'font-bold' : ''}`}>
                      {['shipped', 'delivered'].includes(order.status) ? '✅' : '⏳'} Shipped
                    </div>
                    <div className={`flex-1 text-center ${order.status === 'delivered' ? 'font-bold' : ''}`}>
                      {order.status === 'delivered' ? '✅' : '⏳'} Delivered
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}