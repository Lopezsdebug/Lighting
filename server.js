import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 3001);
const allowedOrigins = (process.env.FRONTEND_URL || "*").split(",").map(v => v.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins.includes("*") ? true : allowedOrigins }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "Lighting" }));

app.get("/api/turn-credentials", async (_req, res) => {
  const keyId = process.env.TURN_KEY_ID;
  const apiToken = process.env.TURN_KEY_API_TOKEN;
  if (!keyId || !apiToken) return res.json({ iceServers: [{ urls: ["stun:stun.cloudflare.com:3478"] }] });
  try {
    const r = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${keyId}/credentials/generate-ice-servers`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ttl: 86400 })
    });
    if (!r.ok) return res.status(502).json({ error: "TURN credentials unavailable" });
    res.json(await r.json());
  } catch (e) { console.error(e); res.status(502).json({ error: "TURN service unavailable" }); }
});

app.get(/.*/, (_req, res) => res.sendFile(process.cwd() + "/public/index.html"));

const io = new Server(server, { cors: { origin: allowedOrigins.includes("*") ? true : allowedOrigins } });
const users = new Map();

io.on("connection", socket => {
  socket.on("join-app", ({ user }) => {
    users.set(socket.id, { ...user, socketId: socket.id });
    io.emit("presence", [...users.values()]);
  });

  socket.on("join-room", ({ roomId, user }) => {
    for (const room of socket.rooms) if (room !== socket.id) socket.leave(room);
    socket.join(roomId); socket.data.user = user; socket.data.roomId = roomId;
    socket.to(roomId).emit("peer-joined", { peerId: socket.id, user });
    const peers = [...(io.sockets.adapter.rooms.get(roomId) || [])].filter(id => id !== socket.id)
      .map(id => ({ peerId: id, user: users.get(id) || {} }));
    socket.emit("room-peers", peers);
  });

  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId); socket.to(roomId).emit("peer-left", { peerId: socket.id });
    if (socket.data.roomId === roomId) delete socket.data.roomId;
  });
  socket.on("chat-message", data => io.emit("chat-message", data));
  socket.on("webrtc-offer", ({ target, offer }) => io.to(target).emit("webrtc-offer", { sender: socket.id, offer }));
  socket.on("webrtc-answer", ({ target, answer }) => io.to(target).emit("webrtc-answer", { sender: socket.id, answer }));
  socket.on("webrtc-ice", ({ target, candidate }) => io.to(target).emit("webrtc-ice", { sender: socket.id, candidate }));
  socket.on("screen-state", ({ roomId, sharing }) => socket.to(roomId).emit("screen-state", { peerId: socket.id, sharing }));
  socket.on("disconnect", () => {
    if (socket.data.roomId) socket.to(socket.data.roomId).emit("peer-left", { peerId: socket.id });
    users.delete(socket.id); io.emit("presence", [...users.values()]);
  });
});

server.listen(port, "0.0.0.0", () => console.log(`Lighting rodando na porta ${port}`));
