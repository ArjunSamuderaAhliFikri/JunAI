const prism = require("prism-media");
const fs = require("fs");
const { EndBehaviorType } = require("@discordjs/voice");

const {
  generateFilePaths,
  createMeetingSession,
} = require("../../utils/discord/file.util");

const {
  finalizeMeetingAudio,
} = require("../../services/discord/audio.service");

let currentSession = null;
const activePcmStreams = new Set();

const waitForActivePcmStreams = () => {
  return Promise.all(
    [...activePcmStreams].map((stream) => {
      return new Promise((resolve, reject) => {
        if (stream.destroyed) {
          resolve();
          return;
        }

        stream.once("finish", resolve);

        stream.once("error", reject);
      });
    }),
  );
};

const startRecording = () => {
  if (currentSession) {
    console.log("Recording is already active:", currentSession.sessionId);

    return currentSession;
  }

  currentSession = createMeetingSession();

  console.log("Recording started for session:", currentSession.sessionId);

  return currentSession;
};

const stopRecording = async () => {
  const session = currentSession;

  currentSession = null;
  await waitForActivePcmStreams();

  if (!session) {
    throw new Error("No active recording!");
  }

  const audio = await finalizeMeetingAudio(session);

  return audio;
};

const getCurrentSession = () => {
  return currentSession;
};

const handleUserSpeaking = (receiver, userId) => {
  const session = startRecording();

  if (!session.segmentsPath) {
    console.log("No session started");
    return;
  }

  console.log(`User ${userId} is speaking`);

  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 100,
    },
  });

  const pcmStream = new prism.opus.Decoder({
    rate: 48000,
    channels: 2,
    frameSize: 960,
  });

  const { pcmPath } = generateFilePaths(session.segmentsPath, userId);

  const pcmFileStream = fs.createWriteStream(pcmPath);
  activePcmStreams.add(pcmFileStream);

  opusStream.pipe(pcmStream).pipe(pcmFileStream);

  pcmFileStream.on("finish", () => {
    console.log(`Finished recording PCM for user ${userId}`);

    console.log(`PCM path: ${pcmPath}`);

    // Hapus dari daftar stream aktif
    activePcmStreams.delete(pcmFileStream);
  });

  pcmFileStream.on("error", (error) => {
    console.error("Error writing PCM:", error);
  });
};

module.exports = {
  handleUserSpeaking,
  startRecording,
  stopRecording,
};
