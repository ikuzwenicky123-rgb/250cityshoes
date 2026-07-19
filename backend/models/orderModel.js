const pool = require('../config/database');

// Create order
const createOrder = async (orderData) => {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerRegion,
      paymentMethodId,
      totalAmount,
      paymentProofUrl,
    } = orderData;

    const result = await pool.query(
      `INSERT INTO orders (
        user_id, customer_name, customer_email, customer_phone,
        customer_address, customer_city, customer_region,
        payment_method_id, total_amount, payment_proof_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        userId,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerCity,
        customerRegion,
        paymentMethodId,
        totalAmount,
        paymentProofUrl,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get all orders
const getAllOrders = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get user orders
const getUserOrders = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get order by ID with items
const getOrderById = async (orderId) => {
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return null;
    }

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );

    return {
      ...orderResult.rows[0],
      items: itemsResult.rows,
    };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Verify payment
const verifyPayment = async (orderId, verifiedBy) => {
  try {
    const result = await pool.query(
      `UPDATE orders SET
        payment_status = 'verified',
        status = 'confirmed',
        verified_by = $1,
        verified_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [verifiedBy, orderId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Reject payment
const rejectPayment = async (orderId, reason, rejectedBy) => {
  try {
    const result = await pool.query(
      `UPDATE orders SET
        payment_status = 'rejected',
        payment_reject_reason = $1,
        verified_by = $2,
        verified_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [reason, rejectedBy, orderId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get orders by status
const getOrdersByStatus = async (status) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get pending payment orders
const getPendingPaymentOrders = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE payment_status = \'pending\' ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
  rejectPayment,
  getOrdersByStatus,
  getPendingPaymentOrders,
};
