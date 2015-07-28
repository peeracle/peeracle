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
  var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection || window.msRTCPeerConnection;
  var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
    window.webkitRTCSessionDescription || window.msRTCSessionDescription;
  var RTCIceCandidate = window.mozRTCIceCandidate || window.webkitRTCIceCandidate ||
    window.RTCIceCandidate;

  var Peeracle = {};

  Peeracle.MemoryDataStream = (function() {
    var previousMemoryDataStream = Peeracle.MemoryDataStream;

    function MemoryDataStream(options) {
      this.options = options || {};
    }

    MemoryDataStream.noConflict = function noConflict() {
      Peeracle.MemoryDataStream = previousMemoryDataStream;
      return MemoryDataStream;
    };

    return MemoryDataStream;
  })();

  window.Peeracle = Peeracle;
})();
