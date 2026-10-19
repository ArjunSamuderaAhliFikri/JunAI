/** @format */

const { prisma } = require("../../config/database");
const { NotFoundError } = require("../../utils/errors.util");

/**
 * Chat Reminder History Service
 * Handles business logic for Chat Sub Reminder Histories and their details.
 */

const findAllChatHistories = async ({ page = 1, limit = 10, userId = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    deleted_at: null,
    ...(userId && { user_id: userId }),
  };

  const [histories, total] = await Promise.all([
    prisma.chatSubReminderHistory.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, username: true },
        },
        details: {
          orderBy: { created_at: "asc" },
          take: 20,
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.chatSubReminderHistory.count({ where }),
  ]);

  return { histories, total };
};

const findChatHistoryById = async (id) => {
  const history = await prisma.chatSubReminderHistory.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true },
      },
      details: {
        orderBy: { created_at: "asc" },
        include: {
          user: {
            select: { id: true, username: true },
          },
        },
      },
    },
  });

  if (!history || history.deleted_at) {
    throw new NotFoundError("Chat History");
  }

  return history;
};

const createChatHistory = async (data) => {
  return prisma.chatSubReminderHistory.create({
    data,
    include: {
      user: {
        select: { id: true, username: true },
      },
    },
  });
};

const addChatDetail = async (data) => {
  // Verify parent chat exists
  await findChatHistoryById(data.parent_chat_id);

  return prisma.chatReminderHistoryDetail.create({
    data: {
      ...data,
      message_length: data.message.length,
    },
  });
};

const softDeleteChatHistory = async (id) => {
  await findChatHistoryById(id);

  return prisma.chatSubReminderHistory.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

module.exports = {
  findAllChatHistories,
  findChatHistoryById,
  createChatHistory,
  addChatDetail,
  softDeleteChatHistory,
};
