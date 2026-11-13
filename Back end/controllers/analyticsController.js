const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const FoodRequest = require('../models/FoodRequest');

// @desc    Admin overview statistics
// @route   GET /api/analytics/overview
// @access  Admin
const getOverview = async (req, res, next) => {
  try {
    const [totalUsers, donations, requests] = await Promise.all([
      User.countDocuments(),
      FoodDonation.find().select('status quantity quantityUnit'),
      FoodRequest.find().select('status'),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const donationsByStatus = donations.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {});

    const requestsByStatus = requests.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    const totalDonations = donations.length;
    const activeDonations = donations.filter((d) => ['available', 'requested', 'approved'].includes(d.status)).length;
    const completedDonations = donations.filter((d) => d.status === 'completed').length;
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'pending').length;
    const completedRequests = requests.filter((r) => r.status === 'completed').length;

    res.status(200).json({
      success: true,
      overview: {
        totalUsers,
        usersByRole: usersByRole.reduce((acc, u) => { acc[u._id] = u.count; return acc; }, {}),
        totalDonations,
        activeDonations,
        completedDonations,
        donationsByStatus,
        totalRequests,
        pendingRequests,
        completedRequests,
        requestsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Donation trends (last 30 days)
// @route   GET /api/analytics/trends
// @access  Admin
const getTrends = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const donationTrends = await FoodDonation.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day',
                },
              },
            },
          },
          count: 1,
        },
      },
    ]);

    const requestTrends = await FoodRequest.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day',
                },
              },
            },
          },
          count: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, donationTrends, requestTrends });
  } catch (error) {
    next(error);
  }
};

// @desc    Food category distribution
// @route   GET /api/analytics/categories
// @access  Admin
const getCategoryStats = async (req, res, next) => {
  try {
    const categories = await FoodDonation.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor's own stats
// @route   GET /api/analytics/donor-stats
// @access  Private (donor)
const getDonorStats = async (req, res, next) => {
  try {
    const donations = await FoodDonation.find({ donor: req.user._id });
    const donationIds = donations.map((d) => d._id);
    const requests = await FoodRequest.find({ donation: { $in: donationIds } });

    const totalDonations = donations.length;
    const activeDonations = donations.filter((d) => ['available', 'requested', 'approved'].includes(d.status)).length;
    const completedDonations = donations.filter((d) => d.status === 'completed').length;
    const totalViews = donations.reduce((sum, d) => sum + (d.views || 0), 0);
    const totalRequests = requests.length;
    const approvedRequests = requests.filter((r) => r.status === 'approved').length;

    res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        activeDonations,
        completedDonations,
        totalViews,
        totalRequests,
        approvedRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO's own stats
// @route   GET /api/analytics/ngo-stats
// @access  Private (ngo)
const getNgoStats = async (req, res, next) => {
  try {
    const requests = await FoodRequest.find({ requester: req.user._id });

    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'pending').length;
    const approvedRequests = requests.filter((r) => r.status === 'approved').length;
    const completedRequests = requests.filter((r) => r.status === 'completed').length;
    const rejectedRequests = requests.filter((r) => r.status === 'rejected').length;

    res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        completedRequests,
        rejectedRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getTrends, getCategoryStats, getDonorStats, getNgoStats };
