/** @format */

const { prisma } = require("../../config/database");
const { NotFoundError } = require("../../utils/errors.util");

/**
 * Role Service
 * Handles all business logic related to Role entity.
 */

const findAllRoles = async () => {
  return prisma.role.findMany({
    orderBy: { created_at: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });
};

const findRoleById = async (id) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true } },
    },
  });

  if (!role) {
    throw new NotFoundError("Role");
  }

  return role;
};

const createRole = async (data) => {
  return prisma.role.create({ data });
};

const updateRole = async (id, data) => {
  await findRoleById(id);

  return prisma.role.update({
    where: { id },
    data,
  });
};

const deleteRole = async (id) => {
  await findRoleById(id);

  return prisma.role.delete({ where: { id } });
};

module.exports = {
  findAllRoles,
  findRoleById,
  createRole,
  updateRole,
  deleteRole,
};
