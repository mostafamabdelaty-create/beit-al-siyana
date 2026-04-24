const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./src/config/db');
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/technicians', require('./src/routes/technician.routes'));
app.use('/api/services', require('./src/routes/service.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));
app.use('/api/packages', require('./src/routes/plan.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));
app.use('/api/join', require('./src/routes/join.routes'));
app.use('/api/customers', require('./src/routes/customer.routes'));
app.use('/api/reviews', require('./src/routes/review.routes'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
});