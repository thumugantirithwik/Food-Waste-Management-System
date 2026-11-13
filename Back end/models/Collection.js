const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodRequest',
      required: [true, 'Request reference is required'],
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Volunteer is required'],
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodDonation',
      required: [true, 'Donation reference is required'],
    },
    pickupAddress: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['assigned', 'picked-up', 'delivered'],
      default: 'assigned',
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    pickedUpAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', collectionSchema);
