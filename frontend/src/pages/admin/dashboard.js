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

    // Fetch stats
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
          <div className="flex gap-4 mb-8 bg-white p-4 rounded-lg shadow">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              📦 Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              🛍️ Products
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'payment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              💳 Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'guests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              👥 Guest Admins
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-3xl font-bold text-blue-600">RWF {stats.totalSales}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total Customers</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalCustomers}</p>
                </div>
              </div>

              {/* Placeholder Content */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">📈 Overview</h2>
                <p className="text-gray-600 text-center py-12">
                  Dashboard analytics will be displayed here. More features coming soon!
                </p>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">📦 Order Management</h2>
              <p className="text-gray-600 text-center py-12">
                Order management interface will be displayed here
              </p>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">🛍️ Products Management</h2>
              <p className="text-gray-600 text-center py-12">
                Product management interface will be displayed here
              </p>
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
              <h2 className="text-2xl font-bold mb-4">👥 Guest Admins Management</h2>
              <p className="text-gray-600 text-center py-12">
                Guest admin management interface will be displayed here
              </p>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">⚙️ Website Settings</h2>
              <p className="text-gray-600 text-center py-12">
                Website settings interface will be displayed here
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}