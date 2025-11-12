// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

// Load generated data
const events = JSON.parse(fs.readFileSync('events.json', 'utf8'));
let currentIndex = 0;
let speedMultiplier = 1; // can be 1x, 5x, 10x

// API endpoint
app.get('/', (req, res) => {
  res.send('Fleet Tracking Backend is Running 🚀');
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected ✅');

  socket.on('setSpeed', (speed) => {
    speedMultiplier = speed;
    console.log(`Speed set to ${speed}x`);
  });

  const interval = setInterval(() => {
    if (currentIndex < events.length) {
      socket.emit('event', events[currentIndex]);
      currentIndex++;
    } else {
      clearInterval(interval);
      console.log('Simulation complete ✅');
    }
  }, 1000 / speedMultiplier);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected ❌');
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
