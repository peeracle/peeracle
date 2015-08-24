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
Peeracle.Storage = (function() {
  /**
   * @interface Peeracle.Storage
   * @memberof {Peeracle}
   */
  function Storage() {
  }

  /**
   * @function Storage#retrieveSegment
   * @param {String} hash
   * @param {Number} segment
   * @param {Number} offset
   * @param {Number} length
   * @param {Storage~retrieveCallback} cb
   */
  Storage.prototype.retrieveSegment =
    function retrieveSegment(hash, segment, offset, length, cb) {
    };

  /**
   * @function Storage#storeSegment
   * @param {String} hash
   * @param {Number} segment
   * @param {Number} offset
   * @param {Uint8Array} bytes
   * @param {Storage~storeCallback} cb
   */
  Storage.prototype.storeSegment =
    function storeSegment(hash, segment, offset, bytes, cb) {
    };

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

// @exclude
module.exports = Peeracle.Storage;
// @endexclude
