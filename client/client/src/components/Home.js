import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import socket from "./Socket";

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (connected && room && username) {
      navigate(
        `/chatroom/?user=${username}&room=${room}&connected=${connected}`,
        {
          state: { username, room, connected },
        }
      );
    }
  }, [connected, room, username, navigate]);

  const handleClick = (e) => {
    e.preventDefault();
    //socket.emit("connected", username);
    setConnected(true);
  };

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
            <label htmlFor="room">Room</label>
            <select
              name="room"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div>

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
