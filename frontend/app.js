const socket = io("http://localhost:8080");

const enter = document.getElementById("enter");
const chatContainer = document.getElementById("chat_show");
const chats = document.getElementById("chats");
const name = document.getElementById("name");
const home = document.getElementById("home");
const form = document.getElementById("form");
let userName = null;

const append = (msg, position, name) => {
  const containerText = document.createElement("div");
  containerText.className = position;
  const userName = document.createElement("small");
  userName.classList = "user_name";
  userName.textContent = name ? name : "";
  const userMsg = document.createElement("p");
  userMsg.className = "user_msg";
  userMsg.textContent = msg;
  containerText.append(userName, userMsg);
  chats.append(containerText);
};

enter.addEventListener("click", () => {
  if (name.value.length >= 1) {
    chatContainer.removeAttribute("hidden");
    home.setAttribute("hidden", "true");
    socket.emit("user-add", name.value);
    userName = name.value;
  }
});

socket.on("user", (name) => {
  append(`${name} is joined`, "left");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("msg:post", form.elements.message.value);
  append(form.elements.message.value, "right", userName);
  form.elements.message.value = "";
});

socket.on("msg", (data) => {
  append(data.message, "left", data.name);
});

const onConfirmRefresh = function (event) {
  event.preventDefault();
  if (!chatContainer.hasAttribute("hidden")) {
    return (event.returnValue = "Are you sure you want to leave the page?");
  }
};

window.addEventListener("beforeunload", onConfirmRefresh, { capture: true });
