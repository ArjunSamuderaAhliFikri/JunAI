const {
  startRecording,
  stopRecording,
} = require("../../services/discord/recorder.service");

const stopRecordingController = async (req, res) => {
  try {
    const audio = await stopRecording();

    return res.status(200).json({
      success: true,

      message: "Recording stopped successfully",

      audio: {
        pcmPath: audio.pcmPath,

        wavPath: audio.wavPath,
      },
    });
  } catch (error) {
    console.error("Stop recording error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const startRecordingController = (req, res) => {
  try {
    const session = startRecording();

    return res.status(200).json({
      success: true,

      message: "Recording started",

      sessionId: session.sessionId,
    });
  } catch (error) {
    console.error("Start recording error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startRecordingController,
  stopRecordingController,
};
