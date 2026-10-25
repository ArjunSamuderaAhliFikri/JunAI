const { Client, GatewayIntentBits } = require("discord.js");

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,         // Cache guild & channel info otomatis saat bot ready
    GatewayIntentBits.GuildVoiceStates, // Diperlukan untuk join/listen voice channel
  ],
});

module.exports = { discordClient };
