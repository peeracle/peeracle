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
  FileDataStream.prototype.length = function length() {
  };

  /**
   * @function FileDataStream#tell
   * @return {number}
   */
  FileDataStream.prototype.tell = function tell() {
  };

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
  FileDataStream.prototype.readChar = function readChar() {
  };

  /**
   * @function FileDataStream#readByte
   * @return {number}
   */
  FileDataStream.prototype.readByte = function readByte() {
  };

  /**
   * @function FileDataStream#readShort
   * @return {number}
   */
  FileDataStream.prototype.readShort = function readShort() {
  };

  /**
   * @function FileDataStream#readUShort
   * @return {number}
   */
  FileDataStream.prototype.readUShort = function readUShort() {
  };

  /**
   * @function FileDataStream#readInteger
   * @return {number}
   */
  FileDataStream.prototype.readInteger = function readInteger() {
  };

  /**
   * @function FileDataStream#readUInteger
   * @return {number}
   */
  FileDataStream.prototype.readUInteger = function readUInteger() {
  };

  /**
   * @function FileDataStream#readFloat
   * @return {number}
   */
  FileDataStream.prototype.readFloat = function readFloat() {
  };

  /**
   * @function FileDataStream#readDouble
   * @return {number}
   */
  FileDataStream.prototype.readDouble = function readDouble() {
  };

  /**
   * @function FileDataStream#readString
   * @return {number}
   */
  FileDataStream.prototype.readString = function readString() {
  };

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
  FileDataStream.prototype.peekChar = function peekChar() {
  };

  /**
   * @function FileDataStream#peekByte
   * @return {number}
   */
  FileDataStream.prototype.peekByte = function peekByte() {
  };

  /**
   * @function FileDataStream#peekShort
   * @return {number}
   */
  FileDataStream.prototype.peekShort = function peekShort() {
  };

  /**
   * @function FileDataStream#peekUShort
   * @return {number}
   */
  FileDataStream.prototype.peekUShort = function peekUShort() {
  };

  /**
   * @function FileDataStream#peekInteger
   * @return {number}
   */
  FileDataStream.prototype.peekInteger = function peekInteger() {
  };

  /**
   * @function FileDataStream#peekUInteger
   * @return {number}
   */
  FileDataStream.prototype.peekUInteger = function peekUInteger() {
  };

  /**
   * @function FileDataStream#peekFloat
   * @return {number}
   */
  FileDataStream.prototype.peekFloat = function peekFloat() {
  };

  /**
   * @function FileDataStream#peekDouble
   * @return {number}
   */
  FileDataStream.prototype.peekDouble = function peekDouble() {
  };

  /**
   * @function FileDataStream#peekString
   * @return {number}
   */
  FileDataStream.prototype.peekString = function peekString() {
  };

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

// @exclude
module.exports = Peeracle.FileDataStream;
// @endexclude
