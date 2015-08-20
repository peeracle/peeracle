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
Peeracle.MetadataStream = (function () {
  /* eslint-enable */
  /**
   * @class MetadataStream
   * @memberof {Peeracle}
   * @param {Media} media
   * @param {Uint8Array} bytes
   *
   * @property {Media} media
   * @property {Number} type
   * @property {String} mimeType
   * @property {Number} bandwidth
   * @property {Number} width
   * @property {Number} height
   * @property {Number} numChannels
   * @property {Number} samplingFrequency
   * @property {Uint8Array} initSegment
   * @property {Number} initSegmentLength
   * @property {Number} chunkSize
   * @property {Object} mediaSegments
   * @constructor
   */
  function MetadataStream(media, bytes) {
    var index;
    var count;
    var track;

    this.media = media;
    this.mimeType = media.mimeType;
    this.bandwidth = 0;
    this.initSegment = bytes;
    this.initSegmentLength = bytes.length;
    this.chunkSize = 0;
    this.mediaSegments = [];

    for (index = 0, count = media.tracks.length; index < count; ++index) {
      track = media.tracks[index];

      if ((track.type === 1 || track.type === 2) &&
        (this.type === 1 || this.type === 2) && this.type !== track.type) {
        this.type = 4;
      } else {
        this.type = track.type;
      }
      this.width = track.width !== -1 ? track.width : this.width;
      this.height = track.height !== -1 ? track.height : this.height;
      this.numChannels = track.channels !== -1 ?
        track.channels : this.numChannels;
      this.samplingFrequency = track.samplingFrequency !== -1 ?
        track.samplingFrequency : this.samplingFrequency;
    }
  }

  /**
   * @function MetadataStream#addMediaSegments
   * @throws {TypeError}
   */
  MetadataStream.prototype.addMediaSegments = function addMediaSegments(cb) {
    var _this = this;
    var index = 0;
    var cues = this.media.cues['' + this.media.tracks[0].id];
    var timecodes = Object.keys(cues);
    var count = timecodes.length;

    this.media.getMediaSegment(parseInt(timecodes[index], 10),
      function getMediaSegmentCb(error, bytes) {
        if (error) {
          cb(error);
          return;
        }

        console.log(bytes.length);
        if (++index < count) {
          _this.media.getMediaSegment(parseInt(timecodes[index], 10),
            getMediaSegmentCb);
        }
      });
  };

  /**
   * @function MetadataStream#serialize
   * @param {DataStream} dataStream
   * @return {Number}
   * @throws {TypeError}
   */
  MetadataStream.prototype.serialize = function serialize(dataStream) {
    if (!(dataStream instanceof Peeracle.DataStream)) {
      throw new TypeError('argument must be a DataStream');
    }

    return 0;
  };

  /**
   * @function MetadataStream#unserialize
   * @param {DataStream} dataStream
   * @return {Number}
   * @throws {TypeError}
   */
  MetadataStream.prototype.unserialize = function unserialize(dataStream) {
    if (!(dataStream instanceof Peeracle.DataStream)) {
      throw new TypeError('argument must be a DataStream');
    }

    return 0;
  };

  return MetadataStream;
})();

// @exclude
module.exports = Peeracle.MetadataStream;
// @endexclude
