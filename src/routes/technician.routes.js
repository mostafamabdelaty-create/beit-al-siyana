const router = require('express').Router();
const { 
  getTechnicians, 
  getTechniciansByService, 
  getTechnicianById, 
  getMe,
  updateProfile, 
  uploadProfileImage,
  addToGallery, 
  removeFromGallery 
} = require('../controllers/technician.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { mustChangePassword } = require('../middleware/mustChangePassword.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = 'uploads/gallery/';
    if (req.originalUrl.includes('profile-image')) {
      dir = 'uploads/profiles/';
    } else if (file.mimetype.startsWith('video')) {
      dir = 'uploads/videos/';
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

module.exports = router;
