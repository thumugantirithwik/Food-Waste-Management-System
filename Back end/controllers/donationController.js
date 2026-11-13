const FoodDonation = require('../models/FoodDonation');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (donor, admin)
const createDonation = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      quantity,
      quantityUnit,
      vegetarian,
      allergens,
      storageRequirements,
      preparedAt,
      expiresAt,
      pickupAddress,
      pickupCity,
      pickupState,
      pickupPincode,
      pickupAvailability,
    } = req.body;

    const donation = await FoodDonation.create({
      donor: req.user._id,
      donorName: req.user.name,
      donorPhone: req.user.phone,
      title,
      category,
      description,
      quantity,
      quantityUnit,
      quantityAvailable: quantity,
      vegetarian,
      allergens,
      storageRequirements,
      preparedAt,
      expiresAt,
      pickupAddress,
      pickupCity,
      pickupState,
      pickupPincode,
      pickupAvailability,
      status: 'available',
    });

    res.status(201).json({ success: true, message: 'Donation created successfully', donation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations with filtering/search/pagination
// @route   GET /api/donations
// @access  Public
const getDonations = async (req, res, next) => {
  try {
    const {
      search,
      category,
      vegetarian,
      city,
      status,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { donorName: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (vegetarian !== undefined) filter.vegetarian = vegetarian === 'true';
    if (city) filter.pickupCity = { $regex: city, $options: 'i' };
    if (status) filter.status = status;

    // Default: only show available/requested donations to public
    if (!status && (!req.user || req.user.role !== 'admin')) {
      filter.status = { $in: ['available', 'requested'] };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'expires_soon') sortOption = { expiresAt: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FoodDonation.countDocuments(filter);

    const donations = await FoodDonation.find(filter)
      .populate('donor', 'name email phone city')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current donor's donations
// @route   GET /api/donations/my
// @access  Private (donor, admin)
const getMyDonations = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { donor: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FoodDonation.countDocuments(filter);

    const donations = await FoodDonation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), donations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public
const getDonationById = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('donor', 'name email phone city state profileImage');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.status(200).json({ success: true, donation });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a donation
// @route   PUT /api/donations/:id
// @access  Private (owner, admin)
const updateDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Only donor who owns it or admin
    if (
      req.user.role !== 'admin' &&
      donation.donor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this donation' });
    }

    const allowedUpdates = [
      'title', 'category', 'description', 'quantity', 'quantityUnit',
      'quantityAvailable', 'vegetarian', 'allergens', 'storageRequirements',
      'preparedAt', 'expiresAt', 'pickupAddress', 'pickupCity', 'pickupState',
      'pickupPincode', 'pickupAvailability', 'status',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) donation[field] = req.body[field];
    });

    await donation.save();

    res.status(200).json({ success: true, message: 'Donation updated successfully', donation });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private (owner, admin)
const deleteDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (
      req.user.role !== 'admin' &&
      donation.donor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this donation' });
    }

    await donation.deleteOne();

    res.status(200).json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark donation as expired
// @route   PUT /api/donations/:id/expire
// @access  Private (admin)
const expireDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findByIdAndUpdate(
      req.params.id,
      { status: 'expired' },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.status(200).json({ success: true, message: 'Donation marked as expired', donation });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload image for donation
// @route   POST /api/donations/:id/image
// @access  Private (owner, admin)
const uploadDonationImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (
      req.user.role !== 'admin' &&
      donation.donor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    donation.images.push(imagePath);
    await donation.save();

    res.status(200).json({ success: true, message: 'Image uploaded successfully', imagePath, donation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  getDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  expireDonation,
  uploadDonationImage,
};
