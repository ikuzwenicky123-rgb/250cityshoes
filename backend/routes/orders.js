const express = require('express');
const router = express.Router();

// Temporary order storage
const orders = [];

// Get all orders (Admin)
router.get('/', (req, res) => {
  // TODO: Verify admin authentication
  res.json(orders);
});

// Get user orders
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userOrders = orders.filter(o => o.userId === parseInt(userId));
  res.json(userOrders);
});

// Create order
router.post('/', (req, res) => {
  try {
    const { customerInfo, paymentMethodId, items, totalAmount, paymentProof } = req.body;

    const newOrder = {
      id: Date.now(),
      userId: Math.random(), // Will be replaced with actual user ID from auth
      customerInfo: JSON.parse(customerInfo),
      paymentMethodId,
      items: JSON.parse(items),
      totalAmount: parseFloat(totalAmount),
      paymentProof: paymentProof ? paymentProof.filename : null,
      status: 'pending', // pending, verified, shipped, delivered, cancelled
      paymentStatus: 'pending', // pending, verified, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(newOrder);

    // TODO: Emit socket event to admin: 'new_order_notification'
    res.status(201).json({
      message: 'Order created successfully. Waiting for payment verification.',
      order: newOrder,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === parseInt(id));

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

// Update order status (Admin)
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = orders.find(o => o.id === parseInt(id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date();

  // TODO: Emit socket event to customer: 'order_status_update'

  res.json({
    message: 'Order status updated',
    order,
  });
});

// Verify payment (Admin)
router.put('/:id/verify-payment', (req, res) => {
  const { id } = req.params;
  const { isVerified, rejectReason } = req.body;

  const order = orders.find(o => o.id === parseInt(id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (isVerified) {
    order.paymentStatus = 'verified';
    order.status = 'confirmed';
  } else {
    order.paymentStatus = 'rejected';
    order.rejectReason = rejectReason;
  }

  order.updatedAt = new Date();

  // TODO: Emit socket event to customer: 'payment_status_update'

  res.json({
    message: isVerified ? 'Payment verified' : 'Payment rejected',
    order,
  });
});

module.exports = router;