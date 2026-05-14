const router = require('express').Router();
const { 
  getTechnicians, 
  getTechniciansByService, 
  getTechnicianById, 
  getMe,
  updateProfile, 
  uploadProfileImage,
  addToGallery, 
  removeFromGallery,
  incrementRequestCount
} = require('../controllers/technician.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { mustChangePassword } = require('../middleware/mustChangePassword.middleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage: storage });

// Technician Only
router.get('/me', protect, authorize('technician'), getMe);

// Public
router.get('/', getTechnicians);
router.get('/service/:serviceName', getTechniciansByService);
router.get('/:id', getTechnicianById);
router.put('/profile', protect, authorize('technician'), mustChangePassword, updateProfile);
router.post('/profile-image', protect, authorize('technician'), mustChangePassword, upload.single('media'), uploadProfileImage);
router.post('/gallery', protect, authorize('technician'), mustChangePassword, upload.single('media'), addToGallery);
router.delete('/gallery', protect, authorize('technician'), mustChangePassword, removeFromGallery);
router.post('/:id/track-request', incrementRequestCount);

module.exports = router;
