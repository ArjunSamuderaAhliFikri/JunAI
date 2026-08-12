const { discordClient } = require("../../config/discord");

const discordStatusController = async (req, res) => {
  return res.json({
    online: discordClient.isReady(),
    guilds: discordClient.guilds.cache.size,
    user: discordClient.user?.tag ?? null,
  });
};

module.exports = { discordStatusController };
