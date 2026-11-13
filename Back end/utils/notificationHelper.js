const Notification = require('../models/Notification');

/**
 * Create a notification for a user
 * @param {string} recipientId - User to notify
 * @param {string} senderId - User who triggered the notification
 * @param {string} type - Notification type string
 * @param {string} title - Short title
 * @param {string} message - Full message
 * @param {string} [donationId] - Related donation (optional)
 * @param {string} [requestId] - Related request (optional)
 */
const createNotification = async (
  recipientId,
  senderId,
  type,
  title,
  message,
  donationId = null,
  requestId = null
) => {
  try {
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      relatedDonation: donationId || undefined,
      relatedRequest: requestId || undefined,
    });
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

module.exports = { createNotification };
