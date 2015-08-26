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
    var index;
    var count;
    var metadata = this.metadata;

    this.on('enter', this.onEnter.bind(this));
    this.on('leave', this.onLeave.bind(this));
    this.on('request', this.onRequest.bind(this));
    this.on('chunk', this.onChunk.bind(this));
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
          if ((myGot[gotIndex] & (1 << gotOffset)) &&
            !(theirGot[gotIndex] & (1 << gotOffset))) {
            return true;
          }
          if (++gotOffset >= 32) {
            if (++gotIndex >= theirGot[gotIndex].length &&
              theirGot[gotIndex].length < myGot[gotIndex].length) {
              return true;
            }
            gotOffset = 0;
          }
        }
      }

      return false;
    };

  SessionHandle.prototype.peerHasChunk =
    function peerHasChunk(peer, segment, chunk) {
      var chunkIndex;
      var chunkCount;
      var theirGot = peer ? peer.hashes[this.metadata.hash] : this.got;
      var gotIndex = 0;
      var gotOffset = 0;
      var segments = this.metadata.streams[0].mediaSegments;
      var segmentIndex;
      var segmentCount = segments.length;

      for (segmentIndex = 0; segmentIndex < segmentCount; ++segmentIndex) {
        chunkCount = segments[segmentIndex].chunks.length;
        for (chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
          if (segmentIndex === segment && chunkIndex === chunk) {
            return (theirGot[gotIndex] & (1 << gotOffset));
          }
          if (++gotOffset >= 32) {
            ++gotIndex;
            gotOffset = 0;
          }
        }
      }

      return false;
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

      if (this.peerHasChunk(peer, request.segment, request.chunk)) {
        peer.sendRequest(this.metadata.hash, request.segment, request.chunk);
        peer.request = request;
        request.peer = peer;
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

      if (request.completed === request.length) {
        continue;
      }

      if (request.peer) {
        continue;
      }

      this.processRequest(request);
    }

    this.processLock = false;
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
    if (this.peerMightBeInterested(peer)) {
      peer.sendPoke(this.metadata.hash, this.got);
    }
  };

  SessionHandle.prototype.onLeave = function onLeave() {
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

        peer.sendChunk(_this.metadata.hash, index, chunk, bytes);
      });
  };

  SessionHandle.prototype.onChunk =
    function onChunk(peer, segmentIndex, chunk, offset, bytes) {
      var index;
      var count = this.requests.length;
      var request;
      var received;
      var segment = this.metadata.streams[0].mediaSegments[segmentIndex];

      for (index = 0; index < count; ++index) {
        request = this.requests[index];
        if (request.segment !== segmentIndex || request.chunk !== chunk ||
          request.peer !== peer) {
          continue;
        }

        request.completed += bytes.length;
        request.buffer.set(bytes, request.offset + offset);

        if (request.completed >= request.length) {
          received = this.metadata.checksumAlgorithm.checksum(
            request.buffer.subarray(request.offset, request.offset +
              request.length));
          if (segment.chunks[chunk] !== received) {
            console.log(peer.id, 'invalid checksum');
            request.completed = 0;
          } else {
            if (!this.done.hasOwnProperty('' + request.segment)) {
              this.done['' + request.segment] = [];
            }
            this.done['' + request.segment].push(request);
            this.requests.splice(index, 1);
            if (this.done['' + request.segment].length ===
              segment.chunks.length) {
              request.completeCb(null, request.buffer);
              delete this.done['' + request.segment];
            }
          }
          peer.request = null;
          request.peer = null;
          this.processRequests();
        }
        break;
      }
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
})();

// @exclude
module.exports = Peeracle.SessionHandle;
// @endexclude
