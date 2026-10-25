const { discordClient } = require("../../config/discord");

const discordStatusController = async (req, res) => {
  // Permission: View Channels (1024) + Connect (1048576) + Speak (2097152)
  const REQUIRED_PERMISSIONS = "3146752";
  const clientId = discordClient.user?.id ?? null;

  const inviteUrl = clientId
    ? `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${REQUIRED_PERMISSIONS}&scope=bot`
    : null;

  return res.json({
    online: discordClient.isReady(),
    user: discordClient.user?.tag ?? null,
    clientId,
    // Daftar server yang sudah bisa diakses bot (GUILD_ID harus dari sini)
    guilds: discordClient.guilds.cache.map((g) => ({
      id: g.id,
      name: g.name,
      memberCount: g.memberCount,
    })),
    // Buka link ini untuk mengundang bot ke server baru
    inviteUrl,
  });
};

module.exports = { discordStatusController };
