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
  MemoryDataStream: require('./memoryDataStream')
};
// @endexclude

/* eslint-disable */
Peeracle.PeerMessage = (function () {
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

  PeerMessage.Types = [
    {name: 'Ping'},
    {name: 'Request'},
    {name: 'Chunk'},
    {name: 'Stop'}
  ];

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
    var dataStream = new Peeracle.MemoryDataStream({buffer: bytes});

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
    dataStream = new Peeracle.MemoryDataStream({buffer: bytes});

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
    function unserializePing() {
    };

  PeerMessage.prototype.unserializeStop =
    function unserializeStop() {
    };

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
    var dataStream = new Peeracle.MemoryDataStream({buffer: bytes});

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

// @exclude
module.exports = Peeracle.PeerMessage;
// @endexclude
