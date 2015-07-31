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
Peeracle.MemoryDataStream = (function() {
/* eslint-enable */
  /**
   * @class MemoryDataStream
   * @memberof {Peeracle}
   * @constructor
   * @implements {DataStream}
   * @param {Object} options
   * @property {Number} offset - Current stream's offset
   * @property {Uint8Array} buffer
   * @property {DataView} dataview
   * @throws {TypeError}
   */
  function MemoryDataStream(options) {
    this.options = options || {};

    if (!this.options.buffer || !(this.options.buffer instanceof Uint8Array)) {
      throw new TypeError('buffer should be an Uint8Array');
    }

    this.buffer = this.options.buffer;
    this.dataview = new DataView(this.buffer.buffer);
    this.offset = 0;
  }

  MemoryDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
  MemoryDataStream.prototype.constructor = MemoryDataStream;

  /**
   * @function MemoryDataStream#length
   * @return {Number}
   */
  MemoryDataStream.prototype.length = function length() {
    return this.buffer.length;
  };

  /**
   * @function MemoryDataStream#tell
   * @return {Number}
   */
  MemoryDataStream.prototype.tell = function tell() {
    return this.offset;
  };

  /**
   * @function MemoryDataStream#seek
   * @param {Number} position
   * @throws {RangeError}
   * @return {Number}
   */
  MemoryDataStream.prototype.seek = function seek(position) {
    if (typeof position !== 'number') {
      throw new TypeError('argument must be a number');
    }

    if (position < 0 || position > this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.offset = position;
    return position;
  };

  /**
   * @function MemoryDataStream#read
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.read = function read(length, cb) {
    var _this = this;

    this.peek(length, function peekCb(error, value, len) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += len;
      cb(null, value, len);
    });
  };

  /**
   * @function MemoryDataStream#readChar
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readChar = function readChar(cb) {
    var _this = this;

    this.peekChar(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readByte
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readByte = function readByte(cb) {
    var _this = this;

    this.peekByte(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readShort
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readShort = function readShort(cb) {
    var _this = this;

    this.peekShort(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readUShort
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readUShort = function readUShort(cb) {
    var _this = this;

    this.peekUShort(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readInteger
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readInteger = function readInteger(cb) {
    var _this = this;

    this.peekInteger(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readUInteger
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readUInteger = function readUInteger(cb) {
    var _this = this;

    this.peekUInteger(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readFloat
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readFloat = function readFloat(cb) {
    var _this = this;

    this.peekFloat(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readDouble
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readDouble = function readDouble(cb) {
    var _this = this;

    this.peekDouble(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#readString
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readString = function readString(cb) {
    var _this = this;

    this.peekString(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  /**
   * @function MemoryDataStream#peek
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peek = function peek(length, cb) {
    if (length < 0 || this.offset + length >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.buffer.subarray(this.offset, this.offset + length), length);
  };

  /**
   * @function MemoryDataStream#peekChar
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekChar = function peekChar(cb) {
    if (this.offset + 1 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getInt8(this.offset), 1);
  };

  /**
   * @function MemoryDataStream#peekByte
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekByte = function peekByte(cb) {
    if (this.offset + 1 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getUint8(this.offset), 1);
  };

  /**
   * @function MemoryDataStream#peekShort
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekShort = function peekShort(cb) {
    if (this.offset + 2 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getInt16(this.offset), 2);
  };

  /**
   * @function MemoryDataStream#peekUShort
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekUShort = function peekUShort(cb) {
    if (this.offset + 2 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getUint16(this.offset), 2);
  };

  /**
   * @function MemoryDataStream#peekInteger
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekInteger = function peekInteger(cb) {
    if (this.offset + 4 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getInt32(this.offset), 4);
  };

  /**
   * @function MemoryDataStream#peekUInteger
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekUInteger = function peekUInteger(cb) {
    if (this.offset + 4 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getUint32(this.offset), 4);
  };

  /**
   * @function MemoryDataStream#peekFloat
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekFloat = function peekFloat(cb) {
    if (this.offset + 4 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getFloat32(this.offset), 4);
  };

  /**
   * @function MemoryDataStream#peekDouble
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekDouble = function peekDouble(cb) {
    if (this.offset + 8 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    cb(null, this.dataview.getFloat64(this.offset), 8);
  };

  /**
   * @function MemoryDataStream#peekString
   * @param {DataStream~readCallback} cb
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekString = function peekString(cb) {
    var index = this.offset;
    var length = this.buffer.length;
    var str = null;
    var charCode;

    if (index >= length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    while (index < length) {
      charCode = this.buffer[index++];

      if (charCode === 0) {
        break;
      }

      if (!str) {
        str = '';
      }

      str += String.fromCharCode(charCode);
    }

    cb(null, str, index);
  };

  /**
   * @function MemoryDataStream#write
   * @param {Uint8Array} bytes
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.write = function write(bytes, cb) {
    var length;

    if (!(bytes instanceof Uint8Array)) {
      cb(new TypeError('argument must be an Uint8Array'));
      return;
    }

    length = bytes.length;
    if (this.offset + length >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.buffer.set(bytes, this.offset);
    this.offset += length;
    cb(null, length);
  };

  /**
   * @function MemoryDataStream#writeChar
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeChar = function writeChar(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 1 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setInt8(this.offset, value);
    this.offset += 1;
    cb(null, 1);
  };

  /**
   * @function MemoryDataStream#writeByte
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeByte = function writeByte(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 1 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setUint8(this.offset, value);
    this.offset += 1;
    cb(null, 1);
  };

  /**
   * @function MemoryDataStream#writeShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeShort = function writeShort(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 2 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setInt16(this.offset, value);
    this.offset += 2;
    cb(null, 2);
  };

  /**
   * @function MemoryDataStream#writeUShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeUShort = function writeUShort(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 2 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setUint16(this.offset, value);
    this.offset += 2;
    cb(null, 2);
  };

  /**
   * @function MemoryDataStream#writeInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeInteger = function writeInteger(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 4 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setInt32(this.offset, value);
    this.offset += 4;
    cb(null, 4);
  };

  /**
   * @function MemoryDataStream#writeUInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 4 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setUint32(this.offset, value);
    this.offset += 4;
    cb(null, 4);
  };

  /**
   * @function MemoryDataStream#writeFloat
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeFloat = function writeFloat(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 4 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setFloat32(this.offset, value);
    this.offset += 4;
    cb(null, 4);
  };

  /**
   * @function MemoryDataStream#writeDouble
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeDouble = function writeDouble(value, cb) {
    if (typeof value !== 'number') {
      cb(new TypeError('argument must be a number'));
      return;
    }

    if (this.offset + 8 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    this.dataview.setFloat64(this.offset, value);
    this.offset += 8;
    cb(null, 8);
  };

  /**
   * @function MemoryDataStream#writeString
   * @param {String} str
   * @param {DataStream~writeCallback} cb
   * @throws {TypeError|RangeError}
   */
  MemoryDataStream.prototype.writeString = function writeString(str, cb) {
    var index = 0;
    var length;

    if (typeof str !== 'string') {
      cb(new TypeError('argument must be a string'));
      return;
    }

    length = str.length;
    if (length + 1 >= this.buffer.length) {
      cb(new RangeError('index out of bounds'));
      return;
    }

    while (index < length) {
      this.buffer[this.offset + index] = str.charCodeAt(index);
      ++index;
    }

    this.buffer[index++] = 0;
    this.offset += index;
    cb(null, index);
  };

  return MemoryDataStream;
})();

// @exclude
module.exports = Peeracle.MemoryDataStream;
// @endexclude
