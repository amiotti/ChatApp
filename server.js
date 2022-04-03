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
//const cookieparser = require("cookie-parser");
//const { serialize, parse } = require("cookie");
const path = require("path");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  cookie: true,
});

const formatMessage = require("./utils/messages");
const { userJoin, userDisconnect, allUsers } = require("./utils/users");

//MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  //server static content
  //npm run build
  app.use(server.static(path.join(__dirname, "client/build")));
}

//Run when clients connects
io.on("connection", (socket) => {
  console.log(`New User Connected. ID:${socket.id}`);

  //Welcome current user
  socket.on("welcome", (msg) => {
    socket.join(msg.room);
    userJoin(socket.id, msg.username, msg.room);
    const users = allUsers(msg.room);

    //console.log(users);

    //arr.push(msg.username);

    io.to(msg.room).emit("userconnected", users);
    io.to(msg.room).emit(
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
    socket.join(msg.room);
    const users = userDisconnect(socket.id, msg.username, msg.room);
    //console.log(users);
    io.to(msg.room).emit("reloadusers", users);
    io.to(msg.room).emit(
      "message",
      formatMessage("MiouriChat_Bot", `${msg.username} has left the chat... :(`)
    );
    console.log("USER DISCONNECTED");
  });

  socket.on("disconnect", (msg) => {
    socket.join(msg.room);
    console.log("USER DISCONNECTED");
    //onDisconnect();
  });

  //Listen to chat message from client
  socket.on("chatMessage", (msg) => {
    socket.join(msg.room);
    io.to(msg.room).emit("message", formatMessage(msg.user, msg.text));
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
  console.log(`Connected to DB: ${process.env.DB} || Production DB `);

  server.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT} `);
  });
});
