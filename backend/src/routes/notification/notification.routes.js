/** @format */

const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/notification/notification.controller");

router.get("/", notificationController.getNotifications);
router.get("/unread-count/:userId", notificationController.getUnreadCount);
router.get("/:id", notificationController.getNotificationById);
router.post("/", notificationController.createNotification);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
