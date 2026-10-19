/** @format */

const { prisma } = require("../../config/database");
const { NotFoundError, ConflictError } = require("../../utils/errors.util");

/**
 * User Service
 * Handles all business logic related to User entity.
 */

const findAllUsers = async ({ page = 1, limit = 10, search = "" }) => {
  const skip = (page - 1) * limit;

  const where = {
    deleted_at: null,
    ...(search && {
      OR: [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: { role: true },
      orderBy: { created_at: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user || user.deleted_at) {
    throw new NotFoundError("User");
  }

  return user;
};

const createUser = async (data) => {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existing) {
    throw new ConflictError("User dengan email atau username tersebut sudah ada");
  }

  return prisma.user.create({
    data,
    include: { role: true },
  });
};

const updateUser = async (id, data) => {
  await findUserById(id);

  return prisma.user.update({
    where: { id },
    data,
    include: { role: true },
  });
};

const softDeleteUser = async (id) => {
  await findUserById(id);

  return prisma.user.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

module.exports = {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  softDeleteUser,
};
