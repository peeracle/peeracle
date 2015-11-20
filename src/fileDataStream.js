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
var fs = require('fs');
// @endexclude

/* eslint-disable */
Peeracle.FileDataStream = (function () {
  /* eslint-enable */
  /**
   * @class FileDataStream
   * @memberof {Peeracle}
   * @constructor
   * @implements {DataStream}
   * @param {DataStreamOptions} options
   * @property {Number} offset - Current stream's offset
   */
  function FileDataStream(options) {
    // @exclude
    var stat;
    if (typeof module === 'undefined') {
    // @endexclude
      this.handle = options.handle;
    // @exclude
    }
    // @endexclude
    this.offset = 0;
    this.littleEndian = options.littleEndian ? options.littleEndian : false;
    // @exclude
    if ((typeof options) !== 'object') {
      throw new TypeError('options should be an object');
    }

    if (!options.hasOwnProperty('path') ||
      (typeof options.path) !== 'string') {
      throw new TypeError('options.path should be a string');
    }

    if (!options.hasOwnProperty('mode') ||
      (typeof options.mode) !== 'string') {
      options.mode = 'r';
    }

    try {
      this.handle = fs.openSync(options.path, options.mode);
      stat = fs.fstatSync(this.handle);
      this.length = stat.size;
    } catch (e) {
      throw e;
    }
    // @endexclude
  }

  FileDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
  FileDataStream.prototype.constructor = FileDataStream;

  FileDataStream.prototype.close = function close() {
    // @exclude
    fs.closeSync(this.handle);
    // @endexclude
  };

  FileDataStream.prototype.size = function size() {
    return this.length;
  };

  FileDataStream.prototype.tell = function tell() {
    return this.offset;
  };

  FileDataStream.prototype.seek = function seek(position) {
    this.offset = position;
  };

  FileDataStream.prototype.skip = function skip(length) {
    this.offset += length;
  };

  FileDataStream.prototype.read = function read(length, cb) {
    var _this = this;

    this.peek(length, function peekCb(error, bytes, count) {
      if (error) {
        cb(error);
        return;
      }

      _this.offset += count;
      cb(null, bytes, count);
    });
  };

  FileDataStream.prototype.peek = function peek(length, cb) {
    var reader;
    // @exclude
    if (typeof module !== 'undefined') {
      fs.read(this.handle, new Buffer(length), 0, length, this.offset,
        function peekCb(error, bytesRead, buffer) {
          if (error) {
            cb(error);
            return;
          }

          cb(null, new Uint8Array(buffer), bytesRead);
        });
      return;
    }
    // @endexclude
    reader = new FileReader();
    reader.onabort = function onabortCb() {
      cb(new Error('Aborted'));
    };
    reader.onerror = function onerrorCb(e) {
      cb(e);
    };
    reader.onloadend = function onloadendCb(e) {
      var bytes = new Uint8Array(e.target.result);
      cb(null, bytes, bytes.length);
    };
    reader.readAsArrayBuffer(this.handle.slice(this.offset,
      this.offset + length));
  };

  FileDataStream.prototype.write = function write(bytes, cb) {
    // @exclude
    var _this = this;
    fs.write(this.handle, new Buffer(bytes), 0, bytes.length, this.offset,
      function writeCb(error, written) {
        if (error) {
          cb(error);
          return;
        }

        _this.offset += written;
        cb(null, written);
      });
    // @endexclude
  };

  if (typeof module === 'undefined') {
    FileDataStream.prototype.writeChar = function writeChar(value, cb) {
    };

    FileDataStream.prototype.writeByte = function writeByte(value, cb) {
    };

    FileDataStream.prototype.writeShort = function writeShort(value, cb) {
    };

    FileDataStream.prototype.writeUShort = function writeUShort(value, cb) {
    };

    FileDataStream.prototype.writeInteger = function writeInteger(value, cb) {
    };

    FileDataStream.prototype.writeUInteger = function writeUInteger(value, cb) {
    };

    FileDataStream.prototype.writeFloat = function writeFloat(value, cb) {
    };

    FileDataStream.prototype.writeDouble = function writeDouble(value, cb) {
    };

    FileDataStream.prototype.writeString = function writeString(str, cb) {
    };
  }

  return FileDataStream;
})();

// @exclude
module.exports = Peeracle.FileDataStream;
// @endexclude
