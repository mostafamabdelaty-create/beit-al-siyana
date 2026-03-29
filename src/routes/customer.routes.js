const router = require('express').Router();
const { getCustomerProfile, updateCustomerProfile } = require('../controllers/customer.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);
router.use(authorize('customer'));

router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);

module.exports = router;
