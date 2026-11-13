const express = require('express');
const router = express.Router();
const FoodRequest = require('../models/FoodRequest');
const FoodDonation = require('../models/FoodDonation');
const {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestsForDonor,
  getRequestById,
  approveRequest,
  rejectRequest,
  cancelRequest,
  markCollected,
  markDelivered,
  completeRequest,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

// === Backward Compatibility for Simple Frontend ===

// GET /api/requests/all
router.get('/all', async (req, res) => {
  try {
    const requests = await FoodRequest.find()
      .populate('foodId')
      .populate('donation')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get food requests',
      error: error.message,
    });
  }
});

// POST /api/requests/request
router.post('/request', async (req, res) => {
  try {
    const { foodId, donationId, requesterName, phone, quantityRequested } = req.body;
    const targetFoodId = foodId || donationId;

    const food = await FoodDonation.findById(targetFoodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food donation not found',
      });
    }

    const request = new FoodRequest({
      foodId: targetFoodId,
      donation: targetFoodId,
      requesterName,
      phone,
      requesterPhone: phone,
      quantityRequested,
      status: 'Pending',
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: 'Food request submitted successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Food request failed',
      error: error.message,
    });
  }
});

// PUT /api/requests/accept/:id
router.put('/accept/:id', async (req, res) => {
  try {
    const request = await FoodRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Accepted', approvedAt: new Date() },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Food request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food request accepted successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to accept request',
      error: error.message,
    });
  }
});

// PUT /api/requests/reject/:id
router.put('/reject/:id', async (req, res) => {
  try {
    const request = await FoodRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Food request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food request rejected successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject request',
      error: error.message,
    });
  }
});

// === Role-Based Protected REST API Routes ===
router.get('/my', protect, authorize('ngo', 'admin'), getMyRequests);
router.get('/for-donor', protect, authorize('donor', 'admin'), getRequestsForDonor);
router.get('/', protect, authorize('admin'), getAllRequests);
router.get('/:id', protect, getRequestById);
router.post('/', protect, authorize('ngo', 'admin'), createRequest);
router.put('/:id/approve', protect, authorize('donor', 'admin'), approveRequest);
router.put('/:id/reject', protect, authorize('donor', 'admin'), rejectRequest);
router.put('/:id/cancel', protect, authorize('ngo', 'admin'), cancelRequest);
router.put('/:id/mark-collected', protect, authorize('volunteer', 'donor', 'admin'), markCollected);
router.put('/:id/mark-delivered', protect, authorize('volunteer', 'admin'), markDelivered);
router.put('/:id/complete', protect, authorize('admin', 'donor'), completeRequest);

module.exports = router;
