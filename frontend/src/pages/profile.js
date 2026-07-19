import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { logout } from '../redux/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [userType, setUserType] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setUserType(storedUserType || 'customer');
  }, [router]);

  if (!user) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    dispatch(logout());
    router.push('/');
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👤</div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'account'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  ⚙️ Account
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'orders'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  🚗 Orders
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'settings'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  🔧 Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 font-semibold"
                >
                  🚪 Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">👤 Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600">Name</label>
                    <p className="text-xl font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Email</label>
                    <p className="text-xl font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Phone</label>
                    <p className="text-xl font-semibold">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Region</label>
                    <p className="text-xl font-semibold">{user.region || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Gender</label>
                    <p className="text-xl font-semibold">{user.gender || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">⚙️ Account Settings</h2>
                <div className="space-y-4">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    📧 Change Email
                  </button>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    🔐 Change Password
                  </button>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    📍 Manage Addresses
                  </button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">🚗 Placed Orders</h2>
                <p className="text-gray-600 text-center py-8">No orders yet. Start shopping!</p>
                <Link href="/" className="block text-center text-blue-600 font-semibold hover:underline">
                  Continue Shopping
                </Link>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">🔧 Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Language</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>English</option>
                      <option>Français</option>
                      <option>Kiswahili</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Notifications</label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span>Email notifications for orders</span>
                    </label>
                  </div>
                  <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                    🗑️ Delete Account (14-day recovery)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}