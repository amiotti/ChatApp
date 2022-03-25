import React, { useEffect, useState } from "react";
import socket from "./Socket";
import { useLocation } from "react-router";
import "../App.css";
import shortid from "shortid";

export default function ChatMessages({ users, room, setUsers }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { state } = useLocation(); //to get data from <Home/> component

  useEffect(() => {
    socket.once("welcomemessage", (msg) => {
      setMessages((oldmessage) => [...oldmessage, msg]);
    });
    socket.on("message", (msg) => {
      setMessages((oldmessage) => [...oldmessage, msg]);
    });
    socket.on(
      "userconnected",
      (msg) => (setUsers(msg), console.log(`USER CONNECTED: ${msg}`))
    );

    socket.on(
      "reloadusers",
      (msg) => (setUsers(msg), console.log(`UPDATED USERS: ${msg}`))
    ); //updates users after a disconnection

    return () => {
      socket.off();
    };
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit("chatMessage", {
        user: state.username,
        text: message,
      });

      setMessage("");
    }
  };

  const outputMessage = (msg) => (
    <div className="message" key={shortid.generate()}>
      <p className="meta">
        {msg.username}
        <span>{msg.time}</span>
      </p>
      <p className="text">{msg.text}</p>
    </div>
  );
  return (
    <>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name"> {room}</h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <ul className="users">
            {users.map((user) => (
              <li key={shortid.generate()}>{user}</li>
            ))}
          </ul>
        </div>
        <div className="chat-messages">
          {messages && messages.map((msg) => outputMessage(msg))}
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form">
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            value={message}
            autoComplete="off"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button className="btn" type="submit" onClick={handleSubmit}>
            <i className="fas fa-paper-plane"></i> Send
          </button>
        </form>
      </div>
    </>
  );
}
