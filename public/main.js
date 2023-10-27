const socket = io();


const clientsConnetced = document.getElementById('client-count');
const messageContainer = document.getElementById('messages');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');


messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})

socket.on('clients-connected', (data) => {
    clientsConnetced.innerHTML = `Clients Connected: ${data}`;
})

function sendMessage() {
    if(messageInput.value === '') return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    console.log(data);
    socket.emit('message', data)
    renderMessage(true, data);
    // const emptyMessage = '';
    messageInput.value = '';
}

socket.on('chat-message', (data) =>{
    renderMessage(false, data);
})

function renderMessage(ownMessage, data){
    clearFeedback();
    const element = `
    <li class="${ownMessage ? 'message-right' : 'message-left'}">
        <p class="message">${data.message}
        <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span></p>
    </li>
    `

    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {feedback: `${nameInput.value} is typing...`});
    scrollToBottom();
});

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {feedback: `${nameInput.value} is typing...`});
    scrollToBottom();
});

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {feedback:``});
    scrollToBottom();
})

socket.on('feedback', (data) =>{
    clearFeedback();
    const element = `
    <li class="message-feedback">
        <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
    `
    messageContainer.innerHTML += element;
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element);
    }
)}