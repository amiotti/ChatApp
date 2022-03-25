require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
const db = require("./db/index");
const { Users } = require("./db/models/models");
const cookieparser = require("cookie-parser");
//const { serialize, parse } = require("cookie");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  cookie: true,
});

const formatMessage = require("./utils/messages");

//MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});
app.use(cookieparser());
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
  // socket.broadcast.emit(
  //   "message",
  //   formatMessage("MiouriChat", "A user has joined the chat")
  // );

  //User Disconnection
  socket.on("userdisconnection", (msg) => {
    arr = arr.filter((el) => el !== msg);
    io.emit("reloadusers", arr);
    io.emit(
      "message",
      formatMessage("MiouriChat_Bot", `${msg} has left the chat... :(`)
    );
  });

  socket.on("disconnect", (msg) => {
    if (arr.length === 1) {
      arr = [];
    }
  });

  //Listen to chat message from client
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage(msg.user, msg.text));
  });

  //Add user to DB
  socket.on("newuser", async (msg) => {
    try {
      await Users.create({
        username: msg.user,
        password: msg.password.trim(),
      });
    } catch (err) {
      console.log(err);
    }
  });

  //Verify User registered
  socket.on("login", async (msg) => {
    let auxus = await Users.findOne({
      where: { username: msg.username },
    });
    let auxpass = await Users.findOne({
      where: { password: msg.password },
    });

    try {
      if (auxus && auxus.username) {
        if (auxpass && auxpass.password.trim() === msg.password) {
          io.emit("userlogged", true);
          console.log("USER REGISTERED");
        } else {
          io.emit("userlogged", false);
          console.log("WRONG PASSWORD");
        }
      } else {
        io.emit("needregister", true);
        console.log("USER NOT REGISTERED");
      }
    } catch (err) {
      console.log(err.message);
    }
  });
});

//RUN SERVER AND CONNECT DB
const force = false;
db.sync(force).then(() => {
  console.log(`Connected to DB: ${process.env.DB} `);

  server.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT} `);
  });
});
