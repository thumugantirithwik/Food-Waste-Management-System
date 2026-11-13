const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTrends,
  getCategoryStats,
  getDonorStats,
  getNgoStats,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/overview', protect, authorize('admin'), getOverview);
router.get('/trends', protect, authorize('admin'), getTrends);
router.get('/categories', protect, authorize('admin'), getCategoryStats);
router.get('/donor-stats', protect, authorize('donor', 'admin'), getDonorStats);
router.get('/ngo-stats', protect, authorize('ngo', 'admin'), getNgoStats);

module.exports = router;
