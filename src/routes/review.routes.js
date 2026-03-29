const router = require('express').Router();
const { addReview, getTechnicianReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/technician/:id', getTechnicianReviews);
router.post('/', protect, authorize('customer'), addReview);

module.exports = router;
