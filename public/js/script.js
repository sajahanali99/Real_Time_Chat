const socket = io();


// =========================
// ELEMENTS
// =========================

const usernameScreen =
    document.getElementById("usernameScreen");

const usernameForm =
    document.getElementById("usernameForm");

const usernameInput =
    document.getElementById("usernameInput");

const messageForm =
    document.getElementById("messageForm");

const messageInput =
    document.getElementById("messageInput");

const chatBox =
    document.getElementById("chatBox");

const connectionStatus =
    document.getElementById("connectionStatus");

const onlineCount =
    document.getElementById("onlineCount");

const typingStatus =
    document.getElementById("typingStatus");


// =========================
// VARIABLES
// =========================

let username = "";

let typingTimer;


// =========================
// CONNECTION
// =========================

socket.on("connect", () => {

    connectionStatus.textContent =
        "🟢 Connected";

});

socket.on("disconnect", () => {

    connectionStatus.textContent =
        "🔴 Disconnected";

});


// =========================
// JOIN CHAT
// =========================

usernameForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        username =
            usernameInput.value.trim();

        if (!username) {
            return;
        }

        socket.emit("join", username);

    }
);


// =========================
// JOINED
// =========================

socket.on("joined", (data) => {

    usernameScreen.style.display = "none";

    addSystemMessage(
        `You joined the chat as ${data.username}`
    );

    messageInput.focus();

});


// =========================
// SEND MESSAGE
// =========================

messageForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const message =
            messageInput.value.trim();

        if (!message) {
            return;
        }

        socket.emit(
            "chat:message",
            message
        );

        messageInput.value = "";

        socket.emit("stop:typing");

        messageInput.focus();

    }
);


// =========================
// RECEIVE MESSAGE
// =========================

socket.on(
    "chat:message",
    (data) => {

        const isMyMessage =
            data.id === socket.id;

        addMessage(
            data,
            isMyMessage
        );

    }
);


// =========================
// ADD MESSAGE
// =========================

function addMessage(data, isMyMessage) {

    const messageElement =
        document.createElement("div");

    messageElement.classList.add(
        "message"
    );

    if (isMyMessage) {

        messageElement.classList.add(
            "my-message"
        );

    } else {

        messageElement.classList.add(
            "other-message"
        );

    }


    const nameElement =
        document.createElement("div");

    nameElement.classList.add(
        "message-name"
    );

    nameElement.textContent =
        data.username;


    const textElement =
        document.createElement("div");

    textElement.textContent =
        data.message;


    const timeElement =
        document.createElement("div");

    timeElement.classList.add(
        "message-time"
    );

    timeElement.textContent =
        data.time;


    messageElement.appendChild(
        nameElement
    );

    messageElement.appendChild(
        textElement
    );

    messageElement.appendChild(
        timeElement
    );


    chatBox.appendChild(
        messageElement
    );

    scrollToBottom();
}


// =========================
// SYSTEM MESSAGE
// =========================

socket.on(
    "system:message",
    (data) => {

        addSystemMessage(
            `${data.message} • ${data.time}`
        );

    }
);


function addSystemMessage(message) {

    const element =
        document.createElement("div");

    element.classList.add(
        "system-message"
    );

    element.textContent =
        message;

    chatBox.appendChild(element);

    scrollToBottom();
}


// =========================
// ONLINE USERS
// =========================

socket.on(
    "users:update",
    (users) => {

        onlineCount.textContent =
            users.length;

    }
);


// =========================
// TYPING
// =========================

messageInput.addEventListener(
    "input",
    () => {

        if (!username) {
            return;
        }

        socket.emit("typing");

        clearTimeout(typingTimer);

        typingTimer = setTimeout(
            () => {

                socket.emit(
                    "stop:typing"
                );

            },
            1000
        );

    }
);


socket.on(
    "user:typing",
    (data) => {

        typingStatus.textContent =
            `${data.username} is typing...`;

    }
);


socket.on(
    "user:stopTyping",
    () => {

        typingStatus.textContent = "";

    }
);


// =========================
// SCROLL
// =========================

function scrollToBottom() {

    chatBox.scrollTop =
        chatBox.scrollHeight;

}