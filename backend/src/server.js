const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

const app = express();
app.use(cors({ origin: allowedOrigin, methods: ['GET', 'POST']} ));
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

app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
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

const shutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  //Force shutdown if not closed in time
  setTimeout(() => process.exit(1), 10000). unref();
};

process.on('SIGNTERM', shutdown);
process.on('SIGNIN', shutdown);
