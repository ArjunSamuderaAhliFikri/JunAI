/** @format */

const { prisma } = require("../../config/database");
const { NotFoundError } = require("../../utils/errors.util");

/**
 * Notification Service
 * Handles CRUD and business logic for Notification entity.
 */

const findAllNotifications = async ({ page = 1, limit = 10, userId = null, isRead = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    is_deleted: false,
    ...(userId && { user_id: userId }),
    ...(isRead !== null && { is_read: isRead }),
  };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.notification.count({ where }),
  ]);

  return { notifications, total };
};

const findNotificationById = async (id) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });

  if (!notification || notification.is_deleted) {
    throw new NotFoundError("Notification");
  }

  return notification;
};

const createNotification = async (data) => {
  return prisma.notification.create({
    data,
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });
};

const markAsRead = async (id) => {
  await findNotificationById(id);

  return prisma.notification.update({
    where: { id },
    data: { is_read: true },
  });
};

const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: {
      user_id: userId,
      is_read: false,
      is_deleted: false,
    },
    data: { is_read: true },
  });
};

const softDeleteNotification = async (id) => {
  await findNotificationById(id);

  return prisma.notification.update({
    where: { id },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
};

const getUnreadCount = async (userId) => {
  return prisma.notification.count({
    where: {
      user_id: userId,
      is_read: false,
      is_deleted: false,
    },
  });
};

module.exports = {
  findAllNotifications,
  findNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  softDeleteNotification,
  getUnreadCount,
};
