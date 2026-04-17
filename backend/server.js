const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

// Global Axios Configuration (Timeout)
axios.defaults.timeout = 15000; // Reduced global timeout to 15s for better fallback experience


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dramas', require('./routes/dramas'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/trakt', require('./routes/trakt'));


app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'KDrama Server Running 🎬' }));

// ─── Socket.io Watch Party ─────────────────────────────────────────────────
const watchRooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    if (!watchRooms[roomId]) {
      watchRooms[roomId] = {
        users: [],
        messages: [],
        videoState: { playing: false, currentTime: 0, videoId: null }
      };
    }
    const existing = watchRooms[roomId].users.find(u => u.userId === user.userId);
    if (!existing) {
      watchRooms[roomId].users.push({ ...user, socketId: socket.id });
    }
    io.to(roomId).emit('room-update', watchRooms[roomId]);
    socket.emit('video-state', watchRooms[roomId].videoState);
  });

  socket.on('chat-message', ({ roomId, message, user }) => {
    const msg = {
      id: Date.now(),
      user,
      message,
      time: new Date().toISOString()
    };
    if (watchRooms[roomId]) {
      watchRooms[roomId].messages.push(msg);
      if (watchRooms[roomId].messages.length > 100) {
        watchRooms[roomId].messages = watchRooms[roomId].messages.slice(-100);
      }
    }
    io.to(roomId).emit('new-message', msg);
  });

  socket.on('video-sync', ({ roomId, state, user }) => {
    if (watchRooms[roomId]) {
      watchRooms[roomId].videoState = { ...state, lastSync: user?.name };
    }
    socket.to(roomId).emit('video-state', state);
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    if (watchRooms[roomId]) {
      watchRooms[roomId].users = watchRooms[roomId].users.filter(u => u.socketId !== socket.id);
      io.to(roomId).emit('room-update', watchRooms[roomId]);
    }
  });

  socket.on('disconnect', () => {
    Object.keys(watchRooms).forEach(roomId => {
      if (watchRooms[roomId]) {
        const before = watchRooms[roomId].users.length;
        watchRooms[roomId].users = watchRooms[roomId].users.filter(u => u.socketId !== socket.id);
        if (before !== watchRooms[roomId].users.length) {
          io.to(roomId).emit('room-update', watchRooms[roomId]);
        }
      }
    });
  });
});

// ─── MongoDB & Start ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    const startServer = (port) => {
      server.listen(port)
        .on('listening', () => {
          console.log(`🚀 Server running on http://localhost:${port}`);
        })
        .on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️  Port ${port} is busy. Trying port ${port + 1}...`);
            server.close();
            startServer(port + 1); // ✅ Alternative Fix #1: Auto-increment port
          } else {
            console.error('❌ Server error:', err);
            process.exit(1);
          }
        });
    };

    const PORT = parseInt(process.env.PORT) || 5001;
    startServer(PORT);
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

