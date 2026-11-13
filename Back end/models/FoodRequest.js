const mongoose = require('mongoose');

const foodRequestSchema = new mongoose.Schema(
  {
    // Compatible with both foodId and donation
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodDonation',
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodDonation',
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    requesterName: {
      type: String,
      required: [true, 'Requester name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    requesterPhone: {
      type: String,
      trim: true,
    },
    requesterOrg: {
      type: String,
      trim: true,
      default: '',
    },
    quantityRequested: {
      type: mongoose.Schema.Types.Mixed, // allows String "5 plates" or Number 5
      required: [true, 'Quantity requested is required'],
    },
    quantityUnit: {
      type: String,
      default: 'portions',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    collectionPreference: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    approvedAt: {
      type: Date,
    },
    collectedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Synchronize interchangeable fields before saving
foodRequestSchema.pre('save', function (next) {
  if (!this.donation && this.foodId) {
    this.donation = this.foodId;
  }
  if (!this.foodId && this.donation) {
    this.foodId = this.donation;
  }
  if (!this.requesterPhone && this.phone) {
    this.requesterPhone = this.phone;
  }
  if (!this.phone && this.requesterPhone) {
    this.phone = this.requesterPhone;
  }
  next();
});

module.exports = mongoose.model('FoodRequest', foodRequestSchema);
