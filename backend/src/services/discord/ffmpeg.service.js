const { spawn } = require("child_process");
const ffmpeg = require("ffmpeg-static");

const convertPcmToWav = (pcmPath, wavPath) => {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn(ffmpeg, [
      "-f",
      "s16le",

      "-ar",
      "48000",

      "-ac",
      "2",

      "-i",
      pcmPath,

      "-c:a",
      "pcm_s16le",

      "-y",
      wavPath,
    ]);

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        console.log(`Successfully converted to WAV: ${wavPath}`);

        resolve(wavPath);
      } else {
        console.error(`FFmpeg process exited with code ${code}`);

        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpegProcess.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = {
  convertPcmToWav,
};
