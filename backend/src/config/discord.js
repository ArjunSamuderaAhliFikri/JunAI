const { Client, GatewayIntentBits } = require("discord.js");

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

module.exports = { discordClient };
