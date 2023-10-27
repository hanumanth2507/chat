const express = require('express');
const app = express();
const path = require('path');

//Initilize Port
const port = 3000;

//Initilize Server
const server = app.listen(port, () => console.log(`Server is listening on port ${port}`));

const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket){
    // console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit("clients-connected", socketsConnected.size)


    socket.on('disconnect', () =>{
        // console.log('Socket disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-connected', socketsConnected.size)
    })

    socket.on('message', (data) =>{
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) =>{
        socket.broadcast.emit('feedback', data)
    })
}