const cors = require('cors');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const { chats } = require('./data/data.js');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddle');
dotenv.config()

connectDB();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())
app.use(express.json()); //To accept json data

app.get('/', (req, res) => {
  res.send('API is running')
})

app.get('/chats', (req, res) => {
  res.send(chats)
})
app.get('/chats/:id', (req, res) => {
  // console.log(req.params.id)
  const singleChat = chats.find((c) => c._id === req.params.id)
  res.send(singleChat);
})

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound)
app.use(errorHandler)


const server = app.listen(process.env.PORT, console.log(`Server started at port ${process.env.PORT}`.blue.bold));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
})

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  })

  socket.on('typing', (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  })
})