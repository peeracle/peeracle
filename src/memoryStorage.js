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
  Storage: require('./storage')
};
// @endexclude

/* eslint-disable */
Peeracle.MemoryStorage = (function () {
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

// @exclude
module.exports = Peeracle.MemoryStorage;
// @endexclude
