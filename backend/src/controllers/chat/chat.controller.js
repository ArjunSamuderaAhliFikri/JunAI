/** @format */

const chatService = require("../../services/chat/chat.service");
const { sendSuccess, sendPaginated } = require("../../utils/response.util");
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");

/**
 * @desc    Get all chat histories
 * @route   GET /api/v1/chats
 * @query   page, limit, userId
 */
const getChatHistories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.query.userId ? parseInt(req.query.userId) : null;

  const { histories, total } = await chatService.findAllChatHistories({
    page,
    limit,
    userId,
  });

  return sendPaginated(res, {
    data: histories,
    total,
    page,
    limit,
    message: "Daftar chat history berhasil diambil",
  });
});

/**
 * @desc    Get chat history by ID with all messages
 * @route   GET /api/v1/chats/:id
 */
const getChatHistoryById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const history = await chatService.findChatHistoryById(id);

  return sendSuccess(res, {
    data: history,
    message: "Detail chat history berhasil diambil",
  });
});

/**
 * @desc    Create new chat session
 * @route   POST /api/v1/chats
 */
const createChatHistory = asyncHandler(async (req, res) => {
  const history = await chatService.createChatHistory(req.body);

  return sendSuccess(res, {
    data: history,
    message: "Chat session berhasil dibuat",
    statusCode: 201,
  });
});

/**
 * @desc    Add message to a chat session
 * @route   POST /api/v1/chats/:id/messages
 */
const addChatMessage = asyncHandler(async (req, res) => {
  const parentChatId = parseInt(req.params.id);

  const detail = await chatService.addChatDetail({
    ...req.body,
    parent_chat_id: parentChatId,
  });

  return sendSuccess(res, {
    data: detail,
    message: "Pesan chat berhasil ditambahkan",
    statusCode: 201,
  });
});

/**
 * @desc    Soft delete chat history
 * @route   DELETE /api/v1/chats/:id
 */
const deleteChatHistory = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await chatService.softDeleteChatHistory(id);

  return sendSuccess(res, {
    message: "Chat history berhasil dihapus",
  });
});

module.exports = {
  getChatHistories,
  getChatHistoryById,
  createChatHistory,
  addChatMessage,
  deleteChatHistory,
};
