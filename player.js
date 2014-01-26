var Player = function (id, server, webSocket) {
  this.setId(id);
  this.server = server;
  this.socket = webSocket;
  this.socket.on('message', this.handleMessage.bind(this));
};

Player.prototype.setId = function (id) {
  this.id = id % 2 + 1;
};

Player.prototype.handleMessage = function (data) {
  console.log(data);
  this.server.playerMessage(this.id, data);
};

Player.prototype.handleServerMessage = function (message, data) {
  switch (message) {
    case 'score':
      this.socket.emit('score', data);
      break;
  }
};

module.exports = Player;
