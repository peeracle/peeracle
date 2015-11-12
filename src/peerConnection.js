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
  PeerMessage: require('./peerMessage')
};
// @endexclude

/* eslint-disable */
Peeracle.PeerConnection = (function () {
  // @exclude
  var webrtc = require('webrtc-native');
  var RTCPeerConnection = webrtc.RTCPeerConnection;
  var RTCSessionDescription = webrtc.RTCSessionDescription;
  var RTCIceCandidate = webrtc.RTCIceCandidate;

  if (typeof module === 'undefined') {
    // @endexclude
    var RTCPeerConnection = window.RTCPeerConnection ||
      window.mozRTCPeerConnection || window.webkitRTCPeerConnection ||
      window.msRTCPeerConnection;

    var RTCSessionDescription = window.RTCSessionDescription ||
      window.mozRTCSessionDescription || window.webkitRTCSessionDescription ||
      window.msRTCSessionDescription;

    var RTCIceCandidate = window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate || window.RTCIceCandidate;
    // @exclude
  }
  // @endexclude
  /* eslint-enable */
  /**
   * @class PeerConnection
   * @memberof Peeracle
   * @mixes Peeracle.Listenable
   * @constructor
   * @param {Peeracle.Peer} peer
   * @property {Peeracle.Peer} peer
   * @property {RTCPeerConnection} pc
   * @property {RTCDataChannel} dataChannel
   * @property {Array.<RTCIceCandidate>} iceCandidates
   * @property {Number} state
   */
  function PeerConnection(peer) {
    Peeracle.Listenable.call(this);

    this.peer = peer;
    this.conn = null;
    this.dataChannel = null;
    this.iceCandidates = [];
    this.state = 0;
    this.mediaConstraints = {
      mandatory: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
      }
    };
    this.cancelling = false;
  }

  PeerConnection.prototype = Object.create(Peeracle.Listenable.prototype);
  PeerConnection.prototype.constructor = PeerConnection;

  PeerConnection.STUN = {
    url: 'stun:stun.l.google.com:19302'
  };

  PeerConnection.RTCConfiguration = {
    iceServers: [
      {
        url: 'stun:stun.l.google.com:19302',
        urls: ['stun:stun.l.google.com:19302']
      }
    ]
  };

  PeerConnection.State = {
    Disconnected: 0,
    Connecting: 1,
    Connected: 2
  };

  PeerConnection.prototype.init = function init() {
    console.log('PeerConnection::init');
    this.conn = new RTCPeerConnection(PeerConnection.RTCConfiguration,
      this.mediaConstraints);
    this.conn.onicecandidate = this.onIceCandidate.bind(this);
    this.conn.onsignalingstatechange = this.onSignaling.bind(this);
    this.conn.oniceconnectionstatechange = this.onIceConnection.bind(this);
    this.conn.onicegatheringstatechange = this.onIceGathering.bind(this);
    this.conn.ondatachannel = this.onDataChannel.bind(this);
  };

  PeerConnection.prototype.close = function close() {
    console.log('PeerConnection::close');
    if (this.dataChannel) {
      this.dataChannel.close();
      delete this.dataChannel;
    }

    if (this.conn) {
      this.conn.onicecandidate = null;
      this.conn.onsignalingstatechange = null;
      this.conn.oniceconnectionstatechange = null;
      this.conn.onicegatheringstatechange = null;
      this.conn.ondatachannel = null;
      this.conn.close();
      delete this.conn;
    }
  };

  /**
   * @function PeerConnection#createOffer
   * @param {Function} cb
   */
  PeerConnection.prototype.createOffer = function createOffer(cb) {
    var _this = this;

    console.log('PeerConnection::createOffer');
    this.state = PeerConnection.State.Connecting;

    if (!this.conn) {
      console.log('PeerConnection::createOffer !this.conn');
      this.init();
    }

    this.dataChannel = this.conn.createDataChannel('prcl');
    this.setupDataChannel();
    this.conn.createOffer(function createSuccess(offerSdp) {
      console.log('PeerConnection::createOffer createSuccess');
      _this.conn.setLocalDescription(offerSdp, function setSuccess() {
        console.log('PeerConnection::createOffer setSuccess');
        cb(null, JSON.stringify(offerSdp));
      }, function setFailure(e) {
        console.log('PeerConnection::createOffer setFailure');
        cb(e);
      }, _this.mediaConstraints);
    }, function createFailure(e) {
      console.log('PeerConnection::createOffer createFailure');
      cb(e);
    });
  };

  /**
   * @function PeerConnection#createAnswer
   * @param {String} sdp
   * @param {Function} cb
   */
  PeerConnection.prototype.createAnswer = function createAnswer(sdp, cb) {
    var _this = this;
    var sessionDescription;

    console.log('PeerConnection::createAnswer');
    this.state = PeerConnection.State.Connecting;

    if (!this.conn) {
      console.log('PeerConnection::createAnswer !this.conn');
      this.init();
    }

    try {
      console.log('PeerConnection::createAnswer new RTCSessionDescription');
      sessionDescription = new RTCSessionDescription(JSON.parse(sdp));
    } catch (e) {
      console.log('PeerConnection::createAnswer RTCSessionDescription Exception', e);
      cb(e);
    }

    this.conn.setRemoteDescription(sessionDescription, function successCb() {
      console.log('PeerConnection::createAnswer successCb');
      _this.conn.createAnswer(function createSuccess(answerSdp) {
        console.log('PeerConnection::createAnswer createSuccess');
        _this.conn.setLocalDescription(answerSdp, function setSuccess() {
          console.log('PeerConnection::createAnswer setSuccess');
          cb(null, JSON.stringify(answerSdp));
        }, function setFailure(e) {
          console.log('PeerConnection::createAnswer setFailure 2');
          cb(e);
        }, _this.mediaConstraints);
      }, function createFailure(e) {
        console.log('PeerConnection::createAnswer createFailure');
        cb(e);
      });
    }, function setFailure(e) {
      console.log('PeerConnection::createAnswer setFailure 1');
      cb(e);
    });
  };

  /**
   * @function PeerConnection#setAnswer
   * @param {String} sdp
   * @param {Function} cb
   */
  PeerConnection.prototype.setAnswer = function setAnswer(sdp, cb) {
    var sessionDescription;

    this.state = PeerConnection.State.Connecting;

    if (!this.conn) {
      console.log('PeerConnection::setAnswer !this.conn');
      cb(new Error('Not initialized'));
      return;
    }

    try {
      console.log('PeerConnection::setAnswer new RTCSessionDescription');
      sessionDescription = new RTCSessionDescription(JSON.parse(sdp));
    } catch (e) {
      console.log('PeerConnection::setAnswer RTCSessionDescription Exception', e);
      cb(e);
    }

    this.conn.setRemoteDescription(sessionDescription, function successCb() {
      console.log('PeerConnection::setAnswer setRemoteDescription successCb');
      cb(null);
    }, function failureCb(e) {
      console.log('PeerConnection::setAnswer setRemoteDescription failureCb', e);
      cb(e);
    });
  };

  /**
   * @function PeerConnect#send
   * @param {Peeracle.PeerMessage} msg
   */
  PeerConnection.prototype.send = function send(msg) {
    var bytes = msg.serialize();
    console.log('PeerConnection::send', bytes.length);
    this.dataChannel.send(bytes);
  };

  PeerConnection.prototype.onIceCandidate = function onIceCandidate(sdp) {
    var candidate;

    console.log('PeerConnection::onIceCandidate', sdp);
    if (!sdp.candidate) {
      console.log('PeerConnection::onIceCandidate !sdp.candidate');
      candidate = null;
    } else {
      console.log('PeerConnection::onIceCandidate sdp.candidate');
      candidate = JSON.stringify(sdp.candidate);
    }

    this.emit('icecandidate', candidate);
  };

  PeerConnection.prototype.onSignaling = function onSignaling() {
    console.log('PeerConnection::onSignaling');
  };

  PeerConnection.prototype.onIceConnection = function onIceConnection() {
    console.log('PeerConnection::onIceConnection');
    if (!this.conn) {
      console.log('PeerConnection::onIceConnection !this.conn');
      return;
    }

    if ((this.conn.iceConnectionState === 'disconnected' ||
      this.conn.iceConnectionState === 'closed') &&
      this.state !== PeerConnection.State.Disconnected) {
      console.log('PeerConnection::onIceConnection iceConnectionState === disconnected');
      this.state = PeerConnection.State.Disconnected;
      this.close();
      this.emit('disconnect');
    }
  };

  PeerConnection.prototype.onIceGathering = function onIceGathering() {
    console.log('PeerConnection::onIceGathering');
  };

  PeerConnection.prototype.onDataChannel = function onDataChannel(e) {
    console.log('PeerConnection::onDataChannel', e);
    if (e.channel.label !== 'prcl') {
      console.log('PeerConnection::onDataChannel e.channel.label !== prcl');
      return;
    }

    this.dataChannel = e.channel;
    this.setupDataChannel();
  };

  PeerConnection.prototype.addICECandidate =
    function addICECandidate(sdp, cb) {
      console.log('PeerConnection::addICECandidate');
      this.conn.addIceCandidate(new RTCIceCandidate(JSON.parse(sdp)),
        function successCb() {
          console.log('PeerConnection::addICECandidate successCb');
          cb(true);
        }, function failureCb() {
            console.log('PeerConnection::addICECandidate failureCb');
          cb(false);
        });
    };

  PeerConnection.prototype.setupDataChannel = function setupDataChannel() {
    console.log('PeerConnection::setupDataChannel');
    this.dataChannel.binaryType = 'arraybuffer';
    this.dataChannel.onerror = this.onDataChannelError.bind(this);
    this.dataChannel.onmessage = this.onDataChannelMessage.bind(this);
    this.dataChannel.onopen = this.onDataChannelOpen.bind(this);
    this.dataChannel.onclose = this.onDataChannelClose.bind(this);
  };

  PeerConnection.prototype.onDataChannelError =
    function onDataChannelError() {
      console.log('PeerConnection::onDataChannelError');
    };

  PeerConnection.prototype.onDataChannelMessage =
    function onDataChannelMessage(e) {
      var msg = new Peeracle.PeerMessage();
      var bytes = new Uint8Array(e.data);

      console.log('PeerConnection::onDataChannelMessage', bytes.length);
      if (!bytes || !bytes.length) {
        return;
      }

      msg.unserialize(bytes);
      this['handle' + Peeracle.PeerMessage.Types[msg.props.type].name]
        .bind(this)(msg);
    };

  PeerConnection.prototype.handlePing = function handlePing() {
    console.log('PeerConnection::handlePing');
    if (this.state === PeerConnection.State.Connecting) {
      this.state = PeerConnection.State.Connected;
      this.emit('connect');
    }
  };

  PeerConnection.prototype.handleStop = function handleStop() {
    console.log('PeerConnection::handleStop');
    this.cancelling = true;
  };

  PeerConnection.prototype.handleRequest = function handleRequest(msg) {
    console.log('PeerConnection::handleRequest');
    this.emit('request', msg.props.hash, msg.props.segment, msg.props.chunk);
  };

  PeerConnection.prototype.handleChunk = function handleChunk(msg) {
    console.log('PeerConnection::handleChunk');
    this.emit('chunk', msg.props.hash, msg.props.segment, msg.props.chunk,
      msg.props.offset, msg.props.bytes);
  };

  PeerConnection.prototype.onDataChannelOpen = function onDataChannelOpen() {
    var msg = new Peeracle.PeerMessage({
      type: Peeracle.PeerMessage.MessageType.Ping
    });

    console.log('PeerConnection::onDataChannelOpen');
    this.state = PeerConnection.State.Connecting;
    this.send(msg);
  };

  PeerConnection.prototype.onDataChannelClose = function onDataChannelClose() {
    console.log('PeerConnection::onDataChannelClose');
    if (this.state !== PeerConnection.State.Disconnected) {
      this.state = PeerConnection.State.Disconnected;
      this.emit('disconnect');
    }
  };

  return PeerConnection;
})();

// @exclude
module.exports = Peeracle.PeerConnection;
// @endexclude
