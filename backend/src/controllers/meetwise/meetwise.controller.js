/** @format */

const meetwiseService = require("../../services/meetwise/meetwise.service");
const { sendSuccess, sendPaginated } = require("../../utils/response.util");
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");

/**
 * @desc    Get all MeetWise documents
 * @route   GET /api/v1/documents
 * @query   page, limit, search
 */
const getDocuments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const { documents, total } = await meetwiseService.findAllDocuments({ page, limit, search });

  return sendPaginated(res, {
    data: documents,
    total,
    page,
    limit,
    message: "Daftar dokumen berhasil diambil",
  });
});

/**
 * @desc    Get document by ID
 * @route   GET /api/v1/documents/:id
 */
const getDocumentById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const document = await meetwiseService.findDocumentById(id);

  return sendSuccess(res, {
    data: document,
    message: "Detail dokumen berhasil diambil",
  });
});

/**
 * @desc    Create new document
 * @route   POST /api/v1/documents
 */
const createDocument = asyncHandler(async (req, res) => {
  const document = await meetwiseService.createDocument(req.body);

  return sendSuccess(res, {
    data: document,
    message: "Dokumen berhasil dibuat",
    statusCode: 201,
  });
});

/**
 * @desc    Update document
 * @route   PUT /api/v1/documents/:id
 */
const updateDocument = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const document = await meetwiseService.updateDocument(id, req.body);

  return sendSuccess(res, {
    data: document,
    message: "Dokumen berhasil diperbarui",
  });
});

/**
 * @desc    Soft delete document
 * @route   DELETE /api/v1/documents/:id
 */
const deleteDocument = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await meetwiseService.softDeleteDocument(id);

  return sendSuccess(res, {
    message: "Dokumen berhasil dihapus",
  });
});

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
