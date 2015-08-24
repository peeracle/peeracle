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
  SessionHandle: require('./sessionHandle'),
  TrackerClient: require('./trackerClient')
};
// @endexclude

/* eslint-disable */
Peeracle.Session = (function() {
  /* eslint-enable */
  /**
   * @class Session
   * @memberof Peeracle
   * @mixes Peeracle.Listenable
   * @constructor
   * @param {Peeracle.Storage} storage
   */
  function Session(storage) {
    Peeracle.Listenable.call(this);

    this.handles = [];
    this.storage = storage;
    this.trackers = {};
  }

  Session.prototype = Object.create(Peeracle.Listenable.prototype);
  Session.prototype.constructor = Session;

  /**
   * @function Session#addMetadata
   * @param {Peeracle.Metadata} metadata
   * @param {Session~addMetadataCallback} cb
   */
  Session.prototype.addMetadata = function addMetadata(metadata, cb) {
    var handle = new Peeracle.SessionHandle(this, metadata);
    this.handles[metadata.hash] = handle;
    handle.validate(function validateCb(error) {
      if (error) {
        cb(error);
        return null;
      }

      cb(null, handle);
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
      tracker.once('connect', function onConnect(id) {
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

    tracker.on('enter', function onEnter(hash, id, got) {
      if (!_this.handles.hasOwnProperty(hash)) {
        return;
      }
      _this.handles[hash].emit('enter', id, got);
    });

    tracker.on('leave', function onLeave(hash, id) {
      if (!_this.handles.hasOwnProperty(hash)) {
        return;
      }
      _this.handles[hash].emit('leave', id);
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
