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
  Peer: require('./peer'),
  SessionHandle: require('./sessionHandle'),
  TrackerClient: require('./trackerClient')
};
// @endexclude

/* eslint-disable */
Peeracle.Session = (function () {
  /* eslint-enable */
  /**
   * @class Session
   * @memberof Peeracle
   * @mixes Peeracle.Listenable
   * @constructor
   * @param {Peeracle.Storage} storage
   * @property {Object.<String, Peeracle.SessionHandle>} handles
   * @property {Peeracle.Storage} storage
   * @property {Object.<String, Peeracle.TrackerClient>} trackers
   * @property {Object.<String, Peeracle.Peer>} peers
   */
  function Session(storage) {
    Peeracle.Listenable.call(this);

    this.handles = {};
    this.storage = storage;
    this.trackers = {};
    this.peers = {};
  }

  Session.prototype = Object.create(Peeracle.Listenable.prototype);
  Session.prototype.constructor = Session;

  /**
   * @function Session#addMetadata
   * @param {Peeracle.Metadata} metadata
   * @param {Session~addMetadataCallback} cb
   */
  Session.prototype.addMetadata = function addMetadata(metadata, cb) {
    var _this = this;
    var got = [];
    var gotIndex = 0;
    var currentGot = 0;
    var stream = metadata.streams[0];
    var index = 0;
    var count = stream.mediaSegments.length;
    var segment;

    if (!count) {
      cb(null, null);
      return;
    }

    segment = stream.mediaSegments[index];
    this.storage.retrieveSegment(metadata.hash, index, 0, segment.length,
      function retrieveSegmentCb(error, bytes) {
        var handle;
        var checksum;
        var chunkIndex;
        var chunkCount = segment.chunks.length;

        if (error) {
          cb(error);
          return;
        }

        if (!bytes) {
          handle = new Peeracle.SessionHandle(_this, metadata, got);
          _this.handles[metadata.hash] = handle;
          cb(null, handle);
          return;
        }

        for (chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
          checksum = metadata.checksumAlgorithm.checksum(
            bytes.subarray(chunkIndex * stream.chunkSize, stream.chunkSize +
              (chunkIndex * stream.chunkSize)));
          if (checksum === segment.chunks[chunkIndex]) {
            currentGot += (1 << gotIndex);
          }

          if (++gotIndex === 32) {
            gotIndex = 0;
            got.push(currentGot);
            currentGot = 0;
          }
        }

        if (++index < count) {
          segment = stream.mediaSegments[index];
          _this.storage.retrieveSegment(metadata.hash, index, 0, segment.length,
            retrieveSegmentCb);
        } else {
          if (gotIndex < 32) {
            got.push(currentGot);
          }

          handle = new Peeracle.SessionHandle(_this, metadata, got);
          _this.handles[metadata.hash] = handle;
          cb(null, handle);
        }
      });
  };

  /**
   * @function Session#announce
   * @param {String} url
   * @param {String} hash
   * @param {Array.<Number>} got
   */
  Session.prototype.announce = function announce(url, hash, got) {
    var tracker;
    var lowerUrl = url.toLowerCase();

    if (!this.trackers.hasOwnProperty(lowerUrl)) {
      tracker = new Peeracle.TrackerClient(lowerUrl);
      this.setupTracker(tracker);
      this.trackers[lowerUrl] = tracker;
      tracker.once('connect', function onConnect() {
        tracker.announce(hash, got);
      });
      tracker.connect();
      return;
    }

    tracker = this.trackers[lowerUrl];
    tracker.announce(hash, got);
  };

  Session.prototype.denounce = function denounce(url, hash) {
    var tracker;
    var lowerUrl = url.toLowerCase();

    if (!this.trackers.hasOwnProperty(lowerUrl)) {
      return;
    }

    tracker = this.trackers[lowerUrl];
    tracker.denounce(hash);
  };

  Session.prototype.onPeerRequest =
    function onPeerRequest(hash, peer, segment, chunk) {
      this.handles[hash].emit('request', peer, segment, chunk);
    };

  Session.prototype.onPeerChunk =
    function onPeerChunk(hash, peer, segment, chunk, offset, bytes) {
      this.handles[hash].emit('chunk', peer, segment, chunk, offset, bytes);
    };

  Session.prototype.onPeerDisconnect =
    function onPeerDisconnect(peer) {
      var index;
      var hashes;
      var count;

      if (!this.peers.hasOwnProperty(peer.id)) {
        return;
      }

      hashes = Object.keys(this.peers[peer.id].hashes);
      count = hashes.length;

      peer.close();

      for (index = 0; index < count; ++index) {
        if (!this.handles.hasOwnProperty(hashes[index])) {
          continue;
        }

        this.handles[hashes[index]].emit('leave', peer);
      }

      delete this.peers[peer.id];
    };

  Session.prototype.initPeer = function initPeer(id, tracker) {
    var _this = this;

    var peer = new Peeracle.Peer(id, tracker);
    peer.on('request', function onRequest(hash, segment, chunk) {
      _this.onPeerRequest(hash, peer, segment, chunk);
    });
    peer.on('chunk', function onChunk(hash, segment, chunk, offset, bytes) {
      _this.onPeerChunk(hash, peer, segment, chunk, offset, bytes);
    });
    peer.on('disconnect', function onDisconnect() {
      _this.onPeerDisconnect(peer);
    });

    return peer;
  };

  /**
   * @function Session#setupTracker
   * @param {Peeracle.TrackerClient} tracker
   */
  Session.prototype.setupTracker = function setupTracker(tracker) {
    var _this = this;

    tracker.on('connect', function onConnect(id) {
      _this.emit('connect', tracker.url, id);
    });

    tracker.on('disconnect', function onDisconnect(code, reason) {
      _this.emit('disconnect', tracker.url, code, reason);
    });

    tracker.on('enter', function onEnter(hash, id, got, os, browser, device) {
      var peer;
      var isUpdating = false;

      if (!_this.handles.hasOwnProperty(hash)) {
        return;
      }

      if (!_this.peers.hasOwnProperty(id)) {
        _this.peers[id] = _this.initPeer(id, tracker);
        _this.peers[id].browser = browser;
        _this.peers[id].os = os;
        _this.peers[id].device = device;
      }

      peer = _this.peers[id];

      isUpdating = peer.hashes.hasOwnProperty(hash);
      peer.addHash(hash, got);

      if (!isUpdating) {
        _this.handles[hash].emit('enter', peer);
      }
    });

    tracker.on('leave', function onLeave(hash, id) {
      var peer;

      if (!_this.handles.hasOwnProperty(hash)) {
        return;
      }

      if (!_this.peers.hasOwnProperty(id)) {
        return;
      }

      peer = _this.peers[id];
      peer.removeHash(hash);

      _this.handles[hash].emit('leave', peer);
    });

    tracker.on('sdp', function onSdp(hash, id, sdp) {
      if (!_this.handles.hasOwnProperty(hash)) {
        return;
      }
      if (!_this.peers.hasOwnProperty(id)) {
        _this.peers[id] = _this.initPeer(id, tracker);
      }
      _this.peers[id].processSdp(sdp, hash);
    });
  };

  /**
   * @callback Session~addMetadataCallback
   * @param {Error} error
   * @param {Peeracle.SessionHandle} handle
   */

  return Session;
})();

// @exclude
module.exports = Peeracle.Session;
// @endexclude


