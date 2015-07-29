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
Peeracle.HttpDataStream = (function() {
/* eslint-enable */
  /**
   * @class HttpDataStream
   * @memberof {Peeracle}
   * @constructor
   * @implements {DataStream}
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
   * @return {Uint8Array}
   */
  HttpDataStream.prototype.read = function read(length) {
    this.offset += length;
  };

  /**
   * @function HttpDataStream#readChar
   * @return {Number}
   */
  HttpDataStream.prototype.readChar = function readChar() {
  };

  /**
   * @function HttpDataStream#readByte
   * @return {Number}
   */
  HttpDataStream.prototype.readByte = function readByte() {
  };

  /**
   * @function HttpDataStream#readShort
   * @return {Number}
   */
  HttpDataStream.prototype.readShort = function readShort() {
  };

  /**
   * @function HttpDataStream#readUShort
   * @return {Number}
   */
  HttpDataStream.prototype.readUShort = function readUShort() {
  };

  /**
   * @function HttpDataStream#readInteger
   * @return {Number}
   */
  HttpDataStream.prototype.readInteger = function readInteger() {
  };

  /**
   * @function HttpDataStream#readUInteger
   * @return {Number}
   */
  HttpDataStream.prototype.readUInteger = function readUInteger() {
  };

  /**
   * @function HttpDataStream#readFloat
   * @return {Number}
   */
  HttpDataStream.prototype.readFloat = function readFloat() {
  };

  /**
   * @function HttpDataStream#readDouble
   * @return {Number}
   */
  HttpDataStream.prototype.readDouble = function readDouble() {
  };

  /**
   * @function HttpDataStream#readString
   * @return {Number}
   */
  HttpDataStream.prototype.readString = function readString() {
  };

  /**
   * @function HttpDataStream#peek
   * @param {Number} length
   * @return {Number}
   */
  HttpDataStream.prototype.peek = function peek(length) {
    return length;
  };

  /**
   * @function HttpDataStream#peekChar
   * @return {Number}
   */
  HttpDataStream.prototype.peekChar = function peekChar() {
  };

  /**
   * @function HttpDataStream#peekByte
   * @return {Number}
   */
  HttpDataStream.prototype.peekByte = function peekByte() {
  };

  /**
   * @function HttpDataStream#peekShort
   * @return {Number}
   */
  HttpDataStream.prototype.peekShort = function peekShort() {
  };

  /**
   * @function HttpDataStream#peekUShort
   * @return {Number}
   */
  HttpDataStream.prototype.peekUShort = function peekUShort() {
  };

  /**
   * @function HttpDataStream#peekInteger
   * @return {Number}
   */
  HttpDataStream.prototype.peekInteger = function peekInteger() {
  };

  /**
   * @function HttpDataStream#peekUInteger
   * @return {Number}
   */
  HttpDataStream.prototype.peekUInteger = function peekUInteger() {
  };

  /**
   * @function HttpDataStream#peekFloat
   * @return {Number}
   */
  HttpDataStream.prototype.peekFloat = function peekFloat() {
  };

  /**
   * @function HttpDataStream#peekDouble
   * @return {Number}
   */
  HttpDataStream.prototype.peekDouble = function peekDouble() {
  };

  /**
   * @function HttpDataStream#peekString
   * @return {Number}
   */
  HttpDataStream.prototype.peekString = function peekString() {
  };

  /**
   * @function HttpDataStream#write
   * @return {Number}
   */
  HttpDataStream.prototype.write = function write(bytes) {
    return bytes;
  };

  /**
   * @function HttpDataStream#writeChar
   * @return {Number}
   */
  HttpDataStream.prototype.writeChar = function writeChar(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeByte
   * @return {Number}
   */
  HttpDataStream.prototype.writeByte = function writeByte(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeShort
   * @return {Number}
   */
  HttpDataStream.prototype.writeShort = function writeShort(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeUShort
   * @return {Number}
   */
  HttpDataStream.prototype.writeUShort = function writeUShort(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeInteger
   * @return {Number}
   */
  HttpDataStream.prototype.writeInteger = function writeInteger(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeUInteger
   * @return {Number}
   */
  HttpDataStream.prototype.writeUInteger = function writeUInteger(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeFloat
   * @return {Number}
   */
  HttpDataStream.prototype.writeFloat = function writeFloat(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeDouble
   * @return {Number}
   */
  HttpDataStream.prototype.writeDouble = function writeDouble(value) {
    return value;
  };

  /**
   * @function HttpDataStream#writeString
   * @return {Number}
   */
  HttpDataStream.prototype.writeString = function writeString(str) {
    return str;
  };

  return HttpDataStream;
})();

// @exclude
module.exports = Peeracle.HttpDataStream;
// @endexclude
