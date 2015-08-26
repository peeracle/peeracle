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

var Peeracle = require('..');
var program = require('commander');

var mediaFileName;
var mediaFileStream;

var metadataFileName;
var metadataFileStream;
var metadata;

program
  .version('0.0.1')
  .usage('[options] <metadataFile>')
  .option('-m, --media [file]', 'Original media file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  return;
}

metadataFileName = program.args[0];
mediaFileName = program.media;

try {
  metadataFileStream = new Peeracle.FileDataStream({
    path: metadataFileName,
    mode: 'r'
  });
} catch (e) {
  throw new Error('Can\'t open the metadata file:', e.message);
}

function start(metadata, media) {
  var storage = new Peeracle.MediaStorage(metadata, media);
  var session = new Peeracle.Session(storage);

  session.on('connect', function onConnectCb(tracker, id) {
    console.log('[Session] Connected to tracker', tracker, 'with id', id);
  });

  session.on('disconnect', function onDisconnectCb(tracker, code, reason) {
    console.log('[Session] Disconnected from tracker', tracker, code, reason);
  });

  session.addMetadata(metadata, function addMetadataCb(error, handle) {
    var index = 0;
    var count = metadata.streams[0].mediaSegments.length;

    if (error) {
      throw error;
    }

    handle.on('enter', function onEnterCb(peer) {
      console.log('[Handle] Peer', peer.id, 'entered');
    });

    handle.on('leave', function onLeaveCb(id) {
      console.log('[Handle] Peer', id, 'left');
    });

    handle.on('request', function onRequestCb(id, segment) {
    });

    handle.on('send', function onSendCb(id, segment, bytesSent) {
    });

    handle.start();

    if (!media) {
      if (index < count) {
        handle.retrieveMediaSegment(index, function onComplete(error, bytes) {
          console.log('got segment', index, error, bytes ? bytes.length : 0);
          if (++index < count) {
            handle.retrieveMediaSegment(index, onComplete);
          } else {
            console.log('got every segments!');
          }
        });
      }
    }
  });
}

metadata = new Peeracle.Metadata();
metadata.unserialize(metadataFileStream, function unserializeCb(error) {
  if (error) {
    throw error;
  }

  if (mediaFileName) {
    try {
      mediaFileStream = new Peeracle.FileDataStream({
        path: mediaFileName
      });
    } catch (e) {
      throw new Error('Can\'t open the media file:', e.message);
    }

    Peeracle.Media.loadFromDataStream(mediaFileStream,
      function loadFromDataStreamCb(err, instance) {
        if (err) {
          throw err;
        }

        start(metadata, instance);
      });
    return;
  }
  start(metadata, null);
});
