import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AVAILABLE_PERMISSIONS = [
  { id: 'view_orders', label: '👁️ View Orders', description: 'Can view all customer orders' },
  { id: 'verify_payments', label: '✅ Verify Payments', description: 'Can verify or reject payments' },
  { id: 'manage_payment_methods', label: '💳 Manage Payment Methods', description: 'Can add/edit payment methods' },
  { id: 'update_order_status', label: '📦 Update Order Status', description: 'Can change order status' },
  { id: 'view_customers', label: '👥 View Customers', description: 'Can view customer information' },
  { id: 'manage_products', label: '🛍️ Manage Products', description: 'Can add/edit/delete products' },
  { id: 'view_analytics', label: '📊 View Analytics', description: 'Can view sales analytics' },
  { id: 'manage_guests', label: '👤 Manage Guest Admins', description: 'Can create/edit guest admins (main admin only)' },
];

export default function AdminGuestAdmins() {
  const router = useRouter();
  const [guestAdmins, setGuestAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    permissions: [],
  });
  const [editingPermissions, setEditingPermissions] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (!token || userType !== 'admin') {
      router.push('/login');
      return;
    }

    fetchGuestAdmins();
  }, [router]);

  const fetchGuestAdmins = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/guest-admins`);
      const data = await response.json();
      setGuestAdmins(data);
    } catch (error) {
      console.error('Error fetching guest admins:', error);
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

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      const permissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || formData.permissions.length === 0) {
      alert('Please fill all fields and select at least one permission');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/guest-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Guest admin created! Temporary password sent to email.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          permissions: [],
        });
        setShowForm(false);
        fetchGuestAdmins();
      } else {
        const error = await response.json();
        alert(error.message || 'Error creating guest admin');
      }
    } catch (error) {
      console.error('Error creating guest admin:', error);
      alert('Error creating guest admin');
    }
  };

  const handleUpdatePermissions = async (guestAdminId, newPermissions) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/guest-admins/${guestAdminId}/permissions`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permissions: newPermissions }),
        }
      );

      if (response.ok) {
        alert('Permissions updated!');
        setEditingPermissions(null);
        fetchGuestAdmins();
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Error updating permissions');
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Are you sure you want to deactivate this guest admin?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/guest-admins/${id}/deactivate`,
        { method: 'PATCH' }
      );

      if (response.ok) {
        alert('Guest admin deactivated!');
        fetchGuestAdmins();
      }
    } catch (error) {
      console.error('Error deactivating guest admin:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this guest admin?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/guest-admins/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Guest admin deleted!');
        fetchGuestAdmins();
      }
    } catch (error) {
      console.error('Error deleting guest admin:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">👤 Guest Admins Management</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({
                name: '',
                email: '',
                phone: '',
                permissions: [],
              });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '➕ Create Guest Admin'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Guest Admin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Permissions */}
              <div>
                <p className="font-bold mb-4">Select Permissions:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_PERMISSIONS.filter(p => p.id !== 'manage_guests').map(permission => (
                    <label key={permission.id} className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="ml-3">
                        <p className="font-semibold">{permission.label}</p>
                        <p className="text-gray-600 text-sm">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
              >
                Create Guest Admin
              </button>
            </form>
          </div>
        )}

        {/* Guest Admins List */}
        <div className="space-y-4">
          {guestAdmins.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No guest admins yet</p>
            </div>
          ) : (
            guestAdmins.map(guestAdmin => (
              <div key={guestAdmin.id} className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Info */}
                  <div>
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="text-xl font-bold">{guestAdmin.name}</p>
                    <p className="text-gray-600 text-sm mt-2">{guestAdmin.email}</p>
                    <p className="text-gray-600 text-sm">{guestAdmin.phone}</p>
                    <p className="text-sm mt-3">
                      Status: <span className={`font-bold ${
                        guestAdmin.status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {guestAdmin.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </p>
                  </div>

                  {/* Permissions */}
                  <div>
                    <p className="text-gray-600 text-sm font-bold mb-2">Permissions ({guestAdmin.permissions.length})</p>
                    <div className="space-y-1">
                      {guestAdmin.permissions.slice(0, 4).map(perm => {
                        const permObj = AVAILABLE_PERMISSIONS.find(p => p.id === perm);
                        return (
                          <p key={perm} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mr-2 mb-1">
                            {permObj?.label || perm}
                          </p>
                        );
                      })}
                      {guestAdmin.permissions.length > 4 && (
                        <p className="text-sm text-gray-600">+{guestAdmin.permissions.length - 4} more</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setEditingPermissions(guestAdmin.id);
                      }}
                      className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      ✏️ Edit Permissions
                    </button>
                    {guestAdmin.status === 'active' ? (
                      <button
                        onClick={() => handleDeactivate(guestAdmin.id)}
                        className="block w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm"
                      >
                        🔒 Deactivate
                      </button>
                    ) : (
                      <button
                        disabled
                        className="block w-full bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed"
                      >
                        🔒 Inactive
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(guestAdmin.id)}
                      className="block w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Edit Permissions Modal */}
                {editingPermissions === guestAdmin.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-300">
                    <p className="font-bold mb-3">Update Permissions:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {AVAILABLE_PERMISSIONS.filter(p => p.id !== 'manage_guests').map(permission => (
                        <label key={permission.id} className="flex items-start">
                          <input
                            type="checkbox"
                            checked={guestAdmin.permissions.includes(permission.id)}
                            onChange={(e) => {
                              const newPerms = e.target.checked
                                ? [...guestAdmin.permissions, permission.id]
                                : guestAdmin.permissions.filter(p => p !== permission.id);
                              setGuestAdmins(guestAdmins.map(g => 
                                g.id === guestAdmin.id ? { ...g, permissions: newPerms } : g
                              ));
                            }}
                            className="mt-1 w-4 h-4"
                          />
                          <span className="ml-2 text-sm">{permission.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdatePermissions(guestAdmin.id, guestAdmin.permissions)}
                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingPermissions(null)}
                        className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}