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
  Hash: require('./hash'),
  MetadataStream: require('./metadataStream'),
  Media: require('./media')
};
// @endexclude

/* eslint-disable */
Peeracle.Metadata = (function () {
  /* eslint-enable */
  /**
   * @class Metadata
   * @memberof {Peeracle}
   * @constructor
   * @param {String} checksumAlgorithmName
   * @property {Number} version
   * @property {String} checksumAlgorithmName
   * @property {String} hash
   * @property {Hash} checksumAlgorithm
   * @property {Number} timecodeScale
   * @property {Number} duration
   * @property {Array.<String>} trackerUrls
   * @property {Array.<MetadataStream>} streams
   */
  function Metadata(checksumAlgorithmName) {
    this.magic = Metadata.MAGIC;
    this.version = Metadata.VERSION;
    this.checksumAlgorithmName = checksumAlgorithmName ?
      checksumAlgorithmName : 'murmur3_x86_128';
    this.checksumAlgorithm = Peeracle.Hash.create(this.checksumAlgorithmName);
    if (!this.checksumAlgorithm) {
      throw new Error('Invalid checksum algorithm');
    }
    this.hash = '';
    this.timecodeScale = 0;
    this.duration = 0;
    this.trackerUrls = [];
    this.streams = [];
  }

  Metadata.MAGIC = 0x5052434C;
  Metadata.VERSION = 2;
  Metadata.HEADER_FIELDS = [
    {name: 'magic', type: 'UInteger'},
    {name: 'version', type: 'UInteger'},
    {name: 'checksumAlgorithmName', type: 'String'},
    {name: 'timecodeScale', type: 'UInteger'},
    {name: 'duration', type: 'Double'}
  ];

  /**
   * @function Metadata#addMedia
   * @param {Peeracle.Media} media
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

      _this.checksumAlgorithm.update(bytes);
      stream = new Peeracle.MetadataStream(_this, media, bytes);
      stream.addMediaSegments(function addMediaSegmentsCb(err) {
        if (err) {
          cb(err);
          return;
        }

        _this.streams.push(stream);
        _this.hash = _this.checksumAlgorithm.finish();
        cb(null);
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
   * @function Metadata#serializeStreams_
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   * @private
   */
  Metadata.prototype.serializeStreams_ =
    function serializeStreams_(dataStream, cb) {
      var _this = this;
      var index = 0;
      var count = this.streams.length;
      var stream;

      if (!count) {
        cb(null);
        return;
      }

      dataStream.writeUInteger(count, function writeStreamsCountCb(err) {
        if (err) {
          cb(err);
          return;
        }

        stream = _this.streams[index];
        stream.serialize(dataStream, function serializeCb(error) {
          if (error) {
            cb(error);
            return;
          }

          if (++index < count) {
            stream = _this.streams[index];
            stream.serialize(dataStream, serializeCb);
          } else {
            cb(null);
          }
        });
      });
    };

  /**
   * @function Metadata#serializeTrackers_
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   * @private
   */
  Metadata.prototype.serializeTrackers_ =
    function serializeTrackers_(dataStream, cb) {
      var _this = this;
      var length = this.trackerUrls.length;
      dataStream.writeUInteger(length,
        function writeTrackerCountCb(error) {
          var index = 0;

          if (error) {
            cb(error);
            return;
          }

          dataStream.writeString(_this.trackerUrls[index],
            function writeTrackerUrlCb(err) {
              if (err) {
                cb(err);
                return;
              }

              if (++index < length) {
                dataStream.writeString(_this.trackerUrls[index],
                  writeTrackerUrlCb);
              } else {
                _this.serializeStreams_(dataStream, cb);
              }
            });
        });
    };

  /**
   * @function Metadata#serialize
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   */
  Metadata.prototype.serialize = function serialize(dataStream, cb) {
    var field;
    var index = 0;
    var length = Metadata.HEADER_FIELDS.length;
    var _this = this;

    if (!(dataStream instanceof Peeracle.DataStream)) {
      cb(new TypeError('argument must be a DataStream'));
      return;
    }

    field = Metadata.HEADER_FIELDS[index];
    dataStream['write' + field.type](this[field.name],
      function writeCb(error) {
        if (error) {
          cb(error);
          return;
        }

        if (++index < length) {
          field = Metadata.HEADER_FIELDS[index];
          dataStream['write' + field.type](_this[field.name], writeCb);
        } else {
          _this.serializeTrackers_(dataStream, cb);
        }
      });
  };

  /**
   * @function Metadata#unserializeStreams_
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   * @private
   */
  Metadata.prototype.unserializeStreams_ =
    function unserializeStreams_(dataStream, cb) {
      var _this = this;
      var index = 0;
      var count;
      var stream;

      dataStream.readUInteger(function readStreamsCountCb(err, value) {
        if (err) {
          cb(err);
          return;
        }

        count = value;

        if (!count) {
          cb(null);
          return;
        }

        stream = new Peeracle.MetadataStream(_this);
        stream.unserialize(dataStream, function unserializeCb(error) {
          if (error) {
            cb(error);
            return;
          }

          _this.streams.push(stream);
          if (++index < count) {
            stream = new Peeracle.MetadataStream(_this);
            stream.unserialize(dataStream, unserializeCb);
          } else {
            _this.hash = _this.checksumAlgorithm.finish();
            cb(null);
          }
        });
      });
    };

  /**
   * @function Metadata#unserializeTrackers_
   * @param {Peeracle.DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   * @private
   */
  Metadata.prototype.unserializeTrackers_ =
    function unserializeTrackers_(dataStream, cb) {
      var _this = this;
      dataStream.readUInteger(function readTrackerCountCb(error, value) {
        var index = 0;
        var length;

        if (error) {
          cb(error);
          return;
        }

        length = value;
        if (!length) {
          _this.unserializeStreams_(dataStream, cb);
          return;
        }

        _this.trackerUrls = [];
        dataStream.readString(function readTrackerUrlCb(err, val) {
          if (err) {
            cb(err);
            return;
          }

          _this.trackerUrls[index] = val;
          if (++index < length) {
            dataStream.readString(readTrackerUrlCb);
          } else {
            _this.unserializeStreams_(dataStream, cb);
          }
        });
      });
    };

  /**
   * @function Metadata#unserialize
   * @param {DataStream} dataStream
   * @param {Metadata~genericCallback} cb
   */
  Metadata.prototype.unserialize = function unserialize(dataStream, cb) {
    var field;
    var index = 0;
    var length = Metadata.HEADER_FIELDS.length;
    var _this = this;

    if (!(dataStream instanceof Peeracle.DataStream)) {
      cb(new TypeError('argument must be a DataStream'));
      return;
    }

    field = Metadata.HEADER_FIELDS[index];
    dataStream['read' + field.type](function readCb(error, value) {
      if (error) {
        cb(error);
        return;
      }

      _this[field.name] = value;
      if (++index < length) {
        field = Metadata.HEADER_FIELDS[index];
        dataStream['read' + field.type](readCb);
      } else {
        _this.unserializeTrackers_(dataStream, cb);
      }
    });
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
