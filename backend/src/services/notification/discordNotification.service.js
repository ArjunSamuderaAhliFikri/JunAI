/** @format */

const { discordClient } = require("../../config/discord");

/**
 * Send notification message to Discord channel
 *
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} [params.type]
 * @param {string} [params.channelId]
 */
const sendDiscordNotification = async ({ title, message, type = "NOTIFICATION", channelId = null }) => {
  try {
    if (!discordClient || !discordClient.isReady()) {
      console.warn("⚠️ [Discord] Client not ready, skipping Discord notification");
      return false;
    }

    const targetChannelId =
      channelId ||
      process.env.DISCORD_NOTIFICATION_CHANNEL_ID ||
      process.env.VOICE_CHANNEL_ID;

    if (!targetChannelId) {
      console.warn("⚠️ [Discord] No channel ID specified for notification");
      return false;
    }

    const channel = await discordClient.channels.fetch(targetChannelId).catch(() => null);

    if (!channel || !channel.isTextBased()) {
      // Try to find first text channel in the guild if available
      const guild = discordClient.guilds.cache.first();
      const firstTextChannel = guild?.channels.cache.find((c) => c.isTextBased());
      if (firstTextChannel) {
        await firstTextChannel.send({
          content: `🔔 **[${type}] ${title}**\n${message}`,
        });
        console.log(`✅ [Discord] Notification sent to #${firstTextChannel.name}`);
        return true;
      }
      console.warn("⚠️ [Discord] Could not find a text channel to send notification");
      return false;
    }

    await channel.send({
      content: `🔔 **[${type}] ${title}**\n${message}`,
    });

    console.log(`✅ [Discord] Notification sent to channel ${channel.id}`);
    return true;
  } catch (error) {
    console.error("❌ [Discord] Failed to send notification:", error.message);
    return false;
  }
};

module.exports = { sendDiscordNotification };
