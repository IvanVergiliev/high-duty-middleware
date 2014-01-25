var Player = function (id, server, webSocket) {
  this.id = id;
  this.server = server;
  this.socket = webSocket;
  this.socket.on('message', this.handleMessage);
};

Player.prototype.handleMessage = function (data) {
  console.log(data);
};

module.exports = Player;
