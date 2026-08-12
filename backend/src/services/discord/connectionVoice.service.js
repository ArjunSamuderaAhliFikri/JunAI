const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { handleUserSpeaking } = require("./recorder.service");

const connectionVoiceService = async (VOICE_CHANNEL_ID, GUILD_ID, guild) => {
  const existingConnection = getVoiceConnection(GUILD_ID);
  if (existingConnection) {
    console.log("Destroying existing voice connection...");
    existingConnection.destroy();
  }

  const connection = joinVoiceChannel({
    channelId: VOICE_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

  const receiver = connection.receiver;

  receiver.speaking.on("start", (userId) => {
    handleUserSpeaking(receiver, userId);
  });

  receiver.speaking.on("end", (userId) => {
    console.log(`User ${userId} is not speaking`);
  });
};

module.exports = { connectionVoiceService };
