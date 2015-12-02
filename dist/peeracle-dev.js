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
  Peeracle.Listenable = (function() {
    /* eslint-enable */
    /**
     * @class Listenable
     * @memberof Peeracle
     * @mixin
     * @constructor
     */
    function Listenable() {
      this.listeners = {};
    }

    /**
     * @function Listenable#on
     * @param type
     * @param listener
     */
    Listenable.prototype.on = function on(type, listener) {
      this.listeners[type] = this.listeners[type] || [];
      this.listeners[type].push(listener);
    };

    /**
     * @function Listenable#once
     * @param type
     * @param listener
     */
    Listenable.prototype.once = function once(type, listener) {
      var self = this;

      function wrappedListener() {
        self.off(type, wrappedListener);
        listener.apply(null, arguments);
      }

      wrappedListener.__originalListener = listener;
      this.on(type, wrappedListener);
    };

    /**
     * @function Listenable#off
     * @param type
     * @param listener
     */
    Listenable.prototype.off = function off(type, listener) {
      if (this.listeners[type]) {
        if (listener) {
          this.listeners[type] = this.listeners[type].filter(function filterListener(
            l) {
            return l !== listener && l.__originalListener !==
              listener;
          });
        } else {
          delete this.listeners[type];
        }
      }
    };

    /**
     * @function Listenable#emit
     * @param type
     */
    Listenable.prototype.emit = function emit(type) {
      var args;

      if (this.listeners[type]) {
        args = [].slice.call(arguments, 1);
        this.listeners[type].forEach(function applyListener(listener) {
          listener.apply(null, args);
        });
      }
    };

    return Listenable;
  })();

  /* eslint-disable */

  Peeracle.DataStream = (function() {
    /**
     * @typedef {Object} DataStreamOptions
     * @property {Uint8Array} buffer
     * @property {String} path
     * @property {String} mode
     * @property {Boolean} littleEndian
     */

    /**
     * Interface for reading and writing to a stream.
     * @interface DataStream
     * @memberof {Peeracle}
     */
    /* istanbul ignore next */
    function DataStream(options) {}

    /**
     * Return the total number of bytes.
     * @function DataStream#size
     * @return {Number}
     */
    /* istanbul ignore next */
    DataStream.prototype.size = function size() {};

    /**
     * Return the cursor's current position.
     * @function DataStream#tell
     * @return {Number}
     */
    /* istanbul ignore next */
    DataStream.prototype.tell = function tell() {};

    /**
     * Move the cursor to a specific position inside the stream.
     * @function DataStream#seek
     * @param {Number} position
     * @return {Number}
     */
    /* istanbul ignore next */
    DataStream.prototype.seek = function seek(position) {};

    /**
     * Skip bytes.
     * @function DataStream#skip
     * @param {Number} length
     */
    /* istanbul ignore next */
    DataStream.prototype.skip = function skip(length) {};

    /**
     * Reads up to length bytes of data starting at the internal cursor, then pass
     * them as an argument inside cb and increase the internal cursor.
     * @function DataStream#read
     * @param {Number} length
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.read = function read(length, cb) {};

    /**
     * Reads one signed char starting at the internal cursor, then pass it as an
     * argument inside cb and increase the internal cursor.
     * @function DataStream#readChar
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readChar = function readChar(cb) {
      this.read(1, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getInt8(0), length);
      });
    };

    /**
     * Reads one unsigned byte starting at the internal cursor, then pass it as an
     * argument inside cb and increase the internal cursor.
     * @function DataStream#readByte
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readByte = function readByte(cb) {
      this.read(1, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getUint8(0), length);
      });
    };

    /**
     * Reads one signed short starting at the internal cursor, then pass it as an
     * argument inside cb and increase the internal cursor.
     * @function DataStream#readShort
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readShort = function readShort(cb) {
      var _this = this;
      this.read(2, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getInt16(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one unsigned short starting at the internal cursor, then pass it as
     * an argument inside cb and increase the internal cursor.
     * @function DataStream#readUShort
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readUShort = function readUShort(cb) {
      var _this = this;
      this.read(2, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getUint16(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one signed integer starting at the internal cursor, then pass it as
     * an argument inside cb and increase the internal cursor.
     * @function DataStream#readInteger
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readInteger = function readInteger(cb) {
      var _this = this;
      this.read(4, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getInt32(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one unsigned integer starting at the internal cursor, then pass it as
     * an argument inside cb and increase the internal cursor.
     * @function DataStream#readUInteger
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readUInteger = function readUInteger(cb) {
      var _this = this;
      this.read(4, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getUint32(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one 64-bits unsigned integer starting at the internal cursor,
     * then pass it as an argument inside cb and increase the internal cursor.
     * @function DataStream#readUInteger64
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readUInteger64 = function readUInteger64(cb) {
      var _this = this;
      var high;
      var low;

      this.read(8, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);

        if (_this.littleEndian) {
          low = dataView.getUint32(0, true);
          high = dataView.getUint32(4, true);
        } else {
          high = dataView.getUint32(0, false);
          low = dataView.getUint32(4, false);
        }

        if (high > 0x1FFFFF) {
          cb(new RangeError('Overflow reading 64-bit value.'));
          return;
        }

        cb(null, (high * Math.pow(2, 32)) + low, length);
      });
    };

    /**
     * Reads one float starting at the internal cursor, then pass it as an
     * argument inside cb and increase the internal cursor.
     * @function DataStream#readFloat
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readFloat = function readFloat(cb) {
      var _this = this;
      this.read(4, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getFloat32(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one double starting at the internal cursor, then pass it as an
     * argument inside cb and increase the internal cursor.
     * @function DataStream#readDouble
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readDouble = function readDouble(cb) {
      var _this = this;
      this.read(8, function readCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getFloat64(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads a string starting at the internal cursor, then pass it as an argument
     * inside cb and increase the internal cursor.
     * @function DataStream#readString
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.readString = function readString(cb) {
      var stringLength = 0;
      var str = '';
      var _this = this;
      var realCb = ((typeof length) === 'function') ? length : cb;

      this.readChar(function peekCharCb(error, value, count) {
        if (error) {
          realCb(error);
          return;
        }

        if (!value || !count) {
          realCb(null, str, stringLength);
          return;
        }

        str += String.fromCharCode(value);
        ++stringLength;
        _this.readChar(peekCharCb);
      });
    };

    /**
     * Reads up to length bytes of data starting at the internal cursor, then pass
     * them as an argument inside cb.
     * @function DataStream#peek
     * @param {Number} length
     * @param {DataStream~readCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.peek = function peek(length, cb) {};

    /**
     * Reads one signed char starting at the internal cursor, then pass it as an
     * argument inside cb.
     * @function DataStream#peekChar
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekChar = function peekChar(cb) {
      this.peek(1, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getInt8(0), length);
      });
    };

    /**
     * Reads one unsigned char starting at the internal cursor, then pass it as an
     * argument inside cb.
     * @function DataStream#peekByte
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekByte = function peekByte(cb) {
      this.peek(1, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getUint8(0), length);
      });
    };

    /**
     * Reads one signed short starting at the internal cursor, then pass it as an
     * argument inside cb.
     * @function DataStream#peekShort
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekShort = function peekShort(cb) {
      var _this = this;
      this.peek(2, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getInt16(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one unsigned short starting at the internal cursor, then pass it as
     * an argument inside cb.
     * @function DataStream#peekUShort
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekUShort = function peekUShort(cb) {
      var _this = this;
      this.peek(2, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getUint16(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one signed integer starting at the internal cursor, then pass it as
     * an argument inside cb.
     * @function DataStream#peekInteger
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekInteger = function peekInteger(cb) {
      var _this = this;
      this.peek(4, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getInt32(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one unsigned integer starting at the internal cursor, then pass it as
     * an argument inside cb.
     * @function DataStream#peekUInteger
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekUInteger = function peekUInteger(cb) {
      var _this = this;
      this.peek(4, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getUint32(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one float starting at the internal cursor, then pass it as an
     * argument inside cb.
     * @function DataStream#peekFloat
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekFloat = function peekFloat(cb) {
      var _this = this;
      this.peek(4, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getFloat32(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads one double starting at the internal cursor, then pass it as an
     * argument inside cb.
     * @function DataStream#peekDouble
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekDouble = function peekDouble(cb) {
      var _this = this;
      this.peek(8, function peekCb(error, bytes, length) {
        /** @type {DataView} */
        var dataView;

        if (error) {
          cb(error);
          return;
        }

        dataView = new DataView(bytes.buffer);
        cb(null, dataView.getFloat64(0, _this.littleEndian), length);
      });
    };

    /**
     * Reads a string starting at the internal cursor, then pass it as an argument
     * inside cb.
     * @function DataStream#peekString
     * @param {DataStream~readCallback} cb
     */
    DataStream.prototype.peekString = function peekString(cb) {
      var stringLength = 0;
      var str = '';

      this.peekChar(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }

        if (!value || !length) {
          cb(null, str, stringLength);
          return;
        }

        str += value;
        ++stringLength;
        this.readChar(peekCb);
      });
    };

    /**
     * Writes up to length bytes of data at the internal cursor, then pass the
     * number of written bytes as an argument inside cb and increase the internal
     * cursor.
     * @function DataStream#write
     * @param {Uint8Array} bytes
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.write = function write(bytes, cb) {};

    /**
     * Writes a signed char at the internal cursor, then pass the number of
     * written bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeChar
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeChar = function writeChar(value, cb) {
      /** @type {DataView} */
      var dataView;
      var bytes = new Uint8Array(1);

      dataView = new DataView(bytes.buffer);
      dataView.setInt8(0, value);
      this.write(bytes, cb);
    };

    /**
     * Writes an unsigned char at the internal cursor, then pass the number of
     * written bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeByte
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeByte = function writeByte(value, cb) {
      /** @type {DataView} */
      var dataView;
      var bytes = new Uint8Array(1);

      dataView = new DataView(bytes.buffer);
      dataView.setUint8(0, value);
      this.write(bytes, cb);
    };

    /**
     * Writes a signed short at the internal cursor, then pass the number of
     * written bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeShort
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeShort = function writeShort(value, cb) {};

    /**
     * Writes an unsigned short at the internal cursor, then pass the number of
     * written bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeUShort
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeUShort = function writeUShort(value, cb) {};

    /**
     * Writes an integer at the internal cursor, then pass the number of written
     * bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeInteger
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeInteger = function writeInteger(value, cb) {};

    /**
     * Writes an unsigned integer at the internal cursor, then pass the number of
     * written bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeUInteger
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeUInteger = function writeUInteger(value, cb) {};

    /**
     * Writes a float at the internal cursor, then pass the number of written
     * bytesas an argument inside cb and increase the internal cursor.
     * @function DataStream#writeFloat
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeFloat = function writeFloat(value, cb) {};

    /**
     * Writes a double at the internal cursor, then pass the number of written
     * bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeDouble
     * @param {Number} value
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeDouble = function writeDouble(value, cb) {};

    /**
     * Writes a string at the internal cursor, then pass the number of written
     * bytes as an argument inside cb and increase the internal cursor.
     * @function DataStream#writeString
     * @param {String} str
     * @param {DataStream~writeCallback} cb
     */
    /* istanbul ignore next */
    DataStream.prototype.writeString = function writeString(str, cb) {};

    /**
     * Callback function for reading methods. error will be an instance of Error
     * if the call has failed, it will be null otherwise. value contains the
     * result of the read method, and length contains the number of bytes that
     * have been read.
     * @callback DataStream~readCallback
     * @param {Error} error
     * @param {Number|String|Uint8Array} value
     * @param {Number} length
     */

    /**
     * Callback function for writing methods. error will be an instance of Error
     * if the call has failed, it will be null otherwise. length contains the
     * number of bytes that have been written.
     * @callback DataStream~writeCallback
     * @param {Error} error
     * @param {Number} length
     */

    return DataStream;
  })();

  /* eslint-disable */
  Peeracle.FileDataStream = (function() {
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
      this.handle = options.handle;
      this.offset = 0;
      this.littleEndian = options.littleEndian ? options.littleEndian :
        false;
    }

    FileDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
    FileDataStream.prototype.constructor = FileDataStream;

    FileDataStream.prototype.close = function close() {};

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

    FileDataStream.prototype.write = function write(bytes, cb) {};

    if (typeof module === 'undefined') {
      FileDataStream.prototype.writeChar = function writeChar(value, cb) {};

      FileDataStream.prototype.writeByte = function writeByte(value, cb) {};

      FileDataStream.prototype.writeShort = function writeShort(value, cb) {};

      FileDataStream.prototype.writeUShort = function writeUShort(value,
        cb) {};

      FileDataStream.prototype.writeInteger = function writeInteger(value,
        cb) {};

      FileDataStream.prototype.writeUInteger = function writeUInteger(
        value, cb) {};

      FileDataStream.prototype.writeFloat = function writeFloat(value, cb) {};

      FileDataStream.prototype.writeDouble = function writeDouble(value,
        cb) {};

      FileDataStream.prototype.writeString = function writeString(str, cb) {};
    }

    return FileDataStream;
  })();

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

    HttpDataStream.prototype.onRequestLoad_ = function onRequestLoad_(
      request, start, cb) {
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
      this.length = match && match.length >= 2 ? parseInt(match[1], 10) :
        -1;

      cb(null, bytes, bytes.length);
    };

    HttpDataStream.prototype.fetchBytes_ = function fetchBytes_(start,
      end, cb) {
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
        request.setRequestHeader('Range', 'bytes=' + start + '-' + (end -
          1));
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

  /* eslint-disable */
  Peeracle.MemoryDataStream = (function() {
    /* eslint-enable */
    /**
     * @class MemoryDataStream
     * @memberof {Peeracle}
     * @constructor
     * @implements {DataStream}
     * @param {DataStreamOptions} options
     * @property {Number} offset - Current stream's offset
     * @property {Uint8Array} buffer
     * @property {DataView} dataview
     * @throws {TypeError}
     */
    function MemoryDataStream(options) {
      this.options = options || {};

      if ((typeof this.options) !== 'object') {
        throw new TypeError('options should be an object');
      }

      if (!this.options.buffer || !(this.options.buffer instanceof Uint8Array)) {
        throw new TypeError('buffer should be an Uint8Array');
      }

      this.littleEndian = options.littleEndian ? options.littleEndian :
        false;
      this.buffer = this.options.buffer;
      this.dataview = new DataView(this.buffer.buffer);
      this.offset = 0;
    }

    MemoryDataStream.prototype = Object.create(Peeracle.DataStream.prototype);
    MemoryDataStream.prototype.constructor = MemoryDataStream;

    MemoryDataStream.prototype.size = function size() {
      return this.buffer.length;
    };

    MemoryDataStream.prototype.tell = function tell() {
      return this.offset;
    };

    MemoryDataStream.prototype.seek = function seek(position) {
      if (typeof position !== 'number') {
        throw new TypeError('argument must be a number');
      }

      if (position < 0 || position > this.buffer.length) {
        throw new RangeError('index out of bounds');
      }

      this.offset = position;
      return position;
    };

    MemoryDataStream.prototype.skip = function skip(length) {
      this.offset += length;
    };

    MemoryDataStream.prototype.read = function read(length, cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peek(length);
        this.offset += result.length;
        return result;
      }

      this.peek(length, function peekCb(error, value, len) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += len;
        cb(null, value, len);
      });
    };

    MemoryDataStream.prototype.readChar = function readChar(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekChar();
        this.offset += 1;
        return result;
      }

      this.peekChar(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readByte = function readByte(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekByte();
        this.offset += 1;
        return result;
      }

      this.peekByte(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readShort = function readShort(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekShort();
        this.offset += 2;
        return result;
      }

      this.peekShort(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readUShort = function readUShort(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekUShort();
        this.offset += 2;
        return result;
      }

      this.peekUShort(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readInteger = function readInteger(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekInteger();
        this.offset += 4;
        return result;
      }

      this.peekInteger(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readUInteger = function readUInteger(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekUInteger();
        this.offset += 4;
        return result;
      }

      this.peekUInteger(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readFloat = function readFloat(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekFloat();
        this.offset += 4;
        return result;
      }

      this.peekFloat(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readDouble = function readDouble(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekDouble();
        this.offset += 8;
        return result;
      }

      this.peekDouble(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.readString = function readString(cb) {
      var _this = this;
      var result;

      if (!cb) {
        result = this.peekString();
        this.offset += result.length + 1;
        return result;
      }

      this.peekString(function peekCb(error, value, length) {
        if (error) {
          cb(error);
          return;
        }
        _this.offset += length;
        cb(null, value, length);
      });
    };

    MemoryDataStream.prototype.peek = function peek(length, cb) {
      if (length < 0 || this.offset + length > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.buffer.subarray(this.offset, this.offset + length),
          length);
        return null;
      }
      return this.buffer.subarray(this.offset, this.offset + length);
    };

    MemoryDataStream.prototype.peekChar = function peekChar(cb) {
      if (this.offset + 1 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getInt8(this.offset), 1);
        return null;
      }
      return this.dataview.getInt8(this.offset);
    };

    MemoryDataStream.prototype.peekByte = function peekByte(cb) {
      if (this.offset + 1 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getUint8(this.offset), 1);
        return null;
      }
      return this.dataview.getUint8(this.offset);
    };

    MemoryDataStream.prototype.peekShort = function peekShort(cb) {
      if (this.offset + 2 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getInt16(this.offset, this.littleEndian),
          2);
        return null;
      }
      return this.dataview.getInt16(this.offset, this.littleEndian);
    };

    MemoryDataStream.prototype.peekUShort = function peekUShort(cb) {
      if (this.offset + 2 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getUint16(this.offset, this.littleEndian),
          2);
        return null;
      }
      return this.dataview.getUint16(this.offset, this.littleEndian);
    };

    MemoryDataStream.prototype.peekInteger = function peekInteger(cb) {
      if (this.offset + 4 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getInt32(this.offset, this.littleEndian),
          4);
        return null;
      }
      return this.dataview.getInt32(this.offset, this.littleEndian);
    };

    MemoryDataStream.prototype.peekUInteger = function peekUInteger(cb) {
      if (this.offset + 4 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getUint32(this.offset, this.littleEndian),
          4);
        return null;
      }
      return this.dataview.getUint32(this.offset, this.littleEndian);
    };

    MemoryDataStream.prototype.peekFloat = function peekFloat(cb) {
      if (this.offset + 4 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getFloat32(this.offset, this.littleEndian),
          4);
        return null;
      }
      return this.dataview.getFloat32(this.offset, this.littleEndian);
    };

    MemoryDataStream.prototype.peekDouble = function peekDouble(cb) {
      if (this.offset + 8 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      if (cb) {
        cb(null, this.dataview.getFloat64(this.offset, this.littleEndian),
          8);
        return null;
      }
      return this.dataview.getFloat64(this.offset, this.littleEndian);
    };

    MemoryDataStream.prototype.peekString = function peekString(cb) {
      var bytesRead = 0;
      var index = this.offset;
      var length = this.buffer.length;
      var str = null;
      var charCode;

      if (index >= length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      while (index < length) {
        charCode = this.buffer[index++];

        ++bytesRead;
        if (charCode === 0) {
          break;
        }

        if (!str) {
          str = '';
        }

        str += String.fromCharCode(charCode);
      }

      if (cb) {
        cb(null, str, bytesRead);
        return null;
      }
      return str ? str : '';
    };

    MemoryDataStream.prototype.write = function write(bytes, cb) {
      var length;

      if (!(bytes instanceof Uint8Array)) {
        if (cb) {
          cb(new TypeError('argument must be an Uint8Array'));
          return null;
        }
        throw new TypeError('argument must be an Uint8Array');
      }

      length = bytes.length;
      if (this.offset + length > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.buffer.set(bytes, this.offset);
      this.offset += length;
      if (cb) {
        cb(null, length);
        return null;
      }
      return length;
    };

    MemoryDataStream.prototype.writeChar = function writeChar(value, cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 1 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setInt8(this.offset, value);
      this.offset += 1;
      if (cb) {
        cb(null, 1);
        return null;
      }
      return 1;
    };

    MemoryDataStream.prototype.writeByte = function writeByte(value, cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 1 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setUint8(this.offset, value);
      this.offset += 1;
      if (cb) {
        cb(null, 1);
        return null;
      }
      return 1;
    };

    MemoryDataStream.prototype.writeShort = function writeShort(value, cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 2 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setInt16(this.offset, value, this.littleEndian);
      this.offset += 2;
      if (cb) {
        cb(null, 2);
        return null;
      }
      return 2;
    };

    MemoryDataStream.prototype.writeUShort = function writeUShort(value,
      cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 2 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setUint16(this.offset, value, this.littleEndian);
      this.offset += 2;
      if (cb) {
        cb(null, 2);
        return null;
      }
      return 2;
    };

    MemoryDataStream.prototype.writeInteger = function writeInteger(value,
      cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 4 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setInt32(this.offset, value, this.littleEndian);
      this.offset += 4;
      if (cb) {
        cb(null, 4);
        return null;
      }
      return 4;
    };

    MemoryDataStream.prototype.writeUInteger = function writeUInteger(
      value, cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 4 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setUint32(this.offset, value, this.littleEndian);
      this.offset += 4;
      if (cb) {
        cb(null, 4);
        return null;
      }
      return 4;
    };

    MemoryDataStream.prototype.writeFloat = function writeFloat(value, cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 4 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setFloat32(this.offset, value, this.littleEndian);
      this.offset += 4;
      if (cb) {
        cb(null, 4);
        return null;
      }
      return 4;
    };

    MemoryDataStream.prototype.writeDouble = function writeDouble(value,
      cb) {
      if (typeof value !== 'number') {
        if (cb) {
          cb(new TypeError('argument must be a number'));
          return null;
        }
        throw new TypeError('argument must be a number');
      }

      if (this.offset + 8 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      this.dataview.setFloat64(this.offset, value, this.littleEndian);
      this.offset += 8;
      if (cb) {
        cb(null, 8);
        return null;
      }
      return 8;
    };

    MemoryDataStream.prototype.writeString = function writeString(str, cb) {
      var index = 0;
      var length;

      if (typeof str !== 'string') {
        if (cb) {
          cb(new TypeError('argument must be a string'));
          return null;
        }
        throw new TypeError('argument must be a string');
      }

      length = str.length;
      if (this.offset + length + 1 > this.buffer.length) {
        if (cb) {
          cb(new RangeError('index out of bounds'));
          return null;
        }
        throw new RangeError('index out of bounds');
      }

      while (index < length) {
        this.buffer[this.offset + index] = str.charCodeAt(index);
        ++index;
      }

      this.buffer[this.offset + index++] = 0;
      this.offset += index;
      if (cb) {
        cb(null, index);
        return null;
      }
      return index;
    };

    return MemoryDataStream;
  })();

  /* eslint-disable */

  Peeracle.Hash = (function() {
    /**
     * @interface Hash
     * @memberof {Peeracle}
     */
    /* istanbul ignore next */
    function Hash(options) {}

    /**
     * @function Hash#create
     * @param {String} name
     * @return {?Hash}
     */
    Hash.create = function create(name) {
      var i = 0;
      var hashInstance;
      var hashAlgorithms = ['Murmur3Hash'];
      var hashAlgorithm = hashAlgorithms[i];

      for (i = 0; i < hashAlgorithms.length; ++i) {
        hashInstance = Peeracle[hashAlgorithm].create(name);
        if (hashInstance) {
          return hashInstance;
        }
      }

      return null;
    };

    return Hash;
  })();

  // +----------------------------------------------------------------------+
  // | murmurHash3.js v2.1.2 (http://github.com/karanlyons/murmurHash.js)   |
  // | A javascript implementation of MurmurHash3's x86 hashing algorithms. |
  // |----------------------------------------------------------------------|
  // | Copyright (c) 2012 Karan Lyons                                       |
  // | Freely distributable under the MIT license.                          |
  // +----------------------------------------------------------------------+

  ;
  (function(root, undefined) {

    // Create a local object that'll be exported or referenced globally.
    var library = {
      'version': '2.1.2',
      'x86': {},
      'x64': {}
    };

    // PRIVATE FUNCTIONS
    // -----------------

    function _x86Multiply(m, n) {
      //
      // Given two 32bit ints, returns the two multiplied together as a
      // 32bit int.
      //

      return ((m & 0xffff) * n) + ((((m >>> 16) * n) & 0xffff) << 16);
    }

    function _x86Rotl(m, n) {
      //
      // Given a 32bit int and an int representing a number of bit positions,
      // returns the 32bit int rotated left by that number of positions.
      //

      return (m << n) | (m >>> (32 - n));
    }

    function _x86Fmix(h) {
      //
      // Given a block, returns murmurHash3's final x86 mix of that block.
      //

      h ^= h >>> 16;
      h = _x86Multiply(h, 0x85ebca6b);
      h ^= h >>> 13;
      h = _x86Multiply(h, 0xc2b2ae35);
      h ^= h >>> 16;

      return h;
    }

    function _x64Add(m, n) {
      //
      // Given two 64bit ints (as an array of two 32bit ints) returns the two
      // added together as a 64bit int (as an array of two 32bit ints).
      //

      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];

      o[3] += m[3] + n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;

      o[2] += m[2] + n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;

      o[1] += m[1] + n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;

      o[0] += m[0] + n[0];
      o[0] &= 0xffff;

      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    function _x64Multiply(m, n) {
      //
      // Given two 64bit ints (as an array of two 32bit ints) returns the two
      // multiplied together as a 64bit int (as an array of two 32bit ints).
      //

      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];

      o[3] += m[3] * n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;

      o[2] += m[2] * n[3];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;

      o[2] += m[3] * n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;

      o[1] += m[1] * n[3];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;

      o[1] += m[2] * n[2];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;

      o[1] += m[3] * n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;

      o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
      o[0] &= 0xffff;

      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    function _x64Rotl(m, n) {
      //
      // Given a 64bit int (as an array of two 32bit ints) and an int
      // representing a number of bit positions, returns the 64bit int (as an
      // array of two 32bit ints) rotated left by that number of positions.
      //

      n %= 64;

      if (n === 32) {
        return [m[1], m[0]];
      } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>>
          (32 - n))];
      } else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>>
          (32 - n))];
      }
    }

    function _x64LeftShift(m, n) {
      //
      // Given a 64bit int (as an array of two 32bit ints) and an int
      // representing a number of bit positions, returns the 64bit int (as an
      // array of two 32bit ints) shifted left by that number of positions.
      //

      n %= 64;

      if (n === 0) {
        return m;
      } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
      } else {
        return [m[1] << (n - 32), 0];
      }
    }

    function _x64Xor(m, n) {
      //
      // Given two 64bit ints (as an array of two 32bit ints) returns the two
      // xored together as a 64bit int (as an array of two 32bit ints).
      //

      return [m[0] ^ n[0], m[1] ^ n[1]];
    }

    function _x64Fmix(h) {
      //
      // Given a block, returns murmurHash3's final x64 mix of that block.
      // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
      // only place where we need to right shift 64bit ints.)
      //

      h = _x64Xor(h, [0, h[0] >>> 1]);
      h = _x64Multiply(h, [0xff51afd7, 0xed558ccd]);
      h = _x64Xor(h, [0, h[0] >>> 1]);
      h = _x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
      h = _x64Xor(h, [0, h[0] >>> 1]);

      return h;
    }

    // PUBLIC FUNCTIONS
    // ----------------

    library.x86.hash32 = function(key, seed) {
      //
      // Given a string and an optional seed as an int, returns a 32 bit hash
      // using the x86 flavor of MurmurHash3, as an unsigned int.
      //

      key = key || '';
      seed = seed || 0;

      var remainder = key.length % 4;
      var bytes = key.length - remainder;

      var h1 = seed;

      var k1 = 0;

      var c1 = 0xcc9e2d51;
      var c2 = 0x1b873593;

      for (var i = 0; i < bytes; i = i + 4) {
        k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) &
          0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(
          i + 3) & 0xff) << 24);

        k1 = _x86Multiply(k1, c1);
        k1 = _x86Rotl(k1, 15);
        k1 = _x86Multiply(k1, c2);

        h1 ^= k1;
        h1 = _x86Rotl(h1, 13);
        h1 = _x86Multiply(h1, 5) + 0xe6546b64;
      }

      k1 = 0;

      switch (remainder) {
        case 3:
          k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;

        case 2:
          k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;

        case 1:
          k1 ^= (key.charCodeAt(i) & 0xff);
          k1 = _x86Multiply(k1, c1);
          k1 = _x86Rotl(k1, 15);
          k1 = _x86Multiply(k1, c2);
          h1 ^= k1;
      }

      h1 ^= key.length;
      h1 = _x86Fmix(h1);

      return h1 >>> 0;
    };

    library.x86.hash128 = function(key, seed) {
      //
      // Given a string and an optional seed as an int, returns a 128 bit
      // hash using the x86 flavor of MurmurHash3, as an unsigned hex.
      //

      key = key || '';
      seed = seed || 0;

      var remainder = key.length % 16;
      var bytes = key.length - remainder;

      var h1 = seed;
      var h2 = seed;
      var h3 = seed;
      var h4 = seed;

      var k1 = 0;
      var k2 = 0;
      var k3 = 0;
      var k4 = 0;

      var c1 = 0x239b961b;
      var c2 = 0xab0e9789;
      var c3 = 0x38b34ae5;
      var c4 = 0xa1e38b93;

      for (var i = 0; i < bytes; i = i + 16) {
        k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) &
          0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(
          i + 3) & 0xff) << 24);
        k2 = ((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) &
          0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(
          i + 7) & 0xff) << 24);
        k3 = ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) &
          0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key
          .charCodeAt(i + 11) & 0xff) << 24);
        k4 = ((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) &
          0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key
          .charCodeAt(i + 15) & 0xff) << 24);

        k1 = _x86Multiply(k1, c1);
        k1 = _x86Rotl(k1, 15);
        k1 = _x86Multiply(k1, c2);
        h1 ^= k1;

        h1 = _x86Rotl(h1, 19);
        h1 += h2;
        h1 = _x86Multiply(h1, 5) + 0x561ccd1b;

        k2 = _x86Multiply(k2, c2);
        k2 = _x86Rotl(k2, 16);
        k2 = _x86Multiply(k2, c3);
        h2 ^= k2;

        h2 = _x86Rotl(h2, 17);
        h2 += h3;
        h2 = _x86Multiply(h2, 5) + 0x0bcaa747;

        k3 = _x86Multiply(k3, c3);
        k3 = _x86Rotl(k3, 17);
        k3 = _x86Multiply(k3, c4);
        h3 ^= k3;

        h3 = _x86Rotl(h3, 15);
        h3 += h4;
        h3 = _x86Multiply(h3, 5) + 0x96cd1c35;

        k4 = _x86Multiply(k4, c4);
        k4 = _x86Rotl(k4, 18);
        k4 = _x86Multiply(k4, c1);
        h4 ^= k4;

        h4 = _x86Rotl(h4, 13);
        h4 += h1;
        h4 = _x86Multiply(h4, 5) + 0x32ac3b17;
      }

      k1 = 0;
      k2 = 0;
      k3 = 0;
      k4 = 0;

      switch (remainder) {
        case 15:
          k4 ^= key.charCodeAt(i + 14) << 16;

        case 14:
          k4 ^= key.charCodeAt(i + 13) << 8;

        case 13:
          k4 ^= key.charCodeAt(i + 12);
          k4 = _x86Multiply(k4, c4);
          k4 = _x86Rotl(k4, 18);
          k4 = _x86Multiply(k4, c1);
          h4 ^= k4;

        case 12:
          k3 ^= key.charCodeAt(i + 11) << 24;

        case 11:
          k3 ^= key.charCodeAt(i + 10) << 16;

        case 10:
          k3 ^= key.charCodeAt(i + 9) << 8;

        case 9:
          k3 ^= key.charCodeAt(i + 8);
          k3 = _x86Multiply(k3, c3);
          k3 = _x86Rotl(k3, 17);
          k3 = _x86Multiply(k3, c4);
          h3 ^= k3;

        case 8:
          k2 ^= key.charCodeAt(i + 7) << 24;

        case 7:
          k2 ^= key.charCodeAt(i + 6) << 16;

        case 6:
          k2 ^= key.charCodeAt(i + 5) << 8;

        case 5:
          k2 ^= key.charCodeAt(i + 4);
          k2 = _x86Multiply(k2, c2);
          k2 = _x86Rotl(k2, 16);
          k2 = _x86Multiply(k2, c3);
          h2 ^= k2;

        case 4:
          k1 ^= key.charCodeAt(i + 3) << 24;

        case 3:
          k1 ^= key.charCodeAt(i + 2) << 16;

        case 2:
          k1 ^= key.charCodeAt(i + 1) << 8;

        case 1:
          k1 ^= key.charCodeAt(i);
          k1 = _x86Multiply(k1, c1);
          k1 = _x86Rotl(k1, 15);
          k1 = _x86Multiply(k1, c2);
          h1 ^= k1;
      }

      h1 ^= key.length;
      h2 ^= key.length;
      h3 ^= key.length;
      h4 ^= key.length;

      h1 += h2;
      h1 += h3;
      h1 += h4;
      h2 += h1;
      h3 += h1;
      h4 += h1;

      h1 = _x86Fmix(h1);
      h2 = _x86Fmix(h2);
      h3 = _x86Fmix(h3);
      h4 = _x86Fmix(h4);

      h1 += h2;
      h1 += h3;
      h1 += h4;
      h2 += h1;
      h3 += h1;
      h4 += h1;

      return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + (
        "00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" +
        (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(
        16)).slice(-8);
    };

    library.x64.hash128 = function(key, seed) {
      //
      // Given a string and an optional seed as an int, returns a 128 bit
      // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
      //

      key = key || '';
      seed = seed || 0;

      var remainder = key.length % 16;
      var bytes = key.length - remainder;

      var h1 = [0, seed];
      var h2 = [0, seed];

      var k1 = [0, 0];
      var k2 = [0, 0];

      var c1 = [0x87c37b91, 0x114253d5];
      var c2 = [0x4cf5ad43, 0x2745937f];

      for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) &
          0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((
          key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) &
          0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(
          i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) <<
          24)];
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) &
          0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((
          key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i +
          8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key
          .charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i +
          11) & 0xff) << 24)];

        k1 = _x64Multiply(k1, c1);
        k1 = _x64Rotl(k1, 31);
        k1 = _x64Multiply(k1, c2);
        h1 = _x64Xor(h1, k1);

        h1 = _x64Rotl(h1, 27);
        h1 = _x64Add(h1, h2);
        h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 0x52dce729]);

        k2 = _x64Multiply(k2, c2);
        k2 = _x64Rotl(k2, 33);
        k2 = _x64Multiply(k2, c1);
        h2 = _x64Xor(h2, k2);

        h2 = _x64Rotl(h2, 31);
        h2 = _x64Add(h2, h1);
        h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
      }

      k1 = [0, 0];
      k2 = [0, 0];

      switch (remainder) {
        case 15:
          k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 14)], 48));

        case 14:
          k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 13)], 40));

        case 13:
          k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 12)], 32));

        case 12:
          k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 11)], 24));

        case 11:
          k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 10)], 16));

        case 10:
          k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 9)], 8));

        case 9:
          k2 = _x64Xor(k2, [0, key.charCodeAt(i + 8)]);
          k2 = _x64Multiply(k2, c2);
          k2 = _x64Rotl(k2, 33);
          k2 = _x64Multiply(k2, c1);
          h2 = _x64Xor(h2, k2);

        case 8:
          k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 7)], 56));

        case 7:
          k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 6)], 48));

        case 6:
          k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 5)], 40));

        case 5:
          k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 4)], 32));

        case 4:
          k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 3)], 24));

        case 3:
          k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 2)], 16));

        case 2:
          k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 1)], 8));

        case 1:
          k1 = _x64Xor(k1, [0, key.charCodeAt(i)]);
          k1 = _x64Multiply(k1, c1);
          k1 = _x64Rotl(k1, 31);
          k1 = _x64Multiply(k1, c2);
          h1 = _x64Xor(h1, k1);
      }

      h1 = _x64Xor(h1, [0, key.length]);
      h2 = _x64Xor(h2, [0, key.length]);

      h1 = _x64Add(h1, h2);
      h2 = _x64Add(h2, h1);

      h1 = _x64Fmix(h1);
      h2 = _x64Fmix(h2);

      h1 = _x64Add(h1, h2);
      h2 = _x64Add(h2, h1);

      return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + (
        "00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + (
        "00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + (
        "00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    };

    // INITIALIZATION
    // --------------

    // Export murmurHash3 for CommonJS, either as an AMD module or just as part
    // of the global object.
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = library;
      }

      exports.murmurHash3 = library;
    } else if (typeof define === 'function' && define.amd) {
      define([], function() {
        return library;
      });
    } else {
      // Use murmurHash3.noConflict to restore `murmurHash3` back to its
      // original value. Returns a reference to the library object, to allow
      // it to be used under a different name.
      library._murmurHash3 = root.murmurHash3

      library.noConflict = function() {
        root.murmurHash3 = library._murmurHash3;
        library._murmurHash3 = undefined;
        library.noConflict = undefined;

        return library;
      };

      root.murmurHash3 = library;
    }
  })(typeof window === 'undefined' ? this : window);

  /* eslint-disable */
  Peeracle.Murmur3Hash = (function() {
    /* eslint-enable */
    /**
     * @class Murmur3Hash
     * @memberof {Peeracle}
     * @constructor
     * @implements {Hash}
     */
    function Murmur3Hash() {
      this.string = '';
      this.seed = 0x5052434C;
    }

    Murmur3Hash.IDENTIFIER = 'murmur3_x86_128';

    /**
     * @function Murmur3Hash#create
     * @param {String} name
     * @return {?Hash}
     */
    Murmur3Hash.create = function create(name) {
      if (name === Murmur3Hash.IDENTIFIER) {
        return new Murmur3Hash();
      }
      return null;
    };

    /**
     * @function Murmur3Hash#serialize
     * @param {String} value
     * @param {Peeracle.DataStream=} dataStream
     * @param {Function=} cb
     * @return {?Uint8Array}
     */
    Murmur3Hash.serialize = function serialize(value, dataStream, cb) {
      var bytes;
      var dv;
      var i = 0;

      if (!dataStream) {
        bytes = new ArrayBuffer(32);
        dv = new DataView(bytes);
        for (i = 0; i < 32; ++i) {
          dv.setUint8(i, value.charCodeAt(i));
        }
        return new Uint8Array(bytes);
      }

      dataStream.writeByte(parseInt(value.substr(i * 2, 2), 16),
        function writeCb(error) {
          if (error) {
            cb(error);
            return;
          }

          if (++i < 16) {
            dataStream.writeByte(parseInt(value.substr(i * 2, 2), 16),
              writeCb);
          } else {
            cb(null);
          }
        });
    };

    /**
     * @function Murmur3Hash#unserialize
     * @param {Peeracle.DataStream} dataStream
     * @param {Function} cb
     */
    Murmur3Hash.unserialize = function unserialize(dataStream, cb) {
      var i;
      var str;
      var syncBytes;

      if (!cb) {
        syncBytes = dataStream.read(16);

        str = '';
        for (i = 0; i < 16; ++i) {
          str += ('00' + syncBytes[i].toString(16)).slice(-2);
        }

        return str;
      }

      dataStream.read(16, function readByteCb(error, bytes) {
        if (error) {
          cb(error);
          return;
        }

        str = '';
        for (i = 0; i < 16; ++i) {
          str += ('00' + bytes[i].toString(16)).slice(-2);
        }

        cb(null, str);
      });
    };

    Murmur3Hash.prototype = Object.create(Peeracle.Hash.prototype);
    Murmur3Hash.prototype.constructor = Murmur3Hash;

    /**
     * @function Murmur3Hash#checksum
     * @param {Uint8Array} array
     * @return {String}
     */
    Murmur3Hash.prototype.checksum = function checksum(array) {
      this.init();
      this.update(array);
      return this.finish();
    };

    /**
     * @function Murmur3Hash#init
     */
    Murmur3Hash.prototype.init = function init() {
      this.string = '';
    };

    /**
     * @function Murmur3Hash#update
     * @param {Uint8Array|String} array
     */
    Murmur3Hash.prototype.update = function update(array) {
      var i;
      var l = array.length;

      if ((typeof array) === 'string' && l === 32) {
        for (i = 0; i < 32; i += 2) {
          this.string += String.fromCharCode(parseInt(array.substr(i, 2),
            16));
        }
      } else {
        for (i = 0; i < l; ++i) {
          this.string += String.fromCharCode(array[i]);
        }
      }
    };

    /**
     * @function Murmur3Hash#finish
     * @return {String}
     */
    Murmur3Hash.prototype.finish = function finish() {
      return murmurHash3.x86.hash128(this.string, this.seed);
    };

    return Murmur3Hash;
  })();

  /* eslint-disable */

  Peeracle.Media = (function() {
    /**
     * @interface Media
     * @memberof {Peeracle}
     * @property {Array.<MediaCue>} cues;
     * @property {Array.<MediaTrack>} tracks;
     * @property {Number} timecodeScale;
     * @property {Number} duration;
     * @property {String} mimeType;
     */
    /* istanbul ignore next */
    function Media() {}

    /**
     * @function Media#loadFromDataStream
     * @param {DataStream} dataStream
     * @param {Media~loadFromDataStreamCallback} cb
     * @return {?Media}
     */
    Media.loadFromDataStream = function loadFromDataStream(dataStream, cb) {
      var i = 0;
      var mediaInstance;
      var mediaFormats = ['ISOBMFFMedia', 'WebMMedia'];
      var mediaFormat = mediaFormats[i];

      mediaInstance = Peeracle[mediaFormat].loadFromDataStream(
        dataStream,
        function loadFromDataStreamCallback(error, instance) {
          if (!error) {
            cb(null, instance);
            return;
          }

          if (++i < mediaFormats.length) {
            mediaFormat = mediaFormats[i];
            mediaInstance = Peeracle[mediaFormat].loadFromDataStream(
              dataStream,
              loadFromDataStreamCallback);
            return;
          }

          cb(new Error('Unknown media format'));
        });
    };

    /**
     * @function Media#init
     * @param {Media~segmentCallback} cb
     */
    Media.prototype.init = function init(cb) {};

    /**
     * @function Media#getInitSegment
     * @param {Media~segmentCallback} cb
     * @return {?Media}
     */
    Media.prototype.getInitSegment = function getInitSegment(cb) {};

    /**
     * @function Media#getMediaSegment
     * @param {Number} timecode
     * @param {Media~segmentCallback} cb
     * @return {?Media}
     */
    Media.prototype.getMediaSegment = function getMediaSegment(timecode,
      cb) {};

    /**
     * @callback Media~loadFromDataStreamCallback
     * @param {Error} error
     * @param {Media} instance
     */

    /**
     * Callback function for segment callbacks.
     * @callback Media~segmentCallback
     * @param {Error} error
     * @param {Uint8Array} bytes
     */

    /**
     * @typedef {Object} MediaTrack
     * @property {Number} id
     * @property {Number} type
     * @property {String} codec
     * @property {Number} width
     * @property {Number} height
     * @property {Number} samplingFrequency
     * @property {Number} channels
     * @property {Number} bitDepth
     */

    /**
     * @typedef {Object} MediaCue
     * @property {Number} timecode
     * @property {Number} offset
     * @property {Number} length
     */

    return Media;
  })();

  /* eslint-disable */
  Peeracle.ISOBMFFMedia = (function() {
    /* eslint-enable */
    /**
     * @class ISOBMFFMedia
     * @memberof {Peeracle}
     * @constructor
     * @implements {Media}
     * @param {DataStream} dataStream
     *
     * @property {DataStream} dataStream
     * @property {Boolean} initialized
     * @property {Uint8Array} initSegment
     * @property {ISOBMFFAtom} root
     * @property {String} majorBrand
     * @property {?Number} version
     * @property {Array.<String>} brands
     * @property {MediaTrack} track
     * @property {Array.<MediaTrack>} tracks
     * @property {Array.<MediaCues>} cues;
     */
    function ISOBMFFMedia(dataStream) {
      this.dataStream = dataStream;
      this.initialized = false;
      this.initSegment = null;
      this.root = null;
      this.majorBrand = '';
      this.version = null;
      this.brands = [];
      this.track = null;
      this.tracks = [];
      this.cues = [];
    }

    ISOBMFFMedia.ATOM_FTYP = 0x66747970;
    ISOBMFFMedia.ATOM_MOOV = 0x6d6f6f76;
    ISOBMFFMedia.ATOM_SIDX = 0x73696478;

    ISOBMFFMedia.prototype = Object.create(Peeracle.Media.prototype);
    ISOBMFFMedia.prototype.constructor = ISOBMFFMedia;

    /**
     * @function ISOBMFFMedia#loadFromDataStream
     * @param {DataStream} dataStream
     * @param {Media~loadFromDataStreamCallback} cb
     * @return {?ISOBMFFMedia}
     */
    ISOBMFFMedia.loadFromDataStream =
      function loadFromDataStream(dataStream, cb) {
        dataStream.peek(8, function peekCb(error, array, length) {
          if (length !== 8 || (array[4] !== 0x66 && array[5] !== 0x74 &&
              array[6] !== 0x79 && array[7] !== 0x70)) {
            cb(new Error('Invalid header'));
            return;
          }

          cb(null, new ISOBMFFMedia(dataStream));
        });
      };

    ISOBMFFMedia.prototype.readNextAtom_ = function readNextAtom_(cb) {
      /** @type ISOBMFFAtom */
      var atom = {};
      var _this = this;

      atom.offset = this.dataStream.tell();
      this.dataStream.readUInteger(function readLengthCb(lengthError,
        result) {
        if (lengthError) {
          cb(lengthError);
          return;
        }

        atom.length = result;
        _this.dataStream.readUInteger(function readIdCb(idError, id) {
          if (idError) {
            cb(idError);
            return;
          }

          atom.id = id;
          atom.children = [];
          cb(null, atom);
        });
      });
    };

    ISOBMFFMedia.prototype.parseAtomHeaders_ =
      function parseAtomHeaders_(cb) {
        var _this = this;
        var version = 0;
        var flags = 0;

        this.dataStream.readByte(function parseAtomHeadersVersionCb(err,
          byte) {
          if (err) {
            cb(err);
            return;
          }

          version = byte;
          _this.dataStream.read(3, function parseAtomHeadersFlagsCb(
            err, bytes) {
            if (err) {
              cb(err);
              return;
            }

            flags = (bytes[0] << 16) + (bytes[1] << 8) + (bytes[2] <<
              0);
            cb(null, version, flags);
          });
        });
      };

    ISOBMFFMedia.prototype.parseFtypCompatibleBrands_ =
      function parseFtypCompatibleBrands_(atom, cb) {
        var _this = this;

        this.dataStream.read(4, function readCompatibleBrand(err, bytes) {
          var i;
          var brand = '';

          if (err) {
            cb(err);
            return;
          }

          brand = '';
          for (i = 0; i < 4; ++i) {
            brand += String.fromCharCode(bytes[i]);
          }
          _this.brands.push(brand);

          if (_this.dataStream.tell() < atom.length) {
            _this.dataStream.read(4, readCompatibleBrand);
            return;
          }

          cb(null);
        });
      };

    ISOBMFFMedia.prototype.parseFtypVersion_ =
      function parseFtypVersion_(atom, cb) {
        var _this = this;

        this.dataStream.read(4, function readFtypVersionCb(err, bytes) {
          if (err) {
            cb(err);
            return;
          }

          _this.version = ((bytes[0] << 24) +
            (bytes[1] << 16) +
            (bytes[2] << 8) +
            bytes[3]) >>> 0;

          _this.parseFtypCompatibleBrands_(atom, cb);
        });
      };

    ISOBMFFMedia.prototype.parseFtyp_ = function parseFtyp_(atom, cb) {
      var _this = this;

      console.log('parsing ftyp atom', this.dataStream.tell());
      this.dataStream.read(4, function readMajorBrandCb(err, bytes) {
        var i;

        if (err) {
          cb(err);
          return;
        }

        _this.majorBrand = '';
        for (i = 0; i < 4; ++i) {
          _this.majorBrand += String.fromCharCode(bytes[i]);
        }

        _this.parseFtypVersion_(atom, cb);
      });
    };

    ISOBMFFMedia.prototype.parseMoov_ = function parseMoov_(atom, cb) {
      console.log('parsing moov atom');
      this.parseAtoms_(atom, cb);
    };

    ISOBMFFMedia.prototype.parseTrak_ = function parseTrak_(atom, cb) {
      console.log('parsing trak atom');

      this.track = {
        id: -1,
        type: -1,
        codec: '',
        width: -1,
        height: -1,
        samplingFrequency: -1,
        channels: -1,
        bitDepth: -1
      };

      this.parseAtoms_(atom, cb);
    };

    ISOBMFFMedia.prototype.parseTkhd_ = function parseTkhd_(atom, cb) {
      var _this = this;

      console.log('parsing tkhd atom');
      this.parseAtomHeaders_(function parseTkhdHeadersCb(err, version,
        flags) {
        if (err) {
          cb(err);
          return;
        }

        if (version) {
          cb(new Error('tkhd: invalid version'));
          return;
        }

        if (!(flags & 0x0001) || !(flags & 0x0002)) {
          console.warn(
            'Track not enabled or not used in the movie.');
        }

        _this.dataStream.skip(8);
        _this.dataStream.readUInteger(function readTkhdId(err, id) {
          if (err) {
            cb(err);
            return;
          }

          _this.track.id = id;
          cb(null);
        });
      });
    };

    ISOBMFFMedia.prototype.parseMdia_ = function parseMdia_(atom, cb) {
      console.log('parsing mdia atom');
      this.parseAtoms_(atom, cb);
    };

    ISOBMFFMedia.prototype.parseHdlr_ = function parseHdlr_(atom, cb) {
      var _this = this;

      console.log('parsing hdlr atom');
      this.parseAtomHeaders_(function parseTkhdHeadersCb(err, version,
        flags) {
        if (err) {
          cb(err);
          return;
        }

        _this.dataStream.skip(4);
        _this.dataStream.read(4, function readTypeCb(err, bytes) {
          var i;
          var type = '';

          if (err) {
            cb(err);
            return;
          }

          for (i = 0; i < 4; ++i) {
            type += String.fromCharCode(bytes[i]);
          }

          if (type === 'vide') {
            _this.track.type = 1;
          } else if (type === 'soun') {
            _this.track.type = 2;
          }
          cb(null);
        });
      });
    };

    ISOBMFFMedia.prototype.parseMinf_ = function parseMinf_(atom, cb) {
      console.log('parsing minf atom');
      this.parseAtoms_(atom, cb);
    };

    ISOBMFFMedia.prototype.parseStbl_ = function parseStbl_(atom, cb) {
      console.log('parsing stbl atom');
      this.parseAtoms_(atom, cb);
    };

    function decToHex(d, padding) {
      var hex = Number(d).toString(16);
      var pad = padding;

      pad = typeof(pad) === 'undefined' || pad === null ? pad = 2 : pad;
      while (hex.length < pad) {
        hex = '0' + hex;
      }
      return hex;
    }

    ISOBMFFMedia.prototype.parseAvcC_ = function parseAvcC_(atom, cb) {
      var _this = this;

      console.log('parsing avcC atom');
      this.dataStream.skip(1);
      this.dataStream.readByte(function parseAvcCProfile(err, profile) {
        if (err) {
          cb(err);
          return;
        }

        _this.dataStream.readByte(function parseAvcCCompat(err,
          compat) {
          if (err) {
            cb(err);
            return;
          }

          _this.dataStream.readByte(function parseAvcCLevel(err,
            level) {
            if (err) {
              cb(err);
              return;
            }

            _this.track.codec += '.' + decToHex(profile);
            _this.track.codec += decToHex(compat);
            _this.track.codec += decToHex(level);

            _this.tracks.push(_this.track);
            cb(null);
          });
        });
      });
    };

    ISOBMFFMedia.prototype.parseSampleVideo_ =
      function parseSampleVideo_(atom, cb) {
        var _this = this;

        this.dataStream.skip(16);
        this.dataStream.readUShort(function readSampleVideoWidthCb(err,
          width) {
          if (err) {
            cb(err);
            return;
          }

          _this.track.width = width;
          _this.dataStream.readUShort(
            function readSampleVideoHeightCb(err, height) {
              if (err) {
                cb(err);
                return;
              }

              _this.track.height = height;
              _this.dataStream.skip(46);
              _this.dataStream.readUShort(
                function readSampleVideoDepth(err, bitDepth) {
                  if (err) {
                    cb(err);
                    return;
                  }

                  _this.track.bitDepth = bitDepth;
                  _this.dataStream.skip(2);
                  _this.parseAtoms_(atom, cb);
                });
            });
        });
      };

    ISOBMFFMedia.prototype.parseSampleAudio_ =
      function parseSampleAudio_(atom, cb) {
        var _this = this;

        this.dataStream.skip(8);
        this.dataStream.readUShort(
          function readSampleAudioNumChannels(err, channels) {
            if (err) {
              cb(err);
              return;
            }

            _this.track.channels = channels;
            _this.dataStream.skip(6);
            _this.dataStream.readUShort(
              function readSampleAudioSamplingFreq(err, freq) {
                if (err) {
                  cb(err);
                  return;
                }

                _this.track.samplingFrequency = freq;
                _this.dataStream.skip(2);
                _this.parseAtoms_(atom, cb);
              });
          });
      };

    ISOBMFFMedia.prototype.parseEsds_ = function parseEsds_(atom, cb) {
      var _this = this;
      var length;

      console.log('parsing esds atom');
      this.dataStream.readByte(function parseEsdsVersion(err, version) {
        if (err) {
          cb(err);
          return;
        }

        if (version) {
          cb(new Error('invalid esds version'));
          return;
        }

        _this.dataStream.skip(3);
        _this.dataStream.readByte(function parseEsdsType(err, type) {
          if (err) {
            cb(err);
            return;
          }

          if (type === 0x3) {
            _this.dataStream.skip(4);
          } else {
            _this.dataStream.skip(2);
          }

          _this.dataStream.readByte(function parseEsdsByte(err,
            byte) {
            if (err) {
              cb(err);
              return;
            }

            if (byte !== 0x4) {
              cb(new Error('invalid esds byte'));
              return;
            }

            _this.dataStream.readByte(function parseEsdsRange(
              err, range) {
              if (err) {
                cb(err);
                return;
              }

              if (range < 15) {
                cb(new Error('invalid esds range'));
                return;
              }

              _this.dataStream.readByte(function parseEsdsObjectTypeId(
                err, objectTypeId) {
                if (err) {
                  cb(err);
                  return;
                }

                _this.dataStream.skip(12);
                _this.dataStream.readByte(function parseEsdsObjectTypeId(
                  err, check) {
                  if (err) {
                    cb(err);
                    return;
                  }

                  if (check !== 5) {
                    cb(new Error(
                      'invalid esds check'));
                    return;
                  }

                  _this.dataStream.readByte(
                    function parseEsdsObjectTypeId(
                      err, toSkip) {
                      if (err) {
                        cb(err);
                        return;
                      }

                      _this.dataStream.skip(
                        toSkip);
                      _this.dataStream.readByte(
                        function parseEsdsObjectTypeId(
                          err, secondcheck) {
                          if (err) {
                            cb(err);
                            return;
                          }

                          if (secondcheck !==
                            6) {
                            cb(new Error(
                              'invalid esds second check'
                            ));
                            return;
                          }

                          _this.dataStream.readByte(
                            function parseEsdsSLConfigLength(
                              err,
                              SLConfigLength
                            ) {
                              if (err) {
                                cb(err);
                                return;
                              }

                              if (
                                SLConfigLength !==
                                1) {
                                cb(new Error(
                                  'invalid esds SLConfigLength'
                                ));
                                return;
                              }

                              _this.dataStream
                                .readByte(
                                  function parseEsdsSLConfigLength(
                                    err,
                                    SLConfig
                                  ) {
                                    if (
                                      err
                                    ) {
                                      cb(
                                        err
                                      );
                                      return
                                      ;
                                    }

                                    _this
                                      .track
                                      .codec +=
                                      '.' +
                                      decToHex(
                                        objectTypeId
                                      );
                                    _this
                                      .track
                                      .codec +=
                                      '.' +
                                      SLConfig
                                      .toString(
                                        16
                                      );
                                    _this
                                      .tracks
                                      .push(
                                        _this
                                        .track
                                      );
                                    _this
                                      .parseAtoms_(
                                        atom,
                                        cb
                                      );
                                  });
                            });
                        });
                    });
                });
              });
            });
          });
        });
      });
    };

    ISOBMFFMedia.prototype.parseStsdEntry_ = function parseStsdEntry_(
      atom, cb) {
      var _this = this;

      _this.dataStream.readUInteger(function readStsdEntrySizeCb(err,
        size) {
        if (err) {
          cb(err);
          return;
        }

        _this.dataStream.read(4, function readStsdEntryCodecCb(err,
          bytes) {
          var i;
          var codec = '';

          if (err) {
            cb(err);
            return;
          }

          for (i = 0; i < 4; ++i) {
            codec += String.fromCharCode(bytes[i]);
          }

          _this.track.codec = codec;
          _this.dataStream.skip(8);
          if (codec === 'avc1') {
            console.log('avc1 codec');
            _this.parseSampleVideo_(atom, cb);
          } else if (codec === 'mp4a') {
            console.log('mp4a codec');
            _this.parseSampleAudio_(atom, cb);
          } else {
            console.warn('unknown stsd codec', codec);
          }
        });
      });
    };

    ISOBMFFMedia.prototype.parseStsd_ = function parseStsd_(atom, cb) {
      var _this = this;

      console.log('parsing stsd atom');
      this.parseAtomHeaders_(function parseTkhdHeadersCb(err, version,
        flags) {
        if (err) {
          cb(err);
          return;
        }

        if (version) {
          cb(new Error('invalid version'));
          return;
        }

        _this.dataStream.readUInteger(function parseStsdCountCb(err,
          count) {
          var i = 0;

          _this.parseStsdEntry_(atom, function parseStsdEntryCb(
            err) {
            if (err) {
              cb(err);
              return;
            }

            if (++i < count) {
              _this.parseStsdEntry_(parseStsdEntryCb);
              return;
            }

            cb(null);
          });
        });
      });
    };

    ISOBMFFMedia.prototype.parseSidxReference_ =
      function parseSidxReference_(offset, time, cb) {
        var _this = this;

        this.dataStream.readUInteger(
          function readSidxReferenceHeaderCb(err, head) {
            if (err) {
              cb(err);
              return;
            }

            _this.dataStream.readUInteger(
              function readSixReferenceDurationCb(err, duration) {
                var timecode = time;
                var newOffset = offset;
                var cue;

                if (err) {
                  cb(err);
                  return;
                }

                cue = {
                  timecode: timecode * 1000,
                  offset: newOffset
                };

                _this.cues.push(cue);
                _this.dataStream.skip(4);
                cb(null, newOffset + (head & 0x8FFFFFFF),
                  timecode + (duration / _this.timecodeScale));
              });
          });
      };

    ISOBMFFMedia.prototype.parseSidx_ = function parseSidx_(atom, cb) {
      var _this = this;

      console.log('parsing sidx atom');
      this.parseAtomHeaders_(function parseSidxHeadersCb(err, version,
        flags) {
        if (err) {
          cb(err);
          return;
        }

        _this.dataStream.skip(4);
        _this.dataStream.readUInteger(function readSidxTimecodeScale(
          err, scale) {
          var readMethod;

          if (err) {
            cb(err);
            return;
          }

          _this.timecodeScale = scale;
          if (version === 0) {
            readMethod = 'readUInteger';
          } else {
            readMethod = 'readUInteger64';
          }

          _this.dataStream[readMethod](
            function readEarliestPresentationTime(err, ept) {
              if (err) {
                cb(err);
                return;
              }

              _this.dataStream[readMethod](
                function readFirstOffset(err, firstOffset) {
                  if (err) {
                    cb(err);
                    return;
                  }

                  _this.dataStream.skip(2);
                  _this.dataStream.readUShort(
                    function readSidxRefCount(err, count) {
                      var i = 0;

                      if (err) {
                        cb(err);
                        return;
                      }

                      _this.parseSidxReference_(atom.offset +
                        atom.length +
                        firstOffset, ept / _this.timecodeScale,
                        function parseSidxReferenceCb(
                          err, offset, timecode) {
                          if (err) {
                            cb(err);
                            return;
                          }

                          if (++i < count) {
                            _this.parseSidxReference_(
                              offset, timecode,
                              parseSidxReferenceCb);
                            return;
                          }

                          cb(null);
                        });
                    });
                });
            });
        });
      });
    };

    ISOBMFFMedia.prototype.parseAtoms_ = function parseAtoms_(parent, cb) {
      var _this = this;

      this.readNextAtom_(function readNextAtomCb(err, atom) {
        var i;
        var hexId;
        var strId = '';
        var methodName;

        if (err) {
          cb(err);
          return;
        }

        hexId = atom.id.toString(16);
        for (i = 0; i < hexId.length; i += 2) {
          strId += String.fromCharCode(parseInt(hexId.substr(i, 2),
            16));
        }

        methodName = 'parse' + strId.charAt(0).toUpperCase() +
          strId.slice(1) + '_';

        if (methodName === 'parseMoof_') {
          _this.initSegmentLength = _this.dataStream.offset;
          _this.dataStream.seek(0);
          _this.dataStream.read(_this.initSegmentLength - 8,
            function readInit(err, initSegment) {
              _this.initSegment = initSegment;
              cb(null);
            });
          return;
        }

        console.log('trying to call', methodName);
        if (ISOBMFFMedia.prototype.hasOwnProperty(methodName)) {
          _this[methodName].call(_this, atom, function parseAtomCb(
            err) {
            if (err) {
              cb(err);
              return;
            }

            parent.children.push(atom);

            if (atom.offset + atom.length >= parent.offset +
              parent.length) {
              cb(null);
              return;
            }

            _this.dataStream.seek(atom.offset + atom.length);
            _this.readNextAtom_(readNextAtomCb);
          });
          return;
        }

        parent.children.push(atom);

        if (atom.offset + atom.length >= parent.offset + parent.length) {
          cb(null);
          return;
        }

        _this.dataStream.seek(atom.offset + atom.length);
        _this.readNextAtom_(readNextAtomCb);
      });
    };

    /**
     * @function ISOBMFFMedia#init
     * @param cb
     */
    ISOBMFFMedia.prototype.init = function init(cb) {
      var _this = this;

      if (this.initialized) {
        cb(null);
        return;
      }

      this.root = {
        id: 0,
        offset: 0,
        length: this.dataStream.size(),
        children: [],
        bytes: null
      };

      this.dataStream.seek(0);
      this.parseAtoms_(this.root, function parseAtomsCb(err) {
        if (err) {
          cb(err);
          return;
        }

        _this.initMimeType_();
        console.log(_this.root);
        console.log(_this.cues);
        console.log(_this.mimeType);
        _this.initialized = true;
        cb();
      });
    };

    ISOBMFFMedia.prototype.initMimeType_ = function initMimeType_() {
      var i;
      var l;
      var track;
      var mimeType;
      var isVideo = false;
      var isAudio = false;
      var codecs = [];
      var type = '';

      for (i = 0, l = this.tracks.length; i < l; ++i) {
        track = this.tracks[i];
        if (track.type === 1) {
          isVideo = true;
        } else if (track.type === 2) {
          isAudio = true;
        }

        codecs.push(track.codec);
      }

      if (isVideo) {
        type = 'video/mp4';
      } else if (isAudio) {
        type = 'audio/mp4';
      }

      mimeType = type + ';codecs="';
      for (i = 0; i < codecs.length; ++i) {
        mimeType += codecs[i];
        if (i + 1 !== codecs.length) {
          mimeType += ',';
        }
      }

      this.mimeType = mimeType + '"';
    };

    ISOBMFFMedia.prototype.getInitSegment = function getInitSegment(cb) {
      var _this = this;

      if (!this.initialized) {
        this.init(function initCb(error) {
          if (error) {
            cb(error);
            return;
          }

          cb(null, _this.initSegment);
        });
        return;
      }

      cb(null, this.initSegment);
    };

    ISOBMFFMedia.prototype.findCueAtTimecode = function findCueAtTimecode(
      timecode) {
      var index;
      var length = this.cues.length;
      var cue;

      for (index = 0; index < length; ++index) {
        cue = this.cues[index];
        if (cue.timecode === timecode) {
          return cue;
        }
      }

      return null;
    };

    ISOBMFFMedia.prototype.getMediaSegment =
      function getMediaSegment(timecode, cb) {
        var _this = this;
        var cue;

        if (!this.initialized) {
          this.init(function initCb(error) {
            if (error) {
              cb(error);
              return;
            }

            _this.getMediaSegment(timecode, cb);
          });
          return;
        }

        cue = this.findCueAtTimecode(timecode);
        if (!cue) {
          cb(new Error('Unknown timecode'));
          return;
        }

        this.dataStream.seek(cue.offset);
        this.dataStream.readUInteger(function readMoofLengthCb(err,
          moofLength) {
          if (err) {
            cb(err);
            return;
          }

          _this.dataStream.read(moofLength - 4, function readMoofBytes(
            err, moofBytes) {
            if (err) {
              cb(err);
              return;
            }

            _this.dataStream.readUInteger(function readMdatLengthCb(
              err, mdatLength) {
              if (err) {
                cb(err);
                return;
              }

              _this.dataStream.read(mdatLength, function readMdatBytes(
                err, mdatBytes) {
                var segment;
                var buffer;

                if (err) {
                  cb(err);
                  return;
                }

                segment = new Uint8Array(moofLength +
                  mdatLength + 8);

                buffer = new Peeracle.MemoryDataStream({
                  buffer: segment
                });
                buffer.writeUInteger(moofLength);
                buffer.write(moofBytes);
                buffer.writeUInteger(mdatLength);
                buffer.write(mdatBytes);

                cb(null, segment);
              });
            });
          });
        });
      };

    /**
     * @typedef {Object} ISOBMFFAtom
     * @property {number} id
     * @property {number} offset
     * @property {number} length
     * @property {Array<ISOBMFFAtom>} children
     */

    return ISOBMFFMedia;
  })();

  /* eslint-disable */
  Peeracle.WebMMedia = (function() {
    /* eslint-enable */
    /**
     * @class WebMMedia
     * @memberof {Peeracle}
     * @constructor
     * @implements {Media}
     * @param {DataStream} dataStream
     *
     * @property {DataStream} dataStream;
     * @property {Boolean} initialized;
     * @property {Uint8Array} initSegment;
     * @property {EBMLTag} seekHeadTag;
     * @property {EBMLSeekTable} seeks;
     * @property {Array.<MediaCue>} cues;
     * @property {Array.<MediaTrack>} tracks;
     * @property {Number} timecodeScale;
     * @property {Number} duration;
     * @property {String} mimeType;
     */
    function WebMMedia(dataStream) {
      this.dataStream = dataStream;
      this.initialized = false;
      this.initSegment = null;
      this.seekHeadTag = null;
      this.seeks = {};
      this.cues = [];
      this.tracks = [];
      this.timecodeScale = -1;
      this.duration = -1;
      this.mimeType = '';
    }

    WebMMedia.CODEC_VP8 = 'V_VP8';
    WebMMedia.CODEC_VP9 = 'V_VP9';
    WebMMedia.CODEC_VORBIS = 'A_VORBIS';
    WebMMedia.CODEC_OPUS = 'A_OPUS';

    WebMMedia.SEEK_CLUSTER = '1f43b675';
    WebMMedia.SEEK_CUES = '1c53bb6b';
    WebMMedia.SEEK_INFO = '1549a966';
    WebMMedia.SEEK_TRACKS = '1654ae6b';

    WebMMedia.TAG_EBML = 0x1A45DFA3;
    WebMMedia.TAG_SEGMENT = 0x18538067;
    WebMMedia.TAG_SEEKHEAD = 0x114D9B74;

    WebMMedia.TAG_INFO = 0x1549A966;
    WebMMedia.TAG_TIMECODESCALE = 0x2AD7B1;
    WebMMedia.TAG_DURATION = 0x4489;

    WebMMedia.TAG_TRACKS = 0x1654AE6B;
    WebMMedia.TAG_TRACKENTRY = 0xAE;
    WebMMedia.TAG_TRACKNUMBER = 0xD7;
    WebMMedia.TAG_TRACKTYPE = 0x83;
    WebMMedia.TAG_CODECID = 0x86;

    WebMMedia.TAG_VIDEO = 0xE0;
    WebMMedia.TAG_PIXELWIDTH = 0xB0;
    WebMMedia.TAG_PIXELHEIGHT = 0xBA;

    WebMMedia.TAG_AUDIO = 0xE1;
    WebMMedia.TAG_SAMPLINGFREQUENCY = 0xB5;
    WebMMedia.TAG_CHANNELS = 0x9F;
    WebMMedia.TAG_BITDEPTH = 0x6264;

    WebMMedia.TAG_CUES = 0x1C53BB6B;
    WebMMedia.TAG_CUEPOINT = 0xBB;
    WebMMedia.TAG_CUETIME = 0xB3;
    WebMMedia.TAG_CUETRACKPOSITIONS = 0xB7;
    WebMMedia.TAG_CUETRACK = 0xF7;
    WebMMedia.TAG_CUECLUSTERPOSITION = 0xF1;

    /**
     * @function WebMMedia#loadFromDataStream
     * @param {Peeracle.DataStream} dataStream
     * @param {Media~loadFromDataStreamCallback} cb
     * @return {?WebMMedia}
     */
    WebMMedia.loadFromDataStream = function loadFromDataStream(dataStream,
      cb) {
      dataStream.peek(4, function peekCb(error, array, length) {
        if (length !== 4 || (array[0] !== 0x1A && array[1] !== 0x45 &&
            array[2] !== 0xDF && array[3] !== 0xA3)) {
          cb(new Error('Invalid header'));
          return;
        }

        cb(null, new WebMMedia(dataStream));
      });
    };

    WebMMedia.prototype = Object.create(Peeracle.Media.prototype);
    WebMMedia.prototype.constructor = WebMMedia;

    WebMMedia.prototype.getInitSegment = function getInitSegment(cb) {
      var _this = this;

      if (!this.initialized) {
        this.init(function initCb(error) {
          if (error) {
            cb(error);
            return;
          }

          cb(null, _this.initSegment);
        });
        return;
      }

      cb(null, this.initSegment);
    };

    WebMMedia.prototype.findCueAtTimecode = function findCueAtTimecode(
      timecode) {
      var index;
      var length = this.cues.length;
      var cue;

      for (index = 0; index < length; ++index) {
        cue = this.cues[index];
        if (cue.timecode === timecode) {
          return cue;
        }
      }

      return null;
    };

    WebMMedia.prototype.getMediaSegment = function getMediaSegment(
      timecode, cb) {
      var _this = this;
      var cue;

      if (!this.initialized) {
        this.init(function initCb(error) {
          if (error) {
            cb(error);
            return;
          }

          _this.getMediaSegment(timecode, cb);
        });
        return;
      }

      cue = this.findCueAtTimecode(timecode);
      if (!cue) {
        cb(new Error('Unknown timecode'));
        return;
      }

      this.dataStream.seek(cue.offset);
      this.readEBMLTag_(function readTagCb(error, tag) {
        _this.dataStream.seek(tag.offset);
        _this.dataStream.read(tag.headerLength + tag.dataLength,
          function readCb(err, bytes) {
            if (err) {
              cb(err);
              return;
            }

            cb(null, bytes);
          });
      });
    };

    /**
     * @function WebMMedia#readVariableInt_
     * @param {Uint8Array} bytes
     * @param {Number} maxSize
     * @param {Number=} offset
     * @return {?Object}
     * @private
     */
    WebMMedia.prototype.readVariableInt_ =
      function readVariableInt_(bytes, maxSize, offset) {
        var index = (offset && offset > 0) ? offset : 0;
        var count = 1;
        var length = bytes[index];
        var bytesRead = 1;
        var lengthMask = 0x80;

        if (!length) {
          return null;
        }

        while (bytesRead <= maxSize && !(length & lengthMask)) {
          bytesRead++;
          lengthMask >>= 1;
        }

        if (bytesRead > maxSize) {
          return null;
        }

        length &= ~lengthMask;
        while (count++ < bytesRead) {
          length = (length << 8) | bytes[++index];
        }

        return {
          length: bytesRead,
          result: length
        };
      };

    /**
     * @function WebMMedia#readUInt_
     * @param {Uint8Array} bytes
     * @param {Number} size
     * @param {Number=} offset
     * @returns {EBMLReadResult}
     * @private
     */
    WebMMedia.prototype.readUInt_ = function readUInt_(bytes, size,
      offset) {
      var i;
      var start = (offset && offset > 0) ? offset : 0;
      var val = 0;

      if (size < 1 || size > 8) {
        return {
          error: new RangeError('Length out of bounds: ' + size),
          result: null
        };
      }

      for (i = 0; i < size; ++i) {
        val <<= 8;
        val |= bytes[start + i] & 0xff;
      }

      return {
        error: null,
        result: val
      };
    };

    /**
     * @function WebMMedia#readString_
     * @param {Uint8Array} bytes
     * @param {Number} size
     * @param {Number=} offset
     * @returns {EBMLReadResult}
     * @private
     */
    WebMMedia.prototype.readString_ = function readString_(bytes, size,
      offset) {
      var i;
      var start = (offset && offset > 0) ? offset : 0;
      var val = '';

      if (size < 1 || size > 8) {
        return {
          error: new RangeError('Length out of bounds: ' + size),
          result: null
        };
      }

      for (i = 0; i < size; ++i) {
        val += String.fromCharCode(bytes[start + i]);
      }

      return {
        error: null,
        result: val
      };
    };

    /**
     * @function WebMMedia#readFloat8_
     * @param {Uint8Array} bytes
     * @param {Number=} offset
     * @returns {EBMLReadResult}
     * @private
     */
    WebMMedia.prototype.readFloat4_ = function readFloat4_(bytes, offset) {
      var i;
      var start = (offset && offset > 0) ? offset : 0;
      var val = 0;
      var sign;
      var exponent;
      var significand;

      for (i = 0; i < 4; ++i) {
        val <<= 8;
        val |= bytes[start + i] & 0xff;
      }

      sign = val >> 31;
      exponent = ((val >> 23) & 0xff) - 127;
      significand = val & 0x7fffff;
      if (exponent > -127) {
        if (exponent === 128) {
          if (significand === 0) {
            if (sign === 0) {
              return {
                error: null,
                result: Number.POSITIVE_INFINITY
              };
            }
            return {
              error: null,
              result: Number.NEGATIVE_INFINITY
            };
          }
          return NaN;
        }
        significand |= 0x800000;
      } else {
        if (significand === 0) {
          return 0;
        }
        exponent = -126;
      }

      return {
        error: null,
        result: Math.pow(-1, sign) * (significand * Math.pow(2, -23)) *
          Math.pow(2, exponent)
      };
    };

    /**
     * @function WebMMedia#readFloat8_
     * @param {Uint8Array} bytes
     * @param {Number=} offset
     * @returns {EBMLReadResult}
     * @private
     */
    WebMMedia.prototype.readFloat8_ = function readFloat8_(bytes, offset) {
      var i;
      var start = (offset && offset > 0) ? offset : 0;
      var sign = (bytes[start] >> 7) & 0x1;
      var exponent = (((bytes[start] & 0x7f) << 4) |
        ((bytes[start + 1] >> 4) & 0xf)) - 1023;

      var significand = 0;
      var shift = Math.pow(2, 6 * 8);

      significand += (bytes[start + 1] & 0xf) * shift;
      for (i = 2; i < 8; ++i) {
        shift = Math.pow(2, (8 - i - 1) * 8);
        significand += (bytes[start + i] & 0xff) * shift;
      }

      if (exponent > -1023) {
        if (exponent === 1024) {
          if (significand === 0) {
            if (sign === 0) {
              return {
                error: null,
                result: Number.POSITIVE_INFINITY
              };
            }
            return {
              error: null,
              result: Number.NEGATIVE_INFINITY
            };
          }
          return {
            error: null,
            result: NaN
          };
        }
        significand += 0x10000000000000;
      } else {
        if (significand === 0) {
          return 0;
        }
        exponent = -1022;
      }

      return {
        error: null,
        result: Math.pow(-1, sign) * (significand * Math.pow(2, -52)) *
          Math.pow(2, exponent)
      };
    };

    /**
     * @function WebMMedia#readFloat_
     * @param {Uint8Array} bytes
     * @param {Number} size
     * @param {Number=} offset
     * @returns {EBMLReadResult}
     * @private
     */
    WebMMedia.prototype.readFloat_ = function readFloat_(bytes, size,
      offset) {
      if (size === 4) {
        return this.readFloat4_(bytes, offset);
      } else if (size === 8) {
        return this.readFloat8_(bytes, offset);
      }
      return {
        error: new RangeError('Expected size === 4 || 8'),
        result: null
      };
    };

    /**
     * @function WebMMedia#parseEBMLTag_
     * @param {Uint8Array} bytes
     * @param {Number=} offset
     * @return {?EBMLTag}
     * @private
     */
    WebMMedia.prototype.parseEBMLTag_ = function parseEBMLTag_(bytes,
      offset) {
      /** @type {EBMLTag} */
      var tag = {};
      var start = (offset && offset > 0) ? offset : 0;
      var header = this.readVariableInt_(bytes, 4, start);
      var data;

      if (!header) {
        return null;
      }

      tag.id = header.result | (1 << (7 * header.length));
      tag.headerLength = header.length;
      start += tag.headerLength;

      data = this.readVariableInt_(bytes, 8, start);
      tag.dataLength = data.result;
      tag.headerLength += data.length;

      return tag;
    };

    /**
     * @function WebMMedia#readEBMLTag_
     * @param {WebMMedia~readEBMLTagCallback} cb
     * @private
     */
    WebMMedia.prototype.readEBMLTag_ = function readEBMLTag_(cb) {
      var _this = this;
      var offset = this.dataStream.tell();
      this.dataStream.peek(12, function readCb(error, bytes, length) {
        /** @type {EBMLTag} */
        var tag;

        if (error || length < 12) {
          cb(error ? error : new Error(
            'Unable to read enough bytes'));
          return;
        }

        tag = _this.parseEBMLTag_(bytes);
        if (!tag) {
          cb(new Error('Failed to parse EBML tag'));
          return;
        }

        tag.offset = offset;
        _this.dataStream.seek(tag.offset + tag.headerLength);
        cb(null, tag);
      });
    };

    /**
     * @function WebMMedia#findTag_
     * @param {Number} id
     * @param {WebMMedia~readEBMLTagCallback} cb
     * @private
     */
    WebMMedia.prototype.findTag_ = function findTag_(id, cb) {
      var _this = this;
      this.readEBMLTag_(function readTagCb(error, tag) {
        if (error) {
          cb(error);
          return;
        }

        if (tag.id !== id) {
          _this.dataStream.seek(tag.offset + tag.headerLength + tag
            .dataLength);
          _this.readEBMLTag_(readTagCb);
          return;
        }

        cb(null, tag);
      });
    };

    /**
     * @function WebMMedia#parseSeek_
     * @param {EBMLTag} tag
     * @param {Uint8Array} bytes
     * @throws {Error}
     * @private
     */
    WebMMedia.prototype.parseSeek_ = function parseSeek_(tag, bytes) {
      var index = 0;
      var seekIdTag;
      var seekId;
      var seekIdStr = '';
      var seekPositionTag;
      var seekPosition;

      seekIdTag = this.parseEBMLTag_(bytes, tag.headerLength);
      if (!seekIdTag) {
        throw new Error('Failed to parse SeekID tag');
      }

      index += tag.headerLength;
      seekId = bytes.subarray(index + seekIdTag.headerLength,
        tag.headerLength + seekIdTag.headerLength + seekIdTag.dataLength
      );
      index += seekIdTag.headerLength;

      seekPositionTag = this.parseEBMLTag_(bytes, index + seekIdTag.dataLength);
      if (!seekPositionTag) {
        throw new Error('Failed to parse SeekPosition tag');
      }

      index += seekIdTag.dataLength;
      seekPosition = this.readUInt_(bytes, seekPositionTag.dataLength,
        index +
        seekPositionTag.headerLength);

      for (index = 0; index < seekId.length; ++index) {
        seekIdStr += seekId[index].toString(16);
      }

      this.seeks[seekIdStr] = seekPosition.result;
    };

    /**
     * @function WebMMedia#parseSeekHead_
     * @param {EBMLTag} tag
     * @param {Uint8Array} bytes
     * @throws {Error}
     * @private
     */
    WebMMedia.prototype.parseSeekHead_ =
      function parseSeekHead_(tag, bytes) {
        var index = 0;
        var seekTag;
        var seekTagBytes;

        while (index < tag.dataLength) {
          seekTagBytes = bytes.subarray(index, bytes.length);
          seekTag = this.parseEBMLTag_(seekTagBytes);
          if (!seekTag) {
            throw new Error('Failed to parse Seek tag');
          }

          try {
            this.parseSeek_(seekTag, seekTagBytes);
          } catch (e) {
            throw e;
          }
          index += seekTag.headerLength + seekTag.dataLength;
        }
      };

    /**
     * @function WebMMedia#readSeekHeadTag_
     * @param {EBMLTag} segment
     * @param {WebMMedia~readEBMLTagCallback} cb
     * @private
     */
    WebMMedia.prototype.readSeekHeadTag_ =
      function readSeekHeadTag_(segment, cb) {
        var _this = this;

        this.dataStream.seek(segment.offset + segment.headerLength);
        this.findTag_(WebMMedia.TAG_SEEKHEAD,
          function findSeekHeadCb(err, seekHead) {
            if (err) {
              cb(err);
              return;
            }

            _this.seekHeadTag = seekHead;
            _this.dataStream.seek(seekHead.offset + seekHead.headerLength);
            _this.dataStream.read(seekHead.dataLength,
              function readCb(error, bytes, length) {
                if (error) {
                  cb(error);
                  return;
                }

                try {
                  _this.parseSeekHead_(seekHead, bytes, length);
                } catch (e) {
                  cb(e);
                  return;
                }

                cb(null, seekHead);
              });
          });
      };

    /**
     * @function WebMMedia#readSegmentTag_
     * @param {EBMLTag} ebml
     * @param {WebMMedia~readEBMLTagCallback} cb
     * @private
     */
    WebMMedia.prototype.readSegmentTag_ = function parseSegmentTag_(ebml,
      cb) {
      var _this = this;

      this.dataStream.seek(ebml.offset + ebml.headerLength + ebml.dataLength);
      this.findTag_(WebMMedia.TAG_SEGMENT,
        function findSegmentCb(error, segment) {
          if (error || segment.length < 12) {
            cb(new Error('Invalid Segment header'));
            return;
          }

          _this.segmentTag = segment;
          _this.readSeekHeadTag_(segment,
            function readSeekHeadTagCb(err, seekHeadTag) {
              if (err) {
                cb(err);
                return;
              }

              if (!_this.seeks.hasOwnProperty(WebMMedia.SEEK_CLUSTER) ||
                !_this.seeks.hasOwnProperty(WebMMedia.SEEK_CUES) ||
                !_this.seeks.hasOwnProperty(WebMMedia.SEEK_INFO) ||
                !_this.seeks.hasOwnProperty(WebMMedia.SEEK_TRACKS)) {
                cb(new Error('Required seek missing'));
                return;
              }

              _this.seekHeadTag = seekHeadTag;
              cb(null, segment);
            });
        });
    };

    /**
     * @function WebMMedia#parseCuePointTag_
     * @param {Uint8Array} bytes
     * @param {Object} cue
     * @private
     */
    WebMMedia.prototype.parseCueTrackPositionsTag_ =
      function parseCueTrackPositionsTag_(bytes, cue) {
        var tag;
        var index = 0;
        var number;

        while (index < bytes.length) {
          tag = this.parseEBMLTag_(bytes, index);
          if (!tag) {
            throw new Error('Can\'t parse a tag inside CueTrackPositions');
          }

          index += tag.headerLength;
          switch (tag.id) {
            case WebMMedia.TAG_CUETRACK:
              number = this.readUInt_(bytes, tag.dataLength, index);
              if (number.error) {
                throw number.error;
              }
              cue.track = number.result;
              break;
            case WebMMedia.TAG_CUECLUSTERPOSITION:
              number = this.readUInt_(bytes, tag.dataLength, index);
              if (number.error) {
                throw number.error;
              }
              cue.clusterPosition = number.result;
              break;
            default:
              break;
          }
          index += tag.dataLength;
        }
      };

    /**
     * @function WebMMedia#parseCuePointTag_
     * @param {Uint8Array} bytes
     * @private
     */
    WebMMedia.prototype.parseCuePointTag_ = function parseCuePointTag_(
      bytes) {
      var tag;
      var index = 0;
      var number;
      var cue = {
        timecode: -1,
        track: -1,
        clusterPosition: -1
      };

      while (index < bytes.length) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag) {
          throw new Error('Can\'t parse a tag inside CuePoint');
        }

        index += tag.headerLength;
        switch (tag.id) {
          case WebMMedia.TAG_CUETIME:
            number = this.readUInt_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            cue.timecode = number.result;
            break;
          case WebMMedia.TAG_CUETRACKPOSITIONS:
            this.parseCueTrackPositionsTag_(bytes.subarray(index,
              index + tag.dataLength), cue);
            break;
          default:
            break;
        }
        index += tag.dataLength;
      }

      if (cue.timecode === -1 || cue.track === -1 || cue.clusterPosition ===
        -1) {
        throw new Error('Parsed an invalid CuePoint');
      }

      this.cues.push({
        timecode: cue.timecode,
        offset: cue.clusterPosition + this.seekHeadTag.offset
      });
    };

    /**
     * @function WebMMedia#parseTracksTag_
     * @param {Uint8Array} bytes
     * @private
     */
    WebMMedia.prototype.parseCuesTag_ = function parseCuesTag_(bytes) {
      var tag;
      var index = 0;

      while (index < bytes.length) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag) {
          throw new Error('Can\'t parse a tag inside Cues');
        }

        index += tag.headerLength;
        switch (tag.id) {
          case WebMMedia.TAG_CUEPOINT:
            this.parseCuePointTag_(bytes.subarray(index, index + tag.dataLength));
            break;
          default:
            break;
        }
        index += tag.dataLength;
      }
    };

    /**
     * @function WebMMedia#initTracksTag_
     * @param {Uint8Array} initSegment
     * @private
     */
    WebMMedia.prototype.initCuesTag_ = function initCuesTag_(initSegment) {
      var offset = this.seekHeadTag.offset + this.seeks[WebMMedia.SEEK_CUES];
      var tag = this.parseEBMLTag_(initSegment, offset);
      var bytes;

      if (!tag || tag.id !== WebMMedia.TAG_CUES) {
        throw new Error('Can\'t parse the Tracks tag');
      }

      offset += tag.headerLength;
      bytes = initSegment.subarray(offset, offset + tag.dataLength);

      this.parseCuesTag_(bytes);
    };

    /**
     * @function WebMMedia#parseVideoTag_
     * @param {Uint8Array} bytes
     * @param {Object} track
     * @private
     */
    WebMMedia.prototype.parseVideoTag_ = function parseVideoTag_(bytes,
      track) {
      var tag;
      var index = 0;
      var number;

      while (index < bytes.length) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag) {
          throw new Error('Can\'t parse a tag inside Video');
        }

        index += tag.headerLength;
        switch (tag.id) {
          case WebMMedia.TAG_PIXELWIDTH:
            number = this.readUInt_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            track.width = number.result;
            break;
          case WebMMedia.TAG_PIXELHEIGHT:
            number = this.readUInt_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            track.height = number.result;
            break;
          default:
            break;
        }
        index += tag.dataLength;
      }
    };

    /**
     * @function WebMMedia#parseAudioTag_
     * @param {Uint8Array} bytes
     * @param {Object} track
     * @private
     */
    WebMMedia.prototype.parseAudioTag_ = function parseVideoTag_(bytes,
      track) {
      var tag;
      var index = 0;
      var number;

      while (index < bytes.length) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag) {
          throw new Error('Can\'t parse a tag inside Video');
        }

        index += tag.headerLength;
        switch (tag.id) {
          case WebMMedia.TAG_SAMPLINGFREQUENCY:
            number = this.readFloat_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            track.samplingFrequency = number.result;
            break;
          case WebMMedia.TAG_CHANNELS:
            number = this.readUInt_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            track.channels = number.result;
            break;
          case WebMMedia.TAG_BITDEPTH:
            number = this.readUInt_(bytes, tag.dataLength, index);
            if (number.error) {
              throw number.error;
            }
            track.bitDepth = number.result;
            break;
          default:
            break;
        }
        index += tag.dataLength;
      }
    };

    /**
     * @function WebMMedia#parseTrackEntryTag_
     * @param {Uint8Array} bytes
     * @private
     */
    WebMMedia.prototype.parseTrackEntryTag_ =
      function parseTrackEntryTag_(bytes) {
        var tag;
        var index = 0;
        var data;

        /** @type {MediaTrack} */
        var track = {
          id: -1,
          type: -1,
          codec: '',
          width: -1,
          height: -1,
          samplingFrequency: -1,
          channels: -1,
          bitDepth: -1
        };

        while (index < bytes.length) {
          tag = this.parseEBMLTag_(bytes, index);
          if (!tag) {
            throw new Error('Can\'t parse a tag inside TrackEntry');
          }

          index += tag.headerLength;
          switch (tag.id) {
            case WebMMedia.TAG_TRACKNUMBER:
              data = this.readUInt_(bytes, tag.dataLength, index);
              if (data.error) {
                throw data.error;
              }
              track.id = data.result;
              break;
            case WebMMedia.TAG_TRACKTYPE:
              data = this.readUInt_(bytes, tag.dataLength, index);
              if (data.error) {
                throw data.error;
              }
              track.type = data.result;
              break;
            case WebMMedia.TAG_CODECID:
              data = this.readString_(bytes, tag.dataLength, index);
              if (data.error) {
                throw data.error;
              }
              track.codec = data.result;
              break;
            case WebMMedia.TAG_VIDEO:
              this.parseVideoTag_(bytes.subarray(index, index + tag.dataLength),
                track);
              break;
            case WebMMedia.TAG_AUDIO:
              this.parseAudioTag_(bytes.subarray(index, index + tag.dataLength),
                track);
              break;
            default:
              break;
          }
          index += tag.dataLength;
        }

        if (track.id === -1 || track.type === -1 || track.codec === -1) {
          throw new Error('Parsed an invalid TrackEntry');
        }

        this.tracks.push(track);
      };

    /**
     * @function WebMMedia#parseTracksTag_
     * @param {Uint8Array} bytes
     * @private
     */
    WebMMedia.prototype.parseTracksTag_ = function parseTracksTag_(bytes) {
      var tag;
      var index = 0;
      while (index < bytes.length) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag || tag.id !== WebMMedia.TAG_TRACKENTRY) {
          throw new Error('Can\'t parse the TrackEntry tag');
        }

        index += tag.headerLength;
        this.parseTrackEntryTag_(bytes.subarray(index, index + tag.dataLength));
        index += tag.dataLength;
      }
    };

    /**
     * @function WebMMedia#initTracksTag_
     * @param {Uint8Array} initSegment
     * @private
     */
    WebMMedia.prototype.initTracksTag_ = function initTracksTag_(
      initSegment) {
      var offset = this.seekHeadTag.offset + this.seeks[WebMMedia.SEEK_TRACKS];
      var tag = this.parseEBMLTag_(initSegment, offset);
      var bytes;

      if (!tag || tag.id !== WebMMedia.TAG_TRACKS) {
        throw new Error('Can\'t parse the Tracks tag');
      }

      offset += tag.headerLength;
      bytes = initSegment.subarray(offset, offset + tag.dataLength);

      this.parseTracksTag_(bytes);
    };

    /**
     * @function WebMMedia#parseInfoTag_
     * @param {Uint8Array} bytes
     * @private
     */
    WebMMedia.prototype.parseInfoTag_ = function parseInfoTag_(bytes) {
      var tag;
      var index = 0;
      var timecodeScale;
      var timecodeScaleTag;
      var duration;
      var durationTag;

      while (!timecodeScaleTag || !durationTag) {
        tag = this.parseEBMLTag_(bytes, index);
        if (!tag) {
          throw new Error(
            'Can\'t parse a duration or timecodeScale tag');
        }

        index += tag.headerLength;
        switch (tag.id) {
          case WebMMedia.TAG_TIMECODESCALE:
            timecodeScaleTag = tag;
            timecodeScale = this.readUInt_(bytes, tag.dataLength, index);
            if (timecodeScale.error) {
              throw timecodeScale.error;
            }
            break;
          case WebMMedia.TAG_DURATION:
            durationTag = tag;
            duration = this.readFloat_(bytes, tag.dataLength, index);
            if (duration.error) {
              throw duration.error;
            }
            break;
          default:
            break;
        }
        index += tag.dataLength;
      }

      this.timecodeScale = timecodeScale.result;
      this.duration = duration.result;
    };

    /**
     * @function WebMMedia#initInfoTag_
     * @param {Uint8Array} initSegment
     * @private
     */
    WebMMedia.prototype.initInfoTag_ = function initInfoTag_(initSegment) {
      var offset = this.seekHeadTag.offset + this.seeks[WebMMedia.SEEK_INFO];
      var tag = this.parseEBMLTag_(initSegment, offset);
      var bytes;

      if (!tag || tag.id !== WebMMedia.TAG_INFO) {
        throw new Error('Can\'t parse the Info tag');
      }

      offset += tag.headerLength;
      bytes = initSegment.subarray(offset, offset + tag.dataLength);

      this.parseInfoTag_(bytes);
    };

    /**
     * @function WebMMedia#initMimeType_
     * @private
     */
    WebMMedia.prototype.initMimeType_ = function initMimeType_() {
      var index;
      var count;
      var track;
      var mimeType;
      var isVideo = false;
      var codecs = [];
      var type = '';

      for (index = 0, count = this.tracks.length; index < count; ++
        index) {
        track = this.tracks[index];
        if (track.type === 1) {
          isVideo = true;
        }

        if (track.codec === WebMMedia.CODEC_VP8) {
          codecs.push('vp8');
        } else if (track.codec === WebMMedia.CODEC_VP9) {
          codecs.push('vp9');
        } else if (track.codec === WebMMedia.CODEC_VORBIS) {
          codecs.push('vorbis');
        } else if (track.codec === WebMMedia.CODEC_OPUS) {
          codecs.push('opus');
        }
      }

      if (isVideo) {
        type = 'video/webm';
      } else {
        type = 'audio/webm';
      }

      mimeType = type + ';codecs="';
      for (index = 0, count = codecs.length; index < count; ++index) {
        mimeType += codecs[index];
        if (index + 1 !== codecs.length) {
          mimeType += ',';
        }
      }

      this.mimeType = mimeType + '"';
    };

    /**
     * @function WebMMedia#initSegmentTag_
     * @param {EBMLTag} ebml
     * @param {WebMMedia~initCallback} cb
     * @private
     */
    WebMMedia.prototype.initSegmentTag_ = function initSegmentTag_(ebml,
      cb) {
      var _this = this;
      this.readSegmentTag_(ebml, function readSegmentTagCb(error) {
        var clusterOffset;

        if (error) {
          cb(error);
          return;
        }

        clusterOffset = _this.seekHeadTag.offset +
          _this.seeks[WebMMedia.SEEK_CLUSTER];
        _this.dataStream.seek(0);
        _this.dataStream.read(clusterOffset, function readCb(err,
          bytes) {
          if (err) {
            cb(err);
            return;
          }

          _this.initSegment = bytes;
          try {
            _this.initInfoTag_(bytes);
            _this.initTracksTag_(bytes);
            _this.initCuesTag_(bytes);
            _this.initMimeType_();
          } catch (e) {
            cb(e);
          }

          _this.initialized = true;
          cb(null);
        });
      });
    };

    /**
     * @function WebMMedia#init_
     * @param {WebMMedia~initCallback} cb
     * @private
     */
    WebMMedia.prototype.init = function init_(cb) {
      var _this = this;

      if (this.initialized) {
        cb(null);
        return;
      }

      this.dataStream.seek(0);
      this.readEBMLTag_(function readEBMLCb(readErr, ebml) {
        if (readErr || ebml.id !== WebMMedia.TAG_EBML || ebml.length <
          5) {
          cb(new Error('Invalid EBML header'));
          return;
        }

        _this.ebmlTag = ebml;
        _this.initSegmentTag_(ebml, cb);
      });
    };

    /**
     * Callback function for the init_ method.
     * @callback WebMMedia~initCallback
     * @param {Error} error
     */

    /**
     * Callback function for the readEBMLTag_ method.
     * @callback WebMMedia~readEBMLTagCallback
     * @param {Error} error
     */

    /**
     * @typedef {Object} EBMLTag
     * @property {number} id
     * @property {number} offset
     * @property {number} headerLength
     * @property {number} dataLength
     */

    /**
     * @typedef {Object.<String, Number>} EBMLSeekTable
     */

    /**
     * @typedef {Object} EBMLReadResult
     * @property {Error} error
     * @property {*} result
     */

    return WebMMedia;
  })();

  /* eslint-disable */
  Peeracle.Storage = (function() {
    /**
     * @interface Peeracle.Storage
     * @memberof {Peeracle}
     */
    function Storage() {}

    /**
     * @function Storage#retrieveSegment
     * @param {String} hash
     * @param {Number} segment
     * @param {Number} offset
     * @param {Number} length
     * @param {Storage~retrieveCallback} cb
     */
    Storage.prototype.retrieveSegment =
      function retrieveSegment(hash, segment, offset, length, cb) {};

    /**
     * @function Storage#storeSegment
     * @param {String} hash
     * @param {Number} segment
     * @param {Number} offset
     * @param {Uint8Array} bytes
     * @param {Storage~storeCallback} cb
     */
    Storage.prototype.storeSegment =
      function storeSegment(hash, segment, offset, bytes, cb) {};

    /**
     * @callback Storage~retrieveCallback
     * @param {Error} error
     * @param {Uint8Array} bytes
     */

    /**
     * @callback Storage~storeCallback
     * @param {Error} error
     * @param {Number} length
     */

    return Storage;
  })();

  /* eslint-disable */
  Peeracle.MediaStorage = (function() {
    /* eslint-enable */
    /**
     * @class MediaStorage
     * @memberof {Peeracle}
     * @constructor
     * @implements {Peeracle.Storage}
     * @param {Peeracle.Metadata} metadata
     * @param {Peeracle.Media} media
     */
    function MediaStorage(metadata, media) {
      this.hash = metadata.hash;
      this.media = media;
    }

    MediaStorage.prototype = Object.create(Peeracle.Storage.prototype);
    MediaStorage.prototype.constructor = MediaStorage;

    /**
     * @function MediaStorage#retrieveSegment
     * @param {String} hash
     * @param {Number} segment
     * @param {Number} offset
     * @param {Number} length
     * @param {Storage~retrieveCallback} cb
     */
    MediaStorage.prototype.retrieveSegment =
      function retrieveSegment(hash, segment, offset, length, cb) {
        var _this = this;

        if (!this.media) {
          cb(null, null);
          return;
        }

        if (hash !== this.hash) {
          cb(new Error('Hash mismatch'));
          return;
        }

        this.media.init(function initCb(error) {
          var timecodes;

          if (error) {
            cb(error);
            return;
          }

          timecodes = _this.media.cues;
          if (segment < 0 || segment > timecodes.length) {
            cb(null, null);
            return;
          }

          _this.media.getMediaSegment(timecodes[segment].timecode,
            function getMediaSegmentCb(err, bytes) {
              if (err) {
                cb(err);
                return;
              }

              cb(null, bytes.subarray(offset, offset + length));
            });
        });
      };

    /**
     * @function MediaStorage#storeSegment
     * @param {String} hash
     * @param {Number} segment
     * @param {Number} offset
     * @param {Uint8Array} bytes
     * @param {Storage~storeCallback} cb
     */
    MediaStorage.prototype.storeSegment =
      function storeSegment(hash, segment, offset, bytes, cb) {
        cb(new Error('Unsupported'));
      };

    return MediaStorage;
  })();

  /* eslint-disable */
  Peeracle.MemoryStorage = (function() {
    /* eslint-enable */
    /**
     * @class MemoryStorage
     * @memberof Peeracle
     * @constructor
     * @implements Peeracle.Storage
     * @property {Object.<String, Object.<String, Uint8Array>>} hashes
     */
    function MemoryStorage() {
      this.hashes = {};
    }

    MemoryStorage.prototype = Object.create(Peeracle.Storage.prototype);
    MemoryStorage.prototype.constructor = MemoryStorage;

    /**
     * @function MemoryStorage#retrieveSegment
     * @param {String} hash
     * @param {Number} segment
     * @param {Number} offset
     * @param {Number} length
     * @param {Storage~retrieveCallback} cb
     */
    MemoryStorage.prototype.retrieveSegment =
      function retrieveSegment(hash, segment, offset, length, cb) {
        if (!this.hashes.hasOwnProperty(hash) ||
          !this.hashes[hash].hasOwnProperty('' + segment)) {
          cb(null, null);
          return;
        }

        cb(null, this.hashes[hash]['' + segment]
          .subarray(offset, offset + length));
      };

    /**
     * @function MemoryStorage#storeSegment
     * @param {String} hash
     * @param {Number} segment
     * @param {Number} offset
     * @param {Uint8Array} bytes
     * @param {Storage~storeCallback} cb
     */
    MemoryStorage.prototype.storeSegment =
      function storeSegment(hash, segment, offset, bytes, cb) {
        var length;

        if (!this.hashes.hasOwnProperty(hash)) {
          this.hashes[hash] = {};
        }

        length = bytes.length;
        if (!this.hashes[hash].hasOwnProperty('' + segment)) {
          this.hashes[hash]['' + segment] = new Uint8Array(length);
        }

        try {
          this.hashes[hash]['' + segment].set(bytes, offset);
        } catch (e) {
          cb(e);
          return;
        }

        cb(null, length);
      };

    return MemoryStorage;
  })();

  /* eslint-disable */
  Peeracle.MetadataStream = (function() {
    /* eslint-enable */
    /**
     * @class MetadataStream
     * @memberof {Peeracle}
     * @param {Peeracle.Metadata} metadata
     * @param {Media=} media
     * @param {Uint8Array=} bytes
     *
     * @property {String} checksumAlgorithmName
     * @property {Hash} checksumAlgorithm
     * @property {Media} media
     * @property {Number} type
     * @property {String} mimeType
     * @property {Number} bandwidth
     * @property {Number} width
     * @property {Number} height
     * @property {Number} numChannels
     * @property {Number} samplingFrequency
     * @property {Uint8Array} initSegment
     * @property {Number} chunkSize
     * @property {Array.<MetadataMediaSegment>} mediaSegments
     * @property {Number} averageSize
     * @constructor
     */
    function MetadataStream(metadata, media, bytes) {
      var index;
      var count;
      var track;

      this.metadata = metadata;
      this.checksumAlgorithmName = metadata.checksumAlgorithmName;
      this.checksumAlgorithm = Peeracle.Hash.create(this.checksumAlgorithmName);
      if (!this.checksumAlgorithm) {
        throw new Error('Invalid checksum algorithm');
      }
      this.media = media ? media : null;
      this.bandwidth = 0;
      this.initSegment = bytes ? bytes : null;
      this.chunkSize = 0;
      this.mediaSegments = [];
      this.streamSize = 0;

      this.type = -1;
      this.mimeType = null;
      this.width = -1;
      this.height = -1;
      this.numChannels = -1;
      this.samplingFrequency = -1;

      if (!media) {
        return;
      }

      this.mimeType = media.mimeType;
      for (index = 0, count = media.tracks.length; index < count; ++index) {
        track = media.tracks[index];

        if ((track.type === 1 || track.type === 2) &&
          (this.type === 1 || this.type === 2) && this.type !== track.type
        ) {
          this.type = 4;
        } else {
          this.type = track.type;
        }
        this.width = track.width !== -1 ? track.width : this.width;
        this.height = track.height !== -1 ? track.height : this.height;
        this.numChannels = track.channels !== -1 ?
          track.channels : this.numChannels;
        this.samplingFrequency = track.samplingFrequency !== -1 ?
          track.samplingFrequency : this.samplingFrequency;
      }
    }

    MetadataStream.HEADER_FIELDS = [{
        name: 'type',
        type: 'Byte'
      }, {
        name: 'mimeType',
        type: 'String'
      }, {
        name: 'bandwidth',
        type: 'UInteger'
      }, {
        name: 'width',
        type: 'Integer'
      }, {
        name: 'height',
        type: 'Integer'
      }, {
        name: 'numChannels',
        type: 'Integer'
      }, {
        name: 'samplingFrequency',
        type: 'Integer'
      }, {
        name: 'chunkSize',
        type: 'Integer'
      }
      // {name: 'initSegmentLength', type: 'UInteger'},
      // {name: 'initSegment', type: 'Bytes'},
      // {name: 'mediaSegmentsCount', type: 'UInteger'},
      // {name: 'mediaSegments', type: 'MediaSegment'},
    ];

    MetadataStream.MEDIASEGMENT_FIELDS = [{
        name: 'timecode',
        type: 'UInteger'
      }, {
        name: 'length',
        type: 'UInteger'
      }
      // {name: 'chunkCount', type: 'UInteger'},
      // {name: 'chunks', type: 'chunks'},
    ];

    /**
     * @function MetadataStream#addMediaSegments
     */
    MetadataStream.prototype.addMediaSegments = function addMediaSegments(
      cb) {
      var _this = this;
      var index = 0;
      var cues = this.media.cues;
      var count = cues.length;
      var timecode = cues[index].timecode;

      this.calculateStreamSize_(cues);
      this.media.getMediaSegment(timecode,
        function getMediaSegmentCb(error, bytes) {
          /** @type {MetadataMediaSegment} */
          var mediaSegment = {};

          if (error) {
            cb(error);
            return;
          }

          mediaSegment.timecode = timecode;
          mediaSegment.length = bytes.length;
          mediaSegment.chunks = _this.chunkBytes_(bytes);

          _this.mediaSegments.push(mediaSegment);

          if (++index < count) {
            timecode = cues[index].timecode;
            _this.media.getMediaSegment(timecode, getMediaSegmentCb);
          } else {
            cb(null);
          }
        });
    };

    /**
     * @function MetadataStream#calculateStreamSize_
     * @param {Object.<String, Number>} cues
     */
    MetadataStream.prototype.calculateStreamSize_ =
      function calculateStreamSize_(cues) {
        var index;
        var currentOffset;
        var previousOffset = 0;
        var count = cues.length;

        for (index = 0; index < count; ++index) {
          currentOffset = cues[index].offset;
          this.streamSize += currentOffset - previousOffset;
          previousOffset = currentOffset;
        }

        for (index = 15; index < 20; ++index) {
          this.chunkSize = Math.pow(2, index);
          count = Math.ceil((this.streamSize + this.chunkSize - 1) /
            this.chunkSize);
          if (count < 255) {
            break;
          }
        }
      };

    /**
     * @function MetadataStream#chunkBytes_
     * @param {Uint8Array} bytes
     * @return {Array.<String>}
     * @private
     */
    MetadataStream.prototype.chunkBytes_ = function chunkBytes(bytes) {
      var index = 0;
      var length = bytes.length;
      var chunks = [];
      var chunk;
      var checksum;

      while (index < length) {
        chunk = bytes.subarray(index, index + this.chunkSize);
        checksum = this.checksumAlgorithm.checksum(chunk);
        this.metadata.checksumAlgorithm.update(checksum);
        chunks.push(checksum);
        index += chunk.length;
      }

      return chunks;
    };

    /**
     * @function MetadataStream#serializeChunks_
     * @param {Array.<Uint8Array>} chunks
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     */
    MetadataStream.prototype.serializeChunks_ =
      function serializeChunks_(chunks, dataStream, cb) {
        var _this = this;
        var index = 0;
        var count = chunks.length;

        dataStream.writeUInteger(count, function writeChunksCount(error) {
          var chunk;

          if (error) {
            cb(error);
            return;
          }

          chunk = chunks[index];
          _this.checksumAlgorithm.constructor.serialize(chunk,
            dataStream,
            function writeChunkCb(err) {
              if (err) {
                cb(err);
                return;
              }

              if (++index < count) {
                chunk = chunks[index];
                _this.checksumAlgorithm.constructor.serialize(chunk,
                  dataStream,
                  writeChunkCb);
              } else {
                cb(null);
              }
            });
        });
      };

    /**
     * @function MetadataStream#serializeMediaSegments_
     * @param {MetadataMediaSegment} mediaSegment
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     */
    MetadataStream.prototype.serializeMediaSegment_ =
      function serializeMediaSegment_(mediaSegment, dataStream, cb) {
        var field;
        var index = 0;
        var length = MetadataStream.MEDIASEGMENT_FIELDS.length;
        var _this = this;

        field = MetadataStream.MEDIASEGMENT_FIELDS[index];
        dataStream['write' + field.type](mediaSegment[field.name],
          function writeCb(error) {
            if (error) {
              cb(error);
              return;
            }

            if (++index < length) {
              field = MetadataStream.MEDIASEGMENT_FIELDS[index];
              dataStream['write' + field.type](mediaSegment[field.name],
                writeCb);
            } else {
              _this.serializeChunks_(mediaSegment.chunks, dataStream,
                cb);
            }
          });
      };

    /**
     * @function MetadataStream#serializeMediaSegments_
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     */
    MetadataStream.prototype.serializeMediaSegments_ =
      function serializeMediaSegments_(dataStream, cb) {
        var _this = this;
        var count = this.mediaSegments.length;
        dataStream.writeUInteger(count,
          function writeMediaSegmentsCountCb(error) {
            var index = 0;
            var mediaSegment;

            if (error) {
              cb(error);
              return;
            }

            mediaSegment = _this.mediaSegments[index];
            _this.serializeMediaSegment_(mediaSegment, dataStream,
              function serializeMediaSegmentCb(err) {
                if (err) {
                  cb(err);
                  return;
                }

                if (++index < count) {
                  mediaSegment = _this.mediaSegments[index];
                  _this.serializeMediaSegment_(mediaSegment,
                    dataStream,
                    serializeMediaSegmentCb);
                } else {
                  cb(null);
                }
              });
          });
      };

    /**
     * @function MetadataStream#serializeInitSegment_
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     */
    MetadataStream.prototype.serializeInitSegment_ =
      function serializeInitSegment_(dataStream, cb) {
        var _this = this;
        dataStream.writeUInteger(this.initSegment.length,
          function writeInitSegmentLengthCb(error) {
            if (error) {
              cb(error);
              return;
            }

            dataStream.write(_this.initSegment,
              function writeInitSegmentCb(err) {
                if (err) {
                  cb(err);
                  return;
                }

                _this.serializeMediaSegments_(dataStream, cb);
              });
          });
      };

    /**
     * @function MetadataStream#serialize
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     */
    MetadataStream.prototype.serialize = function serialize(dataStream,
      cb) {
      var field;
      var index = 0;
      var length = MetadataStream.HEADER_FIELDS.length;
      var _this = this;

      if (!(dataStream instanceof Peeracle.DataStream)) {
        cb(new TypeError('argument must be a DataStream'));
        return;
      }

      field = MetadataStream.HEADER_FIELDS[index];
      dataStream['write' + field.type](this[field.name],
        function writeCb(error) {
          if (error) {
            cb(error);
            return;
          }

          if (++index < length) {
            field = MetadataStream.HEADER_FIELDS[index];
            dataStream['write' + field.type](_this[field.name],
              writeCb);
          } else {
            _this.serializeInitSegment_(dataStream, cb);
          }
        });
    };

    /**
     * @function MetadataStream#unserializeChunks_
     * @param {Peeracle.DataStream} dataStream
     */
    MetadataStream.prototype.unserializeChunks_ =
      function unserializeChunks_(dataStream) {
        var _this = this;
        var index = 0;
        var length = dataStream.readUInteger();
        var chunk;
        var chunks = [];

        for (index = 0; index < length; ++index) {
          chunk = _this.checksumAlgorithm.constructor.unserialize(
            dataStream);
          chunks.push(chunk);
          this.metadata.checksumAlgorithm.update(chunk);
        }

        return chunks;
      };

    /**
     * @function MetadataStream#serializeMediaSegments_
     * @param {Peeracle.DataStream} dataStream
     */
    MetadataStream.prototype.unserializeMediaSegment_ =
      function unserializeMediaSegment_(dataStream) {
        var field;
        var index;
        var length = MetadataStream.MEDIASEGMENT_FIELDS.length;
        var mediaSegment = {};

        for (index = 0; index < length; ++index) {
          field = MetadataStream.MEDIASEGMENT_FIELDS[index];
          mediaSegment[field.name] = dataStream['read' + field.type]();
        }

        mediaSegment.chunks = this.unserializeChunks_(dataStream);
        return mediaSegment;
      };

    /**
     * @function MetadataStream#unserializeMediaSegments_
     * @param {Peeracle.DataStream} dataStream
     */
    MetadataStream.prototype.unserializeMediaSegments_ =
      function unserializeMediaSegments_(dataStream) {
        var index;
        var count = dataStream.readUInteger();
        var mediaSegment;

        for (index = 0; index < count; ++index) {
          mediaSegment = this.unserializeMediaSegment_(dataStream);
          this.mediaSegments.push(mediaSegment);
        }
      };

    /**
     * @function MetadataStream#unserializeInitSegment_
     * @param {Peeracle.DataStream} dataStream
     */
    MetadataStream.prototype.unserializeInitSegment_ =
      function serializeInitSegment_(dataStream) {
        var length = dataStream.readUInteger();

        this.initSegment = dataStream.read(length);
        this.metadata.checksumAlgorithm.update(this.initSegment);
      };

    /**
     * @function MetadataStream#unserialize
     * @param {DataStream} dataStream
     */
    MetadataStream.prototype.unserialize = function unserialize(
      dataStream) {
      var field;
      var index;
      var length = MetadataStream.HEADER_FIELDS.length;

      if (!(dataStream instanceof Peeracle.MemoryDataStream)) {
        throw (new TypeError('argument must be a MemoryDataStream'));
      }

      for (index = 0; index < length; ++index) {
        field = MetadataStream.HEADER_FIELDS[index];
        this[field.name] = dataStream['read' + field.type]();
      }

      this.unserializeInitSegment_(dataStream);
      this.unserializeMediaSegments_(dataStream);
    };

    /**
     * @typedef {Object} MetadataMediaSegment
     * @property {Number} timecode
     * @property {Number} length
     * @property {Array.<Uint8Array>} chunks
     */

    return MetadataStream;
  })();

  /* eslint-disable */
  Peeracle.Metadata = (function() {
    /* eslint-enable */
    /**
     * @class Metadata
     * @memberof {Peeracle}
     * @constructor
     * @param {String} checksumAlgorithmName
     * @property {Number} version
     * @property {String} checksumAlgorithmName
     * @property {String} hash
     * @property {Hash} checksumAlgorithm
     * @property {Number} timecodeScale
     * @property {Number} duration
     * @property {Array.<String>} trackerUrls
     * @property {Array.<MetadataStream>} streams
     */
    function Metadata(checksumAlgorithmName) {
      this.magic = Metadata.MAGIC;
      this.version = Metadata.VERSION;
      this.checksumAlgorithmName = checksumAlgorithmName ?
        checksumAlgorithmName : 'murmur3_x86_128';
      this.checksumAlgorithm = Peeracle.Hash.create(this.checksumAlgorithmName);
      if (!this.checksumAlgorithm) {
        throw new Error('Invalid checksum algorithm');
      }
      this.hash = '';
      this.timecodeScale = 0;
      this.duration = 0;
      this.trackerUrls = [];
      this.streams = [];
    }

    Metadata.MAGIC = 0x5052434C;
    Metadata.VERSION = 2;
    Metadata.HEADER_FIELDS = [{
      name: 'magic',
      type: 'UInteger'
    }, {
      name: 'version',
      type: 'UInteger'
    }, {
      name: 'checksumAlgorithmName',
      type: 'String'
    }, {
      name: 'timecodeScale',
      type: 'UInteger'
    }, {
      name: 'duration',
      type: 'Double'
    }];

    /**
     * @function Metadata#addMedia
     * @param {Peeracle.Media} media
     * @param {Metadata~genericCallback} cb
     */
    Metadata.prototype.addMedia = function addMedia(media, cb) {
      var _this = this;

      if (!(media instanceof Peeracle.Media)) {
        cb(new TypeError('argument must be a Media'));
        return;
      }

      media.getInitSegment(function getInitSegmentCb(error, bytes) {
        var stream;

        if (error) {
          cb(error);
          return;
        }

        _this.timecodeScale = media.timecodeScale;
        _this.duration = media.duration;

        _this.checksumAlgorithm.update(bytes);
        stream = new Peeracle.MetadataStream(_this, media, bytes);
        stream.addMediaSegments(function addMediaSegmentsCb(err) {
          if (err) {
            cb(err);
            return;
          }

          _this.streams.push(stream);
          _this.hash = _this.checksumAlgorithm.finish();
          cb(null);
        });
      });
    };

    /**
     * @function Metadata#addTrackerUrl
     * @param {String} url
     */
    Metadata.prototype.addTrackerUrl = function addTrackerUrl(url) {
      var lowerCaseUrl = url.toLowerCase();

      if (lowerCaseUrl in this.trackerUrls) {
        return;
      }

      this.trackerUrls.push(lowerCaseUrl);
    };

    /**
     * @function Metadata#serializeStreams_
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     * @private
     */
    Metadata.prototype.serializeStreams_ =
      function serializeStreams_(dataStream, cb) {
        var _this = this;
        var index = 0;
        var count = this.streams.length;
        var stream;

        if (!count) {
          cb(null);
          return;
        }

        dataStream.writeUInteger(count, function writeStreamsCountCb(err) {
          if (err) {
            cb(err);
            return;
          }

          stream = _this.streams[index];
          stream.serialize(dataStream, function serializeCb(error) {
            if (error) {
              cb(error);
              return;
            }

            if (++index < count) {
              stream = _this.streams[index];
              stream.serialize(dataStream, serializeCb);
            } else {
              cb(null);
            }
          });
        });
      };

    /**
     * @function Metadata#serializeTrackers_
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     * @private
     */
    Metadata.prototype.serializeTrackers_ =
      function serializeTrackers_(dataStream, cb) {
        var _this = this;
        var length = this.trackerUrls.length;
        dataStream.writeUInteger(length,
          function writeTrackerCountCb(error) {
            var index = 0;

            if (error) {
              cb(error);
              return;
            }

            dataStream.writeString(_this.trackerUrls[index],
              function writeTrackerUrlCb(err) {
                if (err) {
                  cb(err);
                  return;
                }

                if (++index < length) {
                  dataStream.writeString(_this.trackerUrls[index],
                    writeTrackerUrlCb);
                } else {
                  _this.serializeStreams_(dataStream, cb);
                }
              });
          });
      };

    /**
     * @function Metadata#serialize
     * @param {Peeracle.DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     */
    Metadata.prototype.serialize = function serialize(dataStream, cb) {
      var field;
      var index = 0;
      var length = Metadata.HEADER_FIELDS.length;
      var _this = this;

      if (!(dataStream instanceof Peeracle.DataStream)) {
        cb(new TypeError('argument must be a DataStream'));
        return;
      }

      field = Metadata.HEADER_FIELDS[index];
      dataStream['write' + field.type](this[field.name],
        function writeCb(error) {
          if (error) {
            cb(error);
            return;
          }

          if (++index < length) {
            field = Metadata.HEADER_FIELDS[index];
            dataStream['write' + field.type](_this[field.name],
              writeCb);
          } else {
            _this.serializeTrackers_(dataStream, cb);
          }
        });
    };

    /**
     * @function Metadata#unserializeStreams_
     * @param {Peeracle.DataStream} dataStream
     * @private
     */
    Metadata.prototype.unserializeStreams_ =
      function unserializeStreams_(dataStream) {
        var _this = this;
        var stream;
        var index;
        var count = dataStream.readUInteger();

        for (index = 0; index < count; ++index) {
          stream = new Peeracle.MetadataStream(_this);
          stream.unserialize(dataStream);
          this.streams.push(stream);
        }

        this.hash = this.checksumAlgorithm.finish();
      };

    /**
     * @function Metadata#unserializeTrackers_
     * @param {Peeracle.DataStream} dataStream
     * @private
     */
    Metadata.prototype.unserializeTrackers_ =
      function unserializeTrackers_(dataStream) {
        var index;
        var length = dataStream.readUInteger();

        for (index = 0; index < length; ++index) {
          this.trackerUrls[index] = dataStream.readString();
        }
      };

    /**
     * @function Metadata#unserializeHeader_
     * @param {Peeracle.DataStream} dataStream
     * @private
     */
    Metadata.prototype.unserializeHeader_ = function unserializeHeader_(
      dataStream) {
      var field;
      var index;
      var length = Metadata.HEADER_FIELDS.length;

      for (index = 0; index < length; ++index) {
        field = Metadata.HEADER_FIELDS[index];
        this[field.name] = dataStream['read' + field.type]();
      }
    };

    /**
     * @function Metadata#unserialize
     * @param {DataStream} dataStream
     * @param {Metadata~genericCallback} cb
     */
    Metadata.prototype.unserialize = function unserialize(dataStream, cb) {
      var _this = this;

      if (!(dataStream instanceof Peeracle.DataStream)) {
        cb(new TypeError('argument must be a DataStream'));
        return;
      }

      dataStream.read(dataStream.size(), function readCb(error, bytes) {
        var memoryDataStream;

        if (error) {
          cb(error);
          return;
        }

        try {
          memoryDataStream = new Peeracle.MemoryDataStream({
            buffer: bytes
          });
          _this.unserializeHeader_(memoryDataStream);
          _this.unserializeTrackers_(memoryDataStream);
          _this.unserializeStreams_(memoryDataStream);
        } catch (err) {
          cb(err);
          return;
        }

        cb(null);
      });
    };

    /**
     * Generic callback function taking an error as the only argument.
     * @callback Metadata~genericCallback
     * @param {Error} error
     */

    return Metadata;
  })();

  /* eslint-disable */
  Peeracle.TrackerMessage = (function() {
    /* eslint-enable */
    /**
     * @class TrackerMessage
     * @memberof {Peeracle}
     * @constructor
     */
    function TrackerMessage(parm) {
      this.props = {};
      if (typeof parm === 'object') {
        this.createFromObject(parm);
      }
    }

    TrackerMessage.MessageType = {
      KeepAlive: 0,
      Hello: 1,
      Welcome: 2,
      Announce: 3,
      Denounce: 4,
      Enter: 5,
      Leave: 6,
      Sdp: 7,
      Request: 8,
      Poke: 9
    };

    TrackerMessage.Types = [{
      name: 'KeepAlive'
    }, {
      name: 'Hello'
    }, {
      name: 'Welcome'
    }, {
      name: 'Announce'
    }, {
      name: 'Denounce'
    }, {
      name: 'Enter'
    }, {
      name: 'Leave'
    }, {
      name: 'Sdp'
    }, {
      name: 'Request'
    }, {
      name: 'Poke'
    }];

    TrackerMessage.prototype.createFromObject =
      function createFromObject(obj) {
        var key;

        for (key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          this.props[key] = obj[key];
        }
      };

    TrackerMessage.prototype.serializeHello = function serializeHello() {
      return new Uint8Array([]);
    };

    TrackerMessage.prototype.serializeWelcome = function serializeWelcome() {
      var bytes = new Uint8Array(this.props.id.length + 1);
      var dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });

      dataStream.writeString(this.props.id);
      return bytes;
    };

    TrackerMessage.prototype.serializeAnnounce = function serializeAnnounce() {
      var index;
      var count = this.props.got.length;
      var length = 0;
      var dataStream;
      var bytes;

      length += this.props.hash.length + 1;
      length += 4 + (4 * count);

      bytes = new Uint8Array(length);
      dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });

      dataStream.writeString(this.props.hash);
      dataStream.writeUInteger(count);

      for (index = 0; index < count; ++index) {
        if (this.props.got[index]) {
          dataStream.writeUInteger(this.props.got[index]);
        } else {
          dataStream.writeUInteger(0);
        }
      }
      return bytes;
    };

    TrackerMessage.prototype.serializeDenounce = function serializeDenounce() {
      var dataStream;
      var bytes;

      bytes = new Uint8Array(this.props.hash.length + 1);
      dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });
      dataStream.writeString(this.props.hash);
      return bytes;
    };

    TrackerMessage.prototype.serializeEnter = function serializeEnter() {
      var dataStream;
      var bytes;
      var index;
      var count = this.props.got.length;

      bytes = new Uint8Array(this.props.hash.length + 1 +
        this.props.id.length + 1 + 4 + (4 * count) +
        (this.props.os ? this.props.os.length : 0) + 1 +
        (this.props.browser ? this.props.browser.length : 0) + 1 +
        (this.props.device ? this.props.device.length : 0) + 1);

      dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });
      dataStream.writeString(this.props.hash);
      dataStream.writeString(this.props.id);
      dataStream.writeUInteger(count);

      for (index = 0; index < count; ++index) {
        if (this.props.got[index]) {
          dataStream.writeUInteger(this.props.got[index]);
        } else {
          dataStream.writeUInteger(0);
        }
      }

      dataStream.writeString(this.props.os ? this.props.os : '');
      dataStream.writeString(this.props.browser ? this.props.browser :
        '');
      dataStream.writeString(this.props.device ? this.props.device : '');
      return bytes;
    };

    TrackerMessage.prototype.serializeLeave = function serializeLeave() {
      var dataStream;
      var bytes;

      bytes = new Uint8Array(this.props.hash.length + 1 +
        this.props.id.length + 1);

      dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });
      dataStream.writeString(this.props.hash);
      dataStream.writeString(this.props.id);
      return bytes;
    };

    TrackerMessage.prototype.serializeSdp = function serializeSdp() {
      var dataStream;
      var bytes;

      bytes = new Uint8Array(this.props.id.length + 1 +
        this.props.hash.length + 1 + this.props.sdp.length + 1);

      dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });
      dataStream.writeString(this.props.id);
      dataStream.writeString(this.props.hash);
      dataStream.writeString(this.props.sdp);
      return bytes;
    };

    TrackerMessage.prototype.serializePoke = function serializePoke() {
      return this.serializeEnter();
    };

    TrackerMessage.prototype.serialize = function serialize() {
      var bytes;
      var result;

      if (!this.props.type || this.props.type < 0 ||
        this.props.type > TrackerMessage.Types.length) {
        throw new Error('Invalid message type');
      }

      result = this['serialize' + TrackerMessage.Types[this.props.type]
          .name]
        .bind(this)();
      bytes = new Uint8Array(result.length + 1);
      bytes.set(new Uint8Array([this.props.type]), 0);
      bytes.set(result, 1);

      return bytes;
    };

    TrackerMessage.prototype.unserializeHello =
      function unserializeHello() {};

    TrackerMessage.prototype.unserializeWelcome =
      function unserializeWelcome(dataStream) {
        this.props.id = dataStream.readString();
      };

    TrackerMessage.prototype.unserializeAnnounce =
      function unserializeAnnounce(dataStream) {
        var index;
        var count;

        this.props.hash = dataStream.readString();
        count = dataStream.readUInteger();
        this.props.got = [];

        for (index = 0; index < count; ++index) {
          this.props.got.push(dataStream.readUInteger());
        }
      };

    TrackerMessage.prototype.unserializeDenounce =
      function unserializeAnnounce(dataStream) {
        this.props.hash = dataStream.readString();
      };

    TrackerMessage.prototype.unserializeEnter =
      function unserializeEnter(dataStream) {
        var index;
        var count;

        this.props.hash = dataStream.readString();
        this.props.id = dataStream.readString();
        count = dataStream.readUInteger();
        this.props.got = [];

        for (index = 0; index < count; ++index) {
          this.props.got.push(dataStream.readUInteger());
        }

        this.props.os = dataStream.readString();
        this.props.browser = dataStream.readString();
        this.props.device = dataStream.readString();
      };

    TrackerMessage.prototype.unserializeLeave =
      function unserializeLeave(dataStream) {
        this.props.hash = dataStream.readString();
        this.props.id = dataStream.readString();
      };

    TrackerMessage.prototype.unserializeSdp =
      function unserializeLeave(dataStream) {
        this.props.id = dataStream.readString();
        this.props.hash = dataStream.readString();
        this.props.sdp = dataStream.readString();
      };

    TrackerMessage.prototype.unserializePoke =
      function unserializePoke(dataStream) {
        this.unserializeEnter(dataStream);
      };

    TrackerMessage.prototype.unserialize = function unserialize(bytes) {
      var dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });

      var byte = dataStream.readByte();
      if (!byte || byte < 0 || byte > TrackerMessage.Types.length) {
        throw new Error('Invalid message type');
      }

      this.props.type = byte;
      this['unserialize' + TrackerMessage.Types[this.props.type].name]
        .bind(this)(dataStream);
    };

    return TrackerMessage;
  })();

  /* eslint-disable */
  Peeracle.PeerMessage = (function() {
    /* eslint-enable */
    /**
     * @class PeerMessage
     * @memberof Peeracle
     * @constructor
     */
    function PeerMessage(parm) {
      this.props = {};
      if (typeof parm === 'object') {
        this.createFromObject(parm);
      }
    }

    PeerMessage.MessageType = {
      Ping: 0,
      Request: 1,
      Chunk: 2,
      Stop: 3
    };

    PeerMessage.Types = [{
      name: 'Ping'
    }, {
      name: 'Request'
    }, {
      name: 'Chunk'
    }, {
      name: 'Stop'
    }];

    PeerMessage.prototype.createFromObject =
      function createFromObject(obj) {
        var key;

        for (key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          this.props[key] = obj[key];
        }
      };

    PeerMessage.prototype.serializePing = function serializePing() {
      return new Uint8Array([]);
    };

    PeerMessage.prototype.serializeStop = function serializeStop() {
      return new Uint8Array([]);
    };

    PeerMessage.prototype.serializeRequest = function serializeRequest() {
      var bytes = new Uint8Array(this.props.hash.length + 1 + (2 * 4));
      var dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });

      dataStream.writeString(this.props.hash);
      dataStream.writeUInteger(this.props.segment);
      dataStream.writeUInteger(this.props.chunk);
      return bytes;
    };

    PeerMessage.prototype.serializeChunk = function serializeChunk() {
      var length;
      var bytes;
      var dataStream;

      length = this.props.hash.length + 1 + (4 * 4) + this.props.bytes.length;
      bytes = new Uint8Array(length);
      dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });

      dataStream.writeString(this.props.hash);
      dataStream.writeUInteger(this.props.segment);
      dataStream.writeUInteger(this.props.chunk);
      dataStream.writeUInteger(this.props.offset);
      dataStream.writeUInteger(this.props.bytes.length);
      dataStream.write(this.props.bytes);
      return bytes;
    };

    PeerMessage.prototype.serialize = function serialize() {
      var bytes;
      var result;

      if (this.props.type < 0 || this.props.type > PeerMessage.Types.length) {
        throw new Error('Invalid message type');
      }

      result = this['serialize' + PeerMessage.Types[this.props.type].name]
        .bind(this)();
      bytes = new Uint8Array(result.length + 1);
      bytes.set(new Uint8Array([this.props.type]), 0);
      bytes.set(result, 1);

      return bytes;
    };

    PeerMessage.prototype.unserializePing =
      function unserializePing() {};

    PeerMessage.prototype.unserializeStop =
      function unserializeStop() {};

    PeerMessage.prototype.unserializeRequest =
      function unserializeRequest(dataStream) {
        this.props.hash = dataStream.readString();
        this.props.segment = dataStream.readUInteger();
        this.props.chunk = dataStream.readUInteger();
      };

    PeerMessage.prototype.unserializeChunk =
      function unserializeChunk(dataStream) {
        var length;

        this.props.hash = dataStream.readString();
        this.props.segment = dataStream.readUInteger();
        this.props.chunk = dataStream.readUInteger();
        this.props.offset = dataStream.readUInteger();
        length = dataStream.readUInteger();
        this.props.bytes = dataStream.read(length);
      };

    PeerMessage.prototype.unserialize = function unserialize(bytes) {
      var dataStream = new Peeracle.MemoryDataStream({
        buffer: bytes
      });

      var byte = dataStream.readByte();
      if (byte < 0 || byte > PeerMessage.Types.length) {
        throw new Error('Invalid message type');
      }

      this.props.type = byte;
      this['unserialize' + PeerMessage.Types[this.props.type].name]
        .bind(this)(dataStream);
    };

    return PeerMessage;
  })();

  /* eslint-disable */
  Peeracle.PeerConnection = (function() {
    var RTCPeerConnection = window.RTCPeerConnection ||
      window.mozRTCPeerConnection || window.webkitRTCPeerConnection ||
      window.msRTCPeerConnection;

    var RTCSessionDescription = window.RTCSessionDescription ||
      window.mozRTCSessionDescription || window.webkitRTCSessionDescription ||
      window.msRTCSessionDescription;

    var RTCIceCandidate = window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate || window.RTCIceCandidate;
    /* eslint-enable */
    /**
     * @class PeerConnection
     * @memberof Peeracle
     * @mixes Peeracle.Listenable
     * @constructor
     * @param {Peeracle.Peer} peer
     * @property {Peeracle.Peer} peer
     * @property {RTCPeerConnection} pc
     * @property {RTCDataChannel} dataChannel
     * @property {Array.<RTCIceCandidate>} iceCandidates
     * @property {Number} state
     */
    function PeerConnection(peer) {
      Peeracle.Listenable.call(this);

      this.peer = peer;
      this.conn = null;
      this.dataChannel = null;
      this.iceCandidates = [];
      this.state = 0;
      this.mediaConstraints = {
        mandatory: {
          OfferToReceiveAudio: false,
          OfferToReceiveVideo: false
        }
      };
      this.cancelling = false;
    }

    PeerConnection.prototype = Object.create(Peeracle.Listenable.prototype);
    PeerConnection.prototype.constructor = PeerConnection;

    PeerConnection.STUN = {
      url: 'stun:stun.l.google.com:19302'
    };

    PeerConnection.RTCConfiguration = {
      iceServers: [{
        url: 'stun:stun.l.google.com:19302',
        urls: ['stun:stun.l.google.com:19302']
      }]
    };

    PeerConnection.State = {
      Disconnected: 0,
      Connecting: 1,
      Connected: 2
    };

    PeerConnection.prototype.init = function init() {
      console.log('PeerConnection::init');
      this.conn = new RTCPeerConnection(PeerConnection.RTCConfiguration,
        this.mediaConstraints);
      this.conn.onicecandidate = this.onIceCandidate.bind(this);
      this.conn.onsignalingstatechange = this.onSignaling.bind(this);
      this.conn.oniceconnectionstatechange = this.onIceConnection.bind(
        this);
      this.conn.onicegatheringstatechange = this.onIceGathering.bind(
        this);
      this.conn.ondatachannel = this.onDataChannel.bind(this);
    };

    PeerConnection.prototype.close = function close() {
      console.log('PeerConnection::close');
      if (this.dataChannel) {
        this.dataChannel.close();
        delete this.dataChannel;
      }

      if (this.conn) {
        this.conn.onicecandidate = null;
        this.conn.onsignalingstatechange = null;
        this.conn.oniceconnectionstatechange = null;
        this.conn.onicegatheringstatechange = null;
        this.conn.ondatachannel = null;
        this.conn.close();
        delete this.conn;
      }
    };

    /**
     * @function PeerConnection#createOffer
     * @param {Function} cb
     */
    PeerConnection.prototype.createOffer = function createOffer(cb) {
      var _this = this;

      console.log('PeerConnection::createOffer');
      this.state = PeerConnection.State.Connecting;

      if (!this.conn) {
        console.log('PeerConnection::createOffer !this.conn');
        this.init();
      }

      this.dataChannel = this.conn.createDataChannel('prcl');
      this.setupDataChannel();
      this.conn.createOffer(function createSuccess(offerSdp) {
        console.log('PeerConnection::createOffer createSuccess');
        _this.conn.setLocalDescription(offerSdp, function setSuccess() {
          console.log('PeerConnection::createOffer setSuccess');
          cb(null, JSON.stringify(offerSdp));
        }, function setFailure(e) {
          console.log('PeerConnection::createOffer setFailure');
          cb(e);
        }, _this.mediaConstraints);
      }, function createFailure(e) {
        console.log('PeerConnection::createOffer createFailure');
        cb(e);
      });
    };

    /**
     * @function PeerConnection#createAnswer
     * @param {String} sdp
     * @param {Function} cb
     */
    PeerConnection.prototype.createAnswer = function createAnswer(sdp, cb) {
      var _this = this;
      var sessionDescription;

      console.log('PeerConnection::createAnswer');
      this.state = PeerConnection.State.Connecting;

      if (!this.conn) {
        console.log('PeerConnection::createAnswer !this.conn');
        this.init();
      }

      try {
        console.log(
          'PeerConnection::createAnswer new RTCSessionDescription');
        sessionDescription = new RTCSessionDescription(JSON.parse(sdp));
      } catch (e) {
        console.log(
          'PeerConnection::createAnswer RTCSessionDescription Exception',
          e);
        cb(e);
      }

      this.conn.setRemoteDescription(sessionDescription, function successCb() {
        console.log('PeerConnection::createAnswer successCb');
        _this.conn.createAnswer(function createSuccess(answerSdp) {
          console.log(
            'PeerConnection::createAnswer createSuccess');
          _this.conn.setLocalDescription(answerSdp, function setSuccess() {
            console.log(
              'PeerConnection::createAnswer setSuccess');
            cb(null, JSON.stringify(answerSdp));
          }, function setFailure(e) {
            console.log(
              'PeerConnection::createAnswer setFailure 2'
            );
            cb(e);
          }, _this.mediaConstraints);
        }, function createFailure(e) {
          console.log(
            'PeerConnection::createAnswer createFailure');
          cb(e);
        });
      }, function setFailure(e) {
        console.log('PeerConnection::createAnswer setFailure 1');
        cb(e);
      });
    };

    /**
     * @function PeerConnection#setAnswer
     * @param {String} sdp
     * @param {Function} cb
     */
    PeerConnection.prototype.setAnswer = function setAnswer(sdp, cb) {
      var sessionDescription;

      this.state = PeerConnection.State.Connecting;

      if (!this.conn) {
        console.log('PeerConnection::setAnswer !this.conn');
        cb(new Error('Not initialized'));
        return;
      }

      try {
        console.log(
          'PeerConnection::setAnswer new RTCSessionDescription');
        sessionDescription = new RTCSessionDescription(JSON.parse(sdp));
      } catch (e) {
        console.log(
          'PeerConnection::setAnswer RTCSessionDescription Exception',
          e);
        cb(e);
      }

      this.conn.setRemoteDescription(sessionDescription, function successCb() {
        console.log(
          'PeerConnection::setAnswer setRemoteDescription successCb'
        );
        cb(null);
      }, function failureCb(e) {
        console.log(
          'PeerConnection::setAnswer setRemoteDescription failureCb',
          e);
        cb(e);
      });
    };

    /**
     * @function PeerConnect#send
     * @param {Peeracle.PeerMessage} msg
     */
    PeerConnection.prototype.send = function send(msg) {
      var bytes = msg.serialize();
      console.log('PeerConnection::send', bytes.length);
      this.dataChannel.send(bytes);
    };

    PeerConnection.prototype.onIceCandidate = function onIceCandidate(sdp) {
      var candidate;

      console.log('PeerConnection::onIceCandidate', sdp);
      if (!sdp.candidate) {
        console.log('PeerConnection::onIceCandidate !sdp.candidate');
        candidate = null;
      } else {
        console.log('PeerConnection::onIceCandidate sdp.candidate');
        candidate = JSON.stringify(sdp.candidate);
      }

      this.emit('icecandidate', candidate);
    };

    PeerConnection.prototype.onSignaling = function onSignaling() {
      console.log('PeerConnection::onSignaling');
    };

    PeerConnection.prototype.onIceConnection = function onIceConnection() {
      console.log('PeerConnection::onIceConnection');
      if (!this.conn) {
        console.log('PeerConnection::onIceConnection !this.conn');
        return;
      }

      if ((this.conn.iceConnectionState === 'disconnected' ||
          this.conn.iceConnectionState === 'closed') &&
        this.state !== PeerConnection.State.Disconnected) {
        console.log(
          'PeerConnection::onIceConnection iceConnectionState === disconnected'
        );
        this.state = PeerConnection.State.Disconnected;
        this.close();
        this.emit('disconnect');
      }
    };

    PeerConnection.prototype.onIceGathering = function onIceGathering() {
      console.log('PeerConnection::onIceGathering');
    };

    PeerConnection.prototype.onDataChannel = function onDataChannel(e) {
      console.log('PeerConnection::onDataChannel', e);
      if (e.channel.label !== 'prcl') {
        console.log(
          'PeerConnection::onDataChannel e.channel.label !== prcl');
        return;
      }

      this.dataChannel = e.channel;
      this.setupDataChannel();
    };

    PeerConnection.prototype.addICECandidate =
      function addICECandidate(sdp, cb) {
        console.log('PeerConnection::addICECandidate');
        this.conn.addIceCandidate(new RTCIceCandidate(JSON.parse(sdp)),
          function successCb() {
            console.log('PeerConnection::addICECandidate successCb');
            cb(true);
          },
          function failureCb() {
            console.log('PeerConnection::addICECandidate failureCb');
            cb(false);
          });
      };

    PeerConnection.prototype.setupDataChannel = function setupDataChannel() {
      console.log('PeerConnection::setupDataChannel');
      this.dataChannel.binaryType = 'arraybuffer';
      this.dataChannel.onerror = this.onDataChannelError.bind(this);
      this.dataChannel.onmessage = this.onDataChannelMessage.bind(this);
      this.dataChannel.onopen = this.onDataChannelOpen.bind(this);
      this.dataChannel.onclose = this.onDataChannelClose.bind(this);
    };

    PeerConnection.prototype.onDataChannelError =
      function onDataChannelError() {
        console.log('PeerConnection::onDataChannelError');
      };

    PeerConnection.prototype.onDataChannelMessage =
      function onDataChannelMessage(e) {
        var msg = new Peeracle.PeerMessage();
        var bytes = new Uint8Array(e.data);

        console.log('PeerConnection::onDataChannelMessage', bytes.length);
        if (!bytes || !bytes.length) {
          return;
        }

        msg.unserialize(bytes);
        this['handle' + Peeracle.PeerMessage.Types[msg.props.type].name]
          .bind(this)(msg);
      };

    PeerConnection.prototype.handlePing = function handlePing() {
      console.log('PeerConnection::handlePing');
      if (this.state === PeerConnection.State.Connecting) {
        this.state = PeerConnection.State.Connected;
        this.emit('connect');
      }
    };

    PeerConnection.prototype.handleStop = function handleStop() {
      console.log('PeerConnection::handleStop');
      this.cancelling = true;
    };

    PeerConnection.prototype.handleRequest = function handleRequest(msg) {
      console.log('PeerConnection::handleRequest');
      this.emit('request', msg.props.hash, msg.props.segment, msg.props
        .chunk);
    };

    PeerConnection.prototype.handleChunk = function handleChunk(msg) {
      console.log('PeerConnection::handleChunk');
      this.emit('chunk', msg.props.hash, msg.props.segment, msg.props.chunk,
        msg.props.offset, msg.props.bytes);
    };

    PeerConnection.prototype.onDataChannelOpen = function onDataChannelOpen() {
      var msg = new Peeracle.PeerMessage({
        type: Peeracle.PeerMessage.MessageType.Ping
      });

      console.log('PeerConnection::onDataChannelOpen');
      this.state = PeerConnection.State.Connecting;
      this.send(msg);
    };

    PeerConnection.prototype.onDataChannelClose = function onDataChannelClose() {
      console.log('PeerConnection::onDataChannelClose');
      if (this.state !== PeerConnection.State.Disconnected) {
        this.state = PeerConnection.State.Disconnected;
        this.emit('disconnect');
      }
    };

    return PeerConnection;
  })();

  /* eslint-disable */
  Peeracle.Peer = (function() {
    /* eslint-enable */
    /**
     * @class Peer
     * @memberof Peeracle
     * @mixes Peeracle.Listenable
     * @constructor
     * @param {String} id
     * @param {Peeracle.TrackerClient} tracker
     * @property {String} id
     * @property {Peeracle.TrackerClient} tracker
     * @property {Object.<String, Array.<Number>>} hashes
     * @property {Peeracle.PeerConnection} connection
     * @property {Request} request
     */
    function Peer(id, tracker) {
      Peeracle.Listenable.call(this);

      this.id = id;
      this.tracker = tracker;
      this.hashes = {};
      this.connection = null;
      this.request = null;
      this.sending = null;
    }

    Peer.prototype = Object.create(Peeracle.Listenable.prototype);
    Peer.prototype.constructor = Peer;

    /**
     * @function Peer#addHash
     * @param {String} hash
     * @param {Array.<Number>} got
     */
    Peer.prototype.addHash = function addHash(hash, got) {
      this.hashes[hash] = got;
    };

    Peer.prototype.removeHash = function removeHash(hash) {
      delete this.hashes[hash];
    };

    Peer.prototype.isConnected = function isConnected() {
      if (!this.connection) {
        return false;
      }

      return this.connection.state === Peeracle.PeerConnection.State.Connected;
    };

    Peer.prototype.isConnecting = function isConnecting() {
      if (!this.connection) {
        return false;
      }

      return this.connection.state === Peeracle.PeerConnection.State.Connecting;
    };

    Peer.prototype.close = function close() {
      if (!this.connection) {
        return;
      }

      this.connection.state = Peeracle.PeerConnection.State.Disconnected;
      this.connection.off('icecandidate');
      this.connection.off('request');
      this.connection.off('chunk');
      this.connection.off('disconnect');
      this.connection.close();
    };

    Peer.prototype.onIceCandidate = function onIceCandidate(hash, ice) {
      if (!this.isConnecting() || !ice) {
        this.connection.off('icecandidate');
        return;
      }

      this.tracker.sendSdp(this.id, hash, ice);
    };

    Peer.prototype.onChunk =
      function onChunk(hash, segment, chunk, offset, bytes) {
        this.emit('chunk', hash, segment, chunk, offset, bytes);
      };

    Peer.prototype.onRequest = function onRequest(hash, segment, chunk) {
      this.emit('request', hash, segment, chunk);
    };

    Peer.prototype.onDisconnect = function onDisconnect() {
      this.emit('disconnect');
    };

    Peer.prototype.setupConnection = function setupConnection(hash) {
      if (this.connection) {
        return;
      }

      this.connection = new Peeracle.PeerConnection(this);
      this.connection.on('icecandidate', this.onIceCandidate.bind(this,
        hash));
      this.connection.on('request', this.onRequest.bind(this));
      this.connection.on('chunk', this.onChunk.bind(this));
      this.connection.on('disconnect', this.onDisconnect.bind(this));
    };

    Peer.prototype.processSdp = function processSdp(sdp, hash) {
      var jsdp = JSON.parse(sdp);
      var _this = this;

      if (!this.connection) {
        this.setupConnection(hash);
      }

      if (jsdp.hasOwnProperty('type') && jsdp.type === 'offer') {
        this.connection.createAnswer(sdp, function onCreateAnswer(error,
          answer) {
          if (error) {
            return;
          }
          _this.tracker.sendSdp(_this.id, hash, answer);
        });
      } else if (jsdp.hasOwnProperty('type') && jsdp.type === 'answer') {
        this.connection.setAnswer(sdp, function onSetAnswer() {});
      } else if (jsdp.hasOwnProperty('candidate') &&
        jsdp.hasOwnProperty('sdpMid') && jsdp.hasOwnProperty(
          'sdpMLineIndex')) {
        this.connection.addICECandidate(sdp, function onAddICECandidate() {});
      }
    };

    Peer.prototype.sendStop = function sendStop() {
      var _this = this;
      var msg = new Peeracle.PeerMessage({
        type: Peeracle.PeerMessage.MessageType.Stop
      });

      if (!this.connection || !this.isConnected()) {
        return;
      }

      _this.connection.send(msg);
    };

    Peer.prototype.sendRequest = function sendRequest(hash, segment,
      chunk) {
      var _this = this;
      var msg = new Peeracle.PeerMessage({
        type: Peeracle.PeerMessage.MessageType.Request,
        hash: hash,
        segment: segment,
        chunk: chunk
      });

      if (!this.connection) {
        this.setupConnection(hash);
      }

      if (!this.isConnected() && !this.isConnecting()) {
        this.connection.once('connect', function onceConnect() {
          _this.connection.send(msg);
        });
        this.connection.createOffer(function onCreateOffer(error, sdp) {
          if (error) {
            return;
          }

          _this.tracker.sendSdp(_this.id, hash, sdp);
        });
      } else if (this.isConnected()) {
        _this.connection.send(msg);
      }
    };

    Peer.prototype.sendPoke = function sendPoke(hash, got) {
      this.tracker.sendPoke(this.id, hash, got);
    };

    Peer.prototype.sendChunk = function sendChunk(hash, index, chunk,
      bytes) {
      var _this = this;
      var offset = 0;
      var chunkSize = 16383 - ((hash.length + 1) + (4 * 4));
      var msg = new Peeracle.PeerMessage({
        type: Peeracle.PeerMessage.MessageType.Chunk,
        hash: hash,
        segment: index,
        chunk: chunk,
        offset: offset,
        bytes: null
      });

      if (this.sending) {
        console.log('already sending something to', this.id,
          ', clearing');
        window.clearInterval(this.sending);
      }

      this.sending = window.setInterval(function sendIt() {
        if (!_this.connection ||
          _this.connection.state !== Peeracle.PeerConnection.State.Connected
        ) {

          console.log('peer not connected', _this.connection ?
            _this.connection.state : undefined);
          window.clearInterval(_this.sending);
          _this.sending = null;
          return;
        }

        if (_this.connection.cancelling) {
          console.log('Stop requested');
          _this.connection.cancelling = false;
          window.clearInterval(_this.sending);
          _this.sending = null;
          return;
        }

        if (_this.connection.dataChannel.bufferedAmount > 0) {
          console.log('buffered amount, waiting');
          return;
        }

        msg.props.offset = offset;
        msg.props.bytes = bytes.subarray(msg.props.offset,
          msg.props.offset + chunkSize);
        offset += msg.props.bytes.length;
        _this.connection.send(msg);

        console.log('sending chunk now');
        _this.emit('sending', hash, index, chunk,
          msg.props.bytes.length, offset, bytes.length);

        if (offset >= bytes.length) {
          window.clearInterval(_this.sending);
          _this.sending = null;
          _this.emit('sent', hash, index, chunk, bytes.length);
          console.log('sent chunk');
        }
      }, 0);
    };

    return Peer;
  })();

  /* eslint-disable */
  Peeracle.TrackerClient = (function() {
    /* eslint-enable */
    /**
     * @class TrackerClient
     * @memberof Peeracle
     * @mixes Peeracle.Listenable
     * @constructor
     * @param {String} url
     */
    function TrackerClient(url) {
      Peeracle.Listenable.call(this);

      this.ws = null;
      this.url = url;
    }

    TrackerClient.prototype = Object.create(Peeracle.Listenable.prototype);
    TrackerClient.prototype.constructor = TrackerClient;

    TrackerClient.prototype.onOpen = function onOpen() {
      var msg = new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Hello
      });
      var bytes = msg.serialize();
      this.ws.send(bytes);
    };

    TrackerClient.prototype.onMessage = function onMessage(e) {
      var msg = new Peeracle.TrackerMessage();
      var bytes = new Uint8Array(e.data);

      if (!bytes || !bytes.length) {
        return;
      }

      msg.unserialize(bytes);
      this['handle' + Peeracle.TrackerMessage.Types[msg.props.type].name]
        .bind(this)(msg);
    };

    TrackerClient.prototype.onError = function onError() {};

    TrackerClient.prototype.onClose = function onClose(e) {
      this.emit('disconnect', e.code, e.reason);
    };

    TrackerClient.prototype.connect = function connect() {
      this.ws = new WebSocket(this.url, 'prcl-0.0.1');
      this.ws.binaryType = 'arraybuffer';
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onerror = this.onError.bind(this);
      this.ws.onclose = this.onClose.bind(this);
    };

    TrackerClient.prototype.announce = function announce(hash, got) {
      var msg = new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Announce,
        hash: hash,
        got: got
      });
      var bytes = msg.serialize();
      this.ws.send(bytes);
    };

    TrackerClient.prototype.denounce = function denounce(hash) {
      var msg = new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Denounce,
        hash: hash
      });
      var bytes = msg.serialize();
      this.ws.send(bytes);
    };

    TrackerClient.prototype.sendSdp = function sendSdp(id, hash, sdp) {
      var msg = new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Sdp,
        id: id,
        hash: hash,
        sdp: sdp
      });
      var bytes = msg.serialize();
      this.ws.send(bytes);
    };

    TrackerClient.prototype.sendPoke = function sendPoke(id, hash, got) {
      var msg = new Peeracle.TrackerMessage({
        type: Peeracle.TrackerMessage.MessageType.Poke,
        id: id,
        hash: hash,
        got: got
      });
      var bytes = msg.serialize();
      this.ws.send(bytes);
    };

    TrackerClient.prototype.sendRequest =
      function sendRequest(id, hash, segment, chunk) {
        var msg = new Peeracle.TrackerMessage({
          type: Peeracle.TrackerMessage.MessageType.Request,
          id: id,
          hash: hash,
          segment: segment,
          chunk: chunk
        });
        var bytes = msg.serialize();
        this.ws.send(bytes);
      };

    TrackerClient.prototype.handleWelcome = function handleWelcome(msg) {
      this.emit('connect', msg.props.id);
    };

    TrackerClient.prototype.handleEnter = function handleEnter(msg) {
      this.emit('enter', msg.props.hash, msg.props.id, msg.props.got,
        msg.props.os, msg.props.browser, msg.props.device);
    };

    TrackerClient.prototype.handleLeave = function handleLeave(msg) {
      this.emit('leave', msg.props.hash, msg.props.id);
    };

    TrackerClient.prototype.handleSdp = function handleSdp(msg) {
      this.emit('sdp', msg.props.hash, msg.props.id, msg.props.sdp);
    };

    TrackerClient.prototype.handlePoke = function handlePoke(msg) {
      this.handleEnter(msg);
    };

    return TrackerClient;
  })();

  /* eslint-disable */
  Peeracle.Session = (function() {
    /* eslint-enable */
    /**
     * @class Session
     * @memberof Peeracle
     * @mixes Peeracle.Listenable
     * @constructor
     * @param {Peeracle.Storage} storage
     * @property {Object.<String, Peeracle.SessionHandle>} handles
     * @property {Peeracle.Storage} storage
     * @property {Object.<String, Peeracle.TrackerClient>} trackers
     * @property {Object.<String, Peeracle.Peer>} peers
     */
    function Session(storage) {
      Peeracle.Listenable.call(this);

      this.handles = {};
      this.storage = storage;
      this.trackers = {};
      this.peers = {};
    }

    Session.prototype = Object.create(Peeracle.Listenable.prototype);
    Session.prototype.constructor = Session;

    /**
     * @function Session#addMetadata
     * @param {Peeracle.Metadata} metadata
     * @param {Session~addMetadataCallback} cb
     */
    Session.prototype.addMetadata = function addMetadata(metadata, cb) {
      var _this = this;
      var got = [];
      var gotIndex = 0;
      var currentGot = 0;
      var stream = metadata.streams[0];
      var index = 0;
      var count = stream.mediaSegments.length;
      var segment;

      if (!count) {
        cb(null, null);
        return;
      }

      segment = stream.mediaSegments[index];
      this.storage.retrieveSegment(metadata.hash, index, 0, segment.length,
        function retrieveSegmentCb(error, bytes) {
          var handle;
          var checksum;
          var chunkIndex;
          var chunkCount = segment.chunks.length;

          if (error) {
            cb(error);
            return;
          }

          if (!bytes) {
            handle = new Peeracle.SessionHandle(_this, metadata, got);
            _this.handles[metadata.hash] = handle;
            cb(null, handle);
            return;
          }

          for (chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
            checksum = metadata.checksumAlgorithm.checksum(
              bytes.subarray(chunkIndex * stream.chunkSize, stream.chunkSize +
                (chunkIndex * stream.chunkSize)));
            if (checksum === segment.chunks[chunkIndex]) {
              currentGot += (1 << gotIndex);
            }

            if (++gotIndex === 32) {
              gotIndex = 0;
              got.push(currentGot);
              currentGot = 0;
            }
          }

          if (++index < count) {
            segment = stream.mediaSegments[index];
            _this.storage.retrieveSegment(metadata.hash, index, 0,
              segment.length,
              retrieveSegmentCb);
          } else {
            if (gotIndex < 32) {
              got.push(currentGot);
            }

            handle = new Peeracle.SessionHandle(_this, metadata, got);
            _this.handles[metadata.hash] = handle;
            cb(null, handle);
          }
        });
    };

    /**
     * @function Session#announce
     * @param {String} url
     * @param {String} hash
     * @param {Array.<Number>} got
     */
    Session.prototype.announce = function announce(url, hash, got) {
      var tracker;
      var lowerUrl = url.toLowerCase();

      if (!this.trackers.hasOwnProperty(lowerUrl)) {
        tracker = new Peeracle.TrackerClient(lowerUrl);
        this.setupTracker(tracker);
        this.trackers[lowerUrl] = tracker;
        tracker.once('connect', function onConnect() {
          tracker.announce(hash, got);
        });
        tracker.connect();
        return;
      }

      tracker = this.trackers[lowerUrl];
      tracker.announce(hash, got);
    };

    Session.prototype.denounce = function denounce(url, hash) {
      var tracker;
      var lowerUrl = url.toLowerCase();

      if (!this.trackers.hasOwnProperty(lowerUrl)) {
        return;
      }

      tracker = this.trackers[lowerUrl];
      tracker.denounce(hash);
    };

    Session.prototype.onPeerRequest =
      function onPeerRequest(hash, peer, segment, chunk) {
        this.handles[hash].emit('request', peer, segment, chunk);
      };

    Session.prototype.onPeerChunk =
      function onPeerChunk(hash, peer, segment, chunk, offset, bytes) {
        this.handles[hash].emit('chunk', peer, segment, chunk, offset,
          bytes);
      };

    Session.prototype.onPeerDisconnect =
      function onPeerDisconnect(peer) {
        var index;
        var hashes;
        var count;

        if (!this.peers.hasOwnProperty(peer.id)) {
          return;
        }

        hashes = Object.keys(this.peers[peer.id].hashes);
        count = hashes.length;

        peer.close();

        for (index = 0; index < count; ++index) {
          if (!this.handles.hasOwnProperty(hashes[index])) {
            continue;
          }

          this.handles[hashes[index]].emit('leave', peer);
        }

        delete this.peers[peer.id];
      };

    Session.prototype.initPeer = function initPeer(id, tracker) {
      var _this = this;

      var peer = new Peeracle.Peer(id, tracker);
      peer.on('request', function onRequest(hash, segment, chunk) {
        _this.onPeerRequest(hash, peer, segment, chunk);
      });
      peer.on('chunk', function onChunk(hash, segment, chunk, offset,
        bytes) {
        _this.onPeerChunk(hash, peer, segment, chunk, offset, bytes);
      });
      peer.on('disconnect', function onDisconnect() {
        _this.onPeerDisconnect(peer);
      });

      return peer;
    };

    /**
     * @function Session#setupTracker
     * @param {Peeracle.TrackerClient} tracker
     */
    Session.prototype.setupTracker = function setupTracker(tracker) {
      var _this = this;

      tracker.on('connect', function onConnect(id) {
        _this.emit('connect', tracker.url, id);
      });

      tracker.on('disconnect', function onDisconnect(code, reason) {
        _this.emit('disconnect', tracker.url, code, reason);
      });

      tracker.on('enter', function onEnter(hash, id, got, os, browser,
        device) {
        var peer;
        var isUpdating = false;

        if (!_this.handles.hasOwnProperty(hash)) {
          return;
        }

        if (!_this.peers.hasOwnProperty(id)) {
          _this.peers[id] = _this.initPeer(id, tracker);
          _this.peers[id].browser = browser;
          _this.peers[id].os = os;
          _this.peers[id].device = device;
        }

        peer = _this.peers[id];

        isUpdating = peer.hashes.hasOwnProperty(hash);
        peer.addHash(hash, got);

        if (!isUpdating) {
          _this.handles[hash].emit('enter', peer);
        }
      });

      tracker.on('leave', function onLeave(hash, id) {
        var peer;

        if (!_this.handles.hasOwnProperty(hash)) {
          return;
        }

        if (!_this.peers.hasOwnProperty(id)) {
          return;
        }

        peer = _this.peers[id];
        peer.removeHash(hash);

        _this.handles[hash].emit('leave', peer);
      });

      tracker.on('sdp', function onSdp(hash, id, sdp) {
        if (!_this.handles.hasOwnProperty(hash)) {
          return;
        }
        if (!_this.peers.hasOwnProperty(id)) {
          _this.peers[id] = _this.initPeer(id, tracker);
        }
        _this.peers[id].processSdp(sdp, hash);
      });
    };

    /**
     * @callback Session~addMetadataCallback
     * @param {Error} error
     * @param {Peeracle.SessionHandle} handle
     */

    return Session;
  })();

  /* eslint-disable */
  Peeracle.SessionHandle = (function() {
      /* eslint-enable */
      /**
       * @class SessionHandle
       * @memberof Peeracle
       * @mixes Peeracle.Listenable
       * @constructor
       * @param {Peeracle.Session} session
       * @param {Peeracle.Metadata} metadata
       * @param {Array.<Number>} got
       * @property {Array.<Number>} got
       * @property {Peeracle.Metadata} metadata
       * @property {Peeracle.Session} session
       * @property {Array.<Request>} requests
       * @property {Object.<String, Number>} done
       * @property {Boolean} processLock
       */
      function SessionHandle(session, metadata, got) {
        Peeracle.Listenable.call(this);

        this.got = got;
        this.metadata = metadata;
        this.session = session;
        this.requests = [];
        this.done = {};
        this.processLock = false;
      }

      SessionHandle.prototype = Object.create(Peeracle.Listenable.prototype);
      SessionHandle.prototype.constructor = SessionHandle;

      /**
       * @function SessionHandle#start
       */
      SessionHandle.prototype.start = function start() {
        this.on('enter', this.onEnter.bind(this));
        this.on('leave', this.onLeave.bind(this));
        this.on('request', this.onRequest.bind(this));
        this.on('chunk', this.onChunk.bind(this));
        this.announce();
      };

      SessionHandle.prototype.announce = function announce() {
        var index;
        var count;
        var metadata = this.metadata;

        count = metadata.trackerUrls.length;
        for (index = 0; index < count; ++index) {
          this.session.announce(metadata.trackerUrls[index], metadata.hash,
            this.got);
        }
      };

      /**
       * @function SessionHandle#stop
       */
      SessionHandle.prototype.stop = function stop() {
        var index;
        var count;
        var metadata = this.metadata;

        this.off('enter');
        this.off('leave');
        this.off('request');
        this.off('chunk');
        count = metadata.trackerUrls.length;
        for (index = 0; index < count; ++index) {
          this.session.denounce(metadata.trackerUrls[index], metadata.hash);
        }
      };

      /**
       * @function SessionHandle#validate
       * @param {SessionHandle~validateCallback} cb
       */
      SessionHandle.prototype.validate = function validate(cb) {
        cb(null);
      };

      SessionHandle.prototype.peerMightBeInterested =
        function peerMightBeInterested(peer) {
          var chunkIndex;
          var chunkCount;
          var myGot = this.got;
          var theirGot = peer.hashes[this.metadata.hash];
          var gotIndex = 0;
          var gotOffset = 0;
          var segments = this.metadata.streams[0].mediaSegments;
          var segmentIndex;
          var segmentCount = segments.length;

          for (segmentIndex = 0; segmentIndex < segmentCount; ++
            segmentIndex) {
            chunkCount = segments[segmentIndex].chunks.length;
            for (chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
              if ((myGot[gotIndex] & (1 << gotOffset)) && !(theirGot[
                  gotIndex] & (1 << gotOffset))) {
                return true;
              }
              if (++gotOffset >= 32) {
                ++gotIndex;
                if (!theirGot[gotIndex] && myGot[gotIndex]) {
                  return true;
                }
                gotOffset = 0;
              }
            }
          }

          return false;
        };

      SessionHandle.prototype.findGotIndex = function findGotIndex(segment,
        chunk) {
        var chunkIndex;
        var chunkCount;
        var gotIndex = 0;
        var gotOffset = 0;
        var segments = this.metadata.streams[0].mediaSegments;
        var segmentIndex;
        var segmentCount = segments.length;

        for (segmentIndex = 0; segmentIndex < segmentCount; ++
          segmentIndex) {
          chunkCount = segments[segmentIndex].chunks.length;
          for (chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
            if (segmentIndex === segment && chunkIndex === chunk) {
              return {
                index: gotIndex,
                offset: gotOffset
              };
            }
            if (++gotOffset >= 32) {
              ++gotIndex;
              gotOffset = 0;
            }
          }
        }
        return null;
      };

      SessionHandle.prototype.updateGot =
        function updateGot(got, segment, chunk, value) {
          var result = this.findGotIndex(segment, chunk);

          if (value) {
            got[result.index] |= (1 << result.offset);
          } else {
            got[result.index] &= ~(1 << result.offset);
          }
        };

      SessionHandle.prototype.checkGot =
        function checkGot(got, segment, chunk) {
          var result = this.findGotIndex(segment, chunk);
          return (got[result.index] & (1 << result.offset));
        };

      SessionHandle.prototype.requestTimeout =
        function requestTimeout(request) {
          console.log('peer', request.peer.id, 'timeout on', request.segment,
            request.chunk);
          request.peer.request = null;
          request.peer = null;
          window.clearTimeout(request.timeout);
          request.timeout = null;
          request.completed = 0;
          this.processRequests();
        };

      /**
       *
       * @param {Request} request
       * @returns {Peeracle.SessionHandle}
       */
      SessionHandle.prototype.processRequest = function processRequest(
        request) {
        var index;
        var peer;
        var ids = Object.keys(this.session.peers);
        var count = ids.length;

        for (index = 0; index < count; ++index) {
          peer = this.session.peers[ids[index]];
          if (!peer.hashes.hasOwnProperty(this.metadata.hash) || peer.request) {
            continue;
          }

          if (this.checkGot(peer.hashes[this.metadata.hash], request.segment,
              request.chunk)) {
            peer.sendRequest(this.metadata.hash, request.segment, request
              .chunk);
            peer.request = request;
            request.peer = peer;
            request.timeout = window.setTimeout(this.requestTimeout.bind(
              this,
              request), 1000);
            break;
          }
        }
      };

      SessionHandle.prototype.processRequests = function processRequests() {
        var index;
        var count;
        var request;

        if (this.processLock) {
          return;
        }

        this.processLock = true;
        count = this.requests.length;
        for (index = 0; index < count; ++index) {
          request = this.requests[index];

          if (request.completed === request.length || request.peer) {
            continue;
          }

          this.processRequest(request);
        }

        this.processLock = false;
      };

      SessionHandle.prototype.stopRequests = function stopRequests() {
        var index;
        var peer;
        var peers = [];
        var count = this.requests.length;

        for (index = 0; index < count; ++index) {
          peer = this.requests[index].peer;

          if (!peer) {
            continue;
          }

          if (peers.indexOf(peer) === -1) {
            peers.push(peer);
          }

          window.clearTimeout(this.requests[index].timeout);
          this.requests[index].timeout = null;
          this.requests[index].peer = null;
        }

        this.requests = [];
        count = peers.length;
        for (index = 0; index < count; ++index) {
          peer = peers[index];
          peer.request = null;
        }
      };

      SessionHandle.prototype.retrieveMediaSegment =
        function retriveMediaSegment(index, cb) {
          var _this = this;
          var stream = this.metadata.streams[0];
          var segment = stream.mediaSegments[index];

          this.session.storage.retrieveSegment(this.metadata.hash, index, 0,
            segment.length,
            function retrieveSegment(error, bytes) {
              var buffer;
              var chunkIndex;
              var count = segment.chunks.length;
              var length = stream.chunkSize;
              var offset = 0;

              if (!error && bytes) {
                cb(null, bytes);
                return;
              }

              buffer = new Uint8Array(segment.length);
              for (chunkIndex = 0; chunkIndex < count; ++chunkIndex) {
                if (chunkIndex + 1 === count) {
                  length = stream.chunkSize - ((stream.chunkSize * count) -
                    segment.length);
                }
                _this.requests.push({
                  segment: index,
                  chunk: chunkIndex,
                  buffer: buffer,
                  offset: offset,
                  length: length,
                  completed: 0,
                  peer: null,
                  timeout: null,
                  completeCb: cb
                });
                offset += length;
              }

              _this.processRequests();
            });
        };

      /**
       * @function SessionHandle#onEnter
       */
      SessionHandle.prototype.onEnter = function onEnter(peer) {
        this.processRequests();
        if (!peer.isConnected() && !peer.isConnecting() &&
          this.peerMightBeInterested(peer)) {
          peer.sendPoke(this.metadata.hash, this.got);
        }
      };

      SessionHandle.prototype.onLeave = function onLeave(peer) {
        var index;
        var count = this.requests.length;
        var request;

        for (index = 0; index < count; ++index) {
          request = this.requests[index];
          if (request.peer === peer) {
            window.clearTimeout(request.timeout);
            request.timeout = null;
            request.peer = null;
          }
        }

        this.processRequests();
      };

      SessionHandle.prototype.onRequest = function onRequest(peer, index,
        chunk) {
        var _this = this;
        var stream = this.metadata.streams[0];
        var segment = stream.mediaSegments[index];
        var chunkSize = stream.chunkSize;

        if (chunk + 1 === segment.chunks.length) {
          chunkSize -= ((stream.chunkSize * segment.chunks.length) -
            segment.length);
        }

        this.session.storage.retrieveSegment(this.metadata.hash, index,
          chunk * stream.chunkSize, chunkSize,
          function retrieveSegment(error, bytes) {
            if (error || !bytes) {
              return;
            }

            console.log('sending chunk', index, chunk, bytes.length);
            peer.sendChunk(_this.metadata.hash, index, chunk, bytes);
          });
      };

      SessionHandle.prototype.completeRequest =
        function completeRequest(request) {
          var _this = this;
          var received;
          var peer = request.peer;
          var segment = this.metadata.streams[0].mediaSegments[request.segment];

          received = this.metadata.checksumAlgorithm.checksum(
            request.buffer.subarray(request.offset, request.offset +
              request.length));
          if (segment.chunks[request.chunk] !== received) {
            console.log(peer.id, 'invalid checksum');
            request.completed = 0;
            peer.request = null;
            request.peer = null;
            window.clearTimeout(request.timeout);
            request.timeout = null;
            return false;
          }

          if (!this.done.hasOwnProperty('' + request.segment)) {
            this.done['' + request.segment] = [];
          }
          this.done['' + request.segment].push(request);
          this.emit('received', peer, request.segment, request.chunk,
            request.offset, request.length);
          this.updateGot(_this.got, request.segment, request.chunk, 1);
          if (this.done['' + request.segment].length ===
            segment.chunks.length) {
            console.log('segment complete', request.segment);
            this.session.storage.storeSegment(this.metadata.hash,
              request.segment, 0, request.buffer,
              function storeCb(err) {
                if (err) {
                  return;
                }

                _this.announce();
              });
            request.completeCb(null, request.buffer);
            delete this.done['' + request.segment];
          }
          peer.request = null;
          request.peer = null;
          window.clearTimeout(request.timeout);
          request.timeout = null;
          return true;
        };

      SessionHandle.prototype.onChunk =
        function onChunk(peer, segmentIndex, chunk, offset, bytes) {
          var index;
          var count = this.requests.length;
          var completed = [];
          var request;

          for (index = 0; index < count; ++index) {
            request = this.requests[index];
            if (request.segment !== segmentIndex || request.chunk !== chunk ||
              request.peer !== peer) {
              continue;
            }

            window.clearTimeout(request.timeout);
            request.timeout = window.setTimeout(this.requestTimeout.bind(
              this,
              request), 1000);

            request.completed += bytes.length;
            request.buffer.set(bytes, request.offset + offset);

            if (request.completed < request.length) {
              this.emit('receiving', peer, request.segment, request.chunk,
                bytes.length, request.completed, request.length);
              break;
            }

            console.log('received', peer.id, request.segment, request.chunk);

            if (this.completeRequest(request)) {
              completed.push(index);
            }
            break;
          }

          count = completed.length;
          for (index = 0; index < count; ++index) {
            this.requests.splice(completed[index], 1);
          }

          this.processRequests();
        };

      /**
       * @callback SessionHandle~validateCallback
       * @param {Error} error
       */

      /**
       * @typedef {Object} Request
       * @property {Number} segment
       * @property {Number} chunk
       * @property {Uint8Array} buffer
       * @property {Number} offset
       * @property {Number} length
       * @property {Number} completed
       * @property {Peeracle.Peer} peer
       * @property {Number} timeout
       * @property {Function} completeCb
       */

      return SessionHandle;
    })
    ();

  window.Peeracle = Peeracle;
})();
