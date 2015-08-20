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
var Peeracle = {};
// @endexclude

/* eslint-disable */

Peeracle.Media = (function () {
  /**
   * @interface Media
   * @memberof {Peeracle}
   * @property {Object.<String, Number>} cues;
   * @property {Array.<MediaTrack>} tracks;
   * @property {Number} timecodeScale;
   * @property {Number} duration;
   * @property {String} mimeType;
   */
  /* istanbul ignore next */
  function Media() {
  }

  /**
   * @function Media#loadFromDataStream
   * @param {DataStream} dataStream
   * @param {Media~loadFromDataStreamCallback} cb
   * @return {?Media}
   */
  Media.loadFromDataStream = function loadFromDataStream(dataStream, cb) {
    var i = 0;
    var mediaInstance;
    var mediaFormats = ['ISOBMFFMedia', 'WebMMedia'];
    var mediaFormat = mediaFormats[i];

    // @exclude
    Peeracle.ISOBMFFMedia = require('./isobmffMedia');
    Peeracle.WebMMedia = require('./webmMedia');
    // @endexclude

    mediaInstance = Peeracle[mediaFormat].loadFromDataStream(dataStream,
      function loadFromDataStreamCallback(error, instance) {
        if (!error) {
          cb(null, instance);
          return;
        }

        if (++i < mediaFormats.length) {
          mediaFormat = mediaFormats[i];
          mediaInstance = Peeracle[mediaFormat].loadFromDataStream(dataStream,
            loadFromDataStreamCallback);
          return;
        }

        cb(new Error('Unknown media format'));
      });
  };

  /**
   * @function Media#getInitSegment
   * @param {Media~segmentCallback} cb
   * @return {?Media}
   */
  Media.prototype.getInitSegment = function getInitSegment(cb) {
  };

  /**
   * @function Media#getMediaSegment
   * @param {Number} timecode
   * @param {Media~segmentCallback} cb
   * @return {?Media}
   */
  Media.prototype.getMediaSegment = function getMediaSegment(timecode, cb) {
  };

  /**
   * @callback Media~loadFromDataStreamCallback
   * @param {Error} error
   * @param {Media} instance
   */

  /**
   * Callback function for segment callbacks.
   * @callback Media~segmentCallback
   * @param {Error} error
   * @param {Uint8Array} bytes
   */

  /**
   * @typedef {Object} MediaTrack
   * @property {Number} id
   * @property {Number} type
   * @property {String} codec
   * @property {Number} width
   * @property {Number} height
   * @property {Number} samplingFrequency
   * @property {Number} channels
   * @property {Number} bitDepth
   */

  return Media;
})();

// @exclude
module.exports = Peeracle.Media;
// @endexclude
