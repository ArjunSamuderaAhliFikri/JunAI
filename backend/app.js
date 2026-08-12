/** @format */

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

// Configs
const { errorHandler } = require("./src/middleware/errorHandler.middleware");
const { upload } = require("./src/config/multer");
const { discordClient } = require("./src/config/discord");

// Controllers
const {
  discordStatusController,
} = require("./src/controllers/discord/discord.controller");
const {
  summarizeMeetingController,
} = require("./src/controllers/gemini/summarizeMeeting.controller");
const {
  joinVoiceController,
} = require("./src/controllers/discord/joinVoice.controller");

const {
  startRecordingController,
  stopRecordingController,
} = require("./src/controllers/discord/recorder.controller");

const port = process.env.PORT || 4000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandler);
app.use(express.static(path.join(__dirname, "public")));

// Discord login
discordClient.login(process.env.DISCORD_TOKEN);

discordClient.once("ready", () => {
  console.log("Discord bot is ready!");

  console.log("Guild count : ", discordClient.guilds.cache.size);

  discordClient.guilds.cache.forEach((guild) => {
    console.log("Guild name : ", guild.name);
    console.log("Guild ID : ", guild.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello JunAI!");
});

app.get("/discord/status", discordStatusController);
app.post("/discord/join-voice", joinVoiceController);
app.post("/discord/start-recording", startRecordingController);
app.post("/discord/stop-recording", stopRecordingController);

app.post(
  "/summarize-meeting",
  upload.single("audio"),
  summarizeMeetingController,
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down gracefully...");
  if (discordClient) {
    discordClient.destroy();
    console.log("Discord client destroyed.");
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
