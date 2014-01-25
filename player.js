var Player = function (id, server, webSocket) {
  this.id = id;
  this.server = server;
  this.socket = webSocket;
  this.socket.on('message', this.handleMessage.bind(this));
};

Player.prototype.handleMessage = function (data) {
  console.log(data);
  this.server.playerMessage(this.id, data);
};

module.exports = Player;
