/** @format */

const notificationService = require("../../services/notification/notification.service");
const { sendSuccess, sendPaginated } = require("../../utils/response.util");
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");
const { ValidationError } = require("../../utils/errors.util");

/**
 * @desc    Get all notifications for a user
 * @route   GET /api/v1/notifications
 * @query   page, limit, userId, isRead
 */
const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.query.userId ? parseInt(req.query.userId) : null;
  const isRead = req.query.isRead !== undefined ? req.query.isRead === "true" : null;

  const { notifications, total } = await notificationService.findAllNotifications({
    page,
    limit,
    userId,
    isRead,
  });

  return sendPaginated(res, {
    data: notifications,
    total,
    page,
    limit,
    message: "Daftar notifikasi berhasil diambil",
  });
});

/**
 * @desc    Get notification by ID
 * @route   GET /api/v1/notifications/:id
 */
const getNotificationById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const notification = await notificationService.findNotificationById(id);

  return sendSuccess(res, {
    data: notification,
    message: "Detail notifikasi berhasil diambil",
  });
});

const { dispatchNotification } = require("../../services/notification/notificationDispatcher.service");

/**
 * @desc    Create new notification and dispatch real-time & Discord
 * @route   POST /api/v1/notifications
 */
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, user_id, sendDiscord } = req.body;

  if (!title || !message || !user_id) {
    throw new ValidationError("title, message, dan user_id wajib diisi");
  }

  const notification = await dispatchNotification({
    title,
    message,
    type: type || "MEETING_REMINDER",
    userId: parseInt(user_id),
    sendDiscord: sendDiscord !== undefined ? sendDiscord : true,
  });

  return sendSuccess(res, {
    data: notification,
    message: "Notifikasi berhasil dibuat dan dikirimkan secara real-time",
    statusCode: 201,
  });
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const notification = await notificationService.markAsRead(id);

  return sendSuccess(res, {
    data: notification,
    message: "Notifikasi ditandai sudah dibaca",
  });
});

/**
 * @desc    Mark all notifications as read for a user
 * @route   PATCH /api/v1/notifications/read-all
 * @body    { userId: number }
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = parseInt(req.body.userId);

  if (!userId) {
    throw new ValidationError("userId wajib diisi");
  }

  const result = await notificationService.markAllAsRead(userId);

  return sendSuccess(res, {
    data: { updatedCount: result.count },
    message: "Semua notifikasi ditandai sudah dibaca",
  });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/v1/notifications/unread-count/:userId
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);
  const count = await notificationService.getUnreadCount(userId);

  return sendSuccess(res, {
    data: { unreadCount: count },
    message: "Jumlah notifikasi belum dibaca",
  });
});

/**
 * @desc    Soft delete notification
 * @route   DELETE /api/v1/notifications/:id
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await notificationService.softDeleteNotification(id);

  return sendSuccess(res, {
    message: "Notifikasi berhasil dihapus",
  });
});

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
};
