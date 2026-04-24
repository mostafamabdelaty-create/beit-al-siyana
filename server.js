const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs'); // نقلناها فوق عشان تبقى جاهزة

const connectDB = require('./src/config/db');
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- [التعديل الجوهري هنا] ---
// تعريف مسارات الملفات الثابتة بشكل صريح لضمان ظهور الصور والتنسيق
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/technicians', require('./src/routes/technician.routes'));
app.use('/api/services', require('./src/routes/service.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));
app.use('/api/packages', require('./src/routes/plan.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));
app.use('/api/join', require('./src/routes/join.routes'));
app.use('/api/customers', require('./src/routes/customer.routes'));
app.use('/api/reviews', require('./src/routes/review.routes'));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all: serve index.html for any unmatched route (SPA behavior)
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// For local dev
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;