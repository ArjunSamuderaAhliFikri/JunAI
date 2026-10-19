/** @format */

const userService = require("../../services/user/user.service");
const { sendSuccess, sendPaginated } = require("../../utils/response.util");
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");

/**
 * @desc    Get all users with pagination and search
 * @route   GET /api/v1/users
 * @query   page, limit, search
 */
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const { users, total } = await userService.findAllUsers({ page, limit, search });

  return sendPaginated(res, {
    data: users,
    total,
    page,
    limit,
    message: "Daftar user berhasil diambil",
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 */
const getUserById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await userService.findUserById(id);

  return sendSuccess(res, {
    data: user,
    message: "Detail user berhasil diambil",
  });
});

/**
 * @desc    Create new user
 * @route   POST /api/v1/users
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  return sendSuccess(res, {
    data: user,
    message: "User berhasil dibuat",
    statusCode: 201,
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await userService.updateUser(id, req.body);

  return sendSuccess(res, {
    data: user,
    message: "User berhasil diperbarui",
  });
});

/**
 * @desc    Soft delete user
 * @route   DELETE /api/v1/users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await userService.softDeleteUser(id);

  return sendSuccess(res, {
    message: "User berhasil dihapus",
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
