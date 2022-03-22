import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";
//import { useLocation } from "react-router";
import ChatMessages from "./ChatMessages";
import socket from "./Socket";

export default function ChatRoom() {
  const [users, setUsers] = useState([]);
  //const { state } = useLocation(); //to get data from <Home/> component
  const navigate = useNavigate();
  const [getParams] = useSearchParams(); // to get parameters from URL

  const getUser = getParams.get("user");
  const getRoom = getParams.get("room");
  const getConnected = getParams.get("connected");

  useEffect(() => {
    socket.emit("welcome", { username: getUser, room: getRoom });
    socket.on("userconnected", (msg) => setUsers(msg));

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
            //console.log(users.filter((user) => user != getUser));

            setUsers(users.filter((user) => user != getUser));
            navigate("/");
          }}
        >
          Leave Room
        </a>
      </header>
      <ChatMessages users={users} room={getRoom} />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.9.2/qs.min.js"
        integrity="sha256-TDxXjkAUay70ae/QJBEpGKkpVslXaHHayklIVglFRT4="
      ></script>
    </div>
  );
}
