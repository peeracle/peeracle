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
  DataStream: require('./dataStream')
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

  return Metadata;
})();

// @exclude
module.exports = Peeracle.Metadata;
// @endexclude
