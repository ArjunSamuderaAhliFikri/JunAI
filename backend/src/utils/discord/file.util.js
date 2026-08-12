const fs = require("fs");
const path = require("path");

const getUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {
      recursive: true,
    });
  }

  return uploadsDir;
};

const createMeetingSession = () => {
  const uploadsDir = getUploadsDir();

  const sessionId = `session_${Date.now()}`;

  const sessionPath = path.join(uploadsDir, "meetings", "sessions", sessionId);

  const segmentsPath = path.join(sessionPath, "segments");

  fs.mkdirSync(segmentsPath, {
    recursive: true,
  });

  return {
    sessionId,
    sessionPath,
    segmentsPath,
  };
};

const generateFilePaths = (segmentsPath, userId) => {
  const timestamp = Date.now();

  const pcmPath = path.join(segmentsPath, `${userId}-${timestamp}.pcm`);

  return {
    pcmPath,
  };
};

const getPcmFiles = (segmentsPath) => {
  const files = fs
    .readdirSync(segmentsPath)
    .filter((file) => file.endsWith(".pcm"))
    .sort((a, b) => {
      const timestampA = Number(path.basename(a, ".pcm").split("-").pop());

      const timestampB = Number(path.basename(b, ".pcm").split("-").pop());

      return timestampA - timestampB;
    });

  if (files.length === 0) {
    return [];
  }

  return files.map((file) => path.join(segmentsPath, file));
};

const generateMeetingPcmPath = (sessionPath) => {
  return path.join(sessionPath, "meeting.pcm");
};

const generateMeetingWavPath = (sessionPath) => {
  return path.join(sessionPath, "meeting.wav");
};

module.exports = {
  getUploadsDir,
  createMeetingSession,
  generateFilePaths,
  getPcmFiles,
  generateMeetingWavPath,
  generateMeetingPcmPath,
};
