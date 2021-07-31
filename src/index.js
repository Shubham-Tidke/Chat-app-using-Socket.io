const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
//creating server outside of express library and configuring to use express app
const server = http.createServer(app);
const io = socketio(server); //instance of socket.io to configure with server
const port = process.env.PORT || 3000
const pubicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(pubicDirectoryPath))

//io.on('connection', (socket)) runs when new socket client connects [connection is inbuilt event]
io.on('connection', (socket) => {
    console.log('connction found!');
    //emitting msg from server to client [event,string-msg]
    socket.emit('message', 'welcome!!');

    //emitting msg to everyone except this socket client
    socket.broadcast.emit('message', 'New user joined');
    socket.on('sendMessage', (str) => {//receiving evenet from client with input
        io.emit('message', str) //emitting message received msg from server to all clients
    })

    //listenng to sendlocation event,to share with all connected clients
    socket.on('sendlocation', (coordinates, callbackACK) => {
        //emitting the shared location coordinates to all clients using 'message' event
        io.emit('message', `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`)
        callbackACK(); //calling callback function
    })
    //when a socket client is disconnected
    socket.on('disconnect', () => { //disconnect is in built connection
        io.emit('message', 'User left the group!')
        //since the client is left already,just broadcasting msg to all connected clients will do
    })
})
server.listen(port, () => {
    console.log('server is up at : ' + port);
});