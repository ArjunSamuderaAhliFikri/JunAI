/** @format */

const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chat/chat.controller");

router.get("/", chatController.getChatHistories);
router.get("/:id", chatController.getChatHistoryById);
router.post("/", chatController.createChatHistory);
router.post("/:id/messages", chatController.addChatMessage);
router.delete("/:id", chatController.deleteChatHistory);

module.exports = router;
