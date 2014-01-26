var UnityServer = function (players, tcpSocket) {
  this.players = players;
  this.socket = tcpSocket;
  this.buffer = '';
  if (this.socket) {
    this.socket.on('data', this.onData.bind(this));
  }
};

UnityServer.prototype.setSocket = function (socket) {
  this.socket = socket;
  if (this.socket) {
    this.socket.on('data', this.onData.bind(this));
  }
};

UnityServer.prototype.playerMessage = function (id, message) {
  if (!this.socket) {
    console.warn('No game server connected!');
    return;
  }
  this.socket.write(message + ' ' + id + '$');
};

UnityServer.prototype.onData = function (data) {
  this.buffer += data;
  var index = this.buffer.indexOf('$');
  while (index != -1) {
    this.serverMessage(this.buffer.slice(0, index));
    this.buffer = this.buffer.slice(index + 1);
    index = this.buffer.indexOf('$');
  }
};

UnityServer.prototype.serverMessage = function (message) {
  var parts = message.split(' ');
  switch (parts[0]) {
    case 'score':
      var playerId = parts[1] | 0;
      this.sendPlayerMessage(playerId, parts[0], parts[2]);
      break;
  }
  console.log(message);
};

UnityServer.prototype.sendPlayerMessage = function (playerId, message, data) {
  if (playerId > 0 && playerId <= this.players.length) {
    this.players[playerId - 1].handleServerMessage(message, data);
  }
};

UnityServer.prototype.stopGame = function () {
};

module.exports = UnityServer;
