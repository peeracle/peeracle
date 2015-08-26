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
Peeracle.MemoryDataStream = (function () {
  /* eslint-enable */
  /**
   * @class MemoryDataStream
   * @memberof {Peeracle}
   * @constructor
   * @implements {DataStream}
   * @param {DataStreamOptions} options
   * @property {Number} offset - Current stream's offset
   * @property {Uint8Array} buffer
   * @property {DataView} dataview
   * @throws {TypeError}
   */
  function MemoryDataStream(options) {
    this.options = options || {};

    if ((typeof this.options) !== 'object') {
      throw new TypeError('options should be an object');
    }

    if (!this.options.buffer || !(this.options.buffer instanceof Uint8Array)) {
      throw new TypeError('buffer should be an Uint8Array');
    }

    this.littleEndian = options.littleEndian ? options.littleEndian : false;
    this.buffer = this.options.buffer;
    this.dataview = new DataView(this.buffer.buffer);
    this.offset = 0;
  }

  MemoryDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
  MemoryDataStream.prototype.constructor = MemoryDataStream;

  MemoryDataStream.prototype.length = function length() {
    return this.buffer.length;
  };

  MemoryDataStream.prototype.tell = function tell() {
    return this.offset;
  };

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

  MemoryDataStream.prototype.read = function read(length, cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peek(length);
      this.offset += result.length;
      return result;
    }

    this.peek(length, function peekCb(error, value, len) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += len;
      cb(null, value, len);
    });
  };

  MemoryDataStream.prototype.readChar = function readChar(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekChar();
      this.offset += 1;
      return result;
    }

    this.peekChar(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readByte = function readByte(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekByte();
      this.offset += 1;
      return result;
    }

    this.peekByte(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readShort = function readShort(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekShort();
      this.offset += 2;
      return result;
    }

    this.peekShort(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readUShort = function readUShort(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekUShort();
      this.offset += 2;
      return result;
    }

    this.peekUShort(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readInteger = function readInteger(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekInteger();
      this.offset += 4;
      return result;
    }

    this.peekInteger(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readUInteger = function readUInteger(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekUInteger();
      this.offset += 4;
      return result;
    }

    this.peekUInteger(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readFloat = function readFloat(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekFloat();
      this.offset += 4;
      return result;
    }

    this.peekFloat(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readDouble = function readDouble(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekDouble();
      this.offset += 8;
      return result;
    }

    this.peekDouble(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.readString = function readString(cb) {
    var _this = this;
    var result;

    if (!cb) {
      result = this.peekString();
      this.offset += result.length + 1;
      return result;
    }

    this.peekString(function peekCb(error, value, length) {
      if (error) {
        cb(error);
        return;
      }
      _this.offset += length;
      cb(null, value, length);
    });
  };

  MemoryDataStream.prototype.peek = function peek(length, cb) {
    if (length < 0 || this.offset + length > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.buffer.subarray(this.offset, this.offset + length), length);
      return null;
    }
    return this.buffer.subarray(this.offset, this.offset + length);
  };

  MemoryDataStream.prototype.peekChar = function peekChar(cb) {
    if (this.offset + 1 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getInt8(this.offset), 1);
      return null;
    }
    return this.dataview.getInt8(this.offset);
  };

  MemoryDataStream.prototype.peekByte = function peekByte(cb) {
    if (this.offset + 1 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getUint8(this.offset), 1);
      return null;
    }
    return this.dataview.getUint8(this.offset);
  };

  MemoryDataStream.prototype.peekShort = function peekShort(cb) {
    if (this.offset + 2 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getInt16(this.offset, this.littleEndian), 2);
      return null;
    }
    return this.dataview.getInt16(this.offset, this.littleEndian);
  };

  MemoryDataStream.prototype.peekUShort = function peekUShort(cb) {
    if (this.offset + 2 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getUint16(this.offset, this.littleEndian), 2);
      return null;
    }
    return this.dataview.getUint16(this.offset, this.littleEndian);
  };

  MemoryDataStream.prototype.peekInteger = function peekInteger(cb) {
    if (this.offset + 4 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getInt32(this.offset, this.littleEndian), 4);
      return null;
    }
    return this.dataview.getInt32(this.offset, this.littleEndian);
  };

  MemoryDataStream.prototype.peekUInteger = function peekUInteger(cb) {
    if (this.offset + 4 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getUint32(this.offset, this.littleEndian), 4);
      return null;
    }
    return this.dataview.getUint32(this.offset, this.littleEndian);
  };

  MemoryDataStream.prototype.peekFloat = function peekFloat(cb) {
    if (this.offset + 4 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getFloat32(this.offset, this.littleEndian), 4);
      return null;
    }
    return this.dataview.getFloat32(this.offset, this.littleEndian);
  };

  MemoryDataStream.prototype.peekDouble = function peekDouble(cb) {
    if (this.offset + 8 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    if (cb) {
      cb(null, this.dataview.getFloat64(this.offset, this.littleEndian), 8);
      return null;
    }
    return this.dataview.getFloat64(this.offset, this.littleEndian);
  };

  MemoryDataStream.prototype.peekString = function peekString(cb) {
    var bytesRead = 0;
    var index = this.offset;
    var length = this.buffer.length;
    var str = null;
    var charCode;

    if (index >= length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    while (index < length) {
      charCode = this.buffer[index++];

      ++bytesRead;
      if (charCode === 0) {
        break;
      }

      if (!str) {
        str = '';
      }

      str += String.fromCharCode(charCode);
    }

    if (cb) {
      cb(null, str, bytesRead);
      return null;
    }
    return str;
  };

  MemoryDataStream.prototype.write = function write(bytes, cb) {
    var length;

    if (!(bytes instanceof Uint8Array)) {
      if (cb) {
        cb(new TypeError('argument must be an Uint8Array'));
        return null;
      }
      throw new TypeError('argument must be an Uint8Array');
    }

    length = bytes.length;
    if (this.offset + length > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.buffer.set(bytes, this.offset);
    this.offset += length;
    if (cb) {
      cb(null, length);
      return null;
    }
    return length;
  };

  MemoryDataStream.prototype.writeChar = function writeChar(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 1 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setInt8(this.offset, value);
    this.offset += 1;
    if (cb) {
      cb(null, 1);
      return null;
    }
    return 1;
  };

  MemoryDataStream.prototype.writeByte = function writeByte(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 1 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setUint8(this.offset, value);
    this.offset += 1;
    if (cb) {
      cb(null, 1);
      return null;
    }
    return 1;
  };

  MemoryDataStream.prototype.writeShort = function writeShort(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 2 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setInt16(this.offset, value, this.littleEndian);
    this.offset += 2;
    if (cb) {
      cb(null, 2);
      return null;
    }
    return 2;
  };

  MemoryDataStream.prototype.writeUShort = function writeUShort(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 2 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setUint16(this.offset, value, this.littleEndian);
    this.offset += 2;
    if (cb) {
      cb(null, 2);
      return null;
    }
    return 2;
  };

  MemoryDataStream.prototype.writeInteger = function writeInteger(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 4 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setInt32(this.offset, value, this.littleEndian);
    this.offset += 4;
    if (cb) {
      cb(null, 4);
      return null;
    }
    return 4;
  };

  MemoryDataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 4 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setUint32(this.offset, value, this.littleEndian);
    this.offset += 4;
    if (cb) {
      cb(null, 4);
      return null;
    }
    return 4;
  };

  MemoryDataStream.prototype.writeFloat = function writeFloat(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 4 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setFloat32(this.offset, value, this.littleEndian);
    this.offset += 4;
    if (cb) {
      cb(null, 4);
      return null;
    }
    return 4;
  };

  MemoryDataStream.prototype.writeDouble = function writeDouble(value, cb) {
    if (typeof value !== 'number') {
      if (cb) {
        cb(new TypeError('argument must be a number'));
        return null;
      }
      throw new TypeError('argument must be a number');
    }

    if (this.offset + 8 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    this.dataview.setFloat64(this.offset, value, this.littleEndian);
    this.offset += 8;
    if (cb) {
      cb(null, 8);
      return null;
    }
    return 8;
  };

  MemoryDataStream.prototype.writeString = function writeString(str, cb) {
    var index = 0;
    var length;

    if (typeof str !== 'string') {
      if (cb) {
        cb(new TypeError('argument must be a string'));
        return null;
      }
      throw new TypeError('argument must be a string');
    }

    length = str.length;
    if (this.offset + length + 1 > this.buffer.length) {
      if (cb) {
        cb(new RangeError('index out of bounds'));
        return null;
      }
      throw new RangeError('index out of bounds');
    }

    while (index < length) {
      this.buffer[this.offset + index] = str.charCodeAt(index);
      ++index;
    }

    this.buffer[this.offset + index++] = 0;
    this.offset += index;
    if (cb) {
      cb(null, index);
      return null;
    }
    return index;
  };

  return MemoryDataStream;
})();

// @exclude
module.exports = Peeracle.MemoryDataStream;
// @endexclude
