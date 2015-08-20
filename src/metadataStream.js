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
  Hash: require('./hash')
};
// @endexclude

/* eslint-disable */
Peeracle.MetadataStream = (function () {
  /* eslint-enable */
  /**
   * @class MetadataStream
   * @memberof {Peeracle}
   * @param {String} checksumAlgorithmName
   * @param {Media} media
   * @param {Uint8Array} bytes
   *
   * @property {String} checksumAlgorithmName
   * @property {Hash} checksumAlgorithm
   * @property {Media} media
   * @property {Number} type
   * @property {String} mimeType
   * @property {Number} bandwidth
   * @property {Number} width
   * @property {Number} height
   * @property {Number} numChannels
   * @property {Number} samplingFrequency
   * @property {Uint8Array} initSegment
   * @property {Number} chunkSize
   * @property {Array.<MetadataMediaSegment>} mediaSegments
   * @property {Number} averageSize
   * @constructor
   */
  function MetadataStream(checksumAlgorithmName, media, bytes) {
    var index;
    var count;
    var track;

    this.checksumAlgorithmName = checksumAlgorithmName;
    this.checksumAlgorithm = Peeracle.Hash.create(this.checksumAlgorithmName);
    if (!this.checksumAlgorithm) {
      throw new Error('Invalid checksum algorithm');
    }
    this.media = media;
    this.mimeType = media.mimeType;
    this.bandwidth = 0;
    this.initSegment = bytes;
    this.chunkSize = 0;
    this.mediaSegments = [];
    this.streamSize = 0;

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

  MetadataStream.HEADER_FIELDS = [
    {name: 'type', type: 'Byte'},
    {name: 'mimeType', type: 'String'},
    {name: 'bandwidth', type: 'UInteger'},
    {name: 'width', type: 'Integer'},
    {name: 'height', type: 'Integer'},
    {name: 'numChannels', type: 'Integer'},
    {name: 'samplingFrequency', type: 'Integer'},
    {name: 'chunkSize', type: 'Integer'}
    // {name: 'initSegmentLength', type: 'UInteger'},
    // {name: 'initSegment', type: 'Bytes'},
    // {name: 'mediaSegmentsCount', type: 'UInteger'},
    // {name: 'mediaSegments', type: 'MediaSegment'},
  ];

  MetadataStream.MEDIASEGMENT_FIELDS = [
    {name: 'timecode', type: 'UInteger'},
    {name: 'length', type: 'UInteger'}
    // {name: 'chunkCount', type: 'UInteger'},
    // {name: 'chunks', type: 'chunks'},
  ];

  /**
   * @function MetadataStream#addMediaSegments
   */
  MetadataStream.prototype.addMediaSegments = function addMediaSegments(cb) {
    var _this = this;
    var index = 0;
    var cues = this.media.cues['' + this.media.tracks[0].id];
    var timecodes = Object.keys(cues);
    var count = timecodes.length;
    var timecode = parseInt(timecodes[index], 10);

    this.calculateStreamSize_(cues);
    this.media.getMediaSegment(timecode,
      function getMediaSegmentCb(error, bytes) {
        /** @type {MetadataMediaSegment} */
        var mediaSegment = {};

        if (error) {
          cb(error);
          return;
        }

        mediaSegment.timecode = timecode;
        mediaSegment.length = bytes.length;
        mediaSegment.chunks = _this.chunkBytes_(bytes);

        _this.mediaSegments.push(mediaSegment);

        if (++index < count) {
          timecode = parseInt(timecodes[index], 10);
          _this.media.getMediaSegment(timecode,
            getMediaSegmentCb);
        } else {
          cb(null);
        }
      });
  };

  /**
   * @function MetadataStream#calculateStreamSize_
   * @param {Object.<String, Number>} cues
   */
  MetadataStream.prototype.calculateStreamSize_ =
    function calculateStreamSize_(cues) {
      var index;
      var currentOffset;
      var previousOffset = 0;
      var timecodes = Object.keys(cues);
      var count = timecodes.length;

      for (index = 0; index < count; ++index) {
        currentOffset = cues[timecodes[index]];
        this.streamSize += currentOffset - previousOffset;
        previousOffset = currentOffset;
      }

      for (index = 15; index < 20; ++index) {
        this.chunkSize = Math.pow(2, index);
        count = Math.ceil((this.streamSize + this.chunkSize - 1) /
          this.chunkSize);
        if (count < 255) {
          break;
        }
      }
    };

  /**
   * @function MetadataStream#chunkBytes_
   * @param {Uint8Array} bytes
   * @return {Array.<String>}
   * @private
   */
  MetadataStream.prototype.chunkBytes_ = function chunkBytes(bytes) {
    var index = 0;
    var length = bytes.length;
    var chunks = [];
    var chunk;
    var checksum;

    while (index < length) {
      chunk = bytes.subarray(index, index + this.chunkSize);
      checksum = this.checksumAlgorithm.checksum(chunk);
      chunks.push(checksum);
      index += chunk.length;
    }

    return chunks;
  };

  /**
   * @function MetadataStream#serializeChunks_
   * @param {Array.<Uint8Array>} chunks
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   */
  MetadataStream.prototype.serializeChunks_ =
    function serializeChunks_(chunks, dataStream, cb) {
      var _this = this;
      var index = 0;
      var count = chunks.length;

      dataStream.writeUInteger(count, function writeChunksCount(error) {
        var chunk;

        if (error) {
          cb(error);
          return;
        }

        chunk = chunks[index];
        _this.checksumAlgorithm.constructor.serialize(chunk, dataStream,
          function writeChunkCb(err) {
            if (err) {
              cb(err);
              return;
            }

            if (++index < count) {
              chunk = chunks[index];
              _this.checksumAlgorithm.constructor.serialize(chunk, dataStream,
                writeChunkCb);
            } else {
              cb(null);
            }
          });
      });
    };

  /**
   * @function MetadataStream#serializeMediaSegments_
   * @param {MetadataMediaSegment} mediaSegment
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   */
  MetadataStream.prototype.serializeMediaSegment_ =
    function serializeMediaSegment_(mediaSegment, dataStream, cb) {
      var field;
      var index = 0;
      var length = MetadataStream.MEDIASEGMENT_FIELDS.length;
      var _this = this;

      field = MetadataStream.MEDIASEGMENT_FIELDS[index];
      dataStream['write' + field.type](mediaSegment[field.name],
        function writeCb(error) {
          if (error) {
            cb(error);
            return;
          }

          if (++index < length) {
            field = MetadataStream.MEDIASEGMENT_FIELDS[index];
            dataStream['write' + field.type](mediaSegment[field.name], writeCb);
          } else {
            _this.serializeChunks_(mediaSegment.chunks, dataStream, cb);
          }
        });
    };

  /**
   * @function MetadataStream#serializeMediaSegments_
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   */
  MetadataStream.prototype.serializeMediaSegments_ =
    function serializeMediaSegments_(dataStream, cb) {
      var _this = this;
      var count = this.mediaSegments.length;
      dataStream.writeUInteger(count,
        function writeMediaSegmentsCountCb(error) {
          var index = 0;
          var mediaSegment;

          if (error) {
            cb(error);
            return;
          }

          mediaSegment = _this.mediaSegments[index];
          _this.serializeMediaSegment_(mediaSegment, dataStream,
            function serializeMediaSegmentCb(err) {
              if (err) {
                cb(err);
                return;
              }

              if (++index < count) {
                mediaSegment = _this.mediaSegments[index];
                _this.serializeMediaSegment_(mediaSegment, dataStream,
                  serializeMediaSegmentCb);
              } else {
                cb(null);
              }
            });
        });
    };

  /**
   * @function MetadataStream#serializeInitSegment_
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   */
  MetadataStream.prototype.serializeInitSegment_ =
    function serializeInitSegment_(dataStream, cb) {
      var _this = this;
      dataStream.writeUInteger(this.initSegment.length,
        function writeInitSegmentLengthCb(error) {
          if (error) {
            cb(error);
            return;
          }

          dataStream.write(_this.initSegment,
            function writeInitSegmentCb(err) {
              if (err) {
                cb(err);
                return;
              }

              _this.serializeMediaSegments_(dataStream, cb);
            });
        });
    };

  /**
   * @function MetadataStream#serialize
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   */
  MetadataStream.prototype.serialize = function serialize(dataStream, cb) {
    var field;
    var index = 0;
    var length = MetadataStream.HEADER_FIELDS.length;
    var _this = this;

    if (!(dataStream instanceof Peeracle.DataStream)) {
      cb(new TypeError('argument must be a DataStream'));
      return;
    }

    field = MetadataStream.HEADER_FIELDS[index];
    dataStream['write' + field.type](this[field.name],
      function writeCb(error) {
        if (error) {
          cb(error);
          return;
        }

        if (++index < length) {
          field = MetadataStream.HEADER_FIELDS[index];
          dataStream['write' + field.type](_this[field.name], writeCb);
        } else {
          _this.serializeInitSegment_(dataStream, cb);
        }
      });
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

  /**
   * @typedef {Object} MetadataMediaSegment
   * @property {Number} timecode
   * @property {Number} length
   * @property {Array.<Uint8Array>} chunks
   */

  return MetadataStream;
})();

// @exclude
module.exports = Peeracle.MetadataStream;
// @endexclude
