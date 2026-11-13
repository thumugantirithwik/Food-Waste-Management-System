const FoodRequest = require('../models/FoodRequest');
const FoodDonation = require('../models/FoodDonation');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Create a food request
// @route   POST /api/requests
// @access  Private (ngo, admin)
const createRequest = async (req, res, next) => {
  try {
    const { donationId, quantityRequested, quantityUnit, notes, collectionPreference } = req.body;

    if (!donationId || !quantityRequested) {
      return res.status(400).json({ success: false, message: 'Donation ID and quantity requested are required' });
    }

    const donation = await FoodDonation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (!['available', 'requested'].includes(donation.status)) {
      return res.status(400).json({ success: false, message: `Donation is not available for requests (status: ${donation.status})` });
    }

    // Check no duplicate active request from same user
    const duplicateRequest = await FoodRequest.findOne({
      donation: donationId,
      requester: req.user._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (duplicateRequest) {
      return res.status(400).json({ success: false, message: 'You already have an active request for this donation' });
    }

    const request = await FoodRequest.create({
      donation: donationId,
      requester: req.user._id,
      requesterName: req.user.name,
      requesterPhone: req.user.phone,
      requesterOrg: req.user.organizationName,
      quantityRequested,
      quantityUnit: quantityUnit || donation.quantityUnit,
      notes,
      collectionPreference,
      status: 'pending',
    });

    // Update donation status to 'requested' if still 'available'
    if (donation.status === 'available') {
      donation.status = 'requested';
      await donation.save();
    }

    // Notify donor
    await createNotification(
      donation.donor,
      req.user._id,
      'new_request',
      'New Food Request',
      `${req.user.name} has requested ${quantityRequested} ${quantityUnit || donation.quantityUnit} of your donation: "${donation.title}"`,
      donation._id,
      request._id
    );

    const populatedRequest = await FoodRequest.findById(request._id)
      .populate('donation', 'title category pickupAddress')
      .populate('requester', 'name email phone organizationName');

    res.status(201).json({ success: true, message: 'Request submitted successfully', request: populatedRequest });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests (admin)
// @route   GET /api/requests
// @access  Admin
const getAllRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FoodRequest.countDocuments(filter);

    const requests = await FoodRequest.find(filter)
      .populate('donation', 'title category pickupAddress status')
      .populate('requester', 'name email phone organizationName')
      .populate('volunteer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requester's own requests
// @route   GET /api/requests/my
// @access  Private (ngo)
const getMyRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { requester: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FoodRequest.countDocuments(filter);

    const requests = await FoodRequest.find(filter)
      .populate('donation', 'title category pickupAddress expiresAt status images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests on donor's donations
// @route   GET /api/requests/for-donor
// @access  Private (donor, admin)
const getRequestsForDonor = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // Find donor's donations
    const donations = await FoodDonation.find({ donor: req.user._id }).select('_id');
    const donationIds = donations.map((d) => d._id);

    const filter = { donation: { $in: donationIds } };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FoodRequest.countDocuments(filter);

    const requests = await FoodRequest.find(filter)
      .populate('donation', 'title category pickupAddress status')
      .populate('requester', 'name email phone organizationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res, next) => {
  try {
    const request = await FoodRequest.findById(req.params.id)
      .populate('donation')
      .populate('requester', 'name email phone organizationName city')
      .populate('volunteer', 'name email phone');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a request
// @route   PUT /api/requests/:id/approve
// @access  Private (donor, admin)
const approveRequest = async (req, res, next) => {
  try {
    const request = await FoodRequest.findById(req.params.id).populate('donation');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Verify req.user is the donor
    if (
      req.user.role !== 'admin' &&
      request.donation.donor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Only the donor or admin can approve this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    request.status = 'approved';
    request.approvedAt = new Date();
    await request.save();

    // Update donation
    const donation = await FoodDonation.findById(request.donation._id);
    donation.status = 'approved';
    donation.quantityAvailable = Math.max(0, (donation.quantityAvailable || 0) - request.quantityRequested);
    await donation.save();

    // Notify requester
    await createNotification(
      request.requester,
      req.user._id,
      'request_approved',
      'Request Approved!',
      `Your request for "${donation.title}" has been approved. Please coordinate pickup.`,
      donation._id,
      request._id
    );

    res.status(200).json({ success: true, message: 'Request approved successfully', request });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a request
// @route   PUT /api/requests/:id/reject
// @access  Private (donor, admin)
const rejectRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const request = await FoodRequest.findById(req.params.id).populate('donation');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (
      req.user.role !== 'admin' &&
      request.donation.donor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Only the donor or admin can reject this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    request.status = 'rejected';
    request.rejectionReason = reason || 'No reason provided';
    await request.save();

    // Check if any other pending requests remain
    const otherPending = await FoodRequest.countDocuments({
      donation: request.donation._id,
      status: 'pending',
    });

    if (otherPending === 0) {
      await FoodDonation.findByIdAndUpdate(request.donation._id, { status: 'available' });
    }

    // Notify requester
    await createNotification(
      request.requester,
      req.user._id,
      'request_rejected',
      'Request Rejected',
      `Your request for "${request.donation.title}" was rejected. Reason: ${request.rejectionReason}`,
      request.donation._id,
      request._id
    );

    res.status(200).json({ success: true, message: 'Request rejected', request });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a request (by requester)
// @route   PUT /api/requests/:id/cancel
// @access  Private (ngo)
const cancelRequest = async (req, res, next) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.requester.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
    }

    if (!['pending', 'approved'].includes(request.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel request in current status' });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({ success: true, message: 'Request cancelled', request });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark request as collected
// @route   PUT /api/requests/:id/mark-collected
// @access  Private (volunteer, donor, admin)
const markCollected = async (req, res, next) => {
  try {
    const request = await FoodRequest.findById(req.params.id).populate('donation');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Request must be approved before marking collected' });
    }

    request.status = 'collected';
    request.collectedAt = new Date();
    await request.save();

    await FoodDonation.findByIdAndUpdate(request.donation._id, { status: 'collected' });

    res.status(200).json({ success: true, message: 'Marked as collected', request });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark request as delivered
// @route   PUT /api/requests/:id/mark-delivered
// @access  Private (volunteer, admin)
const markDelivered = async (req, res, next) => {
  try {
    const request = await FoodRequest.findById(req.params.id).populate('donation');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'collected') {
      return res.status(400).json({ success: false, message: 'Request must be collected before marking delivered' });
    }

    request.status = 'delivered';
    request.deliveredAt = new Date();
    await request.save();

    await FoodDonation.findByIdAndUpdate(request.donation._id, { status: 'delivered' });

    res.status(200).json({ success: true, message: 'Marked as delivered', request });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark request as complete
// @route   PUT /api/requests/:id/complete
// @access  Private (admin, donor)
const completeRequest = async (req, res, next) => {
  try {
    const request = await FoodRequest.findById(req.params.id).populate('donation');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (!['delivered', 'collected'].includes(request.status)) {
      return res.status(400).json({ success: false, message: 'Request must be collected or delivered first' });
    }

    request.status = 'completed';
    request.completedAt = new Date();
    await request.save();

    await FoodDonation.findByIdAndUpdate(request.donation._id, { status: 'completed' });

    // Notify requester
    await createNotification(
      request.requester,
      req.user._id,
      'request_completed',
      'Donation Completed!',
      `Your food request has been marked as completed. Thank you!`,
      request.donation._id,
      request._id
    );

    res.status(200).json({ success: true, message: 'Request completed', request });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
