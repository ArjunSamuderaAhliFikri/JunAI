const { discordClient } = require("../../config/discord");
const {
  connectionVoiceService,
} = require("../../services/discord/connectionVoice.service");

const joinVoiceController = async (req, res) => {
  try {
    // Cek apakah bot sudah login/ready
    if (!discordClient.isReady()) {
      return res.status(503).json({
        message:
          "Discord bot belum siap. Tunggu beberapa detik lalu coba lagi.",
      });
    }

    // Prioritaskan nilai dari request body, lalu fallback ke .env
    const guildId = req.body?.guildId || process.env.GUILD_ID;
    const channelId = req.body?.channelId || process.env.VOICE_CHANNEL_ID;

    if (!guildId || !channelId) {
      return res.status(400).json({
        message: "guildId dan channelId wajib ada (via request body atau .env)",
      });
    }

    // Guilds intent sudah otomatis cache semua guild saat bot ready.
    // Gunakan cache dulu (lebih cepat, tidak butuh REST call).
    let guild = discordClient.guilds.cache.get(guildId);

    // Fallback: fetch jika belum ada di cache
    if (!guild) {
      await discordClient.guilds.fetch(guildId);
      guild = discordClient.guilds.cache.get(guildId);
    }

    if (!guild) {
      return res.status(404).json({
        message: `Guild dengan ID "${guildId}" tidak ditemukan. Pastikan bot sudah diundang ke server tersebut.`,
      });
    }

    await connectionVoiceService(channelId, guildId, guild);

    return res.status(200).json({
      debug: {
        guildName: guild.name,
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
