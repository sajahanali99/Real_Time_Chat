const {
    addUser,
    removeUser,
    getUser,
    getUsers
} = require("./users");

function setupSocket(io) {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        // User joins
        socket.on("join", (username) => {

            username = String(username).trim();

            if (!username) {
                username = "Anonymous";
            }

            addUser(socket.id, username);

            socket.emit("joined", {
                username: username
            });

            // Send updated online users
            io.emit("users:update", getUsers());

            // Notify other users
            socket.broadcast.emit("system:message", {
                message: `${username} joined the chat.`,
                time: new Date().toLocaleTimeString()
            });

            console.log(`${username} joined the chat`);
        });


        // Receive message
        socket.on("chat:message", (message) => {

            const user = getUser(socket.id);

            if (!user) {
                return;
            }

            message = String(message).trim();

            if (!message) {
                return;
            }

            const messageData = {
                id: socket.id,
                username: user.username,
                message: message,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            };

            // Send message to everyone
            io.emit("chat:message", messageData);
        });


        // Typing status
        socket.on("typing", () => {

            const user = getUser(socket.id);

            if (!user) {
                return;
            }

            socket.broadcast.emit("user:typing", {
                username: user.username
            });
        });


        socket.on("stop:typing", () => {
            socket.broadcast.emit("user:stopTyping");
        });


        // User disconnects
        socket.on("disconnect", () => {

            const user = removeUser(socket.id);

            if (user) {

                io.emit("users:update", getUsers());

                io.emit("system:message", {
                    message: `${user.username} left the chat.`,
                    time: new Date().toLocaleTimeString()
                });

                console.log(`${user.username} disconnected`);
            }
        });

    });
}

module.exports = setupSocket;