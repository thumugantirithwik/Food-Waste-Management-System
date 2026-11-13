const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createDonation,
  getDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  expireDonation,
  uploadDonationImage,
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `donation-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Static routes before dynamic /:id
router.get('/my', protect, authorize('donor', 'admin'), getMyDonations);

// Public routes
router.get('/', getDonations);
router.get('/:id', getDonationById);

// Protected routes
router.post('/', protect, authorize('donor', 'admin'), createDonation);
router.put('/:id', protect, authorize('donor', 'admin'), updateDonation);
router.delete('/:id', protect, authorize('donor', 'admin'), deleteDonation);
router.put('/:id/expire', protect, authorize('admin'), expireDonation);
router.post('/:id/image', protect, authorize('donor', 'admin'), upload.single('image'), uploadDonationImage);

module.exports = router;
