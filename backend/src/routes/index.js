/** @format */

const express = require("express");
const router = express.Router();

const userRoutes = require("./user/user.routes");
const roleRoutes = require("./role/role.routes");
const meetwiseRoutes = require("./meetwise/meetwise.routes");
const reminderRoutes = require("./reminder/reminder.routes");
const notificationRoutes = require("./notification/notification.routes");
const chatRoutes = require("./chat/chat.routes");

// Register resource routes
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/documents", meetwiseRoutes);
router.use("/reminders", reminderRoutes);
router.use("/notifications", notificationRoutes);
router.use("/chats", chatRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
