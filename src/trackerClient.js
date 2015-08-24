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
var WebSocket = require('websocket').w3cwebsocket;
var Peeracle = {
  Listenable: require('./listenable'),
  TrackerMessage: require('./trackerMessage')
};
/* eslint-disable */
var window = {
  setInterval: setInterval,
  clearInterval: clearInterval
};
/* eslint-enable */
// @endexclude

/* eslint-disable */
Peeracle.TrackerClient = (function() {
  /* eslint-enable */
  /**
   * @class TrackerClient
   * @memberof Peeracle
   * @mixes Peeracle.Listenable
   * @constructor
   * @param {String} url
   */
  function TrackerClient(url) {
    Peeracle.Listenable.call(this);

    this.ws = null;
    this.url = url;
  }

  TrackerClient.prototype = Object.create(Peeracle.Listenable.prototype);
  TrackerClient.prototype.constructor = TrackerClient;

  TrackerClient.prototype.onOpen = function onOpen() {
    var msg = new Peeracle.TrackerMessage({
      type: Peeracle.TrackerMessage.MessageType.Hello
    });
    var bytes = msg.serialize();
    this.ws.send(bytes);
  };

  TrackerClient.prototype.onMessage = function onMessage(e) {
    var msg = new Peeracle.TrackerMessage();
    var bytes = new Uint8Array(e.data);

    if (!bytes || !bytes.length) {
      return;
    }

    msg.unserialize(bytes);
    this['handle' + Peeracle.TrackerMessage.Types[msg.props.type].name]
      .bind(this)(msg);
  };

  TrackerClient.prototype.onError = function onError() {
  };

  TrackerClient.prototype.onClose = function onClose(e) {
    this.emit('disconnect', e.code, e.reason);
  };

  TrackerClient.prototype.connect = function connect() {
    this.ws = new WebSocket(this.url, 'prcl-0.0.1');
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  };

  TrackerClient.prototype.announce = function announce(hash, got) {
    var msg = new Peeracle.TrackerMessage({
      type: Peeracle.TrackerMessage.MessageType.Announce,
      hash: hash,
      got: got
    });
    var bytes = msg.serialize();
    this.ws.send(bytes);
  };

  TrackerClient.prototype.denounce = function denounce(hash) {
    var msg = new Peeracle.TrackerMessage({
      type: Peeracle.TrackerMessage.MessageType.Denounce,
      hash: hash
    });
    var bytes = msg.serialize();
    this.ws.send(bytes);
  };

  TrackerClient.prototype.handleWelcome = function handleWelcome(msg) {
    this.emit('connect', msg.props.id);
  };

  TrackerClient.prototype.handleEnter = function handleEnter(msg) {
    this.emit('enter', msg.props.hash, msg.props.id, msg.props.got);
  };

  TrackerClient.prototype.handleLeave = function handleLeave(msg) {
    this.emit('leave', msg.props.hash, msg.props.id);
  };

  return TrackerClient;
})();

// @exclude
module.exports = Peeracle.TrackerClient;
// @endexclude
