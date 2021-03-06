import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";
import ChatMessages from "./ChatMessages";
import socket from "./Socket";

export default function ChatRoom() {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const [getParams] = useSearchParams(); // to get parameters from URL

  const getUser = getParams.get("user");
  const getRoom = getParams.get("room");

  useEffect(() => {
    socket.emit("welcome", { username: getUser, room: getRoom });
    //socket.on("userconnected", (msg) => (console.log(msg), setUsers(msg)));

    return () => {
      socket.off();
    };
  }, []);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile"></i> MiouriChat
        </h1>
        <a
          id="leave-btn"
          className="btn"
          onClick={(e) => {
            e.preventDefault();

            socket.emit("userdisconnection", {
              username: getUser,
              room: getRoom,
            });

            navigate("/");
          }}
        >
          Leave Room
        </a>
      </header>
      <ChatMessages users={users} room={getRoom} setUsers={setUsers} />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.9.2/qs.min.js"
        integrity="sha256-TDxXjkAUay70ae/QJBEpGKkpVslXaHHayklIVglFRT4="
      ></script>
    </div>
  );
}
