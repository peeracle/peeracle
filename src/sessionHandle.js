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
  Listenable: require('./listenable')
};
/* eslint-disable */
var window = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};
/* eslint-enable */
// @endexclude

/* eslint-disable */
Peeracle.SessionHandle = (function () {
  /* eslint-enable */
  /**
   * @class SessionHandle
   * @memberof Peeracle
   * @mixes Peeracle.Listenable
   * @constructor
   * @param {Peeracle.Session} session
   * @param {Peeracle.Metadata} metadata
   * @param {Array.<Number>} got
   * @property {Array.<Number>} got
   * @property {Peeracle.Metadata} metadata
   * @property {Peeracle.Session} session
   * @property {Array.<Request>} requests
   * @property {Object.<String, Number>} done
   * @property {Boolean} processLock
   */
  function SessionHandle(session, metadata, got) {
    Peeracle.Listenable.call(this);

    this.got = got;
    this.metadata = metadata;
    this.session = session;
    this.requests = [];
    this.done = {};
    this.processLock = false;
  }

  SessionHandle.prototype = Object.create(Peeracle.Listenable.prototype);
  SessionHandle.prototype.constructor = SessionHandle;

  /**
   * @function SessionHandle#start
   */
  SessionHandle.prototype.start = function start() {
    this.on('enter', this.onEnter.bind(this));
    this.on('leave', this.onLeave.bind(this));
    this.on('request', this.onRequest.bind(this));
    this.on('chunk', this.onChunk.bind(this));
    this.announce();
  };

  SessionHandle.prototype.announce = function announce() {
    var index;
    var count;
    var metadata = this.metadata;

    count = metadata.trackerUrls.length;
    for (index = 0; index < count; ++index) {
      this.session.announce(metadata.trackerUrls[index], metadata.hash,
        this.got);
    }
  };

  /**
   * @function SessionHandle#stop
   */
  SessionHandle.prototype.stop = function stop() {
    var index;
    var count;
    var metadata = this.metadata;

    this.off('enter');
    this.off('leave');
    this.off('request');
    this.off('chunk');
    count = metadata.trackerUrls.length;
    for (index = 0; index < count; ++index) {
      this.session.denounce(metadata.trackerUrls[index], metadata.hash);
    }
  };

  /**
   * @function SessionHandle#validate
   * @param {SessionHandle~validateCallback} cb
   */
  SessionHandle.prototype.validate = function validate(cb) {
    cb(null);
  };

  SessionHandle.prototype.peerMightBeInterested =
    function peerMightBeInterested(peer) {
      var chunkIndex;
      var chunkCount;
      var myGot = this.got;
      var theirGot = peer.hashes[this.metadata.hash];
      var gotIndex = 0;
      var gotOffset = 0;
      var segments = this.metadata.streams[0].mediaSegments;
      var segmentIndex;
      var segmentCount = segments.length;

      for (segmentIndex = 0; segmentIndex < segmentCount; ++segmentIndex) {
        chunkCount = segments[segmentIndex].chunks.length;
        for (chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
          if ((myGot[gotIndex] & (1 << gotOffset)) && !(theirGot[gotIndex] & (1 << gotOffset))) {
            return true;
          }
          if (++gotOffset >= 32) {
            ++gotIndex;
            if (!theirGot[gotIndex] && myGot[gotIndex]) {
              return true;
            }
            gotOffset = 0;
          }
        }
      }

      return false;
    };

  SessionHandle.prototype.findGotIndex = function findGotIndex(segment, chunk) {
    var chunkIndex;
    var chunkCount;
    var gotIndex = 0;
    var gotOffset = 0;
    var segments = this.metadata.streams[0].mediaSegments;
    var segmentIndex;
    var segmentCount = segments.length;

    for (segmentIndex = 0; segmentIndex < segmentCount; ++segmentIndex) {
      chunkCount = segments[segmentIndex].chunks.length;
      for (chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
        if (segmentIndex === segment && chunkIndex === chunk) {
          return {
            index: gotIndex,
            offset: gotOffset
          };
        }
        if (++gotOffset >= 32) {
          ++gotIndex;
          gotOffset = 0;
        }
      }
    }
    return null;
  };

  SessionHandle.prototype.updateGot =
    function updateGot(got, segment, chunk, value) {
      var result = this.findGotIndex(segment, chunk);

      if (value) {
        got[result.index] |= (1 << result.offset);
      } else {
        got[result.index] &= ~(1 << result.offset);
      }
    };

  SessionHandle.prototype.checkGot =
    function checkGot(got, segment, chunk) {
      var result = this.findGotIndex(segment, chunk);
      return (got[result.index] & (1 << result.offset));
    };

  SessionHandle.prototype.requestTimeout =
    function requestTimeout(request) {
      console.log('peer', request.peer.id, 'timeout on', request.segment,
        request.chunk);
      request.peer.request = null;
      request.peer = null;
      window.clearTimeout(request.timeout);
      request.timeout = null;
      request.completed = 0;
      this.processRequests();
    };

  /**
   *
   * @param {Request} request
   * @returns {Peeracle.SessionHandle}
   */
  SessionHandle.prototype.processRequest = function processRequest(request) {
    var index;
    var peer;
    var ids = Object.keys(this.session.peers);
    var count = ids.length;

    for (index = 0; index < count; ++index) {
      peer = this.session.peers[ids[index]];
      if (!peer.hashes.hasOwnProperty(this.metadata.hash) || peer.request) {
        continue;
      }

      if (this.checkGot(peer.hashes[this.metadata.hash], request.segment,
          request.chunk)) {
        peer.sendRequest(this.metadata.hash, request.segment, request.chunk);
        peer.request = request;
        request.peer = peer;
        request.timeout = window.setTimeout(this.requestTimeout.bind(this,
          request), 1000);
        break;
      }
    }
  };

  SessionHandle.prototype.processRequests = function processRequests() {
    var index;
    var count;
    var request;

    if (this.processLock) {
      return;
    }

    this.processLock = true;
    count = this.requests.length;
    for (index = 0; index < count; ++index) {
      request = this.requests[index];

      if (request.completed === request.length || request.peer) {
        continue;
      }

      this.processRequest(request);
    }

    this.processLock = false;
  };

  SessionHandle.prototype.stopRequests = function stopRequests() {
    var index;
    var peer;
    var peers = [];
    var count = this.requests.length;

    for (index = 0; index < count; ++index) {
      peer = this.requests[index].peer;

      if (!peer) {
        continue;
      }

      if (peers.indexOf(peer) === -1) {
        peers.push(peer);
      }

      window.clearTimeout(this.requests[index].timeout);
      this.requests[index].timeout = null;
      this.requests[index].peer = null;
    }

    this.requests = [];
    count = peers.length;
    for (index = 0; index < count; ++index) {
      peer = peers[index];
      peer.request = null;
    }
  };

  SessionHandle.prototype.retrieveMediaSegment =
    function retriveMediaSegment(index, cb) {
      var _this = this;
      var stream = this.metadata.streams[0];
      var segment = stream.mediaSegments[index];

      this.session.storage.retrieveSegment(this.metadata.hash, index, 0,
        segment.length, function retrieveSegment(error, bytes) {
          var buffer;
          var chunkIndex;
          var count = segment.chunks.length;
          var length = stream.chunkSize;
          var offset = 0;

          if (!error && bytes) {
            cb(null, bytes);
            return;
          }

          buffer = new Uint8Array(segment.length);
          for (chunkIndex = 0; chunkIndex < count; ++chunkIndex) {
            if (chunkIndex + 1 === count) {
              length = stream.chunkSize - ((stream.chunkSize * count) -
                segment.length);
            }
            _this.requests.push({
              segment: index,
              chunk: chunkIndex,
              buffer: buffer,
              offset: offset,
              length: length,
              completed: 0,
              peer: null,
              timeout: null,
              completeCb: cb
            });
            offset += length;
          }

          _this.processRequests();
        });
    };

  /**
   * @function SessionHandle#onEnter
   */
  SessionHandle.prototype.onEnter = function onEnter(peer) {
    this.processRequests();
    if (!peer.isConnected() && !peer.isConnecting() &&
      this.peerMightBeInterested(peer)) {
      peer.sendPoke(this.metadata.hash, this.got);
    }
  };

  SessionHandle.prototype.onLeave = function onLeave(peer) {
    var index;
    var count = this.requests.length;
    var request;

    for (index = 0; index < count; ++index) {
      request = this.requests[index];
      if (request.peer === peer) {
        window.clearTimeout(request.timeout);
        request.timeout = null;
        request.peer = null;
      }
    }

    this.processRequests();
  };

  SessionHandle.prototype.onRequest = function onRequest(peer, index, chunk) {
    var _this = this;
    var stream = this.metadata.streams[0];
    var segment = stream.mediaSegments[index];
    var chunkSize = stream.chunkSize;

    if (chunk + 1 === segment.chunks.length) {
      chunkSize -= ((stream.chunkSize * segment.chunks.length) -
      segment.length);
    }

    this.session.storage.retrieveSegment(this.metadata.hash, index,
      chunk * stream.chunkSize, chunkSize,
      function retrieveSegment(error, bytes) {
        if (error || !bytes) {
          return;
        }

        console.log('sending chunk', index, chunk, bytes.length);
        peer.sendChunk(_this.metadata.hash, index, chunk, bytes);
      });
  };

  SessionHandle.prototype.completeRequest =
    function completeRequest(request) {
      var _this = this;
      var received;
      var peer = request.peer;
      var segment = this.metadata.streams[0].mediaSegments[request.segment];

      received = this.metadata.checksumAlgorithm.checksum(
        request.buffer.subarray(request.offset, request.offset +
          request.length));
      if (segment.chunks[request.chunk] !== received) {
        console.log(peer.id, 'invalid checksum');
        request.completed = 0;
        peer.request = null;
        request.peer = null;
        window.clearTimeout(request.timeout);
        request.timeout = null;
        return false;
      }

      if (!this.done.hasOwnProperty('' + request.segment)) {
        this.done['' + request.segment] = [];
      }
      this.done['' + request.segment].push(request);
      this.emit('received', peer, request.segment, request.chunk,
        request.offset, request.length);
      this.updateGot(_this.got, request.segment, request.chunk, 1);
      if (this.done['' + request.segment].length ===
        segment.chunks.length) {
        console.log('segment complete', request.segment);
        this.session.storage.storeSegment(this.metadata.hash,
          request.segment, 0, request.buffer, function storeCb(err) {
            if (err) {
              return;
            }

            _this.announce();
          });
        request.completeCb(null, request.buffer);
        delete this.done['' + request.segment];
      }
      peer.request = null;
      request.peer = null;
      window.clearTimeout(request.timeout);
      request.timeout = null;
      return true;
    };

  SessionHandle.prototype.onChunk =
    function onChunk(peer, segmentIndex, chunk, offset, bytes) {
      var index;
      var count = this.requests.length;
      var completed = [];
      var request;

      for (index = 0; index < count; ++index) {
        request = this.requests[index];
        if (request.segment !== segmentIndex || request.chunk !== chunk ||
          request.peer !== peer) {
          continue;
        }

        window.clearTimeout(request.timeout);
        request.timeout = window.setTimeout(this.requestTimeout.bind(this,
          request), 1000);

        request.completed += bytes.length;
        request.buffer.set(bytes, request.offset + offset);

        if (request.completed < request.length) {
          this.emit('receiving', peer, request.segment, request.chunk,
            bytes.length, request.completed, request.length);
          break;
        }

        console.log('received', peer.id, request.segment, request.chunk);

        if (this.completeRequest(request)) {
          completed.push(index);
        }
        break;
      }

      count = completed.length;
      for (index = 0; index < count; ++index) {
        this.requests.splice(completed[index], 1);
      }

      this.processRequests();
    };

  /**
   * @callback SessionHandle~validateCallback
   * @param {Error} error
   */

  /**
   * @typedef {Object} Request
   * @property {Number} segment
   * @property {Number} chunk
   * @property {Uint8Array} buffer
   * @property {Number} offset
   * @property {Number} length
   * @property {Number} completed
   * @property {Peeracle.Peer} peer
   * @property {Number} timeout
   * @property {Function} completeCb
   */

  return SessionHandle;
})
();

// @exclude
module.exports = Peeracle.SessionHandle;
// @endexclude
