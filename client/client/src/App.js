import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ChatRoom from "./components/ChatRoom";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
