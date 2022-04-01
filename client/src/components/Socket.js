import io from "socket.io-client";

let socket = io("/" /*"http://localhost:3000"*/); // just "/" becouse proxy is setted on package.json

export default socket;
