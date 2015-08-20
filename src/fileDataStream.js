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
var fs = require('fs');
// @endexclude

/* eslint-disable */
Peeracle.FileDataStream = (function () {
  /* eslint-enable */
  /**
   * @class FileDataStream
   * @memberof {Peeracle}
   * @constructor
   * @implements {DataStream}
   * @param {DataStreamOptions} options
   * @property {Number} offset - Current stream's offset
   */
  function FileDataStream(options) {
    // @exclude
    var stat;
    this.options = options;
    if (typeof module === 'undefined') {
    // @endexclude
      this.handle = options;
    // @exclude
    }
    // @endexclude
    this.offset = 0;
    this.littleEndian = this.options.littleEndian ?
      this.options.littleEndian : false;
    // @exclude
    if ((typeof this.options) !== 'object') {
      throw new TypeError('options should be an object');
    }

    if (!this.options.hasOwnProperty('path') ||
      (typeof this.options.path) !== 'string') {
      throw new TypeError('options.path should be a string');
    }

    if (!this.options.hasOwnProperty('mode') ||
      (typeof this.options.mode) !== 'string') {
      this.options.mode = 'r';
    }

    try {
      this.handle = fs.openSync(this.options.path, this.options.mode);
      stat = fs.fstatSync(this.handle);
      this.length = stat.size;
    } catch (e) {
      throw e;
    }
    // @endexclude
  }

  FileDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
  FileDataStream.prototype.constructor = FileDataStream;

  FileDataStream.prototype.close = function close() {
    // @exclude
    fs.closeSync(this.handle);
    // @endexclude
  };

  FileDataStream.prototype.length = function length() {
    return this.length;
  };

  FileDataStream.prototype.tell = function tell() {
    return this.offset;
  };

  FileDataStream.prototype.seek = function seek(position) {
    this.offset = position;
  };

  FileDataStream.prototype.read = function read(length, cb) {
    var _this = this;

    this.peek(length, function peekCb(error, bytes, count) {
      if (error) {
        cb(error);
        return;
      }

      _this.offset += count;
      cb(null, bytes, count);
    });
  };

  FileDataStream.prototype.readChar = function readChar(cb) {
    this.read(1, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getInt8(), length);
    });
  };

  FileDataStream.prototype.readByte = function readByte(cb) {
    this.read(1, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getUint8(), length);
    });
  };

  FileDataStream.prototype.readShort = function readShort(cb) {
    this.read(2, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getInt16(), length);
    });
  };

  FileDataStream.prototype.readUShort = function readUShort(cb) {
    this.read(2, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getUint16(), length);
    });
  };

  FileDataStream.prototype.readInteger = function readInteger(cb) {
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getInt32(), length);
    });
  };

  FileDataStream.prototype.readUInteger = function readUInteger(cb) {
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getUint32(), length);
    });
  };

  FileDataStream.prototype.readFloat = function readFloat(cb) {
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getFloat32(), length);
    });
  };

  FileDataStream.prototype.readDouble = function readDouble(cb) {
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getFloat64(), length);
    });
  };

  FileDataStream.prototype.readString = function readString(cb) {
    var stringLength = 0;
    var str = '';

    this.readChar(function peekCharCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }

      if (!value || !length) {
        cb(null, str, stringLength);
        return;
      }

      str += value;
      ++stringLength;
      this.readChar(peekCharCb);
    });
  };

  FileDataStream.prototype.peek = function peek(length, cb) {
    var reader;
    // @exclude
    if (typeof module !== 'undefined') {
      fs.read(this.handle, new Buffer(length), 0, length, this.offset,
        function peekCb(error, bytesRead, buffer) {
          if (error) {
            cb(error);
            return;
          }

          cb(null, new Uint8Array(buffer), bytesRead);
        });
      return;
    }
    // @endexclude
    reader = new FileReader();
    reader.onabort = function onabortCb() {
      cb(new Error('Aborted'));
    };
    reader.onerror = function onerrorCb(e) {
      cb(e);
    };
    reader.onloadend = function onloadendCb(e) {
      var bytes = new Uint8Array(e.target.result);
      cb(null, bytes, bytes.length);
    };
    reader.readAsArrayBuffer(this.handle.slice(this.offset,
      this.offset + length));
  };

  FileDataStream.prototype.peekChar = function peekChar(cb) {
    this.peek(1, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getInt8(), length);
    });
  };

  FileDataStream.prototype.peekByte = function peekByte(cb) {
    this.peek(1, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getUint8(), length);
    });
  };

  FileDataStream.prototype.peekShort = function peekShort(cb) {
    this.peek(2, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getInt16(), length);
    });
  };

  FileDataStream.prototype.peekUShort = function peekUShort(cb) {
    this.peek(2, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getUint16(), length);
    });
  };

  FileDataStream.prototype.peekInteger = function peekInteger(cb) {
    this.peek(4, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getInt32(), length);
    });
  };

  FileDataStream.prototype.peekUInteger = function peekUInteger(cb) {
    this.peek(4, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getUint32(), length);
    });
  };

  FileDataStream.prototype.peekFloat = function peekFloat(cb) {
    this.peek(4, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getFloat32(), length);
    });
  };

  FileDataStream.prototype.peekDouble = function peekDouble(cb) {
    this.peek(8, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes);
      cb(null, dataView.getFloat64(), length);
    });
  };

  FileDataStream.prototype.peekString = function peekString(cb) {
    var stringLength = 0;
    var str = '';

    this.peekChar(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }

      if (!value || !length) {
        cb(null, str, stringLength);
        return;
      }

      str += value;
      ++stringLength;
      this.readChar(peekCb);
    });
  };

  FileDataStream.prototype.write = function write(bytes, cb) {
    cb(null);
    return bytes;
  };

  FileDataStream.prototype.writeChar = function writeChar(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeByte = function writeByte(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeShort = function writeShort(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeUShort = function writeUShort(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeInteger = function writeInteger(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeFloat = function writeFloat(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeDouble = function writeDouble(value, cb) {
    cb(null);
    return value;
  };

  FileDataStream.prototype.writeString = function writeString(str, cb) {
    cb(null);
    return str;
  };

  return FileDataStream;
})();

// @exclude
module.exports = Peeracle.FileDataStream;
// @endexclude
