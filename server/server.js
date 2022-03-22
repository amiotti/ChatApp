const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const formatMessage = require("./utils/messages");

//MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
let arr = [];

//Run when clients connects
io.on("connection", (socket) => {
  console.log(`New User Connected. ID:${socket.id}`);

  //Welcome current user
  socket.on("welcome", (msg) => {
    arr.push(msg.username);
    io.emit("userconnected", arr);
    io.emit(
      "welcomemessage",
      formatMessage(
        "MiouriChat_Bot",
        `Welcome to ${msg.room} room, ${msg.username}!`
      )
    );
  });

  //Broadcast when user connects
  socket.broadcast.emit(
    "message",
    formatMessage("MiouriChat", "A user has joined the chat")
  );

  //Run when clients disconects
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    arr = [];
    io.emit("message", formatMessage("MiouriChat", "A user has left the chat"));
  });

  //Listen to chat message from client
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage(msg.user, msg.text));
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT} `);
});
