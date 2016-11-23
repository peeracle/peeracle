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

var uuid = require('uuid');
var http = require('http');
var WebSocketServer = require('websocket').server;
var uaparser = require('ua-parser');

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
   * @param {Object} logger
   */
  function TrackerServer(logger) {
    this.server = null;
    this.ws = null;
    this.hashes = {};
    this.logger = logger || {
        log: function log() {
        }
      };
  }

  TrackerServer.prototype.listen = function listen(host, port) {
    var _this = this;
    this.server = http.createServer(function createServer(request, response) {
      response.writeHead(404);
      response.end();
    }).listen(port, host, function httpListen() {
      _this.logger.info('listening on %s:%d', host, parseInt(port, 10));
    });

    this.ws = new WebSocketServer({
      httpServer: this.server,
      autoAcceptConnections: false
    });

    this.ws.on('request', this.incomingRequest.bind(this));
  };

  TrackerServer.prototype.incomingRequest = function incomingRequest(request) {
    var log;
    var sock;

    if (request.requestedProtocols.length !== 1 ||
      request.requestedProtocols[0] !== 'prcl-0.0.1') {
      this.logger.info('rejected %s:%d for invalid protocol',
        request.socket.remoteAddress, request.socket.remotePort);
      return;
    }

    sock = request.accept('prcl-0.0.1', request.origin);
    sock.id = null;
    sock.remoteAddress = sock.socket.remoteAddress;
    sock.remotePort = sock.socket.remotePort;

    this.logger.extend(sock);
    log = sock.log;
    sock.log = function logFn(level) {
      var args = Array.prototype.slice.call(arguments);
      var prefix = '';

      if (this.hasOwnProperty('id') && sock.id !== null) {
        prefix = '[' + this.id + ']';
      } else {
        prefix = '<' + this.remoteAddress + ':' + this.remotePort + '>';
      }
      args.splice(1, 0, prefix);
      if (arguments.length > 1 && level in this) {
        log.apply(this, args);
      }
    };

    sock.on('message', this.onMessage.bind(this, sock));
    sock.on('close', this.onClose.bind(this, sock));

    sock.infos = uaparser.parse(request.httpRequest.headers['user-agent']);
    sock.browser = sock.infos.ua.toString();
    sock.os = sock.infos.os.toString();
    sock.device = sock.infos.device.toString();

    console.log(request.httpRequest.headers['user-agent']);
    this.logger.info('accepted %s:%d from %s (Browser: %s, OS: %s, Device: %s)',
      request.socket.remoteAddress, request.socket.remotePort, request.origin,
      sock.browser, sock.os, sock.device);
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

    if (sock.hasOwnProperty('hashes')) {
      count = sock.hashes.length;
      for (index = 0; index < count; ++index) {
        this.removePeerFromHash(sock, sock.hashes[index]);
      }
      sock.hashes = [];
    }
    sock.log('info', 'connection closed (' + code + ': ' + description + ')');
  };

  TrackerServer.prototype.handleHello = function handleHello(sock, msg, cb) {
    var message = new Peeracle.TrackerMessage({
      type: Peeracle.TrackerMessage.MessageType.Welcome,
      id: uuid.v4()
    });
    var bytes = message.serialize();
    sock.log('info', 'says hello and becomes', message.props.id);
    sock.id = message.props.id;
    sock.hashes = [];
    sock.send(new Buffer(bytes), cb);
  };

  TrackerServer.prototype.handleAnnounce =
    function handleAnnounce(sock, msg, cb) {
      sock.log('info', 'announces', msg.props.hash, 'with got', msg.props.got);
      this.addPeerToHash(sock, msg.props.hash, msg.props.got);
      cb(null);
    };

  TrackerServer.prototype.handlePoke =
    function handlePoke(sock, msg, cb) {
      sock.log('info', 'pokes', msg.props.id, 'on', msg.props.hash, 'with got',
        msg.props.got);
      this.poke(sock, msg.props.id, msg.props.hash, msg.props.got);
      cb(null);
    };

  TrackerServer.prototype.handleDenounce =
    function handleDenounce(sock, msg, cb) {
      var index;

      sock.log('info', 'denounces', msg.props.hash);
      this.removePeerFromHash(sock, msg.props.hash);
      index = sock.hashes.indexOf(msg.props.hash);
      if (index === -1) {
        return;
      }

      sock.hashes.splice(index, 1);
      cb(null);
    };

  TrackerServer.prototype.handleSdp =
    function handleDenounce(sock, msg, cb) {
      var target;
      var entry;

      sock.log('info', 'send SDP', msg.props.sdp, 'to', msg.props.id);

      if (!this.hashes.hasOwnProperty(msg.props.hash)) {
        return;
      }

      entry = this.hashes[msg.props.hash];
      if (!entry.hasOwnProperty(msg.props.id)) {
        return;
      }

      target = msg.props.id;
      msg.props.id = sock.id;
      this.broadcast(msg, [target], []);
      cb(null);
    };

  TrackerServer.prototype.poke = function poke(sock, target, hash, got) {
    var entry;

    if (!this.hashes.hasOwnProperty(hash)) {
      return;
    }

    entry = this.hashes[hash];
    if (!entry.hasOwnProperty(sock.id) || !entry.hasOwnProperty(target)) {
      return;
    }

    this.broadcast(new Peeracle.TrackerMessage({
      type: Peeracle.TrackerMessage.MessageType.Poke,
      hash: hash,
      id: sock.id,
      got: got,
      os: sock.os,
      browser: sock.browser,
      device: sock.device
    }), [target], [sock.id]);
  };

  TrackerServer.prototype.addPeerToHash =
    function addPeerToHash(sock, hash, got) {
      var entry;
      var entries;

      if (!this.hashes.hasOwnProperty(hash)) {
        this.logger.info('created hash', hash);
        this.hashes[hash] = {};
      }

      entry = this.hashes[hash];
      if (!entry.hasOwnProperty(sock.id)) {
        sock.log('info', 'added to', hash);
        entry[sock.id] = {};
      } else {
        sock.log('info', 'updated', hash);
      }

      entry[sock.id].got = got;
      sock.hashes.push(hash);

      entries = Object.keys(entry);
      this.logger.info('broadcast to', entries.length, 'users');
      this.broadcast(new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Enter,
        hash: hash,
        id: sock.id,
        got: got,
        os: sock.os,
        browser: sock.browser,
        device: sock.device
      }), entries, [sock.id]);
    };

  TrackerServer.prototype.removePeerFromHash =
    function removePeerFromHash(sock, hash) {
      var entries;

      if (!this.hashes.hasOwnProperty(hash)) {
        sock.log('info', 'hash', hash, 'does not exist');
        return;
      }

      if (!this.hashes[hash].hasOwnProperty(sock.id)) {
        sock.log('info', 'does not have', hash);
        return;
      }

      this.logger.info('deleted', sock.id, 'from', hash);
      delete this.hashes[hash][sock.id];

      if (!Object.keys(this.hashes[hash]).length) {
        this.logger.info('deleted', hash, 'entirely');
        delete this.hashes[hash];
        return;
      }

      entries = Object.keys(this.hashes[hash]);
      this.logger.info('broadcast to', entries.length, 'users');
      this.broadcast(new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Leave,
        hash: hash,
        id: sock.id
      }), entries, [sock.id]);
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
