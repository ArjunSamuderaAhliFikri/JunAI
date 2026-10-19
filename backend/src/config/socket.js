/** @format */

const { Server } = require("socket.io");

let io = null;

/**
 * Initialize Socket.IO with HTTP server.
 * Allows client connections and per-user rooms for targeted notifications.
 *
 * @param {import('http').Server} server - Node HTTP server instance
 * @returns {Server} Socket.IO instance
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);

    // Join user-specific room for targeted notifications
    socket.on("join", (userId) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.join(room);
        console.log(`👤 [Socket.IO] Client ${socket.id} joined room: ${room}`);
      }
    });

    // Leave user room
    socket.on("leave", (userId) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.leave(room);
        console.log(`🚪 [Socket.IO] Client ${socket.id} left room: ${room}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ [Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the current Socket.IO instance.
 * @returns {Server|null}
 */
const getIO = () => {
  return io;
};

module.exports = { initSocket, getIO };
