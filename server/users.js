const users = new Map();

function addUser(socketId, username) {
    users.set(socketId, {
        id: socketId,
        username: username
    });
}

function removeUser(socketId) {
    const user = users.get(socketId);
    users.delete(socketId);
    return user;
}

function getUser(socketId) {
    return users.get(socketId);
}

function getUsers() {
    return Array.from(users.values());
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsers
};