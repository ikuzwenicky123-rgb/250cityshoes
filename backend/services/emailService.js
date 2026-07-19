const nodemailer = require('nodemailer');
const emailModel = require('../models/emailModel');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change to your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email templates
const emailTemplates = {
  orderConfirmation: (customerName, orderId, totalAmount) => ({
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <h2>Order Confirmation</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> #${orderId}</p>
      <p><strong>Total Amount:</strong> RWF ${totalAmount}</p>
      <p>We will verify your payment and notify you shortly.</p>
      <p>Best regards,<br>City Shoes Team</p>
    `,
  }),
  paymentVerified: (customerName, orderId) => ({
    subject: `Payment Verified - Order #${orderId}`,
    html: `
      <h2>Payment Verified</h2>
      <p>Hi ${customerName},</p>
      <p>Your payment for order #${orderId} has been verified!</p>
      <p>We are now processing your order.</p>
      <p><a href="https://cityshoes.store/order-tracking">Track Your Order</a></p>
      <p>Best regards,<br>City Shoes Team</p>
    `,
  }),
  paymentRejected: (customerName, orderId, reason) => ({
    subject: `Payment Review - Order #${orderId}`,
    html: `
      <h2>Payment Review</h2>
      <p>Hi ${customerName},</p>
      <p>We could not verify the payment for order #${orderId}.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please contact support or submit a new order.</p>
      <p><a href="https://cityshoes.store/contact">Contact Support</a></p>
      <p>Best regards,<br>City Shoes Team</p>
    `,
  }),
  orderShipped: (customerName, orderId, trackingNumber) => ({
    subject: `Your Order Has Shipped - #${orderId}`,
    html: `
      <h2>Order Shipped</h2>
      <p>Hi ${customerName},</p>
      <p>Great news! Your order #${orderId} has been shipped.</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber || 'Coming soon'}</p>
      <p><a href="https://cityshoes.store/order-tracking">Track Your Shipment</a></p>
      <p>Best regards,<br>City Shoes Team</p>
    `,
  }),
  orderDelivered: (customerName, orderId) => ({
    subject: `Delivery Confirmed - Order #${orderId}`,
    html: `
      <h2>Order Delivered</h2>
      <p>Hi ${customerName},</p>
      <p>Your order #${orderId} has been delivered!</p>
      <p>We hope you enjoy your purchase. Please leave a review if you can.</p>
      <p><a href="https://cityshoes.store/reviews">Leave a Review</a></p>
      <p>Best regards,<br>City Shoes Team</p>
    `,
  }),
};

// Send email
const sendEmail = async (to, templateName, ...args) => {
  try {
    const template = emailTemplates[templateName](...args);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: template.subject,
      html: template.html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Process pending emails queue
const processPendingEmails = async () => {
  try {
    const pendingEmails = await emailModel.getPendingEmails();

    for (const email of pendingEmails) {
      try {
        await sendEmail(email.recipient_email, 'orderConfirmation', 'Customer', email.related_order_id, 5000);
        await emailModel.updateEmailStatus(email.id, 'sent');
        console.log(`Email ${email.id} sent successfully`);
      } catch (error) {
        await emailModel.updateEmailStatus(email.id, 'failed', error.message);
        console.error(`Failed to send email ${email.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing pending emails:', error);
  }
};

// Start email queue processor (runs every 5 minutes)
const startEmailQueueProcessor = () => {
  setInterval(() => {
    processPendingEmails();
  }, 5 * 60 * 1000); // Every 5 minutes
};

module.exports = {
  sendEmail,
  processPendingEmails,
  startEmailQueueProcessor,
  emailTemplates,
};
