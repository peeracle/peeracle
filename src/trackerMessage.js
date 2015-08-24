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
Peeracle.TrackerMessage = (function () {
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
    Leave: 6
  };

  TrackerMessage.Types = [
    {name: 'KeepAlive'},
    {name: 'Hello'},
    {name: 'Welcome'},
    {name: 'Announce'},
    {name: 'Denounce'},
    {name: 'Enter'},
    {name: 'Leave'}
  ];

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
    var dataStream = new Peeracle.MemoryDataStream({buffer: bytes});

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
    dataStream = new Peeracle.MemoryDataStream({buffer: bytes});

    dataStream.writeString(this.props.hash);
    dataStream.writeUInteger(count);

    for (index = 0; index < count; ++index) {
      dataStream.writeUInteger(this.props.got[index]);
    }
    return bytes;
  };

  TrackerMessage.prototype.serializeDenounce = function serializeDenounce() {
    var dataStream;
    var bytes;

    bytes = new Uint8Array(this.props.hash.length + 1);
    dataStream = new Peeracle.MemoryDataStream({buffer: bytes});
    dataStream.writeString(this.props.hash);
    return bytes;
  };

  TrackerMessage.prototype.serializeEnter = function serializeEnter() {
    var dataStream;
    var bytes;
    var index;
    var count = this.props.got.length;

    bytes = new Uint8Array(this.props.hash.length + 1 +
      this.props.id.length + 1 +
      4 + (4 * count));

    dataStream = new Peeracle.MemoryDataStream({buffer: bytes});
    dataStream.writeString(this.props.hash);
    dataStream.writeString(this.props.id);
    dataStream.writeUInteger(count);

    for (index = 0; index < count; ++index) {
      dataStream.writeUInteger(this.props.got[index]);
    }
    return bytes;
  };

  TrackerMessage.prototype.serializeLeave = function serializeLeave() {
    var dataStream;
    var bytes;

    bytes = new Uint8Array(this.props.hash.length + 1 +
      this.props.id.length + 1);

    dataStream = new Peeracle.MemoryDataStream({buffer: bytes});
    dataStream.writeString(this.props.hash);
    dataStream.writeString(this.props.id);
    return bytes;
  };

  TrackerMessage.prototype.serialize = function serialize() {
    var bytes;
    var result;

    if (!this.props.type || this.props.type < 0 ||
      this.props.type > TrackerMessage.Types.length) {
      throw new Error('Invalid message type');
    }

    result = this['serialize' + TrackerMessage.Types[this.props.type].name]
      .bind(this)();
    bytes = new Uint8Array(result.length + 1);
    bytes.set(new Uint8Array([this.props.type]), 0);
    bytes.set(result, 1);

    return bytes;
  };

  TrackerMessage.prototype.unserializeHello =
    function unserializeHello(dataStream) {
    };

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
    };

  TrackerMessage.prototype.unserializeLeave =
    function unserializeLeave(dataStream) {
      this.props.hash = dataStream.readString();
      this.props.id = dataStream.readString();
    };

  TrackerMessage.prototype.unserialize = function unserialize(bytes) {
    var dataStream = new Peeracle.MemoryDataStream({buffer: bytes});

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

// @exclude
module.exports = Peeracle.TrackerMessage;
// @endexclude
