const express = require('express');
const router = express.Router();
const {
  assignVolunteer,
  getMyCollections,
  markPickedUp,
  markDelivered,
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/assign', protect, authorize('admin'), assignVolunteer);
router.get('/my', protect, authorize('volunteer', 'admin'), getMyCollections);
router.put('/:id/pickup', protect, authorize('volunteer', 'admin'), markPickedUp);
router.put('/:id/deliver', protect, authorize('volunteer', 'admin'), markDelivered);

module.exports = router;
