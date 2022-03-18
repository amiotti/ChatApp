import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";
import { useLocation } from "react-router";
import ChatMessages from "./ChatMessages";
import socket from "./Socket";

export default function ChatRoom() {
  const [users, setUsers] = useState([]);
  const { state } = useLocation(); //to get data from <Home/> component
  const navigate = useNavigate();
  const [getParams] = useSearchParams();

  const getUser = getParams.get("user");
  const getRoom = getParams.get("room");

  useEffect(() => {
    socket.emit("connected", getUser);
    socket.on("userconnected", (msg) =>
      setUsers(msg /*(old) => [...old, msg]*/)
    );
    return () => {
      socket.off();
    };
  }, []);
  //console.log(users);

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
            navigate("/");
          }}
        >
          Leave Room
        </a>
      </header>
      <ChatMessages users={users} room={state.room} />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.9.2/qs.min.js"
        integrity="sha256-TDxXjkAUay70ae/QJBEpGKkpVslXaHHayklIVglFRT4="
      ></script>
    </div>
  );
}
