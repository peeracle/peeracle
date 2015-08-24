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
   */
  function SessionHandle(session, metadata) {
    Peeracle.Listenable.call(this);

    this.got = [ 0 ];
    this.metadata = metadata;
    this.session = session;
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

  SessionHandle.prototype.onEnter = function onEnter(id, got) {
  };

  SessionHandle.prototype.onLeave = function onLeave(id) {
  };

  /**
   * @callback SessionHandle~validateCallback
   * @param {Error} error
   */

  return SessionHandle;
})();

// @exclude
module.exports = Peeracle.SessionHandle;
// @endexclude
