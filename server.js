const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const os = require("os");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Basic health endpoint
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// Static assets with cache control in production
const isProduction = process.env.NODE_ENV === "production";
const staticOptions = isProduction ? { maxAge: "1h" } : undefined;
app.use(express.static(__dirname + "/public", staticOptions));

// Map socket.id -> username
const socketIdToUsername = new Map();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join", (rawUsername) => {
    const username = (rawUsername && String(rawUsername).trim()) || "Anonymous";
    socketIdToUsername.set(socket.id, username);

    // Notify others and send updated user list to everyone
    socket.broadcast.emit("userJoined", username);
    io.emit("userList", Array.from(socketIdToUsername.values()));
  });

  socket.on("chatMessage", (message) => {
    const username = socketIdToUsername.get(socket.id) || "Anonymous";
    const payload = {
      username,
      message: String(message || "").slice(0, 2000),
      timestamp: Date.now(),
    };
    io.emit("chatMessage", payload);
  });

  socket.on("disconnect", () => {
    const username = socketIdToUsername.get(socket.id);
    if (username) {
      socketIdToUsername.delete(socket.id);
      socket.broadcast.emit("userLeft", username);
      io.emit("userList", Array.from(socketIdToUsername.values()));
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

function getLocalIps() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) results.push(net.address);
    }
  }
  return results;
}

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // listen on all interfaces so phones on LAN can connect
server.listen(PORT, HOST, () => {
  const ips = getLocalIps();
  console.log(`Server listening on: http://localhost:${PORT}`);
  if (ips.length) {
    console.log(`On your phone, open: http://${ips[0]}:${PORT}`);
  }
});
