import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

let socket;

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (!token || userType !== 'admin') {
      router.push('/login');
      return;
    }

    // Fetch orders
    fetchOrders();

    // Initialize Socket.io
    initializeSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [router]);

  const initializeSocket = () => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      reconnection: true,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Listen for new order notifications
    socket.on('new_order_notification', (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'new_order',
        message: `New order #${data.orderId} from ${data.customerName}`,
        timestamp: new Date(),
        read: false,
      }, ...prev]);
      fetchOrders(); // Refresh orders list
    });

    socket.on('payment_update', (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'payment_update',
        message: `Payment update for order #${data.orderId}`,
        timestamp: new Date(),
        read: false,
      }, ...prev]);
    });
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId, isVerified) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/verify-payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified,
          rejectReason: !isVerified ? rejectReason : null,
        }),
      });

      if (response.ok) {
        alert(isVerified ? 'Payment verified!' : 'Payment rejected!');
        setVerifyModalOpen(false);
        setRejectReason('');
        fetchOrders();

        // Emit notification to customer via Socket.io
        if (socket) {
          socket.emit('payment_verified', {
            orderId,
            isVerified,
          });
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Error verifying payment');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
        // Emit notification to customer
        if (socket) {
          socket.emit('order_status_changed', {
            orderId,
            status: newStatus,
          });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading orders...</div>;
  }

  const pendingPaymentOrders = orders.filter(o => o.paymentStatus === 'pending');
  const verifiedOrders = orders.filter(o => o.paymentStatus === 'verified');

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Notifications Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">🔔 Notifications</h2>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No new notifications</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <div key={notif.id} className="bg-blue-50 p-3 rounded-lg text-sm border-l-4 border-blue-600">
                      <p className="font-semibold">{notif.message}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {notif.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Pending Payment Verification */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">⏳ Pending Payment Verification ({pendingPaymentOrders.length})</h2>
                {pendingPaymentOrders.length === 0 ? (
                  <p className="text-gray-500">No pending payments</p>
                ) : (
                  <div className="space-y-4">
                    {pendingPaymentOrders.map(order => (
                      <div key={order.id} className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg">Order #{order.id}</p>
                            <p className="text-gray-600">{order.customerInfo.name}</p>
                            <p className="text-gray-600">{order.customerInfo.phone}</p>
                            <p className="font-semibold text-lg mt-2">RWF {order.totalAmount}</p>
                            <p className="text-sm text-gray-600 mt-1">{order.items.length} item(s)</p>
                          </div>
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setVerifyModalOpen(true);
                              }}
                              className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                            >
                              ✅ Verify Payment
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setVerifyModalOpen(true);
                              }}
                              className="block w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                            >
                              ❌ Reject
                            </button>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                            >
                              👁️ View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Orders */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">✅ Verified Orders ({verifiedOrders.length})</h2>
                {verifiedOrders.length === 0 ? (
                  <p className="text-gray-500">No verified orders</p>
                ) : (
                  <div className="space-y-4">
                    {verifiedOrders.map(order => (
                      <div key={order.id} className="border border-green-300 bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg">Order #{order.id}</p>
                            <p className="text-gray-600">{order.customerInfo.name}</p>
                            <p className="text-sm text-gray-600">Status: <span className="font-semibold">{order.status}</span></p>
                          </div>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order Details #{selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-2xl hover:text-red-600"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h3 className="font-bold mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                <p><strong>City/Region:</strong> {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.region}</p>
              </div>

              {/* Items */}
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h3 className="font-bold mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <p key={idx}>
                      {item.name} x {item.quantity} = RWF {(item.price * item.quantity).toFixed(2)}
                    </p>
                  ))}
                </div>
                <p className="font-bold mt-4 text-lg">Total: RWF {selectedOrder.totalAmount}</p>
              </div>

              {/* Payment Proof */}
              {selectedOrder.paymentProof && (
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <h3 className="font-bold mb-2">Payment Proof</h3>
                  <p className="text-sm text-gray-600">File: {selectedOrder.paymentProof}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedOrder.paymentStatus === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      handleVerifyPayment(selectedOrder.id, true);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
                  >
                    ✅ Verify Payment
                  </button>
                  <button
                    onClick={() => setVerifyModalOpen(true)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
                  >
                    ❌ Reject Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {verifyModalOpen && selectedOrder && selectedOrder.paymentStatus === 'pending' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Reject Payment</h2>
              <textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-24"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleVerifyPayment(selectedOrder.id, false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
                >
                  Reject
                </button>
                <button
                  onClick={() => setVerifyModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}