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

'use strict';

(function() {
  var Peeracle = {};

  /* eslint-disable */

  Peeracle.DataStream = (function() {
    /**
     * @interface DataStream
     */
    /* istanbul ignore next */
    function DataStream(options) {}

    /**
     * @function DataStream#length
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.length = function length() {};

    /**
     * @function DataStream#tell
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.tell = function tell() {};

    /**
     * @function DataStream#seek
     * @param {number} position
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.seek = function seek(position) {};

    /**
     * @function DataStream#read
     * @param {number} length
     * @return {Uint8Array}
     */
    /* istanbul ignore next */
    DataStream.prototype.read = function read(length) {};

    /**
     * @function DataStream#readChar
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readChar = function readChar() {};

    /**
     * @function DataStream#readByte
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readByte = function readByte() {};

    /**
     * @function DataStream#readShort
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readShort = function readShort() {};

    /**
     * @function DataStream#readUShort
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readUShort = function readUShort() {};

    /**
     * @function DataStream#readInteger
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readInteger = function readInteger() {};

    /**
     * @function DataStream#readUInteger
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readUInteger = function readUInteger() {};

    /**
     * @function DataStream#readFloat
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readFloat = function readFloat() {};

    /**
     * @function DataStream#readDouble
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readDouble = function readDouble() {};

    /**
     * @function DataStream#readString
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.readString = function readString() {};

    /**
     * @function DataStream#peek
     * @param {number} length
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peek = function peek(length) {};

    /**
     * @function DataStream#peekChar
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekChar = function peekChar() {};

    /**
     * @function DataStream#peekByte
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekByte = function peekByte() {};

    /**
     * @function DataStream#peekShort
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekShort = function peekShort() {};

    /**
     * @function DataStream#peekUShort
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekUShort = function peekUShort() {};

    /**
     * @function DataStream#peekInteger
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekInteger = function peekInteger() {};

    /**
     * @function DataStream#peekUInteger
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekUInteger = function peekUInteger() {};

    /**
     * @function DataStream#peekFloat
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekFloat = function peekFloat() {};

    /**
     * @function DataStream#peekDouble
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekDouble = function peekDouble() {};

    /**
     * @function DataStream#peekString
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.peekString = function peekString() {};

    /**
     * @function DataStream#write
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.write = function write(bytes) {};

    /**
     * @function DataStream#writeChar
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeChar = function writeChar(value) {};

    /**
     * @function DataStream#writeByte
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeByte = function writeByte(value) {};

    /**
     * @function DataStream#writeShort
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeShort = function writeShort(value) {};

    /**
     * @function DataStream#writeUShort
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeUShort = function writeUShort(value) {};

    /**
     * @function DataStream#writeInteger
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeInteger = function writeInteger(value) {};

    /**
     * @function DataStream#writeUInteger
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeUInteger = function writeUInteger(value) {};

    /**
     * @function DataStream#writeFloat
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeFloat = function writeFloat(value) {};

    /**
     * @function DataStream#writeDouble
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeDouble = function writeDouble(value) {};

    /**
     * @function DataStream#writeString
     * @return {number}
     */
    /* istanbul ignore next */
    DataStream.prototype.writeString = function writeString(str) {};

    return DataStream;
  })();

  /* eslint-disable */
  Peeracle.FileDataStream = (function() {
    /* eslint-enable */
    /**
     * @class FileDataStream
     * @constructor
     * @implements {DataStream}
     * @property {number} offset - Current stream's offset
     */
    function FileDataStream(options) {
      this.options = options || {};
      this.offset = 0;
    }

    FileDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
    FileDataStream.prototype.constructor = FileDataStream;

    /**
     * @function FileDataStream#length
     * @return {number}
     */
    FileDataStream.prototype.length = function length() {};

    /**
     * @function FileDataStream#tell
     * @return {number}
     */
    FileDataStream.prototype.tell = function tell() {};

    /**
     * @function FileDataStream#seek
     * @param {number} position
     * @return {number}
     */
    FileDataStream.prototype.seek = function seek(position) {
      this.offset = position;
    };

    /**
     * @function FileDataStream#read
     * @param {number} length
     * @return {Uint8Array}
     */
    FileDataStream.prototype.read = function read(length) {
      this.offset += length;
    };

    /**
     * @function FileDataStream#readChar
     * @return {number}
     */
    FileDataStream.prototype.readChar = function readChar() {};

    /**
     * @function FileDataStream#readByte
     * @return {number}
     */
    FileDataStream.prototype.readByte = function readByte() {};

    /**
     * @function FileDataStream#readShort
     * @return {number}
     */
    FileDataStream.prototype.readShort = function readShort() {};

    /**
     * @function FileDataStream#readUShort
     * @return {number}
     */
    FileDataStream.prototype.readUShort = function readUShort() {};

    /**
     * @function FileDataStream#readInteger
     * @return {number}
     */
    FileDataStream.prototype.readInteger = function readInteger() {};

    /**
     * @function FileDataStream#readUInteger
     * @return {number}
     */
    FileDataStream.prototype.readUInteger = function readUInteger() {};

    /**
     * @function FileDataStream#readFloat
     * @return {number}
     */
    FileDataStream.prototype.readFloat = function readFloat() {};

    /**
     * @function FileDataStream#readDouble
     * @return {number}
     */
    FileDataStream.prototype.readDouble = function readDouble() {};

    /**
     * @function FileDataStream#readString
     * @return {number}
     */
    FileDataStream.prototype.readString = function readString() {};

    /**
     * @function FileDataStream#peek
     * @param {number} length
     * @return {number}
     */
    FileDataStream.prototype.peek = function peek(length) {
      return length;
    };

    /**
     * @function FileDataStream#peekChar
     * @return {number}
     */
    FileDataStream.prototype.peekChar = function peekChar() {};

    /**
     * @function FileDataStream#peekByte
     * @return {number}
     */
    FileDataStream.prototype.peekByte = function peekByte() {};

    /**
     * @function FileDataStream#peekShort
     * @return {number}
     */
    FileDataStream.prototype.peekShort = function peekShort() {};

    /**
     * @function FileDataStream#peekUShort
     * @return {number}
     */
    FileDataStream.prototype.peekUShort = function peekUShort() {};

    /**
     * @function FileDataStream#peekInteger
     * @return {number}
     */
    FileDataStream.prototype.peekInteger = function peekInteger() {};

    /**
     * @function FileDataStream#peekUInteger
     * @return {number}
     */
    FileDataStream.prototype.peekUInteger = function peekUInteger() {};

    /**
     * @function FileDataStream#peekFloat
     * @return {number}
     */
    FileDataStream.prototype.peekFloat = function peekFloat() {};

    /**
     * @function FileDataStream#peekDouble
     * @return {number}
     */
    FileDataStream.prototype.peekDouble = function peekDouble() {};

    /**
     * @function FileDataStream#peekString
     * @return {number}
     */
    FileDataStream.prototype.peekString = function peekString() {};

    /**
     * @function FileDataStream#write
     * @return {number}
     */
    FileDataStream.prototype.write = function write(bytes) {
      return bytes;
    };

    /**
     * @function FileDataStream#writeChar
     * @return {number}
     */
    FileDataStream.prototype.writeChar = function writeChar(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeByte
     * @return {number}
     */
    FileDataStream.prototype.writeByte = function writeByte(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeShort
     * @return {number}
     */
    FileDataStream.prototype.writeShort = function writeShort(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeUShort
     * @return {number}
     */
    FileDataStream.prototype.writeUShort = function writeUShort(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeInteger
     * @return {number}
     */
    FileDataStream.prototype.writeInteger = function writeInteger(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeUInteger
     * @return {number}
     */
    FileDataStream.prototype.writeUInteger = function writeUInteger(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeFloat
     * @return {number}
     */
    FileDataStream.prototype.writeFloat = function writeFloat(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeDouble
     * @return {number}
     */
    FileDataStream.prototype.writeDouble = function writeDouble(value) {
      return value;
    };

    /**
     * @function FileDataStream#writeString
     * @return {number}
     */
    FileDataStream.prototype.writeString = function writeString(str) {
      return str;
    };

    return FileDataStream;
  })();

  /* eslint-disable */
  Peeracle.HttpDataStream = (function() {
    /* eslint-enable */
    /**
     * @class HttpDataStream
     * @constructor
     * @implements {DataStream}
     * @property {number} offset - Current stream's offset
     */
    function HttpDataStream(options) {
      this.options = options || {};
      this.offset = 0;
    }

    HttpDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
    HttpDataStream.prototype.constructor = HttpDataStream;

    /**
     * @function HttpDataStream#length
     * @return {number}
     */
    HttpDataStream.prototype.length = function length() {};

    /**
     * @function HttpDataStream#tell
     * @return {number}
     */
    HttpDataStream.prototype.tell = function tell() {};

    /**
     * @function HttpDataStream#seek
     * @param {number} position
     * @return {number}
     */
    HttpDataStream.prototype.seek = function seek(position) {
      this.offset = position;
    };

    /**
     * @function HttpDataStream#read
     * @param {number} length
     * @return {Uint8Array}
     */
    HttpDataStream.prototype.read = function read(length) {
      this.offset += length;
    };

    /**
     * @function HttpDataStream#readChar
     * @return {number}
     */
    HttpDataStream.prototype.readChar = function readChar() {};

    /**
     * @function HttpDataStream#readByte
     * @return {number}
     */
    HttpDataStream.prototype.readByte = function readByte() {};

    /**
     * @function HttpDataStream#readShort
     * @return {number}
     */
    HttpDataStream.prototype.readShort = function readShort() {};

    /**
     * @function HttpDataStream#readUShort
     * @return {number}
     */
    HttpDataStream.prototype.readUShort = function readUShort() {};

    /**
     * @function HttpDataStream#readInteger
     * @return {number}
     */
    HttpDataStream.prototype.readInteger = function readInteger() {};

    /**
     * @function HttpDataStream#readUInteger
     * @return {number}
     */
    HttpDataStream.prototype.readUInteger = function readUInteger() {};

    /**
     * @function HttpDataStream#readFloat
     * @return {number}
     */
    HttpDataStream.prototype.readFloat = function readFloat() {};

    /**
     * @function HttpDataStream#readDouble
     * @return {number}
     */
    HttpDataStream.prototype.readDouble = function readDouble() {};

    /**
     * @function HttpDataStream#readString
     * @return {number}
     */
    HttpDataStream.prototype.readString = function readString() {};

    /**
     * @function HttpDataStream#peek
     * @param {number} length
     * @return {number}
     */
    HttpDataStream.prototype.peek = function peek(length) {
      return length;
    };

    /**
     * @function HttpDataStream#peekChar
     * @return {number}
     */
    HttpDataStream.prototype.peekChar = function peekChar() {};

    /**
     * @function HttpDataStream#peekByte
     * @return {number}
     */
    HttpDataStream.prototype.peekByte = function peekByte() {};

    /**
     * @function HttpDataStream#peekShort
     * @return {number}
     */
    HttpDataStream.prototype.peekShort = function peekShort() {};

    /**
     * @function HttpDataStream#peekUShort
     * @return {number}
     */
    HttpDataStream.prototype.peekUShort = function peekUShort() {};

    /**
     * @function HttpDataStream#peekInteger
     * @return {number}
     */
    HttpDataStream.prototype.peekInteger = function peekInteger() {};

    /**
     * @function HttpDataStream#peekUInteger
     * @return {number}
     */
    HttpDataStream.prototype.peekUInteger = function peekUInteger() {};

    /**
     * @function HttpDataStream#peekFloat
     * @return {number}
     */
    HttpDataStream.prototype.peekFloat = function peekFloat() {};

    /**
     * @function HttpDataStream#peekDouble
     * @return {number}
     */
    HttpDataStream.prototype.peekDouble = function peekDouble() {};

    /**
     * @function HttpDataStream#peekString
     * @return {number}
     */
    HttpDataStream.prototype.peekString = function peekString() {};

    /**
     * @function HttpDataStream#write
     * @return {number}
     */
    HttpDataStream.prototype.write = function write(bytes) {
      return bytes;
    };

    /**
     * @function HttpDataStream#writeChar
     * @return {number}
     */
    HttpDataStream.prototype.writeChar = function writeChar(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeByte
     * @return {number}
     */
    HttpDataStream.prototype.writeByte = function writeByte(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeShort
     * @return {number}
     */
    HttpDataStream.prototype.writeShort = function writeShort(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeUShort
     * @return {number}
     */
    HttpDataStream.prototype.writeUShort = function writeUShort(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeInteger
     * @return {number}
     */
    HttpDataStream.prototype.writeInteger = function writeInteger(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeUInteger
     * @return {number}
     */
    HttpDataStream.prototype.writeUInteger = function writeUInteger(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeFloat
     * @return {number}
     */
    HttpDataStream.prototype.writeFloat = function writeFloat(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeDouble
     * @return {number}
     */
    HttpDataStream.prototype.writeDouble = function writeDouble(value) {
      return value;
    };

    /**
     * @function HttpDataStream#writeString
     * @return {number}
     */
    HttpDataStream.prototype.writeString = function writeString(str) {
      return str;
    };

    return HttpDataStream;
  })();

  /* eslint-disable */
  Peeracle.MemoryDataStream = (function() {
    /* eslint-enable */
    /**
     * @class MemoryDataStream
     * @constructor
     * @implements {DataStream}
     * @param {Object} options
     * @property {number} offset - Current stream's offset
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
     * @return {number}
     */
    MemoryDataStream.prototype.length = function length() {
      return this.buffer.length;
    };

    /**
     * @function MemoryDataStream#tell
     * @return {number}
     */
    MemoryDataStream.prototype.tell = function tell() {
      return this.offset;
    };

    /**
     * @function MemoryDataStream#seek
     * @param {number} position
     * @throws {RangeError}
     * @return {number}
     */
    MemoryDataStream.prototype.seek = function seek(position) {
      if (position < 0 || position > this.buffer.length) {
        throw new Error('index out of bounds');
      }

      this.offset = position;
      return position;
    };

    /**
     * @function MemoryDataStream#read
     * @param {number} length
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
     * @return {number}
     * @throws {RangeError}
     */
    MemoryDataStream.prototype.readChar = function readChar() {
      var value;

      if (this.offset + 1 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekChar();
      this.offset += 1;
      return value;
    };

    /**
     * @function MemoryDataStream#readByte
     * @return {number}
     * @throws {RangeError}
     */
    MemoryDataStream.prototype.readByte = function readByte() {
      var value;

      if (this.offset + 1 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekByte();
      this.offset += 1;
      return value;
    };

    /**
     * @function MemoryDataStream#readShort
     * @return {number}
     * @throws {RangeError}
     */
    MemoryDataStream.prototype.readShort = function readShort() {
      var value;

      if (this.offset + 2 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekShort();
      this.offset += 2;
      return value;
    };

    /**
     * @function MemoryDataStream#readUShort
     * @return {number}
     * @throws {RangeError}
     */
    MemoryDataStream.prototype.readUShort = function readUShort() {
      var value;

      if (this.offset + 2 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekUShort();
      this.offset += 2;
      return value;
    };

    /**
     * @function MemoryDataStream#readInteger
     * @return {number}
     */
    MemoryDataStream.prototype.readInteger = function readInteger() {
      var value;

      if (this.offset + 4 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekInteger();
      this.offset += 4;
      return value;
    };

    /**
     * @function MemoryDataStream#readUInteger
     * @return {number}
     */
    MemoryDataStream.prototype.readUInteger = function readUInteger() {
      var value;

      if (this.offset + 4 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekUInteger();
      this.offset += 4;
      return value;
    };

    /**
     * @function MemoryDataStream#readFloat
     * @return {number}
     */
    MemoryDataStream.prototype.readFloat = function readFloat() {
      var value;

      if (this.offset + 4 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekFloat();
      this.offset += 4;
      return value;
    };

    /**
     * @function MemoryDataStream#readDouble
     * @return {number}
     */
    MemoryDataStream.prototype.readDouble = function readDouble() {
      var value;

      if (this.offset + 8 > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      value = this.peekDouble();
      this.offset += 8;
      return value;
    };

    /**
     * @function MemoryDataStream#readString
     * @return {number}
     */
    MemoryDataStream.prototype.readString = function readString() {};

    /**
     * @function MemoryDataStream#peek
     * @param {number} length
     * @return {number}
     */
    MemoryDataStream.prototype.peek = function peek(length) {
      if (length < 0 || this.offset + length > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      return this.buffer.subarray(this.offset, this.offset + length);
    };

    /**
     * @function MemoryDataStream#peekChar
     * @return {number}
     */
    MemoryDataStream.prototype.peekChar = function peekChar() {
      return this.dataview.getInt8(this.offset);
    };

    /**
     * @function MemoryDataStream#peekByte
     * @return {number}
     */
    MemoryDataStream.prototype.peekByte = function peekByte() {
      return this.dataview.getUint8(this.offset);
    };

    /**
     * @function MemoryDataStream#peekShort
     * @return {number}
     */
    MemoryDataStream.prototype.peekShort = function peekShort() {
      return this.dataview.getInt16(this.offset);
    };

    /**
     * @function MemoryDataStream#peekUShort
     * @return {number}
     */
    MemoryDataStream.prototype.peekUShort = function peekUShort() {
      return this.dataview.getUint16(this.offset);
    };

    /**
     * @function MemoryDataStream#peekInteger
     * @return {number}
     */
    MemoryDataStream.prototype.peekInteger = function peekInteger() {
      return this.dataview.getInt32(this.offset);
    };

    /**
     * @function MemoryDataStream#peekUInteger
     * @return {number}
     */
    MemoryDataStream.prototype.peekUInteger = function peekUInteger() {
      return this.dataview.getUint32(this.offset);
    };

    /**
     * @function MemoryDataStream#peekFloat
     * @return {number}
     */
    MemoryDataStream.prototype.peekFloat = function peekFloat() {
      return this.dataview.getFloat32(this.offset);
    };

    /**
     * @function MemoryDataStream#peekDouble
     * @return {number}
     */
    MemoryDataStream.prototype.peekDouble = function peekDouble() {
      return this.dataview.getFloat64(this.offset);
    };

    /**
     * @function MemoryDataStream#peekString
     * @return {number}
     */
    MemoryDataStream.prototype.peekString = function peekString() {};

    /**
     * @function MemoryDataStream#write
     * @return {number}
     */
    MemoryDataStream.prototype.write = function write(bytes) {
      return bytes;
    };

    /**
     * @function MemoryDataStream#writeChar
     * @return {number}
     */
    MemoryDataStream.prototype.writeChar = function writeChar(value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeByte
     * @return {number}
     */
    MemoryDataStream.prototype.writeByte = function writeByte(value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeShort
     * @return {number}
     */
    MemoryDataStream.prototype.writeShort = function writeShort(value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeUShort
     * @return {number}
     */
    MemoryDataStream.prototype.writeUShort = function writeUShort(value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeInteger
     * @return {number}
     */
    MemoryDataStream.prototype.writeInteger = function writeInteger(value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeUInteger
     * @return {number}
     */
    MemoryDataStream.prototype.writeUInteger = function writeUInteger(
      value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeFloat
     * @return {number}
     */
    MemoryDataStream.prototype.writeFloat = function writeFloat(value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeDouble
     * @return {number}
     */
    MemoryDataStream.prototype.writeDouble = function writeDouble(value) {
      return value;
    };

    /**
     * @function MemoryDataStream#writeString
     * @return {number}
     */
    MemoryDataStream.prototype.writeString = function writeString(str) {
      return str;
    };

    return MemoryDataStream;
  })();

  window.Peeracle = Peeracle;
})();
