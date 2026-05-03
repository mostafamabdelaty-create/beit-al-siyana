const router = require('express').Router();
const { getCustomerProfile, updateCustomerProfile, uploadProfileImage } = require('../controllers/customer.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'customer-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.use(protect);
router.use(authorize('customer'));

router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);
router.post('/profile-image', upload.single('media'), uploadProfileImage);

module.exports = router;
