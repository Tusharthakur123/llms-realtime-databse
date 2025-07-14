const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

app.use(cors());
app.use(express.json());

// inject io into every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/transactions', transactionRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🔌 New client connected');
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
