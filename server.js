const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { Users } = require('./utils/user');
const port = process.env.PORT || 3004;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

var io_client = require('socket.io-client')
var socket_client = io_client.connect('http://localhost:3003', { reconnect: true });



//to everyone in the room
//io.to(params.room).emit();
//to everyone but sender in the room
//socket.broadcast.to(params.room).emit();

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {

        //country or region ranking live feed
        socket.join(params.room.toLowerCase());

        //global live feed
        socket.join("global");

        users.removeUser(socket.id);
        users.adduser(socket.id, params.room.toLowerCase());

        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
    });
});


socket_client.emit('join', function (error) {
    if (error) {
        console.log(error);
    }
    console.log("joined to statservice successfully");
});

socket_client.on('global', function (globalTop5) {
    // io.to(global).emit('global', /*list of top 5 globally*/ globalTop5);
    console.log("GLOBAL LIST:"+"/n/n")
    console.log("got this:", globalTop5);
      console.log("/n/n")
});

socket_client.on('local', function (country, localTop5) {
    //country is the "room" where I emit to all the users.  and local is one of the channels the client is listening on.
    //io.to(country).emit("local", localTop5);

      console.log("LOCAL LIST:"+"/n/n")
    console.log("got this:",  country,localTop5);
      console.log("/n/n")
});




server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
    console.log(socket_client.connected);
});
