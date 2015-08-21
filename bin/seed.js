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
var media;

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
  process.exit(1);
}

metadataFileName = program.args[0];
mediaFileName = program.media;

try {
  metadataFileStream = new Peeracle.FileDataStream({
    path: metadataFileName,
    mode: 'r'
  });
} catch (e) {
  console.log('Can\'t open the metadata file:', e.message);
  process.exit(1);
}

function start() {
  var session = new Peeracle.Session();
  var handle = session.addMetadata(metadata);
}

metadata = new Peeracle.Metadata();
metadata.unserialize(metadataFileStream, function unserializeCb(error) {
  if (mediaFileName) {
    try {
      mediaFileStream = new Peeracle.FileDataStream({
        path: mediaFileName
      });
    } catch (e) {
      console.log('Can\'t open the media file:', e.message);
      process.exit(1);
    }

    Peeracle.Media.loadFromDataStream(mediaFileStream,
      function loadFromDataStreamCb(error, instance) {
        if (error) {
          throw error;
        }

        metadata.validateMedia(media, function validateMediaCb(error) {
          if (error) {
            throw error;
          }

          start();
        });
      });
    return;
  }
  start();
});
