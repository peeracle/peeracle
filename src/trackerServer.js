/*
 * Copyright (c) 2015 peeracle contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var uuid = require('node-uuid');
var http = require('http');
var WebSocketServer = require('websocket').server;
var Peeracle = {
  TrackerMessage: require('./trackerMessage')
};

/* eslint-disable */
Peeracle.TrackerServer = (function () {
  /* eslint-enable */
  /**
   * @class TrackerServer
   * @memberof {Peeracle}
   * @constructor
   */
  function TrackerServer() {
    this.server = null;
    this.ws = null;
    this.hashes = {};
  }

  TrackerServer.prototype.listen = function listen(host, port) {
    this.server = http.createServer(function createServer(request, response) {
      response.writeHead(404);
      response.end();
    }).listen(port, host, function httpListen() {
      console.log('info', 'Listening on ' + host + ':' + parseInt(port, 10));
    });

    this.ws = new WebSocketServer({
      httpServer: this.server,
      autoAcceptConnections: false
    });

    this.ws.on('request', this.incomingRequest.bind(this));
  };

  TrackerServer.prototype.incomingRequest = function incomingRequest(request) {
    var sock;

    try {
      console.log('request.requestedProtocols', request.requestedProtocols);
      sock = request.accept('prcl-0.0.1', request.origin);
      sock.id = null;
      sock.on('message', this.onMessage.bind(this, sock));
      sock.on('close', this.onClose.bind(this, sock));
      console.log('info', 'user origin ' + request.origin);
    } catch (e) {
      console.log(e);
    }
  };

  TrackerServer.prototype.onMessage = function onMessage(sock, message) {
    var msg;

    if (message.type !== 'binary') {
      return;
    }

    msg = new Peeracle.TrackerMessage();
    msg.unserialize(new Uint8Array(message.binaryData));
    this['handle' + Peeracle.TrackerMessage.Types[msg.props.type].name]
      .bind(this)(sock, msg, function handleCb(err) {
      if (err) {
        throw err;
      }
    });
  };

  TrackerServer.prototype.onClose = function onClose(sock, code, description) {
    var index;
    var count;

    count = sock.hashes.length;
    for (index = 0; index < count; ++index) {
      this.removePeerFromHash(sock, sock.hashes[index]);
    }
    sock.hashes = [];
    console.log('onClose', code, description);
  };

  TrackerServer.prototype.handleHello = function handleHello(sock, msg, cb) {
    var message = new Peeracle.TrackerMessage({
      type: Peeracle.TrackerMessage.MessageType.Welcome,
      id: uuid.v4()
    });
    var bytes = message.serialize();
    sock.id = message.props.id;
    sock.hashes = [];
    sock.send(new Buffer(bytes), cb);
  };

  TrackerServer.prototype.handleAnnounce =
    function handleAnnounce(sock, msg, cb) {
      this.addPeerToHash(sock, msg.props.hash, msg.props.got);
      cb(null);
    };

  TrackerServer.prototype.handleDenounce =
    function handleDenounce(sock, msg, cb) {
      var index;

      this.removePeerFromHash(sock, msg.props.hash);
      index = sock.hashes.indexOf(msg.props.hash);
      if (index === -1) {
        return;
      }

      sock.hashes.splice(index, 1);
      cb(null);
    };

  TrackerServer.prototype.addPeerToHash =
    function addPeerToHash(sock, hash, got) {
      var entry;

      if (!this.hashes.hasOwnProperty(hash)) {
        this.hashes[hash] = {};
      }

      entry = this.hashes[hash];

      if (!entry.hasOwnProperty(sock.id)) {
        entry[sock.id] = {};
      }

      entry[sock.id].got = got;
      sock.hashes.push(hash);

      this.broadcast(new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Enter,
        hash: hash,
        id: sock.id,
        got: got
      }), Object.keys(entry), [sock.id]);
    };

  TrackerServer.prototype.removePeerFromHash =
    function removePeerFromHash(sock, hash) {
      if (!this.hashes.hasOwnProperty(hash)) {
        return;
      }

      if (!this.hashes[hash].hasOwnProperty(sock.id)) {
        return;
      }

      delete this.hashes[hash][sock.id];

      if (!Object.keys(this.hashes[hash]).length) {
        delete this.hashes[hash];
        return;
      }

      this.broadcast(new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Leave,
        hash: hash,
        id: sock.id
      }), Object.keys(this.hashes[hash]), [sock.id]);
    };

  TrackerServer.prototype.broadcast = function broadcast(msg, targets, ignore) {
    var index;
    var count;
    var sock;
    var targetIndex;
    var bytes = msg.serialize();

    count = this.ws.connections.length;
    for (index = 0; index < count; ++index) {
      sock = this.ws.connections[index];
      if (!sock.hasOwnProperty('id') || !sock.id) {
        continue;
      }

      targetIndex = targets.indexOf(sock.id);
      if (targetIndex > -1 && ignore.indexOf(sock.id) === -1) {
        sock.send(new Buffer(bytes));
      }
    }
  };

  return TrackerServer;
})();

module.exports = Peeracle.TrackerServer;
