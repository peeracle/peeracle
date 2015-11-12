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
  Media: require('./media'),
  MemoryDataStream: require('./memoryDataStream')
};
// @endexclude

/* eslint-disable */
Peeracle.ISOBMFFMedia = (function () {
  /* eslint-enable */
  /**
   * @class ISOBMFFMedia
   * @memberof {Peeracle}
   * @constructor
   * @implements {Media}
   * @param {DataStream} dataStream
   *
   * @property {DataStream} dataStream
   * @property {Boolean} initialized
   * @property {Uint8Array} initSegment
   * @property {ISOBMFFAtom} root
   * @property {String} majorBrand
   * @property {?Number} version
   * @property {Array.<String>} brands
   * @property {MediaTrack} track
   * @property {Array.<MediaTrack>} tracks
   * @property {Array.<MediaCues>} cues;
   */
  function ISOBMFFMedia(dataStream) {
    this.dataStream = dataStream;
    this.initialized = false;
    this.initSegment = null;
    this.root = null;
    this.majorBrand = '';
    this.version = null;
    this.brands = [];
    this.track = null;
    this.tracks = [];
    this.cues = [];
  }

  ISOBMFFMedia.ATOM_FTYP = 0x66747970;
  ISOBMFFMedia.ATOM_MOOV = 0x6d6f6f76;
  ISOBMFFMedia.ATOM_SIDX = 0x73696478;

  ISOBMFFMedia.prototype = Object.create(Peeracle.Media.prototype);
  ISOBMFFMedia.prototype.constructor = ISOBMFFMedia;

  /**
   * @function ISOBMFFMedia#loadFromDataStream
   * @param {DataStream} dataStream
   * @param {Media~loadFromDataStreamCallback} cb
   * @return {?ISOBMFFMedia}
   */
  ISOBMFFMedia.loadFromDataStream =
    function loadFromDataStream(dataStream, cb) {
      dataStream.peek(8, function peekCb(error, array, length) {
        if (length !== 8 || (array[4] !== 0x66 && array[5] !== 0x74 &&
          array[6] !== 0x79 && array[7] !== 0x70)) {
          cb(new Error('Invalid header'));
          return;
        }

        cb(null, new ISOBMFFMedia(dataStream));
      });
    };

  ISOBMFFMedia.prototype.readNextAtom_ = function readNextAtom_(cb) {
    /** @type ISOBMFFAtom */
    var atom = {};
    var _this = this;

    atom.offset = this.dataStream.tell();
    this.dataStream.readUInteger(function readLengthCb(lengthError, result) {
      if (lengthError) {
        cb(lengthError);
        return;
      }

      atom.length = result;
      _this.dataStream.readUInteger(function readIdCb(idError, id) {
        if (idError) {
          cb(idError);
          return;
        }

        atom.id = id;
        atom.children = [];
        cb(null, atom);
      });
    });
  };

  ISOBMFFMedia.prototype.parseAtomHeaders_ =
    function parseAtomHeaders_(cb) {
      var _this = this;
      var version = 0;
      var flags = 0;

      this.dataStream.readByte(function parseAtomHeadersVersionCb(err, byte) {
        if (err) {
          cb(err);
          return;
        }

        version = byte;
        _this.dataStream.read(3, function parseAtomHeadersFlagsCb(err, bytes) {
          if (err) {
            cb(err);
            return;
          }

          flags = (bytes[0] << 16) + (bytes[1] << 8) + (bytes[2] << 0);
          cb(null, version, flags);
        });
      });
    };

  ISOBMFFMedia.prototype.parseFtypCompatibleBrands_ =
    function parseFtypCompatibleBrands_(atom, cb) {
      var _this = this;

      this.dataStream.read(4, function readCompatibleBrand(err, bytes) {
        var i;
        var brand = '';

        if (err) {
          cb(err);
          return;
        }

        brand = '';
        for (i = 0; i < 4; ++i) {
          brand += String.fromCharCode(bytes[i]);
        }
        _this.brands.push(brand);

        if (_this.dataStream.tell() < atom.length) {
          _this.dataStream.read(4, readCompatibleBrand);
          return;
        }

        cb(null);
      });
    };

  ISOBMFFMedia.prototype.parseFtypVersion_ =
    function parseFtypVersion_(atom, cb) {
      var _this = this;

      this.dataStream.read(4, function readFtypVersionCb(err, bytes) {
        if (err) {
          cb(err);
          return;
        }

        _this.version = ((bytes[0] << 24) +
          (bytes[1] << 16) +
          (bytes[2] << 8) +
          bytes[3]) >>> 0;

        _this.parseFtypCompatibleBrands_(atom, cb);
      });
    };

  ISOBMFFMedia.prototype.parseFtyp_ = function parseFtyp_(atom, cb) {
    var _this = this;

    console.log('parsing ftyp atom', this.dataStream.tell());
    this.dataStream.read(4, function readMajorBrandCb(err, bytes) {
      var i;

      if (err) {
        cb(err);
        return;
      }

      _this.majorBrand = '';
      for (i = 0; i < 4; ++i) {
        _this.majorBrand += String.fromCharCode(bytes[i]);
      }

      _this.parseFtypVersion_(atom, cb);
    });
  };

  ISOBMFFMedia.prototype.parseMoov_ = function parseMoov_(atom, cb) {
    console.log('parsing moov atom');
    this.parseAtoms_(atom, cb);
  };

  ISOBMFFMedia.prototype.parseTrak_ = function parseTrak_(atom, cb) {
    console.log('parsing trak atom');

    this.track = {
      id: -1,
      type: -1,
      codec: '',
      width: -1,
      height: -1,
      samplingFrequency: -1,
      channels: -1,
      bitDepth: -1
    };

    this.parseAtoms_(atom, cb);
  };

  ISOBMFFMedia.prototype.parseTkhd_ = function parseTkhd_(atom, cb) {
    var _this = this;

    console.log('parsing tkhd atom');
    this.parseAtomHeaders_(function parseTkhdHeadersCb(err, version, flags) {
      if (err) {
        cb(err);
        return;
      }

      if (version) {
        cb(new Error('tkhd: invalid version'));
        return;
      }

      if (!(flags & 0x0001) || !(flags & 0x0002)) {
        console.warn('Track not enabled or not used in the movie.');
      }

      _this.dataStream.skip(8);
      _this.dataStream.readUInteger(function readTkhdId(err, id) {
        if (err) {
          cb(err);
          return;
        }

        _this.track.id = id;
        cb(null);
      });
    });
  };

  ISOBMFFMedia.prototype.parseMdia_ = function parseMdia_(atom, cb) {
    console.log('parsing mdia atom');
    this.parseAtoms_(atom, cb);
  };

  ISOBMFFMedia.prototype.parseHdlr_ = function parseHdlr_(atom, cb) {
    var _this = this;

    console.log('parsing hdlr atom');
    this.parseAtomHeaders_(function parseTkhdHeadersCb(err, version, flags) {
      if (err) {
        cb(err);
        return;
      }

      _this.dataStream.skip(4);
      _this.dataStream.read(4, function readTypeCb(err, bytes) {
        var i;
        var type = '';

        if (err) {
          cb(err);
          return;
        }

        for (i = 0; i < 4; ++i) {
          type += String.fromCharCode(bytes[i]);
        }

        if (type === 'vide') {
          _this.track.type = 1;
        } else if (type === 'soun') {
          _this.track.type = 2;
        }
        cb(null);
      });
    });
  };

  ISOBMFFMedia.prototype.parseMinf_ = function parseMinf_(atom, cb) {
    console.log('parsing minf atom');
    this.parseAtoms_(atom, cb);
  };

  ISOBMFFMedia.prototype.parseStbl_ = function parseStbl_(atom, cb) {
    console.log('parsing stbl atom');
    this.parseAtoms_(atom, cb);
  };

  function decToHex(d, padding) {
    var hex = Number(d).toString(16);
    var pad = padding;

    pad = typeof (pad) === 'undefined' || pad === null ? pad = 2 : pad;
    while (hex.length < pad) {
      hex = '0' + hex;
    }
    return hex;
  }

  ISOBMFFMedia.prototype.parseAvcC_ = function parseAvcC_(atom, cb) {
    var _this = this;

    console.log('parsing avcC atom');
    this.dataStream.skip(1);
    this.dataStream.readByte(function parseAvcCProfile(err, profile) {
      if (err) {
        cb(err);
        return;
      }

      _this.dataStream.readByte(function parseAvcCCompat(err, compat) {
        if (err) {
          cb(err);
          return;
        }

        _this.dataStream.readByte(function parseAvcCLevel(err, level) {
          if (err) {
            cb(err);
            return;
          }

          _this.track.codec += '.' + decToHex(profile);
          _this.track.codec += decToHex(compat);
          _this.track.codec += decToHex(level);

          _this.tracks.push(_this.track);
          cb(null);
        });
      });
    });
  };

  ISOBMFFMedia.prototype.parseSampleVideo_ =
    function parseSampleVideo_(atom, cb) {
      var _this = this;

      this.dataStream.skip(16);
      this.dataStream.readUShort(function readSampleVideoWidthCb(err, width) {
        if (err) {
          cb(err);
          return;
        }

        _this.track.width = width;
        _this.dataStream.readUShort(
          function readSampleVideoHeightCb(err, height) {
            if (err) {
              cb(err);
              return;
            }

            _this.track.height = height;
            _this.dataStream.skip(46);
            _this.dataStream.readUShort(
              function readSampleVideoDepth(err, bitDepth) {
                if (err) {
                  cb(err);
                  return;
                }

                _this.track.bitDepth = bitDepth;
                _this.dataStream.skip(2);
                _this.parseAtoms_(atom, cb);
              });
          });
      });
    };

  ISOBMFFMedia.prototype.parseSampleAudio_ =
    function parseSampleAudio_(atom, cb) {
      var _this = this;

      this.dataStream.skip(8);
      this.dataStream.readUShort(
        function readSampleAudioNumChannels(err, channels) {
          if (err) {
            cb(err);
            return;
          }

          _this.track.channels = channels;
          _this.dataStream.skip(6);
          _this.dataStream.readUShort(
            function readSampleAudioSamplingFreq(err, freq) {
              if (err) {
                cb(err);
                return;
              }

              _this.track.samplingFrequency = freq;
              _this.dataStream.skip(2);
              _this.parseAtoms_(atom, cb);
            });
        });
    };

  ISOBMFFMedia.prototype.parseEsds_ = function parseEsds_(atom, cb) {
    var _this = this;
    var length;

    console.log('parsing esds atom');
    this.dataStream.readByte(function parseEsdsVersion(err, version) {
      if (err) {
        cb(err);
        return;
      }

      if (version) {
        cb(new Error('invalid esds version'));
        return;
      }

      _this.dataStream.skip(3);
      _this.dataStream.readByte(function parseEsdsType(err, type) {
        if (err) {
          cb(err);
          return;
        }

        if (type === 0x3) {
          _this.dataStream.skip(4);
        } else {
          _this.dataStream.skip(2);
        }

        _this.dataStream.readByte(function parseEsdsByte(err, byte) {
          if (err) {
            cb(err);
            return;
          }

          if (byte !== 0x4) {
            cb(new Error('invalid esds byte'));
            return;
          }

          _this.dataStream.readByte(function parseEsdsRange(err, range) {
            if (err) {
              cb(err);
              return;
            }

            if (range < 15) {
              cb(new Error('invalid esds range'));
              return;
            }

            _this.dataStream.readByte(function parseEsdsObjectTypeId(err, objectTypeId) {
              if (err) {
                cb(err);
                return;
              }

              _this.dataStream.skip(12);
              _this.dataStream.readByte(function parseEsdsObjectTypeId(err, check) {
                if (err) {
                  cb(err);
                  return;
                }

                if (check !== 5) {
                  cb(new Error('invalid esds check'));
                  return;
                }

                _this.dataStream.readByte(function parseEsdsObjectTypeId(err, toSkip) {
                  if (err) {
                    cb(err);
                    return;
                  }

                  _this.dataStream.skip(toSkip);
                  _this.dataStream.readByte(function parseEsdsObjectTypeId(err, secondcheck) {
                    if (err) {
                      cb(err);
                      return;
                    }

                    if (secondcheck !== 6) {
                      cb(new Error('invalid esds second check'));
                      return;
                    }

                    _this.dataStream.readByte(function parseEsdsSLConfigLength(err, SLConfigLength) {
                      if (err) {
                        cb(err);
                        return;
                      }

                      if (SLConfigLength !== 1) {
                        cb(new Error('invalid esds SLConfigLength'));
                        return;
                      }

                      _this.dataStream.readByte(function parseEsdsSLConfigLength(err, SLConfig) {
                        if (err) {
                          cb(err);
                          return;
                        }

                        _this.track.codec += '.' + decToHex(objectTypeId);
                        _this.track.codec += '.' + SLConfig.toString(16);
                        _this.tracks.push(_this.track);
                        _this.parseAtoms_(atom, cb);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  ISOBMFFMedia.prototype.parseStsdEntry_ = function parseStsdEntry_(atom, cb) {
    var _this = this;

    _this.dataStream.readUInteger(function readStsdEntrySizeCb(err, size) {
      if (err) {
        cb(err);
        return;
      }

      _this.dataStream.read(4, function readStsdEntryCodecCb(err, bytes) {
        var i;
        var codec = '';

        if (err) {
          cb(err);
          return;
        }

        for (i = 0; i < 4; ++i) {
          codec += String.fromCharCode(bytes[i]);
        }

        _this.track.codec = codec;
        _this.dataStream.skip(8);
        if (codec === 'avc1') {
          console.log('avc1 codec');
          _this.parseSampleVideo_(atom, cb);
        } else if (codec === 'mp4a') {
          console.log('mp4a codec');
          _this.parseSampleAudio_(atom, cb);
        } else {
          console.warn('unknown stsd codec', codec);
        }
      });
    });
  };

  ISOBMFFMedia.prototype.parseStsd_ = function parseStsd_(atom, cb) {
    var _this = this;

    console.log('parsing stsd atom');
    this.parseAtomHeaders_(function parseTkhdHeadersCb(err, version, flags) {
      if (err) {
        cb(err);
        return;
      }

      if (version) {
        cb(new Error('invalid version'));
        return;
      }

      _this.dataStream.readUInteger(function parseStsdCountCb(err, count) {
        var i = 0;

        _this.parseStsdEntry_(atom, function parseStsdEntryCb(err) {
          if (err) {
            cb(err);
            return;
          }

          if (++i < count) {
            _this.parseStsdEntry_(parseStsdEntryCb);
            return;
          }

          cb(null);
        });
      });
    });
  };

  ISOBMFFMedia.prototype.parseSidxReference_ =
    function parseSidxReference_(offset, time, cb) {
      var _this = this;

      this.dataStream.readUInteger(
        function readSidxReferenceHeaderCb(err, head) {
          if (err) {
            cb(err);
            return;
          }

          _this.dataStream.readUInteger(
            function readSixReferenceDurationCb(err, duration) {
              var timecode = time;
              var newOffset = offset;
              var cue;

              if (err) {
                cb(err);
                return;
              }

              cue = {
                timecode: timecode * 1000,
                offset: newOffset
              };

              _this.cues.push(cue);
              _this.dataStream.skip(4);
              cb(null, newOffset + (head & 0x8FFFFFFF),
                timecode + (duration / _this.timecodeScale));
            });
        });
    };

  ISOBMFFMedia.prototype.parseSidx_ = function parseSidx_(atom, cb) {
    var _this = this;

    console.log('parsing sidx atom');
    this.parseAtomHeaders_(function parseSidxHeadersCb(err, version, flags) {
      if (err) {
        cb(err);
        return;
      }

      _this.dataStream.skip(4);
      _this.dataStream.readUInteger(function readSidxTimecodeScale(err, scale) {
        var readMethod;

        if (err) {
          cb(err);
          return;
        }

        _this.timecodeScale = scale;
        if (version === 0) {
          readMethod = 'readUInteger';
        } else {
          readMethod = 'readUInteger64';
        }

        _this.dataStream[readMethod](
          function readEarliestPresentationTime(err, ept) {
            if (err) {
              cb(err);
              return;
            }

            _this.dataStream[readMethod](
              function readFirstOffset(err, firstOffset) {
                if (err) {
                  cb(err);
                  return;
                }

                _this.dataStream.skip(2);
                _this.dataStream.readUShort(
                  function readSidxRefCount(err, count) {
                    var i = 0;

                    if (err) {
                      cb(err);
                      return;
                    }

                    _this.parseSidxReference_(atom.offset + atom.length +
                      firstOffset, ept / _this.timecodeScale,
                      function parseSidxReferenceCb(err, offset, timecode) {
                        if (err) {
                          cb(err);
                          return;
                        }

                        if (++i < count) {
                          _this.parseSidxReference_(offset, timecode,
                            parseSidxReferenceCb);
                          return;
                        }

                        cb(null);
                      });
                  });
              });
          });
      });
    });
  };

  ISOBMFFMedia.prototype.parseAtoms_ = function parseAtoms_(parent, cb) {
    var _this = this;

    this.readNextAtom_(function readNextAtomCb(err, atom) {
      var i;
      var hexId;
      var strId = '';
      var methodName;

      if (err) {
        cb(err);
        return;
      }

      hexId = atom.id.toString(16);
      for (i = 0; i < hexId.length; i += 2) {
        strId += String.fromCharCode(parseInt(hexId.substr(i, 2), 16));
      }

      methodName = 'parse' + strId.charAt(0).toUpperCase() +
        strId.slice(1) + '_';

      if (methodName === 'parseMoof_') {
        _this.initSegmentLength = _this.dataStream.offset;
        _this.dataStream.seek(0);
        _this.dataStream.read(_this.initSegmentLength - 8, function readInit(err, initSegment) {
          _this.initSegment = initSegment;
          cb(null);
        });
        return;
      }

      console.log('trying to call', methodName);
      if (ISOBMFFMedia.prototype.hasOwnProperty(methodName)) {
        _this[methodName].call(_this, atom, function parseAtomCb(err) {
          if (err) {
            cb(err);
            return;
          }

          parent.children.push(atom);

          if (atom.offset + atom.length >= parent.offset + parent.length) {
            cb(null);
            return;
          }

          _this.dataStream.seek(atom.offset + atom.length);
          _this.readNextAtom_(readNextAtomCb);
        });
        return;
      }

      parent.children.push(atom);

      if (atom.offset + atom.length >= parent.offset + parent.length) {
        cb(null);
        return;
      }

      _this.dataStream.seek(atom.offset + atom.length);
      _this.readNextAtom_(readNextAtomCb);
    });
  };

  /**
   * @function ISOBMFFMedia#init
   * @param cb
   */
  ISOBMFFMedia.prototype.init = function init(cb) {
    var _this = this;

    if (this.initialized) {
      cb(null);
      return;
    }

    this.root = {
      id: 0,
      offset: 0,
      length: this.dataStream.size(),
      children: [],
      bytes: null
    };

    this.dataStream.seek(0);
    this.parseAtoms_(this.root, function parseAtomsCb(err) {
      if (err) {
        cb(err);
        return;
      }

      _this.initMimeType_();
      console.log(_this.root);
      console.log(_this.cues);
      console.log(_this.mimeType);
      _this.initialized = true;
      cb();
    });
  };

  ISOBMFFMedia.prototype.initMimeType_ = function initMimeType_() {
    var i;
    var l;
    var track;
    var mimeType;
    var isVideo = false;
    var isAudio = false;
    var codecs = [];
    var type = '';

    for (i = 0, l = this.tracks.length; i < l; ++i) {
      track = this.tracks[i];
      if (track.type === 1) {
        isVideo = true;
      } else if (track.type === 2) {
        isAudio = true;
      }

      codecs.push(track.codec);
    }

    if (isVideo) {
      type = 'video/mp4';
    } else if (isAudio) {
      type = 'audio/mp4';
    }

    mimeType = type + ';codecs="';
    for (i = 0; i < codecs.length; ++i) {
      mimeType += codecs[i];
      if (i + 1 !== codecs.length) {
        mimeType += ',';
      }
    }

    this.mimeType = mimeType + '"';
  };

  ISOBMFFMedia.prototype.getInitSegment = function getInitSegment(cb) {
    var _this = this;

    if (!this.initialized) {
      this.init(function initCb(error) {
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

  ISOBMFFMedia.prototype.findCueAtTimecode = function findCueAtTimecode(timecode) {
    var index;
    var length = this.cues.length;
    var cue;

    for (index = 0; index < length; ++index) {
      cue = this.cues[index];
      if (cue.timecode === timecode) {
        return cue;
      }
    }

    return null;
  };

  ISOBMFFMedia.prototype.getMediaSegment =
    function getMediaSegment(timecode, cb) {
      var _this = this;
      var cue;

      if (!this.initialized) {
        this.init(function initCb(error) {
          if (error) {
            cb(error);
            return;
          }

          _this.getMediaSegment(timecode, cb);
        });
        return;
      }

      cue = this.findCueAtTimecode(timecode);
      if (!cue) {
        cb(new Error('Unknown timecode'));
        return;
      }

      this.dataStream.seek(cue.offset);
      this.dataStream.readUInteger(function readMoofLengthCb(err, moofLength) {
        if (err) {
          cb(err);
          return;
        }

        _this.dataStream.read(moofLength - 4, function readMoofBytes(err, moofBytes) {
          if (err) {
            cb(err);
            return;
          }

          _this.dataStream.readUInteger(function readMdatLengthCb(err, mdatLength) {
            if (err) {
              cb(err);
              return;
            }

            _this.dataStream.read(mdatLength, function readMdatBytes(err, mdatBytes) {
              var segment;
              var buffer;

              if (err) {
                cb(err);
                return;
              }

              segment = new Uint8Array(moofLength + mdatLength + 8);

              buffer = new Peeracle.MemoryDataStream({buffer: segment});
              buffer.writeUInteger(moofLength);
              buffer.write(moofBytes);
              buffer.writeUInteger(mdatLength);
              buffer.write(mdatBytes);

              cb(null, segment);
            });
          });
        });
      });
    };

  /**
   * @typedef {Object} ISOBMFFAtom
   * @property {number} id
   * @property {number} offset
   * @property {number} length
   * @property {Array<ISOBMFFAtom>} children
   */

  return ISOBMFFMedia;
})();

// @exclude
module.exports = Peeracle.ISOBMFFMedia;
// @endexclude
