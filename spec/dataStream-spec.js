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
/* eslint-disable */

'use strict';

if (typeof Peeracle === 'undefined') {
  var Peeracle = require('..');
}

var dataStreams = ['MemoryDataStream', 'FileDataStream', 'HttpDataStream'];

describe('DataStream', function () {
  for (var dataStream in dataStreams) {
    if (!dataStreams.hasOwnProperty(dataStream)) {
      continue;
    }

    executeDataStreamTest(dataStreams[dataStream]);
  }
});

function executeDataStreamTest(dataStreamName) {
  describe(dataStreamName + '\'s', function () {
    var dataStream;

    beforeEach(function () {
      if (dataStreamName === 'MemoryDataStream') {
        dataStream = new Peeracle[dataStreamName]({
          buffer: new Uint8Array(32)
        });
      }
    });

    describe('constructor', function () {
      if (dataStreamName === 'MemoryDataStream') {
        it('should try to be called without arguments and throw an error',
          function () {
            var createWithEmptyArguments = function () {
              new Peeracle.MemoryDataStream();
            };

            expect(createWithEmptyArguments).toThrow(jasmine.any(TypeError));
          });

        it('should try to be called with an empty object and throw an error',
          function () {
            var createWithEmptyObject = function () {
              new Peeracle.MemoryDataStream();
            };

            expect(createWithEmptyObject).toThrow(jasmine.any(TypeError));
          });

        it('should be called successfully with a valid buffer',
          function () {
            var dataStream;
            expect(function () {
              dataStream = new Peeracle.MemoryDataStream({
                buffer: new Uint8Array(1)
              });
            }).not.toThrow();

            expect(dataStream).not.toBeNull();
            expect(dataStream).toEqual(jasmine.any(Peeracle.DataStream));
            expect(dataStream).toEqual(jasmine.any(Peeracle.MemoryDataStream));
          });
      }
    });
    describe('length', function () {
    });
    describe('tell', function () {
    });
    describe('seek', function () {
    });
    describe('read', function () {
    });
    describe('peek', function () {
    });
    describe('write', function () {
    });
  });
}
