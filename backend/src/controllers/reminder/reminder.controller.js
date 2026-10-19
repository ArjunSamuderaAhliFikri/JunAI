/** @format */

const reminderService = require("../../services/reminder/reminder.service");
const { sendSuccess, sendPaginated } = require("../../utils/response.util");
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");

/**
 * @desc    Get all reminders
 * @route   GET /api/v1/reminders
 * @query   page, limit, userId, type
 */
const getReminders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.query.userId ? parseInt(req.query.userId) : null;
  const type = req.query.type || null;

  const { reminders, total } = await reminderService.findAllReminders({
    page,
    limit,
    userId,
    type,
  });

  return sendPaginated(res, {
    data: reminders,
    total,
    page,
    limit,
    message: "Daftar reminder berhasil diambil",
  });
});

/**
 * @desc    Get reminder by ID
 * @route   GET /api/v1/reminders/:id
 */
const getReminderById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const reminder = await reminderService.findReminderById(id);

  return sendSuccess(res, {
    data: reminder,
    message: "Detail reminder berhasil diambil",
  });
});

/**
 * @desc    Create new reminder
 * @route   POST /api/v1/reminders
 */
const createReminder = asyncHandler(async (req, res) => {
  const reminder = await reminderService.createReminder(req.body);

  return sendSuccess(res, {
    data: reminder,
    message: "Reminder berhasil dibuat",
    statusCode: 201,
  });
});

/**
 * @desc    Update reminder
 * @route   PUT /api/v1/reminders/:id
 */
const updateReminder = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const reminder = await reminderService.updateReminder(id, req.body);

  return sendSuccess(res, {
    data: reminder,
    message: "Reminder berhasil diperbarui",
  });
});

/**
 * @desc    Soft delete reminder
 * @route   DELETE /api/v1/reminders/:id
 */
const deleteReminder = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await reminderService.softDeleteReminder(id);

  return sendSuccess(res, {
    message: "Reminder berhasil dihapus",
  });
});

module.exports = {
  getReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
};
