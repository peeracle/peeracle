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
var Peeracle = {};
// @endexclude

/* eslint-disable */

Peeracle.DataStream = (function() {
  /**
   * TODO: Interface description here.
   * @interface DataStream
   * @memberof {Peeracle}
   */
  /* istanbul ignore next */
  function DataStream(options) {
  }

  /**
   * TODO: Function description here.
   * @function DataStream#length
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.length = function length() {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#tell
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.tell = function tell() {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#seek
   * @param {Number} position
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.seek = function seek(position) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#read
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.read = function read(length, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readChar
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readChar = function readChar(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readByte
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readByte = function readByte(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readShort
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readShort = function readShort(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readUShort
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readUShort = function readUShort(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readInteger
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readInteger = function readInteger(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readUInteger
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readUInteger = function readUInteger(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readFloat
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readFloat = function readFloat(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readDouble
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readDouble = function readDouble(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#readString
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.readString = function readString(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peek
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peek = function peek(length, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekChar
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekChar = function peekChar(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekByte
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekByte = function peekByte(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekShort
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekShort = function peekShort(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekUShort
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekUShort = function peekUShort(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekInteger
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekInteger = function peekInteger(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekUInteger
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekUInteger = function peekUInteger(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekFloat
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekFloat = function peekFloat(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekDouble
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekDouble = function peekDouble(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#peekString
   * @param {DataStream~readCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.peekString = function peekString(cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#write
   * @param {Uint8Array} bytes
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.write = function write(bytes, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeChar
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeChar = function writeChar(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeByte
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeByte = function writeByte(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeShort = function writeShort(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeUShort
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeUShort = function writeUShort(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeInteger = function writeInteger(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeUInteger
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeFloat
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeFloat = function writeFloat(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeDouble
   * @param {Number} value
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeDouble = function writeDouble(value, cb) {
  };

  /**
   * TODO: Function description here.
   * @function DataStream#writeString
   * @param {String} str
   * @param {DataStream~writeCallback} cb
   */
  /* istanbul ignore next */
  DataStream.prototype.writeString = function writeString(str, cb) {
  };

  /**
   * TODO: Callback description here.
   * @callback DataStream~readCallback
   * @param {Error} error
   * @param {Number|String|Uint8Array} value
   * @param {Number} length
   */

  /**
   * TODO: Callback description here.
   * @callback DataStream~writeCallback
   * @param {Error} error
   * @param {Number} length
   */

  return DataStream;
})();

// @exclude
module.exports = Peeracle.DataStream;
// @endexclude
