import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingPayments: 0,
    guestAdminsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'admin') {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setAdminData(userData);

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    router.push('/');
  };

  if (loading || !adminData) {
    return <div className="text-center py-20">Loading admin dashboard...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">👨‍💼 Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {adminData.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-8 bg-white p-4 rounded-lg shadow overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              📦 Orders
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'payment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              💳 Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'guests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              👤 Guest Admins
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ⚙️ Settings
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-blue-600">RWF {stats.totalSales}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Pending Payments</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalCustomers}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Guest Admins</p>
                  <p className="text-2xl font-bold text-pink-600">{stats.guestAdminsCount}</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/admin/orders"
                    className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-center font-bold"
                  >
                    📦 View Orders
                  </Link>
                  <Link
                    href="/admin/payment-methods"
                    className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-center font-bold"
                  >
                    💳 Payment Methods
                  </Link>
                  <Link
                    href="/admin/guest-admins"
                    className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 text-center font-bold"
                  >
                    👤 Guest Admins
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">📦 Order Management</h2>
              <Link
                href="/admin/orders"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Go to Orders
              </Link>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payment' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">💳 Payment Methods</h2>
              <Link
                href="/admin/payment-methods"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Manage Payment Methods
              </Link>
            </div>
          )}

          {/* Guest Admins Tab */}
          {activeTab === 'guests' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">👤 Guest Admins Management</h2>
              <Link
                href="/admin/guest-admins"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Manage Guest Admins
              </Link>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">⚙️ Website Settings</h2>
              <div className="space-y-4">
                <button className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg text-left px-4 font-semibold">
                  📝 Store Information
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg text-left px-4 font-semibold">
                  🌐 Website Appearance
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg text-left px-4 font-semibold">
                  📧 Email Settings
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg text-left px-4 font-semibold">
                  🔒 Security
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}