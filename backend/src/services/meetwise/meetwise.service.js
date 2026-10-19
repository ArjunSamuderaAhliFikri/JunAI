/** @format */

const { prisma } = require("../../config/database");
const { NotFoundError } = require("../../utils/errors.util");

/**
 * MeetWise Service
 * Handles all business logic related to MeetWise documents.
 */

const findAllDocuments = async ({ page = 1, limit = 10, search = "" }) => {
  const skip = (page - 1) * limit;

  const where = {
    is_deleted: false,
    ...(search && {
      name_document: { contains: search, mode: "insensitive" },
    }),
  };

  const [documents, total] = await Promise.all([
    prisma.meetWise.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: {
          select: { id: true, username: true, email: true, profile_picture: true },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.meetWise.count({ where }),
  ]);

  return { documents, total };
};

const findDocumentById = async (id) => {
  const document = await prisma.meetWise.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true, email: true, profile_picture: true },
      },
      document_histories: {
        where: { is_deleted: false },
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!document || document.is_deleted) {
    throw new NotFoundError("Document");
  }

  return document;
};

const createDocument = async (data) => {
  return prisma.meetWise.create({
    data,
    include: {
      author: {
        select: { id: true, username: true, email: true },
      },
    },
  });
};

const updateDocument = async (id, data) => {
  await findDocumentById(id);

  return prisma.meetWise.update({
    where: { id },
    data,
  });
};

const softDeleteDocument = async (id) => {
  await findDocumentById(id);

  return prisma.meetWise.update({
    where: { id },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
};

module.exports = {
  findAllDocuments,
  findDocumentById,
  createDocument,
  updateDocument,
  softDeleteDocument,
};
