const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

const connectDB = require('./src/config/db');
dotenv.config();

const uploadDirs = ['uploads/gallery', 'uploads/profiles', 'uploads/videos', 'uploads/screenshots'];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

connectDB();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/technicians', require('./src/routes/technician.routes'));
app.use('/api/services', require('./src/routes/service.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));
app.use('/api/packages', require('./src/routes/plan.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));
app.use('/api/join', require('./src/routes/join.routes'));
app.use('/api/customers', require('./src/routes/customer.routes'));
app.use('/api/reviews', require('./src/routes/review.routes'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Beit Al Siyana backend is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
}

module.exports = app;
