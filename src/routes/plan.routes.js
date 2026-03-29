const router = require('express').Router();
const { 
  getPlans, 
  createPlan, 
  updatePlan, 
  deletePlan 
} = require('../controllers/plan.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', getPlans);

// Admin Only
router.post('/', protect, authorize('admin'), createPlan);
router.put('/:id', protect, authorize('admin'), updatePlan);
router.delete('/:id', protect, authorize('admin'), deletePlan);

module.exports = router;
