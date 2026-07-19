import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('customer'); // 'customer' or 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const endpoint = userType === 'admin' ? '/admin/login' : '/auth/login';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userType', userType);

      // Update Redux
      dispatch(loginSuccess({ user: data.user, token: data.token }));

      // Redirect
      if (userType === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/profile');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">🛍️ City Shoes</h1>
            <p className="text-gray-600">Quality is our priority</p>
          </div>

          {/* User Type Selector */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('customer')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                userType === 'customer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                userType === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              👨‍💼 Admin
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">
            {userType === 'admin' ? 'Admin Login' : 'Customer Login'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email or Phone</label>
              <input
                type="text"
                placeholder="Enter email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            {userType === 'customer' ? (
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 font-bold hover:underline">
                  Register here
                </Link>
              </p>
            ) : (
              <p className="text-center text-gray-600 text-sm">
                Only admins can log in here. Contact support for admin access.
              </p>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}