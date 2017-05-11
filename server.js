/*jshint esversion: 6 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { Users } = require('./utils/user');
const port = process.env.PORT || 6001;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(bodyParser.json());

//to everyone in the room
//io.to(params.room).emit();
//to everyone but sender in the room
//socket.broadcast.to(params.room).emit();

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (room, callback) => {

        //country or region ranking live feed
        socket.join(room.toLowerCase());
        console.log(socket.id,room);

        //global live feed
        socket.join("global");

        users.removeUser(socket.id);
        users.adduser(socket.id, room.toLowerCase());

        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
    });
});

app.post('/global', (req, res) => {

    var body = _.pick(req.body, ['data']);
    io.to("global").emit('global', body.data);
    res.sendStatus(200);
});

app.post('/room/:room', (req, res) => {

    var room = req.params.room;
    var body = _.pick(req.body, ['data']);
    io.to(room.toLowerCase()).emit("local", body.data);
    res.sendStatus(200);
});


app.get('/ping', (req, res) => {
    res.send("realtime date provider is up and running");
    console.log("asd");
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});