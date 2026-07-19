import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AdminPaymentMethods() {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accountNumber: '',
    type: 'mobile_money',
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/payment-methods`);
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-methods/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/payment-methods`;

    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingId ? 'Payment method updated!' : 'Payment method created!');
        setFormData({
          name: '',
          description: '',
          accountNumber: '',
          type: 'mobile_money',
        });
        setEditingId(null);
        setShowForm(false);
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert('Error saving payment method');
    }
  };

  const handleEdit = (method) => {
    setFormData({
      name: method.name,
      description: method.description,
      accountNumber: method.accountNumber,
      type: method.type,
    });
    setEditingId(method.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/payment-methods/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Payment method deleted!');
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert('Error deleting payment method');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/payment-methods/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error toggling payment method:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">💳 Payment Methods Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              accountNumber: '',
              type: 'mobile_money',
            });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Payment Method'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Payment Method</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Payment Method Name (e.g., MTN Mobile Money)"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <textarea
              name="description"
              placeholder="Description (e.g., Pay using MTN MoMo service)"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number / Phone Number (e.g., 0785634773)"
              value={formData.accountNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
            >
              {editingId ? 'Update' : 'Create'} Payment Method
            </button>
          </form>
        </div>
      )}

      {/* Payment Methods Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Name</th>
              <th className="px-6 py-4 text-left font-bold">Type</th>
              <th className="px-6 py-4 text-left font-bold">Account Number</th>
              <th className="px-6 py-4 text-left font-bold">Status</th>
              <th className="px-6 py-4 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => (
              <tr key={method.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {method.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-blue-600">{method.accountNumber}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(method.id, method.isActive)}
                    className={`px-4 py-1 rounded-full text-white font-semibold ${
                      method.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {method.isActive ? '✓ Active' : '✗ Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(method)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}