const router = require('express').Router();
const { 
  createBooking, 
  getMyBookings, 
  getBookingById, 
  getAllBookings, 
  updateBookingStatus 
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.post('/', protect, authorize('customer'), createBooking);
router.get('/my-requests', protect, getMyBookings);
router.get('/:id', protect, getBookingById);

// Admin Only
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id', protect, authorize('admin'), updateBookingStatus);

module.exports = router;
