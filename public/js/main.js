const chatForm = document.getElementById("chat-form");
const socket = io();

//Message from server
socket.on("message", (msg) => {
  console.log(msg);

  //Scroll down every new msg
});

//Message submited
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit msg to the server
  socket.emit("chatMessage", msg);

  //Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output message to DOM
const outputMessage = (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class='meta'>${msg.username} <span>${msg.time}</span></p>
  <p class='text'>${msg.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};
