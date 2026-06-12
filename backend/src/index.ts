import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Backend Running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // ========================
  // JOIN ROOM
  // ========================
  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);

    console.log(`${socket.id} joined ${roomId}`);

    updateUserCount(roomId);
  });

  // ========================
  // DRAW EVENT
  // ========================
  socket.on(
    "draw",
    (data: { roomId: string; line: any }) => {
      socket.to(data.roomId).emit("draw", data.line);
    }
  );

  // ========================
  // CHAT EVENT (FIXED)
  // ========================
  socket.on(
    "send-message",
    (data: {
      roomId: string;
      message: string;
      sender: string;
    }) => {
      io.to(data.roomId).emit("receive-message", {
        message: data.message,
        sender: data.sender,
        socketId: socket.id,
      });
    }
  );

  // ========================
  // DISCONNECT
  // ========================
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    socket.rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        updateUserCount(roomId);
      }
    });
  });

  // ========================
  // HELPER
  // ========================
  const updateUserCount = (roomId: string) => {
    const roomSize =
      io.sockets.adapter.rooms.get(roomId)?.size || 0;

    io.to(roomId).emit("user-count", roomSize);
  };
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});