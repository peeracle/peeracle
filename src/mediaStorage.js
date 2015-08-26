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
  Storage: require('./storage')
};
// @endexclude

/* eslint-disable */
Peeracle.MediaStorage = (function () {
  /* eslint-enable */
  /**
   * @class MediaStorage
   * @memberof {Peeracle}
   * @constructor
   * @implements {Peeracle.Storage}
   * @param {Peeracle.Metadata} metadata
   * @param {Peeracle.Media} media
   */
  function MediaStorage(metadata, media) {
    this.hash = metadata.hash;
    this.media = media;
  }

  MediaStorage.prototype = Object.create(Peeracle.Storage.prototype);
  MediaStorage.prototype.constructor = MediaStorage;

  /**
   * @function MediaStorage#retrieveSegment
   * @param {String} hash
   * @param {Number} segment
   * @param {Number} offset
   * @param {Number} length
   * @param {Storage~retrieveCallback} cb
   */
  MediaStorage.prototype.retrieveSegment =
    function retrieveSegment(hash, segment, offset, length, cb) {
      var _this = this;

      if (!this.media) {
        cb(null, null);
        return;
      }

      if (hash !== this.hash) {
        cb(new Error('Hash mismatch'));
        return;
      }

      this.media.init(function initCb(error) {
        var timecodes;

        if (error) {
          cb(error);
          return;
        }

        timecodes = Object.keys(_this.media.cues['' + _this.media.tracks[0].id]);
        if (segment < 0 || segment > timecodes.length) {
          cb(null, null);
          return;
        }

        _this.media.getMediaSegment(parseInt(timecodes[segment], 10),
          function getMediaSegmentCb(err, bytes) {
            if (err) {
              cb(err);
              return;
            }

            cb(null, bytes.subarray(offset, offset + length));
          });
      });
    };

  /**
   * @function MediaStorage#storeSegment
   * @param {String} hash
   * @param {Number} segment
   * @param {Number} offset
   * @param {Uint8Array} bytes
   * @param {Storage~storeCallback} cb
   */
  MediaStorage.prototype.storeSegment =
    function storeSegment(hash, segment, offset, bytes, cb) {
      cb(new Error('Unsupported'));
    };

  /**
   * @callback Storage~retrieveCallback
   * @param {Error} error
   * @param {Uint8Array} bytes
   */

  /**
   * @callback Storage~storeCallback
   * @param {Error} error
   * @param {Number} length
   */

  return MediaStorage;
})();

// @exclude
module.exports = Peeracle.MediaStorage;
// @endexclude
