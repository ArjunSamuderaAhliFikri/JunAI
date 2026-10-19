/** @format */

const express = require("express");
const router = express.Router();
const meetwiseController = require("../../controllers/meetwise/meetwise.controller");

router.get("/", meetwiseController.getDocuments);
router.get("/:id", meetwiseController.getDocumentById);
router.post("/", meetwiseController.createDocument);
router.put("/:id", meetwiseController.updateDocument);
router.delete("/:id", meetwiseController.deleteDocument);

module.exports = router;
