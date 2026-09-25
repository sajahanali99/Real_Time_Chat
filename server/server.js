const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const setupSocket = require("./socket");

const app = express();

const server = http.createServer(app);

const io = new Server(server);


// Serve frontend files
app.use(express.static(path.join(__dirname, "..", "public")));


// Setup Socket.IO
setupSocket(io);


// Port
const PORT = 3000;

server.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("Real-Time Chat Server Started");
    console.log(`Open: http://localhost:${PORT}`);
    console.log("--------------------------------");
});