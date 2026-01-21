import { Server } from "socket.io";

const sessions = new Map(); // socketId -> { userId, role }
const rooms = new Map(); // userId -> roomId

export function initSocket(httpServer, options) {
  const io = new Server(httpServer, {
    cors: options?.cors,
  });

  io.on("connection", (socket) => {
    socket.on("hello", ({ userId, role }) => {
      const safeRole = role === "agent" ? "agent" : "user";
      sessions.set(socket.id, { userId: userId || null, role: safeRole });

      if (userId) {
        const roomId = `user:${userId}`;
        rooms.set(userId, roomId);
        socket.join(roomId);
      }
      socket.emit("hello_ok", { ok: true });
    });

    // User sends message -> goes to their room + also "agents" room
    socket.on("chat:send", ({ userId, text }) => {
      const msg = {
        id: cryptoRandomId(),
        userId,
        text: String(text || "").slice(0, 2000),
        at: new Date().toISOString(),
      };
      if (!userId || !msg.text) return;

      const roomId = rooms.get(userId) || `user:${userId}`;
      io.to(roomId).emit("chat:message", msg);
      io.to("agents").emit("chat:message", msg); // agents listen here
    });

    // Agent joins agent room
    socket.on("agent:join", () => {
      socket.join("agents");
      socket.emit("agent_ok", { ok: true });
    });

    socket.on("disconnect", () => {
      sessions.delete(socket.id);
    });
  });

  return io;
}

function cryptoRandomId() {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}
