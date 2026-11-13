const express = require('express');
const FoodDonation = require('../models/FoodDonation');

const router = express.Router();

// Add a food donation (supports simple frontend submission)
router.post('/donate', async (req, res) => {
  try {
    const {
      foodName,
      title,
      quantity,
      description,
      location,
      pickupAddress,
      donorName,
      phone,
      donorPhone,
      category,
      vegetarian,
      allergens,
    } = req.body;

    const donation = new FoodDonation({
      foodName: foodName || title,
      title: title || foodName,
      quantity,
      description: description || '',
      location: location || pickupAddress,
      pickupAddress: pickupAddress || location,
      donorName: donorName || 'Anonymous Donor',
      phone: phone || donorPhone,
      donorPhone: donorPhone || phone,
      category: category || 'cooked-food',
      vegetarian: vegetarian !== undefined ? vegetarian : true,
      allergens: allergens || 'None',
      status: 'Available',
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Food donation added successfully',
      donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Food donation failed',
      error: error.message,
    });
  }
});

// Get all available food donations (case-insensitive status check)
router.get('/available', async (req, res) => {
  try {
    const donations = await FoodDonation.find({
      status: { $regex: /^available$/i },
    }).sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get donations',
      error: error.message,
    });
  }
});

// Get all donations
router.get('/all', async (req, res) => {
  try {
    const donations = await FoodDonation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get donations',
      error: error.message,
    });
  }
});

module.exports = router;
