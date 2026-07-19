const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Products Routes (placeholder)
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Classic T-Shirt', category: 'tshirts', price: 29.99, description: 'Comfortable cotton t-shirt' },
    { id: 2, name: 'Blue Jeans', category: 'jeans', price: 59.99, description: 'Premium denim jeans' },
    { id: 3, name: 'Sport Hoody', category: 'hoodies', price: 49.99, description: 'Warm and cozy hoodie' },
  ];
  res.json(products);
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Admin notifications
  socket.on('new_order', (data) => {
    io.emit('order_notification', data);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };