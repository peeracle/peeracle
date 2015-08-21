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
  Hash: require('./hash')
};
var murmurHash3 = require('../third_party/murmurHash3.js/murmurHash3.js');
// @endexclude

/* eslint-disable */
Peeracle.Murmur3Hash = (function () {
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
          dataStream.writeByte(parseInt(value.substr(i * 2, 2), 16), writeCb);
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
    dataStream.read(16, function readByteCb(error, bytes) {
      var i;
      var str;

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
   * @param {Uint8Array} array
   */
  Murmur3Hash.prototype.update = function update(array) {
    var i;
    var l = array.length;

    for (i = 0; i < l; ++i) {
      this.string += String.fromCharCode(array[i]);
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

// @exclude
module.exports = Peeracle.Murmur3Hash;
// @endexclude
