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
  DataStream: require('./dataStream'),
  MetadataStream: require('./metadataStream'),
  Media: require('./media')
};
// @endexclude

/* eslint-disable */
Peeracle.Metadata = (function() {
  /* eslint-enable */
  /**
   * @class Metadata
   * @memberof {Peeracle}
   * @constructor
   * @property {Number} version
   * @property {String} checksumAlgorithm
   * @property {Number} timecodeScale
   * @property {Number} duration
   * @property {Array.<String>} trackerUrls
   * @property {Array.<MetadataStream>} streams
   */
  function Metadata() {
    this.version = 0;
    this.checksumAlgorithm = '';
    this.timecodeScale = 0;
    this.duration = 0;
    this.trackerUrls = [];
    this.streams = [];
  }

  /**
   * @function Metadata#addMedia
   * @param {Media} media
   * @param {Metadata~genericCallback} cb
   */
  Metadata.prototype.addMedia = function addMedia(media, cb) {
    var _this = this;

    if (!(media instanceof Peeracle.Media)) {
      cb(new TypeError('argument must be a Media'));
      return;
    }

    media.getInitSegment(function getInitSegmentCb(error, bytes) {
      var stream;

      if (error) {
        cb(error);
        return;
      }

      _this.timecodeScale = media.timecodeScale;
      _this.duration = media.duration;

      stream = new Peeracle.MetadataStream(media, bytes);
      stream.addMediaSegments(function addMediaSegmentsCb(err) {
        if (err) {
          cb(err);
          return;
        }

        _this.streams.push(stream);
      });
    });
  };

  /**
   * @function Metadata#addTrackerUrl
   * @param {String} url
   */
  Metadata.prototype.addTrackerUrl = function addTrackerUrl(url) {
    var lowerCaseUrl = url.toLowerCase();

    if (lowerCaseUrl in this.trackerUrls) {
      return;
    }

    this.trackerUrls.push(lowerCaseUrl);
  };

  /**
   * @function Metadata#serialize
   * @param {DataStream} dataStream
   * @return {Number}
   * @throws {TypeError}
   */
  Metadata.prototype.serialize = function serialize(dataStream) {
    if (!(dataStream instanceof Peeracle.DataStream)) {
      throw new TypeError('argument must be a DataStream');
    }

    return 0;
  };

  /**
   * @function Metadata#unserialize
   * @param {DataStream} dataStream
   * @return {Number}
   * @throws {TypeError}
   */
  Metadata.prototype.unserialize = function unserialize(dataStream) {
    if (!(dataStream instanceof Peeracle.DataStream)) {
      throw new TypeError('argument must be a DataStream');
    }

    return 0;
  };

  /**
   * Generic callback function taking an error as the only argument.
   * @callback Metadata~genericCallback
   * @param {Error} error
   */

  return Metadata;
})();

// @exclude
module.exports = Peeracle.Metadata;
// @endexclude
