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
// var XMLHttpRequest = require('xhr2');
// @endexclude

/* eslint-disable */
Peeracle.HttpDataStream = (function() {
  /* eslint-enable */
  /**
   * @class HttpDataStream
   * @memberof Peeracle
   * @constructor
   * @implements DataStream
   * @property {Number} offset - Current stream's offset
   */
  function HttpDataStream(options) {
    this.options = options || {};
    this.offset = 0;
  }

  HttpDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
  HttpDataStream.prototype.constructor = HttpDataStream;

  /**
   * @function HttpDataStream#length
   * @return {Number}
   */
  HttpDataStream.prototype.length = function length() {
  };

  /**
   * @function HttpDataStream#tell
   * @return {Number}
   */
  HttpDataStream.prototype.tell = function tell() {
  };

  /**
   * @function HttpDataStream#seek
   * @param {Number} position
   * @return {Number}
   */
  HttpDataStream.prototype.seek = function seek(position) {
    this.offset = position;
  };

  /**
   * @function HttpDataStream#read
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.read = function read(length, cb) {
    this.offset += length;
    cb(null);
  };

  /**
   * @function HttpDataStream#readChar
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readChar = function readChar(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readByte
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readByte = function readByte(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readShort
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readShort = function readShort(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readUShort
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readUShort = function readUShort(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readInteger
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readInteger = function readInteger(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readUInteger
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readUInteger = function readUInteger(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readFloat
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readFloat = function readFloat(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readDouble
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readDouble = function readDouble(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#readString
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.readString = function readString(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peek
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peek = function peek(length, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekChar
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekChar = function peekChar(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekByte
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekByte = function peekByte(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekShort
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekShort = function peekShort(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekUShort
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekUShort = function peekUShort(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekInteger
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekInteger = function peekInteger(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekUInteger
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekUInteger = function peekUInteger(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekFloat
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekFloat = function peekFloat(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekDouble
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekDouble = function peekDouble(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#peekString
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peekString = function peekString(cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#write
   * @param {Uint8Array} bytes
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.write = function write(bytes, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeChar
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeChar = function writeChar(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeByte
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeByte = function writeByte(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeShort = function writeShort(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeUShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeUShort = function writeUShort(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeInteger = function writeInteger(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeUInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeFloat
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeFloat = function writeFloat(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeDouble
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeDouble = function writeDouble(value, cb) {
    cb(null);
  };

  /**
   * @function HttpDataStream#writeString
   * @param {String} str
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.writeString = function writeString(str, cb) {
    cb(null);
  };

  return HttpDataStream;
})();

// @exclude
module.exports = Peeracle.HttpDataStream;
// @endexclude
