const fs = require("fs");
const path = require("path");

const {
  getPcmFiles,
  generateMeetingPcmPath,
  generateMeetingWavPath,
} = require("../../utils/discord/file.util");

const { convertPcmToWav } = require("./ffmpeg.service");

const mergePcmFiles = async (pcmFiles, outputPcmPath) => {
  const outputStream = fs.createWriteStream(outputPcmPath);

  for (const pcmFile of pcmFiles) {
    await new Promise((resolve, reject) => {
      const inputStream = fs.createReadStream(pcmFile);

      inputStream.on("error", reject);

      inputStream.on("end", resolve);

      inputStream.pipe(outputStream, {
        end: false,
      });
    });
  }

  await new Promise((resolve, reject) => {
    outputStream.end();

    outputStream.on("finish", resolve);

    outputStream.on("error", reject);
  });

  return outputPcmPath;
};

const finalizeMeetingAudio = async (session) => {
  console.log(`Finalizing session: ${session.sessionId}`);

  const pcmFiles = getPcmFiles(session.segmentsPath);

  console.log(`Found ${pcmFiles.length} PCM files`);

  if (pcmFiles.length === 0) {
    throw new Error("No PCM files found");
  }

  // 2. Tentukan output PCM
  const meetingPcmPath = generateMeetingPcmPath(session.sessionPath);

  // 3. Tentukan output WAV
  const meetingWavPath = generateMeetingWavPath(session.sessionPath);

  // 4. Merge semua PCM
  await mergePcmFiles(pcmFiles, meetingPcmPath);

  console.log(`Merged PCM: ${meetingPcmPath}`);

  // 5. Convert PCM → WAV
  await convertPcmToWav(meetingPcmPath, meetingWavPath);

  console.log(`Final WAV: ${meetingWavPath}`);

  return {
    pcmPath: meetingPcmPath,
    wavPath: meetingWavPath,
  };
};

module.exports = {
  mergePcmFiles,
  finalizeMeetingAudio,
};
