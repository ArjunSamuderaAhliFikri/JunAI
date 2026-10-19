/** @format */

const roleService = require("../../services/role/role.service");
const { sendSuccess } = require("../../utils/response.util");
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");

/**
 * @desc    Get all roles
 * @route   GET /api/v1/roles
 */
const getRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.findAllRoles();

  return sendSuccess(res, {
    data: roles,
    message: "Daftar role berhasil diambil",
  });
});

/**
 * @desc    Get role by ID
 * @route   GET /api/v1/roles/:id
 */
const getRoleById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const role = await roleService.findRoleById(id);

  return sendSuccess(res, {
    data: role,
    message: "Detail role berhasil diambil",
  });
});

/**
 * @desc    Create new role
 * @route   POST /api/v1/roles
 */
const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body);

  return sendSuccess(res, {
    data: role,
    message: "Role berhasil dibuat",
    statusCode: 201,
  });
});

/**
 * @desc    Update role
 * @route   PUT /api/v1/roles/:id
 */
const updateRole = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const role = await roleService.updateRole(id, req.body);

  return sendSuccess(res, {
    data: role,
    message: "Role berhasil diperbarui",
  });
});

/**
 * @desc    Delete role
 * @route   DELETE /api/v1/roles/:id
 */
const deleteRole = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await roleService.deleteRole(id);

  return sendSuccess(res, {
    message: "Role berhasil dihapus",
  });
});

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
