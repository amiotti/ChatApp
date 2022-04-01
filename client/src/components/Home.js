import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import socket from "./Socket";
import { useAlert } from "react-alert";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [room, setRoom] = useState("");
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  const alert = useAlert();

  useEffect(() => {
    if (connected && room && username) {
      socket.on("userlogged", (msg) => {
        if (msg) {
          navigate(
            `/chatroom/?user=${username}&room=${room}&connected=${connected}`,
            {
              state: { username, room, connected },
            }
          );
        } else if (!msg) {
          alert.show("Invalid Password");
          //navigate("/register");
        }
      });
      socket.on("needregister", (msg) => {
        if (msg) {
          setTimeout(() => navigate("/register"), 1500);
          alert.show("Please Sign Up! Redirecting...");
        }
      });
    }
  }, [connected, room, username, navigate]);

  const handleClick = (e) => {
    e.preventDefault();
    socket.emit("login", { username, password });
    setConnected(true);
  };

  const createRoom = (e) => {};

  return (
    <div className="join-container">
      <header className="join-header">
        <h1>
          <i className="fas fa-smile"></i> Miouri Chat App
        </h1>
      </header>
      <main className="join-main">
        <form action="chat.html">
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="pasword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="room">Room</label>
            <select
              name="room"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="">Select Room...</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <Link to="/register">Register</Link>
          <button
            type="submit"
            className="btn"
            onClick={(e) => {
              handleClick(e);
            }}
          >
            Join Chat
          </button>
        </form>
      </main>
    </div>
  );
}
