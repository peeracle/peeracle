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
   * @return {Uint8Array}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.read = function read(length) {
    var bytes;

    bytes = this.peek(length);
    this.offset += length;
    return bytes;
  };

  /**
   * @function MemoryDataStream#readChar
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readChar = function readChar() {
    var value = this.peekChar();
    this.offset += 1;

    return value;
  };

  /**
   * @function MemoryDataStream#readByte
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readByte = function readByte() {
    var value = this.peekByte();
    this.offset += 1;

    return value;
  };

  /**
   * @function MemoryDataStream#readShort
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readShort = function readShort() {
    var value = this.peekShort();
    this.offset += 2;

    return value;
  };

  /**
   * @function MemoryDataStream#readUShort
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readUShort = function readUShort() {
    var value = this.peekUShort();
    this.offset += 2;

    return value;
  };

  /**
   * @function MemoryDataStream#readInteger
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readInteger = function readInteger() {
    var value = this.peekInteger();
    this.offset += 4;

    return value;
  };

  /**
   * @function MemoryDataStream#readUInteger
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readUInteger = function readUInteger() {
    var value = this.peekUInteger();
    this.offset += 4;

    return value;
  };

  /**
   * @function MemoryDataStream#readFloat
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readFloat = function readFloat() {
    var value = this.peekFloat();
    this.offset += 4;

    return value;
  };

  /**
   * @function MemoryDataStream#readDouble
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readDouble = function readDouble() {
    var value = this.peekDouble();
    this.offset += 8;

    return value;
  };

  /**
   * @function MemoryDataStream#readString
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.readString = function readString() {
    var str = this.peekString();

    this.offset += str.length;
    if (this.offset + 1 < this.buffer.length) {
      ++this.offset;
    }

    return str;
  };

  /**
   * @function MemoryDataStream#peek
   * @param {Number} length
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peek = function peek(length) {
    if (length < 0 || this.offset + length >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.buffer.subarray(this.offset, this.offset + length);
  };

  /**
   * @function MemoryDataStream#peekChar
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekChar = function peekChar() {
    if (this.offset + 1 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getInt8(this.offset);
  };

  /**
   * @function MemoryDataStream#peekByte
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekByte = function peekByte() {
    if (this.offset + 1 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getUint8(this.offset);
  };

  /**
   * @function MemoryDataStream#peekShort
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekShort = function peekShort() {
    if (this.offset + 2 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getInt16(this.offset);
  };

  /**
   * @function MemoryDataStream#peekUShort
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekUShort = function peekUShort() {
    if (this.offset + 2 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getUint16(this.offset);
  };

  /**
   * @function MemoryDataStream#peekInteger
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekInteger = function peekInteger() {
    if (this.offset + 4 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getInt32(this.offset);
  };

  /**
   * @function MemoryDataStream#peekUInteger
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekUInteger = function peekUInteger() {
    if (this.offset + 4 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getUint32(this.offset);
  };

  /**
   * @function MemoryDataStream#peekFloat
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekFloat = function peekFloat() {
    if (this.offset + 4 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getFloat32(this.offset);
  };

  /**
   * @function MemoryDataStream#peekDouble
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekDouble = function peekDouble() {
    if (this.offset + 8 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    return this.dataview.getFloat64(this.offset);
  };

  /**
   * @function MemoryDataStream#peekString
   * @return {String|null}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.peekString = function peekString() {
    var index = this.offset;
    var length = this.buffer.length;
    var str = null;
    var charCode;

    if (index >= length) {
      throw new RangeError('index out of bounds');
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

    return str;
  };

  /**
   * @function MemoryDataStream#write
   * @return {Number}
   */
  MemoryDataStream.prototype.write = function write(bytes) {
    return bytes;
  };

  /**
   * @function MemoryDataStream#writeChar
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeChar = function writeChar(value) {
    if (this.offset + 1 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setInt8(this.offset, value);
    this.offset += 1;
    return 1;
  };

  /**
   * @function MemoryDataStream#writeByte
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeByte = function writeByte(value) {
    if (this.offset + 1 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setUint8(this.offset, value);
    this.offset += 1;
    return 1;
  };

  /**
   * @function MemoryDataStream#writeShort
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeShort = function writeShort(value) {
    if (this.offset + 2 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setInt16(this.offset, value);
    this.offset += 2;
    return 2;
  };

  /**
   * @function MemoryDataStream#writeUShort
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeUShort = function writeUShort(value) {
    if (this.offset + 2 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setUint16(this.offset, value);
    this.offset += 2;
    return 2;
  };

  /**
   * @function MemoryDataStream#writeInteger
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeInteger = function writeInteger(value) {
    if (this.offset + 4 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setInt32(this.offset, value);
    this.offset += 4;
    return 4;
  };

  /**
   * @function MemoryDataStream#writeUInteger
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeUInteger = function writeUInteger(value) {
    if (this.offset + 4 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setUint32(this.offset, value);
    this.offset += 4;
    return 4;
  };

  /**
   * @function MemoryDataStream#writeFloat
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeFloat = function writeFloat(value) {
    if (this.offset + 4 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setFloat32(this.offset, value);
    this.offset += 4;
    return 4;
  };

  /**
   * @function MemoryDataStream#writeDouble
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeDouble = function writeDouble(value) {
    if (this.offset + 8 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    this.dataview.setFloat64(this.offset, value);
    this.offset += 8;
    return 8;
  };

  /**
   * @function MemoryDataStream#writeString
   * @return {Number}
   * @throws {RangeError}
   */
  MemoryDataStream.prototype.writeString = function writeString(str) {
    var index = 0;
    var length = str.length;

    if (str.length + 1 >= this.buffer.length) {
      throw new RangeError('index out of bounds');
    }

    while (index < length) {
      this.buffer[this.offset + index] = str.charCodeAt(index);
      ++index;
    }

    this.buffer[index] = 0;
    length += 1;
    this.offset += length;
    return length;
  };

  return MemoryDataStream;
})();

// @exclude
module.exports = Peeracle.MemoryDataStream;
// @endexclude
