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

// @exclude
var Peeracle = {
  Listenable: require('./listenable'),
  PeerMessage: require('./peerMessage'),
  PeerConnection: require('./peerConnection')
};
/* eslint-disable */
var window = {
  setInterval: setInterval,
  clearInterval: clearInterval
};
/* eslint-enable */
// @endexclude

/* eslint-disable */
Peeracle.Peer = (function () {
  /* eslint-enable */
  /**
   * @class Peer
   * @memberof Peeracle
   * @mixes Peeracle.Listenable
   * @constructor
   * @param {String} id
   * @param {Peeracle.TrackerClient} tracker
   * @property {String} id
   * @property {Peeracle.TrackerClient} tracker
   * @property {Object.<String, Array.<Number>>} hashes
   * @property {Peeracle.PeerConnection} connection
   * @property {Request} request
   */
  function Peer(id, tracker) {
    Peeracle.Listenable.call(this);

    this.id = id;
    this.tracker = tracker;
    this.hashes = {};
    this.connection = null;
    this.request = null;
    this.sending = null;
  }

  Peer.prototype = Object.create(Peeracle.Listenable.prototype);
  Peer.prototype.constructor = Peer;

  /**
   * @function Peer#addHash
   * @param {String} hash
   * @param {Array.<Number>} got
   */
  Peer.prototype.addHash = function addHash(hash, got) {
    this.hashes[hash] = got;
  };

  Peer.prototype.removeHash = function removeHash(hash) {
    delete this.hashes[hash];
  };

  Peer.prototype.isConnected = function isConnected() {
    if (!this.connection) {
      return false;
    }

    return this.connection.state === Peeracle.PeerConnection.State.Connected;
  };

  Peer.prototype.isConnecting = function isConnecting() {
    if (!this.connection) {
      return false;
    }

    return this.connection.state === Peeracle.PeerConnection.State.Connecting;
  };

  Peer.prototype.close = function close() {
    if (!this.connection) {
      return;
    }

    this.connection.state = Peeracle.PeerConnection.State.Disconnected;
    this.connection.off('icecandidate');
    this.connection.off('request');
    this.connection.off('chunk');
    this.connection.off('disconnect');
    this.connection.close();
  };

  Peer.prototype.onIceCandidate = function onIceCandidate(hash, ice) {
    if (!this.isConnecting() || !ice) {
      this.connection.off('icecandidate');
      return;
    }

    this.tracker.sendSdp(this.id, hash, ice);
  };

  Peer.prototype.onChunk =
    function onChunk(hash, segment, chunk, offset, bytes) {
      this.emit('chunk', hash, segment, chunk, offset, bytes);
    };

  Peer.prototype.onRequest = function onRequest(hash, segment, chunk) {
    this.emit('request', hash, segment, chunk);
  };

  Peer.prototype.onDisconnect = function onDisconnect() {
    this.emit('disconnect');
  };

  Peer.prototype.setupConnection = function setupConnection(hash) {
    if (this.connection) {
      return;
    }

    this.connection = new Peeracle.PeerConnection(this);
    this.connection.on('icecandidate', this.onIceCandidate.bind(this, hash));
    this.connection.on('request', this.onRequest.bind(this));
    this.connection.on('chunk', this.onChunk.bind(this));
    this.connection.on('disconnect', this.onDisconnect.bind(this));
  };

  Peer.prototype.processSdp = function processSdp(sdp, hash) {
    var jsdp = JSON.parse(sdp);
    var _this = this;

    if (!this.connection) {
      this.setupConnection(hash);
    }

    if (jsdp.hasOwnProperty('type') && jsdp.type === 'offer') {
      this.connection.createAnswer(sdp, function onCreateAnswer(error, answer) {
        if (error) {
          return;
        }
        _this.tracker.sendSdp(_this.id, hash, answer);
      });
    } else if (jsdp.hasOwnProperty('type') && jsdp.type === 'answer') {
      this.connection.setAnswer(sdp, function onSetAnswer() {
      });
    } else if (jsdp.hasOwnProperty('candidate') &&
      jsdp.hasOwnProperty('sdpMid') && jsdp.hasOwnProperty('sdpMLineIndex')) {
      this.connection.addICECandidate(sdp, function onAddICECandidate() {
      });
    }
  };

  Peer.prototype.sendStop = function sendStop() {
    var _this = this;
    var msg = new Peeracle.PeerMessage({
      type: Peeracle.PeerMessage.MessageType.Stop
    });

    if (!this.connection || !this.isConnected()) {
      return;
    }

    _this.connection.send(msg);
  };

  Peer.prototype.sendRequest = function sendRequest(hash, segment, chunk) {
    var _this = this;
    var msg = new Peeracle.PeerMessage({
      type: Peeracle.PeerMessage.MessageType.Request,
      hash: hash,
      segment: segment,
      chunk: chunk
    });

    if (!this.connection) {
      this.setupConnection(hash);
    }

    if (!this.isConnected() && !this.isConnecting()) {
      this.connection.once('connect', function onceConnect() {
        _this.connection.send(msg);
      });
      this.connection.createOffer(function onCreateOffer(error, sdp) {
        if (error) {
          return;
        }

        _this.tracker.sendSdp(_this.id, hash, sdp);
      });
    } else if (this.isConnected()) {
      _this.connection.send(msg);
    }
  };

  Peer.prototype.sendPoke = function sendPoke(hash, got) {
    this.tracker.sendPoke(this.id, hash, got);
  };

  Peer.prototype.sendChunk = function sendChunk(hash, index, chunk, bytes) {
    var _this = this;
    var offset = 0;
    var chunkSize = 16383 - ((hash.length + 1) + (4 * 4));
    var msg = new Peeracle.PeerMessage({
      type: Peeracle.PeerMessage.MessageType.Chunk,
      hash: hash,
      segment: index,
      chunk: chunk,
      offset: offset,
      bytes: null
    });

    if (this.sending) {
      console.log('already sending something to', this.id, ', clearing');
      window.clearInterval(this.sending);
    }

    this.sending = window.setInterval(function sendIt() {
      if (!_this.connection ||
        _this.connection.state !== Peeracle.PeerConnection.State.Connected) {

        console.log('peer not connected', _this.connection ? _this.connection.state : undefined );
        window.clearInterval(_this.sending);
        _this.sending = null;
        return;
      }

      if (_this.connection.cancelling) {
        console.log('Stop requested');
        _this.connection.cancelling = false;
        window.clearInterval(_this.sending);
        _this.sending = null;
        return;
      }

      if (_this.connection.dataChannel.bufferedAmount > 0) {
        console.log('buffered amount, waiting');
        return;
      }

      msg.props.offset = offset;
      msg.props.bytes = bytes.subarray(msg.props.offset,
        msg.props.offset + chunkSize);
      offset += msg.props.bytes.length;
      _this.connection.send(msg);

      console.log('sending chunk now');
      _this.emit('sending', hash, index, chunk,
        msg.props.bytes.length, offset, bytes.length);

      if (offset >= bytes.length) {
        window.clearInterval(_this.sending);
        _this.sending = null;
        _this.emit('sent', hash, index, chunk, bytes.length);
        console.log('sent chunk');
      }
    }, 0);
  };

  return Peer;
})();

// @exclude
module.exports = Peeracle.Peer;
// @endexclude
