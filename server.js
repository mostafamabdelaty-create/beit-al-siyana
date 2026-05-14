// 🔥 مهم جدًا يكون أول سطر
require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

const connectDB = require('./src/config/db');

dotenv.config();

// Ensure upload directories exist
const uploadDirs = ['uploads/gallery', 'uploads/profiles', 'uploads/videos', 'uploads/screenshots'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Connect to Database
connectDB();

const app = express();
const reactDistPath = path.join(__dirname, 'client', 'dist');
const hasReactBuild = fs.existsSync(path.join(reactDistPath, 'index.html'));

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static الملفات
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (hasReactBuild) {
  app.use(express.static(reactDistPath));
} else {
  app.use(express.static(path.join(__dirname)));
  app.use('/css', express.static(path.join(__dirname, 'css')));
  app.use('/Images', express.static(path.join(__dirname, 'Images')));
  app.use('/js', express.static(path.join(__dirname, 'js')));
}

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

// React build أو HTML fallback
if (hasReactBuild) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(reactDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Run server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
  });
}

module.exports = app;