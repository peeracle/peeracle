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
var XMLHttpRequest = require('xhr2');
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
    this.length = -1;

    if ((typeof options) !== 'object') {
      throw new TypeError('options should be an object');
    }

    if (!options.hasOwnProperty('url') ||
      (typeof options.url) !== 'string') {
      throw new TypeError('options.url should be a string');
    }
  }

  HttpDataStream.CONTENT_RANGE_REGEX = /^bytes \d+-\d+\/(\d+)$/;

  HttpDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
  HttpDataStream.prototype.constructor = HttpDataStream;

  /**
   * @function HttpDataStream#size
   * @return {Number}
   */
  HttpDataStream.prototype.size = function size() {
    console.log('HttpDataStream::size', this.length);
    return this.length;
  };

  /**
   * @function HttpDataStream#tell
   * @return {Number}
   */
  HttpDataStream.prototype.tell = function tell() {
    console.log('HttpDataStream::tell', this.offset);
    return this.offset;
  };

  /**
   * @function HttpDataStream#seek
   * @param {Number} position
   * @return {Number}
   */
  HttpDataStream.prototype.seek = function seek(position) {
    console.log('HttpDataStream::seek', this.offset, position, this.length);
    if (position > this.length) {
      this.offset = this.length;
    } else {
      this.offset = position;
    }
  };

  HttpDataStream.prototype.skip = function skip(length) {
    console.log('HttpDataStream::skip', this.length);
    this.seek(this.offset + length);
  };

  /**
   * @function HttpDataStream#read
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.read = function read(length, cb) {
    var _this = this;

    console.log('HttpDataStream::read', length);
    this.peek(length, function peekCb(error, bytes, count) {
      if (error) {
        cb(error);
        return;
      }

      _this.offset += count;
      cb(null, bytes, count);
    });
  };

  HttpDataStream.prototype.onRequestLoad_ = function onRequestLoad_(request, start, cb) {
    var bytes;
    var match;
    var contentRange;

    if (request.status !== 206) {
      return;
    }

    bytes = new Uint8Array(request.response);
    contentRange = request.getResponseHeader('Content-Range');
    match = HttpDataStream.CONTENT_RANGE_REGEX.exec(contentRange);

    this.offset = start;
    this.length = match && match.length >= 2 ? parseInt(match[1], 10) : -1;

    cb(null, bytes, bytes.length);
  };

  HttpDataStream.prototype.fetchBytes_ = function fetchBytes_(start, end, cb) {
    var _this = this;
    var request = new XMLHttpRequest();

    if (this.length !== -1 && end > this.length) {
      end = this.length;
    }

    request.onreadystatechange = function onStateChangeCb() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status !== 206) {
          cb(new Error('HttpDataStream status code', request.status));
        }
      }
    };

    request.onload = function onLoadCb() {
      _this.onRequestLoad_(this, start, cb);
    };

    try {
      request.open('GET', this.options.url);
      request.setRequestHeader('Range', 'bytes=' + start + '-' + (end - 1));
      request.responseType = 'arraybuffer';
      request.send();
    } catch (e) {
      cb(e);
    }
  };

  /**
   * @function HttpDataStream#peek
   * @param {Number} length
   * @param {DataStream~readCallback} cb
   */
  HttpDataStream.prototype.peek = function peek(length, cb) {
    var start = this.offset;
    var end = start + length;

    console.log('HttpDataStream::peek', length);
    this.fetchBytes_(start, end, cb);
  };

  /**
   * @function HttpDataStream#write
   * @param {Uint8Array} bytes
   * @param {DataStream~writeCallback} cb
   */
  HttpDataStream.prototype.write = function write(bytes, cb) {
    cb(null);
  };

  return HttpDataStream;
})();

// @exclude
module.exports = Peeracle.HttpDataStream;
// @endexclude
