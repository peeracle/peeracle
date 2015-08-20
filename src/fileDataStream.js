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

      dataView = new DataView(bytes.buffer);
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

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getUint8(), length);
    });
  };

  FileDataStream.prototype.readShort = function readShort(cb) {
    var _this = this;
    this.read(2, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getInt16(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.readUShort = function readUShort(cb) {
    var _this = this;
    this.read(2, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getUint16(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.readInteger = function readInteger(cb) {
    var _this = this;
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getInt32(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.readUInteger = function readUInteger(cb) {
    var _this = this;
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getUint32(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.readFloat = function readFloat(cb) {
    var _this = this;
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getFloat32(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.readDouble = function readDouble(cb) {
    var _this = this;
    this.read(4, function readCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getFloat64(0, _this.littleEndian), length);
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

      dataView = new DataView(bytes.buffer);
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

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getUint8(), length);
    });
  };

  FileDataStream.prototype.peekShort = function peekShort(cb) {
    var _this = this;
    this.peek(2, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getInt16(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.peekUShort = function peekUShort(cb) {
    var _this = this;
    this.peek(2, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getUint16(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.peekInteger = function peekInteger(cb) {
    var _this = this;
    this.peek(4, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getInt32(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.peekUInteger = function peekUInteger(cb) {
    var _this = this;
    this.peek(4, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getUint32(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.peekFloat = function peekFloat(cb) {
    var _this = this;
    this.peek(4, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getFloat32(0, _this.littleEndian), length);
    });
  };

  FileDataStream.prototype.peekDouble = function peekDouble(cb) {
    var _this = this;
    this.peek(8, function peekCb(error, bytes, length) {
      /** @type {DataView} */
      var dataView;

      if (error) {
        cb(error);
        return;
      }

      dataView = new DataView(bytes.buffer);
      cb(null, dataView.getFloat64(0, _this.littleEndian), length);
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
    // @exclude
    var _this = this;
    fs.write(this.handle, new Buffer(bytes), 0, bytes.length, this.offset,
      function writeCb(error, written) {
        if (error) {
          cb(error);
          return;
        }

        _this.offset += written;
        cb(null, written);
      });
    // @endexclude
  };

  FileDataStream.prototype.writeChar = function writeChar(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(1);

    dataView = new DataView(bytes.buffer);
    dataView.setInt8(0, value);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeByte = function writeByte(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(1);

    dataView = new DataView(bytes.buffer);
    dataView.setUint8(0, value);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeShort = function writeShort(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(2);

    dataView = new DataView(bytes.buffer);
    dataView.setInt16(0, value, this.littleEndian);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeUShort = function writeUShort(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(2);

    dataView = new DataView(bytes.buffer);
    dataView.setUint16(0, value, this.littleEndian);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeInteger = function writeInteger(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(4);

    dataView = new DataView(bytes.buffer);
    dataView.setInt32(0, value, this.littleEndian);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(4);

    dataView = new DataView(bytes.buffer);
    dataView.setUint32(0, value, this.littleEndian);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeFloat = function writeFloat(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(4);

    dataView = new DataView(bytes.buffer);
    dataView.setFloat32(0, value, this.littleEndian);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeDouble = function writeDouble(value, cb) {
    // @exclude
    /** @type {DataView} */
    var dataView;
    var bytes = new Uint8Array(8);

    dataView = new DataView(bytes.buffer);
    dataView.setFloat64(0, value, this.littleEndian);
    this.write(bytes, cb);
    // @endexclude
  };

  FileDataStream.prototype.writeString = function writeString(str, cb) {
    // @exclude
    var index = 0;
    var length = str.length;
    var bytes = new Uint8Array(length + 1);

    while (index < length) {
      bytes.set([str.charCodeAt(index)], index);
      ++index;
    }

    bytes.set([0], index);
    this.write(bytes, cb);
    // @endexclude
  };

  return FileDataStream;
})();

// @exclude
module.exports = Peeracle.FileDataStream;
// @endexclude
