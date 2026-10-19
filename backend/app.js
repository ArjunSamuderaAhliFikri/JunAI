/** @format */

const http = require("http");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

// Socket.IO configuration
const { initSocket } = require("./src/config/socket");

// Database & Scheduler
const { startReminderScheduler, stopReminderScheduler } = require("./src/services/notification/reminderScheduler.service");

// Middleware
const { errorHandler } = require("./src/middleware/errorHandler.middleware");

// Routes
const apiRoutes = require("./src/routes");

// Discord & Legacy configs
const { upload } = require("./src/config/multer");
const { discordClient } = require("./src/config/discord");
const { discordStatusController } = require("./src/controllers/discord/discord.controller");
const { summarizeMeetingController } = require("./src/controllers/gemini/summarizeMeeting.controller");
const { joinVoiceController } = require("./src/controllers/discord/joinVoice.controller");
const {
  startRecordingController,
  stopRecordingController,
} = require("./src/controllers/discord/recorder.controller");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const port = process.env.PORT || 4000;

// Body Parsers & Static Files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Discord Login
if (process.env.DISCORD_TOKEN) {
  discordClient.login(process.env.DISCORD_TOKEN).catch((err) => {
    console.warn("⚠️ [Discord] Login warning:", err.message);
  });

  discordClient.once("ready", () => {
    console.log("🤖 Discord bot is ready!");
    console.log("Guild count :", discordClient.guilds.cache.size);
    discordClient.guilds.cache.forEach((guild) => {
      console.log(`Guild: ${guild.name} (ID: ${guild.id})`);
    });
  });
}

// Root & Health
app.get("/", (req, res) => {
  res.send("Hello JunAI! Backend API is up and running.");
});

// Structured REST API v1
app.use("/api/v1", apiRoutes);

// Discord & Meeting recording endpoints
app.get("/discord/status", discordStatusController);
app.post("/discord/join-voice", joinVoiceController);
app.post("/discord/start-recording", startRecordingController);
app.post("/discord/stop-recording", stopRecordingController);
app.post("/summarize-meeting", upload.single("audio"), summarizeMeetingController);

// Global Error Handler (MUST be placed after all routes)
app.use(errorHandler);

// Start server
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  // Start reminder background scheduler
  startReminderScheduler();
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down gracefully...");
  stopReminderScheduler();
  if (discordClient) {
    discordClient.destroy();
    console.log("Discord client destroyed.");
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
