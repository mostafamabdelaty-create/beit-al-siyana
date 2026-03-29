const router = require('express').Router();
const { 
  getDashboardStats, 
  getAllTechnicians, 
  getAllCustomers, 
  suspendUser, 
  activateUser 
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/technicians', getAllTechnicians);
router.get('/customers', getAllCustomers);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/activate', activateUser);

module.exports = router;
