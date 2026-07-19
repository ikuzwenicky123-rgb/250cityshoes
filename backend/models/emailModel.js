const pool = require('../config/database');

// Create email notification
const createEmailNotification = async (notificationData) => {
  try {
    const {
      userId,
      emailType,
      subject,
      body,
      recipientEmail,
      relatedOrderId,
    } = notificationData;

    const result = await pool.query(
      `INSERT INTO email_notifications (
        user_id, email_type, subject, body, recipient_email, related_order_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [userId, emailType, subject, body, recipientEmail, relatedOrderId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get pending emails
const getPendingEmails = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM email_notifications WHERE status = \'pending\' ORDER BY created_at ASC LIMIT 50'
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Update email status
const updateEmailStatus = async (emailId, status, failedReason = null) => {
  try {
    const result = await pool.query(
      `UPDATE email_notifications SET
        status = $1,
        sent_at = CASE WHEN $1 = 'sent' THEN CURRENT_TIMESTAMP ELSE sent_at END,
        failed_reason = $2
       WHERE id = $3
       RETURNING *`,
      [status, failedReason, emailId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get notification history for user
const getUserNotifications = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM email_notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

module.exports = {
  createEmailNotification,
  getPendingEmails,
  updateEmailStatus,
  getUserNotifications,
};
