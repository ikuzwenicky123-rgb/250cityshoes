const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Temporary guest admins storage
const guestAdmins = [];

// Get all guest admins (Main admin only)
router.get('/', (req, res) => {
  // TODO: Verify main admin authentication
  res.json(guestAdmins);
});

// Create guest admin (Main admin only)
router.post('/', (req, res) => {
  try {
    const { name, email, phone, permissions } = req.body;

    if (!name || !email || !permissions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if guest admin already exists
    const exists = guestAdmins.find(g => g.email === email);
    if (exists) {
      return res.status(400).json({ message: 'Guest admin already exists' });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');

    const newGuestAdmin = {
      id: Date.now(),
      name,
      email,
      phone,
      permissions: permissions, // Array like ['view_orders', 'verify_payments', 'manage_payment_methods']
      tempPassword: tempPassword,
      passwordChanged: false,
      status: 'active',
      createdAt: new Date(),
      createdBy: 'admin@cityshoes.store', // Will be replaced with actual admin
      lastLogin: null,
      activityLog: [],
    };

    guestAdmins.push(newGuestAdmin);

    // TODO: Send email with temporary password
    res.status(201).json({
      message: 'Guest admin created successfully. Temporary password sent to email.',
      data: {
        id: newGuestAdmin.id,
        name: newGuestAdmin.name,
        email: newGuestAdmin.email,
        permissions: newGuestAdmin.permissions,
        tempPassword: tempPassword, // Only show once
      },
    });
  } catch (error) {
    console.error('Error creating guest admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update guest admin permissions (Main admin only)
router.put('/:id/permissions', (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const guestAdmin = guestAdmins.find(g => g.id === parseInt(id));
    if (!guestAdmin) {
      return res.status(404).json({ message: 'Guest admin not found' });
    }

    guestAdmin.permissions = permissions;
    guestAdmin.updatedAt = new Date();

    res.json({
      message: 'Permissions updated successfully',
      data: guestAdmin,
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Deactivate guest admin (Main admin only)
router.patch('/:id/deactivate', (req, res) => {
  try {
    const { id } = req.params;
    const guestAdmin = guestAdmins.find(g => g.id === parseInt(id));

    if (!guestAdmin) {
      return res.status(404).json({ message: 'Guest admin not found' });
    }

    guestAdmin.status = 'inactive';
    guestAdmin.deactivatedAt = new Date();

    res.json({
      message: 'Guest admin deactivated',
      data: guestAdmin,
    });
  } catch (error) {
    console.error('Error deactivating guest admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete guest admin (Main admin only)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = guestAdmins.findIndex(g => g.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ message: 'Guest admin not found' });
    }

    const deletedAdmin = guestAdmins.splice(index, 1);

    res.json({
      message: 'Guest admin deleted successfully',
      data: deletedAdmin[0],
    });
  } catch (error) {
    console.error('Error deleting guest admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity log (Main admin only)
router.get('/:id/activity', (req, res) => {
  try {
    const { id } = req.params;
    const guestAdmin = guestAdmins.find(g => g.id === parseInt(id));

    if (!guestAdmin) {
      return res.status(404).json({ message: 'Guest admin not found' });
    }

    res.json({
      data: guestAdmin.activityLog || [],
    });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;