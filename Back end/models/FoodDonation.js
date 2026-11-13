const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema(
  {
    // Compatible with both original (foodName) and new (title)
    foodName: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    donorName: {
      type: String,
      trim: true,
      default: 'Anonymous Donor',
    },
    phone: {
      type: String,
      trim: true,
    },
    donorPhone: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'cooked-food',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: mongoose.Schema.Types.Mixed, // allows String "10 plates" or Number 10
      required: [true, 'Quantity is required'],
    },
    quantityUnit: {
      type: String,
      default: 'portions',
    },
    quantityAvailable: {
      type: mongoose.Schema.Types.Mixed,
    },
    vegetarian: {
      type: Boolean,
      default: true,
    },
    allergens: {
      type: String,
      trim: true,
      default: 'None',
    },
    storageRequirements: {
      type: String,
      trim: true,
      default: 'Store in cool place',
    },
    preparedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
    },
    // Compatible with both location and pickupAddress
    location: {
      type: String,
      trim: true,
    },
    pickupAddress: {
      type: String,
      trim: true,
    },
    pickupCity: {
      type: String,
      trim: true,
      default: '',
    },
    pickupState: {
      type: String,
      trim: true,
      default: '',
    },
    pickupPincode: {
      type: String,
      trim: true,
      default: '',
    },
    pickupAvailability: {
      type: String,
      trim: true,
      default: 'Available for immediate pickup',
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      default: 'Available',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Synchronize interchangeable fields before saving
foodDonationSchema.pre('save', function (next) {
  if (!this.title && this.foodName) {
    this.title = this.foodName;
  }
  if (!this.foodName && this.title) {
    this.foodName = this.title;
  }
  if (!this.pickupAddress && this.location) {
    this.pickupAddress = this.location;
  }
  if (!this.location && this.pickupAddress) {
    this.location = this.pickupAddress;
  }
  if (!this.donorPhone && this.phone) {
    this.donorPhone = this.phone;
  }
  if (!this.phone && this.donorPhone) {
    this.phone = this.donorPhone;
  }
  if (this.isNew && this.quantityAvailable === undefined) {
    this.quantityAvailable = this.quantity;
  }
  next();
});

// Text index for search
foodDonationSchema.index({ title: 'text', foodName: 'text', description: 'text', donorName: 'text' });

module.exports = mongoose.model('FoodDonation', foodDonationSchema);
