const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(path.join(__dirname, "..", "public")));

setupSocket(io);

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});