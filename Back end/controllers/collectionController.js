const Collection = require('../models/Collection');
const FoodRequest = require('../models/FoodRequest');
const FoodDonation = require('../models/FoodDonation');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Assign a volunteer to a request
// @route   POST /api/collections/assign
// @access  Admin
const assignVolunteer = async (req, res, next) => {
  try {
    const { requestId, volunteerId, pickupAddress, deliveryAddress, notes } = req.body;

    if (!requestId || !volunteerId) {
      return res.status(400).json({ success: false, message: 'Request ID and volunteer ID are required' });
    }

    const request = await FoodRequest.findById(requestId).populate('donation');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Request must be approved before assigning volunteer' });
    }

    // Update request with volunteer
    request.volunteer = volunteerId;
    await request.save();

    const collection = await Collection.create({
      request: requestId,
      volunteer: volunteerId,
      donation: request.donation._id,
      pickupAddress: pickupAddress || request.donation.pickupAddress,
      deliveryAddress,
      notes,
      assignedAt: new Date(),
    });

    // Update donation status
    await FoodDonation.findByIdAndUpdate(request.donation._id, { status: 'assigned' });

    // Notify volunteer
    await createNotification(
      volunteerId,
      req.user._id,
      'volunteer_assigned',
      'New Collection Task',
      `You have been assigned to collect food for a request. Please check the collection details.`,
      request.donation._id,
      requestId
    );

    const populated = await Collection.findById(collection._id)
      .populate('volunteer', 'name email phone')
      .populate('request', 'status quantityRequested')
      .populate('donation', 'title pickupAddress');

    res.status(201).json({ success: true, message: 'Volunteer assigned successfully', collection: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get volunteer's assigned collections
// @route   GET /api/collections/my
// @access  Private (volunteer)
const getMyCollections = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { volunteer: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Collection.countDocuments(filter);

    const collections = await Collection.find(filter)
      .populate('donation', 'title category pickupAddress pickupCity expiresAt')
      .populate('request', 'status quantityRequested requesterName requesterPhone collectionPreference')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), collections });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark collection as picked up
// @route   PUT /api/collections/:id/pickup
// @access  Private (volunteer)
const markPickedUp = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    if (collection.volunteer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (collection.status !== 'assigned') {
      return res.status(400).json({ success: false, message: 'Collection is not in assigned status' });
    }

    collection.status = 'picked-up';
    collection.pickedUpAt = new Date();
    await collection.save();

    // Update request and donation
    await FoodRequest.findByIdAndUpdate(collection.request, { status: 'collected', collectedAt: new Date() });
    await FoodDonation.findByIdAndUpdate(collection.donation, { status: 'collected' });

    res.status(200).json({ success: true, message: 'Marked as picked up', collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark collection as delivered
// @route   PUT /api/collections/:id/deliver
// @access  Private (volunteer)
const markDelivered = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    if (collection.volunteer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (collection.status !== 'picked-up') {
      return res.status(400).json({ success: false, message: 'Must be picked up before delivering' });
    }

    collection.status = 'delivered';
    collection.deliveredAt = new Date();
    await collection.save();

    await FoodRequest.findByIdAndUpdate(collection.request, { status: 'delivered', deliveredAt: new Date() });
    await FoodDonation.findByIdAndUpdate(collection.donation, { status: 'delivered' });

    res.status(200).json({ success: true, message: 'Marked as delivered', collection });
  } catch (error) {
    next(error);
  }
};

module.exports = { assignVolunteer, getMyCollections, markPickedUp, markDelivered };
