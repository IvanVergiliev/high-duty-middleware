var express = require('express');
var http = require('http');
var net = require('net');
var Player = require('./player.js');
var socketIO = require('socket.io');
var UnityServer = require('./unity_server.js');

var app = express();

var server = http.createServer(app);

app.use('/static', express.static(__dirname + "/static"));
app.use('/bower_components', express.static(__dirname + "/bower_components"));

var io = socketIO.listen(server);

var unityServer = new UnityServer(players, null);

var players = [];

io.sockets.on('connection', function (socket) {
  var player = new Player(players.length + 1, unityServer, socket);
  players.push(player);
  socket.on('disconnect', function () {
    var pos = players.indexOf(player);
    if (pos == -1) {
      console.error('Player not found in active players');
      return;
    }
    unityServer.stopGame();
    players.splice(pos, 1);
  });
});

server.listen(3000);

var tcpServer = net.createServer(function (socket) {
  unityServer.socket = socket;
  socket.on('close', function () {
    unityServer.socket = null;
    console.log('disconnected game server');
  });
  console.log('connected game server');
});

tcpServer.listen(3001);
