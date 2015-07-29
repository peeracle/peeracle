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

describe('MemoryDataStream', function () {
  var buffer = new Uint8Array(32);
  var floatBuffer = new Uint8Array(32);

  beforeEach(function () {
    var dataView = new DataView(floatBuffer.buffer);

    for (var i = 0; i < 32; ++i) {
      buffer[i] = Math.floor(Math.random() * 256);
    }

    for (var i = 0; i < 32; i += 4) {
      dataView.setFloat32(i, (new Float32Array([Math.random() * (3.40282e+38)]))[0]);
    }
  });

  describe('construct', function () {
    var stream = new Peeracle.MemoryDataStream({buffer: buffer});

    it('should throw error on null argument', function () {
      expect(function () {
        var buf = null;
        var stream = new Peeracle.MemoryDataStream(buf);
      }).toThrowError('buffer should be an Uint8Array');
    });
    it('should throw an error on invalid argument', function () {
      expect(function () {
        var buf = null;
        new Peeracle.MemoryDataStream({});
      }).toThrowError('buffer should be an Uint8Array');
    });
    it('should be initialized', function () {
      expect(function () {
        var buf = new Uint8Array(1);
        new Peeracle.MemoryDataStream({buffer: buffer});
      }).not.toThrow();
    });
    it('should be an instance of DataStream', function () {
      expect(stream).toEqual(jasmine.any(Peeracle.DataStream));
    });
  });

  describe('length', function () {
    var stream = new Peeracle.MemoryDataStream({buffer: buffer});

    it('should be the same length of our buffer', function () {
      expect(stream.length()).toBe(buffer.length);
    });
  });

  describe('tell', function () {
    var stream = new Peeracle.MemoryDataStream({buffer: buffer});

    it('should be at the beginning on initialization', function () {
      expect(stream.tell()).toBe(0);
    });
  });

  describe('seek', function () {
    var stream = new Peeracle.MemoryDataStream({buffer: buffer});

    it('should throw an error when the value is invalid', function () {
      expect(function () {
        stream.seek({});
      }).toThrowError('argument must be a number');
    });
    it('should seek at the beginning', function () {
      expect(stream.seek(0)).toBe(0);
    });
    it('should seek at the end', function () {
      expect(stream.seek(32)).toBe(32);
    });
    it('should throw an error when the value is negative', function () {
      expect(function () {
        stream.seek(-1);
      }).toThrowError('index out of bounds');
    });
    it('should throw an error when the value is out of bounds', function () {
      expect(function () {
        stream.seek(33);
      }).toThrowError('index out of bounds');
    });
  });

  describe('read', function () {
    var stream = new Peeracle.MemoryDataStream({buffer: buffer});

    it('should have an offset equal to 0', function () {
      expect(stream.tell()).toEqual(0);
    });
    it('should read the first byte', function () {
      var bytes = stream.read(1);
      expect(bytes).toEqual(jasmine.any(Uint8Array));
      expect(bytes.length).toEqual(1);
      expect(bytes[0]).toEqual(buffer[0]);
    });
    it('should have an offset equal to 1', function () {
      expect(stream.tell()).toEqual(1);
    });
    it('should read the two next bytes', function () {
      var bytes = stream.read(2);
      expect(bytes).toEqual(jasmine.any(Uint8Array));
      expect(bytes.length).toEqual(2);
      expect(bytes[0]).toEqual(buffer[1]);
      expect(bytes[1]).toEqual(buffer[2]);
    });
    it('should have an offset equal to 3', function () {
      expect(stream.tell()).toEqual(3);
    });
    it('should read the four next bytes', function () {
      var bytes = stream.read(4);
      expect(bytes).toEqual(jasmine.any(Uint8Array));
      expect(bytes.length).toEqual(4);
      expect(bytes[0]).toEqual(buffer[3]);
      expect(bytes[1]).toEqual(buffer[4]);
      expect(bytes[2]).toEqual(buffer[5]);
      expect(bytes[3]).toEqual(buffer[6]);
    });
    it('should have an offset equal to 7', function () {
      expect(stream.tell()).toEqual(7);
    });
    it('should throw an error for reading too much', function () {
      expect(function () {
        var bytes = stream.read(buffer.length);
      }).toThrowError('index out of bounds');
    });
    it('should still have an offset equal to 7', function () {
      expect(stream.tell()).toEqual(7);
    });
  });

  describe('reading', function () {
    var readTab = {
      readChar: ['char', 1,
        Peeracle.MemoryDataStream.prototype.readChar,
        DataView.prototype.getInt8],
      readByte: ['byte', 1,
        Peeracle.MemoryDataStream.prototype.readByte,
        DataView.prototype.getUint8],
      readShort: ['short', 2,
        Peeracle.MemoryDataStream.prototype.readShort,
        DataView.prototype.getInt16],
      readUShort: ['unsigned short', 2,
        Peeracle.MemoryDataStream.prototype.readUShort,
        DataView.prototype.getUint16],
      readInteger: ['integer', 4,
        Peeracle.MemoryDataStream.prototype.readInteger,
        DataView.prototype.getInt32],
      readUInteger: ['unsigned integer', 4,
        Peeracle.MemoryDataStream.prototype.readUInteger,
        DataView.prototype.getUint32],
      readFloat: ['float', 4,
        Peeracle.MemoryDataStream.prototype.readFloat,
        DataView.prototype.getFloat32],
      readDouble: ['double', 8,
        Peeracle.MemoryDataStream.prototype.readDouble,
        DataView.prototype.getFloat64]
    };

    function defineReadTest(methodName, tab) {
      it('with ' + methodName,
        function () {
          var stream = new Peeracle.MemoryDataStream({buffer: buffer});
          var dataview = new DataView(buffer.buffer);

          expect(stream.tell()).toEqual(0);
          expect(tab[2].call(stream)).toEqual(tab[3].call(dataview, 0));

          expect(stream.tell()).toEqual(tab[1]);
          expect(tab[2].call(stream)).toEqual(tab[3].call(dataview, tab[1]));

          expect(stream.tell()).toEqual(tab[1] * 2);
          expect(stream.seek(32)).toEqual(32);

          expect(function () {
            tab[2].call(stream);
          }).toThrowError('index out of bounds');

          expect(stream.tell()).toEqual(32);
        });
    }

    for (var methodName in readTab) {
      if (!readTab.hasOwnProperty(methodName)) {
        continue;
      }

      defineReadTest(methodName, readTab[methodName]);
    }
  });

  describe('peeking', function () {
    var peekTab = {
      peekChar: ['char', 1,
        Peeracle.MemoryDataStream.prototype.peekChar,
        DataView.prototype.getInt8],
      peekByte: ['byte', 1,
        Peeracle.MemoryDataStream.prototype.peekByte,
        DataView.prototype.getUint8],
      peekShort: ['short', 2,
        Peeracle.MemoryDataStream.prototype.peekShort,
        DataView.prototype.getInt16],
      peekUShort: ['unsigned short', 2,
        Peeracle.MemoryDataStream.prototype.peekUShort,
        DataView.prototype.getUint16],
      peekInteger: ['integer', 4,
        Peeracle.MemoryDataStream.prototype.peekInteger,
        DataView.prototype.getInt32],
      peekUInteger: ['unsigned integer', 4,
        Peeracle.MemoryDataStream.prototype.peekUInteger,
        DataView.prototype.getUint32],
      peekFloat: ['float', 4,
        Peeracle.MemoryDataStream.prototype.peekFloat,
        DataView.prototype.getFloat32],
      peekDouble: ['double', 8,
        Peeracle.MemoryDataStream.prototype.peekDouble,
        DataView.prototype.getFloat64]
    };

    function definePeekTest(methodName, tab) {
      it('with ' + methodName,
        function () {
          var stream = new Peeracle.MemoryDataStream({buffer: buffer});
          var dataview = new DataView(buffer.buffer);

          expect(stream.tell()).toEqual(0);
          expect(tab[2].call(stream)).toEqual(tab[3].call(dataview, 0));

          expect(stream.tell()).toEqual(0);
          expect(stream.seek(tab[1])).toEqual(tab[1]);

          expect(stream.tell()).toEqual(tab[1]);
          expect(tab[2].call(stream)).toEqual(tab[3].call(dataview, tab[1]));

          expect(stream.tell()).toEqual(tab[1]);
          expect(stream.seek(32)).toEqual(32);

          expect(function () {
            tab[2].call(stream);
          }).toThrowError('index out of bounds');

          expect(stream.tell()).toEqual(32);
        });
    }

    for (var methodName in peekTab) {
      if (!peekTab.hasOwnProperty(methodName)) {
        continue;
      }

      definePeekTest(methodName, peekTab[methodName]);
    }
  });

  describe('writing', function () {
    var writeTab = {
      writeChar: ['char', 1,
        Peeracle.MemoryDataStream.prototype.writeChar,
        DataView.prototype.getInt8,
        Peeracle.MemoryDataStream.prototype.readChar],
      writeByte: ['byte', 1,
        Peeracle.MemoryDataStream.prototype.writeByte,
        DataView.prototype.getUint8,
        Peeracle.MemoryDataStream.prototype.readByte],
      writeShort: ['short', 2,
        Peeracle.MemoryDataStream.prototype.writeShort,
        DataView.prototype.getInt16,
        Peeracle.MemoryDataStream.prototype.readShort],
      writeUShort: ['unsigned short', 2,
        Peeracle.MemoryDataStream.prototype.writeUShort,
        DataView.prototype.getUint16,
        Peeracle.MemoryDataStream.prototype.readUShort],
      writeInteger: ['integer', 4,
        Peeracle.MemoryDataStream.prototype.writeInteger,
        DataView.prototype.getInt32,
        Peeracle.MemoryDataStream.prototype.readInteger],
      writeUInteger: ['unsigned integer', 4,
        Peeracle.MemoryDataStream.prototype.writeUInteger,
        DataView.prototype.getUint32,
        Peeracle.MemoryDataStream.prototype.readUInteger],
      writeFloat: ['float', 4,
        Peeracle.MemoryDataStream.prototype.writeFloat,
        DataView.prototype.getFloat32,
        Peeracle.MemoryDataStream.prototype.readFloat],
      writeDouble: ['double', 8,
        Peeracle.MemoryDataStream.prototype.writeDouble,
        DataView.prototype.getFloat64,
        Peeracle.MemoryDataStream.prototype.readDouble]
    };

    function defineWriteTest(methodName, tab) {
      it('with ' + methodName, function () {
        var stream = new Peeracle.MemoryDataStream({buffer: buffer});
        var dataview = new DataView(buffer.buffer);

        var size = tab[1];
        var streamWriteFunc = tab[2];
        var dvReadFunc = tab[3];
        var streamReadFunc = tab[4];

        expect(stream.tell()).toEqual(0);
        expect(streamWriteFunc.call(stream, dvReadFunc.call(dataview, 32 - size))).toEqual(size);

        expect(stream.tell()).toEqual(size);
        expect(stream.seek(0)).toEqual(0);
        expect(stream.tell()).toEqual(0);
        expect(streamReadFunc.call(stream)).toEqual(dvReadFunc.call(dataview, 32 - size));

        expect(stream.tell()).toEqual(size);
        expect(streamWriteFunc.call(stream, dvReadFunc.call(dataview, 32 - (size * 2)))).toEqual(size);

        expect(stream.seek(0)).toEqual(0);
        expect(stream.tell()).toEqual(0);
        expect(streamReadFunc.call(stream)).toEqual(dvReadFunc.call(dataview, 32 - size));
        expect(stream.tell()).toEqual(size);
        expect(streamReadFunc.call(stream)).toEqual(dvReadFunc.call(dataview, 32 - (size * 2)));
        expect(stream.tell()).toEqual(size * 2);

        expect(stream.seek(0)).toEqual(0);
        expect(stream.tell()).toEqual(0);
        expect(streamWriteFunc.call(stream, dvReadFunc.call(dataview, 32 - (size * 3)))).toEqual(size);
        expect(stream.tell()).toEqual(size);

        expect(stream.seek(32)).toEqual(32);
        expect(stream.tell()).toEqual(32);
        expect(function () {
          streamWriteFunc.call(stream, dvReadFunc.call(dataview, 0));
        }).toThrowError('index out of bounds');
      });
    }

    for (var methodName in writeTab) {
      if (!writeTab.hasOwnProperty(methodName)) {
        continue;
      }

      defineWriteTest(methodName, writeTab[methodName]);
    }
  });
});
