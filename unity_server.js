var UnityServer = function (players, tcpSocket) {
  this.players = players;
  this.socket = tcpSocket;
}

module.exports = UnityServer;
