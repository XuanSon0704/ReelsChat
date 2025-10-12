const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả các origin trong môi trường dev
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('<h1>Chat App Backend is running!</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });

  socket.on('chat message', (msg) => {
    console.log('message from ' + msg.user + ': ' + msg.text);
    // Gửi lại tin nhắn cho tất cả mọi người
    io.emit('chat message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on *:${PORT}`);
});
