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
   * @interface DataStream
   * @memberof {Peeracle}
   */
  /* istanbul ignore next */
  function DataStream(options) {
  }

  /**
   * @function DataStream#length
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.length = function length() {
  };

  /**
   * @function DataStream#tell
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.tell = function tell() {
  };

  /**
   * @function DataStream#seek
   * @param {Number} position
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.seek = function seek(position) {
  };

  /**
   * @function DataStream#read
   * @param {Number} length
   * @return {Uint8Array}
   */
  /* istanbul ignore next */
  DataStream.prototype.read = function read(length) {
  };

  /**
   * @function DataStream#readChar
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readChar = function readChar() {
  };

  /**
   * @function DataStream#readByte
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readByte = function readByte() {
  };

  /**
   * @function DataStream#readShort
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readShort = function readShort() {
  };

  /**
   * @function DataStream#readUShort
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readUShort = function readUShort() {
  };

  /**
   * @function DataStream#readInteger
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readInteger = function readInteger() {
  };

  /**
   * @function DataStream#readUInteger
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readUInteger = function readUInteger() {
  };

  /**
   * @function DataStream#readFloat
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readFloat = function readFloat() {
  };

  /**
   * @function DataStream#readDouble
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readDouble = function readDouble() {
  };

  /**
   * @function DataStream#readString
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.readString = function readString() {
  };

  /**
   * @function DataStream#peek
   * @param {Number} length
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peek = function peek(length) {
  };

  /**
   * @function DataStream#peekChar
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekChar = function peekChar() {
  };

  /**
   * @function DataStream#peekByte
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekByte = function peekByte() {
  };

  /**
   * @function DataStream#peekShort
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekShort = function peekShort() {
  };

  /**
   * @function DataStream#peekUShort
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekUShort = function peekUShort() {
  };

  /**
   * @function DataStream#peekInteger
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekInteger = function peekInteger() {
  };

  /**
   * @function DataStream#peekUInteger
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekUInteger = function peekUInteger() {
  };

  /**
   * @function DataStream#peekFloat
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekFloat = function peekFloat() {
  };

  /**
   * @function DataStream#peekDouble
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekDouble = function peekDouble() {
  };

  /**
   * @function DataStream#peekString
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.peekString = function peekString() {
  };

  /**
   * @function DataStream#write
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.write = function write(bytes) {
  };

  /**
   * @function DataStream#writeChar
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeChar = function writeChar(value) {
  };

  /**
   * @function DataStream#writeByte
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeByte = function writeByte(value) {
  };

  /**
   * @function DataStream#writeShort
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeShort = function writeShort(value) {
  };

  /**
   * @function DataStream#writeUShort
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeUShort = function writeUShort(value) {
  };

  /**
   * @function DataStream#writeInteger
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeInteger = function writeInteger(value) {
  };

  /**
   * @function DataStream#writeUInteger
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeUInteger = function writeUInteger(value) {
  };

  /**
   * @function DataStream#writeFloat
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeFloat = function writeFloat(value) {
  };

  /**
   * @function DataStream#writeDouble
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeDouble = function writeDouble(value) {
  };

  /**
   * @function DataStream#writeString
   * @return {Number}
   */
  /* istanbul ignore next */
  DataStream.prototype.writeString = function writeString(str) {
  };

  return DataStream;
})();

// @exclude
module.exports = Peeracle.DataStream;
// @endexclude
