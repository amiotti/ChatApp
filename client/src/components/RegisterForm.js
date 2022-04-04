import React, { useState } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import "../App.css";
import socket from "./Socket";

export default function RegisterForm() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const alert = useAlert();

  const handleSubmit = () => {
    let pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/;
    if (pattern.test(password)) {
      socket.emit("newuser", { user, password });

      setTimeout(() => navigate("/"), 1500);
      alert.show("Signed Up.Redirecting to login ...");
    } else {
      alert.show("Pass must contain at least 8 char.");
    }
  };

  return (
    <>
      <div className="join-container">
        <header className="join-header">
          <h1>
            <i className="fas fa-smile"></i> Registration Page
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
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Set username..."
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
                placeholder="Set new password..."
                required
              />
            </div>
          </form>
          <button type="submit" className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </main>
      </div>
    </>
  );
}
