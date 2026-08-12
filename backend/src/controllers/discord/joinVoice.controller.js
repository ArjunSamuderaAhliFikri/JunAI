const { discordClient } = require("../../config/discord");
const {
  connectionVoiceService,
} = require("../../services/discord/connectionVoice.service");

const joinVoiceController = async (req, res) => {
  try {
    const guildId = process.env.GUILD_ID;
    const channelId = process.env.VOICE_CHANNEL_ID;

    const guild = await discordClient.guilds.fetch(guildId);

    await connectionVoiceService(channelId, guildId, guild);

    return res.status(200).json({
      debug: {
        guild,
        guildId,
        channelId,
      },
      message: "Joined voice channel successfully",
    });
  } catch (error) {
    console.error("Error joining voice channel:", error);
    return res.status(500).json({
      message: ["Error joining voice channel", error.message],
    });
  }
};

module.exports = { joinVoiceController };
