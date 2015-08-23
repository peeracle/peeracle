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
  Media: require('./media')
};
// @endexclude

/* eslint-disable */
Peeracle.WebMMedia = (function () {
  /* eslint-enable */
  /**
   * @class WebMMedia
   * @memberof {Peeracle}
   * @constructor
   * @implements {Media}
   * @param {DataStream} dataStream
   *
   * @property {DataStream} dataStream;
   * @property {Boolean} initialized;
   * @property {EBMLTag} seekHeadTag;
   * @property {EBMLSeekTable} seeks;
   * @property {Object.<String, Number>} cues;
   * @property {Array.<MediaTrack>} tracks;
   * @property {Number} timecodeScale;
   * @property {Number} duration;
   * @property {String} mimeType;
   */
  function WebMMedia(dataStream) {
    this.dataStream = dataStream;
    this.initialized = false;
    this.seekHeadTag = null;
    this.seeks = {};
    this.cues = {};
    this.tracks = [];
    this.timecodeScale = -1;
    this.duration = -1;
    this.mimeType = '';
  }

  WebMMedia.CODEC_VP8 = 'V_VP8';
  WebMMedia.CODEC_VP9 = 'V_VP9';
  WebMMedia.CODEC_VORBIS = 'A_VORBIS';
  WebMMedia.CODEC_OPUS = 'A_OPUS';

  WebMMedia.SEEK_CLUSTER = '1f43b675';
  WebMMedia.SEEK_CUES = '1c53bb6b';
  WebMMedia.SEEK_INFO = '1549a966';
  WebMMedia.SEEK_TRACKS = '1654ae6b';

  WebMMedia.TAG_EBML = 0x1A45DFA3;
  WebMMedia.TAG_SEGMENT = 0x18538067;
  WebMMedia.TAG_SEEKHEAD = 0x114D9B74;

  WebMMedia.TAG_INFO = 0x1549A966;
  WebMMedia.TAG_TIMECODESCALE = 0x2AD7B1;
  WebMMedia.TAG_DURATION = 0x4489;

  WebMMedia.TAG_TRACKS = 0x1654AE6B;
  WebMMedia.TAG_TRACKENTRY = 0xAE;
  WebMMedia.TAG_TRACKNUMBER = 0xD7;
  WebMMedia.TAG_TRACKTYPE = 0x83;
  WebMMedia.TAG_CODECID = 0x86;

  WebMMedia.TAG_VIDEO = 0xE0;
  WebMMedia.TAG_PIXELWIDTH = 0xB0;
  WebMMedia.TAG_PIXELHEIGHT = 0xBA;

  WebMMedia.TAG_AUDIO = 0xE1;
  WebMMedia.TAG_SAMPLINGFREQUENCY = 0xB5;
  WebMMedia.TAG_CHANNELS = 0x9F;
  WebMMedia.TAG_BITDEPTH = 0x6264;

  WebMMedia.TAG_CUES = 0x1C53BB6B;
  WebMMedia.TAG_CUEPOINT = 0xBB;
  WebMMedia.TAG_CUETIME = 0xB3;
  WebMMedia.TAG_CUETRACKPOSITIONS = 0xB7;
  WebMMedia.TAG_CUETRACK = 0xF7;
  WebMMedia.TAG_CUECLUSTERPOSITION = 0xF1;

  /**
   * @function WebMMedia#loadFromDataStream
   * @param {Peeracle.DataStream} dataStream
   * @param {Media~loadFromDataStreamCallback} cb
   * @return {?WebMMedia}
   */
  WebMMedia.loadFromDataStream = function loadFromDataStream(dataStream, cb) {
    dataStream.peek(4, function peekCb(error, array, length) {
      if (length !== 4 || (array[0] !== 0x1A && array[1] !== 0x45 &&
        array[2] !== 0xDF && array[3] !== 0xA3)) {
        cb(new Error('Invalid header'));
        return;
      }

      cb(null, new WebMMedia(dataStream));
    });
  };

  WebMMedia.prototype = Object.create(Peeracle.Media.prototype);
  WebMMedia.prototype.constructor = WebMMedia;

  WebMMedia.prototype.getInitSegment = function getInitSegment(cb) {
    var _this = this;

    if (!this.initialized) {
      this.init_(function initCb(error) {
        if (error) {
          cb(error);
          return;
        }

        cb(null, _this.initSegment);
      });
      return;
    }

    cb(null, this.initSegment);
  };

  WebMMedia.prototype.getMediaSegment = function getMediaSegment(timecode, cb) {
    var _this = this;
    var cues;

    if (!this.cues.hasOwnProperty('' + this.tracks[0].id)) {
      cb(new Error('Unknown timecode'));
      return;
    }

    cues = this.cues['' + this.tracks[0].id];
    if (!cues.hasOwnProperty('' + timecode)) {
      cb(new Error('Unknown timecode'));
      return;
    }

    this.dataStream.seek(cues['' + timecode]);
    this.readEBMLTag_(function readTagCb(error, tag) {
      _this.dataStream.read(tag.dataLength,
        function readCb(err, bytes) {
          if (err) {
            cb(err);
            return;
          }

          cb(null, bytes);
        });
    });
  };

  /**
   * @function WebMMedia#readVariableInt_
   * @param {Uint8Array} bytes
   * @param {Number} maxSize
   * @param {Number=} offset
   * @return {?Object}
   * @private
   */
  WebMMedia.prototype.readVariableInt_ =
    function readVariableInt_(bytes, maxSize, offset) {
      var index = (offset && offset > 0) ? offset : 0;
      var count = 1;
      var length = bytes[index];
      var bytesRead = 1;
      var lengthMask = 0x80;

      if (!length) {
        return null;
      }

      while (bytesRead <= maxSize && !(length & lengthMask)) {
        bytesRead++;
        lengthMask >>= 1;
      }

      if (bytesRead > maxSize) {
        return null;
      }

      length &= ~lengthMask;
      while (count++ < bytesRead) {
        length = (length << 8) | bytes[++index];
      }

      return {
        length: bytesRead,
        result: length
      };
    };

  /**
   * @function WebMMedia#readUInt_
   * @param {Uint8Array} bytes
   * @param {Number} size
   * @param {Number=} offset
   * @returns {EBMLReadResult}
   * @private
   */
  WebMMedia.prototype.readUInt_ = function readUInt_(bytes, size, offset) {
    var i;
    var start = (offset && offset > 0) ? offset : 0;
    var val = 0;

    if (size < 1 || size > 8) {
      return {
        error: new RangeError('Length out of bounds: ' + size),
        result: null
      };
    }

    for (i = 0; i < size; ++i) {
      val <<= 8;
      val |= bytes[start + i] & 0xff;
    }

    return {
      error: null,
      result: val
    };
  };

  /**
   * @function WebMMedia#readString_
   * @param {Uint8Array} bytes
   * @param {Number} size
   * @param {Number=} offset
   * @returns {EBMLReadResult}
   * @private
   */
  WebMMedia.prototype.readString_ = function readString_(bytes, size, offset) {
    var i;
    var start = (offset && offset > 0) ? offset : 0;
    var val = '';

    if (size < 1 || size > 8) {
      return {
        error: new RangeError('Length out of bounds: ' + size),
        result: null
      };
    }

    for (i = 0; i < size; ++i) {
      val += String.fromCharCode(bytes[start + i]);
    }

    return {
      error: null,
      result: val
    };
  };

  /**
   * @function WebMMedia#readFloat8_
   * @param {Uint8Array} bytes
   * @param {Number=} offset
   * @returns {EBMLReadResult}
   * @private
   */
  WebMMedia.prototype.readFloat4_ = function readFloat4_(bytes, offset) {
    var i;
    var start = (offset && offset > 0) ? offset : 0;
    var val = 0;
    var sign;
    var exponent;
    var significand;

    for (i = 0; i < 4; ++i) {
      val <<= 8;
      val |= bytes[start + i] & 0xff;
    }

    sign = val >> 31;
    exponent = ((val >> 23) & 0xff) - 127;
    significand = val & 0x7fffff;
    if (exponent > -127) {
      if (exponent === 128) {
        if (significand === 0) {
          if (sign === 0) {
            return {
              error: null,
              result: Number.POSITIVE_INFINITY
            };
          }
          return {
            error: null,
            result: Number.NEGATIVE_INFINITY
          };
        }
        return NaN;
      }
      significand |= 0x800000;
    } else {
      if (significand === 0) {
        return 0;
      }
      exponent = -126;
    }

    return {
      error: null,
      result: Math.pow(-1, sign) * (significand * Math.pow(2, -23)) *
      Math.pow(2, exponent)
    };
  };

  /**
   * @function WebMMedia#readFloat8_
   * @param {Uint8Array} bytes
   * @param {Number=} offset
   * @returns {EBMLReadResult}
   * @private
   */
  WebMMedia.prototype.readFloat8_ = function readFloat8_(bytes, offset) {
    var i;
    var start = (offset && offset > 0) ? offset : 0;
    var sign = (bytes[start] >> 7) & 0x1;
    var exponent = (((bytes[start] & 0x7f) << 4) |
      ((bytes[start + 1] >> 4) & 0xf)) - 1023;

    var significand = 0;
    var shift = Math.pow(2, 6 * 8);

    significand += (bytes[start + 1] & 0xf) * shift;
    for (i = 2; i < 8; ++i) {
      shift = Math.pow(2, (8 - i - 1) * 8);
      significand += (bytes[start + i] & 0xff) * shift;
    }

    if (exponent > -1023) {
      if (exponent === 1024) {
        if (significand === 0) {
          if (sign === 0) {
            return {
              error: null,
              result: Number.POSITIVE_INFINITY
            };
          }
          return {
            error: null,
            result: Number.NEGATIVE_INFINITY
          };
        }
        return {
          error: null,
          result: NaN
        };
      }
      significand += 0x10000000000000;
    } else {
      if (significand === 0) {
        return 0;
      }
      exponent = -1022;
    }

    return {
      error: null,
      result: Math.pow(-1, sign) * (significand * Math.pow(2, -52)) *
      Math.pow(2, exponent)
    };
  };

  /**
   * @function WebMMedia#readFloat_
   * @param {Uint8Array} bytes
   * @param {Number} size
   * @param {Number=} offset
   * @returns {EBMLReadResult}
   * @private
   */
  WebMMedia.prototype.readFloat_ = function readFloat_(bytes, size, offset) {
    if (size === 4) {
      return this.readFloat4_(bytes, offset);
    } else if (size === 8) {
      return this.readFloat8_(bytes, offset);
    }
    return {
      error: new RangeError('Expected size === 4 || 8'),
      result: null
    };
  };

  /**
   * @function WebMMedia#parseEBMLTag_
   * @param {Uint8Array} bytes
   * @param {Number=} offset
   * @return {?EBMLTag}
   * @private
   */
  WebMMedia.prototype.parseEBMLTag_ = function parseEBMLTag_(bytes, offset) {
    /** @type {EBMLTag} */
    var tag = {};
    var start = (offset && offset > 0) ? offset : 0;
    var header = this.readVariableInt_(bytes, 4, start);
    var data;

    if (!header) {
      return null;
    }

    tag.id = header.result | (1 << (7 * header.length));
    tag.headerLength = header.length;
    start += tag.headerLength;

    data = this.readVariableInt_(bytes, 8, start);
    tag.dataLength = data.result;
    tag.headerLength += data.length;

    return tag;
  };

  /**
   * @function WebMMedia#readEBMLTag_
   * @param {WebMMedia~readEBMLTagCallback} cb
   * @private
   */
  WebMMedia.prototype.readEBMLTag_ = function readEBMLTag_(cb) {
    var _this = this;
    var offset = this.dataStream.tell();
    this.dataStream.peek(12, function readCb(error, bytes, length) {
      /** @type {EBMLTag} */
      var tag;

      if (error || length < 12) {
        cb(error ? error : new Error('Unable to read enough bytes'));
        return;
      }

      tag = _this.parseEBMLTag_(bytes);
      if (!tag) {
        cb(new Error('Failed to parse EBML tag'));
        return;
      }

      tag.offset = offset;
      _this.dataStream.seek(tag.offset + tag.headerLength);
      cb(null, tag);
    });
  };

  /**
   * @function WebMMedia#findTag_
   * @param {Number} id
   * @param {WebMMedia~readEBMLTagCallback} cb
   * @private
   */
  WebMMedia.prototype.findTag_ = function findTag_(id, cb) {
    var _this = this;
    this.readEBMLTag_(function readTagCb(error, tag) {
      if (error) {
        cb(error);
        return;
      }

      if (tag.id !== id) {
        _this.dataStream.seek(tag.offset + tag.headerLength + tag.dataLength);
        _this.readEBMLTag_(readTagCb);
        return;
      }

      cb(null, tag);
    });
  };

  /**
   * @function WebMMedia#parseSeek_
   * @param {EBMLTag} tag
   * @param {Uint8Array} bytes
   * @throws {Error}
   * @private
   */
  WebMMedia.prototype.parseSeek_ = function parseSeek_(tag, bytes) {
    var index = 0;
    var seekIdTag;
    var seekId;
    var seekIdStr = '';
    var seekPositionTag;
    var seekPosition;

    seekIdTag = this.parseEBMLTag_(bytes, tag.headerLength);
    if (!seekIdTag) {
      throw new Error('Failed to parse SeekID tag');
    }

    index += tag.headerLength;
    seekId = bytes.subarray(index + seekIdTag.headerLength,
      tag.headerLength + seekIdTag.headerLength + seekIdTag.dataLength);
    index += seekIdTag.headerLength;

    seekPositionTag = this.parseEBMLTag_(bytes, index + seekIdTag.dataLength);
    if (!seekPositionTag) {
      throw new Error('Failed to parse SeekPosition tag');
    }

    index += seekIdTag.dataLength;
    seekPosition = this.readUInt_(bytes, seekPositionTag.dataLength, index +
      seekPositionTag.headerLength);

    for (index = 0; index < seekId.length; ++index) {
      seekIdStr += seekId[index].toString(16);
    }

    this.seeks[seekIdStr] = seekPosition.result;
  };

  /**
   * @function WebMMedia#parseSeekHead_
   * @param {EBMLTag} tag
   * @param {Uint8Array} bytes
   * @throws {Error}
   * @private
   */
  WebMMedia.prototype.parseSeekHead_ =
    function parseSeekHead_(tag, bytes) {
      var index = 0;
      var seekTag;
      var seekTagBytes;

      while (index < tag.dataLength) {
        seekTagBytes = bytes.subarray(index, bytes.length);
        seekTag = this.parseEBMLTag_(seekTagBytes);
        if (!seekTag) {
          throw new Error('Failed to parse Seek tag');
        }

        try {
          this.parseSeek_(seekTag, seekTagBytes);
        } catch (e) {
          throw e;
        }
        index += seekTag.headerLength + seekTag.dataLength;
      }
    };

  /**
   * @function WebMMedia#readSeekHeadTag_
   * @param {EBMLTag} segment
   * @param {WebMMedia~readEBMLTagCallback} cb
   * @private
   */
  WebMMedia.prototype.readSeekHeadTag_ =
    function readSeekHeadTag_(segment, cb) {
      var _this = this;

      this.dataStream.seek(segment.offset + segment.headerLength);
      this.findTag_(WebMMedia.TAG_SEEKHEAD,
        function findSeekHeadCb(err, seekHead) {
          if (err) {
            cb(err);
            return;
          }

          _this.seekHeadTag = seekHead;
          _this.dataStream.seek(seekHead.offset + seekHead.headerLength);
          _this.dataStream.read(seekHead.dataLength,
            function readCb(error, bytes, length) {
              if (error) {
                cb(error);
                return;
              }

              try {
                _this.parseSeekHead_(seekHead, bytes, length);
              } catch (e) {
                cb(e);
                return;
              }

              cb(null, seekHead);
            });
        });
    };

  /**
   * @function WebMMedia#readSegmentTag_
   * @param {EBMLTag} ebml
   * @param {WebMMedia~readEBMLTagCallback} cb
   * @private
   */
  WebMMedia.prototype.readSegmentTag_ = function parseSegmentTag_(ebml, cb) {
    var _this = this;

    this.dataStream.seek(ebml.offset + ebml.headerLength + ebml.dataLength);
    this.findTag_(WebMMedia.TAG_SEGMENT,
      function findSegmentCb(error, segment) {
        if (error || segment.length < 12) {
          cb(new Error('Invalid Segment header'));
          return;
        }

        _this.segmentTag = segment;
        _this.readSeekHeadTag_(segment,
          function readSeekHeadTagCb(err, seekHeadTag) {
            if (err) {
              cb(err);
              return;
            }

            if (!_this.seeks.hasOwnProperty(WebMMedia.SEEK_CLUSTER) ||
              !_this.seeks.hasOwnProperty(WebMMedia.SEEK_CUES) ||
              !_this.seeks.hasOwnProperty(WebMMedia.SEEK_INFO) ||
              !_this.seeks.hasOwnProperty(WebMMedia.SEEK_TRACKS)) {
              cb(new Error('Required seek missing'));
              return;
            }

            _this.seekHeadTag = seekHeadTag;
            cb(null, segment);
          });
      });
  };

  /**
   * @function WebMMedia#parseCuePointTag_
   * @param {Uint8Array} bytes
   * @param {Object} cue
   * @private
   */
  WebMMedia.prototype.parseCueTrackPositionsTag_ =
    function parseCueTrackPositionsTag_(bytes, cue) {
      var tag;
      var index = 0;
      var number;

      while (index < bytes.length) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag) {
          throw new Error('Can\'t parse a tag inside CueTrackPositions');
        }

        index += tag.headerLength;
        switch (tag.id) {
          case WebMMedia.TAG_CUETRACK:
            number = this.readUInt_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            cue.track = number.result;
            break;
          case WebMMedia.TAG_CUECLUSTERPOSITION:
            number = this.readUInt_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            cue.clusterPosition = number.result;
            break;
          default:
            break;
        }
        index += tag.dataLength;
      }
    };

  /**
   * @function WebMMedia#parseCuePointTag_
   * @param {Uint8Array} bytes
   * @private
   */
  WebMMedia.prototype.parseCuePointTag_ = function parseCuePointTag_(bytes) {
    var tag;
    var index = 0;
    var number;
    var cue = {
      timecode: -1,
      track: -1,
      clusterPosition: -1
    };

    while (index < bytes.length) {
      tag = this.parseEBMLTag_(bytes, index);
      if (!tag) {
        throw new Error('Can\'t parse a tag inside CuePoint');
      }

      index += tag.headerLength;
      switch (tag.id) {
        case WebMMedia.TAG_CUETIME:
          number = this.readUInt_(bytes, tag.dataLength, index);
          if (number.error) {
            throw number.error;
          }
          cue.timecode = number.result;
          break;
        case WebMMedia.TAG_CUETRACKPOSITIONS:
          this.parseCueTrackPositionsTag_(bytes.subarray(index,
            index + tag.dataLength), cue);
          break;
        default:
          break;
      }
      index += tag.dataLength;
    }

    if (cue.timecode === -1 || cue.track === -1 || cue.clusterPosition === -1) {
      throw new Error('Parsed an invalid CuePoint');
    }

    if (!this.cues.hasOwnProperty('' + cue.track)) {
      this.cues['' + cue.track] = {};
    }

    this.cues['' + cue.track]['' + cue.timecode] = cue.clusterPosition +
      this.seekHeadTag.offset;
  };

  /**
   * @function WebMMedia#parseTracksTag_
   * @param {Uint8Array} bytes
   * @private
   */
  WebMMedia.prototype.parseCuesTag_ = function parseCuesTag_(bytes) {
    var tag;
    var index = 0;

    while (index < bytes.length) {
      tag = this.parseEBMLTag_(bytes, index);
      if (!tag) {
        throw new Error('Can\'t parse a tag inside Cues');
      }

      index += tag.headerLength;
      switch (tag.id) {
        case WebMMedia.TAG_CUEPOINT:
          this.parseCuePointTag_(bytes.subarray(index, index + tag.dataLength));
          break;
        default:
          break;
      }
      index += tag.dataLength;
    }
  };

  /**
   * @function WebMMedia#initTracksTag_
   * @param {Uint8Array} initSegment
   * @private
   */
  WebMMedia.prototype.initCuesTag_ = function initCuesTag_(initSegment) {
    var offset = this.seekHeadTag.offset + this.seeks[WebMMedia.SEEK_CUES];
    var tag = this.parseEBMLTag_(initSegment, offset);
    var bytes;

    if (!tag || tag.id !== WebMMedia.TAG_CUES) {
      throw new Error('Can\'t parse the Tracks tag');
    }

    offset += tag.headerLength;
    bytes = initSegment.subarray(offset, offset + tag.dataLength);

    this.parseCuesTag_(bytes);
  };

  /**
   * @function WebMMedia#parseVideoTag_
   * @param {Uint8Array} bytes
   * @param {Object} track
   * @private
   */
  WebMMedia.prototype.parseVideoTag_ = function parseVideoTag_(bytes, track) {
    var tag;
    var index = 0;
    var number;

    while (index < bytes.length) {
      tag = this.parseEBMLTag_(bytes, index);
      if (!tag) {
        throw new Error('Can\'t parse a tag inside Video');
      }

      index += tag.headerLength;
      switch (tag.id) {
        case WebMMedia.TAG_PIXELWIDTH:
          number = this.readUInt_(bytes, tag.dataLength, index);
          if (number.error) {
            throw number.error;
          }
          track.width = number.result;
          break;
        case WebMMedia.TAG_PIXELHEIGHT:
          number = this.readUInt_(bytes, tag.dataLength, index);
          if (number.error) {
            throw number.error;
          }
          track.height = number.result;
          break;
        default:
          break;
      }
      index += tag.dataLength;
    }
  };

  /**
   * @function WebMMedia#parseAudioTag_
   * @param {Uint8Array} bytes
   * @param {Object} track
   * @private
   */
  WebMMedia.prototype.parseAudioTag_ = function parseVideoTag_(bytes, track) {
    var tag;
    var index = 0;
    var number;

    while (index < bytes.length) {
      tag = this.parseEBMLTag_(bytes, index);
      if (!tag) {
        throw new Error('Can\'t parse a tag inside Video');
      }

      index += tag.headerLength;
      switch (tag.id) {
        case WebMMedia.TAG_SAMPLINGFREQUENCY:
          number = this.readFloat_(bytes, tag.dataLength, index);
          if (number.error) {
            throw number.error;
          }
          track.samplingFrequency = number.result;
          break;
        case WebMMedia.TAG_CHANNELS:
          number = this.readUInt_(bytes, tag.dataLength, index);
          if (number.error) {
            throw number.error;
          }
          track.channels = number.result;
          break;
        case WebMMedia.TAG_BITDEPTH:
          number = this.readUInt_(bytes, tag.dataLength, index);
          if (number.error) {
            throw number.error;
          }
          track.bitDepth = number.result;
          break;
        default:
          break;
      }
      index += tag.dataLength;
    }
  };

  /**
   * @function WebMMedia#parseTrackEntryTag_
   * @param {Uint8Array} bytes
   * @private
   */
  WebMMedia.prototype.parseTrackEntryTag_ =
    function parseTrackEntryTag_(bytes) {
      var tag;
      var index = 0;
      var data;

      /** @type {MediaTrack} */
      var track = {
        id: -1,
        type: -1,
        codec: '',
        width: -1,
        height: -1,
        samplingFrequency: -1,
        channels: -1,
        bitDepth: -1
      };

      while (index < bytes.length) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag) {
          throw new Error('Can\'t parse a tag inside TrackEntry');
        }

        index += tag.headerLength;
        switch (tag.id) {
          case WebMMedia.TAG_TRACKNUMBER:
            data = this.readUInt_(bytes, tag.dataLength, index);
            if (data.error) {
              throw data.error;
            }
            track.id = data.result;
            break;
          case WebMMedia.TAG_TRACKTYPE:
            data = this.readUInt_(bytes, tag.dataLength, index);
            if (data.error) {
              throw data.error;
            }
            track.type = data.result;
            break;
          case WebMMedia.TAG_CODECID:
            data = this.readString_(bytes, tag.dataLength, index);
            if (data.error) {
              throw data.error;
            }
            track.codec = data.result;
            break;
          case WebMMedia.TAG_VIDEO:
            this.parseVideoTag_(bytes.subarray(index, index + tag.dataLength),
              track);
            break;
          case WebMMedia.TAG_AUDIO:
            this.parseAudioTag_(bytes.subarray(index, index + tag.dataLength),
              track);
            break;
          default:
            break;
        }
        index += tag.dataLength;
      }

      if (track.id === -1 || track.type === -1 || track.codec === -1) {
        throw new Error('Parsed an invalid TrackEntry');
      }

      this.tracks.push(track);
    };

  /**
   * @function WebMMedia#parseTracksTag_
   * @param {Uint8Array} bytes
   * @private
   */
  WebMMedia.prototype.parseTracksTag_ = function parseTracksTag_(bytes) {
    var tag;
    var index = 0;
    while (index < bytes.length) {
      tag = this.parseEBMLTag_(bytes, index);
      if (!tag || tag.id !== WebMMedia.TAG_TRACKENTRY) {
        throw new Error('Can\'t parse the TrackEntry tag');
      }

      index += tag.headerLength;
      this.parseTrackEntryTag_(bytes.subarray(index, index + tag.dataLength));
      index += tag.dataLength;
    }
  };

  /**
   * @function WebMMedia#initTracksTag_
   * @param {Uint8Array} initSegment
   * @private
   */
  WebMMedia.prototype.initTracksTag_ = function initTracksTag_(initSegment) {
    var offset = this.seekHeadTag.offset + this.seeks[WebMMedia.SEEK_TRACKS];
    var tag = this.parseEBMLTag_(initSegment, offset);
    var bytes;

    if (!tag || tag.id !== WebMMedia.TAG_TRACKS) {
      throw new Error('Can\'t parse the Tracks tag');
    }

    offset += tag.headerLength;
    bytes = initSegment.subarray(offset, offset + tag.dataLength);

    this.parseTracksTag_(bytes);
  };

  /**
   * @function WebMMedia#parseInfoTag_
   * @param {Uint8Array} bytes
   * @private
   */
  WebMMedia.prototype.parseInfoTag_ = function parseInfoTag_(bytes) {
    var tag;
    var index = 0;
    var timecodeScale;
    var timecodeScaleTag;
    var duration;
    var durationTag;

    while (!timecodeScaleTag || !durationTag) {
      tag = this.parseEBMLTag_(bytes, index);
      if (!tag) {
        throw new Error('Can\'t parse a duration or timecodeScale tag');
      }

      index += tag.headerLength;
      switch (tag.id) {
        case WebMMedia.TAG_TIMECODESCALE:
          timecodeScaleTag = tag;
          timecodeScale = this.readUInt_(bytes, tag.dataLength, index);
          if (timecodeScale.error) {
            throw timecodeScale.error;
          }
          break;
        case WebMMedia.TAG_DURATION:
          durationTag = tag;
          duration = this.readFloat_(bytes, tag.dataLength, index);
          if (duration.error) {
            throw duration.error;
          }
          break;
        default:
          break;
      }
      index += tag.dataLength;
    }

    this.timecodeScale = timecodeScale.result;
    this.duration = duration.result;
  };

  /**
   * @function WebMMedia#initInfoTag_
   * @param {Uint8Array} initSegment
   * @private
   */
  WebMMedia.prototype.initInfoTag_ = function initInfoTag_(initSegment) {
    var offset = this.seekHeadTag.offset + this.seeks[WebMMedia.SEEK_INFO];
    var tag = this.parseEBMLTag_(initSegment, offset);
    var bytes;

    if (!tag || tag.id !== WebMMedia.TAG_INFO) {
      throw new Error('Can\'t parse the Info tag');
    }

    offset += tag.headerLength;
    bytes = initSegment.subarray(offset, offset + tag.dataLength);

    this.parseInfoTag_(bytes);
  };

  /**
   * @function WebMMedia#initMimeType_
   * @private
   */
  WebMMedia.prototype.initMimeType_ = function initMimeType_() {
    var index;
    var count;
    var track;
    var mimeType;
    var isVideo = false;
    var codecs = [];
    var type = '';

    for (index = 0, count = this.tracks.length; index < count; ++index) {
      track = this.tracks[index];
      if (track.type === 1) {
        isVideo = true;
      }

      if (track.codec === WebMMedia.CODEC_VP8) {
        codecs.push('vp8');
      } else if (track.codec === WebMMedia.CODEC_VP9) {
        codecs.push('vp9');
      } else if (track.codec === WebMMedia.CODEC_VORBIS) {
        codecs.push('vorbis');
      } else if (track.codec === WebMMedia.CODEC_OPUS) {
        codecs.push('opus');
      }
    }

    if (isVideo) {
      type = 'video/webm';
    } else {
      type = 'audio/webm';
    }

    mimeType = type + ';codecs="';
    for (index = 0, count = codecs.length; index < count; ++index) {
      mimeType += codecs[index];
      if (index + 1 !== codecs.length) {
        mimeType += ',';
      }
    }

    this.mimeType = mimeType + '"';
  };

  /**
   * @function WebMMedia#initSegmentTag_
   * @param {EBMLTag} ebml
   * @param {WebMMedia~initCallback} cb
   * @private
   */
  WebMMedia.prototype.initSegmentTag_ = function initSegmentTag_(ebml, cb) {
    var _this = this;
    this.readSegmentTag_(ebml, function readSegmentTagCb(error) {
      var clusterOffset;

      if (error) {
        cb(error);
        return;
      }

      clusterOffset = _this.seekHeadTag.offset +
        _this.seeks[WebMMedia.SEEK_CLUSTER];
      _this.dataStream.seek(0);
      _this.dataStream.read(clusterOffset, function readCb(err, bytes) {
        if (err) {
          cb(err);
          return;
        }

        _this.initSegment = bytes;
        try {
          _this.initInfoTag_(bytes);
          _this.initTracksTag_(bytes);
          _this.initCuesTag_(bytes);
          _this.initMimeType_();
        } catch (e) {
          cb(e);
        }

        _this.initialized = true;
        cb(null);
      });
    });
  };

  /**
   * @function WebMMedia#init_
   * @param {WebMMedia~initCallback} cb
   * @private
   */
  WebMMedia.prototype.init_ = function init_(cb) {
    var _this = this;

    this.dataStream.seek(0);
    this.readEBMLTag_(function readEBMLCb(readErr, ebml) {
      if (readErr || ebml.id !== WebMMedia.TAG_EBML || ebml.length < 5) {
        cb(new Error('Invalid EBML header'));
        return;
      }

      _this.ebmlTag = ebml;
      _this.initSegmentTag_(ebml, cb);
    });
  };

  /**
   * Callback function for the init_ method.
   * @callback WebMMedia~initCallback
   * @param {Error} error
   */

  /**
   * Callback function for the readEBMLTag_ method.
   * @callback WebMMedia~readEBMLTagCallback
   * @param {Error} error
   */

  /**
   * @typedef {Object} EBMLTag
   * @property {number} id
   * @property {number} offset
   * @property {number} headerLength
   * @property {number} dataLength
   */

  /**
   * @typedef {Object.<String, Number>} EBMLSeekTable
   */

  /**
   * @typedef {Object} EBMLReadResult
   * @property {Error} error
   * @property {*} result
   */

  return WebMMedia;
})();

// @exclude
module.exports = Peeracle.WebMMedia;
// @endexclude
