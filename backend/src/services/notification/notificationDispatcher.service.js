/** @format */

const { getIO } = require("../../config/socket");
const notificationService = require("./notification.service");
const { sendDiscordNotification } = require("./discordNotification.service");

/**
 * Dispatcher that coordinates saving notification to DB,
 * emitting real-time via Socket.IO, and sending to Discord.
 *
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.message
 * @param {'MEETING_REMINDER'|'MEETING_STARTED'|'MEETING_ENDED'} params.type
 * @param {number} params.userId
 * @param {boolean} [params.sendDiscord=true]
 */
const dispatchNotification = async ({
  title,
  message,
  type = "MEETING_REMINDER",
  userId,
  sendDiscord = true,
}) => {
  // 1. Save to Database via Prisma
  const notification = await notificationService.createNotification({
    title,
    message,
    type,
    user_id: userId,
  });

  // 2. Real-time push via Socket.IO
  const io = getIO();
  if (io) {
    const userRoom = `user_${userId}`;
    io.to(userRoom).emit("notification:new", notification);
    // Also emit broadcast event for global listeners (e.g. admin dashboard)
    io.emit("notification:broadcast", {
      id: notification.id,
      title: notification.title,
      type: notification.type,
      userId: notification.user_id,
      created_at: notification.created_at,
    });
    console.log(`📡 [Socket.IO] Dispatched notification to ${userRoom}`);
  }

  // 3. Push to Discord Channel
  if (sendDiscord) {
    sendDiscordNotification({
      title,
      message,
      type,
    }).catch((err) => {
      console.error("❌ Failed to send Discord notification:", err.message);
    });
  }

  return notification;
};

module.exports = { dispatchNotification };
