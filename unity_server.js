var UnityServer = function (players, tcpSocket) {
  this.players = players;
  this.socket = tcpSocket;
};

UnityServer.prototype.playerMessage = function (id, message) {
  if (!this.socket) {
    console.warn('No game server connected!');
    return;
  }
  this.socket.write(message + ' ' + id + '$');
};

UnityServer.prototype.stopGame = function () {
};

module.exports = UnityServer;
