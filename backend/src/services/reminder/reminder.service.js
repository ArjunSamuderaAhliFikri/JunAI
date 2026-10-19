/** @format */

const { prisma } = require("../../config/database");
const { NotFoundError } = require("../../utils/errors.util");

/**
 * Reminder Service
 * Handles all business logic related to Reminder entity.
 */

const findAllReminders = async ({ page = 1, limit = 10, userId = null, type = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    is_deleted: false,
    ...(userId && { user_id: userId }),
    ...(type && { type }),
  };

  const [reminders, total] = await Promise.all([
    prisma.reminder.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { timeline_activity: "asc" },
    }),
    prisma.reminder.count({ where }),
  ]);

  return { reminders, total };
};

const findReminderById = async (id) => {
  const reminder = await prisma.reminder.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });

  if (!reminder || reminder.is_deleted) {
    throw new NotFoundError("Reminder");
  }

  return reminder;
};

const createReminder = async (data) => {
  return prisma.reminder.create({
    data,
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });
};

const updateReminder = async (id, data) => {
  await findReminderById(id);

  return prisma.reminder.update({
    where: { id },
    data,
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });
};

const softDeleteReminder = async (id) => {
  await findReminderById(id);

  return prisma.reminder.update({
    where: { id },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
};

/**
 * Find upcoming reminders within a time window.
 * Used by the scheduler to dispatch notifications.
 */
const findUpcomingReminders = async (fromDate, toDate) => {
  return prisma.reminder.findMany({
    where: {
      is_deleted: false,
      timeline_activity: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });
};

module.exports = {
  findAllReminders,
  findReminderById,
  createReminder,
  updateReminder,
  softDeleteReminder,
  findUpcomingReminders,
};
