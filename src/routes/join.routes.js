const router = require('express').Router();
const { 
  submitJoinRequest, 
  getAllJoinRequests, 
  approveJoinRequest, 
  rejectJoinRequest 
} = require('../controllers/join.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/screenshots/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Public
router.post('/', upload.single('paymentScreenshot'), submitJoinRequest);

// Admin Only
router.get('/admin', protect, authorize('admin'), getAllJoinRequests);
router.put('/admin/:id/approve', protect, authorize('admin'), approveJoinRequest);
router.put('/admin/:id/reject', protect, authorize('admin'), rejectJoinRequest);

module.exports = router;
