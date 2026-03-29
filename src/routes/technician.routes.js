const router = require('express').Router();
const { 
  getTechnicians, 
  getTechniciansByService, 
  getTechnicianById, 
  updateProfile, 
  addToGallery, 
  removeFromGallery 
} = require('../controllers/technician.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { mustChangePassword } = require('../middleware/mustChangePassword.middleware');

// Public
router.get('/', getTechnicians);
router.get('/service/:serviceName', getTechniciansByService);
router.get('/:id', getTechnicianById);

// Technician Only
router.put('/profile', protect, authorize('technician'), mustChangePassword, updateProfile);
router.post('/gallery', protect, authorize('technician'), mustChangePassword, addToGallery);
router.delete('/gallery/:index', protect, authorize('technician'), mustChangePassword, removeFromGallery);

module.exports = router;
