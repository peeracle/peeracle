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
  HttpDataStream.prototype.length = function length() {
  };

  /**
   * @function HttpDataStream#tell
   * @return {number}
   */
  HttpDataStream.prototype.tell = function tell() {
  };

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
  HttpDataStream.prototype.readChar = function readChar() {
  };

  /**
   * @function HttpDataStream#readByte
   * @return {number}
   */
  HttpDataStream.prototype.readByte = function readByte() {
  };

  /**
   * @function HttpDataStream#readShort
   * @return {number}
   */
  HttpDataStream.prototype.readShort = function readShort() {
  };

  /**
   * @function HttpDataStream#readUShort
   * @return {number}
   */
  HttpDataStream.prototype.readUShort = function readUShort() {
  };

  /**
   * @function HttpDataStream#readInteger
   * @return {number}
   */
  HttpDataStream.prototype.readInteger = function readInteger() {
  };

  /**
   * @function HttpDataStream#readUInteger
   * @return {number}
   */
  HttpDataStream.prototype.readUInteger = function readUInteger() {
  };

  /**
   * @function HttpDataStream#readFloat
   * @return {number}
   */
  HttpDataStream.prototype.readFloat = function readFloat() {
  };

  /**
   * @function HttpDataStream#readDouble
   * @return {number}
   */
  HttpDataStream.prototype.readDouble = function readDouble() {
  };

  /**
   * @function HttpDataStream#readString
   * @return {number}
   */
  HttpDataStream.prototype.readString = function readString() {
  };

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
  HttpDataStream.prototype.peekChar = function peekChar() {
  };

  /**
   * @function HttpDataStream#peekByte
   * @return {number}
   */
  HttpDataStream.prototype.peekByte = function peekByte() {
  };

  /**
   * @function HttpDataStream#peekShort
   * @return {number}
   */
  HttpDataStream.prototype.peekShort = function peekShort() {
  };

  /**
   * @function HttpDataStream#peekUShort
   * @return {number}
   */
  HttpDataStream.prototype.peekUShort = function peekUShort() {
  };

  /**
   * @function HttpDataStream#peekInteger
   * @return {number}
   */
  HttpDataStream.prototype.peekInteger = function peekInteger() {
  };

  /**
   * @function HttpDataStream#peekUInteger
   * @return {number}
   */
  HttpDataStream.prototype.peekUInteger = function peekUInteger() {
  };

  /**
   * @function HttpDataStream#peekFloat
   * @return {number}
   */
  HttpDataStream.prototype.peekFloat = function peekFloat() {
  };

  /**
   * @function HttpDataStream#peekDouble
   * @return {number}
   */
  HttpDataStream.prototype.peekDouble = function peekDouble() {
  };

  /**
   * @function HttpDataStream#peekString
   * @return {number}
   */
  HttpDataStream.prototype.peekString = function peekString() {
  };

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

// @exclude
module.exports = Peeracle.HttpDataStream;
// @endexclude
