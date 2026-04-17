const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// In-memory rooms (for simplicity; can be persisted to MongoDB)
const rooms = {};

// Create Room
router.post("/", (req, res) => {
  try {
    const { dramaId, dramaTitle, posterPath, userName } = req.body;
    const roomId = uuidv4().substring(0, 8).toUpperCase();
    rooms[roomId] = {
      roomId,
      dramaId,
      dramaTitle,
      posterPath,
      host: { userId: "guest-host", name: userName || "Guest Host" },
      createdAt: new Date(),
      users: [],
      messages: [],
    };
    res.status(201).json({ roomId, room: rooms[roomId] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Room Info
router.get("/:roomId", (req, res) => {
  const room = rooms[req.params.roomId];
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ room });
});

// List Active Rooms
router.get("/", (req, res) => {
  const activeRooms = Object.values(rooms).map((r) => ({
    roomId: r.roomId,
    dramaTitle: r.dramaTitle,
    posterPath: r.posterPath,
    host: r.host,
    userCount: r.users.length,
    createdAt: r.createdAt,
  }));
  res.json({ rooms: activeRooms });
});

module.exports = router;
