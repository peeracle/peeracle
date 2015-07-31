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
Peeracle.FileDataStream = (function() {
/* eslint-enable */
  /**
   * @class FileDataStream
   * @memberof {Peeracle}
   * @constructor
   * @implements {DataStream}
   * @property {Number} offset - Current stream's offset
   */
  function FileDataStream(options) {
    this.options = options || {};
    this.offset = 0;
  }

  FileDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
  FileDataStream.prototype.constructor = FileDataStream;

  /**
   * @function FileDataStream#length
   * @return {Number}
   */
  FileDataStream.prototype.length = function length() {
  };

  /**
   * @function FileDataStream#tell
   * @return {Number}
   */
  FileDataStream.prototype.tell = function tell() {
  };

  /**
   * @function FileDataStream#seek
   * @param {Number} position
   * @return {Number}
   */
  FileDataStream.prototype.seek = function seek(position) {
    this.offset = position;
  };

  /**
   * @function FileDataStream#read
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.read = function read(length, cb) {
    this.offset += length;
    cb(null);
  };

  /**
   * @function FileDataStream#readChar
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readChar = function readChar(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readByte
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readByte = function readByte(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readShort
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readShort = function readShort(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readUShort
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readUShort = function readUShort(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readInteger
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readInteger = function readInteger(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readUInteger
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readUInteger = function readUInteger(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readFloat
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readFloat = function readFloat(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readDouble
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readDouble = function readDouble(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#readString
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.readString = function readString(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peek
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peek = function peek(length, cb) {
    cb(null);
    return length;
  };

  /**
   * @function FileDataStream#peekChar
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekChar = function peekChar(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekByte
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekByte = function peekByte(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekShort
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekShort = function peekShort(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekUShort
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekUShort = function peekUShort(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekInteger
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekInteger = function peekInteger(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekUInteger
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekUInteger = function peekUInteger(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekFloat
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekFloat = function peekFloat(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekDouble
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekDouble = function peekDouble(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#peekString
   * @param {DataStream~readCallback} cb
   */
  FileDataStream.prototype.peekString = function peekString(cb) {
    cb(null);
  };

  /**
   * @function FileDataStream#write
   * @param {Uint8Array} bytes
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.write = function write(bytes, cb) {
    cb(null);
    return bytes;
  };

  /**
   * @function FileDataStream#writeChar
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeChar = function writeChar(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeByte
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeByte = function writeByte(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeShort = function writeShort(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeUShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeUShort = function writeUShort(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeInteger = function writeInteger(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeUInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeFloat
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeFloat = function writeFloat(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeDouble
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeDouble = function writeDouble(value, cb) {
    cb(null);
    return value;
  };

  /**
   * @function FileDataStream#writeString
   * @param {String} str
   * @param {DataStream~writeCallback} cb
   */
  FileDataStream.prototype.writeString = function writeString(str, cb) {
    cb(null);
    return str;
  };

  return FileDataStream;
})();

// @exclude
module.exports = Peeracle.FileDataStream;
// @endexclude
