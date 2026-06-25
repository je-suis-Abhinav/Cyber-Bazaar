require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes');
const cartRoutes=require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');
const wishlistRoutes=require("./routes/wishlistRoutes");
const uploadRoutes=require("./routes/uploadRoutes");
const protect = require('./middleware/authMiddleware');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/upload',uploadRoutes);
app.get('/', (req, res) => {res.send('Backend Running Successfully 🚀');});
app.get('/api/profile', protect, (req, res) => {res.json({message: 'Protected Route Accessed',user: req.user});});
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcryptjs');
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4173",
    methods: ["GET", "POST"]
  }
});
app.set("io", io);
io.on("connection", (socket) => {
    socket.on("disconnect");
});
server.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});