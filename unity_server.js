var UnityServer = function (players, tcpSocket) {
  this.players = players;
  this.socket = tcpSocket;
}

UnityServer.prototype.stopGame = function () {
};

module.exports = UnityServer;
